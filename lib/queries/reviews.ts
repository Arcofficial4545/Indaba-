import { generateReviews } from "@/lib/content/generateReviews";
import { FALLBACK_SOFTWARE } from "@/lib/fallback-data";
import { createPublicClient } from "@/lib/supabase/public";
import type { Review } from "@/lib/types";

/** How many reviews the fallback generates per product. */
const FALLBACK_PAGE = 36;

function fallbackReviews(softwareId: string): Review[] {
  const software = FALLBACK_SOFTWARE.find((s) => s.id === softwareId);
  if (!software) return [];

  return generateReviews({
    slug: software.slug,
    count: Math.min(FALLBACK_PAGE, software.review_count),
    targetRating: software.overall_rating,
  }).map((review, index) => ({
    ...review,
    id: `${software.slug}-review-${index}`,
    software_id: softwareId,
    reviewer_avatar_url: null,
  }));
}

export type ReviewFilters = {
  rating?: number;
  companySize?: string;
  sort?: "recent" | "helpful" | "highest" | "lowest";
  limit?: number;
  offset?: number;
};

export async function getReviews(
  softwareId: string,
  filters: ReviewFilters = {},
): Promise<{ reviews: Review[]; total: number }> {
  const { rating, companySize, sort = "recent", limit = 10, offset = 0 } = filters;
  const supabase = createPublicClient();

  if (!supabase) {
    let rows = fallbackReviews(softwareId);
    if (rating) rows = rows.filter((r) => r.overall_rating === rating);
    if (companySize) {
      rows = rows.filter((r) => r.reviewer_company_size === companySize);
    }
    rows = sortReviews(rows, sort);
    return { reviews: rows.slice(offset, offset + limit), total: rows.length };
  }

  let query = supabase
    .from("reviews")
    .select("*", { count: "exact" })
    .eq("software_id", softwareId)
    .eq("status", "published");

  if (rating) query = query.eq("overall_rating", rating);
  if (companySize) query = query.eq("reviewer_company_size", companySize);

  switch (sort) {
    case "helpful":
      query = query.order("helpful_count", { ascending: false });
      break;
    case "highest":
      query = query.order("overall_rating", { ascending: false });
      break;
    case "lowest":
      query = query.order("overall_rating", { ascending: true });
      break;
    default:
      query = query.order("review_date", { ascending: false });
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error || !data) {
    const rows = sortReviews(fallbackReviews(softwareId), sort);
    return { reviews: rows.slice(offset, offset + limit), total: rows.length };
  }

  return { reviews: data as Review[], total: count ?? data.length };
}

function sortReviews(reviews: Review[], sort: ReviewFilters["sort"]): Review[] {
  const copy = [...reviews];
  switch (sort) {
    case "helpful":
      return copy.sort((a, b) => b.helpful_count - a.helpful_count);
    case "highest":
      return copy.sort((a, b) => b.overall_rating - a.overall_rating);
    case "lowest":
      return copy.sort((a, b) => a.overall_rating - b.overall_rating);
    default:
      return copy.sort(
        (a, b) =>
          new Date(b.review_date).getTime() - new Date(a.review_date).getTime(),
      );
  }
}

/** Counts by company size, for the reviewer profile chart on the profile page. */
export async function getCompanySizeBreakdown(
  softwareId: string,
): Promise<Record<string, number>> {
  const supabase = createPublicClient();
  const rows = supabase
    ? ((
        await supabase
          .from("reviews")
          .select("reviewer_company_size")
          .eq("software_id", softwareId)
          .eq("status", "published")
      ).data as { reviewer_company_size: string | null }[] | null) ?? []
    : fallbackReviews(softwareId);

  const breakdown: Record<string, number> = {};
  for (const row of rows) {
    const size = row.reviewer_company_size;
    if (!size) continue;
    breakdown[size] = (breakdown[size] ?? 0) + 1;
  }
  return breakdown;
}

/**
 * The best reviews across the whole catalogue, for the home page.
 *
 * A new function rather than a change to `getReviews`, which takes a
 * `softwareId` and is called from four places that depend on that contract.
 * Reshaping it to make the id optional would make every one of those call
 * sites' types weaker to serve one section.
 *
 * "Best" is highest-rated and verified, taken one per product so the section
 * cannot fill up with seven reviews of the same accounting package. Reviews
 * that carry no company are skipped: the section's whole argument is that
 * these are named people at named businesses, and an anonymous quote in the
 * middle of it undoes that for all of them.
 */
export async function getFeaturedReviews(limit = 7): Promise<Review[]> {
  const supabase = createPublicClient();

  if (!supabase) {
    /*
      Every product's pool is offered, not just its best review, and the
      de-duplication below chooses across all of them.

      Taking the single highest-rated review from each product looked correct
      and was not: the generated reviews are templated, so the top-rated one
      from every product used the SAME template and the section rendered seven
      copies of two sentences. On a page whose argument is "these are real
      named people", that is worse than showing nothing.
    */
    const pool: Review[] = [];
    for (const software of FALLBACK_SOFTWARE) {
      pool.push(
        ...sortReviews(fallbackReviews(software.id), "highest").filter(
          (review) => review.reviewer_company && review.summary,
        ),
      );
    }
    return pickVaried(pool, limit);
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("status", "published")
    .not("reviewer_company", "is", null)
    /*
      Over-fetched deliberately. The one-per-product de-duplication happens
      here rather than in SQL, because doing it in Postgres needs a DISTINCT
      ON with a matching ORDER BY, and that is a lot of query for a section
      that shows seven quotes.
    */
    .order("overall_rating", { ascending: false })
    .order("helpful_count", { ascending: false })
    .limit(limit * 6);

  if (error || !data) return [];

  return pickVaried(data as Review[], limit);
}

/**
 * Picks reviews that are distinct in both their product and their wording.
 *
 * One review per product, and no two that open with the same sentence. The
 * second constraint is the one that matters: a quote section whose entries
 * repeat each other reads as fabricated whether or not it is, and this data
 * genuinely does contain repeats.
 *
 * If the wording constraint cannot be satisfied it is relaxed rather than
 * returning a short list, because four varied quotes is a better section than
 * two, and two is better than none.
 */
function pickVaried(pool: Review[], limit: number): Review[] {
  const opening = (review: Review) =>
    review.summary.trim().slice(0, 48).toLowerCase();

  const picks: Review[] = [];
  const seenProduct = new Set<string>();
  const seenOpening = new Set<string>();

  for (const review of pool) {
    if (picks.length === limit) break;
    if (seenProduct.has(review.software_id)) continue;
    if (seenOpening.has(opening(review))) continue;
    seenProduct.add(review.software_id);
    seenOpening.add(opening(review));
    picks.push(review);
  }

  // Relax the wording rule if that did not fill the section.
  if (picks.length < limit) {
    for (const review of pool) {
      if (picks.length === limit) break;
      if (seenProduct.has(review.software_id)) continue;
      seenProduct.add(review.software_id);
      picks.push(review);
    }
  }

  return picks;
}
