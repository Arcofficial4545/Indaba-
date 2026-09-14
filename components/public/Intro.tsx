"use client";

import { useEffect, useRef, useState } from "react";

import { LogoMark } from "@/components/public/BrandLogo";
import { SITE_NAME } from "@/lib/site";

/**
 * The page-load sequence.
 *
 * 1200ms total, hard cap. Skippable on any key or click. Runs on every load
 * and every reload, never on a client-side route change.
 *
 * The beats are listed on BEAT below. The hero owns the last two of them — its
 * headline reveal and its scale settling — and reads the same attribute.
 *
 * WHAT THIS IS NOT, and the reason the whole component is shaped the way it
 * is: it is not a gate on rendering. The full page is in the DOM the entire
 * time. This is an overlay and a set of transforms over a page that is already
 * complete and already readable. A crawler sees finished content at 0ms; so
 * does a reduced-motion reader; so does anyone whose JavaScript failed.
 *
 * There is no percentage counter, no progress bar and no full-screen logo
 * hold. Those cost the LCP outright, because the largest text on the page
 * would be behind an opaque overlay for the duration.
 *
 * ---------------------------------------------------------------------------
 * THE PRE-PAINT DECISION
 *
 * Whether the intro runs cannot be decided in React. sessionStorage is not
 * readable on the server, so a component that checked it during render would
 * either mismatch on hydration or decide one frame too late — and one frame
 * too late means the reader sees the finished hero, and then an overlay drops
 * on top of it. That is worse than no intro.
 *
 * So `IntroScript` below runs synchronously in <head>, before the first paint,
 * and writes `data-intro="run"` or `data-intro="off"` onto <html>. CSS keys
 * off that attribute to hide what the intro is about to animate, and this
 * component and the Hero both read it to decide whether to animate at all.
 * ---------------------------------------------------------------------------
 */

/**
 * The beats, in milliseconds. The whole thing has a 1200ms cap and this lands
 * at 1100, which leaves no room for a fifth beat — that is the budget, not an
 * accident.
 *
 *     80   a sand rule sweeps out through the mark: the beam of the scale
 *    120   the mark tips like a balance and settles level
 *    200   the wordmark wipes in beside it
 *    640   the wordmark lifts away, the mark travels to its navbar position
 *          and the curtain retreats upward to uncover the page
 *   1100   done, and nothing animates again until the reader acts
 *
 * The tip-and-settle is the one that means something: the mark is a balance,
 * and it arrives by finding its own level. Everything after it is exit.
 */
const BEAT = {
  done: 1100,
} as const;

/**
 * Runs in <head>, synchronously, before anything paints.
 *
 * IT RUNS ON EVERY LOAD AND EVERY RELOAD. There used to be a
 * `sessionStorage` gate here so the sequence played once per session, which is
 * what §9 of the brief asks for. The owner asked for it on every reload
 * instead, so the gate is gone and the key is no longer read or written.
 *
 * Two exclusions survive, and both must:
 *
 *  - **Reduced motion.** Checked here rather than in React, because by the
 *    time React runs the overlay has already painted.
 *  - **The admin area.** Nobody wants a brand sequence in front of a CMS they
 *    are working in all day.
 *
 * A client-side route change still does not replay it: this script only runs
 * on a real document load, and the component writes `data-intro="off"` when it
 * finishes, so navigating within the app finds the attribute already off.
 *
 * Deliberately tiny and dependency-free, and it must not throw — an exception
 * would leave the attribute unset, which the CSS treats as "no intro". That is
 * the safe direction, but it is a fallback rather than a plan.
 */
