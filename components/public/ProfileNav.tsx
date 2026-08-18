"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type ProfileSection = { id: string; label: string };

/**
 * The sticky pill bar that tracks scroll position down the profile page.
 *
 * It reads `data-header-hidden` off the document element, which the navbar
 * sets as it hides and shows. That way the two bars never overlap and the
 * section nav rises to fill the gap when the header is away, without either
 * component importing the other.
 */
export function ProfileNav({ sections }: { sections: ProfileSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [headerHidden, setHeaderHidden] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  // Track which section is currently in the reading position.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // The band sits below the two stacked bars and above the fold's end.
      { rootMargin: "-160px 0px -55% 0px", threshold: 0 },
    );

    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [sections]);

  // Mirror the navbar's visibility so this bar can move up to meet it.
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setHeaderHidden(root.dataset.headerHidden === "true");
    read();

    const mutation = new MutationObserver(read);
    mutation.observe(root, {
      attributes: true,
      attributeFilter: ["data-header-hidden"],
    });
    return () => mutation.disconnect();
  }, []);

  // Keep the active pill in view on narrow screens.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const current = list.querySelector<HTMLElement>("[data-active='true']");
    if (!current) return;
    const offset =
      current.offsetLeft - list.clientWidth / 2 + current.clientWidth / 2;
    list.scrollTo({ left: Math.max(0, offset), behavior: "smooth" });
  }, [active]);

  return (
    <nav
      aria-label="Sections of this review"
      className={cn(
        "sticky z-30 -mx-4 px-4 transition-[top] duration-300 sm:mx-0 sm:px-0",
        headerHidden ? "top-3" : "top-22",
      )}
    >
      <ul
        ref={listRef}
        className="flex gap-1 overflow-x-auto rounded-full border border-border/70 bg-background/85 p-1.5 backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {sections.map((section) => {
          const isActive = active === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                data-active={isActive}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "inline-block rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none",
                  isActive
                    ? "bg-[var(--color-brand)] text-[var(--color-brand-ink)]"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {section.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
