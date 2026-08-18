import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { Pagination } from "@/components/public/Pagination";
import { formatDate, formatReadTime } from "@/lib/format";
import { getLatestArticles } from "@/lib/queries/articles";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Buying guides",
  description:
    "Long form guides to choosing business software in South Africa, written by people who have done the migration rather than by a marketing team.",
  alternates: { canonical: `${SITE_URL}/blog` },
};

const PER_PAGE = 9;

export default async function BlogIndexPage(props: PageProps<"/blog">) {
  const searchParams = await props.searchParams;
  const rawPage = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page;
  const page = Number(rawPage ?? "1") || 1;

  const all = await getLatestArticles(200);
  const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE));
  const current = Math.min(Math.max(1, page), totalPages);

  // The newest article gets the hero treatment, but only on page one.
  const featured = current === 1 ? all[0] : null;
  const listSource = featured ? all.slice(1) : all;
  const offset = current === 1 ? 0 : (current - 1) * PER_PAGE - 1;
  const items = listSource.slice(offset, offset + PER_PAGE);

  return (
    <div className="container-site flex flex-col gap-12 py-8">
      <Breadcrumbs items={[{ label: "Guides" }]} />

      <header className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.12]">
          Work out what you{" "}
          <span className="brand-highlight">actually need</span>
        </h1>
        <p className="text-base leading-relaxed text-pretty text-muted-foreground">
          Guides to buying business software in South Africa. Real numbers,
          honest about the trade offs, and written for people who have to live
          with the decision.
        </p>
      </header>

      {featured && (
        <article className="card-modern card-modern-hover group relative overflow-hidden p-8 sm:p-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="rounded-full bg-[var(--color-brand)] px-2.5 py-1 font-semibold text-[var(--color-brand-ink)]">
              Latest
            </span>
            {featured.category_tag && <span>{featured.category_tag}</span>}
            <time dateTime={featured.published_date}>
              {formatDate(featured.published_date)}
            </time>
            <span aria-hidden="true">/</span>
            <span>{formatReadTime(featured.read_time_minutes)}</span>
          </div>

          <h2 className="mt-4 max-w-3xl font-heading text-2xl font-bold tracking-tight text-balance sm:text-4xl">
            <Link
              href={`/blog/${featured.slug}`}
              className="after:absolute after:inset-0 focus-visible:outline-none"
            >
              {featured.title}
            </Link>
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground">
            {featured.excerpt}
          </p>

          <p className="mt-6 text-sm text-muted-foreground">
            {featured.author_name}
            {featured.author_title && (
              <span className="text-muted-foreground/60">
                {" "}
                / {featured.author_title}
              </span>
            )}
          </p>
        </article>
      )}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((article) => (
          <article
            key={article.id}
            className="card-modern card-modern-hover group relative flex flex-col gap-4 p-6"
          >
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
              {article.category_tag && (
                <span className="rounded-full bg-muted px-2.5 py-1 font-semibold text-foreground/70">
                  {article.category_tag}
                </span>
              )}
              <time dateTime={article.published_date}>
                {formatDate(article.published_date)}
              </time>
            </div>

            <h2 className="font-heading text-lg font-bold tracking-tight text-balance">
              <Link
                href={`/blog/${article.slug}`}
                className="after:absolute after:inset-0 after:rounded-[1.5rem] focus-visible:outline-none"
              >
                {article.title}
              </Link>
            </h2>

            <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {article.excerpt}
            </p>

            <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
              <span>{article.author_name}</span>
              <span>{formatReadTime(article.read_time_minutes)}</span>
            </div>
          </article>
        ))}
      </div>

      <Pagination
        page={current}
        totalPages={totalPages}
        basePath="/blog"
        className="pt-4"
      />
    </div>
  );
}
