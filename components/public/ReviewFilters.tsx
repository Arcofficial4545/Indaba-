"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { StarIcon } from "lucide-react";

import { COMPANY_SIZES } from "@/lib/types";
import { cn } from "@/lib/utils";

const SORTS = [
  { value: "recent", label: "Most recent" },
  { value: "helpful", label: "Most helpful" },
  { value: "highest", label: "Highest rated" },
  { value: "lowest", label: "Lowest rated" },
] as const;

export function ReviewFilters({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value === null) next.delete(key);
    else next.set(key, value);
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const activeRating = params.get("rating");
  const activeSize = params.get("size");

  return (
    <div className="card-modern flex flex-col gap-5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground tabular-nums">
            {total}
          </span>{" "}
          reviews match
        </p>

        <div className="flex items-center gap-2">
          <label htmlFor="review-sort" className="text-sm text-muted-foreground">
            Sort by
          </label>
          <select
            id="review-sort"
            value={params.get("sort") ?? "recent"}
            onChange={(event) => update("sort", event.target.value)}
            className="h-9 rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            {SORTS.map((sort) => (
              <option key={sort.value} value={sort.value}>
                {sort.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Star filter */}
      <div className="flex flex-wrap gap-2">
        <FilterPill
          active={!activeRating}
          onClick={() => update("rating", null)}
        >
          All ratings
        </FilterPill>
        {[5, 4, 3, 2, 1].map((star) => (
          <FilterPill
            key={star}
            active={activeRating === String(star)}
            onClick={() => update("rating", String(star))}
          >
            {star}
            <StarIcon
              className="size-3 fill-[var(--color-star)] text-[var(--color-star)]"
              aria-hidden="true"
            />
          </FilterPill>
        ))}
      </div>

      {/* Company size filter */}
      <div className="flex flex-wrap gap-2">
        <FilterPill active={!activeSize} onClick={() => update("size", null)}>
          Any company size
        </FilterPill>
        {COMPANY_SIZES.map((size) => (
          <FilterPill
            key={size}
            active={activeSize === size}
            onClick={() => update("size", size)}
          >
            {size}
          </FilterPill>
        ))}
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
        "focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none",
        active
          ? "bg-[var(--color-brand)] text-[var(--color-brand-ink)]"
          : "bg-muted text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
