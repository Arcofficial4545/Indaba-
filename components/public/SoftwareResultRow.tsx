import Link from "next/link";
import { CheckIcon } from "lucide-react";

import { CompareToggle } from "@/components/public/CompareTray";
import { Figure } from "@/components/public/Figure";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { formatNumber, formatRating, startingPriceLabel } from "@/lib/format";
import { reviewsWord } from "@/lib/ratings";
import type { SoftwareWithCategory } from "@/lib/types";

/**
 * One row in a product listing.
 *
 * Extracted from CategoryResults so the directory at /software and a category
 * page render the identical object. Two listings that differ by a few pixels
 * read as two different products; the whole point of the rail-and-rows pattern
 * is that a reader who has learned one listing has learned all of them.
 *
 * Deliberately NOT marked "use client". It has no server-only imports, so it
 * compiles into whichever graph imports it — the client bundle for
 * CategoryResults, the server for the directory — and neither copy pays for
 * the other.
 *
 * `showCategory` is the one difference between the two call sites. On a
 * category page every row is in the same category and printing it 9 times is
 * noise; in the directory it is the fastest way to tell an HR tool from a CRM.
 */
export function SoftwareResultRow({
  software,
  showCategory = false,
}: {
  software: SoftwareWithCategory;
  showCategory?: boolean;
}) {
  const price = startingPriceLabel(software);
  const fill = Math.max(0, Math.min(1, software.overall_rating / 5));

  return (
    <div className="listing-row">
      <SoftwareLogo
        name={software.name}
        slug={software.slug}
        logoUrl={software.logo_url}
        brandColor={null}
        size={40}
        className="shrink-0"
      />

      <div className="min-w-0 flex-1">
        <h3 className="text-h3 font-medium tracking-[-0.01em]">
          <Link
            href={`/software/${software.slug}`}
            className="hover:text-[var(--color-text-accent)]"
          >
            {software.name}
          </Link>
        </h3>
        {showCategory && software.category && (
          <p className="mt-0.5 text-small text-[var(--color-text-muted)]">
            {software.category.name.replace(/ Software$/, "")}
          </p>
        )}
        {/*
          The tagline, not description_short.

          description_short runs to 186 characters, so it was clamped to two
          lines and rendered with an ellipsis — and nothing on this site
          truncates. The tagline is written to be one line (29 to 61 characters
          across the whole catalogue) and says the same thing in the space a
          listing row actually has.
        */}
        <p className="mt-1 max-w-[62ch] text-small leading-relaxed text-[var(--color-text-muted)]">
          {software.tagline ?? software.description_short}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-small">
          {software.review_count > 0 ? (
            <>
              <span className="flex items-center gap-2">
                <Figure>{formatRating(software.overall_rating)}</Figure>
                <span aria-hidden="true" className="rating-track">
                  <span
                    className="rating-fill"
                    style={{ ["--fill" as string]: fill }}
                  />
                </span>
                <span className="sr-only">out of 5</span>
              </span>
              {/*
                The count is a Figure, the word beside it is not. Passing the
                whole of formatReviewCount() through Figure applies its negative
                word spacing to the gap before "reviews" and renders
                "414reviews".
              */}
              <span className="text-[var(--color-text-muted)]">
                <Figure as="span">{formatNumber(software.review_count)}</Figure>{" "}
                {reviewsWord(software)}
              </span>
            </>
          ) : (
            <span className="text-[var(--color-text-muted)]">No reviews yet</span>
          )}
          {software.free_trial && (
            <span className="text-[var(--color-text-cool)]">Free trial</span>
          )}
        </div>

        {/*
          Two specifics per row. A directory listing that carries only a rating
          and a price makes every product look the same; these are the lines a
          buyer actually scans for, and they come straight from the catalogue
          rather than from marketing copy.

          Two, not three: the third pushes every row past the height where the
          list still reads as a list.
        */}
        {software.top_features.length > 0 && (
          <ul className="listing-specs">
            {software.top_features.slice(0, 2).map((feature) => (
              <li key={feature}>
                <CheckIcon className="listing-spec-tick" aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="listing-row-end">
        {price.isCustom ? (
          <p className="text-small text-[var(--color-text-muted)]">
            {price.amount}
          </p>
        ) : (
          <Figure as="p" className="text-[1.375rem] leading-none">
            {price.amount}
          </Figure>
        )}
        <p className="mt-1.5 text-small text-[var(--color-text-muted)]">
          {price.note}
        </p>
        {/*
          The box gets a visible word beside it. On its own it is an unlabelled
          square at the end of a row, and a reader has to already know what it
          does — which the clarity rules rule out. The button keeps its own
          screen-reader label, so this text is decorative to assistive tech.
        */}
        <div className="mt-3 flex items-center justify-end gap-2">
          <span aria-hidden="true" className="text-small text-[var(--color-text-muted)]">
            Compare
          </span>
          <CompareToggle slug={software.slug} name={software.name} />
        </div>
        {/*
          To the review, not to the vendor. A listing is where a buyer is still
          choosing, so the next step is the page that helps them choose; the
          vendor link lives on the profile, beside its disclosure. See
          AffiliateCTAButton for the rule.
        */}
        <div className="mt-3 flex justify-end">
          <Link
            href={`/software/${software.slug}`}
            className="btn-glossy inline-flex h-9 items-center px-4 text-sm"
          >
            Read review<span className="sr-only"> of {software.name}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
