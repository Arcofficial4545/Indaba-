import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BarChart3Icon,
  CheckIcon,
  CircleHelpIcon,
  CoinsIcon,
  ImagesIcon,
  LayoutGridIcon,
  MessagesSquareIcon,
  ScaleIcon,
  ShuffleIcon,
  SparklesIcon,
} from "lucide-react";

import { AffiliateCTAButton } from "@/components/public/AffiliateCTAButton";
import { AffiliateDisclosureNote } from "@/components/public/AffiliateDisclosureNote";
import { AlternativeCard } from "@/components/public/AlternativeCard";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { Figure } from "@/components/public/Figure";
import { Rail } from "@/components/public/Rail";
import { CircularRating } from "@/components/public/CircularRating";
import { CompanySizeChart } from "@/components/public/CompanySizeChart";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { GlossyCTA } from "@/components/public/GlossyCTA";
import { PricingCards } from "@/components/public/PricingCards";
import { PricingTable } from "@/components/public/PricingTable";
import { ProfileNav } from "@/components/public/ProfileNav";
import { RatingBar } from "@/components/public/RatingBar";
import { ReviewCard } from "@/components/public/ReviewCard";
import { ScreenshotCarousel } from "@/components/public/ScreenshotCarousel";
import { SectionHeader } from "@/components/public/SectionHeader";
import { SentimentBar } from "@/components/public/SentimentBar";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { SoftwareRatingsChart } from "@/components/public/SoftwareRatingsChart";
import { SoftwareSidebar } from "@/components/public/SoftwareSidebar";
import { SponsoredAd } from "@/components/public/SponsoredAd";
import { StarRating } from "@/components/public/StarRating";
import { Badge } from "@/components/ui/badge";
import { buildFaqs, faqJsonLd } from "@/lib/content/faqs";
import { serializeJsonLd } from "@/lib/json-ld";
import { formatDate, formatNumber, formatRating } from "@/lib/format";
import { hasOwnReviews, reviewsWord } from "@/lib/ratings";
import {
  getAllSoftware,
  getAlternatives,
  getSoftwareBySlug,
  getStarDistributions,
} from "@/lib/queries/software";
import { getCompanySizeBreakdown, getReviews } from "@/lib/queries/reviews";
import { ogImageUrl, SITE_NAME, SITE_URL } from "@/lib/site";
import { canonicalComparisonSlug } from "@/lib/utils";

export const revalidate = 3600;

