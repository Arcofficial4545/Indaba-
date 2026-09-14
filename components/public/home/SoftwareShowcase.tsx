import Link from "next/link";

import { CompareButton } from "@/components/public/CompareTray";
import { Figure } from "@/components/public/Figure";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { formatNumber, formatRating, startingPriceLabel } from "@/lib/format";
import type { SoftwareWithCategory } from "@/lib/types";

/**
 * The product grid: twenty real products, each with the two numbers a buyer is
 * actually shopping on and the two things they can do next.
 *
 * WHY A GRID HERE AND A TABLE LOWER DOWN. The top-rated section is a ranked
 * table — rank, name, bar, count — and it answers "who is best". This answers a
 * different question: "what is out there, what does it cost, and can I look at
 * it now". A table cannot carry a 48px vendor mark or two calls to action per
 * row without becoming a form, and a card cannot carry rank without implying
 * one. They are the same catalogue read two ways, and if only one survives it
 * should be this one, because it is the one with prices on it.
 *
 * EVERY CARD CARRIES THE SAME SIX SLOTS, in the same order, so twenty of them
 * scan as one list rather than twenty designs:
 *
 *   mark · name · category · rating and reviews · price · two actions
 *
 * WHAT IS DELIBERATELY NOT HERE. No shadows and no lift on hover — §12 bans a
 * grid of identical rounded cards with identical shadows, and what stops these
 * reading that way is that the data differs, not that the container does. The
 * border goes to control weight on hover and nothing moves.
 *
 * NOTHING IS PINNED HERE AND NOTHING IS LABELLED. The heading is a claim about
 * the order — by price and rating — so the grid holds to it: no promoted rows,
 * and therefore no chips to explain them. The two are one decision, not two.
 * A label is only needed where the order has been interfered with, and taking
 * the label off without taking the pin off is the one combination that is
 * worse than either.
 *
 * Editorial prominence lives in the recommendations section instead, which
 * says on its face that it is a selection rather than a ranking. That is where
 * a favoured product belongs, and there the section header does the declaring
 * so the cards need nothing.
 */
export function SoftwareShowcase({
  software,
}: {
  software: SoftwareWithCategory[];
}) {
  if (software.length === 0) return null;

  return (
    <ul className="showcase-grid">
      {software.map((product) => (
        <li key={product.id}>
          <ShowcaseCard product={product} />
        </li>
      ))}
    </ul>
  );
}

function ShowcaseCard({ product }: { product: SoftwareWithCategory }) {
  const price = startingPriceLabel(product);
  const rating = product.overall_rating;

  return (
    <article className="showcase-card">
      <div className="showcase-head">
        {/*
          The mark sits on the card with no plate behind it — SoftwareLogo
          renders the vendor's own transparent artwork and nothing else. At
          48px it is the first thing the eye lands on, which is the point: a
          buyer scanning twenty products recognises a logo before a name.
        */}
        <SoftwareLogo
          name={product.name}
          slug={product.slug}
          logoUrl={product.logo_url}
          brandColor={product.brand_color}
          size={48}
        />
      </div>

      <h3 className="showcase-name">
        {/*
          The whole card is not one link: it holds two buttons, and nesting
          interactive elements inside a link is broken for a keyboard and for a
          screen reader. The name is the link to the review.
        */}
        <Link href={`/software/${product.slug}`} className="showcase-link">
          {product.name}
        </Link>
      </h3>
      {product.category && (
        <p className="showcase-category">{product.category.name.replace(/ Software$/, "")}</p>
      )}

      {/*
        The rating, given the weight it earns: it is the number the comparison
        turns on. The bar is sand on an ink track with the numeral beside it —
        sand alone measures 1.70:1 on paper, so the figure next to it is what
        makes the bar legible rather than decorative.
      */}
      <div className="showcase-rating">
        <p>
          <Figure className="showcase-score">{formatRating(rating)}</Figure>
          <span className="showcase-outof" aria-hidden="true">/5</span>
          <span className="sr-only">out of 5</span>
        </p>
        <p className="showcase-reviews">
          <Figure>{formatNumber(product.review_count)}</Figure>{" "}
          {product.review_count === 1 ? "review" : "reviews"}
        </p>
      </div>
      <div
        className="showcase-bar"
        aria-hidden="true"
        style={{ "--fill": Math.max(0, Math.min(1, rating / 5)) } as React.CSSProperties}
      >
        <span />
      </div>

      <p className="showcase-price">
        {/*
          `isCustom` is why startingPriceLabel exists: it lets a caller tell a
          price from a sentence, so "Pricing on request" never goes through
          <Figure> and comes out as "Pricingonrequest".
        */}
        {price.isCustom ? (
          /*
            "Pricing on request" is the whole statement. Repeating "the vendor
            does not publish a list price" underneath it on eleven of twenty
            cards is the same sentence twice and it buries the cards that DO
            have a number.
          */
          <span className="showcase-amount">{price.amount}</span>
        ) : (
          <>
            <span className="showcase-from">From</span>
            <Figure className="showcase-amount">{price.amount}</Figure>
            <span className="showcase-vat">{price.note}</span>
          </>
        )}
      </p>

      {/*
        Two actions, in order of how committed the reader is: fill the compare
        tray, or open the review.

        The review takes the full-width sand row. This used to be a "Visit
        site" button straight to the vendor, but a reader on the home page is
        still browsing, and the page that earns the click is the review, where
        the vendor link sits beside its disclosure. See AffiliateCTAButton for
        the rule.
      */}
      <div className="showcase-actions">
        <CompareButton slug={product.slug} name={product.name} />
      </div>
      <Link
        href={`/software/${product.slug}`}
        className="btn-glossy showcase-visit items-center justify-center gap-2 text-sm"
      >
        Read review
        <span className="sr-only"> of {product.name}</span>
      </Link>
    </article>
  );
}
