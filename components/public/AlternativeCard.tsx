import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { StarRating } from "@/components/public/StarRating";
import { formatRating, startingPriceLabel } from "@/lib/format";
import type { SoftwareWithCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AlternativeCard({
  software,
  comparedTo,
  rank,
  className,
}: {
  software: SoftwareWithCategory;
  /** When given, the card explains how it stacks up against this product. */
  comparedTo?: SoftwareWithCategory;
  rank?: number;
  className?: string;
}) {
  const price = startingPriceLabel(software);

  const verdict = comparedTo
    ? software.overall_rating > comparedTo.overall_rating
      ? `Rates ${formatRating(software.overall_rating - comparedTo.overall_rating)} higher overall`
      : software.overall_rating < comparedTo.overall_rating
        ? `Rates ${formatRating(comparedTo.overall_rating - software.overall_rating)} lower overall`
        : "Rates evenly overall"
    : null;

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-4 rounded-[1.4rem] border border-zinc-200/70 bg-card p-6 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <SoftwareLogo
          name={software.name}
          slug={software.slug}
          logoUrl={software.logo_url}
          brandColor={software.brand_color}
          size={44}
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-base font-bold tracking-tight">
            <Link
              href={`/software/${software.slug}`}
              className="after:absolute after:inset-0 after:rounded-[1.4rem] focus-visible:outline-none"
            >
              {software.name}
            </Link>
          </h3>
          <p className="truncate text-xs text-muted-foreground">
            {software.vendor_name}
          </p>
        </div>
        {rank !== undefined && (
          <span
            aria-hidden="true"
            className="font-heading text-sm font-bold text-muted-foreground/40 tabular-nums"
          >
            {String(rank).padStart(2, "0")}
          </span>
        )}
      </div>

      <StarRating
        rating={software.overall_rating}
        reviewCount={software.review_count}
        size="sm"
      />

      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {software.description_short}
      </p>

      {verdict && (
        <p className="text-xs font-medium text-[var(--color-brand-dark)]">
          {verdict}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
        <p className="font-heading text-base font-bold tabular-nums">
          {price.amount}
        </p>
        <ArrowRightIcon
          className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </div>
    </article>
  );
}