export async function generateStaticParams() {
  const software = await getAllSoftware();
  return software.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata(
  props: PageProps<"/software/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const software = await getSoftwareBySlug(slug);
  if (!software) return { title: "Not found" };

  const title = software.meta_title ?? `${software.name} review`;
  const ratingSentence =
    software.review_count > 0
      ? `${formatRating(software.overall_rating)} out of 5 from ${formatNumber(
          software.review_count,
        )} ${
          software.rating_source ? reviewsWord(software) : "verified reviews"
        }, with pricing in rand.`
      : "Pricing in rand, features and alternatives.";
  const description =
    software.meta_description ??
    `${software.name} reviewed for South African businesses. ${ratingSentence}`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/software/${software.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/software/${software.slug}`,
      type: "article",
      images: [
        {
          url: ogImageUrl({
            title: software.name,
            eyebrow: software.category?.name ?? "Business software",
            subtitle: software.tagline ?? undefined,
            rating:
              software.review_count > 0
                ? formatRating(software.overall_rating)
                : undefined,
            reviews:
              software.review_count > 0
                ? formatNumber(software.review_count)
                : undefined,
          }),
          width: 1200,
          height: 630,
          alt: `${software.name} on ${SITE_NAME}`,
        },
      ],
    },
  };
}

/**
 * Section pills. Screenshots only earn one when the product actually has
 * them, so the nav never points at a section that is not on the page.
 */
function sectionsFor(hasScreenshots: boolean, hasRatings: boolean) {
  return [
    { id: "overview", label: "Overview" },
    { id: "pricing", label: "Pricing" },
    { id: "features", label: "Features" },
    ...(hasScreenshots ? [{ id: "screenshots", label: "Screenshots" }] : []),
    ...(hasRatings ? [{ id: "ratings", label: "Ratings" }] : []),
    { id: "compare", label: "Compare" },
    { id: "reviews", label: "Reviews" },
    { id: "alternatives", label: "Alternatives" },
    { id: "faqs", label: "FAQs" },
  ];
}

export default async function SoftwareProfilePage(
  props: PageProps<"/software/[slug]">,
) {
  const { slug } = await props.params;
  const software = await getSoftwareBySlug(slug);
  if (!software) notFound();

  const [alternatives, reviewData, distributions, sizeBreakdown] =
    await Promise.all([
      getAlternatives(software, 3),
      getReviews(software.id, { limit: 3, sort: "helpful" }),
      getStarDistributions([software.id]),
      getCompanySizeBreakdown(software.id),
    ]);

  const distribution = distributions[software.id] ?? {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  const distributionTotal = Object.values(distribution).reduce(
    (a, b) => a + b,
    0,
  );

  /*
     Guarded rather than trusted: screenshots come out of a jsonb column that
     the admin edits by hand, so a malformed row should cost the section, not
     the page.
  */
  const screenshots = Array.isArray(software.screenshots)
    ? software.screenshots.filter((shot) => shot?.url && shot?.alt)
    : [];

  /*
    Charts are drawn in the site's own series colours, never in the vendor's.

    A ratings chart in the vendor's blue reads as the vendor's own marketing
    material, which is the opposite of what this page is for, and it made the
    same chart a different colour on every product so no two could be compared
    by eye. Petrol is 10.62:1 on bone and identical on every profile.

    The affiliate CTA still carries the vendor's colour, but it takes
    software.brand_color directly, so nothing here needs getBrandColor.
  */
  const seriesCool = "var(--color-petrol)";
  const faqs = buildFaqs(software);
  const topAlternative = alternatives[0];
  /* A third-party snapshot, when the ratings are not this site's own reviews. */
  const sourced = software.rating_source ?? null;

  const dimensionScores = [
    { label: "Ease of use", value: software.ease_of_use_rating },
    { label: "Value for money", value: software.value_for_money_rating },
    { label: "Customer service", value: software.customer_service_rating },
    { label: "Functionality", value: software.functionality_rating },
  ];

  /* Structured data: the Product, the FAQ block and, only for reviews published
     on this site, AggregateRating and individual Reviews. Ratings sourced from
     another site are never marked up, because Google's review snippet rules do
     not allow ratings aggregated from a third party. */
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: software.name,
    description: software.description_short,
    brand: { "@type": "Brand", name: software.vendor_name ?? software.name },
    ...(software.starting_price
      ? {
          offers: {
            "@type": "Offer",
            price: software.starting_price,
            priceCurrency: software.price_currency,
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/software/${software.slug}`,
          },
        }
      : {}),
    ...(hasOwnReviews(software)
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: formatRating(software.overall_rating),
            reviewCount: software.review_count,
            bestRating: "5",
            worstRating: "1",
          },
          review: reviewData.reviews.map((review) => ({
            "@type": "Review",
            author: { "@type": "Person", name: review.reviewer_name },
            datePublished: review.review_date.slice(0, 10),
            name: review.review_title,
            reviewBody: review.summary,
            reviewRating: {
              "@type": "Rating",
              ratingValue: String(review.overall_rating),
              bestRating: "5",
              worstRating: "1",
            },
          })),
        }
      : {}),
  };

  return (
    <div className="container-site flex flex-col gap-10 py-8">
      <Breadcrumbs
        items={[
          { label: "Software", href: "/software" },
          ...(software.category
            ? [
                {
                  label: software.category.name,
                  href: `/category/${software.category.slug}`,
                },
              ]
            : []),
          { label: software.name },
        ]}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Header. Left aligned on the rail, like every other page.            */}
      {/* ------------------------------------------------------------------ */}
      <header className="rail-grid">
        <Rail
          label={software.category?.name ?? "Software"}
          count={
            software.review_count > 0
              ? formatRating(software.overall_rating)
              : undefined
          }
          note={
            software.review_count === 0
              ? "No reviews yet."
              : sourced
                ? `Out of 5 on ${sourced.name}.`
                : "Weighted average out of 5."
          }
        />

        <div className="well">
          <div className="flex items-start gap-5">
            <SoftwareLogo
              name={software.name}
              slug={software.slug}
              logoUrl={software.logo_url}
              brandColor={software.brand_color}
              size={64}
              className="shrink-0"
            />
            <div className="min-w-0">
              <h1 className="section-heading reveal-line">
                <span>{software.name}</span>
              </h1>
              {software.tagline && (
                <p className="mt-4 max-w-[62ch] leading-relaxed text-[var(--color-text-muted)]">
                  {software.tagline}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            {software.review_count > 0 ? (
              <>
                <span className="flex items-center gap-3">
                  <Figure className="text-[1.375rem] leading-none">
                    {formatRating(software.overall_rating)}
                  </Figure>
                  <StarRating rating={software.overall_rating} showNumber={false} />
                </span>
                {sourced ? (
                  <a
                    href={sourced.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-small text-[var(--color-text-accent)] underline underline-offset-4"
                  >
                    <Figure as="span">{formatNumber(software.review_count)}</Figure>{" "}
                    reviews on {sourced.name}
                  </a>
                ) : (
                  <Link
                    href={`/software/${software.slug}/reviews`}
                    className="text-small text-[var(--color-text-accent)] underline underline-offset-4"
                  >
                    <Figure as="span">{formatNumber(software.review_count)}</Figure>{" "}
                    verified reviews
                  </Link>
                )}
              </>
            ) : (
              <span className="text-small text-[var(--color-text-muted)]">
                No reviews yet
              </span>
            )}
            {software.featured && <Badge variant="success">Featured</Badge>}
          </div>

          {/*
            The visit CTA above the fold. On a phone the sidebar, and with it
            the only other CTA on the page, sits below every section.
          */}
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <AffiliateCTAButton
              slug={software.slug}
              name={software.name}
              brandColor={software.brand_color}
            />
            {software.free_trial && (
              <span className="text-small text-[var(--color-text-muted)]">
                {software.free_trial_days
                  ? `${software.free_trial_days} day free trial`
                  : "Free trial available"}
              </span>
            )}
          </div>
          <AffiliateDisclosureNote className="mt-3 max-w-[62ch]" />
        </div>
      </header>

      <ProfileNav
        sections={sectionsFor(screenshots.length > 0, software.review_count > 0)}
      />

      <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div className="flex min-w-0 flex-col gap-20">
          {/* -------------------------------------------------------------- */}
          {/* 1. Overview                                                     */}
          {/* -------------------------------------------------------------- */}
          <section id="overview" aria-labelledby="overview-heading" className="scroll-mt-32">
            <SectionHeader
              eyebrow="Overview"
              icon={SparklesIcon}
              title="What"
              highlight={software.name}
              titleAfter="actually does"
              headingId="overview-heading"
              className="mb-8"
            />
            <div
              className="prose-content"
              // Vendor description is authored HTML from the admin, stored as
              // markup and rendered into the profile prose style.
               
              dangerouslySetInnerHTML={{ __html: software.description_full }}
            />
          </section>

          {/* -------------------------------------------------------------- */}
          {/* 2. Pricing                                                      */}
          {/* -------------------------------------------------------------- */}
          <section id="pricing" aria-labelledby="pricing-heading" className="scroll-mt-32">
            <SectionHeader
              eyebrow="Pricing"
              icon={CoinsIcon}
              title="Plans,"
              highlight="priced in rand"
              subtitle="What you will actually pay, with the VAT basis stated rather than assumed."
              headingId="pricing-heading"
              className="mb-8"
            />
            <PricingCards software={software} />
            <PricingTable
              plans={software.pricing_plans}
              name={software.name}
              className="mt-6"
            />
          </section>

          {/* -------------------------------------------------------------- */}
          {/* 3. Features                                                     */}
          {/* -------------------------------------------------------------- */}
          {software.features.length > 0 && (
            <section id="features" aria-labelledby="features-heading" className="scroll-mt-32">
              <SectionHeader
                eyebrow="Features"
                icon={LayoutGridIcon}
                title="What you"
                highlight="get for it"
                headingId="features-heading"
                className="mb-8"
              />

              {software.top_features.length > 0 && (
                <div className="mb-8 rounded-[1.75rem] bg-zinc-100/80 p-2 dark:bg-zinc-900/60">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {software.top_features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-3 rounded-[1.4rem] border border-zinc-200/70 bg-card p-5 dark:border-zinc-800"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--color-brand)]"
                        >
                          <CheckIcon
                            className="size-3 text-[var(--color-brand-ink)]"
                            strokeWidth={3}
                          />
                        </span>
                        <span className="text-sm leading-relaxed font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {software.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <CheckIcon
                      className="mt-0.5 size-4 shrink-0 text-[var(--color-brand-dark)]"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* -------------------------------------------------------------- */}
          {/* 4. Screenshots                                                  */}
          {/* -------------------------------------------------------------- */}
          {screenshots.length > 0 && (
            <section
              id="screenshots"
              aria-labelledby="screenshots-heading"
              className="scroll-mt-32"
            >
              <SectionHeader
                eyebrow="Screenshots"
                icon={ImagesIcon}
                title="What it looks like"
                highlight="in use"
                headingId="screenshots-heading"
                className="mb-8"
              />
              <ScreenshotCarousel
                screenshots={screenshots}
                name={software.name}
              />
            </section>
          )}

          {/* -------------------------------------------------------------- */}
          {/* 5. Ratings                                                      */}
          {/* -------------------------------------------------------------- */}
          {software.review_count > 0 && (
            <section id="ratings" aria-labelledby="ratings-heading" className="scroll-mt-32">
              <SectionHeader
                eyebrow="Ratings"
                icon={BarChart3Icon}
                title="What the numbers"
                highlight="actually say"
                subtitle={
                  sourced
                    ? `From ${formatNumber(software.review_count)} reviews on ${sourced.name}, read on ${formatDate(sourced.retrieved)}.`
                    : `Across ${formatNumber(software.review_count)} verified reviews from South African businesses.`
                }
                headingId="ratings-heading"
                className="mb-8"
              />

              <div className="rounded-[1.75rem] bg-zinc-100/80 p-2 dark:bg-zinc-900/60">
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="flex flex-col items-center gap-5 rounded-[1.4rem] border border-zinc-200/70 bg-card p-6 dark:border-zinc-800">
                    <CircularRating
                      rating={software.overall_rating}
                      colour={seriesCool}
                    />
                    <StarRating
                      rating={software.overall_rating}
                      showNumber={false}
                    />
                    {/* A star spread exists only for reviews published here. */}
                    {!sourced && (
                      <SentimentBar distribution={distribution} className="w-full" />
                    )}
                  </div>

                  {!sourced && (
                    <div className="flex flex-col gap-2 rounded-[1.4rem] border border-zinc-200/70 bg-card p-6 dark:border-zinc-800">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <RatingBar
                          key={star}
                          star={star}
                          count={distribution[star as 1 | 2 | 3 | 4 | 5]}
                          total={distributionTotal}
                        />
                      ))}
                    </div>
                  )}

                  <div className="rounded-[1.4rem] border border-zinc-200/70 bg-card p-6 dark:border-zinc-800">
                    <h3 className="mb-4 font-heading text-base font-bold tracking-tight">
                      Rated by dimension
                    </h3>
                    <SoftwareRatingsChart
                      scores={dimensionScores}
                      colour={seriesCool}
                    />
                  </div>

                  {!sourced && (
                    <div className="rounded-[1.4rem] border border-zinc-200/70 bg-card p-6 dark:border-zinc-800">
                      <h3 className="mb-4 font-heading text-base font-bold tracking-tight">
                        Who reviews it
                      </h3>
                      <CompanySizeChart breakdown={sizeBreakdown} />
                    </div>
                  )}
                </div>
              </div>

              {sourced && (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  These are {sourced.name}&apos;s published figures, not reviews
                  collected by {SITE_NAME}.{" "}
                  <a
                    href={sourced.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-foreground"
                  >
                    See the source
                  </a>
                  .
                </p>
              )}
            </section>
          )}

          {/* -------------------------------------------------------------- */}
          {/* 6. Compare                                                      */}
          {/* -------------------------------------------------------------- */}
          {topAlternative && (
            <section id="compare" aria-labelledby="compare-heading" className="scroll-mt-32">
              <SectionHeader
                eyebrow="Head to head"
                icon={ScaleIcon}
                title={software.name}
                highlight="or"
                titleAfter={topAlternative.name}
                subtitle="The comparison people on this page make most often."
                headingId="compare-heading"
                className="mb-8"
              />

              <div className="card-modern flex flex-col items-center gap-6 p-8 sm:flex-row sm:justify-between">
                <CompareFace software={software} />
                <span
                  aria-hidden="true"
                  className="font-heading text-sm font-bold tracking-widest text-muted-foreground uppercase"
                >
                  vs
                </span>
                <CompareFace software={topAlternative} />
              </div>

              <div className="mt-6 flex justify-center">
                <GlossyCTA
                  href={`/compare/${canonicalComparisonSlug(software.slug, topAlternative.slug)}`}
                >
                  See the full comparison
                </GlossyCTA>
              </div>
            </section>
          )}

          {/* -------------------------------------------------------------- */}
          {/* 7. Reviews                                                      */}
          {/* -------------------------------------------------------------- */}
          <section id="reviews" aria-labelledby="reviews-heading" className="scroll-mt-32">
            <SectionHeader
              eyebrow="Reviews"
              icon={MessagesSquareIcon}
              title="What users"
              highlight="tell us"
              headingId="reviews-heading"
              className="mb-8"
            />

            {hasOwnReviews(software) ? (
              <>
                <div className="flex flex-col gap-4">
                  {reviewData.reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <GlossyCTA href={`/software/${software.slug}/reviews`}>
                    Read all {formatNumber(software.review_count)} reviews
                  </GlossyCTA>
                </div>
              </>
            ) : (
              <div className="card-modern flex flex-col items-start gap-5 p-6">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {sourced
                    ? `No reviews of ${software.name} have been published on ${SITE_NAME} yet. The ratings above come from ${formatNumber(software.review_count)} reviews on ${sourced.name}.`
                    : `No reviews of ${software.name} have been published yet.`}
                </p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                  <GlossyCTA href={`/software/${software.slug}/reviews/new`}>
                    Write the first review
                  </GlossyCTA>
                  {sourced && (
                    <a
                      href={sourced.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium underline underline-offset-4"
                    >
                      Read reviews on {sourced.name}
                    </a>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* -------------------------------------------------------------- */}
          {/* 8. Sponsored                                                    */}
          {/* -------------------------------------------------------------- */}
          <SponsoredAd format="billboard" />

          {/* -------------------------------------------------------------- */}
          {/* 9. Alternatives                                                 */}
          {/* -------------------------------------------------------------- */}
          {alternatives.length > 0 && (
            <section
              id="alternatives"
              aria-labelledby="alternatives-heading"
              className="scroll-mt-32"
            >
              <SectionHeader
                eyebrow="Alternatives"
                icon={ShuffleIcon}
                title="Worth looking at"
                highlight="instead"
                headingId="alternatives-heading"
                className="mb-8"
              />

              <div className="rounded-[1.75rem] bg-zinc-100/80 p-2 dark:bg-zinc-900/60">
                <div className="grid gap-2 md:grid-cols-3">
                  {alternatives.map((alternative, index) => (
                    <AlternativeCard
                      key={alternative.id}
                      software={alternative}
                      comparedTo={software}
                      rank={index + 1}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Link
                  href={`/software/${software.slug}/alternatives`}
                  className="text-sm font-medium text-[var(--color-brand-dark)] underline underline-offset-4"
                >
                  All {software.name} alternatives
                </Link>
              </div>
            </section>
          )}

          {/* -------------------------------------------------------------- */}
          {/* 10. FAQs                                                         */}
          {/* -------------------------------------------------------------- */}
          {faqs.length > 0 && (
            <section id="faqs" aria-labelledby="faqs-heading" className="scroll-mt-32">
              <SectionHeader
                eyebrow="Questions"
                icon={CircleHelpIcon}
                title="The things buyers"
                highlight="ask first"
                headingId="faqs-heading"
                className="mb-8"
              />
              <FaqAccordion faqs={faqs} />
            </section>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Sidebar spec sheet                                                */}
        {/* ---------------------------------------------------------------- */}
        <div className="lg:sticky lg:top-28">
          <SoftwareSidebar software={software} />
        </div>
      </div>

      <script
        type="application/ld+json"
         
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(productJsonLd) }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
           
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd(faqs)) }}
        />
      )}
    </div>
  );
}

function CompareFace({
  software,
}: {
  software: Awaited<ReturnType<typeof getSoftwareBySlug>>;
}) {
  if (!software) return null;
  return (
    <div className="flex flex-1 flex-col items-center gap-3 text-center">
      <SoftwareLogo
        name={software.name}
        slug={software.slug}
        logoUrl={software.logo_url}
        brandColor={software.brand_color}
        size={56}
      />
      <p className="font-heading text-base font-bold tracking-tight">
        {software.name}
      </p>
      {software.review_count > 0 ? (
        <>
          <StarRating rating={software.overall_rating} size="sm" />
          <p className="text-xs text-muted-foreground tabular-nums">
            {formatNumber(software.review_count)} {reviewsWord(software)}
          </p>
        </>
      ) : (
        <p className="text-xs text-muted-foreground">No reviews yet</p>
      )}
    </div>
  );
}
