"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useSearch } from "@/components/public/SearchProvider";
import { HERO_COPY } from "@/lib/site";

/**
 * The hero's primary object.
 *
 * On a directory, search is the product, so this is not an afterthought below
 * the fold. It is the largest control on the page.
 *
 * TWO ENTRY POINTS, ONE IMPLEMENTATION. Focusing this field opens the same
 * cmdk panel that ⌘K opens, which lives in SearchProvider. That is why this
 * does not maintain its own results list.
 *
 * It is still a real GET form. With JavaScript off the field submits to
 * /search and the page works; the cmdk panel is the enhancement layered on
 * top. Losing search entirely without JS would be a poor trade on a site
 * whose whole business is organic traffic.
 *
 * The placeholder is STATIC. An earlier plan had it cross-fading between
 * category names behind a mask wipe; that is a second automatic animation in
 * the same viewport as the scale, and the hero's entire argument is that one
 * object moves. The popular-category chips underneath carry that signal
 * instead, and they are real links rather than decoration.
 */
export function HeroSearch() {
  const router = useRouter();
  const search = useSearch();
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
      action="/search"
      method="get"
      onSubmit={onSubmit}
      className="hero-field"
    >
      <label htmlFor="hero-search" className="sr-only">
        {HERO_COPY.searchLabel}
      </label>

      <span aria-hidden="true" className="hero-field-icon">
        <SearchIcon className="size-[1.125rem]" />
      </span>

      <input
        id="hero-search"
        type="search"
        name="q"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        /*
          Opening on focus rather than on click means the keyboard reaches it
          too: tabbing into the field is the same gesture as clicking it.
        */
        onFocus={search.open}
        placeholder={HERO_COPY.searchPlaceholder}
        className="hero-field-input"
      />

      <button type="submit" className="btn-glossy hero-field-button">
        Search
      </button>
    </form>
  );
}
