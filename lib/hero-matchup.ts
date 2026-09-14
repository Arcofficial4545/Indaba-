/** Serializable hero data; no server imports may cross this boundary. */

/**
 * One panel's half of the single sharpest difference between the two products.
 *
 * Split rather than a sentence because the figure has to go through <Figure>
 * and the words must not. Both sides of a matchup carry the same axis of
 * difference in the same slot, so the two panels read line against line.
 */
export type HeroDifference = {
  /** Already formatted, or "" when the difference is not a number. */
  figure: string;
  /** The words. Never contains a digit. */
  label: string;
};

export type HeroSide = {
  slug: string;
  name: string;
  logoUrl: string | null;
  rating: number;
  ratingLabel: string;
  reviewCount: string;
  price: string;
  priceNote: string;
  difference: HeroDifference;
};

export type HeroMatchup = {
  slug: string;
  href: string;
  a: HeroSide;
  b: HeroSide;
};

/**
 * The rating gap at which the beam reaches its full lean. Anything wider is
 * capped, so the layout cannot break however lopsided a pair turns out to be.
 *
 * Half a point is a large difference on a five point scale: 4.4 against 3.9 is
 * the widest lean the object needs to express. Choosing 0.5 rather than a
 * whole point is what makes a realistic 0.3 gap visibly lean instead of
 * registering as a rounding error.
 */
export const LEAN_FULL_GAP = 0.5;

/**
 * How far the scale leans, as a fraction of its full travel, in [-1, 1].
 *
 * **Positive means the LEFT product SINKS**, the way a grocer's scale behaves:
 * the better-rated product is the heavier one and its pan goes down.
 *
 * This was built the other way round first — merit rises — on the reading that
 * a directory weighs worth rather than mass. Shown a real page, the owner read
 * the raised side as the winner being dismissed rather than elevated, and they
 * are right that the physical reading is the one people arrive with. Both
 * balances on the site follow it.
 *
 * The sign is load-bearing and silent when wrong: get it backwards and the
 * site's one meaningful animation points at the lower-rated product, which is
 * the most visible possible bug on a site about fair ranking. It is asserted in
 * a browser rather than reasoned about — see DESIGN-NOTES.
 *
 * Equal ratings return 0 and the beam sits perfectly level. An unknown rating
 * on either side also returns 0 — a scale declining to answer is correct,
 * guessing is not.
 *
 * One number drives the whole mechanism. `globals.css` turns it into the beam
 * rotation, the counter-rotation that keeps the ropes plumb, and the two panel
 * translations, so those four transforms cannot drift out of step with each
 * other the way four separately animated values would.
 */
export function lean(matchup: HeroMatchup): number {
  const gap = matchup.a.rating - matchup.b.rating;
  if (!Number.isFinite(gap)) return 0;
  // Rounded so the server-rendered custom property is a clean number rather
  // than the raw floating-point residue of a subtraction.
  return Math.round(Math.max(-1, Math.min(1, gap / LEAN_FULL_GAP)) * 1000) / 1000;
}
