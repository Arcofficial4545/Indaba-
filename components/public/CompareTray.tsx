"use client";

import Link from "next/link";
import { XIcon } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { useCompareTrayVisibility } from "@/components/public/useCompareTrayVisibility";
import { cn } from "@/lib/utils";

/**
 * The persistent compare tray.
 *
 * This is the single feature that makes the marketing site behave like the
 * product. Select a second product anywhere — the top-rated table, a category
 * listing, a product page — and the tray docks to the bottom of the viewport
 * and follows you across routes until you clear it or go and compare.
 *
 * STATE. A context in the public layout plus sessionStorage, and nothing more.
 * No state manager: this is two slugs. sessionStorage rather than localStorage
 * because a comparison is a task you are in the middle of, not a preference —
 * finding yesterday's shortlist still docked at the bottom of the page a week
 * later would be a bug, not a feature.
 *
 * WHY THE SLUGS AND THE NAMES ARE BOTH STORED. The tray has to render its
 * chips immediately on a route where the product data was never fetched. It
 * could hold slugs and re-query, but that is a round trip to render a chip the
 * user selected themselves and already has on screen. Two strings each is
 * cheaper than a query and cannot go stale within a session.
 */

export type CompareItem = {
  slug: string;
  name: string;
};

type CompareContextValue = {
  items: CompareItem[];
  /** Adds if absent, removes if present. Capped at two. */
  toggle: (item: CompareItem) => void;
  remove: (slug: string) => void;
  clear: () => void;
  has: (slug: string) => boolean;
  /** True once the stored value has been read, so the UI never flickers. */
  ready: boolean;
};

const CompareContext = createContext<CompareContextValue | null>(null);

const STORAGE_KEY = "indaba:compare";
/** Two pans, two products. The compare route only ever takes a pair. */
const MAX_ITEMS = 2;

export function useCompare(): CompareContextValue {
  const value = useContext(CompareContext);
  if (!value) {
    throw new Error("useCompare must be used inside <CompareProvider>");
  }
  return value;
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);
  const [ready, setReady] = useState(false);

  /*
    Read after mount rather than in a lazy initialiser. sessionStorage does not
    exist on the server, so initialising from it would render one thing on the
    server and another on the client and React would throw a hydration
    mismatch. `ready` is what lets the tray stay unmounted until the truth is
    known instead of flashing empty and then filling.
  */
  /* eslint-disable react-hooks/set-state-in-effect -- the hydration safe restore described above */
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(
            parsed
              .filter(
                (entry): entry is CompareItem =>
                  typeof entry?.slug === "string" &&
                  typeof entry?.name === "string",
              )
              .slice(0, MAX_ITEMS),
          );
        }
      }
    } catch {
      /* Private mode, or somebody put junk in the key. Start empty. */
    }
    setReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* Nothing to do. The tray still works for this page view. */
    }
  }, [items, ready]);

  const toggle = useCallback((item: CompareItem) => {
    setItems((current) => {
      const existing = current.find((entry) => entry.slug === item.slug);
      if (existing) {
        return current.filter((entry) => entry.slug !== item.slug);
      }
      /*
        At the cap, the OLDEST selection is dropped rather than the new click
        being ignored. Silently refusing a click is the more confusing
        behaviour: the checkbox does not tick and nothing explains why.
      */
      const next = [...current, item];
      return next.slice(-MAX_ITEMS);
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((current) => current.filter((entry) => entry.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CompareContextValue>(
    () => ({
      items,
      toggle,
      remove,
      clear,
      has: (slug: string) => items.some((entry) => entry.slug === slug),
      ready,
    }),
    [items, toggle, remove, clear, ready],
  );

  return (
    <CompareContext.Provider value={value}>
      {children}
      <CompareTray />
    </CompareContext.Provider>
  );
}

function CompareTray() {
  const { items, remove, clear, ready } = useCompare();
  const inCompareArea = useCompareTrayVisibility();
  const open = ready && items.length > 0 && inCompareArea;

  // Reserve bottom space only while the tray is actually visible.
  useEffect(() => {
    document.documentElement.dataset.compareOpen = String(open);
    return () => { document.documentElement.dataset.compareOpen = "false"; };
  }, [open]);

  if (!open) return null;

  const [a, b] = items;
  const canCompare = items.length === MAX_ITEMS;

  return (
    <div
      className="compare-tray"
      role="region"
      aria-label="Products selected for comparison"
    >
      <div className="container-site compare-tray-inner">
        <ul className="compare-tray-items">
          {items.map((item) => (
            <li key={item.slug} className="compare-tray-chip">
              <SoftwareLogo
                name={item.name}
                slug={item.slug}
                logoUrl={null}
                brandColor={null}
                size={24}
              />
              <span className="compare-tray-name">{item.name}</span>
              <button
                type="button"
                onClick={() => remove(item.slug)}
                aria-label={`Remove ${item.name} from comparison`}
                className="compare-tray-remove"
              >
                <XIcon className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}

          {/*
            The empty slot, stated rather than implied, and it is an
            instruction rather than a label. With one product chosen the tray
            otherwise looks finished and the reader has no way to know it is
            waiting for a second — which is exactly what happened when the
            Compare buttons moved up into the product grid.

            aria-live, because the tray appears on a click somewhere else on
            the page: a screen reader gets told what just happened and what to
            do next, at the moment the first product goes in.
          */}
          {!canCompare && (
            <li className="compare-tray-slot" aria-live="polite">
              Pick one more product to compare
            </li>
          )}
        </ul>

        <div className="compare-tray-actions">
          <button type="button" onClick={clear} className="compare-tray-clear">
            Clear
          </button>
          {canCompare ? (
            <Link
              href={`/compare/${a.slug}-vs-${b.slug}`}
              className="btn-glossy compare-tray-go"
            >
              Compare
            </Link>
          ) : (
            <span
              className={cn("btn-glossy compare-tray-go", "opacity-50")}
              aria-disabled="true"
            >
              Compare
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * The checkbox that fills the tray. Used by the top-rated table, the category
 * listing rows and the product page's sticky rail, so all three agree on what
 * "add to compare" means and look identical doing it.
 */
export function CompareToggle({
  slug,
  name,
  className,
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const { has, toggle, ready } = useCompare();
  const selected = ready && has(slug);

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={() => toggle({ slug, name })}
      className={cn("compare-toggle", className)}
    >
      <span aria-hidden="true" className="compare-toggle-box" />
      <span className="sr-only">Compare {name}</span>
    </button>
  );
}

/**
 * The labelled version of the toggle, for a card that has room for a real
 * button rather than a checkbox.
 *
 * Same state, same two-item cap, same store. It exists because a bare checkbox
 * in a grid of twenty products does not read as "compare this" — the reader
 * has to already know what the box does, and the clarity rules say an
 * interactive element must look like what it does without being hovered.
 */
export function CompareButton({
  slug,
  name,
  className,
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const { has, toggle, ready } = useCompare();
  const selected = ready && has(slug);

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => toggle({ slug, name })}
      className={cn("card-cta card-cta-compare", className)}
      data-selected={selected ? "true" : "false"}
    >
      {selected ? "Added" : "Compare"}
      <span className="sr-only"> {name}</span>
    </button>
  );
}
