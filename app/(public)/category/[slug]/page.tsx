import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { CategoryResults } from "@/components/public/CategoryResults";
import { Figure } from "@/components/public/Figure";
import { Rail } from "@/components/public/Rail";
import { formatNumber } from "@/lib/format";
import { getCategoryIntro } from "@/lib/content/categoryIntros";
import { getCategories, getCategoryBySlug } from "@/lib/queries/categories";
import { getSoftwareByCategory } from "@/lib/queries/software";
import { ogImageUrl, SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata(
  props: PageProps<"/category/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Not found" };

  const title = `Best ${category.name.toLowerCase()} in South Africa`;
  const description =
    category.description ??
    `Independent reviews and comparisons of ${category.name.toLowerCase()} for South African businesses, with prices in rand.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/category/${category.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/category/${category.slug}`,
      images: [
        {
          url: ogImageUrl({
            title: category.name,
            eyebrow: "Category",
            subtitle: description,
          }),
          width: 1200,
          height: 630,
          alt: `${category.name} on ${SITE_NAME}`,
        },
      ],
    },
  };
}

export default async function CategoryPage(
  props: PageProps<"/category/[slug]">,
) {
  const { slug } = await props.params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [software, intro, allCategories] = await Promise.all([
    getSoftwareByCategory(category.id),
    Promise.resolve(getCategoryIntro(category.slug)),
    getCategories(),
  ]);

  // Reviews on this site only; third-party counts are someone else's reviews.
  const reviewTotal = software.reduce(
    (sum, item) => (item.rating_source ? sum : sum + item.review_count),
    0,
  );

  return (
    <>
      <div className="container-site pt-8">
        <Breadcrumbs
          items={[
            { label: "Categories", href: "/categories" },
            { label: category.name },
          ]}
        />
      </div>

      {/*
        Left aligned, no icon tile, no accented half-heading. The count under
        the title is the evidence and it is the first thing after the name.
      */}
      <header className="container-site pt-8">
        <div className="rail-grid">
          <Rail
            label="Category"
            count={formatNumber(software.length)}
            note="Products reviewed here."
          />
          <div className="well">
            <h1 className="section-heading reveal-line">
              <span>Best {category.name.toLowerCase()} in South Africa</span>
            </h1>
            <p className="mt-6 max-w-[62ch] leading-relaxed text-[var(--color-text-muted)]">
              {intro?.standfirst ?? category.description}
            </p>
            <p className="mt-6 text-small text-[var(--color-text-muted)]">
              <Figure as="span">{formatNumber(software.length)}</Figure>{" "}
              products, <Figure as="span">{formatNumber(reviewTotal)}</Figure>{" "}
              reviews behind them, ordered by a weighted average that accounts
              for how many reviews sit behind each score.
            </p>
          </div>
        </div>
      </header>

      <div
        className="container-site"
        style={{ paddingBlock: "var(--section-2)" }}
      >
        <CategoryResults
          software={software}
          checklist={intro?.checklist ?? []}
          categories={allCategories.map((entry) => ({
            name: entry.name,
            slug: entry.slug,
            count: entry.software_count,
            current: entry.slug === category.slug,
          }))}
          categoryName={category.name}
        />
      </div>

      {intro && intro.checklist.length > 0 && (
        <section
          aria-labelledby="checklist-heading"
          className="container-site"
          style={{ paddingBlock: "var(--section-2)" }}
        >
          <div className="rail-grid">
            <Rail
              label="Before you choose"
              count={formatNumber(intro.checklist.length)}
              note="Things that decide it locally."
            />
            <div className="well">
              <h2 id="checklist-heading" className="section-heading reveal-line">
                <span>What actually matters in this category.</span>
              </h2>
              <dl className="mt-10">
                {intro.checklist.map((item) => (
                  <div key={item.title} className="checklist-row">
                    <dt className="text-h3 font-medium tracking-[-0.01em]">
                      {item.title}
                    </dt>
                    <dd className="mt-2 max-w-[62ch] leading-relaxed text-[var(--color-text-muted)]">
                      {item.body}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      )}

      <section
        aria-label="Other categories"
        className="container-site"
        style={{ paddingBottom: "var(--section-3)" }}
      >
        <div className="rail-grid">
          <Rail label="Elsewhere" count={formatNumber(allCategories.length)} />
          <div className="well flex flex-wrap gap-2">
            {allCategories
              .filter((entry) => entry.slug !== category.slug)
              .map((entry) => (
                <Link
                  key={entry.id}
                  href={`/category/${entry.slug}`}
                  className="hero-chip"
                >
                  {entry.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
