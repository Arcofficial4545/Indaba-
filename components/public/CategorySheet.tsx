"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { Figure } from "@/components/public/Figure";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { formatNumber, formatRating } from "@/lib/format";
import type { NavCategory, NavComparison } from "@/lib/queries/nav";
import { cn } from "@/lib/utils";

/**
 * The categories mega-sheet.
 *
 * Opens on click and never on hover. A hover menu cannot be reached from a
 * keyboard and fires by accident on touch, and this one holds the site's
 * entire taxonomy, so it is the last thing that should be a hover target.
 *
 * Four columns of categories with live counts, one real head-to-head on the
 * right. Escape closes it, focus is trapped while it is open, and focus
 * returns to the trigger on close.
 *
 * The reveal is a clip-path wipe from the top edge, which is a compositor
 * property. Animating height would reflow the whole document under it on
 * every frame.
 */
export function CategorySheet({
  id,
  open,
  onClose,
  triggerRef,
  categories,
  featured,
}: {
  id: string;
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  categories: NavCategory[];
  featured: NavComparison | null;
}) {
  const panel = useRef<HTMLDivElement>(null);

  /* ---- escape, outside click, and focus return --------------------------- */
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        // Focus goes back where it came from, not to the top of the document.
        triggerRef.current?.focus();
      }
    };

    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panel.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      onClose();
    };

    document.addEventListener("keydown", onKey);
    // Deferred so the click that opened the sheet does not immediately close it.
    const timer = window.setTimeout(() => {
      document.addEventListener("pointerdown", onPointer);
    }, 0);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      window.clearTimeout(timer);
    };
  }, [open, onClose, triggerRef]);

  /* ---- focus trap --------------------------------------------------------- */
  useEffect(() => {
    if (!open) return;
    const node = panel.current;
    if (!node) return;

    const first = node.querySelector<HTMLElement>("a, button");
    first?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        node.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      );
      if (focusable.length === 0) return;

      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];

      /*
        The trigger sits outside the panel, so tabbing backwards off the first
        item would land on it and leave the sheet open with focus behind it.
        Wrapping in both directions keeps the sheet self-contained until Escape
        or a click closes it.
      */
      if (event.shiftKey && document.activeElement === firstEl) {
        event.preventDefault();
        lastEl.focus();
      } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault();
        firstEl.focus();
      }
    };

    node.addEventListener("keydown", onKey);
    return () => node.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      id={id}
      ref={panel}
      role="dialog"
      aria-label="Browse categories"
      aria-modal="false"
      className="category-sheet"
    >
      <div className="container-site grid gap-10 py-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                onClick={onClose}
                className="group flex items-start justify-between gap-4 border-b border-[var(--color-line)] pb-4"
              >
                <span className="min-w-0">
                  <span className="block text-[1.0625rem] font-medium group-hover:text-[var(--color-text-accent)]">
                    {category.name}
                  </span>
                  <span className="mt-2 flex items-center gap-1.5">
                    {category.leaders.map((leader) => (
                      <SoftwareLogo
                        key={leader.slug}
                        name={leader.name}
                        slug={leader.slug}
                        logoUrl={leader.logoUrl}
                        brandColor={null}
                        size={20}
                      />
                    ))}
                  </span>
                </span>
                <Figure className="shrink-0 text-sm text-[var(--color-text-muted)]">
                  {formatNumber(category.count)}
                </Figure>
              </Link>
            ))}
          </div>
        </div>

        {featured && (
          <div className="lg:col-span-4">
            <p className="text-sm text-[var(--color-text-muted)]">
              Most compared this month
            </p>
            <Link
              href={featured.href}
              onClick={onClose}
              className="mt-3 grid grid-cols-2 rounded-[14px] border border-[var(--color-line)] bg-[var(--color-surface-raised)]"
            >
              {[featured.a, featured.b].map((side, index) => (
                <span
                  key={side.slug}
                  className={cn(
                    "flex flex-col gap-2 p-4",
                    index === 0 && "border-r border-[var(--color-line)]",
                  )}
                >
                  <SoftwareLogo
                    name={side.name}
                    slug={side.slug}
                    logoUrl={side.logoUrl}
                    brandColor={null}
                    size={28}
                  />
                  <span className="text-sm font-medium">{side.name}</span>
                  <Figure className="text-sm text-[var(--color-text-muted)]">
                    {formatRating(side.rating)}
                  </Figure>
                </span>
              ))}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
