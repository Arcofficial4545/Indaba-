import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClipboardCheckIcon, TrophyIcon } from "lucide-react";

import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { CategoryIcon } from "@/components/public/CategoryIcon";
import { SectionHeader } from "@/components/public/SectionHeader";
import { SoftwareListRow } from "@/components/public/SoftwareListRow";
import { formatNumber } from "@/lib/format";
import { getCategoryIntro } from "@/lib/content/categoryIntros";
import { getCategories, getCategoryBySlug } from "@/lib/queries/categories";
import { getSoftwareByCategory } from "@/lib/queries/software";
import { SITE_URL } from "@/lib/site";

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

  return {
    title: `Best ${category.name.toLowerCase()} in South Africa`,
    description:
      category.description ??
      `Independent reviews and comparisons of ${category.name.toLowerCase()} for South African businesses, with prices in rand.`,
    alternates: { canonical: `${SITE_URL}/category/${category.slug}` },
  };
}

export default async function CategoryPage(
  props: PageProps<"/category/[slug]">,
) {
  const { slug } = await props.params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [software, intro] = await Promise.all([
    getSoftwareByCategory(category.id),
    Promise.resolve(getCategoryIntro(category.slug)),
  ]);

  return (
    <div className="container-site flex flex-col gap-16 py-8">
      <Breadcrumbs
        items={[
          { label: "Categories", href: "/categories" },
          { label: category.name },
        ]}
      />

      <header className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        <span
          aria-hidden="true"
          className="grid size-14 place-items-center rounded-2xl bg-[var(--color-brand-light)] text-[var(--color-brand-dark)]"
        >
          <CategoryIcon name={category.icon} className="size-7" />
        </span>

        <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.12]">
          Best {category.name.toLowerCase()} in{" "}
          <span className="brand-highlight">South Africa</span>
        </h1>

        <p className="text-base leading-relaxed text-pretty text-muted-foreground">
          {intro?.standfirst ?? category.description}
        </p>

        <p className="text-sm text-muted-foreground tabular-nums">
          {formatNumber(software.length)} products reviewed
        </p>
      </header>

      {/* What to look for ------------------------------------------------- */}
      {intro && (
        <section aria-labelledby="checklist-heading">
          <SectionHeader
            eyebrow="Before you choose"
            icon={ClipboardCheckIcon}
            title="What actually"
            highlight="matters here"
            headingId="checklist-heading"
            className="mb-10"
          />

          <div className="rounded-[1.75rem] bg-zinc-100/80 p-2 dark:bg-zinc-900/60">
            <div className="grid gap-2 md:grid-cols-2">
              {intro.checklist.map((item, index) => (
                <div
                  key={item.title}
                  className="flex flex-col gap-3 rounded-[1.4rem] border border-zinc-200/70 bg-card p-6 dark:border-zinc-800"
                >
                  <span
                    aria-hidden="true"
                    className="font-heading text-sm font-bold text-[var(--color-brand-dark)] tabular-nums"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-heading text-base font-bold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* The products ----------------------------------------------------- */}
      <section aria-labelledby="products-heading">
        <SectionHeader
          eyebrow="Ranked"
          icon={TrophyIcon}
          title="Rated by the people"
          highlight="who run them"
          subtitle="Ordered by a weighted average that accounts for how many reviews sit behind each score."
          headingId="products-heading"
          className="mb-10"
        />

        {software.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Nothing published in this category yet.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {software.map((item) => (
              <SoftwareListRow key={item.id} software={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
