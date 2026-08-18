import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { formatRating } from "@/lib/format";
import type { ComparisonPair } from "@/lib/queries/comparisons";
import { cn } from "@/lib/utils";

export function ComparisonCard({
  pair,
  className,
}: {
  pair: ComparisonPair;
  className?: string;
}) {
  const { comparison, a, b } = pair;
  const leader =
    a.overall_rating === b.overall_rating
      ? null
      : a.overall_rating > b.overall_rating
        ? a
        : b;

  return (
    <article
      className={cn(
        "card-modern card-modern-hover group relative flex flex-col gap-5 p-6",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <SideFace software={a} />
        <span
          aria-hidden="true"
          className="font-heading text-xs font-bold tracking-widest text-muted-foreground uppercase"
        >
          vs
        </span>
        <SideFace software={b} align="end" />
      </div>

      <h3 className="text-center font-heading text-base font-bold tracking-tight text-balance">
        <Link
          href={`/compare/${comparison.slug}`}
          className="after:absolute after:inset-0 after:rounded-[1.5rem] focus-visible:outline-none"
        >
          {a.name} or {b.name}
        </Link>
      </h3>

      <p className="text-center text-sm leading-relaxed text-muted-foreground">
        {leader
          ? `${leader.name} rates higher overall, though the right answer depends on how you work.`
          : "The two rate evenly overall, so the decision comes down to fit."}
      </p>

      <div className="mt-auto flex items-center justify-center gap-2 border-t border-border pt-5 text-sm font-medium text-[var(--color-brand-dark)]">
        Read the comparison
        <ArrowRightIcon
          className="size-4 transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </div>
    </article>
  );
}

function SideFace({
  software,
  align = "start",
}: {
  software: ComparisonPair["a"];
  align?: "start" | "end";
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-2",
        align === "end" ? "items-end text-right" : "items-start text-left",
      )}
    >
      <SoftwareLogo
        name={software.name}
        slug={software.slug}
        logoUrl={software.logo_url}
        brandColor={software.brand_color}
        size={44}
      />
      <p className="truncate text-sm font-medium">{software.name}</p>
      <p className="font-heading text-lg font-bold tabular-nums">
        {formatRating(software.overall_rating)}
      </p>
    </div>
  );
}
