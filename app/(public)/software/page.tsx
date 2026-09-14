import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { DirectoryBoard, DirectoryEvidence } from "@/components/public/DirectoryBoard";
import { Figure } from "@/components/public/Figure";
import { Pagination } from "@/components/public/Pagination";
import { Rail } from "@/components/public/Rail";
import { formatNumber } from "@/lib/format";
import { getCategories } from "@/lib/queries/categories";
import { getDirectory } from "@/lib/queries/software";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Business software directory",
  description:
    "Every accounting, payroll, HR, CRM, ERP and project management package we have reviewed, with ratings from South African users and prices in rand.",
  alternates: { canonical: `${SITE_URL}/software` },
};

/**
 * Big enough that the whole catalogue is one page today, and paginated the day
 * it is not.
 *
 * Ten per page meant four pages for thirty-nine products: three extra round
 * trips to see a list that fits comfortably in one scroll, and three quarters
 * of the catalogue invisible to a crawler on the page that is meant to be the
 * directory. Pagination is kept because it will be needed; it simply does not
 * fire yet, and `Pagination` renders nothing at a single page.
 */
const PER_PAGE = 48;

export default async function DirectoryPage(props: PageProps<"/software">) {
  const searchParams = await props.searchParams;

  const asString = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const params = {
    q: asString(searchParams.q),
    category: asString(searchParams.category),
    rating: asString(searchParams.rating),
    trial: asString(searchParams.trial),
    free: asString(searchParams.free),
    priced: asString(searchParams.priced),
    sort: asString(searchParams.sort),
  };
  const page = Number(asString(searchParams.page) ?? "1") || 1;

  const [categories, result] = await Promise.all([
    getCategories(),
    getDirectory({
      query: params.q,
      category: params.category,
      minRating: params.rating ? Number(params.rating) : undefined,
      freeTrial: params.trial === "1",
      freeVersion: params.free === "1",
      hasPrice: params.priced === "1",
      sort: (params.sort as "reviewed" | "rated" | "updated" | "price") ?? "reviewed",
      page,
      perPage: PER_PAGE,
    }),
  ]);

  const activeCategory = categories.find((c) => c.slug === params.category);
  const catalogue = categories.reduce((n, c) => n + c.software_count, 0);

  return (
    <>
      <div className="container-site pt-8">
        <Breadcrumbs items={[{ label: "Software" }]} />
      </div>

      {/*
        Left aligned on the rail, like every other page. The old header was
        centred, carried an accented half-heading and set its h1 in 700 — three
        things the type and layout rules each ban on their own.
      */}
      <header className="container-site pt-8">
        <div className="rail-grid">
          <Rail
            label="Software"
            count={formatNumber(catalogue)}
            note="Prices in rand, VAT basis stated."
          />
          {/*
            A masthead: the statement on the left, the evidence on the right.
            The heading wraps at its own measure and left about half the row
            empty beside it, with the figures in a separate band underneath —
            two weaknesses that cancel each other out when the figures move up.
          */}
          <div className="well directory-masthead">
            <div className="directory-masthead-copy">
            <h1 className="section-heading reveal-line">
              <span>
                {activeCategory
                  ? `${activeCategory.name.replace(/ Software$/, "")} reviewed for South Africa`
                  : "Every product we have reviewed"}
              </span>
            </h1>
            <p className="mt-6 max-w-[62ch] leading-relaxed text-[var(--color-text-muted)]">
              Rated by the people who run them, priced in rand with the VAT
              basis stated, and checked against the vendor&rsquo;s own South
              African page. Pick two and compare them side by side.
            </p>
            </div>
            <DirectoryEvidence facets={result.facets} params={params} />
          </div>
        </div>
      </header>

      <div className="container-site" style={{ paddingBlock: "3rem var(--section-2)" }}>
        <DirectoryBoard
          items={result.items}
          facets={result.facets}
          categories={categories}
          params={params}
        />

        {result.totalPages > 1 && (
          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            basePath="/software"
            params={params}
            className="pt-10"
          />
        )}
      </div>

      {/*
        The one thing the old page never said out loud, and the reason the
        figures at the top are worth reading: a quarter of this market will not
        tell you what it costs until you talk to sales.
      */}
      <aside className="container-site pb-[var(--section-2)]">
        <div className="rail-grid">
          <Rail label="Method" note="How the prices here are established." />
          <p className="well max-w-[62ch] leading-relaxed text-[var(--color-text-muted)]">
            Where a vendor publishes a South African list price we quote it and
            state whether VAT is included. Where one does not, the entry says
            &ldquo;pricing on request&rdquo; rather than an estimate, because a
            number we invented would be the least trustworthy figure on the
            page. That is why{" "}
            <Figure as="span">{formatNumber(catalogue - result.facets.withPrice)}</Figure>{" "}
            of these listings carry no price.
          </p>
        </div>
      </aside>
    </>
  );
}
