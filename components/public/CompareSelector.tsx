"use client";

import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";
import { useState } from "react";

import { GlossyButton } from "@/components/public/GlossyButton";
import { canonicalComparisonSlug } from "@/lib/utils";

export type CompareOption = {
  slug: string;
  name: string;
  category: string | null;
};

/**
 * Pick two products and go. Both selects exclude whatever the other has
 * chosen, so it is impossible to build a comparison of a product against
 * itself.
 */
export function CompareSelector({ options }: { options: CompareOption[] }) {
  const router = useRouter();
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  const ready = left !== "" && right !== "" && left !== right;

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ready) return;
    router.push(`/compare/${canonicalComparisonSlug(left, right)}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[1.75rem] bg-zinc-100/80 p-2 dark:bg-zinc-900/60"
    >
      <div className="grid items-end gap-2 md:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-[1.4rem] border border-zinc-200/70 bg-card p-5 dark:border-zinc-800">
          <label
            htmlFor="compare-left"
            className="text-[0.7rem] font-bold tracking-widest text-muted-foreground uppercase"
          >
            First product
          </label>
          <Picker
            id="compare-left"
            value={left}
            onChange={setLeft}
            options={options.filter((option) => option.slug !== right)}
          />
        </div>

        <span
          aria-hidden="true"
          className="hidden py-6 text-center font-heading text-sm font-bold tracking-widest text-muted-foreground uppercase md:block"
        >
          vs
        </span>

        <div className="rounded-[1.4rem] border border-zinc-200/70 bg-card p-5 dark:border-zinc-800">
          <label
            htmlFor="compare-right"
            className="text-[0.7rem] font-bold tracking-widest text-muted-foreground uppercase"
          >
            Second product
          </label>
          <Picker
            id="compare-right"
            value={right}
            onChange={setRight}
            options={options.filter((option) => option.slug !== left)}
          />
        </div>
      </div>

      <div className="flex justify-center p-4">
        <GlossyButton size="lg" disabled={!ready}>
          Compare them
          <ArrowRightIcon aria-hidden="true" />
        </GlossyButton>
      </div>
    </form>
  );
}

function Picker({
  id,
  value,
  onChange,
  options,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: CompareOption[];
}) {
  // Group by category so a long list stays navigable.
  const groups = new Map<string, CompareOption[]>();
  for (const option of options) {
    const key = option.category ?? "Other";
    const list = groups.get(key) ?? [];
    list.push(option);
    groups.set(key, list);
  }

  return (
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="mt-3 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-[var(--color-brand-dark)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
    >
      <option value="">Choose a product</option>
      {Array.from(groups.entries()).map(([category, items]) => (
        <optgroup key={category} label={category}>
          {items.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
