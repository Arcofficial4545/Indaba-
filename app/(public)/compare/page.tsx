import type { Metadata } from "next";
import { ScaleIcon, TrendingUpIcon } from "lucide-react";

import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { ComparisonCard } from "@/components/public/ComparisonCard";
import { CompareSelector } from "@/components/public/CompareSelector";
import { SectionHeader } from "@/components/public/SectionHeader";
import { getTrendingComparisons } from "@/lib/queries/comparisons";
import { getAllSoftware } from "@/lib/queries/software";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Compare business software",
  description:
    "Put two products side by side on ratings, pricing in rand and features, and read a verdict written for South African buyers.",
  alternates: { canonical: `${SITE_URL}/compare` },
};

export default async function ComparePage() {
  const [software, trending] = await Promise.all([
    getAllSoftware(),
    getTrendingComparisons(6),
  ]);

  const options = [...software]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((item) => ({
      slug: item.slug,
      name: item.name,
      category: item.category?.name ?? null,
    }));

  return (
    <div className="container-site flex flex-col gap-16 py-8">
      <Breadcrumbs items={[{ label: "Compare" }]} />

      <header className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.12]">
          Put two of them{" "}
          <span className="brand-highlight">side by side</span>
        </h1>
        <p className="text-base leading-relaxed text-pretty text-muted-foreground">
          Same ratings, same price table, same feature matrix. No marketing copy
          from either vendor.
        </p>
      </header>

      <section aria-labelledby="builder-heading">
        <SectionHeader
          eyebrow="Build a comparison"
          icon={ScaleIcon}
          title="Choose any"
          highlight="two products"
          headingId="builder-heading"
          className="mb-10"
        />
        <CompareSelector options={options} />
      </section>

      {trending.length > 0 && (
        <section aria-labelledby="trending-heading">
          <SectionHeader
            eyebrow="Popular match ups"
            icon={TrendingUpIcon}
            title="The ones people"
            highlight="keep looking up"
            headingId="trending-heading"
            className="mb-10"
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {trending.map((pair) => (
              <ComparisonCard key={pair.comparison.id} pair={pair} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
