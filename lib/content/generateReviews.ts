import {
  CITIES,
  COMPANY_PREFIXES,
  COMPANY_SIZES,
  COMPANY_SIZE_WEIGHTS,
  COMPANY_SUFFIXES,
  CONS_CRITICAL,
  CONS_MILD,
  DURATIONS,
  FIRST_NAMES,
  INDUSTRIES,
  JOB_TITLES,
  LAST_NAMES,
  PROS_MIXED,
  PROS_POSITIVE,
  SUMMARY_MIXED,
  SUMMARY_NEGATIVE,
  SUMMARY_POSITIVE,
  TITLE_MIXED,
  TITLE_NEGATIVE,
  TITLE_POSITIVE,
  VENDOR_RESPONSES,
} from "./corpus";

/**
 * Deterministic review generation.
 *
 * Hand writing six thousand reviews is not possible, so the generator is the
 * deliverable and the sentence banks are what make the output read as human.
 * It is seeded per product, so the same product always produces the same
 * reviews. That matters twice over: the fallback data stays stable between
 * renders, and re running the seed does not churn the database.
 *
 * The rating distribution is driven by the product's target average, so a
 * product that people genuinely dislike gets a believable tail of one and two
 * star reviews rather than a uniform wall of praise.
 */

/** mulberry32. Small, fast, and good enough for content generation. */
function makeRandom(seed: number) {
  let state = seed >>> 0;
  return function random() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

type Random = () => number;

function pick<T>(random: Random, items: readonly T[]): T {
  return items[Math.floor(random() * items.length)];
}

function pickWeighted<T>(
  random: Random,
  items: readonly T[],
  weights: readonly number[],
): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = random() * total;
  for (let i = 0; i < items.length; i += 1) {
    roll -= weights[i];
    if (roll <= 0) return items[i];
  }
  return items[items.length - 1];
}

/**
 * Star weights that produce roughly the requested mean. Tuned by shifting mass
 * between the top and bottom bands rather than by solving exactly, because the
 * shape matters more than hitting the decimal.
 */
function starWeights(target: number): number[] {
  const t = Math.min(5, Math.max(1, target));
  const skew = (t - 1) / 4;
  return [
    (1 - skew) ** 3.2 * 14,
    (1 - skew) ** 2.4 * 16,
    (1 - skew) ** 1.5 * skew * 40,
    skew ** 1.8 * 46,
    skew ** 3.1 * 62,
  ];
}

/** Nudge a dimension around the overall score without leaving 1 to 5. */
function dimension(random: Random, overall: number, bias: number): number {
  const drift = Math.round((random() * 2 - 1) + bias);
  return Math.min(5, Math.max(1, overall + drift));
}

export type GeneratedReview = {
  reviewer_name: string;
  reviewer_job_title: string;
  reviewer_company: string;
  reviewer_industry: string;
  reviewer_company_size: string;
  reviewer_country: string;
  reviewer_city: string;
  verified_linkedin: boolean;
  verified_badge: boolean;
  used_for_duration: string;
  overall_rating: number;
  ease_of_use: number;
  value_for_money: number;
  customer_service: number;
  functionality: number;
  review_title: string;
  summary: string;
  pros: string;
  cons: string;
  vendor_response: string | null;
  vendor_response_date: string | null;
  review_date: string;
  helpful_count: number;
  status: "published";
};

export type GenerateOptions = {
  /** Product slug, used to seed the generator. */
  slug: string;
  /** How many reviews to produce. */
  count: number;
  /** The average this product should land near. */
  targetRating: number;
  /** Reviews are spread backwards from here. */
  until?: Date;
  /** Spread reviews across this many months. */
  monthsBack?: number;
};

export function generateReviews({
  slug,
  count,
  targetRating,
  until = new Date("2026-08-01T00:00:00.000Z"),
  monthsBack = 30,
}: GenerateOptions): GeneratedReview[] {
  const random = makeRandom(hashString(slug));
  const weights = starWeights(targetRating);
  const stars = [1, 2, 3, 4, 5];
  const reviews: GeneratedReview[] = [];

  for (let i = 0; i < count; i += 1) {
    const overall = pickWeighted(random, stars, weights);

    const firstName = pick(random, FIRST_NAMES);
    const lastName = pick(random, LAST_NAMES);
    const company = `${pick(random, COMPANY_PREFIXES)} ${pick(random, COMPANY_SUFFIXES)}`;

    const positive = overall >= 4;
    const negative = overall <= 2;

    const title = positive
      ? pick(random, TITLE_POSITIVE)
      : negative
        ? pick(random, TITLE_NEGATIVE)
        : pick(random, TITLE_MIXED);

    const summary = positive
      ? pick(random, SUMMARY_POSITIVE)
      : negative
        ? pick(random, SUMMARY_NEGATIVE)
        : pick(random, SUMMARY_MIXED);

    const pros = positive
      ? pick(random, PROS_POSITIVE)
      : pick(random, PROS_MIXED);

    const cons = positive
      ? pick(random, CONS_MILD)
      : pick(random, CONS_CRITICAL);

    // Vendors answer a minority of reviews, and mostly the critical ones.
    const respond = negative ? random() < 0.35 : random() < 0.06;

    const daysBack = Math.floor(random() * monthsBack * 30);
    const reviewDate = new Date(until.getTime() - daysBack * 86400000);
    const responseDate = new Date(
      reviewDate.getTime() + (2 + Math.floor(random() * 9)) * 86400000,
    );

    reviews.push({
      reviewer_name: `${firstName} ${lastName}`,
      reviewer_job_title: pick(random, JOB_TITLES),
      reviewer_company: company,
      reviewer_industry: pick(random, INDUSTRIES),
      reviewer_company_size: pickWeighted(
        random,
        COMPANY_SIZES,
        COMPANY_SIZE_WEIGHTS,
      ),
      reviewer_country: "South Africa",
      reviewer_city: pick(random, CITIES),
      verified_linkedin: random() < 0.42,
      verified_badge: random() < 0.68,
      used_for_duration: pick(random, DURATIONS),
      overall_rating: overall,
      ease_of_use: dimension(random, overall, 0.1),
      value_for_money: dimension(random, overall, -0.1),
      customer_service: dimension(random, overall, -0.2),
      functionality: dimension(random, overall, 0.2),
      review_title: title,
      summary,
      pros,
      cons,
      vendor_response: respond ? pick(random, VENDOR_RESPONSES) : null,
      vendor_response_date: respond ? responseDate.toISOString() : null,
      review_date: reviewDate.toISOString(),
      helpful_count: Math.floor(random() ** 2.4 * 38),
      status: "published",
    });
  }

  // Newest first, which is how every page wants them.
  return reviews.sort(
    (a, b) =>
      new Date(b.review_date).getTime() - new Date(a.review_date).getTime(),
  );
}
