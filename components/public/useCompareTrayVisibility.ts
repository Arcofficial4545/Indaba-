"use client";

import { usePathname } from "next/navigation";
import { useCallback, useSyncExternalStore } from "react";

/*
 * The tray may show from the product grid onward.
 *
 * It used to be anchored to the comparison section, which sits BELOW the grid.
 * The grid is where the Compare buttons now live, so pressing one did nothing
 * visible at all — the tray was waiting for a scroll position the reader had
 * not reached yet, and the first product silently disappeared into a tray they
 * could not see.
 */
const HOME_COMPARE_START = 'section[aria-labelledby="showcase-heading"]';
const serverSnapshot = () => false;

/** On the homepage, keep saved selections out of the hero and category area. */
export function useCompareTrayVisibility() {
  const pathname = usePathname();
  const subscribe = useCallback((notify: () => void) => {
    if (pathname !== "/") return () => {};
    const section = document.querySelector(HOME_COMPARE_START);
    if (!section) return () => {};
    // Observe layout changes; scroll notifications also cover jumps that skip
    // the entire section without an intersection transition.
    const observer = new IntersectionObserver(notify);
    observer.observe(section);
    let frame: number | null = null;
    const onScroll = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        notify();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", notify);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", notify);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  const snapshot = useCallback(() => {
    if (pathname !== "/") return true;
    const section = document.querySelector(HOME_COMPARE_START);
    return !!section && section.getBoundingClientRect().top < window.innerHeight;
  }, [pathname]);

  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
