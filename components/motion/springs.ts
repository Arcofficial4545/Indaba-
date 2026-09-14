/**
 * The whole motion vocabulary, in one file.
 *
 * These are not "nice defaults". Every value here is used by more than one
 * component, and the point of centralising them is that the nav capsule and
 * the hero scale settle with the same weight, so the site feels like one
 * object rather than a set of separately tuned widgets.
 *
 * The CSS half of the same vocabulary lives in globals.css §1 as
 * --ease-out-quint / --ease-in-out / --dur-*. Anything expressible in CSS
 * belongs there rather than here, because CSS costs no JavaScript.
 */

/** Entrances and reveals. Fast off the mark, and it lands rather than stopping. */
export const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;

/** State changes. Symmetrical, because the thing has to come back. */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

/**
 * The one spring. The nav capsule collapse, the scale settle, the tilt.
 *
 * Damping 26 against stiffness 220 is just under critical, so it overshoots
 * once and stops. That single overshoot is what makes the scale read as a
 * physical beam finding its balance instead of a picture being moved.
 */
export const SPRING = { type: "spring", stiffness: 220, damping: 26 } as const;

/** Hover, press, focus. */
export const DUR_MICRO = 0.16;
/** Menus, sheets, the tray. */
export const DUR_COMPONENT = 0.32;
/** The load sequence, the hero reveal. */
export const DUR_ORCHESTRATED = 0.7;
