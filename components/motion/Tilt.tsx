"use client";

import { motion } from "motion/react";

import { SPRING } from "@/components/motion/springs";
import { useReducedMotionSafe } from "@/components/motion/reduced-motion";

/**
 * Rotates its children to a given angle, on the site's one spring.
 *
 * This exists for exactly one element: the balance scale in the hero. It is a
 * primitive rather than hero-local code so that the reduced-motion contract
 * and the spring live in one place rather than being restated inline.
 *
 * WHAT THIS DELIBERATELY NO LONGER DOES, and why it must not be added back.
 * An earlier version tracked the pointer and ran a continuous idle sway. Both
 * are gone. On a site whose entire claim is that rankings cannot be bought, a
 * beam that leans on a timer — or because a cursor crossed the hero — says
 * Indaba has already picked a winner. That is a contradiction of the brand,
 * not a flourish, and it is worth more to have the scale sit level and mean
 * something than to have it move and mean nothing.
 *
 * The beam is level at rest, always. It leaves level only when the reader has
 * actually chosen two products to compare, and then it leans towards the
 * higher rated one. That single behaviour carries more than any amount of
 * ambient motion, because the reader caused it and it reports a real result.
 *
 * `angle` is therefore the caller's whole vocabulary: 0 is rest, negative
 * lowers the left pan, positive lowers the right.
 */
export function Tilt({
  children,
  angle = 0,
  className,
}: {
  children: React.ReactNode;
  /** Degrees. 0 is level, and 0 is the resting state. */
  angle?: number;
  className?: string;
}) {
  const reduced = useReducedMotionSafe();

  /*
    Reduced motion renders the FINAL state, not a slower journey to it. If the
    reader is comparing two products the beam is already leaning when they
    look at it; it simply never animated there. Rest stays untransformed
    rather than carrying an identity rotate, so a level scale creates no
    stacking context it does not need.
  */
  if (reduced) {
    return (
      <div
        className={className}
        style={angle === 0 ? undefined : { transform: `rotate(${angle}deg)` }}
      >
        {children}
      </div>
    );
  }

  /*
    `initial={false}` starts at the target instead of animating up to it from
    a default. The scale must be level in the first painted frame — an
    entrance tilt would be exactly the autonomous motion this component was
    stripped to remove.

    SPRING rather than a tracking spring: damping 26 against stiffness 220 is
    just under critical, so the beam overshoots once and stops, which is how a
    real balance finds its point.
  */
  return (
    <motion.div
      className={className}
      initial={false}
      animate={{ rotate: angle }}
      transition={SPRING}
    >
      {children}
    </motion.div>
  );
}
