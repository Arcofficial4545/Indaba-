import { ARTICLE_SEEDS } from "@/lib/content/articles";
import { CATALOGUE, type CatalogueEntry } from "@/lib/content/catalogue";
import { PRICING, resolvePrice } from "@/lib/content/pricing";
import type {
  Article,
  Category,
  Comparison,
  SoftwareWithCategory,
  StarDistribution,
} from "@/lib/types";

/**
 * The data the site renders from before Supabase is connected.
 *
 * This is not placeholder content any more. It is assembled from the same
 * three modules the seed script uses: the catalogue, the researched pricing
 * and the article set. What you see locally is what lands in the database,
 * which means the design gets reviewed against real content and a pricing
 * error shows up here rather than after launch.
 */

const NOW = "2026-08-18T00:00:00.000Z";

/* -------------------------------------------------------------------------- */
/* Categories                                                                 */
/* -------------------------------------------------------------------------- */

type CategorySeed = Omit<Category, "software_count" | "created_at">;

const CATEGORY_SEEDS: CategorySeed[] = [
  {
    id: "cat-accounting",
    name: "Accounting Software",
    slug: "accounting-software",
    icon: "calculator",
    description:
      "Ledgers, invoicing, VAT201 returns and SARS eFiling for South African businesses.",
    display_order: 1,
  },
  {
    id: "cat-payroll",
    name: "Payroll Software",
    slug: "payroll-software",
    icon: "wallet",
    description:
      "EMP201 submissions, IRP5 certificates, UIF declarations and ACB payment files.",
    display_order: 2,
  },
  {
    id: "cat-hr",
    name: "HR Software",
    slug: "hr-software",
    icon: "users",
    description:
      "Leave tracking against BCEA entitlements, performance reviews and employee records.",
    display_order: 3,
  },
  {
    id: "cat-crm",
    name: "CRM Software",
    slug: "crm-software",
    icon: "handshake",
    description:
      "Pipelines, quoting and customer records for sales teams selling into the local market.",
    display_order: 4,
  },
  {
    id: "cat-erp",
    name: "ERP Software",
    slug: "erp-software",
    icon: "boxes",
    description:
      "Integrated finance, stock and manufacturing for businesses that have outgrown a ledger.",
    display_order: 5,
  },
  {
    id: "cat-pm",
    name: "Project Management",
    slug: "project-management",
    icon: "kanban",
    description:
      "Task boards, timelines and resource planning for agencies, consultancies and internal teams.",
    display_order: 6,
  },
];

/** Counts are derived, never typed in, so they cannot go stale. */
export const FALLBACK_CATEGORIES: Category[] = CATEGORY_SEEDS.map((seed) => ({
  ...seed,
  software_count: CATALOGUE.filter((entry) => entry.categorySlug === seed.slug)
    .length,
  created_at: NOW,
}));

const CATEGORY_BY_SLUG = new Map(
  FALLBACK_CATEGORIES.map((category) => [category.slug, category]),
);

/* -------------------------------------------------------------------------- */
/* Software                                                                   */
/* -------------------------------------------------------------------------- */

function buildSoftware(entry: CatalogueEntry): SoftwareWithCategory {
  const category = CATEGORY_BY_SLUG.get(entry.categorySlug) ?? null;
  const price = resolvePrice(entry.slug);
  const record = PRICING[entry.slug];

  return {
    id: `sw-${entry.slug}`,
    name: entry.name,
    slug: entry.slug,
    tagline: entry.tagline,
    description_short: entry.descriptionShort,
    description_full: entry.descriptionFull,
    logo_url: null,
    screenshots: [],
    category_id: category?.id ?? null,

    starting_price: price?.zar ?? null,
    price_currency: "ZAR",
    billing_period: record?.period ?? "month",
    vat_inclusive: price?.vatInclusive ?? null,
    price_source_url: price?.sourceUrl ?? null,
    price_verified_at: price?.checkedAt ?? null,
    free_trial: Boolean(record?.freeTrialDays),
    free_trial_days: record?.freeTrialDays ?? null,
    free_version: record?.freeVersion ?? false,
    pricing_plans:
      record?.plans?.map((plan) => ({
        name: plan.name,
        price:
          plan.amount === null
            ? null
            : plan.currency === "ZAR"
              ? plan.amount
              : Math.round(
                  plan.amount *
                    (plan.currency === "USD"
                      ? 16.1767
                      : plan.currency === "GBP"
                        ? 21.9342
                        : 18.7536),
                ),
        period: plan.period,
        currency: "ZAR",
        vat_inclusive: plan.vatInclusive,
        description: plan.note,
        features: [],
        highlighted: plan.highlighted,
        user_limit: null,
      })) ?? [],

    features: entry.features,
    top_features: entry.topFeatures,
    integrations: entry.integrations,
    brand_color: null,

    affiliate_url: entry.vendorWebsite,
    vendor_website: entry.vendorWebsite,
    vendor_name: entry.vendorName,
    founded_year: entry.foundedYear,
    support_types: entry.supportTypes,
    countries_available: entry.countries,
    languages: entry.languages,

    overall_rating: entry.rating,
    ease_of_use_rating: entry.ease,
    value_for_money_rating: entry.value,
    customer_service_rating: entry.service,
    functionality_rating: entry.functionality,
    review_count: entry.reviewCount,

    meta_title: null,
    meta_description: null,
    og_image_url: null,

    status: "published",
    featured: entry.featured,
    created_at: NOW,
    updated_at: NOW,

    category: category
      ? {
          id: category.id,
          name: category.name,
          slug: category.slug,
          icon: category.icon,
        }
      : null,
  };
}

