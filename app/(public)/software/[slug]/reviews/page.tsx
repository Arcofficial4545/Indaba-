import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AffiliateCTAButton } from "@/components/public/AffiliateCTAButton";
import { AffiliateDisclosureNote } from "@/components/public/AffiliateDisclosureNote";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { GlossyButton } from "@/components/public/GlossyButton";
import { Pagination } from "@/components/public/Pagination";
import { ReviewCard } from "@/components/public/ReviewCard";
import { ReviewFilters } from "@/components/public/ReviewFilters";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { SoftwareSidebar } from "@/components/public/SoftwareSidebar";
import { StarRating } from "@/components/public/StarRating";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatNumber, formatRating } from "@/lib/format";
import { getReviews } from "@/lib/queries/reviews";
import { getSoftwareBySlug } from "@/lib/queries/software";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

const PER_PAGE = 10;

export async function generateMetadata(
  props: PageProps<"/software/[slug]/reviews">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const software = await getSoftwareBySlug(slug);
  if (!software) return { title: "Not found" };

  return {
    title: `${software.name} reviews`,
    description:
      software.review_count > 0 && !software.rating_source
        ? `Every verified ${software.name} review from South African businesses. ${formatRating(software.overall_rating)} out of 5 from ${formatNumber(software.review_count)} reviewers.`
        : `Reviews of ${software.name} for South African businesses, and how to write one.`,
    alternates: { canonical: `${SITE_URL}/software/${slug}/reviews` },
  };
}

export default async function ReviewArchivePage(
  props: PageProps<"/software/[slug]/reviews">,
) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;

  const software = await getSoftwareBySlug(slug);
  if (!software) notFound();

  const asString = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const rating = asString(searchParams.rating);
  const size = asString(searchParams.size);
  const sort = asString(searchParams.sort);
  const page = Number(asString(searchParams.page) ?? "1") || 1;

  const { reviews, total } = await getReviews(software.id, {
    rating: rating ? Number(rating) : undefined,
    companySize: size,
    sort: (sort as "recent" | "helpful" | "highest" | "lowest") ?? "recent",
    limit: PER_PAGE,
    offset: (page - 1) * PER_PAGE,
  });

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <div className="container-site flex flex-col gap-10 py-8">
      <Breadcrumbs
        items={[
          { label: "Software", href: "/software" },
          { label: software.name, href: `/software/${software.slug}` },
          { label: "Reviews" },
        ]}
      />

      <header className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        <SoftwareLogo
          name={software.name}
          slug={software.slug}
          logoUrl={software.logo_url}
          brandColor={software.brand_color}
          size={64}
        />
        <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.12]">
          {software.name} <span className="brand-highlight">reviews</span>
        </h1>
        {software.review_count > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="font-heading text-2xl font-bold tabular-nums">
              {formatRating(software.overall_rating)}
            </span>
            <StarRating rating={software.overall_rating} showNumber={false} />
            {software.rating_source ? (
              <a
                href={software.rating_source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground underline underline-offset-4"
              >
                {formatNumber(software.review_count)} reviews on{" "}
                {software.rating_source.name}
              </a>
            ) : (
              <span className="text-sm text-muted-foreground">
                {formatNumber(software.review_count)} verified reviews
              </span>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No reviews yet</p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <AffiliateCTAButton
            slug={software.slug}
            name={software.name}
            brandColor={software.brand_color}
            className="h-13 px-7 text-base"
          />
          <GlossyButton
            href={`/software/${software.slug}/reviews/new`}
            size="lg"
            variant="dark"
          >
            Write a review
          </GlossyButton>
        </div>
        <AffiliateDisclosureNote className="max-w-[52ch]" />
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div className="flex min-w-0 flex-col gap-6">
          <Suspense fallback={<Skeleton className="h-48" />}>
            <ReviewFilters total={total} />
          </Suspense>

          {reviews.length === 0 ? (
            <div className="card-modern p-12 text-center">
              {rating || size ? (
                <>
                  <h2 className="font-heading text-lg font-bold tracking-tight">
                    No reviews match those filters
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try clearing the star rating or the company size.
                  </p>
                </>
              ) : software.rating_source ? (
                <>
                  <h2 className="font-heading text-lg font-bold tracking-tight">
                    No reviews on {SITE_NAME} yet
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    The rating above comes from{" "}
                    {formatNumber(software.review_count)} reviews on{" "}
                    {software.rating_source.name}, read on{" "}
                    {formatDate(software.rating_source.retrieved)}.{" "}
                    <a
                      href={software.rating_source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4"
                    >
                      Read them there
                    </a>
                    , or be the first to review it here.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="font-heading text-lg font-bold tracking-tight">
                    No reviews yet
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Be the first to review {software.name}.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            basePath={`/software/${software.slug}/reviews`}
            params={{ rating, size, sort }}
            className="pt-4"
          />
        </div>

        <div className="lg:sticky lg:top-28">
          {/*
            The spec sheet from the profile, in the slot an empty ad box held:
            price, facts, the visit CTA, add to compare and the disclosure.
          */}
          <SoftwareSidebar software={software} />
        </div>
      </div>
    </div>
  );
}
