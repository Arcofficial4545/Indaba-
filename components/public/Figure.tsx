import { cn } from "@/lib/utils";

/**
 * Every number on the site goes through here.
 *
 * The problem it solves is specific to this market. en-ZA groups thousands
 * with a space, so `Intl.NumberFormat("en-ZA").format(6196)` returns "6 196",
 * and a text renderer treats that as two words. At body size it is a slight
 * awkwardness; at display size it stops reading as one figure and starts
 * reading as a 6 followed by a 196, which on a site whose entire proposition
 * is "we counted these" is a credibility problem rather than a typographic
 * one.
 *
 * Half the fix already lives in lib/format.ts, which substitutes U+202F, the
 * narrow no-break space, for the U+00A0 that Intl emits. That fixes the width
 * and makes the break impossible. This is the other half:
 *
 *   white-space: nowrap        belt and braces on top of the no-break space,
 *                              because a figure with a unit after it ("6 196
 *                              reviews") can still break at the wrong place
 *   tabular-nums               digits on a common advance
 *   word-spacing: -0.12em      closes the residual gap at display sizes
 *
 * `tabular-nums` looks redundant, because Switzer's digits are already
 * tabular: all ten measure 57.6 per 100px. It is here for the font swap
 * window, when the Arial fallback is painting and its digits are NOT tabular.
 * That is precisely the moment a comparison table would visibly jitter.
 *
 * This exists as a component rather than a documented class because a rule
 * that has to be remembered at 200 call sites is a rule that will be missed at
 * some of them, and the one that gets missed will be in a pricing table.
 *
 * ---------------------------------------------------------------------------
 * WRAP THE NUMBER, NEVER THE SENTENCE AROUND IT.
 *
 * `word-spacing: -0.12em` cannot tell the difference between the gap inside
 * "6 196" and the gap between two words, so it closes both. Every one of these
 * shipped during the build and had to be found in a screenshot:
 *
 *     <Figure>{formatReviewCount(n)}</Figure>      ->  "414reviews"
 *     <Figure>{price.amount}</Figure>              ->  "Pricingonrequest"
 *     <Figure>{rating} out of 5, {reviews}</Figure> ->  "4.5outof5"
 *
 * The correct shape is always the same: the figure inside, the words outside.
 *
 *     <Figure as="span">{formatNumber(n)}</Figure> reviews
 *
 * `startingPriceLabel()` returns `isCustom` precisely so a caller can tell a
 * price from a sentence. Use it.
 * ---------------------------------------------------------------------------
 */
export function Figure({
  children,
  className,
  as: Tag = "span",
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "dd" | "td" | "strong" | "p";
} & Omit<React.HTMLAttributes<HTMLElement>, "children">) {
  return (
    <Tag className={cn("data", className)} {...rest}>
      {children}
    </Tag>
  );
}
