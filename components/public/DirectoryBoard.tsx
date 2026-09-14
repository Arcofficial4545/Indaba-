import Link from "next/link";
import { SearchIcon, XIcon } from "lucide-react";

import { CountUp } from "@/components/public/CountUp";
import { Figure } from "@/components/public/Figure";
import { SoftwareResultRow } from "@/components/public/SoftwareResultRow";
import { formatNumber, formatRating } from "@/lib/format";
import type { DirectoryFacets } from "@/lib/queries/software";
import type { Category, SoftwareWithCategory } from "@/lib/types";

/**
 * The directory: what is in the catalogue, and how to cut it down.
 *
 * EVERY FILTER IS A LINK, and that is the whole architecture. The old page put
 * radio inputs in a client component and pushed a route per change; this one
 * renders anchors whose href is the current query with one parameter added or
 * removed. Three things fall out of that and all of them matter here:
 *
 *  - A filtered view is a URL. `/software?category=payroll-software&rating=4.5`
 *    is a page someone can send to a colleague, and the back button walks the
 *    choices they actually made.
 *  - It needs no JavaScript. The directory is the page organic search lands on,
 *    and it filters, sorts and paginates with the bundle disabled.
 *  - There is no client state to fall out of step with the URL, which is the
 *    usual bug in a filter panel.
 *
 * A category page does the opposite on purpose — see the note at the top of
 * CategoryResults. It is already the filtered view and its controls narrow nine
 * rows that are entirely on screen, so a route change per checkbox would cost
 * scroll position and history for a URL nobody would share. Directory: URL.
 * Category: client. The two are not inconsistent, they are the same rule
 * applied to different page sizes.
 */

type Params = {
  q?: string;
  category?: string;
  rating?: string;
  trial?: string;
  free?: string;
  priced?: string;
  sort?: string;
};

const SORTS = [
  { value: "reviewed", label: "Most reviewed" },
  { value: "rated", label: "Highest rated" },
  { value: "price", label: "Lowest price" },
  { value: "updated", label: "Recently updated" },
] as const;

const RATINGS = [4.5, 4] as const;

/**
 * The current query with one key changed, and `page` always dropped.
 *
 * Dropping the page is not a detail: changing a filter while on page three and
 * keeping the page is how a listing shows an empty result for a filter that
 * actually matched plenty.
 */
function href(params: Params, key: keyof Params, value: string | undefined) {
  const next = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...params, [key]: value })) {
    if (v) next.set(k, v);
  }
  const query = next.toString();
  return `/software${query ? `?${query}` : ""}`;
}

