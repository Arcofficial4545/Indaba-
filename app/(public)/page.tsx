import Link from "next/link";
import {
  ArrowUpRightIcon,
  BookOpenIcon,
  ClockIcon,
  LayersIcon,
  ScaleIcon,
  TrophyIcon,
} from "lucide-react";

import { ComparisonCard } from "@/components/public/ComparisonCard";
import { HeroShapes } from "@/components/public/HeroShapes";
import { HomepageExplore } from "@/components/public/HomepageExplore";
import { NewsletterSection } from "@/components/public/NewsletterSection";
import { SearchBar } from "@/components/public/SearchBar";
import { SectionHeader } from "@/components/public/SectionHeader";
import { SoftwareCard } from "@/components/public/SoftwareCard";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { StarRating } from "@/components/public/StarRating";
import { GlossyCTA } from "@/components/public/GlossyCTA";
import { formatDate, formatNumber, formatReadTime } from "@/lib/format";
import { getLatestArticles } from "@/lib/queries/articles";
import { getCategories } from "@/lib/queries/categories";
import { getTrendingComparisons } from "@/lib/queries/comparisons";
import {
  getRecentlyReviewedSoftware,
  getSoftwareByCategory,
  getStarDistributions,
  getTopRatedSoftware,
} from "@/lib/queries/software";
import { getSiteStats } from "@/lib/queries/stats";
import type { SoftwareWithCategory } from "@/lib/types";

export const revalidate = 3600;

