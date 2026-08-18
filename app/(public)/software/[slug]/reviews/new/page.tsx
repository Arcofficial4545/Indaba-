import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { ReviewForm } from "@/components/public/ReviewForm";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { getSoftwareBySlug } from "@/lib/queries/software";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata(
  props: PageProps<"/software/[slug]/reviews/new">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const software = await getSoftwareBySlug(slug);
  if (!software) return { title: "Not found" };

  return {
    title: `Write a ${software.name} review`,
    description: `Share your experience of ${software.name} with other South African businesses.`,
    alternates: { canonical: `${SITE_URL}/software/${slug}/reviews/new` },
    // A form page has nothing to offer a search engine.
    robots: { index: false, follow: true },
  };
}

export default async function NewReviewPage(
  props: PageProps<"/software/[slug]/reviews/new">,
) {
  const { slug } = await props.params;
  const software = await getSoftwareBySlug(slug);
  if (!software) notFound();

  return (
    <div className="container-site flex flex-col gap-10 py-8">
      <Breadcrumbs
        items={[
          { label: "Software", href: "/software" },
          { label: software.name, href: `/software/${software.slug}` },
          { label: "Write a review" },
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
          Review <span className="brand-highlight">{software.name}</span>
        </h1>
        <p className="text-base leading-relaxed text-pretty text-muted-foreground">
          Other buyers rely on this. Be specific about what you use it for, what
          the setup was like and where it falls short.
        </p>
      </header>

      <div className="mx-auto w-full max-w-3xl">
        <ReviewForm slug={software.slug} softwareName={software.name} />
      </div>
    </div>
  );
}
