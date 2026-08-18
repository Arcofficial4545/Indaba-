import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

import { CategoryIcon } from "@/components/public/CategoryIcon";
import { formatNumber } from "@/lib/format";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CategoryCard({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "card-modern card-modern-hover group relative flex flex-col gap-4 p-6",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-12 place-items-center rounded-2xl bg-[var(--color-brand-light)] text-[var(--color-brand-dark)]"
      >
        <CategoryIcon name={category.icon} className="size-6" />
      </span>

      <h3 className="font-heading text-lg font-bold tracking-tight">
        <Link
          href={`/category/${category.slug}`}
          className="after:absolute after:inset-0 after:rounded-[1.5rem] focus-visible:outline-none"
        >
          {category.name}
        </Link>
      </h3>

      {category.description && (
        <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
          {category.description}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
        <p className="text-sm text-muted-foreground tabular-nums">
          {formatNumber(category.software_count)} products
        </p>
        <span
          aria-hidden="true"
          className="inline-grid size-9 place-items-center rounded-xl border border-border text-muted-foreground transition-colors group-hover:bg-[var(--color-brand)] group-hover:text-[var(--color-brand-ink)]"
        >
          <ArrowUpRightIcon className="size-4" />
        </span>
      </div>
    </article>
  );
}
