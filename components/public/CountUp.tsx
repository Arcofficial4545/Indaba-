"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

import { formatNumber } from "@/lib/format";

/**
 * The second and last client component in the hero, the search field being the
 * other. A number that counts up cannot be a Server Component, but everything
 * around it still is: this renders one span.
 *
 * The final, formatted value is what the server puts in the markup, so the
 * page is correct with JavaScript off and correct for a crawler. The animation
 * is a progressive enhancement layered on top of that markup.
 */

const DURATION = 1200;

/** easeOutCubic. Fast off the mark, and it lands rather than stopping. */
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/*
  The count has to be zeroed before the browser paints, or the reader sees the
  final figure for a frame and then watches it drop to zero, which is worse
  than no animation at all. A layout effect runs inside the commit, before
  paint; on the server it is never called, so it aliases to useEffect there to
  keep React from warning about it during SSR.
*/
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function CountUp({
  value,
  formatted,
  delay = 0,
  group = true,
}: {
  /** The real number, counted to. */
  value: number;
  /** The number as the server already rendered it, and the value landed on. */
  formatted: string;
  /** Offset from the shared start, so the three figures do not move as one. */
  delay?: number;
  /**
   * Whether intermediate frames carry thousands grouping. It has to match how
   * the caller produced `formatted`, or the figure would change shape on the
   * last frame.
   */
  group?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Final value, immediately, with nothing left running.
    if (
      value <= 0 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      node.textContent = formatted;
      return;
    }

    const render = (n: number) => (group ? formatNumber(n) : String(n));

    node.textContent = render(0);

    let frame = 0;
    let origin = 0;

    const tick = (now: number) => {
      if (!origin) origin = now;
      const elapsed = now - origin - delay;

      if (elapsed < 0) {
        frame = requestAnimationFrame(tick);
        return;
      }

      const t = Math.min(1, elapsed / DURATION);

      /*
        Formatted the same way on every frame, including the last, so the
        figure never changes shape mid count: no separator appearing at the
        end and shunting the digits sideways.
      */
      node.textContent = t < 1 ? render(Math.round(ease(t) * value)) : formatted;

      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      node.textContent = formatted;
    };
  }, [value, formatted, delay, group]);

  return <span ref={ref}>{formatted}</span>;
}
