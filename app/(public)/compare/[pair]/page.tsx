import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { AffiliateDisclosureNote } from "@/components/public/AffiliateDisclosureNote";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { CompareBoard } from "@/components/public/CompareBoard";
import { CompareMatrix } from "@/components/public/CompareMatrix";
import { Rail } from "@/components/public/Rail";
import { buildCompareGroups } from "@/lib/compare-matrix";
import { getComparisonPair } from "@/lib/queries/comparisons";
import { SITE_URL } from "@/lib/site";
import type { SoftwareWithCategory } from "@/lib/types";
import { canonicalComparisonSlug } from "@/lib/utils";

export const revalidate = 3600;

export async function generateMetadata(
  props: PageProps<"/compare/[pair]">,
): Promise<Metadata> {
  const { pair } = await props.params;
  const resolved = await getComparisonPair(pair);
  if (!resolved) return { title: "Not found" };

  const { a, b } = resolved;
  const canonical = canonicalComparisonSlug(a.slug, b.slug);

  return {
    title: `${a.name} vs ${b.name}`,
    description: `${a.name} and ${b.name} compared for South African businesses: ratings, pricing in rand, features and a verdict.`,
    // Both directions resolve, but only one carries the ranking.
    alternates: { canonical: `${SITE_URL}/compare/${canonical}` },
  };
}

export default async function ComparePairPage(
  props: PageProps<"/compare/[pair]">,
) {
  const { pair } = await props.params;
  const resolved = await getComparisonPair(pair);
  if (!resolved) notFound();

  const { a, b } = resolved;
  const canonical = canonicalComparisonSlug(a.slug, b.slug);

  // Reverse order resolves, then redirects, so the long tail query is caught
  // but the ranking consolidates on one URL.
  if (pair !== canonical) redirect(`/compare/${canonical}`);

  return (
    <>
      <div className="container-site pt-8">
        <Breadcrumbs
          items={[
            { label: "Compare", href: "/compare" },
            { label: `${a.name} vs ${b.name}` },
          ]}
        />
      </div>

      {/*
        The title is left-aligned like everything else. "vs" is not accented:
        colouring one word of a headline is banned, and on this page the
        structure below already says "versus" far more loudly than a coloured
        word could.
      */}
      <header className="container-site pt-8">
        <div className="rail-grid">
          <Rail label="Head to head" count="2" note="Same rows, same rhythm." />
          <div className="well">
            <h1 className="section-heading reveal-line">
              <span>
                {a.name} against {b.name}
              </span>
            </h1>
            <p className="mt-6 max-w-[62ch] leading-relaxed text-[var(--color-text-muted)]">
              Both are used by South African businesses and they suit different
              ones. Every row below is shared, so the two sides can be read
              across rather than in turn, and the deciding factor is rarely the
              feature list.
            </p>
          </div>
        </div>
      </header>

      <section
        aria-label={`${a.name} and ${b.name} compared`}
        className="container-site"
        style={{ paddingBlock: "3rem var(--section-1)" }}
      >
        <CompareBoard a={a} b={b} />
      </section>

      {/*
        The verdict: one centred statement, and the only centred element on the
        site. It is what that allowance was saved for.

        It used to carry two paragraphs of reasoning underneath. Those facts now
        sit in the "Pick X if" list inside each column, where they are beside
        the button they argue for and can be scanned rather than read — so
        keeping them here as prose was the page making its case twice and
        burying the headline under a slab of sand.
      */}
      <Verdict a={a} b={b} />

      <section
        aria-label="Features and pricing in detail"
        className="container-site"
        style={{ paddingBlock: "var(--section-2)" }}
      >
        <CompareMatrix
          groups={buildCompareGroups(a, b)}
          a={{ name: a.name, slug: a.slug }}
          b={{ name: b.name, slug: b.slug }}
        />
        <AffiliateDisclosureNote className="mt-8" />
      </section>
    </>
  );
}

function Verdict({
  a,
  b,
}: {
  a: SoftwareWithCategory;
  b: SoftwareWithCategory;
}) {
  const leader =
    a.overall_rating === b.overall_rating
      ? null
      : a.overall_rating > b.overall_rating
        ? a
        : b;
  const other = leader ? (leader.id === a.id ? b : a) : null;

  return (
    <section aria-labelledby="verdict-heading" className="verdict-band">
      <div className="container-site">
        <div className="verdict-inner">
          <p className="text-small text-[var(--color-text-on-sand)]/70">
            What to pick
          </p>

          <h2 id="verdict-heading" className="verdict-statement">
            {leader && other ? (
              <>
                Choose {leader.name} on satisfaction, {other.name} if{" "}
                {bestDimension(other)} is what you feel every week.
              </>
            ) : (
              <>
                They rate evenly, so choose on {bestDimension(a)} against{" "}
                {bestDimension(b)}.
              </>
            )}
          </h2>


          <AffiliateDisclosureNote className="verdict-disclosure" />
        </div>
      </div>
    </section>
  );
}

function bestDimension(software: {
  ease_of_use_rating: number;
  value_for_money_rating: number;
  customer_service_rating: number;
  functionality_rating: number;
}): string {
  const scores = [
    { label: "ease of use", value: software.ease_of_use_rating },
    { label: "value for money", value: software.value_for_money_rating },
    { label: "customer service", value: software.customer_service_rating },
    { label: "functionality", value: software.functionality_rating },
  ];
  return scores.sort((x, y) => y.value - x.value)[0].label;
}
