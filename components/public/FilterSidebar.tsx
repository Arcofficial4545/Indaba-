"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FilterXIcon } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

const RATINGS = [4.5, 4, 3.5, 3];

/**
 * Every filter lives in the query string rather than in component state, so a
 * filtered view can be linked, bookmarked and shared, and the back button
 * behaves the way a reader expects.
 */
export function FilterSidebar({
  categories,
  className,
}: {
  categories: Category[];
  className?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value === null || value === "") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    // Any filter change invalidates the current page number.
    next.delete("page");
    router.push(`/software?${next.toString()}`, { scroll: false });
  };

  const activeCategory = params.get("category");
  const activeRating = params.get("rating");
  const hasFilters = Array.from(params.keys()).some((key) => key !== "sort");

  return (
    <aside
      aria-label="Filters"
      className={cn("flex flex-col gap-7 lg:sticky lg:top-28", className)}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-bold tracking-tight">
          Filters
        </h2>
        {hasFilters && (
          <button
            type="button"
            onClick={() => router.push("/software", { scroll: false })}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none"
          >
            <FilterXIcon className="size-3.5" aria-hidden="true" />
            Clear
          </button>
        )}
      </div>

      {/* Category */}
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-[0.7rem] font-bold tracking-widest text-muted-foreground uppercase">
          Category
        </legend>
        <FilterRadio
          name="category"
          checked={!activeCategory}
          onSelect={() => update("category", null)}
          label="All categories"
        />
        {categories.map((category) => (
          <FilterRadio
            key={category.id}
            name="category"
            checked={activeCategory === category.slug}
            onSelect={() => update("category", category.slug)}
            label={category.name}
            count={category.software_count}
          />
        ))}
      </fieldset>

      {/* Minimum rating */}
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-[0.7rem] font-bold tracking-widest text-muted-foreground uppercase">
          Minimum rating
        </legend>
        <FilterRadio
          name="rating"
          checked={!activeRating}
          onSelect={() => update("rating", null)}
          label="Any rating"
        />
        {RATINGS.map((rating) => (
          <FilterRadio
            key={rating}
            name="rating"
            checked={activeRating === String(rating)}
            onSelect={() => update("rating", String(rating))}
            label={`${rating.toFixed(1)} and above`}
          />
        ))}
      </fieldset>

      {/* Availability */}
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-[0.7rem] font-bold tracking-widest text-muted-foreground uppercase">
          Availability
        </legend>

        <CheckboxRow
          id="filter-free-trial"
          label="Has a free trial"
          checked={params.get("trial") === "1"}
          onChange={(checked) => update("trial", checked ? "1" : null)}
        />
        <CheckboxRow
          id="filter-free-version"
          label="Has a free plan"
          checked={params.get("free") === "1"}
          onChange={(checked) => update("free", checked ? "1" : null)}
        />
        <CheckboxRow
          id="filter-paid-only"
          label="Paid plans only"
          checked={params.get("paid") === "1"}
          onChange={(checked) => update("paid", checked ? "1" : null)}
        />
      </fieldset>
    </aside>
  );
}

function FilterRadio({
  name,
  checked,
  onSelect,
  label,
  count,
}: {
  name: string;
  checked: boolean;
  onSelect: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        className="size-4 shrink-0 accent-[var(--color-brand-dark)]"
      />
      <span className={cn(checked ? "font-medium text-foreground" : "text-muted-foreground")}>
        {label}
      </span>
      {count !== undefined && (
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {count}
        </span>
      )}
    </label>
  );
}

function CheckboxRow({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onChange(value === true)}
      />
      <Label htmlFor={id} className="cursor-pointer font-normal text-muted-foreground">
        {label}
      </Label>
    </div>
  );
}
