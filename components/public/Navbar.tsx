"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, SearchIcon, XIcon } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

import { SPRING } from "@/components/motion/springs";
import { useReducedMotionSafe } from "@/components/motion/reduced-motion";
import { BrandLogo } from "@/components/public/BrandLogo";
import { CategorySheet } from "@/components/public/CategorySheet";
import { useSearch } from "@/components/public/SearchProvider";
import { ThemeToggle } from "@/components/public/ThemeToggle";
import type { NavCategory, NavComparison } from "@/lib/queries/nav";
import { MAIN_NAV } from "@/lib/site";
import { cn } from "@/lib/utils";

/*
  Two thresholds, not one.

  A single threshold means a reader resting a trackpad near the boundary can
  flip the bar between bare and docked several times a second, and the spring
  never even settles. The gap between engage and release is the hysteresis
  that makes that impossible.
*/
const DOCK_ENGAGE = 80;
const DOCK_RELEASE = 24;
/** Jitter below this is not a scroll direction change. */
const DIRECTION_NOISE = 6;

export function Navbar({
  categories,
  featured,
}: {
  categories: NavCategory[];
  featured: NavComparison | null;
}) {
  const pathname = usePathname();
  const reduced = useReducedMotionSafe();
  /*
    The dialog itself lives in SearchProvider, mounted once in the public
    layout, because the hero field opens the same panel. The navbar only asks
    for it to open.
  */
  const search = useSearch();

  /*
    TWO PIECES OF STATE, because they answer different questions.

    `docked` is "am I off the top of the page", and it owns the ink capsule.
    `compact` is "am I moving forwards", and it owns the contraction.

    They used to be one flag, and that was a real bug rather than a tidiness
    problem: scrolling up anywhere on the page returned the bar to its bare,
    fully transparent state, which is only safe at the very top where the
    page background IS the navbar background. Six hundred pixels down it put
    transparent nav links directly on top of live content — at 1700px the
    wordmark sat across a category heading and the CTA across a preview card.

    Bare is now bound to position and nothing else. Reversing still expands
    the row, exactly as the brief asks, but it expands onto ink.
  */
  const [docked, setDocked] = useState(false);
  const [compact, setCompact] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetTriggerRef = useRef<HTMLButtonElement>(null);
  const sheetId = useId();

  /*
    The mobile menu records the path it was opened on. Navigating changes the
    pathname, so it closes on its own without an effect reaching for setState.
  */
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath !== null && menuPath === pathname;
  const closeMenu = () => setMenuPath(null);

  /* ---------------------------------------------------------------------- */
  /* Docking                                                                 */
  /* ---------------------------------------------------------------------- */

  /*
    State is read from a ref inside the listener rather than from the closure.
    Registered once with an empty dependency list, a closure over `docked`
    would be permanently stale and the release threshold would never fire.
  */
  const dockedRef = useRef(false);
  const compactRef = useRef(false);
  const lastY = useRef(0);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - lastY.current;

        /*
          The capsule is a function of position only, with the two thresholds
          providing the hysteresis. Direction does not appear here, which is
          the fix: there is no scroll gesture that can strip the background
          off the bar while content is passing underneath it.
        */
        const wantDocked = dockedRef.current
          ? y >= DOCK_RELEASE
          : y > DOCK_ENGAGE;
        if (wantDocked !== dockedRef.current) {
          dockedRef.current = wantDocked;
          setDocked(wantDocked);
        }

        if (Math.abs(delta) > DIRECTION_NOISE) {
          /*
            Direction owns the contraction and nothing else. Reading forwards
            contracts the row to the compact capsule; looking back expands it
            again, still on ink.
          */
          const wantCompact = delta > 0;
          if (wantCompact !== compactRef.current) {
            compactRef.current = wantCompact;
            setCompact(wantCompact);
          }
          lastY.current = y;
        }

        // Nothing is contracted when the bar has no capsule to contract into.
        if (!wantDocked && compactRef.current) {
          compactRef.current = false;
          setCompact(false);
        }
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Keyboard                                                                */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        search.toggle();
      }
      if (event.key === "Escape") setMenuPath(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [search]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  /*
    Categories is a button, not a link, because it opens the sheet. It still
    reflects the active route so the bar does not lie about where you are.
  */
  const items = MAIN_NAV.filter((item) => item.href !== "/categories");

  return (
    <>
      <header className="sticky top-0 z-50 pt-3 sm:pt-4">
        <div className="container-site">
          {/*
            One element carries the whole gesture. `layout` lets motion animate
            the size and position change between the bare row and the docked
            capsule rather than crossfading two different bars, which is what
            makes it read as one object contracting.

            `layout` is off entirely under reduced motion: the two states still
            swap, instantly, which is the final state rather than a slower
            version of the transition.
          */}
          <motion.div
            layout={!reduced}
            transition={reduced ? { duration: 0 } : SPRING}
            data-docked={docked ? "true" : "false"}
            data-compact={compact ? "true" : "false"}
            className={cn(
              "flex h-14 items-center gap-2 sm:gap-3",
              /*
                Docked, the bar shrinks to its content and centres. Keeping it
                full-container-width would leave an ink slab 1184px across,
                which is a colour change rather than a contraction, and the
                contraction is the entire idea. `w-fit` plus `layout` is what
                makes the sides actually travel inward.

                Both docked states use the same capsule. What separates
                compact from expanded is which children are showing, so the
                capsule measures itself narrower reading forwards and wider
                looking back — one object changing size, which is what the
                layout animation is for.
              */
              docked ? "nav-capsule mx-auto w-fit" : "nav-bare w-full",
            )}
          >
            <motion.div layout={!reduced} transition={SPRING}>
              <BrandLogo
                className={cn(
                  "mr-1 transition-colors",
                  docked && "text-[var(--color-text-on-ink)]",
                )}
              />
            </motion.div>

            <nav
              aria-label="Main"
              className="hidden items-center gap-1 lg:flex"
            >
              <button
                ref={sheetTriggerRef}
                type="button"
                /*
                  Click, never hover. A hover menu is unreachable by keyboard
                  and hostile on touch, and this one holds the site's whole
                  taxonomy.
                */
                onClick={() => setSheetOpen((open) => !open)}
                aria-expanded={sheetOpen}
                aria-controls={sheetId}
                data-active={isActive("/categories")}
                className="nav-link"
              >
                Categories
              </button>

              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  data-active={isActive(item.href)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="nav-link"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              {/*
                Search collapses to a ⌘K affordance once docked. Same dialog,
                two entry points, one implementation.
              */}
              <button
                type="button"
                onClick={search.open}
                aria-label="Search software and guides"
                aria-keyshortcuts="Meta+K Control+K"
                className="nav-control"
              >
                <SearchIcon className="size-4" aria-hidden="true" />
                <motion.span
                  layout={!reduced}
                  className={cn(
                    "hidden text-sm md:inline",
                    compact && "md:hidden",
                  )}
                >
                  Search
                </motion.span>
                <kbd
                  className={cn(
                    "nav-kbd hidden",
                    compact ? "md:inline-flex" : "lg:inline-flex",
                  )}
                >
                  ⌘K
                </kbd>
              </button>

              <ThemeToggle />

              <Link
                href="/contact?intent=listing"
                className={cn(
                  "hidden h-10 items-center rounded-full px-5 text-sm font-medium md:inline-flex",
                  "transition-colors active:scale-[0.98]",
                  docked ? "nav-cta-on-ink" : "nav-cta",
                )}
              >
                List your software
              </Link>

              <button
                type="button"
                onClick={() => setMenuPath(menuOpen ? null : pathname)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className="nav-control lg:hidden"
              >
                {menuOpen ? (
                  <XIcon className="size-4" aria-hidden="true" />
                ) : (
                  <MenuIcon className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      <CategorySheet
        id={sheetId}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        triggerRef={sheetTriggerRef}
        categories={categories}
        featured={featured}
      />

      <MobileSheet
        open={menuOpen}
        onClose={closeMenu}
        categories={categories}
        isActive={isActive}
      />
    </>
  );
}

/**
 * The mobile navigation. A full screen sheet, large type, items staggered in
 * at 40ms. Not a floating card: on a phone the nav is the whole screen while
 * it is open, and pretending otherwise leaves a 44px tap target list crammed
 * under a capsule.
 */
function MobileSheet({
  open,
  onClose,
  categories,
  isActive,
}: {
  open: boolean;
  onClose: () => void;
  categories: NavCategory[];
  isActive: (href: string) => boolean;
}) {
  const reduced = useReducedMotionSafe();

  /*
    A sheet that covers the page must not leave the page scrolling underneath
    it, and it must not leave the document jumping when the scrollbar goes.
    Compensating with padding keeps the layout still.
  */
  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
    };
  }, [open]);

  if (!open) return null;

  const links = [
    ...MAIN_NAV,
    ...categories.map((c) => ({
      label: c.name,
      href: `/category/${c.slug}`,
    })),
  ];

  return (
    <div className="nav-mobile-sheet lg:hidden">
      <nav aria-label="Mobile" className="container-site flex flex-col py-6">
        {links.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            aria-current={isActive(item.href) ? "page" : undefined}
            className="nav-mobile-link"
            style={
              reduced ? undefined : { animationDelay: `${index * 40}ms` }
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
