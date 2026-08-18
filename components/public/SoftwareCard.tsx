import Link from "next/link";
import { ArrowUpRightIcon, CheckIcon } from "lucide-react";

import { SentimentBar } from "@/components/public/SentimentBar";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { StarRating } from "@/components/public/StarRating";
import { Badge } from "@/components/ui/badge";
import { formatNumber, startingPriceLabel } from "@/lib/format";
import type { SoftwareWithCategory, StarDistribution } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SoftwareCard({
  software,
  distribution,
  rank,
  className,
}: {
  software: SoftwareWithCategory;
  distribution?: StarDistribution;
  rank?: number;
  className?: string;
}) {
  const price = startingPriceLabel(software);

  return (
    <article
      className={cn(
        "card-modern card-modern-hover group relative flex flex-col gap-5 p-6",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <SoftwareLogo
          name={software.name}
          slug={software.slug}
          logoUrl={software.logo_url}
          brandColor={software.brand_color}
          size={52}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-lg font-bold tracking-tight">
              {/*
                The overlay makes the whole card clickable while keeping the
                accessible name on a real link.
              */}
              <Link
                href={`/software/${software.slug}`}
                className="after:absolute after:inset-0 after:rounded-[1.5rem] focus-visible:outline-none"
              >
                {software.name}
              </Link>
            </h3>
            {rank !== undefined && (
              <span className="font-heading text-sm font-bold text-muted-foreground/50 tabular-nums">
                {String(rank).padStart(2, "0")}
              </span>
            )}
          </div>

          {software.category && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {software.category.name}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <StarRating
          rating={software.overall_rating}
          reviewCount={software.review_count}
          size="sm"
        />
        {software.featured && <Badge variant="success">Featured</Badge>}
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {software.tagline ?? software.description_short}
      </p>

      {software.top_features.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {software.top_features.slice(0, 3).map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <CheckIcon
                className="mt-0.5 size-3.5 shrink-0 text-[var(--color-brand-dark)]"
                aria-hidden="true"
              />
              {feature}
            </li>
          ))}
        </ul>
      )}

      {distribution && <SentimentBar distribution={distribution} />}

      <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-5">
        <div>
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

      {software.review_count > 0 && (
        <p className="sr-only">
          Based on {formatNumber(software.review_count)} verified reviews.
        </p>
      )}
    </article>
  );
}
