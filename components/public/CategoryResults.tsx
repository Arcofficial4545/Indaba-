"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Figure } from "@/components/public/Figure";
import { SoftwareResultRow } from "@/components/public/SoftwareResultRow";
import { formatNumber, formatRating } from "@/lib/format";
import type { SoftwareWithCategory } from "@/lib/types";

/**
 * The category listing: filter rail on the left, results on the right.
 *
 * FILTERS ARE CLIENT STATE HERE, DELIBERATELY, and this is a departure from
 * the repo's "filters live in the query string" convention. That rule exists
 * so a filtered view is linkable and the back button is correct — and it is
 * absolutely right for the main directory at /software, which is a
 * destination people share.
 *
 * A category page is a different thing: it is already the filtered view, and
 * these three controls narrow a list of at most nine products that is entirely
 * on screen. Pushing a route change per checkbox would re-render the page,
 * lose scroll position and fill the reader's history with states they did not
 * choose to keep, in exchange for a shareable URL nobody would share.
 *
 * If this list ever paginates, that trade flips and these belong in the URL.
 */

type FilterState = {
  freeTrial: boolean;
  freePlan: boolean;
  /** Minimum rating, or 0 for no floor. */
  minRating: number;
};

const EMPTY: FilterState = { freeTrial: false, freePlan: false, minRating: 0 };

export function CategoryResults({
  software,
  categories,
  categoryName,
}: {
  software: SoftwareWithCategory[];
  checklist: { title: string; body: string }[];
  categories: { name: string; slug: string; count: number; current: boolean }[];
  categoryName: string;
}) {
  const [filters, setFilters] = useState<FilterState>(EMPTY);

  const results = useMemo(
    () =>
      software.filter((item) => {
        if (filters.freeTrial && !item.free_trial) return false;
        if (filters.freePlan && !item.free_version) return false;
        if (filters.minRating && item.overall_rating < filters.minRating) {
          return false;
        }
        return true;
      }),
    [software, filters],
  );

  const activeCount =
    (filters.freeTrial ? 1 : 0) +
    (filters.freePlan ? 1 : 0) +
    (filters.minRating ? 1 : 0);

  return (
    <div className="listing">
      {/* ---- filter rail ------------------------------------------------ */}
      <aside className="listing-rail" aria-label="Filter results">
        <div className="listing-rail-inner">
          <FilterGroup title="Rating">
            {[4.5, 4].map((value) => (
              <Choice
                key={value}
                checked={filters.minRating === value}
                onChange={() =>
                  setFilters((f) => ({
                    ...f,
                    minRating: f.minRating === value ? 0 : value,
                  }))
                }
              >
                <Figure as="span">{formatRating(value)}</Figure> and above
              </Choice>
            ))}
          </FilterGroup>

          <FilterGroup title="Trial and pricing">
            <Choice
              checked={filters.freeTrial}
              onChange={() =>
                setFilters((f) => ({ ...f, freeTrial: !f.freeTrial }))
              }
            >
              Has a free trial
            </Choice>
            <Choice
              checked={filters.freePlan}
              onChange={() =>
                setFilters((f) => ({ ...f, freePlan: !f.freePlan }))
              }
            >
              Has a free plan
            </Choice>
          </FilterGroup>

          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => setFilters(EMPTY)}
              className="listing-clear"
            >
              Clear{" "}
              <Figure as="span">{formatNumber(activeCount)}</Figure>{" "}
              {activeCount === 1 ? "filter" : "filters"}
            </button>
          )}

          <FilterGroup title="Other categories">
            <ul className="flex flex-col gap-2">
              {categories
                .filter((entry) => !entry.current)
                .map((entry) => (
                  <li key={entry.slug}>
                    <Link
                      href={`/category/${entry.slug}`}
                      className="flex items-center justify-between gap-3 text-small text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    >
                      <span className="truncate">{entry.name}</span>
                      <Figure className="shrink-0">
                        {formatNumber(entry.count)}
                      </Figure>
                    </Link>
                  </li>
                ))}
            </ul>
          </FilterGroup>
        </div>
      </aside>

      {/* ---- results ----------------------------------------------------- */}
      <div className="listing-results">
        {/*
          The result count is sticky, because it is the answer to what the
          filters just did and a reader halfway down the list otherwise has to
          scroll back to find out how many things they are looking at.
        */}
        <div className="listing-summary" aria-live="polite">
          <p>
            <Figure as="span">{formatNumber(results.length)}</Figure>{" "}
            {results.length === 1 ? "product" : "products"}
            {activeCount > 0 && (
              <>
                {" "}
                of <Figure as="span">{formatNumber(software.length)}</Figure>
              </>
            )}
          </p>
        </div>

        {results.length === 0 ? (
          /*
            An empty state that invites action rather than apologising. It
            names what was filtered out, offers the one control that would fix
            it, and offers the route that always works.
          */
          <div className="listing-empty">
            <p className="text-h3 font-medium tracking-[-0.01em]">
              No {categoryName.toLowerCase()} matches all of those at once.
            </p>
            <p className="mt-3 max-w-[52ch] leading-relaxed text-[var(--color-text-muted)]">
              There are{" "}
              <Figure as="span">{formatNumber(software.length)}</Figure>{" "}
              products in this category. Widening the rating floor usually
              brings back the most.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setFilters(EMPTY)}
                className="btn-glossy h-10 px-5 text-small"
              >
                Clear filters
              </button>
              <Link
                href="/contact?intent=listing"
                className="hero-chip flex h-10 items-center"
              >
                Suggest a product we are missing
              </Link>
            </div>
          </div>
        ) : (
          <ul className="listing-rows">
            {results.map((item) => (
              <li key={item.id}>
                <SoftwareResultRow software={item} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="listing-group">
      <h2 className="text-small text-[var(--color-text-muted)]">{title}</h2>
      <div className="mt-3 flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

function Choice({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label className="listing-choice">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="listing-checkbox"
      />
      <span>{children}</span>
    </label>
  );
}