export default async function HomePage() {
  const [categories, stats, topRated, recent, articles, comparisons] =
    await Promise.all([
      getCategories(),
      getSiteStats(),
      getTopRatedSoftware(3),
      getRecentlyReviewedSoftware(3),
      getLatestArticles(3),
      getTrendingComparisons(3),
    ]);

  // Live star spreads, so the sentiment strip on each card is real data.
  const distributions = await getStarDistributions(topRated.map((s) => s.id));

  const softwareByCategory: Record<string, SoftwareWithCategory[]> = {};
  await Promise.all(
    categories.map(async (category) => {
      softwareByCategory[category.id] = await getSoftwareByCategory(
        category.id,
        6,
      );
    }),
  );

  return (
    <div className="container-site flex flex-col gap-16 pb-8 sm:gap-20">
      {/* ---------------------------------------------------------------- */}
      {/* 1. Hero                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section aria-labelledby="hero-heading" className="pt-4">
        <div className="relative overflow-hidden rounded-[2.5rem] shadow-[0_40px_80px_-40px_rgba(15,23,42,0.35)]">
          {/*
            The photographic plate. Until a licensed hero image is in place
            this is a layered gradient, which keeps the page weightless and
            avoids shipping a placeholder stock photo to production.
          */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#eef2e0] dark:bg-[#161a12]"
            style={{
              backgroundImage: `
                radial-gradient(at 18% 22%, rgba(217, 246, 95, 0.55) 0px, transparent 55%),
                radial-gradient(at 82% 18%, rgba(27, 31, 59, 0.20) 0px, transparent 50%),
                radial-gradient(at 72% 88%, rgba(245, 166, 35, 0.28) 0px, transparent 48%),
                radial-gradient(at 30% 92%, rgba(164, 197, 33, 0.35) 0px, transparent 50%)
              `,
            }}
          />
          {/* The white wash that keeps the text readable over the plate */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.72)_45%,rgba(255,255,255,0.25)_100%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(12,14,20,0.90)_0%,rgba(12,14,20,0.70)_45%,rgba(12,14,20,0.30)_100%)]"
          />

          <HeroShapes />

          <div className="relative flex flex-col items-center gap-7 px-5 py-20 text-center sm:px-10 sm:py-28 lg:py-32">
            <h1
              id="hero-heading"
              className="max-w-3xl font-heading text-[2rem] leading-[1.1] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl"
            >
              Find the right software
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-pretty text-foreground/70 sm:text-lg">
              Independent reviews, verified ratings and honest comparisons of the
              accounting, payroll, HR and CRM software South African businesses
              actually run.
            </p>

            <SearchBar className="mt-2 max-w-2xl" />

            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm font-medium text-foreground/60">
                Popular:
              </span>
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="rounded-full border border-white/50 bg-white/70 px-3.5 py-1.5 text-sm font-medium text-foreground/80 backdrop-blur-sm transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20"
                >
                  {category.name.replace(" Software", "")}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* 2. Stats bar, overlapping the hero                              */}
        {/* -------------------------------------------------------------- */}
        <div className="relative z-10 mx-auto -mt-8 w-full max-w-4xl px-2 sm:-mt-10">
          <dl className="card-modern grid divide-y divide-border px-6 py-7 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <Stat
              value={formatNumber(stats.reviewCount)}
              label="Verified reviews"
              shape="donut"
            />
            <Stat
              value={formatNumber(stats.softwareCount)}
              label="Software listed"
              shape="cube"
            />
            <Stat
              value={formatNumber(stats.categoryCount)}
              label="Categories covered"
              shape="star"
            />
          </dl>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 3. Category explorer                                              */}
      {/* ---------------------------------------------------------------- */}
      <section aria-labelledby="explore-heading" className="reveal-on-scroll">
        <SectionHeader
          eyebrow="Browse by category"
          icon={LayersIcon}
          title="Start with"
          highlight="what you need"
          subtitle="Six categories, each judged against the same local yardstick: SARS compliance, rand pricing and support you can actually reach."
          headingId="explore-heading"
          className="mb-10"
        />
        <HomepageExplore
          categories={categories}
          softwareByCategory={softwareByCategory}
        />
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 4. Comparisons strip                                              */}
      {/* ---------------------------------------------------------------- */}
      {comparisons.length > 0 && (
        <section aria-labelledby="compare-heading" className="reveal-on-scroll">
          <SectionHeader
            eyebrow="Head to head"
            icon={ScaleIcon}
            title="The shortlists people"
            highlight="keep arguing about"
            subtitle="Same feature set, same price table, no marketing copy. Read both sides and decide."
            headingId="compare-heading"
            className="mb-10"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {comparisons.map((pair) => (
              <ComparisonCard key={pair.comparison.id} pair={pair} />
            ))}
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* 5. Top rated                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section aria-labelledby="top-rated-heading" className="reveal-on-scroll">
        <SectionHeader
          eyebrow="Top rated"
          icon={TrophyIcon}
          title="Rated highest by"
          highlight="people who use it"
          subtitle="Ranked by a weighted average, not a raw star count, so a product with four hundred reviews is not beaten by one with thirty."
          headingId="top-rated-heading"
          className="mb-10"
        />
        <div className="grid gap-5 md:grid-cols-3">
          {topRated.map((software, index) => (
            <SoftwareCard
              key={software.id}
              software={software}
              distribution={distributions[software.id]}
              rank={index + 1}
            />
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 6. Newsletter band                                                */}
      {/* ---------------------------------------------------------------- */}
      <div className="reveal-on-scroll">
        <NewsletterSection />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* 7. Recently reviewed                                              */}
      {/* ---------------------------------------------------------------- */}
      <section aria-labelledby="recent-heading" className="reveal-on-scroll">
        <SectionHeader
          eyebrow="Recently reviewed"
          icon={ClockIcon}
          title="Fresh off"
          highlight="the desk"
          subtitle="Every listing is re checked quarterly, including the price and whether it includes VAT."
          headingId="recent-heading"
          className="mb-10"
        />

        <div className="rounded-[1.75rem] bg-zinc-100/80 p-2 dark:bg-zinc-900/60">
          <div className="grid gap-2 md:grid-cols-3">
            {recent.map((software, index) => (
              <Link
                key={software.id}
                href={`/software/${software.slug}`}
                className="group flex items-start gap-4 rounded-[1.4rem] border border-zinc-200/70 bg-card p-6 transition-colors hover:border-zinc-300 focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none dark:border-zinc-800 dark:hover:border-zinc-700"
              >
                <span
                  aria-hidden="true"
                  className="font-heading text-2xl font-bold text-muted-foreground/30 tabular-nums transition-colors group-hover:text-[var(--color-brand-dark)]"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <SoftwareLogo
                      name={software.name}
                      slug={software.slug}
                      logoUrl={software.logo_url}
                      brandColor={software.brand_color}
                      size={36}
                    />
                    <p className="truncate font-heading text-base font-bold tracking-tight">
                      {software.name}
                    </p>
                  </div>

                  <StarRating
                    rating={software.overall_rating}
                    size="sm"
                    reviewCount={software.review_count}
                    className="mt-3"
                  />

                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {software.description_short}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 8. Blog preview                                                   */}
      {/* ---------------------------------------------------------------- */}
      <section aria-labelledby="guides-heading" className="reveal-on-scroll">
        <SectionHeader
          eyebrow="Buying guides"
          icon={BookOpenIcon}
          title="Work out what"
          highlight="you actually need"
          subtitle="Long form guides written by people who have done the migration, not by a marketing team."
          headingId="guides-heading"
          className="mb-10"
        />

        <ul className="flex flex-col">
          {articles.map((article, index) => (
            <li
              key={article.id}
              className="group relative flex items-start gap-5 border-t border-border py-8 last:border-b sm:gap-8"
            >
              <span
                aria-hidden="true"
                className="font-heading text-4xl font-bold text-muted-foreground/20 tabular-nums transition-colors group-hover:text-[var(--color-brand-dark)] sm:text-6xl"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {article.category_tag && (
                    <span className="rounded-full bg-muted px-2.5 py-1 font-semibold text-foreground/70">
                      {article.category_tag}
                    </span>
                  )}
                  <time dateTime={article.published_date}>
                    {formatDate(article.published_date)}
                  </time>
                  <span aria-hidden="true">/</span>
                  <span>{formatReadTime(article.read_time_minutes)}</span>
                </div>

                <h3 className="mt-3 font-heading text-xl font-bold tracking-tight text-balance sm:text-2xl">
                  <Link
                    href={`/blog/${article.slug}`}
                    className="after:absolute after:inset-0 focus-visible:outline-none"
                  >
                    {article.title}
                  </Link>
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-pretty text-muted-foreground">
                  {article.excerpt}
                </p>

                <p className="mt-3 text-sm text-muted-foreground">
                  {article.author_name}
                  {article.author_title && (
                    <span className="text-muted-foreground/60">
                      {" "}
                      / {article.author_title}
                    </span>
                  )}
                </p>
              </div>

              <span
                aria-hidden="true"
                className="hidden size-11 shrink-0 place-items-center self-center rounded-xl border border-border text-muted-foreground transition-colors group-hover:bg-[var(--color-brand)] group-hover:text-[var(--color-brand-ink)] sm:grid"
              >
                <ArrowUpRightIcon className="size-4" />
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <GlossyCTA href="/blog">Read all guides</GlossyCTA>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

const STAT_SHAPE: Record<string, string> = {
  donut:
    "bg-[radial-gradient(circle_at_30%_30%,#e8ff7a,#a4c521)] [mask-image:radial-gradient(circle,transparent_38%,black_39%)]",
  cube: "bg-[linear-gradient(140deg,#f6ffcf,#a4c521)]",
  star: "bg-[radial-gradient(circle_at_35%_30%,#ffc75a,#e0941a)]",
};

function Stat({
  value,
  label,
  shape,
}: {
  value: string;
  label: string;
  shape: keyof typeof STAT_SHAPE;
}) {
  return (
    <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 sm:justify-center sm:py-0">
      <span
        aria-hidden="true"
        className={`size-9 shrink-0 rounded-xl shadow-sm ${STAT_SHAPE[shape]} ${
          shape === "cube" ? "rotate-12" : ""
        } ${shape === "star" ? "rounded-full" : ""}`}
      />
      {/*
        A dl group may only contain dt and dd, so the label is the dt and the
        order is flipped visually rather than with an extra paragraph.
      */}
      <div className="flex flex-col-reverse">
        <dt className="mt-0.5 text-[0.65rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
          {label}
        </dt>
        <dd className="font-heading text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
          {value}
        </dd>
      </div>
    </div>
  );
}
