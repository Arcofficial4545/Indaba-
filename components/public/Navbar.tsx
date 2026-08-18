"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, SearchIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { BrandLogo } from "@/components/public/BrandLogo";
import { GlossyButton } from "@/components/public/GlossyButton";
import { SearchDialog, type SearchIndexItem } from "@/components/public/SearchDialog";
import { ThemeToggle } from "@/components/public/ThemeToggle";
import { MAIN_NAV } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Scroll past this and the capsule gains its frosted background. */
const FROST_AT = 8;
/** Only start hiding the bar once the reader is genuinely into the page. */
const HIDE_AFTER = 120;

export function Navbar({ searchIndex }: { searchIndex: SearchIndexItem[] }) {
  const pathname = usePathname();
  const [frosted, setFrosted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  /*
    The mobile menu records the path it was opened on. Navigating changes the
    pathname, so it closes on its own without an effect reaching for setState.
  */
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath !== null && menuPath === pathname;
  const closeMenu = () => setMenuPath(null);
  const toggleMenu = () => setMenuPath(menuOpen ? null : pathname);

  const lastScroll = useRef(0);
  const navRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  /* ---------------------------------------------------------------------- */
  /* Scroll behaviour                                                        */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        setFrosted(y > FROST_AT);

        const goingDown = y > lastScroll.current;
        // A few pixels of jitter should not flip the bar back and forth.
        if (Math.abs(y - lastScroll.current) > 4) {
          setHidden(goingDown && y > HIDE_AFTER);
          lastScroll.current = y;
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

  /*
    The sticky section nav on profile pages needs to know whether the header is
    on screen so it can sit flush against it. Publishing that as an attribute on
    the document element keeps the two components decoupled.
  */
  useEffect(() => {
    document.documentElement.dataset.headerHidden = hidden ? "true" : "false";
  }, [hidden]);

  /* ---------------------------------------------------------------------- */
  /* Sliding active pill                                                     */
  /* ---------------------------------------------------------------------- */

  const measurePill = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;

    const active = nav.querySelector<HTMLElement>("[data-active='true']");
    if (!active) {
      setPill(null);
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    setPill({
      left: activeRect.left - navRect.left,
      width: activeRect.width,
    });
  }, []);

  // Measure before paint so the pill never appears in the wrong place first.
  useLayoutEffect(() => {
    measurePill();
  }, [measurePill, pathname]);

  useEffect(() => {
    window.addEventListener("resize", measurePill);
    return () => window.removeEventListener("resize", measurePill);
  }, [measurePill]);

  /* ---------------------------------------------------------------------- */
  /* Menu and search                                                         */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
      if (event.key === "Escape") setMenuPath(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 pt-3 transition-transform duration-300 ease-out sm:pt-4",
          hidden && "-translate-y-[130%]",
        )}
      >
        <div className="container-site">
          <div
            className={cn(
              "flex h-16 items-center gap-3 rounded-full border px-3 transition-all duration-300 sm:px-4",
              frosted
                ? "border-border/70 bg-background/85 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.45)] backdrop-blur-xl"
                : "border-transparent bg-transparent",
            )}
          >
            <BrandLogo className="mr-1" />

            {/* Desktop navigation with the sliding pill behind the active link */}
            <nav
              ref={navRef}
              aria-label="Main"
              className="relative hidden items-center gap-1 lg:flex"
            >
              {pill && (
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 h-9 -translate-y-1/2 rounded-full bg-muted transition-all duration-300 ease-out"
                  style={{ left: pill.left, width: pill.width }}
                />
              )}
              {MAIN_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  data-active={isActive(item.href)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "relative z-10 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    "focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none",
                    isActive(item.href)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search software and guides"
                className="inline-grid size-10 place-items-center rounded-xl border border-border/70 text-foreground/70 transition-colors hover:bg-[var(--color-brand)] hover:text-[var(--color-brand-ink)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none"
              >
                <SearchIcon className="size-4" aria-hidden="true" />
              </button>

              <GlossyButton
                href="/contact?intent=listing"
                size="sm"
                className="hidden md:inline-flex"
              >
                List your software
              </GlossyButton>

              <ThemeToggle />

              <button
                type="button"
                onClick={toggleMenu}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className="inline-grid size-10 place-items-center rounded-xl border border-border/70 text-foreground/70 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none lg:hidden"
              >
                {menuOpen ? (
                  <XIcon className="size-4" aria-hidden="true" />
                ) : (
                  <MenuIcon className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* A floating card under the capsule, not a full screen takeover */}
          {menuOpen && (
            <div className="anim-pop mt-2 rounded-3xl border border-border bg-background/95 p-2 shadow-xl backdrop-blur-xl lg:hidden" data-state="open">
              <nav aria-label="Mobile" className="flex flex-col">
                {MAIN_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="p-2 pt-3">
                <GlossyButton
                  href="/contact?intent=listing"
                  className="w-full"
                  size="md"
                >
                  List your software
                </GlossyButton>
              </div>
            </div>
          )}
        </div>
      </header>

      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        items={searchIndex}
      />
    </>
  );
}
