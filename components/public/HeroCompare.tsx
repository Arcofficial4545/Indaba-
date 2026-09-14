"use client";

import Link from "next/link";
import { Pause, Play } from "lucide-react";
import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { useEffect, useReducer, useState, useSyncExternalStore } from "react";

import { EASE_IN_OUT, SPRING } from "@/components/motion/springs";
import { Figure } from "@/components/public/Figure";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { lean, type HeroMatchup, type HeroSide } from "@/lib/hero-matchup";

/**
 * The hero's live head-to-head: two real products hanging from a balance.
 *
 * WHAT THIS IS, AND WHY IT IS NOT A PICTURE OF A SCALE.
 * Two earlier attempts failed. The first drew a large flat balance on a sand
 * ellipse, which illustrated the idea of comparison instead of performing one.
 * The second built two data panels with a beam floating above them, which read
 * as two unrelated objects and tilted towards the lower-rated product. This is
 * the merge of the two: **the panels are the pans**. Beam, post, base and
 * ropes are 1px ink strokes, and the thing they are holding up is the data.
 *
 * ONE NUMBER DRIVES THE MECHANISM. `--lean` is a fraction in [-1, 1], animated
 * here and turned into four transforms by CSS: the beam rotation, the two
 * counter-rotations that keep the ropes hanging plumb, and the two panel
 * translations. Animating one value rather than four is what guarantees the
 * rope feet stay welded to the panel corners at every frame of the settle —
 * four separate springs would drift apart mid-flight and the object would come
 * unstuck exactly when it is being watched.
 *
 * AT REST IT IS COMPLETELY STILL. No idle float, no rocking, no sway. This was
 * proposed and rejected three times over, and the reasons are worth keeping:
 * the site's whole claim is that rankings cannot be bought, so a scale that
 * moves for no reason says the ratings mean nothing; the panels contain text,
 * and text that never settles cannot be read; and the pair change already
 * supplies motion, which constant float would swamp.
 *
 * The only motion is the pair change, every six seconds: level, cross-fade,
 * tilt to the new winner, settle. Hover and keyboard focus each pause it.
 */

const CYCLE_MS = 6000;
/** Back to level before the numbers change, so nothing swaps mid-lean. */
const LEVEL_MS = 300;
/** Out and in. The two halves make the 250ms cross-fade the brief asks for. */
const FADE_MS = 125;

type Phase = "rest" | "level" | "fade" | "reveal";
type State = { shown: number; target: number; phase: Phase };
type Action = { type: "next"; count: number } | { type: "step" } | { type: "select"; index: number };

function reducer(state: State, action: Action): State {
  if (action.type === "select") return { shown: action.index, target: action.index, phase: "rest" };
  if (action.type === "next") return { ...state, target: (state.shown + 1) % action.count, phase: "level" };
  switch (state.phase) {
    case "level": return { ...state, phase: "fade" };
    case "fade": return { ...state, shown: state.target, phase: "reveal" };
    case "reveal": return { ...state, phase: "rest" };
    default: return state;
  }
}

/* A live subscription so changing the OS setting mid-cycle takes effect. SSR
 * and the hydration render both start from the reduced, still state. */
function subscribeMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const getMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverMotion = () => true;

export function HeroCompare({ matchups }: { matchups: HeroMatchup[] }) {
  const reduced = useSyncExternalStore(subscribeMotion, getMotion, serverMotion);
  // Remount on a preference change so no stale timer can resume.
  return <Comparison key={reduced ? "static" : "cycling"} matchups={matchups} reduced={reduced} />;
}

