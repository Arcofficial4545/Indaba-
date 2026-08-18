import type { StarDistribution } from "@/lib/types";

/**
 * Ranking uses a Bayesian weighted average, never a raw star average.
 *
 * A raw average lets a product with 12 reviews at 4.9 outrank one with 400 at
 * 4.5, which is wrong: the small sample carries far less evidence. Each rating
 * is blended toward the platform mean, weighted by how many reviews back it.
 *
 *   score = (C * m + n * R) / (C + n)
 *
 *   R = the product's own average
 *   n = its review count
 *   m = the mean rating across the platform
 *   C = the prior weight, the median review count
 *
 * With C set to the median, a product with a typical number of reviews is
 * pulled halfway to the mean, and a product with far more than typical keeps
 * almost all of its own signal.
 */

export type Rankable = {
  overall_rating: number;
  review_count: number;
};

export type RankingPrior = {
  /** Platform mean rating, `m`. */
  mean: number;
  /** Prior weight, `C`. */
  weight: number;
};

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/**
 * Derive the prior from the catalogue itself rather than hardcoding it, so it
 * stays correct as the catalogue grows. Products with no reviews are excluded
 * from the mean, otherwise unrated drafts would drag it down.
 */
export function computeRankingPrior(items: Rankable[]): RankingPrior {
  const rated = items.filter((item) => item.review_count > 0);
  if (rated.length === 0) return { mean: 0, weight: 1 };

  const totalReviews = rated.reduce((sum, item) => sum + item.review_count, 0);
  // Weight the mean by review volume so it reflects reviewers, not products.
  const weightedSum = rated.reduce(
    (sum, item) => sum + item.overall_rating * item.review_count,
    0,
  );

  return {
    mean: totalReviews > 0 ? weightedSum / totalReviews : 0,
    weight: Math.max(1, median(rated.map((item) => item.review_count))),
  };
}

/** The blended score for one product. */
export function bayesianScore(item: Rankable, prior: RankingPrior): number {
  const { mean, weight } = prior;
  const n = item.review_count;
  if (n <= 0) return mean;
  return (weight * mean + n * item.overall_rating) / (weight + n);
}

/**
 * Rank a set of products. Returns a new array; the caller's order is never
 * mutated. Ties break on review count, because more evidence should win.
 */
export function rankByBayesian<T extends Rankable>(
  items: T[],
  prior?: RankingPrior,
): T[] {
  const resolvedPrior = prior ?? computeRankingPrior(items);
  return [...items]
    .map((item) => ({ item, score: bayesianScore(item, resolvedPrior) }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.item.review_count - a.item.review_count;
    })
    .map((entry) => entry.item);
}

/** Convenience: the top N products by blended score. */
export function topRated<T extends Rankable>(items: T[], count: number): T[] {
  return rankByBayesian(items).slice(0, count);
}

/* ==========================================================================
   Sentiment
   ========================================================================== */

export type Sentiment = {
  positive: number;
  neutral: number;
  negative: number;
  total: number;
};

/**
 * Collapse a star distribution into three bands. 4 and 5 read as positive,
 * 3 as neutral, 1 and 2 as negative, which is how buyers read them too.
 */
export function sentimentFromDistribution(
  distribution: StarDistribution,
): Sentiment {
  const positive = distribution[5] + distribution[4];
  const neutral = distribution[3];
  const negative = distribution[2] + distribution[1];
  return { positive, neutral, negative, total: positive + neutral + negative };
}

/** Percentage of a band, rounded, guarding against an empty distribution. */
export function sentimentPercent(value: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
}

/** An empty distribution, so components never have to null check. */
export function emptyDistribution(): StarDistribution {
  return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
}
