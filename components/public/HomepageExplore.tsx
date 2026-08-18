"use client";

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { useState } from "react";

import { CategoryIcon } from "@/components/public/CategoryIcon";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { StarRating } from "@/components/public/StarRating";
import { formatNumber, startingPriceLabel } from "@/lib/format";
import type { Category, SoftwareWithCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Category tabs with the products inside each. Client side because switching
 * tabs should not cost a round trip, and the whole catalogue on the home page
 * is small enough to ship at once.
 */
export function HomepageExplore({
  categories,
  softwareByCategory,
}: {
  categories: Category[];
  softwareByCategory: Record<string, SoftwareWithCategory[]>;
}) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const active = categories.find((c) => c.id === activeId) ?? categories[0];
  const items = softwareByCategory[activeId] ?? [];

  if (!active) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Software categories"
        className="flex flex-wrap justify-center gap-2"
      >
        {categories.map((category) => {
          const isActive = category.id === activeId;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${category.slug}`}
              id={`tab-${category.slug}`}
              onClick={() => setActiveId(category.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                "focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none",
                isActive
                  ? "bg-[var(--color-brand)] text-[var(--color-brand-ink)]"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              <CategoryIcon name={category.icon} className="size-4" />
              {category.name}
            </button>
          );
        })}
      </div>

      {/* The nested tray: soft grey outer, 2px gap, inner cards */}
      <div
        role="tabpanel"
        id={`panel-${active.slug}`}
        aria-labelledby={`tab-${active.slug}`}
        className="rounded-[1.75rem] bg-zinc-100/80 p-2 dark:bg-zinc-900/60"
      >
        {active.description && (
          <p className="px-5 py-4 text-center text-sm text-pretty text-muted-foreground">
            {active.description}
          </p>
        )}

        <div className="grid gap-2 md:grid-cols-3">
          {items.slice(0, 6).map((software) => {
            const price = startingPriceLabel(software);
            return (
              <Link
                key={software.id}
                href={`/software/${software.slug}`}
                className="group flex flex-col gap-4 rounded-[1.4rem] border border-zinc-200/70 bg-card p-5 transition-colors hover:border-zinc-300 focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none dark:border-zinc-800 dark:hover:border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <SoftwareLogo
                    name={software.name}
                    slug={software.slug}
                    logoUrl={software.logo_url}
                    brandColor={software.brand_color}
                    size={40}
                  />
                  <div className="min-w-0">
                    <p className="truncate font-heading text-base font-bold tracking-tight">
                      {software.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {software.vendor_name}
                    </p>
                  </div>
                </div>

                <StarRating
                  rating={software.overall_rating}
                  size="sm"
                  reviewCount={software.review_count}
                />

                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {software.tagline ?? software.description_short}
                </p>

                <p className="mt-auto font-heading text-sm font-bold tabular-nums">
                  {price.amount}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="flex justify-center p-4">
          <Link
            href={`/category/${active.slug}`}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[var(--color-brand-dark)] transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none"
          >
            All {formatNumber(active.software_count)} in {active.name}
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
