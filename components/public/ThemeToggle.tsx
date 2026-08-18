"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

const subscribe = () => () => {};

/**
 * The theme is only known on the client, so the button renders an inert
 * placeholder of identical size until hydration. That avoids both a hydration
 * mismatch and a layout shift in the navbar.
 *
 * useSyncExternalStore gives the server snapshot as false and the client
 * snapshot as true, which is the hydration check without a setState in an
 * effect.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const isDark = resolvedTheme === "dark";

  const classes = cn(
    "inline-grid size-10 place-items-center rounded-xl border border-border/70 text-foreground/70 transition-colors",
    "hover:bg-[var(--color-brand)] hover:text-[var(--color-brand-ink)]",
    "focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none",
    className,
  );

  if (!mounted) {
    return <span className={classes} aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      className={classes}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? (
        <SunIcon className="size-4" aria-hidden="true" />
      ) : (
        <MoonIcon className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}
