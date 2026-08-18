import type { Metadata } from "next";
import Link from "next/link";
import { SearchXIcon } from "lucide-react";

import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { SearchBar } from "@/components/public/SearchBar";
import { SoftwareListRow } from "@/components/public/SoftwareListRow";
import { formatDate, formatNumber, formatReadTime } from "@/lib/format";
import { search } from "@/lib/queries/search";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Search",
  description: "Search software, categories and buying guides across Indaba.",
  alternates: { canonical: `${SITE_URL}/search` },
  // Search result pages are thin and near infinite in number.
  robots: { index: false, follow: true },
};

export default async function SearchPage(props: PageProps<"/search">) {
  const searchParams = await props.searchParams;
  const raw = Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q;
  const query = (raw ?? "").trim();

  const results = query
    ? await search(query)
    : { software: [], articles: [], total: 0 };

  return (
    <div className="container-site flex flex-col gap-10 py-8">
      <Breadcrumbs items={[{ label: "Search" }]} />

      <header className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.12]">
          {query ? (
            <>
              Results for{" "}
              <span className="brand-highlight">{query}</span>
            </>
          ) : (
            <>
              Search <span className="brand-highlight">Indaba</span>
            </>
          )}
        </h1>

        <SearchBar defaultValue={query} autoFocus={!query} />

        {query && (
          <p className="text-sm text-muted-foreground tabular-nums">
            {formatNumber(results.total)}{" "}
            {results.total === 1 ? "result" : "results"}
          </p>
        )}
      </header>

      {query && results.total === 0 && (
        <div className="card-modern mx-auto flex max-w-lg flex-col items-center gap-3 p-12 text-center">
          <SearchXIcon
            className="size-8 text-muted-foreground"
            aria-hidden="true"
          />
          <h2 className="font-heading text-lg font-bold tracking-tight">
            Nothing matched that
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Try a vendor name such as Sage or Xero, or browse the{" "}
            <Link
              href="/software"
              className="text-[var(--color-brand-dark)] underline underline-offset-4"
            >
              full directory
            </Link>
            .
          </p>
        </div>
      )}

      {results.software.length > 0 && (
        <section aria-labelledby="software-results">
          <h2
            id="software-results"
            className="mb-5 font-heading text-2xl font-bold tracking-tight"
          >
            Software
          </h2>
          <div className="flex flex-col gap-4">
            {results.software.map((item) => (
              <SoftwareListRow key={item.id} software={item} />
            ))}
          </div>
        </section>
      )}

      {results.articles.length > 0 && (
        <section aria-labelledby="guide-results">
          <h2
            id="guide-results"
            className="mb-5 font-heading text-2xl font-bold tracking-tight"
          >
            Guides
          </h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {results.articles.map((article) => (
              <article
                key={article.id}
                className="card-modern card-modern-hover group relative flex flex-col gap-3 p-6"
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
                <h3 className="font-heading text-base font-bold tracking-tight text-balance">
                  <Link
                    href={`/blog/${article.slug}`}
                    className="after:absolute after:inset-0 after:rounded-[1.5rem] focus-visible:outline-none"
                  >
                    {article.title}
                  </Link>
                </h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {article.excerpt}
                </p>
                <p className="mt-auto border-t border-border pt-3 text-xs text-muted-foreground">
                  {formatReadTime(article.read_time_minutes)}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
