import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { CompareDashboard } from "@/components/public/CompareDashboard";
import { CompareStickyBar } from "@/components/public/CompareStickyBar";
import { AffiliateDisclosureNote } from "@/components/public/AffiliateDisclosureNote";
import { formatRating } from "@/lib/format";
import { getComparisonPair } from "@/lib/queries/comparisons";
import { SITE_URL } from "@/lib/site";
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

  const leader =
    a.overall_rating === b.overall_rating
      ? null
      : a.overall_rating > b.overall_rating
        ? a
        : b;
  const other = leader ? (leader.id === a.id ? b : a) : null;

  return (
    <div className="container-site flex flex-col gap-12 py-8 pb-32 lg:pb-8">
      <Breadcrumbs
        items={[
          { label: "Compare", href: "/compare" },
          { label: `${a.name} vs ${b.name}` },
        ]}
      />

      <header className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.12]">
          {a.name} <span className="brand-highlight">vs</span> {b.name}
        </h1>
        <p className="text-base leading-relaxed text-pretty text-muted-foreground">
          Both are used by South African businesses. They suit different ones,
          and the deciding factor is rarely the feature list.
        </p>
      </header>

      <CompareDashboard a={a} b={b} />

      {/* Verdict ---------------------------------------------------------- */}
      <section
        aria-labelledby="verdict-heading"
        className="rounded-[2.5rem] bg-[var(--color-navy)] p-8 text-white sm:p-12"
      >
        <h2
          id="verdict-heading"
          className="font-heading text-2xl font-medium tracking-tight text-balance sm:text-3xl"
        >
          The <span className="brand-highlight">verdict</span>
        </h2>

        <div className="mt-5 flex max-w-2xl flex-col gap-4 text-base leading-relaxed text-white/70">
          {leader && other ? (
            <>
              <p>
                {leader.name} rates {formatRating(leader.overall_rating)} against{" "}
                {formatRating(other.overall_rating)} for {other.name}, which is a
                real but not decisive gap. Read it as a signal about
                satisfaction, not as a ranking of capability.
              </p>
              <p>
                Where they separate is in the detail. {a.name} scores best on{" "}
                {bestDimension(a)}, while {b.name} leads on {bestDimension(b)}.
                Work out which of those two your business actually feels every
                week, and choose on that rather than on the overall number.
              </p>
            </>
          ) : (
            <p>
              The two rate evenly overall, so the overall score tells you
              nothing useful here. {a.name} scores best on {bestDimension(a)},
              while {b.name} leads on {bestDimension(b)}. Decide on which of
              those matters more to how you work.
            </p>
          )}
        </div>

        <AffiliateDisclosureNote className="mt-8 text-white/45" />
      </section>

      <CompareStickyBar a={a} b={b} />
    </div>
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
