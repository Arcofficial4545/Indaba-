import type { Software } from "@/lib/types";

/*
  A product's ratings come from one of two places: reviews published on this
  site, or a public third-party snapshot recorded in rating_source (Capterra,
  for example). These helpers keep every place a rating appears honest about
  which one it is, and about a product that has no ratings at all.
*/

type Rated = Pick<Software, "review_count" | "rating_source">;

/** Whether the ratings are reviews published on this site. */
export function hasOwnReviews(software: Rated): boolean {
  return software.review_count > 0 && !software.rating_source;
}

/** The words after a review count: "review", "reviews" or "reviews on Capterra". */
export function reviewsWord(software: Rated): string {
  const noun = software.review_count === 1 ? "review" : "reviews";
  return software.rating_source ? `${noun} on ${software.rating_source.name}` : noun;
}
