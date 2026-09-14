"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

import {
  SearchDialog,
  type SearchIndexItem,
} from "@/components/public/SearchDialog";

/**
 * One search dialog for the whole site, with two entry points.
 *
 * The brief is specific that the hero field and ⌘K must open the *same* cmdk
 * panel — one search implementation, not two that drift. The navbar owned the
 * dialog before, so the hero could not reach it without either rendering a
 * second instance (two indexes in the bundle, two panels that can both be
 * open) or lifting the state.
 *
 * This is the smallest possible lift. It is not a state manager: one boolean,
 * one context, one dialog instance, mounted once in the public layout. The
 * engineering constraint the brief sets is "every abstraction must pay for
 * itself twice", and this one has exactly two consumers, which is the bar.
 */

type SearchContextValue = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function useSearch(): SearchContextValue {
  const value = useContext(SearchContext);
  if (!value) {
    throw new Error("useSearch must be used inside <SearchProvider>");
  }
  return value;
}

export function SearchProvider({
  items,
  children,
}: {
  items: SearchIndexItem[];
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  /*
    Memoised so the context value is referentially stable. Without it every
    render of the layout would re-render every consumer, which on this site
    means the navbar and the hero on every route change.
  */
  const value = useMemo<SearchContextValue>(
    () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((prev) => !prev),
    }),
    [],
  );

  const onOpenChange = useCallback((next: boolean) => setIsOpen(next), []);

  return (
    <SearchContext.Provider value={value}>
      {children}
      <SearchDialog open={isOpen} onOpenChange={onOpenChange} items={items} />
    </SearchContext.Provider>
  );
}
