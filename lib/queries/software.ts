import {
  FALLBACK_SOFTWARE,
  fallbackDistribution,
} from "@/lib/fallback-data";
import { rankByBayesian } from "@/lib/ranking";
import { createPublicClient } from "@/lib/supabase/public";
import type { SoftwareWithCategory, StarDistribution } from "@/lib/types";

const SOFTWARE_SELECT = `
  *,
  category:categories (id, name, slug, icon)
`;

async function fetchPublished(): Promise<SoftwareWithCategory[]> {
  const supabase = createPublicClient();
  if (!supabase) return FALLBACK_SOFTWARE;

  const { data, error } = await supabase
    .from("software")
    .select(SOFTWARE_SELECT)
    .eq("status", "published");

  if (error || !data || data.length === 0) return FALLBACK_SOFTWARE;
  return data as unknown as SoftwareWithCategory[];
}

export async function getAllSoftware(): Promise<SoftwareWithCategory[]> {
  return fetchPublished();
}

/**
 * Ranked by Bayesian weighted average rather than raw stars, so a product with
 * 400 reviews at 4.1 can outrank one with 30 reviews at 4.3.
 */
export async function getTopRatedSoftware(
  limit = 3,
): Promise<SoftwareWithCategory[]> {
  const all = await fetchPublished();
  return rankByBayesian(all).slice(0, limit);
}

export async function getFeaturedSoftware(
  limit = 6,
): Promise<SoftwareWithCategory[]> {
  const all = await fetchPublished();
  const featured = all.filter((s) => s.featured);
  const pool = featured.length >= limit ? featured : all;
  return rankByBayesian(pool).slice(0, limit);
}

/** Most recently updated, which is what "recently reviewed" means here. */
export async function getRecentlyReviewedSoftware(
  limit = 3,
): Promise<SoftwareWithCategory[]> {
  const all = await fetchPublished();
  return [...all]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    )
    .slice(0, limit);
}

export async function getSoftwareByCategory(
  categoryId: string,
  limit?: number,
): Promise<SoftwareWithCategory[]> {
  const all = await fetchPublished();
  const filtered = rankByBayesian(
    all.filter((s) => s.category_id === categoryId),
  );
  return limit ? filtered.slice(0, limit) : filtered;
}

export type DirectoryFilters = {
  /** Free text, matched against the product name and its tagline. */
  query?: string;
  category?: string;
  minRating?: number;
  freeTrial?: boolean;
  freeVersion?: boolean;
  paidOnly?: boolean;
  /**
   * Only products whose vendor publishes a list price.
   *
   * Added rather than reshaped: every existing caller omits it and behaves
   * exactly as before. It exists because 25 of the 39 products in the
   * catalogue publish nothing, which is the single most useful thing the
   * directory can filter on and the least likely thing a buyer expects.
   */
  hasPrice?: boolean;
  sort?: "reviewed" | "rated" | "updated" | "price";
  page?: number;
  perPage?: number;
};

/**
 * Counts over the whole filtered set, before pagination.
 *
 * The page leads with these as plain figures, so they have to describe every
 * matching product rather than the slice currently on screen. Computing them
 * here keeps that guarantee in one place: a caller cannot accidentally count
 * `items` and be quietly wrong on page two.
 */
export type DirectoryFacets = {
  total: number;
  withPrice: number;
  freeVersion: number;
  freeTrial: number;
};

export type DirectoryResult = {
  items: SoftwareWithCategory[];
  total: number;
  page: number;
  totalPages: number;
  facets: DirectoryFacets;
};

/**
 * The directory listing. Filtering runs in memory because the published
 * catalogue is a few dozen rows, so a round trip per filter combination would
 * cost more than it saves. Revisit if the catalogue passes a few hundred.
 */
