import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BarChart3Icon,
  CheckIcon,
  CircleHelpIcon,
  CoinsIcon,
  LayoutGridIcon,
  MessagesSquareIcon,
  ScaleIcon,
  ShuffleIcon,
  SparklesIcon,
} from "lucide-react";

import { AlternativeCard } from "@/components/public/AlternativeCard";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { CircularRating } from "@/components/public/CircularRating";
import { CompanySizeChart } from "@/components/public/CompanySizeChart";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { GlossyButton } from "@/components/public/GlossyButton";
import { GlossyCTA } from "@/components/public/GlossyCTA";
import { PricingCards } from "@/components/public/PricingCards";
import { ProfileNav } from "@/components/public/ProfileNav";
import { RatingBar } from "@/components/public/RatingBar";
import { ReviewCard } from "@/components/public/ReviewCard";
import { SectionHeader } from "@/components/public/SectionHeader";
import { SentimentBar } from "@/components/public/SentimentBar";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { SoftwareRatingsChart } from "@/components/public/SoftwareRatingsChart";
import { SoftwareSidebar } from "@/components/public/SoftwareSidebar";
import { SponsoredAd } from "@/components/public/SponsoredAd";
import { StarRating } from "@/components/public/StarRating";
import { Badge } from "@/components/ui/badge";
import { getBrandColor } from "@/lib/brandColors";
import { buildFaqs, faqJsonLd } from "@/lib/content/faqs";
import { formatNumber, formatRating } from "@/lib/format";
import {
  getAllSoftware,
  getAlternatives,
  getSoftwareBySlug,
  getStarDistributions,
} from "@/lib/queries/software";
import { getCompanySizeBreakdown, getReviews } from "@/lib/queries/reviews";
import { SITE_URL } from "@/lib/site";
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
  const description =
    software.meta_description ??
    `${software.name} reviewed for South African businesses. ${formatRating(
      software.overall_rating,
    )} out of 5 from ${formatNumber(software.review_count)} verified reviews, with pricing in rand.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/software/${software.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/software/${software.slug}`,
      type: "article",
    },
  };
}

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "pricing", label: "Pricing" },
  { id: "features", label: "Features" },
  { id: "ratings", label: "Ratings" },
  { id: "compare", label: "Compare" },
  { id: "reviews", label: "Reviews" },
  { id: "alternatives", label: "Alternatives" },
  { id: "faqs", label: "FAQs" },
];

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

  const colour = getBrandColor(software.slug, software.brand_color);
  const faqs = buildFaqs(software);
  const topAlternative = alternatives[0];

  const dimensionScores = [
    { label: "Ease of use", value: software.ease_of_use_rating },
    { label: "Value for money", value: software.value_for_money_rating },
    { label: "Customer service", value: software.customer_service_rating },
    { label: "Functionality", value: software.functionality_rating },
  ];

  /* Structured data. Product with AggregateRating, individual Reviews and the
     FAQ block, all built from the same values the page renders. */
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
    ...(software.review_count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: formatRating(software.overall_rating),
            reviewCount: software.review_count,
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
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
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------ */}
      <header className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        <SoftwareLogo
          name={software.name}
          slug={software.slug}
          logoUrl={software.logo_url}
          brandColor={software.brand_color}
          size={84}
        />

        <div className="flex flex-col items-center gap-3">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.12]">
            {software.name}
          </h1>
          {software.featured && <Badge variant="success">Featured</Badge>}
        </div>

        {software.tagline && (
          <p className="text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            {software.tagline}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="font-heading text-2xl font-bold tabular-nums">
            {formatRating(software.overall_rating)}
          </span>
          <StarRating rating={software.overall_rating} showNumber={false} />
          <Link
            href={`/software/${software.slug}/reviews`}
            className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
          >
            {formatNumber(software.review_count)} verified reviews
          </Link>
        </div>

        <GlossyButton
          href={`/software/${software.slug}/reviews/new`}
          size="lg"
          variant="dark"
        >
          Write a review
        </GlossyButton>
      </header>

      <ProfileNav sections={SECTIONS} />

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
          {/* 4. Ratings                                                      */}
          {/* -------------------------------------------------------------- */}
          <section id="ratings" aria-labelledby="ratings-heading" className="scroll-mt-32">
            <SectionHeader
              eyebrow="Ratings"
              icon={BarChart3Icon}
              title="What the numbers"
              highlight="actually say"
              subtitle={`Across ${formatNumber(software.review_count)} verified reviews from South African businesses.`}
              headingId="ratings-heading"
              className="mb-8"
            />

            <div className="rounded-[1.75rem] bg-zinc-100/80 p-2 dark:bg-zinc-900/60">
              <div className="grid gap-2 md:grid-cols-2">
                <div className="flex flex-col items-center gap-5 rounded-[1.4rem] border border-zinc-200/70 bg-card p-6 dark:border-zinc-800">
                  <CircularRating rating={software.overall_rating} colour={colour} />
                  <StarRating
                    rating={software.overall_rating}
                    showNumber={false}
                  />
                  <SentimentBar distribution={distribution} className="w-full" />
                </div>

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

                <div className="rounded-[1.4rem] border border-zinc-200/70 bg-card p-6 dark:border-zinc-800">
                  <h3 className="mb-4 font-heading text-base font-bold tracking-tight">
                    Rated by dimension
                  </h3>
                  <SoftwareRatingsChart scores={dimensionScores} colour={colour} />
                </div>

                <div className="rounded-[1.4rem] border border-zinc-200/70 bg-card p-6 dark:border-zinc-800">
                  <h3 className="mb-4 font-heading text-base font-bold tracking-tight">
                    Who reviews it
                  </h3>
                  <CompanySizeChart breakdown={sizeBreakdown} />
                </div>
              </div>
            </div>
          </section>

          {/* -------------------------------------------------------------- */}
          {/* 5. Compare                                                      */}
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
          {/* 6. Reviews                                                      */}
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
          </section>

          {/* -------------------------------------------------------------- */}
          {/* 7. Sponsored                                                    */}
          {/* -------------------------------------------------------------- */}
          <SponsoredAd format="billboard" />

          {/* -------------------------------------------------------------- */}
          {/* 8. Alternatives                                                 */}
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
          {/* 9. FAQs                                                         */}
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
         
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
           
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
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
      <StarRating rating={software.overall_rating} size="sm" />
      <p className="text-xs text-muted-foreground tabular-nums">
        {formatNumber(software.review_count)} reviews
      </p>
    </div>
  );
}
