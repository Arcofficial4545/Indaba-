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

  /*
    No colour of its own. It used to set `text-foreground/75`, which resolves
    to ink in the light theme and therefore disappeared completely once the
    navbar docked and became an ink capsule.

    `.nav-control` sets `color: inherit`, and the capsule sets its own colour
    for each state, so inheriting is what keeps this legible in both. The
    focus ring classes are gone for the same reason as everywhere else: the
    global :focus-visible outline already draws one.
  */
  const classes = cn("nav-control", className);

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
