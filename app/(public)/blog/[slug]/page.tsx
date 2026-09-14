import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AffiliateCTAButton } from "@/components/public/AffiliateCTAButton";
import { AffiliateDisclosureNote } from "@/components/public/AffiliateDisclosureNote";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  formatDate,
  formatNumber,
  formatRating,
  formatReadTime,
  startingPriceLabel,
} from "@/lib/format";
import { serializeJsonLd } from "@/lib/json-ld";
import { getArticleBySlug, getLatestArticles } from "@/lib/queries/articles";
import { getAllSoftware } from "@/lib/queries/software";
import { ogImageUrl, SITE_NAME, SITE_URL } from "@/lib/site";
import type { SoftwareWithCategory } from "@/lib/types";

export const revalidate = 3600;

export async function generateStaticParams() {
  const articles = await getLatestArticles(200);
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Not found" };

  return {
    title: article.meta_title ?? article.title,
    description: article.meta_description ?? article.excerpt,
    alternates: { canonical: `${SITE_URL}/blog/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: `${SITE_URL}/blog/${article.slug}`,
      publishedTime: article.published_date,
      authors: [article.author_name],
      images: [
        {
          url: ogImageUrl({
            title: article.title,
            eyebrow: "Buying guide",
            subtitle: article.excerpt,
          }),
          width: 1200,
          height: 630,
          alt: `${article.title} on ${SITE_NAME}`,
        },
      ],
    },
  };
}

export default async function ArticlePage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  // The catalogue is only read when the guide is about one product.
  const [latest, catalogue] = await Promise.all([
    getLatestArticles(4),
    article.related_software_id
      ? getAllSoftware()
      : Promise.resolve<SoftwareWithCategory[]>([]),
  ]);
  const related = latest.filter((item) => item.slug !== article.slug);
  const product =
    catalogue.find((item) => item.id === article.related_software_id) ?? null;
  const productPrice = product ? startingPriceLabel(product) : null;

  const initials = article.author_name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.published_date,
    author: { "@type": "Person", name: article.author_name },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/blog/${article.slug}`,
  };

  return (
    <>
      <div className="container-site flex flex-col gap-12 py-8">
      <Breadcrumbs
        items={[{ label: "Guides", href: "/blog" }, { label: article.title }]}
      />

      <article className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            {article.category_tag && (
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground/70">
                {article.category_tag}
              </span>
            )}
            <time dateTime={article.published_date}>
              {formatDate(article.published_date)}
            </time>
            <span aria-hidden="true">/</span>
            <span>{formatReadTime(article.read_time_minutes)}</span>
          </div>

          <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.12]">
            {article.title}
          </h1>

          <div className="flex items-center gap-3 border-y border-border py-4">
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{article.author_name}</p>
              {article.author_title && (
                <p className="text-sm text-muted-foreground">
                  {article.author_title}
                </p>
              )}
            </div>
          </div>
        </header>

        {article.featured_image_url && (
          <Image
            src={article.featured_image_url}
            alt=""
            width={1200}
            height={630}
            className="aspect-[1200/630] w-full rounded-2xl object-cover"
          />
        )}

        <div
          className="article-content"
          // Article bodies are authored HTML, stored in the articles table.
           
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {product && productPrice && (
          <div className="flex flex-col gap-3">
            <aside
              aria-label={`${product.name}, the product this guide covers`}
              className="card-modern flex flex-col gap-4 p-6 sm:flex-row sm:items-center"
            >
              <SoftwareLogo
                name={product.name}
                slug={product.slug}
                logoUrl={product.logo_url}
                brandColor={product.brand_color}
                size={48}
                className="shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-heading text-base font-bold tracking-tight">
                  <Link
                    href={`/software/${product.slug}`}
                    className="hover:text-[var(--color-text-accent)]"
                  >
                    {product.name}
                  </Link>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Rated {formatRating(product.overall_rating)} out of 5 from{" "}
                  {formatNumber(product.review_count)} reviews.{" "}
                  {productPrice.isCustom || product.starting_price === 0
                    ? productPrice.amount
                    : `From ${productPrice.amount}`}
                  .
                </p>
              </div>
              <AffiliateCTAButton
                slug={product.slug}
                name={product.name}
                brandColor={product.brand_color}
                className="shrink-0"
              />
            </aside>
            <AffiliateDisclosureNote />
          </div>
        )}

        {article.author_bio && (
          <footer className="rounded-3xl bg-muted p-6">
            <p className="text-[0.7rem] font-bold tracking-widest text-muted-foreground uppercase">
              About the author
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {article.author_bio}
            </p>
          </footer>
        )}
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mx-auto w-full max-w-5xl">
          <h2
            id="related-heading"
            className="mb-6 font-heading text-2xl font-bold tracking-tight"
          >
            Read next
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {related.slice(0, 3).map((item) => (
              <article
                key={item.id}
                className="card-modern card-modern-hover group relative flex flex-col gap-3 p-6"
              >
                {item.category_tag && (
                  <span className="w-fit rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground/70">
                    {item.category_tag}
                  </span>
                )}
                <h3 className="font-heading text-base font-bold tracking-tight text-balance">
                  <Link
                    href={`/blog/${item.slug}`}
                    className="after:absolute after:inset-0 after:rounded-[1.5rem] focus-visible:outline-none"
                  >
                    {item.title}
                  </Link>
                </h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {item.excerpt}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      </div>

      {/*
        The band sits outside the container, not inside it twice.

        It was nested in `container-site > max-w-3xl`, and since the band
        renders its own `container-site` and rail grid inside that, the rail
        and the well were squeezed into a few hundred pixels and the label
        collapsed onto the copy. A full-bleed band has to be a sibling of the
        page's container, which is also how the home page uses it.
      */}
    </>
  );
}
