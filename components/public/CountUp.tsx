"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

import { formatNumber } from "@/lib/format";

const DURATION = 1200;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** SSR exposes the final value. Only the visible copy counts, once on entry. */
export function CountUp({
  value,
  formatted,
  delay = 0,
  group = true,
}: {
  value: number;
  formatted: string;
  delay?: number;
  group?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (value <= 0 || preference.matches || !("IntersectionObserver" in window)) {
      node.textContent = formatted;
      return;
    }

    const render = (n: number) => (group ? formatNumber(n) : String(n));
    let frame = 0;
    let origin: number | undefined;
    let started = false;
    let finished = false;

    const finish = () => {
      finished = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      node.textContent = formatted;
    };
    const tick = (now: number) => {
      origin ??= now;
      const progress = Math.min(1, Math.max(0, (now - origin - delay) / DURATION));
      if (progress === 1) {
        finish();
        return;
      }
      node.textContent = render(Math.round(ease(progress) * value));
      frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.6 || started || finished) return;
      started = true;
      observer.disconnect();
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    const onPreferenceChange = () => {
      if (preference.matches) finish();
    };

    node.textContent = render(0);
    // Observe the full, reserved number box, not the changing glyph width.
    observer.observe(node.parentElement ?? node);
    preference.addEventListener("change", onPreferenceChange);
    return () => {
      finish();
      preference.removeEventListener("change", onPreferenceChange);
    };
  }, [value, formatted, delay, group]);

  return (
    <span className="count-up">
      <span className="sr-only">{formatted}</span>
      <span className="count-up-reserve" aria-hidden="true">{formatted}</span>
      <span ref={ref} className="count-up-value" aria-hidden="true">{formatted}</span>
    </span>
  );
}
