import Link from "next/link";
import type { CSSProperties } from "react";

import { AffiliateCTAButton } from "@/components/public/AffiliateCTAButton";
import { Figure } from "@/components/public/Figure";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { buildPlans, buildReasons } from "@/lib/compare-matrix";
import { formatNumber, formatRating, startingPriceLabel } from "@/lib/format";
import { reviewsWord } from "@/lib/ratings";
import type { SoftwareWithCategory } from "@/lib/types";

/**
 * The two columns the whole page hangs off.
 *
 * The old page opened with a centre-axis table: the row label in the middle,
 * one value to its left and one to its right. It is a lovely idea about
 * balance and it fights the only thing a reader is trying to do, which is scan
 * a column. Your eye goes out, in, out, in, once per row. Every comparison
 * table worth copying puts the label on the left and the values in columns,
 * and it does that because reading down a column is free and reading across a
 * gap is not.
 *
 * So the axis is gone and this is what replaces it: two product columns
 * carrying the four things a decision actually turns on — who it is, how it
 * rates, what it costs, and how to go and look at it — with the plan ladder
 * underneath each. Then a verdict, then the matrix.
 *
 * AND THE PANELS HANG FROM A BALANCE. This site invented one for the hero and
 * then did not put it on the page that is actually a comparison, which was the
 * real reason this page read as a document rather than as Indaba: its
 * signature object was missing from the one page it was designed for.
 *
 * The mechanism is the hero own, at page scale: a single `--lean` in [-1, 1]
 * drives the beam rotation, a counter-rotation per rope so both hang plumb,
 * and the two panel translations. Positive SINKS the LEFT product: this is a
 * weighing scale, and the better-rated product is the heavier one. Sharing one
 * number is what keeps the rope feet welded to the panel tops at every angle.
 *
 * Here the tilt is not decoration: it is the overall rating gap, the same gap
 * the first row of the matrix prints. The beam is level when they tie.
 *
 * NEITHER COLUMN IS "RECOMMENDED". Every reference for this pattern is a
 * pricing page with a Most Popular badge on the middle tier, which is a
 * marketing device for a vendor selling its own plans. This page compares two
 * vendors it does not own, on a site whose whole claim is that placement is
 * not for sale. What it marks instead is per row, in the matrix, where the
 * data actually says one leads — and the beam, which reports one number and
 * says which number it is reporting.
 */

/** The rating gap at which the beam reaches full tilt. Half a point is a lot
 *  on a five point scale, so it is the widest lean this page needs. */
const FULL_GAP = 0.5;
export function CompareBoard({
  a,
  b,
}: {
  a: SoftwareWithCategory;
  b: SoftwareWithCategory;
}) {
  const lean =
    Math.round(
      Math.max(-1, Math.min(1, (a.overall_rating - b.overall_rating) / FULL_GAP)) * 1000,
    ) / 1000;

  return (
    /*
      data-bleed on the boxes that tilt. A rotating object sweeps a box wider
      than it occupies at rest — 5px at the leans this data produces — and that
      is the instrument working, not a layout bug. The audit rig has an opt-out
      for exactly this, and the hero rig carries the same pair of marks.
    */
    <div className="cmp-scale" data-bleed="" style={{ "--lean": lean } as CSSProperties}>
      {/*
        Decorative to a screen reader. The ratings inside the panels carry the
        whole meaning of the tilt and are plain text, so describing the drawing
        would say the same thing twice and less precisely.
      */}
      <div className="cmp-rig" data-bleed="" aria-hidden="true">
        <span className="cmp-rig-post" />
        <svg className="cmp-rig-base" viewBox="0 0 96 12" width="96" height="12" fill="none">
          <path d="M38 .5h20M38 .5 8 11.5M58 .5l30 11M3 11.5h90" />
        </svg>
        <div className="cmp-rig-beam" data-bleed="">
          <span className="cmp-rig-bar" />
          {(["a", "b"] as const).map((side) => (
            <div key={side} className={`cmp-rig-hanger cmp-rig-hanger-${side}`}>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
                <path d="M50 0 36 100M50 0l14 100" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      <div className="cmp-board">
        <div className="cmp-pan cmp-pan-a">
          <Column software={a} other={b} leads={lean > 0} />
        </div>
        <div className="cmp-pan cmp-pan-b">
          <Column software={b} other={a} leads={lean < 0} />
        </div>
      </div>
    </div>
  );
}

function Column({
  software,
  other,
  leads,
}: {
  software: SoftwareWithCategory;
  other: SoftwareWithCategory;
  /** Higher overall rating. Marked with one sand edge and nothing else. */
  leads: boolean;
}) {
  const price = startingPriceLabel(software);
  const plans = buildPlans(software);
  const reasons = buildReasons(software, other);

  return (
    <article className="cmp-col" data-leads={leads ? "true" : undefined}>
      <div className="cmp-col-head">
        <SoftwareLogo
          name={software.name}
          slug={software.slug}
          logoUrl={software.logo_url}
          brandColor={software.brand_color}
          size={52}
        />
        <div className="min-w-0">
          <h2 className="cmp-col-name">
            <Link href={`/software/${software.slug}`} className="cmp-col-link">
              {software.name}
            </Link>
          </h2>
          {software.category && (
            <p className="cmp-col-category">
              {software.category.name.replace(/ Software$/, "")}
            </p>
          )}
        </div>
      </div>

      <p className="cmp-col-tagline">{software.tagline}</p>

      <div className="cmp-col-score">
        {software.review_count > 0 ? (
          <>
            <Figure className="cmp-col-rating">
              {formatRating(software.overall_rating)}
            </Figure>
            <span className="cmp-col-outof" aria-hidden="true">/5</span>
            <span className="sr-only">out of 5</span>
            <span className="cmp-col-reviews">
              <Figure as="span">{formatNumber(software.review_count)}</Figure>{" "}
              {reviewsWord(software)}
            </span>
          </>
        ) : (
          <span className="cmp-col-reviews">No reviews yet</span>
        )}
      </div>

      <div className="cmp-col-price">
        {price.isCustom ? (
          <span className="cmp-col-amount">{price.amount}</span>
        ) : (
          <>
            <span className="cmp-col-from">From</span>
            <Figure className="cmp-col-amount">{price.amount}</Figure>
          </>
        )}
        <span className="cmp-col-note">{price.note}</span>
      </div>

      {/*
        The plan ladder. It is the question every pricing page answers and this
        one never did: the entry price is one number, and what a business
        actually pays depends on which tier it lands on. Straight from the
        catalogue's own pricing_plans.
      */}
      {plans.length > 0 && (
        <dl className="cmp-plans">
          {plans.map((plan) => (
            <div key={plan.name} className="cmp-plan">
              <dt>{plan.name}</dt>
              <dd>
                <Figure as="span">{plan.price}</Figure>
                <span className="cmp-plan-note">{plan.note}</span>
              </dd>
            </div>
          ))}
        </dl>
      )}

      {/*
        Why you would pick this one. Every line is a fact printed elsewhere on
        the page — the block exists so a reader does not have to do forty
        comparisons to reach a conclusion the data already supports.
      */}
      {reasons.length > 0 && (
        <div className="cmp-reasons">
          <h3 className="cmp-reasons-title">Pick {software.name} if</h3>
          <ul>
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="cmp-col-actions">
        <AffiliateCTAButton
          slug={software.slug}
          name={software.name}
          tone="site"
          className="cmp-col-cta"
        >
          Visit {software.name}
        </AffiliateCTAButton>
        <Link href={`/software/${software.slug}`} className="cmp-col-secondary">
          Read the review
        </Link>
      </div>
    </article>
  );
}
