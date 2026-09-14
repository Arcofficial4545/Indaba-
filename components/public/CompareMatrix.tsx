"use client";

import { CheckIcon, MinusIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { Figure } from "@/components/public/Figure";
import { formatNumber, formatRating } from "@/lib/format";
import type { CompareCell, CompareGroup } from "@/lib/compare-matrix";

/**
 * The comparison matrix: every row both products share, grouped and scannable.
 *
 * THREE THINGS THE OLD TABLE DID NOT DO, and each is why it read as a wall.
 *
 *  1. **The column header sticks.** Forty rows in, "yes / no" means nothing
 *     unless you can still see which column is which. The old page put the two
 *     names once at the top and expected the reader to remember them past
 *     three screens of scrolling.
 *  2. **Rows are grouped.** Ratings, price, features, integrations, support.
 *     One flat alphabetical list of forty rows hides the shape of the answer;
 *     five named blocks let a reader jump to the one they care about.
 *  3. **Differences can be isolated.** Most rows tie, and a row where both
 *     tick tells you nothing about which to buy. The toggle drops them.
 *
 * WHY THE TOGGLE IS CLIENT STATE AND NOT A URL. It narrows what is already on
 * screen and is a way of reading the table rather than a view worth sending to
 * somebody — the same test that put the category filters in client state and
 * the directory filters in the query string. Both products are already in the
 * server HTML either way, so nothing is hidden from a crawler.
 *
 * The leading side is marked, never the "winner". A row is a fact about one
 * dimension, and four green ticks in a column is not a recommendation.
 */
export function CompareMatrix({
  groups,
  a,
  b,
}: {
  groups: CompareGroup[];
  a: { name: string; slug: string };
  b: { name: string; slug: string };
}) {
  const [diffOnly, setDiffOnly] = useState(false);

  const { shown, total, differing } = useMemo(() => {
    const all = groups.flatMap((g) => g.rows);
    const diff = all.filter((r) => r.leads !== "same").length;
    const filtered = diffOnly
      ? groups
          .map((g) => ({ ...g, rows: g.rows.filter((r) => r.leads !== "same") }))
          .filter((g) => g.rows.length > 0)
      : groups;
    return { shown: filtered, total: all.length, differing: diff };
  }, [groups, diffOnly]);

  return (
    <div className="matrix">
      <div className="matrix-head">
        <div>
          <h2 className="text-h3 font-medium tracking-[-0.01em]">
            Line by line
          </h2>
          <p className="mt-1 text-small text-[var(--color-text-muted)]">
            <Figure as="span">{formatNumber(total)}</Figure> rows,{" "}
            <Figure as="span">{formatNumber(differing)}</Figure> where they
            differ
          </p>
        </div>

        {/*
          A real switch, not a checkbox styled to look like one: it is pressed
          or it is not, and aria-pressed says so. Labelled in full, because
          "Differences" on its own does not say whether it is a filter or a
          heading.
        */}
        <button
          type="button"
          aria-pressed={diffOnly}
          onClick={() => setDiffOnly((v) => !v)}
          className="matrix-toggle"
        >
          <span aria-hidden="true" className="matrix-toggle-box" />
          Only show differences
        </button>
      </div>

      <table className="matrix-table">
        <caption className="sr-only">
          {a.name} and {b.name} compared row by row
          {diffOnly ? ", showing only rows where they differ" : ""}
        </caption>
        <thead>
          <tr>
            <th scope="col" className="matrix-th matrix-th-label">
              <span className="sr-only">What is being compared</span>
            </th>
            <th scope="col" className="matrix-th">{a.name}</th>
            <th scope="col" className="matrix-th">{b.name}</th>
          </tr>
        </thead>

        {shown.map((group) => (
          <tbody key={group.title}>
            <tr className="matrix-group">
              {/*
                The group heading spans the row. `scope="colgroup"` is wrong
                here — it heads the rows beneath it, not the columns beside it.
              */}
              <th scope="colgroup" colSpan={3} className="matrix-group-th">
                <span className="matrix-group-title">{group.title}</span>
                {group.note && (
                  <span className="matrix-group-note">{group.note}</span>
                )}
              </th>
            </tr>
            {group.rows.map((row) => (
              <tr key={`${group.title}-${row.label}`} className="matrix-row">
                <th scope="row" className="matrix-label">
                  {row.label}
                </th>
                <Cell cell={row.a} leads={row.leads === "a"} />
                <Cell cell={row.b} leads={row.leads === "b"} />
              </tr>
            ))}
          </tbody>
        ))}
      </table>

      {shown.length === 0 && (
        <p className="matrix-empty">
          These two match on every row recorded. On this pair the decision is
          price and support, not the feature list.
        </p>
      )}
    </div>
  );
}

function Cell({ cell, leads }: { cell: CompareCell; leads: boolean }) {
  return (
    <td className="matrix-cell" data-leads={leads ? "true" : undefined}>
      {cell.kind === "rating" && (
        <span className="matrix-rating">
          <Figure as="span">{formatRating(cell.value)}</Figure>
          <span aria-hidden="true" className="rating-track">
            <span
              className="rating-fill"
              style={{ ["--fill" as string]: Math.max(0, Math.min(1, cell.value / 5)) }}
            />
          </span>
        </span>
      )}

      {cell.kind === "count" && <Figure as="span">{cell.label}</Figure>}

      {cell.kind === "price" &&
        (cell.value === null ? (
          <span className="matrix-muted">{cell.label}</span>
        ) : (
          <Figure as="span" className="matrix-price">{cell.label}</Figure>
        ))}

      {cell.kind === "text" && <span className="matrix-muted">{cell.value}</span>}

      {cell.kind === "bool" &&
        (cell.value ? (
          <>
            <CheckIcon className="matrix-yes" aria-hidden="true" />
            <span className="sr-only">Yes</span>
          </>
        ) : (
          <>
            <MinusIcon className="matrix-no" aria-hidden="true" />
            <span className="sr-only">No</span>
          </>
        ))}
    </td>
  );
}