export function IntroScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){try{
var d=document.documentElement;
var reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var admin=location.pathname.indexOf("/admin")===0;
d.setAttribute("data-intro",(!reduced&&!admin)?"run":"off");
}catch(e){document.documentElement.setAttribute("data-intro","off")}})()`,
      }}
    />
  );
}

/** True only when the pre-paint script positively decided to run the intro. */
export function introIsRunning(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-intro") === "run";
}

export function Intro() {
  /*
    Starts as "running" on the server AND on the first client render, so the
    two agree and the overlay markup is in the server-rendered HTML.

    The first attempt initialised this from `introIsRunning()`, which is false
    on the server, so the overlay only appeared once React had hydrated. That
    produced the exact sequence the intro is supposed to avoid: the finished
    page paints, and then a bone screen drops on top of it. Shipping the
    markup and letting CSS decide visibility means the overlay is either there
    from the very first frame or never visible at all.

    Visibility is entirely CSS's job, keyed off the `data-intro` attribute the
    blocking script writes before paint. This component only measures, times,
    and cleans up.
  */
  const [phase, setPhase] = useState<"running" | "done">("running");

  /*
    On a load where the intro is not running — a reload, a reduced-motion
    reader, anything under /admin — the markup is unmounted immediately. CSS
    has already kept it invisible, so nothing flashes; this just stops a dead
    fixed-position element sitting in the tree.
  */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads what the pre-paint script decided, which only exists after hydration
    if (!introIsRunning()) setPhase("done");
  }, []);

  const markRef = useRef<HTMLDivElement>(null);

  /* ---- the travel target ------------------------------------------------ */
  /*
    The mark's destination is measured from the real navbar mark rather than
    guessed from a magic offset. That element is present and laid out the whole
    time — CSS hides it with `visibility: hidden`, which preserves layout, not
    with `display: none`, which would not — so its box is exact and correct at
    any breakpoint, at any zoom, and after any font swap.

    This is the shared-element transition the sequence calls for, done by
    measurement rather than with layoutId. Two elements carrying the same
    layoutId cannot both be mounted, and hiding the navbar copy is precisely
    what keeps it mounted, so measurement is the honest way to get here.
  */
  useEffect(() => {
    if (phase !== "running" || !introIsRunning()) return;

    const overlayMark = markRef.current;
    /*
      Scoped to the header. The overlay renders a LogoMark of its own, which
      carries the same data attribute, so an unscoped query would happily
      measure the travelling mark against itself and animate it nowhere.
    */
    const target = document.querySelector<HTMLElement>(
      "header [data-logo-mark]",
    );
    if (!overlayMark || !target) {
      setPhase("done");
      return;
    }

    const from = overlayMark.getBoundingClientRect();
    const to = target.getBoundingClientRect();

    overlayMark.style.setProperty("--travel-x", `${to.left - from.left}px`);
    overlayMark.style.setProperty("--travel-y", `${to.top - from.top}px`);
    overlayMark.style.setProperty(
      "--travel-scale",
      `${to.width / Math.max(from.width, 1)}`,
    );
  }, [phase]);

  /* ---- finishing, and skipping -------------------------------------------- */
  useEffect(() => {
    if (phase !== "running" || !introIsRunning()) return;

    const finish = () => {
      /*
        Nothing is recorded any more. The sequence is meant to play on every
        reload now, so there is no "already played" state to keep — see
        IntroScript. Writing the key and never reading it would just be litter.
      */
      document.documentElement.setAttribute("data-intro", "off");
      setPhase("done");
    };

    const timer = window.setTimeout(finish, BEAT.done);

    /*
      Skippable on any key or click. `capture` so the skip wins before the
      event reaches anything underneath, and `once` so the listeners clean
      themselves up rather than needing to be reasoned about.
    */
    const skip = () => {
      window.clearTimeout(timer);
      finish();
    };
    window.addEventListener("keydown", skip, { once: true, capture: true });
    window.addEventListener("pointerdown", skip, { once: true, capture: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", skip, { capture: true });
      window.removeEventListener("pointerdown", skip, { capture: true });
    };
  }, [phase]);

  /*
    Reduced motion is deliberately NOT tested here. useReducedMotionSafe
    resolves to true on the server, so consulting it in this condition would
    strip the overlay out of the server HTML for everybody and reintroduce the
    mount-after-paint flash. A reduced-motion reader never sees this anyway:
    the blocking script checks the same media query and writes
    data-intro="off", so CSS keeps it invisible and the effect above unmounts
    it on the first commit. That is why the hook is not imported at all.
  */
  if (phase !== "running") return null;

  return (
    /*
      aria-hidden and inert: this is decoration over a page that is already
      complete, and a screen reader user must never be walked through it. The
      focus order underneath is untouched, which is also why the skip listeners
      are on the window rather than on this element.
    */
    <div aria-hidden="true" inert className="intro-overlay">
      {/*
        The curtain is a separate element from the lockup so it can retreat
        upward and uncover the page while the mark is still travelling over it.
        With one element doing both, the mark faded out halfway through its own
        journey and the handover to the navbar was never actually seen.
      */}
      <span className="intro-curtain" />

      <div className="intro-lockup">
        <div ref={markRef} className="intro-mark">
          <LogoMark className="size-28 sm:size-36" />
          {/* The beam of the scale, sweeping out through the mark. */}
          <span className="intro-beam" />
        </div>
        <span className="intro-word">{SITE_NAME}</span>
      </div>
    </div>
  );
}