export async function getDirectory(
  filters: DirectoryFilters = {},
): Promise<DirectoryResult> {
  const {
    query,
    category,
    minRating,
    freeTrial,
    freeVersion,
    paidOnly,
    hasPrice,
    sort = "reviewed",
    page = 1,
    perPage = 10,
  } = filters;

  const all = await fetchPublished();

  /*
    Name and tagline only, not the full description. A directory search that
    matches body copy returns half the catalogue for a word like "invoice",
    which is worse than returning nothing: the reader cannot tell whether the
    match meant anything. Both fields are short and are what a product is
    actually called and actually does.
  */
  const needle = query?.trim().toLowerCase();

  let items = all.filter((software) => {
    if (
      needle &&
      !software.name.toLowerCase().includes(needle) &&
      !(software.tagline ?? "").toLowerCase().includes(needle)
    ) {
      return false;
    }
    if (category && software.category?.slug !== category) return false;
    if (minRating && software.overall_rating < minRating) return false;
    if (freeTrial && !software.free_trial) return false;
    if (freeVersion && !software.free_version) return false;
    // "Paid only" means it has a real price and no free tier.
    if (paidOnly && (software.free_version || software.starting_price === 0)) {
      return false;
    }
    if (hasPrice && software.starting_price === null) return false;
    return true;
  });

  switch (sort) {
    case "rated":
      items = rankByBayesian(items);
      break;
    case "updated":
      items = [...items].sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );
      break;
    case "price":
      // Products without a published price sort last rather than as zero.
      items = [...items].sort((a, b) => {
        const left = a.starting_price ?? Number.POSITIVE_INFINITY;
        const right = b.starting_price ?? Number.POSITIVE_INFINITY;
        return left - right;
      });
      break;
    default:
      items = [...items].sort((a, b) => b.review_count - a.review_count);
  }

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * perPage;

  return {
    items: items.slice(start, start + perPage),
    total,
    page: current,
    totalPages,
    facets: {
      total,
      withPrice: items.filter((s) => s.starting_price !== null).length,
      freeVersion: items.filter((s) => s.free_version).length,
      freeTrial: items.filter((s) => s.free_trial).length,
    },
  };
}

/** Curated alternatives, falling back to category peers when none are set. */
export async function getAlternatives(
  software: SoftwareWithCategory,
  limit = 3,
): Promise<SoftwareWithCategory[]> {
  const supabase = createPublicClient();
  const all = await fetchPublished();

  if (supabase) {
    const { data } = await supabase
      .from("software_alternatives")
      .select("alternative_id, display_order")
      .eq("software_id", software.id)
      .order("display_order", { ascending: true });

    if (data && data.length > 0) {
      const byId = new Map(all.map((s) => [s.id, s]));
      const curated = (data as { alternative_id: string }[])
        .map((row) => byId.get(row.alternative_id))
        .filter((s): s is SoftwareWithCategory => Boolean(s));
      if (curated.length > 0) return curated.slice(0, limit);
    }
  }

  // Category peers, best rated first, excluding the product itself.
  return rankByBayesian(
    all.filter(
      (s) => s.id !== software.id && s.category_id === software.category_id,
    ),
  ).slice(0, limit);
}

export async function getSoftwareBySlug(
  slug: string,
): Promise<SoftwareWithCategory | null> {
  const supabase = createPublicClient();
  if (!supabase) {
    return FALLBACK_SOFTWARE.find((s) => s.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("software")
    .select(SOFTWARE_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    return FALLBACK_SOFTWARE.find((s) => s.slug === slug) ?? null;
  }
  return data as unknown as SoftwareWithCategory;
}

/**
 * Star distributions for a set of products, so the sentiment strips on cards
 * are real data rather than a decorative bar.
 */
export async function getStarDistributions(
  softwareIds: string[],
): Promise<Record<string, StarDistribution>> {
  const supabase = createPublicClient();

  // `sw-` ids are the fallback catalogue, served while the database is
  // connected but not seeded. Their reviews are not in the database either.
  if (!supabase || softwareIds.every((id) => id.startsWith("sw-"))) {
    const result: Record<string, StarDistribution> = {};
    for (const id of softwareIds) {
      const software = FALLBACK_SOFTWARE.find((s) => s.id === id);
      if (software) {
        result[id] = fallbackDistribution(
          software.overall_rating,
          software.review_count,
        );
      }
    }
    return result;
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("software_id, overall_rating")
    .in("software_id", softwareIds)
    .eq("status", "published");

  if (error || !data) return {};

  const result: Record<string, StarDistribution> = {};
  for (const row of data as { software_id: string; overall_rating: number }[]) {
    if (!result[row.software_id]) {
      result[row.software_id] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    }
    const star = Math.round(row.overall_rating) as 1 | 2 | 3 | 4 | 5;
    if (star >= 1 && star <= 5) result[row.software_id][star] += 1;
  }
  return result;
}

/**
 * The home page showcase: the products a buyer should look at first.
 *
 * Appended, not a reshape — nothing that already calls into this module
 * changes shape.
 *
 * Order is the site's normal Bayesian ranking and nothing else. There is no
 * pinning and no chip, because the section heading — "Browse software by price
 * and rating" — is a claim about the order, and a promoted row inside it would
 * make that claim false whether or not it carried a label.
 *
 * Editorial prominence lives in the recommendations section instead, which
 * says on its face that it is a selection rather than a ranking. That is the
 * honest place to put it: the label belongs to the section, so the cards need
 * none.
 */
export async function getSoftwareShowcase(
  limit = 20,
): Promise<SoftwareWithCategory[]> {
  const all = await fetchPublished();
  return rankByBayesian(all).slice(0, limit);
}
