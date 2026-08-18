"use client";

import { useRouter, useSearchParams } from "next/navigation";

const OPTIONS = [
  { value: "reviewed", label: "Most reviewed" },
  { value: "rated", label: "Highest rated" },
  { value: "updated", label: "Recently updated" },
  { value: "price", label: "Lowest price" },
] as const;

export function DirectorySort() {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("sort") ?? "reviewed";

  const onChange = (value: string) => {
    const next = new URLSearchParams(params.toString());
    // Sorting never changes which results match, but it does change page 1.
    next.set("sort", value);
    next.delete("page");
    router.push(`/software?${next.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="directory-sort"
        className="text-sm whitespace-nowrap text-muted-foreground"
      >
        Sort by
      </label>
      <select
        id="directory-sort"
        value={current}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-[var(--color-brand-dark)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
