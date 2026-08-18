import Link from "next/link";
import { ArrowUpRightIcon, CheckIcon } from "lucide-react";

import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { StarRating } from "@/components/public/StarRating";
import { Badge } from "@/components/ui/badge";
import { formatNumber, startingPriceLabel } from "@/lib/format";
import type { SoftwareWithCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

/** The wide row used by the directory, as opposed to the grid card. */
export function SoftwareListRow({
  software,
  className,
}: {
  software: SoftwareWithCategory;
  className?: string;
}) {
  const price = startingPriceLabel(software);

  return (
    <article
      className={cn(
        "card-modern card-modern-hover group relative flex flex-col gap-5 p-6 sm:flex-row sm:gap-6",
        className,
      )}
    >
      <SoftwareLogo
        name={software.name}
        slug={software.slug}
        logoUrl={software.logo_url}
        brandColor={software.brand_color}
        size={64}
        className="shrink-0"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h3 className="font-heading text-lg font-bold tracking-tight">
            <Link
              href={`/software/${software.slug}`}
              className="after:absolute after:inset-0 after:rounded-[1.5rem] focus-visible:outline-none"
            >
              {software.name}
            </Link>
          </h3>
          {software.featured && <Badge variant="success">Featured</Badge>}
          {software.free_version && <Badge variant="muted">Free plan</Badge>}
          {software.free_trial && (
            <Badge variant="amber">
              {software.free_trial_days
                ? `${software.free_trial_days} day trial`
                : "Free trial"}
            </Badge>
          )}
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          {software.vendor_name}
          {software.category && (
            <span className="text-muted-foreground/70">
              {" "}
              / {software.category.name}
            </span>
          )}
        </p>

        <StarRating
          rating={software.overall_rating}
          reviewCount={software.review_count}
          size="sm"
          className="mt-3"
        />

        <p className="mt-3 text-sm leading-relaxed text-pretty text-muted-foreground">
          {software.description_short}
        </p>

        {software.top_features.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {software.top_features.slice(0, 3).map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <CheckIcon
                  className="size-3.5 shrink-0 text-[var(--color-brand-dark)]"
                  aria-hidden="true"
                />
                {feature}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex shrink-0 items-end justify-between gap-4 border-t border-border pt-4 sm:w-44 sm:flex-col sm:items-end sm:justify-between sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
        <div className="sm:text-right">
          <p
            className={cn(
              "font-heading font-bold tracking-tight tabular-nums",
              price.isCustom ? "text-base" : "text-2xl",
            )}
          >
            {price.amount}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{price.note}</p>
        </div>

        <span
          aria-hidden="true"
          className="inline-grid size-10 shrink-0 place-items-center rounded-xl border border-border text-muted-foreground transition-colors group-hover:bg-[var(--color-brand)] group-hover:text-[var(--color-brand-ink)]"
        >
          <ArrowUpRightIcon className="size-4" />
        </span>
      </div>

      <p className="sr-only">
        {formatNumber(software.review_count)} verified reviews.
      </p>
    </article>
  );
}
