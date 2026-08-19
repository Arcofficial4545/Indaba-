"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { HERO_COPY } from "@/lib/site";

/**
 * The only client component in the hero.
 *
 * It exists on its own so the rest of the hero stays a Server Component: the
 * headline, the chips, the counts and the illustration are all rendered on the
 * server and never enter the bundle.
 *
 * The site wide GlossyButton is deliberately not used here. It is built from
 * stacked linear-gradients, and the hero carries no gradient of any kind.
 */
export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(
      trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/software",
    );
  };

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className="hero-field flex w-full max-w-xl items-center gap-1 border border-hero-ink/20 bg-hero-canvas p-2 ps-3 transition-colors focus-within:border-hero-ink/50"
    >
      <label htmlFor="hero-search" className="sr-only">
        {HERO_COPY.searchLabel}
      </label>

      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center text-muted-foreground"
      >
        <SearchIcon className="size-[1.125rem]" />
      </span>

      <input
        id="hero-search"
        type="search"
        name="q"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={HERO_COPY.searchPlaceholder}
        className="h-11 min-w-0 flex-1 bg-transparent text-[0.9375rem] text-hero-ink outline-none placeholder:text-muted-foreground"
      />

      {/*
        The lime CTA, and one of exactly two places the brand accent appears in
        the hero. It runs on .btn-glossy, the same class as the navbar's own
        call to action, so the two primary buttons on the page are one material
        rather than two takes on lime. .btn-shine adds the travelling
        highlight; the pill radius matches the field around it.
      */}
      <button
        type="submit"
        className="btn-glossy btn-shine h-11 shrink-0 rounded-full px-6 text-sm sm:px-8"
      >
        Search
      </button>
    </form>
  );
}
