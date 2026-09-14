"use client";

import { useReducedMotion } from "motion/react";

/**
 * `useReducedMotion`, but never null.
 *
 * The library's hook returns `null` until it has read the media query, which
 * on the server and on the first client render is always. Components that
 * branch on it directly end up writing `prefersReduced === true ? a : b`, and
 * the first paint therefore takes the animated branch for one frame even for a
 * reader who asked for no motion. That frame is the whole problem: it is a
 * flash of movement in front of somebody who gets migraines from it.
 *
 * Resolving null to `true` inverts the failure. Before the query is known the
 * component renders the final, still state, and motion is added once the
 * answer comes back as "no preference". Nobody ever sees a frame of movement
 * they did not opt into, and the cost is that the very first animation on a
 * cold load can be skipped rather than played.
 *
 * The site's contract is that reduced motion shows the FINAL state instantly,
 * never a degraded half animation, so every caller must use this to choose
 * between "animate" and "already there" and never between "animate" and
 * "animate less".
 */
export function useReducedMotionSafe(): boolean {
  return useReducedMotion() ?? true;
}
