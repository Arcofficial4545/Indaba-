import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchXIcon } from "lucide-react";

import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { DirectorySort } from "@/components/public/DirectorySort";
import { FilterSidebar } from "@/components/public/FilterSidebar";
import { Pagination } from "@/components/public/Pagination";
import { SoftwareListRow } from "@/components/public/SoftwareListRow";
import { Skeleton } from "@/components/ui/skeleton";
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

const PER_PAGE = 10;

export default async function DirectoryPage(props: PageProps<"/software">) {
  const searchParams = await props.searchParams;

  const asString = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const category = asString(searchParams.category);
  const rating = asString(searchParams.rating);
  const trial = asString(searchParams.trial);
  const free = asString(searchParams.free);
  const paid = asString(searchParams.paid);
  const sort = asString(searchParams.sort);
  const page = Number(asString(searchParams.page) ?? "1") || 1;

  const [categories, result] = await Promise.all([
    getCategories(),
    getDirectory({
      category,
      minRating: rating ? Number(rating) : undefined,
      freeTrial: trial === "1",
      freeVersion: free === "1",
      paidOnly: paid === "1",
      sort: (sort as "reviewed" | "rated" | "updated" | "price") ?? "reviewed",
      page,
      perPage: PER_PAGE,
    }),
  ]);

  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div className="container-site flex flex-col gap-10 py-8">
      <Breadcrumbs items={[{ label: "Software" }]} />

      <header className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.12]">
          {activeCategory ? activeCategory.name : "Business software"} reviewed
          for{" "}
          <span className="brand-highlight">South Africa</span>
        </h1>
        <p className="text-base leading-relaxed text-pretty text-muted-foreground">
          {formatNumber(result.total)} products, rated by the people who run
          them. Prices are shown in rand with the VAT basis stated.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
        <Suspense fallback={<Skeleton className="h-96" />}>
          <FilterSidebar categories={categories} />
        </Suspense>

        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground tabular-nums">
                {result.items.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground tabular-nums">
                {formatNumber(result.total)}
              </span>
            </p>
            <Suspense fallback={null}>
              <DirectorySort />
            </Suspense>
          </div>

          {result.items.length === 0 ? (
            <div className="card-modern flex flex-col items-center gap-3 p-12 text-center">
              <SearchXIcon
                className="size-8 text-muted-foreground"
                aria-hidden="true"
              />
              <h2 className="font-heading text-lg font-bold tracking-tight">
                Nothing matches those filters
              </h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                Try widening the rating, or clearing the availability filters.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {result.items.map((software) => (
                <SoftwareListRow key={software.id} software={software} />
              ))}
            </div>
          )}

          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            basePath="/software"
            params={{ category, rating, trial, free, paid, sort }}
            className="pt-4"
          />
        </div>
      </div>
    </div>
  );
}