export const FALLBACK_SOFTWARE: SoftwareWithCategory[] =
  CATALOGUE.map(buildSoftware);

const SOFTWARE_BY_SLUG = new Map(
  FALLBACK_SOFTWARE.map((software) => [software.slug, software]),
);

/* -------------------------------------------------------------------------- */
/* Alternatives and comparisons                                               */
/* -------------------------------------------------------------------------- */

/** Curated alternatives, resolved from slugs to ids. */
export const FALLBACK_ALTERNATIVES: {
  software_id: string;
  alternative_id: string;
  display_order: number;
}[] = CATALOGUE.flatMap((entry) =>
  entry.alternatives
    .map((slug, index) => {
      const alternative = SOFTWARE_BY_SLUG.get(slug);
      if (!alternative) return null;
      return {
        software_id: `sw-${entry.slug}`,
        alternative_id: alternative.id,
        display_order: index,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null),
);

/**
 * Head to head comparisons, generated from each product's first curated
 * alternative and then de duplicated, so a pair never appears twice in
 * opposite orders.
 */
function buildComparisons(): Comparison[] {
  const seen = new Set<string>();
  const comparisons: Comparison[] = [];

  for (const entry of CATALOGUE) {
    const first = entry.alternatives[0];
    if (!first) continue;

    const [a, b] = [entry.slug, first].sort((x, y) => x.localeCompare(y));
    const slug = `${a}-vs-${b}`;
    if (seen.has(slug)) continue;
    seen.add(slug);

    const left = SOFTWARE_BY_SLUG.get(a);
    const right = SOFTWARE_BY_SLUG.get(b);
    if (!left || !right) continue;

    comparisons.push({
      id: `cmp-${slug}`,
      software_a_id: left.id,
      software_b_id: right.id,
      slug,
      custom_verdict: null,
      meta_title: null,
      meta_description: null,
      status: "published",
      created_at: NOW,
    });
  }

  return comparisons;
}

export const FALLBACK_COMPARISONS: Comparison[] = buildComparisons();

/* -------------------------------------------------------------------------- */
/* Articles                                                                   */
/* -------------------------------------------------------------------------- */

export const FALLBACK_ARTICLES: Article[] = ARTICLE_SEEDS;

/* -------------------------------------------------------------------------- */
/* Derived helpers                                                            */
/* -------------------------------------------------------------------------- */

export const FALLBACK_REVIEW_TOTAL = FALLBACK_SOFTWARE.reduce(
  (sum, software) => sum + software.review_count,
  0,
);

/**
 * A plausible star spread derived from the overall rating, so the sentiment
 * strips differ per product instead of every card showing the same shape.
 * Real distributions come from the database once reviews are seeded.
 */
export function fallbackDistribution(
  rating: number,
  total: number,
): StarDistribution {
  const skew = Math.max(0, Math.min(1, (rating - 1) / 4));
  const weights = [
    (1 - skew) ** 3,
    (1 - skew) ** 2 * 0.8,
    (1 - skew) * skew * 1.6,
    skew ** 2 * 1.4,
    skew ** 3 * 2.2,
  ];
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  const counts = weights.map((w) => Math.round((w / sum) * total));
  // Push any rounding drift into the 5 star bucket so the total still matches.
  counts[4] += total - counts.reduce((a, b) => a + b, 0);
  return {
    1: counts[0],
    2: counts[1],
    3: counts[2],
    4: counts[3],
    5: counts[4],
  };
}
