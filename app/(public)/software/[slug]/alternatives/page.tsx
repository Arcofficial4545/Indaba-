import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShuffleIcon } from "lucide-react";

import { AlternativeCard } from "@/components/public/AlternativeCard";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { SectionHeader } from "@/components/public/SectionHeader";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { formatRating } from "@/lib/format";
import { getAlternatives, getSoftwareBySlug } from "@/lib/queries/software";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export async function generateMetadata(
  props: PageProps<"/software/[slug]/alternatives">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const software = await getSoftwareBySlug(slug);
  if (!software) return { title: "Not found" };

  return {
    title: `${software.name} alternatives`,
    description: `The strongest alternatives to ${software.name} for South African businesses, ranked by verified user ratings and compared on price in rand.`,
    alternates: { canonical: `${SITE_URL}/software/${slug}/alternatives` },
  };
}

export default async function AlternativesPage(
  props: PageProps<"/software/[slug]/alternatives">,
) {
  const { slug } = await props.params;
  const software = await getSoftwareBySlug(slug);
  if (!software) notFound();

  const alternatives = await getAlternatives(software, 12);

  return (
    <div className="container-site flex flex-col gap-12 py-8">
      <Breadcrumbs
        items={[
          { label: "Software", href: "/software" },
          { label: software.name, href: `/software/${software.slug}` },
          { label: "Alternatives" },
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
          Alternatives to{" "}
          <span className="brand-highlight">{software.name}</span>
        </h1>
        <p className="text-base leading-relaxed text-pretty text-muted-foreground">
          {software.name} rates {formatRating(software.overall_rating)} out of 5.
          These are the products South African buyers weigh against it, ranked by
          what their own users say.
        </p>
      </header>

      {alternatives.length === 0 ? (
        <p className="text-center text-muted-foreground">
          We have not reviewed a comparable product yet.
        </p>
      ) : (
        <section aria-labelledby="alternatives-heading">
          <SectionHeader
            eyebrow="Ranked alternatives"
            icon={ShuffleIcon}
            title="Worth putting on"
            highlight="the shortlist"
            headingId="alternatives-heading"
            className="mb-10"
          />

          <div className="rounded-[1.75rem] bg-zinc-100/80 p-2 dark:bg-zinc-900/60">
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
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
        </section>
      )}
    </div>
  );
}
