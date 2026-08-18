import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { CategoryCard } from "@/components/public/CategoryCard";
import { getCategories } from "@/lib/queries/categories";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Software categories",
  description:
    "Browse business software by category: accounting, payroll, HR, CRM, ERP and project management, all reviewed for the South African market.",
  alternates: { canonical: `${SITE_URL}/categories` },
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container-site flex flex-col gap-12 py-8">
      <Breadcrumbs items={[{ label: "Categories" }]} />

      <header className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.12]">
          Start with the{" "}
          <span className="brand-highlight">job to be done</span>
        </h1>
        <p className="text-base leading-relaxed text-pretty text-muted-foreground">
          Six categories, each judged against the same local yardstick: SARS
          compliance, pricing in rand and support you can actually reach during a
          South African working day.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