export function DirectoryBoard({
  items,
  facets,
  categories,
  params,
}: {
  items: SoftwareWithCategory[];
  facets: DirectoryFacets;
  categories: Category[];
  params: Params;
}) {
  const activeCategory = categories.find((c) => c.slug === params.category);

  /*
    The chips are built from the same params the rail reads, so a filter can
    never appear in one and not the other. Each carries the href that removes
    exactly itself.
  */
  const chips = [
    activeCategory && {
      key: "category" as const,
      label: activeCategory.name.replace(/ Software$/, ""),
    },
    params.q && { key: "q" as const, label: `“${params.q}”` },
    params.rating && {
      key: "rating" as const,
      label: `${formatRating(Number(params.rating))} and above`,
    },
    params.priced === "1" && { key: "priced" as const, label: "Publishes a price" },
    params.free === "1" && { key: "free" as const, label: "Free plan" },
    params.trial === "1" && { key: "trial" as const, label: "Free trial" },
  ].filter(Boolean) as { key: keyof Params; label: string }[];

  return (
    <>

      <div className="listing">
        {/* ---- filter rail ---------------------------------------------- */}
        <aside className="listing-rail" aria-label="Filter the directory">
          <div className="listing-rail-inner">
            <Group title="Category">
              <Option href={href(params, "category", undefined)} active={!params.category}>
                All categories
                <Figure className="directory-count">
                  {formatNumber(categories.reduce((n, c) => n + c.software_count, 0))}
                </Figure>
              </Option>
              {categories.map((category) => (
                <Option
                  key={category.id}
                  href={href(params, "category", category.slug)}
                  active={params.category === category.slug}
                >
                  {category.name.replace(/ Software$/, "")}
                  <Figure className="directory-count">
                    {formatNumber(category.software_count)}
                  </Figure>
                </Option>
              ))}
            </Group>

            <Group title="Rating">
              {RATINGS.map((value) => (
                <Option
                  key={value}
                  href={href(
                    params,
                    "rating",
                    params.rating === String(value) ? undefined : String(value),
                  )}
                  active={params.rating === String(value)}
                >
                  <span>
                    <Figure as="span">{formatRating(value)}</Figure> and above
                  </span>
                </Option>
              ))}
            </Group>

            <Group title="Pricing">
              <Option
                href={href(params, "priced", params.priced === "1" ? undefined : "1")}
                active={params.priced === "1"}
              >
                Publishes a price
              </Option>
              <Option
                href={href(params, "free", params.free === "1" ? undefined : "1")}
                active={params.free === "1"}
              >
                Has a free plan
              </Option>
              <Option
                href={href(params, "trial", params.trial === "1" ? undefined : "1")}
                active={params.trial === "1"}
              >
                Has a free trial
              </Option>
            </Group>

            <Group title="Order">
              {SORTS.map((option) => (
                <Option
                  key={option.value}
                  href={href(params, "sort", option.value === "reviewed" ? undefined : option.value)}
                  active={(params.sort ?? "reviewed") === option.value}
                >
                  {option.label}
                </Option>
              ))}
            </Group>
          </div>
        </aside>

        {/* ---- results --------------------------------------------------- */}
        <div className="listing-results">
          {/*
            A real GET form, so searching the catalogue costs no JavaScript and
            lands on a URL like every other filter here. The hidden inputs carry
            the rest of the query through, which is what stops a search from
            silently clearing the category the reader had already chosen.
          */}
          <form action="/software" method="get" className="directory-search" role="search">
            <SearchIcon className="directory-search-icon" aria-hidden="true" />
            <input
              type="search"
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Search by name"
              aria-label="Search the directory by product name"
              className="directory-search-input"
            />
            {(["category", "rating", "trial", "free", "priced", "sort"] as const).map((key) =>
              params[key] ? (
                <input key={key} type="hidden" name={key} value={params[key]} />
              ) : null,
            )}
            <button type="submit" className="btn-glossy directory-search-go">
              Search
            </button>
          </form>

          <div className="listing-summary">
            <p>
              <Figure as="span">{formatNumber(facets.total)}</Figure>{" "}
              {facets.total === 1 ? "product" : "products"}
            </p>

            {chips.length > 0 && (
              <ul className="directory-chips">
                {chips.map((chip) => (
                  <li key={chip.key}>
                    {/*
                      Each chip removes only itself, so a reader can undo one
                      decision without starting again — which is what they
                      actually want after four clicks.
                    */}
                    <Link href={href(params, chip.key, undefined)} className="directory-chip">
                      {chip.label}
                      <XIcon className="size-3.5 shrink-0" aria-hidden="true" />
                      <span className="sr-only">, remove this filter</span>
                    </Link>
                  </li>
                ))}
                {chips.length > 1 && (
                  <li>
                    <Link href="/software" className="directory-chip-clear">
                      Clear all
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </div>

          {items.length === 0 ? (
            /*
              An empty state that names what happened and offers the way out,
              rather than apologising. The chips above it are still there, so
              the fix is one click and visible.
            */
            <div className="listing-empty">
              <p className="text-h3 font-medium tracking-[-0.01em]">
                Nothing matches all of those at once.
              </p>
              {/*
                It names the filters that are actually on rather than guessing.
                The first version advised removing the rating floor, which was
                simply wrong whenever no rating filter was set — and the
                commonest empty result here is category plus "publishes a
                price", because whole categories publish nothing.
              */}
              <p className="mt-3 max-w-[54ch] leading-relaxed text-[var(--color-text-muted)]">
                {chips.length === 1 ? (
                  <>Nothing in the catalogue matches {chips[0].label.toLowerCase()}.</>
                ) : (
                  <>
                    <Figure as="span">{formatNumber(chips.length)}</Figure> filters
                    are on at once. Each chip above removes only itself, so you can
                    drop the narrowest and keep the rest.
                  </>
                )}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/software" className="btn-glossy h-10 items-center px-5 text-small">
                  Clear filters
                </Link>
                <Link href="/contact?intent=listing" className="hero-chip flex h-10 items-center">
                  Suggest a product we are missing
                </Link>
              </div>
            </div>
          ) : (
            <ul className="listing-rows">
              {items.map((software) => (
                <li key={software.id}>
                  <SoftwareResultRow software={software} showCategory />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * One figure in the evidence row.
 *
 * The number counts up on load, staggered 90ms behind its neighbour, so the
 * row arrives as a tally being taken rather than three numbers that were
 * always there. CountUp server-renders the finished value, so a crawler and a
 * reader with no JavaScript both get the real figure at 0ms, and it holds the
 * final width while it runs so nothing reflows.
 *
 * The denominator does not count. It is the constant the other number is being
 * measured against, and animating both makes neither legible.
 */

/**
 * The three figures, and the reason this page opens with numbers rather than a
 * chart.
 *
 * Twenty-five of the thirty-nine products publish no price at all. A
 * distribution of that is a chart about missing data — one tall bar and five
 * stubs — and when the story is a single number, the number IS the chart. It
 * is also the honest headline for a directory whose whole claim is that it
 * checks prices against the vendor's own page.
 *
 * All three are filters, and each is counted against the total the rail beside
 * the heading already carries. They live in the page header rather than in a
 * band of their own, so the top of the page is one masthead — statement on the
 * left, evidence on the right — instead of a heading with half a row of empty
 * space beside it and a separate slab underneath.
 *
 * Exported separately from DirectoryBoard for that reason alone; both share the
 * same href builder, so a figure and its rail option can never disagree.
 */
export function DirectoryEvidence({
  facets,
  params,
}: {
  facets: DirectoryFacets;
  params: Params;
}) {
  // Three tiles reading "0 of 0" is noise; the chips carry the undo.
  if (facets.total === 0) return null;

  return (
    <dl className="directory-evidence">
      <Figures
        label="Publish a price"
        value={facets.withPrice}
        of={facets.total}
        href={href(params, "priced", params.priced === "1" ? undefined : "1")}
        active={params.priced === "1"}
      />
      <Figures
        label="Free plan"
        value={facets.freeVersion}
        of={facets.total}
        delay={90}
        href={href(params, "free", params.free === "1" ? undefined : "1")}
        active={params.free === "1"}
      />
      <Figures
        label="Free trial"
        value={facets.freeTrial}
        of={facets.total}
        delay={180}
        href={href(params, "trial", params.trial === "1" ? undefined : "1")}
        active={params.trial === "1"}
      />
    </dl>
  );
}

function Figures({
  label,
  value,
  of,
  href: to,
  active,
  delay = 0,
}: {
  label: string;
  value: number;
  of?: number;
  href?: string;
  active?: boolean;
  delay?: number;
}) {
  const body = (
    <>
      <dd className="directory-figure">
        <Figure as="span">
          <CountUp value={value} formatted={formatNumber(value)} delay={delay} />
        </Figure>
        {of !== undefined && (
          <span className="directory-figure-of">
            {" "}of <Figure as="span">{formatNumber(of)}</Figure>
          </span>
        )}
      </dd>
      <dt className="directory-figure-label">{label}</dt>
    </>
  );

  /*
    flex-col-reverse rather than reordering the markup: a <dl> group may only
    hold <dt> then <dd>, and swapping them would be invalid.
  */
  return (
    <div className="directory-evidence-item" data-active={active ? "true" : undefined}>
      {to ? (
        <Link href={to} className="directory-evidence-link">
          <span className="flex flex-col-reverse">{body}</span>
        </Link>
      ) : (
        <span className="flex flex-col-reverse">{body}</span>
      )}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="listing-group">
      <h2 className="text-small text-[var(--color-text-muted)]">{title}</h2>
      {/*
        A class, not utilities. The mobile breakpoint turns this list into a
        horizontally scrolling row, and a `flex-col` utility would win over
        that rule however specific it is — utilities sit in a later cascade
        layer than @layer components.
      */}
      <ul className="directory-options">{children}</ul>
    </div>
  );
}

function Option({
  href: to,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link href={to} className="directory-option" data-active={active ? "true" : "false"}>
        {children}
      </Link>
    </li>
  );
}