function Comparison({ matchups, reduced }: { matchups: HeroMatchup[]; reduced: boolean }) {
  const [state, dispatch] = useReducer(reducer, { shown: 0, target: 0, phase: "rest" });
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const paused = hovered || focused || stopped;

  /*
    One cancellable timer drives every step, including the resting hold.
    Pausing only prevents STARTING another change; a transition already in
    flight finishes, because leaving the panels half-faded or the beam
    half-levelled is worse than completing a change the reader interrupted.
  */
  useEffect(() => {
    if (reduced || matchups.length < 2 || (state.phase === "rest" && paused)) return;
    const delay = state.phase === "level" ? LEVEL_MS
      : state.phase === "fade" || state.phase === "reveal" ? FADE_MS
      : CYCLE_MS - LEVEL_MS - FADE_MS * 2;
    const timer = window.setTimeout(() => dispatch(state.phase === "rest"
      ? { type: "next", count: matchups.length }
      : { type: "step" }), delay);
    return () => window.clearTimeout(timer);
  }, [reduced, paused, state, matchups.length]);

  const index = reduced ? 0 : state.shown;
  const matchup = matchups[index];
  if (!matchup) return null;

  /*
    Reduced motion gets the first pair with its real tilt applied statically —
    the finished state, never a degraded half animation. Everything else holds
    the beam level for the duration of a change and leans again only at rest.
  */
  const settled = reduced || state.phase === "rest";
  const tilt = settled ? lean(matchup) : 0;
  const winner = lean(matchup);

  return (
    <div
      className="hero-compare"
      data-pair={matchup.slug}
      data-phase={reduced ? "rest" : state.phase}
      onPointerEnter={(event) => { if (event.pointerType !== "touch") setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    >
      {/*
        `--lean` is written on the container so it inherits to the rig and to
        both panels. The inline style is what the server renders and what the
        first client frame paints; motion takes the same value over from mount
        with initial={false}, so nothing tilts into place on load.
      */}
      {/*
        data-bleed opts both boxes out of the screenshot rig layout audit. A
        rotating object sweeps a box wider than it occupies at rest — 5px at
        the leans this data produces, 9px at full lean — and that is by design
        rather than a layout bug. The column around it carries matching
        padding, so nothing reaches the page edge; see globals.css.
      */}
      <motion.div
        className="hero-scale"
        data-bleed=""
        style={{ "--lean": reduced ? lean(matchups[0]) : 0 } as CSSProperties}
        initial={false}
        animate={{ "--lean": tilt } as never}
        transition={
          reduced ? { duration: 0 }
            : settled ? SPRING
              : { duration: LEVEL_MS / 1000, ease: EASE_IN_OUT }
        }
      >
        {/*
          Decorative to a screen reader. The ratings underneath carry the whole
          meaning of the tilt and are plain text, so describing the drawing
          would only say the same thing twice and less precisely.
        */}
        <div className="hero-rig" data-bleed="" aria-hidden="true">
          <span className="hero-rig-post" />
          <svg className="hero-rig-base" viewBox="0 0 72 8" width="72" height="8" fill="none">
            <path d="M28 .5h16M28 .5 6 7.5M44 .5l22 7M2 7.5h68" />
          </svg>
          {/* Rotates about the pivot. Beam and both ropes travel with it. */}
          <div className="hero-rig-beam">
            <span className="hero-rig-bar" />
            {(["a", "b"] as const).map((side) => (
              /*
                Each hanger counter-rotates about its own apex, which sits on
                the beam end. The two rotations compose to a pure translation,
                so the ropes hang plumb and their feet land exactly as far down
                as the panel they are holding has travelled.
              */
              <div key={side} className={`hero-rig-hanger hero-rig-hanger-${side}`}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
                  <path d="M50 0 28 100M50 0l22 100" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/*
          One pair in the DOM at a time.

          An earlier build stacked all three pairs in a single grid cell to
          reserve height and hid the inactive ones with `visibility`. Every
          layer's text sat at the same origin, so anything that lifted that one
          paint-level property — a capture mid-transition, a print sheet, a
          descendant setting `visibility: visible` — rendered two sentences
          superimposed character for character. Rendering one pair makes that
          class of artefact impossible rather than unlikely.
        */}
        <motion.div
          className="hero-pans"
          initial={false}
          animate={{ opacity: !reduced && state.phase === "fade" ? 0 : 1 }}
          transition={{ duration: reduced ? 0 : FADE_MS / 1000, ease: EASE_IN_OUT }}
        >
          <div className="hero-pan hero-pan-a" data-win={winner > 0 ? "true" : "false"}>
            <Panel side={matchup.a} />
          </div>
          <div className="hero-pan hero-pan-b" data-win={winner < 0 ? "true" : "false"}>
            <Panel side={matchup.b} />
          </div>
        </motion.div>
      </motion.div>

      {/*
        Below 1024 the beam and ropes are gone, so the comparison the tilt was
        making has to be made in words instead.
      */}
      <p className="hero-compare-verdict">
        {matchup.a.rating === matchup.b.rating ? (
          <>
            {matchup.a.name} and {matchup.b.name} both rate{" "}
            <Figure>{matchup.a.ratingLabel}</Figure> out of 5.
          </>
        ) : (
          <>
            {(winner > 0 ? matchup.a : matchup.b).name} rates{" "}
            <Figure>{(winner > 0 ? matchup.a : matchup.b).ratingLabel}</Figure> out of 5,{" "}
            {(winner > 0 ? matchup.b : matchup.a).name}{" "}
            <Figure>{(winner > 0 ? matchup.b : matchup.a).ratingLabel}</Figure>.
          </>
        )}
      </p>

      <div className="hero-compare-foot">
        <Link href={matchup.href} className="hero-compare-link">
          See the full comparison
        </Link>

        {!reduced && matchups.length > 1 && (
          <div className="hero-compare-controls">
            {/*
              The stage announces only once the reader has taken control of it.
              A polite region that fired on every six-second tick would talk
              over whatever they were actually reading.
            */}
            <div
              className="hero-dots"
              role="group"
              aria-label="Choose a comparison"
              aria-live={stopped ? "polite" : "off"}
            >
              {matchups.map((item, itemIndex) => (
                <button
                  key={item.slug}
                  type="button"
                  className="hero-dot"
                  onClick={() => { setStopped(true); dispatch({ type: "select", index: itemIndex }); }}
                  aria-label={`Show ${item.a.name} and ${item.b.name}`}
                  aria-current={index === itemIndex ? "true" : undefined}
                  data-active={index === itemIndex ? "true" : "false"}
                >
                  <span aria-hidden="true" />
                </button>
              ))}
            </div>
            <button
              type="button"
              className="hero-cycle"
              aria-pressed={stopped}
              aria-label={stopped ? "Play comparisons" : "Pause comparisons"}
              onClick={() => setStopped((value) => !value)}
            >
              {/*
                The icons ignore the pointer. Swapping an SVG out from under
                the cursor otherwise eats its pointerout event and leaves the
                hover pause latched on after a click.
              */}
              {stopped ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * One pan. Both sides carry the same four slots in the same order, because
 * symmetry is the entire point of a scale: the reader compares line against
 * line without having to find the matching figure first.
 *
 * The panel translates and never rotates. Its text stays upright and level at
 * every angle the beam takes.
 */
function Panel({ side }: { side: HeroSide }) {
  return (
    <article className="hero-panel">
      <div className="hero-panel-head">
        <SoftwareLogo name={side.name} slug={side.slug} logoUrl={side.logoUrl} size={26} />
        <h3 className="hero-panel-name">{side.name}</h3>
      </div>

      <p className="hero-panel-rating">
        <Figure className="hero-panel-score">{side.ratingLabel}</Figure>
        <span className="hero-panel-outof" aria-hidden="true">/5</span>
        {/* The attribution the hero no longer prints still travels with the
            number for anyone reading it aloud. */}
        <span className="sr-only">out of 5 on Capterra,</span>
        <span className="hero-panel-reviews">
          <Figure>{side.reviewCount}</Figure> reviews
        </span>
      </p>

      <p className="hero-panel-price">
        <Figure>{side.price}</Figure>
        <span className="hero-panel-note">{side.priceNote}</span>
      </p>

      <p className="hero-panel-diff">
        {side.difference.figure ? (
          <>
            <Figure>{side.difference.figure}</Figure> {side.difference.label}
          </>
        ) : (
          side.difference.label
        )}
      </p>
    </article>
  );
}
