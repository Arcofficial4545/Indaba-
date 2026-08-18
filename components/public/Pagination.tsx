import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Pagination that preserves every active filter.
 *
 * The caller passes the current query string, and only the page number is
 * rewritten, so a reader four filters deep on page three can share the link.
 */
export function Pagination({
  page,
  totalPages,
  basePath,
  params,
  className,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  params?: Record<string, string | undefined>;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const href = (target: number) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params ?? {})) {
      if (value !== undefined && value !== "" && key !== "page") {
        query.set(key, value);
      }
    }
    if (target > 1) query.set("page", String(target));
    const suffix = query.toString();
    return suffix ? `${basePath}?${suffix}` : basePath;
  };

  // Show a window around the current page rather than every number.
  const pages: (number | "gap")[] = [];
  for (let i = 1; i <= totalPages; i += 1) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "gap") {
      pages.push("gap");
    }
  }

  const stepClass =
    "inline-grid size-10 place-items-center rounded-xl border border-border text-sm transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none";

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-2", className)}
    >
      {page > 1 ? (
        <Link href={href(page - 1)} className={stepClass} aria-label="Previous page">
          <ChevronLeftIcon className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span className={cn(stepClass, "opacity-40")} aria-hidden="true">
          <ChevronLeftIcon className="size-4" />
        </span>
      )}

      {pages.map((entry, index) =>
        entry === "gap" ? (
          <span
            key={`gap-${index}`}
            className="px-1 text-muted-foreground"
            aria-hidden="true"
          >
            ...
          </span>
        ) : (
          <Link
            key={entry}
            href={href(entry)}
            aria-current={entry === page ? "page" : undefined}
            className={cn(
              stepClass,
              "tabular-nums",
              entry === page &&
                "border-transparent bg-[var(--color-brand)] font-semibold text-[var(--color-brand-ink)] hover:bg-[var(--color-brand-strong)]",
            )}
          >
            {entry}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link href={href(page + 1)} className={stepClass} aria-label="Next page">
          <ChevronRightIcon className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span className={cn(stepClass, "opacity-40")} aria-hidden="true">
          <ChevronRightIcon className="size-4" />
        </span>
      )}
    </nav>
  );
}
