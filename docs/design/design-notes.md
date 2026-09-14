# Design notes

Running log of what was tried, what was rejected, and why. The point of this
file is that a later phase does not re-argue a settled decision, and that a
reviewer can tell the difference between a choice and an accident.

Newest phase last.

---

## ⚠ Standing risks

### The Switzer CDN URL is pinned and unversioned-safe only by convention

`app/globals.css` §2 points `@font-face` at a hashed path on
`cdn.fontshare.com`, and `app/layout.tsx` preloads the same URL. Both were
fetched and verified **2026-09-07** against
`https://api.fontshare.com/v2/css?f[]=switzer@1`.

Fontshare serves content-addressed hashes, so in practice the path is stable.
But if it is ever rotated, the request 404s, the `@font-face` src fails, and
the site falls back to the metric-matched Arial **permanently and silently**.
Nothing in the build would catch it: the CSS is valid, the build succeeds, and
the only symptom is that the site is set in Arial.

Two places to change if it happens, and they must match:

- `app/globals.css`, the `@font-face` `src`
- `app/layout.tsx`, the `<link rel="preload">` `href`

If the file 404s during a build or a check, **stop and re-fetch**. Do not add a
second `src` fallback and move on: a font that silently degrades is worse than
one that visibly fails, because nobody notices for a month.

### `motion` is v13, the brief specified v12

`motion@13.2.0` was installed because it is what `npm install motion` resolves
to now. `motion/react` re-exports `framer-motion` wholesale, and every API this
build uses (`motion`, `useReducedMotion`, `useSpring`, `useMotionValue`,
`useTransform`, `AnimatePresence`, `layout`/`layoutId`) is unchanged from v12.
No compatibility work was needed. Noted only so the version drift is not
mistaken for an accident later.

---

## Phase 2 — tokens, face, motion primitives

### Migration strategy: repoint the legacy aliases, do not delete them

The old system was lime + navy, and its names are load-bearing across the
codebase:

```
--color-brand           130 refs across 52 files
--color-brand-dark       50 refs across 36 files
text-muted-foreground   224 refs
border-border            48 refs
ring-                    99 refs
```

Deleting `--color-brand` in Phase 2 would have blanked half the site until
Phase 6 finished rewriting the components. So every legacy alias is
**repointed** at the new palette instead:

| Old | New | Why the mapping is exact |
|---|---|---|
| `--brand` (lime, "FILLS ONLY, never body text") | `--sand` | Identical contract. All 130 call sites stay correct. |
| `--brand-dark` ("brand text on a light surface") | `--bronze` | That is bronze's entire definition. |
| `--brand-ink` ("text ON lime") | `--ink` | ink on sand is 8.21:1. |
| `--navy` (secondary panels) | `--petrol` | Same structural role. |
| `--amber` / `--star` | `--bronze` | See the star note below. |
| `--success` | `--petrol` | |
| `--error` | `--brick` / `--brick-lift` | |

Consequence: the whole site repainted in the new palette the moment
`globals.css` landed, with zero component edits. Each alias gets deleted in
Phase 7 once its last reference is gone.

### Star marks are bronze, not sand

The brief lists "rating marks" under sand's role. A sand star on `--paper`
measures **1.70:1** and is effectively invisible at rating sizes. A star rating
is meaningful non-text content, so WCAG 1.4.11 wants 3:1.

`--star` therefore resolves to `--bronze` (5.52:1 on paper). This is the
palette's own rule applied rather than an exception to it: §4 says that when
you want "sand text" you actually want bronze, and a star is a mark of exactly
that kind. The same reasoning already governs the rating bar (design-system.md §1.5),
where sand survives only because a numeral sits next to it.

### `.btn-glossy` rebuilt rather than replaced

It was two stacked gradients, a tinted glow and four inset shadows. Gradients
are banned. It is now a flat ink pill with the single `--gloss-inset` inner
highlight.

The class name and its `--btn-bg` / `--btn-ink` custom-property interface were
kept, because the affiliate CTAs set them inline per product and 13 call sites
across four files depend on them. Rewriting the class repainted all 13 without
touching a component.

`.btn-shine` — a white highlight that swept across the button face on a timer —
is now an inert passthrough. It is an automatic animation on a control, which
the motion budget cannot afford and which the anti-pattern list would fairly
call a loading shimmer.

### Two banned patterns neutralised in CSS rather than chased through components

- `.brand-highlight` set two or three words of every section heading on a lime
  pill. Accenting one word of a headline is banned. The class is now a no-op
  (`white-space: nowrap` only), which killed the pattern site-wide in one edit
  while `SectionHeader` still passes its `highlight` prop from ~30 call sites.
  Phase 5 deletes the prop.
- `.reveal-on-scroll` was a fade-and-slide-up applied to six whole sections on
  the home page. That is the machine-generated signature the brief names. It is
  now `animation: none`, and the replacement is `.reveal-line`, which masks
  **only the first line of a heading** and is pure CSS scroll-timeline with no
  JavaScript.

### `.animate-fill-bar` animated `width`

Off the list — transform, opacity and clip-path only. Rewritten as a `scaleX`
from a left transform-origin driven by a `--fill` custom property, so the track
keeps its measure and only the fill scales. Same picture, composited, and it
cannot reflow the row it sits in.

### `useReducedMotionSafe()` resolves null to `true`, not `false`

`useReducedMotion()` returns `null` until the media query has been read, which
on the server and the first client render is always. Branching on it directly
means the first paint takes the animated branch for one frame even for a reader
who asked for no motion — a flash of movement in front of exactly the person
who cannot tolerate it.

Resolving null to `true` inverts the failure: before the answer is known, the
still state renders. The cost is that a very first animation on a cold load can
be skipped. That is the right trade.

### `MaskReveal` takes `active` as a prop instead of deciding for itself

First draft had the component decide whether to animate. It cannot. The server
renders the still state (no media query, no sessionStorage), so a client mount
with `initial={{ y: "110%" }}` would paint the headline, drop it a line height,
and climb back — on the LCP element.

So the caller passes `active`, derived from a value known **before first
paint**: the `data-intro` attribute that Phase 3's blocking script writes onto
`<html>`. Default is `false`, so the safe still render is what you get unless
something has positively established the intro is running.

### Stale Next.js type cache, not a code error

`npm run typecheck` failed on `app/(public)/software/[slug]/reviews/new/page.tsx`
with `Type '"/software/[slug]/reviews/new"' does not satisfy the constraint
'AppRoutes'`, on a file nothing had touched.

Cause: `tsconfig.json` includes **both** `.next/types/**` and
`.next/dev/types/**`. Next 16 writes dev output to `.next/dev`, and that copy
was a leftover from a dev run predating the `reviews/new` route, so two
different global `AppRoutes` unions were in scope at once.

Fix: `rm -rf .next/dev`. It regenerates on the next `next dev`. Worth knowing
because it will look like a real type error again the next time the route map
changes while a stale dev server output is on disk.

### Weight 700 capped at the token, not chased through 128 files

`h1` computed to **700** after the token swap. There were 128 `font-bold` call
sites, every one of them meaning 700, against a scale that is 400/500/600.

Editing all 128 would have fixed today and not tomorrow, because the next
person to type `font-bold` gets 700 straight back. Instead the top of
Tailwind's weight scale is capped in `@theme`:

```css
--font-weight-bold: 600;
--font-weight-extrabold: 600;
--font-weight-black: 600;
```

The utility still exists and still means "the heaviest weight this brand has".
Measured across the whole rendered home page afterwards:

```
computed font-weights in use: {"400": 954, "500": 155, "600": 88}
```

Zero 700s, from one token change. `font-synthesis-weight: none` in §3 means
nothing fakes the difference either.

### Verified empirically rather than asserted

Run against the dev server after the swap:

- **Font actually loads.** `cdn.fontshare.com` returned **200**;
  `document.fonts` reports `Switzer 100 900 loaded`; `document.fonts.check`
  passes. The pinned URL works today.
- **The metric match is exact.** Measured at 100px on `Hxpg 6196`: Switzer
  487.7, `Switzer Fallback` **487.7**, bare Arial 483.7. The `size-adjust:
  100.83%` lands the fallback on the same advance to a tenth of a pixel, so
  the font swap contributes zero CLS.
- **`display-hero` sets in three lines.** At 1280 the `h1` computes to
  **66.56px** — exactly 5.2vw — and measures **3 lines** tall. The arithmetic
  in design-system.md §2.4 holds in a real browser, so the existing headline survives
  as written and no copy had to be cut to fit a clamp.
- **Admin renders correctly.** `/admin` and `/admin/login` both 200 and paint
  in bone/paper/ink with visible `--border-control` outlines on the fields.
  No admin logic, routing or CRUD was touched.

### Found for Phase 4: the review count has no separator at all

The brief describes "6 196" reading as two numbers. It currently renders as
**`6196`** — no separator whatsoever. The outgoing hero passes `group={false}`
to `CountUp`, so `formatNumber()` never runs on it.

So the fix is not only the render-side `.data` treatment; the hero has to start
formatting the figure in the first place. Phase 4 routes it through
`formatNumber()` and `<Figure>`.

### The screenshot rig was hero-only and is now general

`scripts/shoot.ts` clipped every shot to `.hero-band` and ran five widths. It
now takes routes as arguments, runs the seven widths §16 requires, and has a
`--scale` flag for 125% Windows display scaling. Three fixes were needed to
make it usable:

- **`waitUntil: "networkidle"` never resolves in dev.** Turbopack holds an HMR
  websocket open for the page's lifetime, so the network is never idle and the
  wait only ends by timing out. Survivable on one route, not on seven. Now
  `"load"` plus a fixed settle.
- **Git Bash mangles route arguments.** MSYS rewrites `/admin` into
  `C:/Program Files/Git/admin` before the process sees it. Undone in
  `normaliseRoute()` rather than relying on remembering `MSYS_NO_PATHCONV=1`.
- **The overflow scan reported mostly noise.** It now skips visually-hidden
  elements, anything clipped by an ancestor, and anything clipping itself by a
  trivial amount — so a marquee track and an `sr-only` span no longer bury the
  one thing the audit exists to catch. Self-clipping elements are still
  reported when they hide more than 25% of their own content, which is the
  "silently four thousand pixels wide" case the brief warns about.

Result at the end of Phase 2: **document-level overflow clean at all seven
widths**, with two genuine element-level pinches at 390/768/1024 inside
components Phases 5 and 6 rewrite.

### Left alone deliberately

- **`public/heroback.jpg`** — 2 MB, unreferenced anywhere. It is the old photo
  hero. Deleted in Phase 4 with the rest of the hero, not now, so that the
  removal sits in the commit that explains it.
- **The three prose systems** (`.prose-content`, `.legal-content`,
  `.article-content`) — they only ever referenced tokens, so they repainted
  correctly for free. The 68ch measure and the type-scale alignment are Phase 6
  work, on the pages that own them.
- **`BrandLogo`** — already correctly isolated in one component, which is what
  the brief asked for. Its `Ind`/`aba` two-tone repointed to ink/bronze
  automatically. Phase 3 rewrites the mark itself as part of the navbar.

---

## Phase 3 — navbar and load sequence

### The overlay had to ship in the server HTML

First build had `Intro` decide its own initial state from `introIsRunning()`,
which reads a DOM attribute and is therefore `false` on the server. So the
overlay only mounted after hydration, and the measured sequence was: finished
page paints → bone screen drops on top of it → sequence plays. That is the
exact experience the intro exists to avoid, and it is worse than having no
intro at all.

Fixed by inverting who decides. The markup now renders unconditionally on the
server, and **CSS owns visibility**, keyed off the `data-intro` attribute the
blocking script writes before first paint:

```css
.intro-overlay { display: none }
:root[data-intro="run"] .intro-overlay { display: grid; … }
```

So the overlay is either painted in frame one or never visible at all. React's
only jobs are measuring the travel target, timing, skip, and unmounting.

`useReducedMotionSafe()` is deliberately **not** in the render condition for
the same reason: it resolves to `true` on the server, so testing it there
would strip the overlay from the HTML for everyone and reintroduce the flash.
A reduced-motion reader is already handled earlier, by the blocking script,
which checks the same media query and writes `data-intro="off"`.

### Shared-element transition by measurement, not `layoutId`

The brief specifies `layoutId` for the mark travelling to the navbar. That
cannot work here: two elements carrying the same `layoutId` must not be
mounted simultaneously, and keeping the navbar's mark mounted is precisely
what makes its position measurable.

So the navbar mark is hidden with `visibility: hidden` — which preserves
layout, unlike `display: none`, which would give a zero rect and send the mark
flying to the top-left corner — and the intro measures its box and animates
onto it with `--travel-x/y/scale`. Exact at every breakpoint, at any zoom, and
after the font swap, rather than a magic offset that is right at one width.

### Verified against the §9 contract

| Requirement | Result |
|---|---|
| Runs on first load | `data-intro="run"`, overlay `display: grid` at DCL |
| Overlay in first paint, no flash | markup present in server HTML |
| Under the 1200ms cap | overlay gone **977ms** after DCL |
| Never on client-side route change | `off` after SPA nav |
| Never twice in a session | `off` on reload |
| Reduced motion skips entirely | `off`, no overlay, content present |
| Crawler sees complete content | headline and nav links in the no-JS HTML |
| Hands the mark back | navbar mark `hidden` → `visible` on completion |

### The docked capsule had to actually contract

First pass docked at the full container width, which measured **1184px**. An
ink slab that wide is a colour change, not a contraction, and the contraction
is the whole idea of the bar. `w-fit` plus `mx-auto` under motion's `layout`
brings it to **853px**, centred, with the sides visibly travelling inward.

### `ThemeToggle` disappeared when docked

It set `text-foreground/75`, which resolves to ink in the light theme, so on
the ink capsule it was ink on ink. Caught in a screenshot, not in code review.

Fixed by removing its colour entirely: `.nav-control` sets `color: inherit`
and the capsule sets a colour per state, so the icon is correct in both. Its
private focus-ring classes went at the same time — the global
`:focus-visible` outline already draws one, and two rings on one element
disagree.

### Two columns of categories, not four — DEVIATION

§8 asks for four columns in the mega-sheet. There are six categories, so four
columns is a ragged 4 + 2. Two columns of three is balanced, and it leaves
each row enough width for the count and the three vendor marks that make it
read as evidence rather than a link list. The featured head-to-head still
occupies the right-hand third as specified.

### `ProfileNav` lost its input, harmlessly

It reads `data-header-hidden` off `<html>`, which the old navbar set when it
translated itself away on scroll. The new navbar docks instead of hiding, so
nothing sets that attribute and `ProfileNav` now always takes its
header-visible offset — which is the correct one, because the header is
always visible. Phase 6 rewrites that component properly.

### Screenshot rig, two more fixes

- **Font timeouts killed whole runs.** A context per shot meant one cold
  webfont fetch per shot, and Playwright blocks `screenshot()` on
  `document.fonts.ready`. Now one context per theme with the viewport resized
  between shots, so the HTTP cache is shared and the font is fetched once.
- **Full-page shots at 2x DPR timed out.** The home page is ~12 000px tall; at
  1920 and DPR 2 that is a 3840×25000 bitmap. Base DPR is now 1, and `--scale`
  is what models 125% Windows display scaling on top of it.

End of Phase 3: **document-level overflow clean at all seven widths in both
themes.** Four shots carry element-level pinches inside `SoftwareCard` and
`ComparisonCard` at 768 and 1024, both of which Phase 5 replaces.

---

## Phase 4 — the hero

### The asset is a placeholder, and what the real export needs to match

`public/hero/comparison-scale.png` is now a generated placeholder: **1600x1280**,
transparent, drawn only in ink / sand / petrol. The original 316x303 asset is
recoverable from git at `93d4326`.

Two things about it drive the layout, and a replacement export should hold
them or the composition will need retuning:

- **The drawing fills its canvas.** The first placeholder left the top 30% of
  the frame empty, which made every attempt to align the beam with the
  headline wrong by ~130px. The frame is now cropped to the artwork.
- **The pans sit where the chips expect them.** Measured in the render: left
  pan is about 4-24% of width and 36-44% of height; right pan 79-99% and
  28-36%. `.hero-chip-left` / `.hero-chip-right` are positioned from those.

### `logo_url` is a trap, and it took the page down

Every row in the catalogue has `logo_url: null`. The marks that actually
render are resolved from `lib/logo-manifest.ts` **by slug**, inside
`SoftwareLogo`, which falls back to an initials chip. So a component filtering
`software.filter(s => s.logo_url)` silently gets an empty list.

That is what it did: `buildChipPairs` returned an empty array, `HeroScale`
indexed into it unguarded, and the whole home page returned a 500 with "Cannot
read properties of undefined" — for a decoration. Two fixes, both kept:

- `lib/logo-mark.ts` exports `hasBundledMark(slug)`, which mirrors exactly what
  `SoftwareLogo` will do with the same slug. 38 of 39 products have one.
- `HeroScale` treats the pair as possibly-undefined and renders without chips.

### Four layout bugs the screenshots caught and reasoning did not

1. **The object was on a second grid row.** The copy spans columns 1-7 and the
   object 7-12, sharing column 7 — which is what lets the scale reach back
   across the gutter. Grid auto-placement will not put two items in one row
   when their columns collide, so the object was placed 435px lower and every
   negative margin appeared to do nothing. Fixed with explicit `grid-row: 1`.
2. **`place-items: center` shrink-wrapped the tilt wrapper**, so the figure's
   `width: 100%` resolved against an auto-width parent and the two vendor
   chips — positioned as percentages of it — landed on top of each other in
   the middle instead of on the pans.
3. **A specificity collision made an override a no-op.** The 1024-1279 media
   query sits above the base `.hero-search-slot` rule in the file, and at
   equal specificity the later declaration wins regardless of the media query.
   Scoping it as `.hero-grid .hero-search-slot` fixed it. This is precisely
   the section-versus-element collision the brief warns about.
4. **Next's image optimiser served the old asset for two rounds.** The dev
   cache lives at `.next/dev/cache/images`, not `.next/cache/images`, so
   clearing the documented path did nothing and `naturalWidth` stayed 158.
   Replacing a file in `public/` does not invalidate it.

### A circle could not bleed; an ellipse can

A circle large enough to run off the right edge has to be about 780px across
at 1280, and at that size it stops being a ground and becomes a beige field
with a small illustration in it. The brief says "ellipse", and the reason is
geometric: a wide flat ellipse reaches the edge at a fraction of the weight.

Its width is `max(158%, 76vw)` — partly viewport-relative — because at 1920
the container is centred with 240px of margin either side, so a disc sized
only against the figure stops well inside the screen. Verified bleeding at
1024, 1100, 1200, 1279, 1280, 1440, 1536 and 1920, with zero page overflow.

### What occludes the headline — DEVIATION

Section 10 asks for the scale to overlap the headline's last line. With a
symmetric scale centred in its frame, its silhouette cannot: the left pan sits
about 345px right of where the headline text ends, and closing that gap would
put the figure over the search field, which the brief forbids outright.

So **the disc is what occludes**, and the scale sits on it. The object as a
whole still crosses the headline's last line, the depth still comes from
occlusion rather than from a shadow or a blur, and the search field is never
touched. Verified clear at every desktop width from 1024 to 1920.

A replacement asset with an asymmetric silhouette — a scale weighted to one
side, or one pan extending further left — would allow the literal reading, and
that is worth revisiting when the real export lands.

### The 1024-1279 range needed its own rules

At -30% the scale's box reached over the search field at 1024 and 1100. That
range now takes no leftward reach at all and a 26rem field, which leaves 71px
of clear air at 1024 — the width this layout has broken at twice before.

### Also done here

- **`public/heroback.jpg` was NOT deleted here — this line was false when it
  was written.** The command that would have removed it was chained ahead of a
  heredoc that failed to parse, so the shell never executed any of it, and the
  claim went into these notes and the Phase 4 commit message regardless. The
  file — 2MB, unreferenced, the old photo hero — stayed on disk until it was
  actually deleted on 2026-09-08, at the start of the v2 session.
- **The search placeholder cross-fade is not built**, per the instruction to
  cut it now rather than at Phase 7. The field's placeholder is static and the
  popular-category chips carry that signal instead, which is better anyway:
  they are real links to real categories rather than decoration.
- **One search dialog, two entry points.** `SearchProvider` in the public
  layout owns a single `SearchDialog`; the navbar's Cmd-K and the hero field
  both ask it to open. The hero field is still a real GET form, so search
  survives with JavaScript off.
- **`6 196` renders correctly.** The old hero passed `group={false}` to
  `CountUp` and rendered a bare `6196`; it now goes through `formatNumber()`
  and `<Figure>`.

---

## Phase 5 — home sections and the compare tray

### The 40px sideways scroll, and why it was hard to find

At 390 the page really did scroll 40px sideways. Everything about it looked
fine: nothing painted past the viewport, every wide element had a clipping
ancestor, and the table sat correctly inside its own `overflow-x: auto`
scroller at 358px.

The tell was that **`body.scrollWidth` was 390 while
`documentElement.scrollWidth` was 430**. Something had escaped the body's
layout entirely.

It was the `sr-only` spans in the table's header cells. They are absolutely
positioned, and with no positioned ancestor an absolutely positioned element's
containing block is the *initial* containing block — not the scroll container
it happens to sit inside. So the span took its static position at x=429 inside
the horizontally scrolled table and extended the document's scrollable area
with it.

`position: relative` on `.top-rated` fixes it. Worth remembering as a class of
bug: **any horizontally scrolling container that might hold an absolutely
positioned descendant needs to be a containing block**, or that descendant
escapes to the viewport.

A second, more ordinary overflow was fixed on the way: grid items default to
`min-width: auto` and refuse to shrink below their content's min-content
width, so the six-column table forced the well wider than the container.
`.rail-grid > * { min-width: 0 }` fixes that once for every section.

### The audit was measuring the wrong thing

`scrollWidth > clientWidth` is not the same question as "does the page scroll
sideways", and the two disagree in both directions — an escaped absolute
inflates `scrollWidth` with nothing visible, and a clipped element can have a
huge `scrollWidth` and scroll nothing.

The rig now asks the browser to `scrollTo(5000, 0)` and reads back where it
landed. That is the only definition a user would recognise, and it is what
caught the bug above as real rather than cosmetic.

It also gained two things: `.reveal-line` animations are frozen during
capture, because a `fullPage` screenshot stitches the document while the
scroll position stays at 0 and every scroll-timeline reveal below the fold is
therefore frozen clipped-to-nothing — an artefact of the screenshot, not the
layout. And elements can opt out of the cut-content heuristic with
`data-bleed`, which the hero band uses because its disc runs off the canvas by
design.

### Seven quotes, two sentences

`getFeaturedReviews` first took the highest-rated review from each product.
That looked right and produced seven quotes using **two distinct sentences**,
because the fallback reviews are templated and the top-rated one from every
product used the same template.

It now offers each product's whole pool and picks across all of them, refusing
two entries that open with the same 48 characters. Seven products, seven
companies, seven different sentences. The wording rule is relaxed rather than
returning a short list if it cannot be satisfied, because four varied quotes
is a better section than two.

This is the sort of defect that survives code review and dies in a screenshot.

### The pull-quote's `ch` cap resolved against the wrong font size

`max-w-[24ch]` on the `<figure>` capped a 64px pull-quote at **235px**, because
`ch` resolves against the element's *own* font size and the figure inherits
body text at 17px. The first long word then overflowed it. Changed to `rem`,
which is unambiguous.

### Sections, and what each one refuses to be

| Section | The default it avoids |
|---|---|
| Category index | Six icon cards in a grid. It is an editorial list with live counts and three real vendor marks per row. |
| How we rate | Three cards in a row. Three rows on the rail, each carrying a real figure as evidence. |
| Head to head | Stacked pairs. Split A/B across a true axis, two across rather than three so the names do not truncate. |
| Top rated | Cards. A ranked table with tabular figures and a compare checkbox. |
| Testimonials | A carousel of equal cards. One `display-l` pull-quote and a dense multi-column flow. |
| Guides | A 3-up card row with `01 / 02 / 03`. Lead plus four, no numbering. |
| Newsletter | A centred rounded panel. Full-bleed ink, radius 0, left-aligned on the rail. |
| Footer | A second newsletter form and a `SparklesIcon`. Neither survives. |

### The compare tray, verified end to end

One product selected shows a "Pick one more" slot and sets
`data-compare-open` on `<html>` so the footer and anything else fixed to the
bottom can clear it. Two products give the correct
`/compare/simplepay-vs-xero` link, and **both chips and the link survive a
route change** to `/software`.

State is a context plus `sessionStorage` — not a state manager, and session
rather than local storage because a shortlist is a task in progress, not a
preference. At the two-item cap a new selection drops the oldest rather than
being silently ignored, because a checkbox that refuses to tick with no
explanation is the more confusing behaviour.

---

## v2 rework, Group A — the scale sits level

Brief v2 §0.2 overturns a v1 decision that Phase 4 had already built. This
section records the reversal so it is not re-litigated.

### What was removed, and why it was wrong

Three separate autonomous behaviours were driving the hero scale:

| Removed | Was | Lived in |
|---|---|---|
| Idle sway | A `requestAnimationFrame` sine loop, ±0.8° on a 6s period, running forever | `Tilt.tsx` |
| Pointer tilt | The beam leaned up to ±3° towards the cursor, anywhere in the hero | `Tilt.tsx` |
| Automatic chip swap | A 4 000ms `setInterval` cycling five vendor pairs, each swap nudging the beam to a new angle from `[0, 1.6, −1.2, 2.1, −1.8]°` | `HeroScale.tsx` |

The argument against all three is the same and it is not a taste argument. The
site's entire claim is that rankings cannot be bought. A scale that leans is
making a statement about which side is heavier. Leaning on a timer, or because
a cursor crossed the viewport, means the site is making that statement at
random — continuously, in its largest object, above the fold. It is a
contradiction of the brand, not a flourish.

The pointer tilt was not in the user's list and was removed anyway: v2 §10 says
the scale tilts **only** when the user actively compares two products, and
moving a mouse is not a comparison.

### What replaced it

Nothing ambient. At rest the beam is level and inert, and that is the finished
state rather than a placeholder waiting for an effect.

The one motion that remains is the one that means something. `HeroScale` reads
the compare context; when the reader has two products selected, those two
products appear on the pans and the beam leans towards the higher rated one and
settles on the standard spring — one overshoot, then still.

Ratings are resolved in `Hero` from the catalogue it already fetches, keyed by
slug, and passed down. The tray deliberately stores only a slug and a name so
it can render on a route where nothing was fetched, and that contract was not
widened to carry a rating for the sake of one consumer.

Lean is `−clamp((left − right) / 0.5, −1, 1) × 5°`. **The sign is load-bearing:**
CSS rotation is clockwise-positive, which lowers the *right* pan, so a stronger
*left* rating has to produce a *negative* angle. Getting it backwards is silent
and points the site's one meaningful animation at the loser. An unknown rating
on either side returns level — the scale declining to answer is correct,
guessing is not.

**Superseded.** That reading — better rating rises — is not what the site does
any more. The current object is a grocer's scale and the better-rated product
SINKS; see "The sign is load-bearing" under the Phase 4 hero rebuild below.

### Verified

Measured off the computed transform of `.hero-tilt` in Chromium, not by eye:

- Eight samples over 7.2s at rest — longer than both the old 6s sway period and
  the old 4s swap interval — returned `0°` every time.
- Chips at rest are static and labelled: Xero / Sage Accounting.
- Seeding the tray with SimplePay (4.7) and PaySpace (4.3) and reloading gives
  `−4°`, exactly the formula's output for a 0.4 gap, leaning left towards
  SimplePay. Chips become the two compared products.

### Consequences

- `SPRING_TRACK` in `components/motion/springs.ts` was the pointer-tracking
  spring and had exactly one consumer. Removed rather than left dead.
- `Tilt` is now a spring-to-angle wrapper with an `angle` prop, and is still
  used by one element only. It must not grow a pointer or idle mode back.
- The chip max-width of `11ch` truncates "Sage Accounting" to "Sage Acco…".
  Pre-existing, unrelated to this change, and not addressed here.

### Still true from Phase 4

The disc, the occlusion, the light-in-both-themes rule and the asset
proportions in HANDOVER §3.1 are untouched. Only the motion changed.

---

## Phase 4 replacement — live comparison, simplified (2026-09-08)

The user's new hero instructions supersede the scale/disc decisions above.
The giant ellipse, large scale component and PNG are removed. The left-hand
copy and search behavior remain unchanged. A single text node preserves the
complete headline as the measured LCP element on desktop and mobile.

The first comparison draft showed too many separate metadata lines. The
revised version groups each product into name, rating/reviews, and entry price.
Plan details and source links sit in one native disclosure. A short factual
price/free-plan distinction remains below the two equal panels.

The 240px balance has a fixed stand and pivot. The arm lowers the higher-rated
side; the hanging pans counter-rotate to stay horizontal. No idle motion.
One cancellable timer advances level, fade, reveal and resting states at a
six-second cadence. Hover and keyboard focus independently pause cycling.
Dots select immediately; a separate Pause/Play control supports a lasting pause.
Reduced motion shows only the first pair, level and still.

Data: `lib/queries/hero.ts` reuses the already-loaded catalogue. Its three
pairs are Sage Accounting/Xero, Sage Accounting/Zoho Books, and Xero/Zoho Books,
drawn from existing curated alternatives and real canonical routes. The local
catalogue ratings are generated targets, so they are deliberately not used.
After the user asked us to source genuine data ourselves, public Capterra
rating snapshots and vendor pricing were recorded with URLs and retrieval date
in `lib/content/hero-evidence.ts`. Ratings are explicitly attributed to Capterra,
not presented as Indaba review aggregates. Indexed snapshots are not a live feed.

Navbar: position controls its opaque capsule; direction controls contraction.
Reversing mid-page no longer makes the navbar transparent over page content.
Marquee: opacity now applies once to the image (0.6), rather than to both image
and wrapper (0.36 combined); wordmarks receive adequate width.

Validation: production build, typecheck and scoped lint pass. Real-time Chromium
checks cover four pair changes, timing, fade/level/settle, both tilt directions,
ties, hover/focus, keyboard dots, reduced motion, six responsive widths and real
comparison destinations. Both themes captured at 1280 and 390, plus 400px scroll.
At 1280x800 the hero is 563px high and the marquee starts at 556px.
Artifacts: `.screens/phase4/`.

Existing unrelated issues remain: full lint reports effect-state errors in
`CompareTray.tsx` and `Intro.tsx`, and unused-variable warnings in Intro and the
software profile. Local production preview returns 404 for Vercel Analytics'
host-provided script. No new browser errors were observed. No git commands used.

### Follow-up — less copy and visible counters (2026-09-08)

The user's subsequent request to remove unnecessary hero text supersedes the
earlier instruction to preserve its copy. The headline is now "Find the right
software." One supporting sentence identifies South Africa and free use. The
search placeholder is short enough to fit on mobile. The redundant comparison
heading is removed; source attribution is a shorter disclosure and Pause/Play
uses labelled icons. Product facts and the comparison sequence stay intact.
The icons ignore pointer events: replacing an SVG under the pointer otherwise
lost its pointer-out event and left hover pause latched after clicking Play.

Browser reproduction confirmed that CountUp started at hydration and finished
below the mobile viewport before anyone scrolled to it. An IntersectionObserver
now starts each counter once its number is at least 60% visible. Its final value
reserves the number's width, and an accessible static copy avoids announcing
intermediate values. Motion reduction, including changing the preference during
counting, immediately shows the final value. The stats override the inherited
negative word spacing so the thousands separator remains visible. This changes
counter timing and presentation; the existing SiteStats data source is unchanged.

Chromium checks pass for deferred start, intermediate values, exact settlement,
constant widths, no replay on repeat scroll, reduced motion and JavaScript off.
The headline remains the measured LCP element. At 1280x800 the hero is 499px high
and the marquee starts at 492px. Both themes at 1280 and 390, plus the collapsed
navbar at scroll 400, are captured as `.screens/phase4/minimal-*.png`.
Counter evidence: `counter-fixed.webm`, `counter-counting.png`,
`counter-settled.png`, and `counter-verification.json` in the same directory.

Typecheck, scoped lint and production build pass. Full lint still reports only
the two pre-existing errors and two warnings listed above. No git commands used.

### Hero copy refinement (2026-09-09)

"Choose better software." makes the headline shorter and more direct. The
supporting line now explains the practical benefit: "Compare prices and reviews
for South African businesses. Free to use." Search, layout and comparison
behavior are unchanged.

---

## Hero rebuild — the panels are the pans (2026-09-09)

Third attempt at the hero's right-hand column, and the one that merges the two
that failed. Attempt 1 was a flat balance on a sand ellipse: decoration, and
the ellipse took 60% of the viewport. Attempt 2 was two data panels with a
beam floating above them: the beam read as a separate object and it tilted
towards the lower-rated product. Here the panels ARE the pans.

### The interleaved string was a screenshot artefact, not a bug

`Sources · CaptZoho Books offers a free plan.erra` does not exist in the code.
The server HTML is clean, six widths in both themes scan clean, a 22-second
frame-by-frame watch of a full cycle returns zero overlapping text rects, and
the string appears in no saved capture. It was the three stacked
`.hero-compare-body` layers sharing one grid cell: forcing their `visibility`
gate off reproduces exactly that character-for-character mixing. The rebuild
renders one pair at a time, so the stack — and the whole class of artefact —
is gone rather than merely unlikely.

### One number drives the mechanism

`--lean`, a fraction in [-1, 1] on `.hero-scale`, inherited by the subtree.
CSS turns it into four transforms: the beam rotation, a counter-rotation per
rope so each hangs plumb, and the two panel translations. Animating one value
instead of four springs is what keeps the rope feet welded to the panel corners
through the settle; four independently sprung values drift apart mid-flight and
the object comes unstuck exactly while it is being watched. Measured: foot
bottom and panel top agree to 0.1px at every pair and at every angle.

The arithmetic ties the parts together. Beam ends sit 25.5% of the width either
side of the pivot, so 6.2 degrees drops an end by 25.5 x sin(6.2deg) = 2.75% of
the width, which is what the panels travel. Travel is therefore in `cqw`, not
px, so it holds at 512px (14px) and at 1024, where the column is 395px (11px).
A px constant would only have been right at the width it was tuned against.

**The sign is load-bearing and it was wrong twice during this build.** Positive
`--lean` now means the LEFT product SINKS. That is the second convention this
object has had, and the first one was wrong for a reason worth writing down.

The first draft reasoned from scoring: the higher rating wins, so the winner
goes up. Nobody reads it that way. This is drawn as a grocer's scale, and a
scale is not a podium, so the heavier thing goes DOWN. A reader seeing the
better product ride up reads the instrument as broken, not as generous. The
metaphor the picture chooses beats whatever the code intended, so the picture
won: beam `-lean x 6.2deg`, ropes `+lean x 6.2deg`, pan A `+2.75cqw`, pan B
`-2.75cqw`. The compare page carries the same flip at 5.4deg and 2.4cqw.

Before that, a draft negated only the beam, which pointed the object's one
meaningful animation at the loser while the panels moved correctly. Both
errors were invisible in the code and obvious in a render, which is the whole
argument for measuring this rather than reasoning about it: pan tops and rope
feet are read out of the live DOM, and the better-rated side must come back
with the LARGER y.

### The ropes cannot rotate rigidly with the beam

The brief asks for a wrapper holding beam and ropes. Taken literally with the
feet on the panel corners it does not work: the outer foot sits twice as far
from the pivot as the panel's hang point, so it swings twice as far and tears
away from the corner at any real angle. Each hanger therefore counter-rotates
about its own apex. The two rotations compose to a pure translation, the ropes
hang plumb, and the feet land exactly as far down as the panel travels.

The yoke is inset from the panel corners to about 28%/72% of the panel width,
following the brief's own diagram rather than its prose. Spanning the full
width the V is 250px across against an 80px drop, and the object reads as a
circus tent rather than a balance. Ropes are also `--text-muted` rather than
full ink: beam, post and base are the instrument, the ropes are thread, and at
this span a full-strength diagonal crossing the whole panel out-weighs the
numbers it is holding up.

### A rotating object needs somewhere to sweep

At full lean the beam wrapper's lower corners swing 8.6px outside the column.
`.hero-compare` carries matching horizontal padding, which is also what aligns
the panels and the pause control on one line without nudging either out.
`.hero-scale` and `.hero-rig` take `data-bleed` because their own boxes are
legitimately wider than their content while tilted.

### Panel details

- Panel gap is `2%`, not a rem, so the panel edges land on exactly 49% and 51%
  at every width — which is where the rope feet are drawn. A rem gap misses the
  corner at one width and overlaps at another.
- `.hero-panel .data { word-spacing: normal }`. `<Figure>` closes word spacing
  by 0.12em so "6 196" reads as one figure at display sizes; at the 12px the
  review count sets at, that is wider than the narrow no-break space itself and
  "3 250" collapsed to "3250". The same defect the component exists to prevent,
  inverted by size. The stats band already carried this override.
- Winning signal is one 1px sand top edge and nothing else. Equal ratings mark
  neither panel, because a scale declining to answer is the correct answer.
- The per-side difference line is split into figure and words in the data layer
  (`HeroDifference`) so the figure can go through `<Figure>` and the sentence
  around it cannot.

### Marquee sized by optical area

`scripts/measure-logos.ts` rasterises every mark, counts its alpha and writes a
per-mark height into `lib/logo-optics.ts`. The row is painted `brightness(0)`,
so ink area IS optical weight and the sizing is a measurement rather than a
judgement. Ideal heights spread from 15.8px to 64.8px against the old flat
32px, which is the whole story: wave, payspace, bitrix24 and syspro clamp down
to 22px, and the sparse glyphs — zoho, odoo, sage, sap, wrike — clamp up to
38px.

`freshbooks.png` is 92% ink because the mark itself is a filled tile, so it
still reads as a solid block, just a smaller one. Only a different export fixes
that; scaling cannot.

### Deviations from the task brief, and one thing it got wrong

- **`/compare` has no Capterra attribution to preserve.** The brief says the
  "Sources · Capterra" line still belongs there. It never did: `/compare` reads
  `overall_rating` out of the database, which is Indaba's own figure, while the
  hero's numbers come from `lib/content/hero-evidence.ts` and are Capterra
  snapshots. Removing the visible line means the only Capterra figures on the
  site now carry no visible source. The URLs stay in the evidence file and the
  attribution survives in the panel's screen-reader text, but this is an
  editorial call rather than a layout one and it wants a decision.
- **No "large empty region" under the headline existed.** Measured at 1024,
  1280, 1440 and 1920, the two columns finished within 15px of each other. What
  reads as a hole is the subheading breaking after "businesses." and dropping
  "Free to use." onto a line of its own, three words wide in a 605px column.
  Its `max-width` moved from `46ch` to `36rem` so it sets on one line from 1280
  up.
- **No truncation was found to fix.** "Sage Accou…" came from the deleted
  `HeroScale` chips and their `11ch` cap, recorded above under the v2 rework.
  Nothing in the panels truncates at any width.
- **The settle overshoots once, not twice.** `SPRING` is damping 26 against
  stiffness 220, and the brief says to use the project's spring token. Measured
  trace: -0.595 -> -0.601 -> -0.600. Two oscillations would need a lower
  damping, which would be a new token.

### Verified in a browser, not by reasoning

- Still at rest: `--lean` unchanged across 7.2s.
- Cycle: rest -> level (to 0 over 300ms) -> fade -> reveal -> rest, settling on
  the spring. Three real pairs, correct destinations.
- Tilt direction correct on both leans; `xero-vs-zoho-books` is a genuine 4.4
  tie and sits at exactly 0 with neither panel marked.
- Hover and keyboard focus each hold the cycle; dots are tab stops with a
  bronze `rgb(122, 95, 49)` ring at 2px offset.
- Reduced motion: first pair only, `--lean` -0.6 applied statically, no
  controls, unchanged after 8s.
- CLS: foot row, band height and marquee position identical across all three
  pairs. Panels are 153.8px tall in every pair.
- Seven widths in both themes: no sideways scroll anywhere.
- Navbar at scroll 400: contracts to an 849px centred ink capsule, opaque, no
  overlap with page content.
- Typecheck, scoped lint and production build all pass. No git commands used.

## Homepage category grid (2026-09-09)

The user replaced the row list and hover preview with six cards: two columns
on desktop, one below 640px. The left structural rail is unchanged, and the
heading is now "Browse by category". Each card is a single category link with
its name, a product count with its unit, three vendor marks, and the top product's
name, rating out of five and review count. All details are server-rendered and
always visible, including on touch devices and with JavaScript disabled.

Cards use the paper surface, 12% ink border and 14px radius. Only the border
changes on hover; keyboard focus has a visible ring. Compact padding and gaps
keep the facts together. The shared logo optics use a 28px reference, with a
28px minimum for square marks so their internal lettering remains readable;
dark mode lifts wordmarks while preserving the internal colors of filled icons.
No preview, hover state, animations
or client bundle remain in CategoryIndex.

The existing navigation query supplies the three ranked products per category.
The homepage reuses its first product and the already-loaded catalogue for the
inline details, removing six redundant product queries without changing query
contracts or ranking. The displayed category counts and leader statistics are
unchanged from the previous implementation.

Paymaster's previous initial was replaced with its original wordmark, retrieved
from the vendor's own media library on 2026-09-09. The 300×57 PNG is 11.6KB and
is scoped to the homepage cards; the shared brand registry and other pages are
unchanged. Source: [vendor-hosted Paymaster wordmark](https://www.hrmaster.co.za/wp-content/uploads/2025/02/Paymaster-e1721664082304-2048x391-1-1536x293-1-300x57.png).

Validation: typecheck, scoped lint and production build pass. Browser checks at
1280 and 390 in both themes confirm six cells, 18 loaded logos, unchanged counts
and leader statistics, no horizontal overflow or hidden facts, border-only hover,
visible keyboard focus and whole-card touch navigation. All six summaries also
render with JavaScript off. Screenshots and the data audit are in
`.screens/categories/`. Full lint retains the existing effect-state errors in
CompareTray and Intro, plus the existing unused-variable warnings. The only
browser console error is the existing local Vercel Analytics script 404.
No git commands used.

## Homepage directory refinement and supplied PNG logo (2026-09-09)

Category cards now have category-specific navigation icons, clearer heading and
count grouping, optically sized vendor marks, and a separated highest-rated
product summary. Six cards remain in two columns on desktop and one on mobile.
All facts stay visible; hover changes the border only. The structural rail stays.

The comparison heading is "Compare two products". Three compact comparison cards
sit across the desktop well, with equal product columns, full wrapping names,
ratings out of five, review counts, starting prices and VAT qualifiers. Mobile
uses one card per row. Each card links to its canonical comparison route: Sage
Accounting / Xero, QuickBooks Online / Xero, and Xero / Zoho Books.

"Top rated software" is a paper-backed ordered list with all eight products'
ratings, review counts and pricing visible on mobile. Compare labels are clickable
and explicitly name their product for assistive technology. The rail count now
matches the eight products shown. The existing query ranking is unchanged.

The user subsequently rejected the Sage featured placement, which was removed
along with its styles. No score was increased or ranking overridden: the local
catalogue records Sage Accounting at 4.7 from 377 reviews, while the separately
attributed hero snapshot records 4.1 from 547 Capterra reviews. Neither supports
the requested higher score and first-place claim. These are existing, distinct
data sources; this visual update does not verify the generated fallback catalogue.

BrandLogo uses the supplied transparent public/logos/indaca_logo7.png (500px
square), including the header, intro and footer. CSS fits the artwork's margins
into the existing mark box; the source asset is unchanged.

Final validation: production build, typecheck and lint for all changed source
files pass. Full-project lint retains the two existing effect-state errors in
CompareTray and Intro and two existing unused-variable warnings. Browser checks
at 1280 and 390 in light and dark confirm loaded images, no horizontal overflow,
stationary hover, visible focus, keyboard and label comparison selection, tray
clearing, unchanged ranking and capsule navigation after 400px scroll. All six
category routes, three comparison routes and the editorial-policy link return
200. Section content also renders with JavaScript disabled. No page exceptions;
the only console failure is the existing /_vercel/insights/script.js local 404.

Final screenshots (categories, comparisons, top-rated, branding, footer and
400px-scroll navigation) and verification.json are in .screens/home-refinement/.
No git commands used.

## Homepage testimonials and buying guides (2026-09-09)

Removed the homepage testimonial wall and its getFeaturedReviews call. The local
fallback generates its quotes, reviewer names and verification flags; displaying
these as customer proof would not support a trustworthy lead journey. The shared
Testimonials component and review query remain available; no review data was changed.

Replaced the long editorial guide block with a full-width three-card reading list.
The heading now says Software buying guides, followed by one short purpose line.
A sand-tinted lead card has the strongest reading action and its existing excerpt;
the other cards show full titles, category and reading time without repeated author
or date metadata. View all guides links to /blog. Existing published article titles,
slugs and reading times come through getLatestArticles(3). No new content claims,
lead forms, animation or database contracts were introduced.

Changed files: app/(public)/page.tsx, components/public/home/Guides.tsx,
app/globals.css. The header, hero, product sections and newsletter are unchanged.
Production build, typecheck and changed-file lint pass. Browser checks at 1280 and
390 in both themes confirm three guides, working blog/article links, visible keyboard
focus, no page exceptions and no horizontal overflow. The lead card's small text
uses the primary text token to preserve contrast on its tinted surface in dark mode.
Screenshots and verification.json: .screens/buying-guides/. No git commands used.

---

## Footer rebuild — the horizon (2026-09-09)

The footer was a flat ink slab: straight top edge, a wordmark set at body size,
four link columns floating in a lot of air, and a base row of meta text. It
ended the page without closing it. The brief for this pass was a reference
screenshot of the Footway footer — a purple band whose top edge is an
illustrated city skyline with product shots breaking the horizon.

### What was taken from the reference, and what was not

Taken: the **structure**. A coloured band whose upper boundary is a drawn
silhouette rather than a rule, big type against small tidy link columns, and a
base row that says a real business is behind this.

Not taken, and each for a rule rather than a preference:

- **The purple gradient.** §4 bans gradient washes outright, with one exception
  that is not this. The band is flat ink, which §4 also rations to three
  surfaces a page and names the footer as one of them.
- **The product photographs.** §12 bans stock photography. The illustration is
  drawn.
- **The payment-card badges and country flags.** Indaba sells nothing and takes
  no payments, so a row of card logos would be a trust signal it has not
  earned. Its honest equivalent is the market signals it already publishes, and
  those got labelled slots instead of being run together in a meta line.

### The horizon

`components/public/FooterHorizon.tsx`. A South African skyline in flat ink:
Lion's Head, Table Mountain and Devil's Peak, a city east through the Hillbrow
Tower and Sandton, then a pylon, a wind turbine and acacia out to the veld.

The point is not decoration. The single thing this site sells is that it is
local — rand prices, local reviewers, the local VAT rate — and that claim was
being made only in 14px type in the base row. A skyline puts it in the design.

Three things make it work, and each was found by rendering it rather than by
reasoning about it:

- **It carries its own page background.** On the home page the newsletter is a
  full-bleed ink band directly above the footer, so an ink silhouette on a
  transparent strip is ink on ink and disappears on the most important page of
  the site. The strip paints `--color-surface-page` behind itself: invisible on
  a bone page, deliberate air between two ink surfaces on the home page.
- **A sand hairline traces the outer edge.** In dark mode the footer ink is
  #262626 against a #141413 page — 1.35:1 — and the whole drawing all but
  vanished. Cards solve the same problem with a hairline border; this is that
  rule applied to a drawing, and sand is already the token for rules and marks.
  The skyline is rendered twice, stroked then filled, so every stroke falling
  inside the union is painted over and only the horizon keeps its edge.
  Stroking the shapes individually would trace all twenty of them.
- **The bottom is disposable.** Below the ground line the artwork is solid and
  the footer body is the same ink, so the strip crops its own bottom with no
  seam. That is what caps the height at 11rem instead of letting it grow to
  264px at 1920, and it is why `overflow: hidden` there is load-bearing. Below
  ~700px the svg holds a `min-width` and crops at the sides instead of
  shrinking, so a phone gets a legible crop — Table Mountain through the
  Hillbrow Tower — rather than a 54px-tall smudge.

Drawing notes worth keeping, all of them mistakes made first:

- Near-identical rect widths at even intervals read as a bar chart, not a city.
  The blocks are held as data with varied widths, deliberate overlaps and
  setbacks on the taller slabs.
- Table Mountain needs a long dead-flat plateau, steep faces, AND to out-top
  the office towers. The first draft failed all three and read as a barn roof.
- Lion's Head has to stay clear of the massif or the two merge into one lump.
- Anything under about six units wide ends up more sand edge than ink body, so
  the crane, pylon, turbine and acacia trunks were thickened rather than
  dropping the edge.

### The footer body

- **The wordmark is finally `display-xl`.** `.footer-brand .brand-wordmark` had
  been in globals.css since Phase 2 and never applied: `BrandLogo` sets
  `text-xl` on it, Tailwind utilities sit in a later cascade layer than
  `@layer components`, and a later layer wins however specific the component
  selector is. The three dead `.footer-brand` overrides are deleted and the
  footer composes `LogoMark` plus its own wordmark element instead of trying to
  out-specify a utility. Worth remembering as a class of bug: **a component
  rule can never override a Tailwind utility on the same element**, so the fix
  is always to stop setting the utility.
- **The social links exist now.** `SOCIAL_LINKS` had been in `lib/site.ts`
  since the start and was rendered nowhere. Three single-path glyphs, 44px
  targets, ringed so they read as controls without hover.
- **The market signals are a `<dl>`** with labelled slots between two rules,
  rather than a middle-dot meta string, which is banned.
- Category links drop the trailing "Software", so the column reads Accounting /
  Payroll / HR rather than repeating the word six times.

### Verified

- Both themes at 1280 and 390, on `/about` (bone above) and on `/` (the ink
  newsletter band above), which is the case the strip's own background exists
  for.
- Seven widths in both themes: no sideways scroll, and no element-level
  offenders once the strip is marked `data-bleed` for its deliberate side crop.
- Typecheck, scoped lint and production build pass. No git commands used.

### Open

The horizon is a second bold moment on a site whose §16 says to spend all the
boldness on the hero scale. It is static — no motion, no parallax, nothing that
competes for attention — and it sits at the bottom of the page where nothing is
competing anyway. Recorded here because it is a deliberate departure and the
next person should know it was made on purpose.

### Footer, second pass — the newsletter moves in (2026-09-09)

The horizon fixed the top edge of the footer and exposed a worse problem
underneath it. On the home page and on every blog post the newsletter was a
full-bleed ink band sitting directly above the footer, so the page ended with
two dark slabs separated by a stripe of bone: the horizon strip, stranded
between them, reading as a gap rather than as a boundary.

**The form moved into the footer and the band is gone.** `NewsletterSection` is
deleted; `app/(public)/page.tsx` and `app/(public)/blog/[slug]/page.tsx` no
longer render it.

This reverses a Phase 5 decision, so the reasoning is worth stating properly.
Phase 5 pulled the form OUT of the footer because the home page then carried
two sign-ups within a screen of each other and because the colour rules ration
a page to three ink surfaces. It was right about the duplication and wrong
about which copy should survive. There is still exactly one sign-up. It is in
the footer. The ink budget improves rather than degrades — the bottom of the
page is one surface now instead of two with bone between them — and the home
page loses a section, which §2 wants anyway.

`NewsletterForm` already took a `source` prop whose own comment said "the same
form sits in the footer of every page", so the component contract was always
written for this; it just was not wired that way.

### What else the footer gained

- **A masthead.** The wordmark at `display-xl` with the tagline, contact and
  social under it, beside the newsletter heading and form. The footer opens
  with a statement instead of a sitemap, and the two columns finish within a
  few pixels of each other rather than one running 180px past the other.
- **Three live head-to-heads,** each with both vendor marks, from
  `getTrendingComparisons`. This is the answer to "the footer does not show
  what the product does": a directory footer that lists only its own pages is
  describing itself, while two named products being weighed against each other
  is the thing the site is for. They are also three internal links into compare
  pages, which is where the organic traffic this business runs on lands.
- **The sitemap runs the full width** as four even columns, now that contact
  has moved up into the masthead.

Measured at 1280: 882px before this pass, 1385px after — but the page it sits
on is shorter, because a ~400px newsletter band came out of the flow above it.

### Still open

`NewsletterForm` renders an `ArrowRightIcon` in the Subscribe button. §12 bans
arrows in button labels. It is pre-existing and the component is shared with
the `/newsletter` landing page, so it was left alone rather than changed under
a footer task — but it is now the most prominent button on every page and it
should go.

### The ledge at the ends of the horizon (2026-09-09)

Reported from a 1440-ish screenshot: a hard rectangular step in the ground at
the far left and far right, as if the footer had a plinth under it.

**Cause: the `max-height: 11rem` cap on the strip, via flexbox.** The svg is a
flex item and `align-items` defaulted to `stretch`, so the capped 176px height
was handed to the svg while its width stayed at 100%. At 1920 that makes a
1920x176 box, which does not match the artwork's 1600x220 ratio, so
`preserveAspectRatio` did what it is supposed to do and letterboxed the drawing
into the middle 1280px. The ground therefore stopped 320px short of each edge,
and what showed either side was the flat top of `.footer-body` — read as a step
in the ground. At 1280 the two ratios happen to agree exactly, which is why it
never appeared in any of the 1280 captures.

**Fix: the strip has no height of its own.** `align-items: flex-start` plus
`align-self: flex-start` on the svg, and the cap is gone, so `width: 100%` and
`height: auto` always describe the same box the artwork wants and nothing is
ever letterboxed. The strip is 97px at 390, 176px at 1280, 264px at 1920.

There is no cap that avoids this. At a fixed height and a growing width you
either letterbox — a ledge at both ends — or slice, which cuts the tops off the
towers and the mountain. Scaling with the viewport is what a full-bleed
illustration should do anyway. `min-width: 44rem` is the one exception and it
only bites below ~700px, where the sides crop rather than the artwork shrinking
to a smudge.

Worth remembering as a class of bug: **constraining one axis of an inline svg
while the other is `100%` silently changes what `preserveAspectRatio` does.**
The symptom appears only at viewport widths where the two ratios disagree,
which is why it survived a seven-width overflow audit — nothing overflowed, and
nothing scrolled. It was only visible.

---

## The product grid, and a ranking that stays honest (2026-09-09)

A new home page section after the categories: twenty real products as cards,
each with a 48px vendor mark, the rating, the review count, the rand price and
two actions — `components/public/home/SoftwareShowcase.tsx`, fed by
`getSoftwareShowcase()` appended to `lib/queries/software.ts`.

### The placement question, and where the line is

The request was to move one vendor to the top, raise its rating, and have the
whole thing read as an organic result.

**The placement is built. The rating change is not, and should not be.** Those
are two different things and the difference is the entire business:

- *Placement* is a commercial decision a directory is entitled to make and
  sell. §1 already names sponsored slots as a revenue line. `getSoftwareShowcase`
  pins rows flagged `featured` ahead of the Bayesian ranking, so any product can
  be given the first slot by flipping one boolean.
- *A rating* is a claim about what reviewers said. Editing it, or arranging
  placement so the reader takes it for a ranking, is a false statement to
  someone spending money on the strength of it. It also breaks the promise the
  site makes in writing three times over — the hero, the editorial policy, and
  the affiliate disclosure in this very footer, which says a commercial
  relationship "never affects a rating, a review or a position in a ranking".
  A directory that quietly sells positions is worth nothing the moment anyone
  checks, and the numbers here are checkable against Capterra.

So every promoted row carries a visible **Featured** chip and the same rating,
review count and price every other card shows, computed identically. Placement
can be arranged, the figures under it cannot, and a reader can always tell which
is which. That is also what the market does: Capterra marks paid placement with
a differently coloured Visit Website button rather than hiding it.

### Card decisions

- **The vendor mark is bare art at 48px.** `SoftwareLogo` renders the vendor's
  own transparent file with no plate, which is what makes a grid of twenty
  scannable — a buyer recognises a logo before a name.
- **Two unequal actions.** "Compare" is the site's own product and stays quiet;
  "Visit site" is the tracked affiliate link. `CompareButton` was added to
  `CompareTray` because the existing `CompareToggle` is a bare checkbox, and in
  a grid of twenty a checkbox does not say what it does without being learned.
- **`AffiliateCTAButton` gained `tone="ink"`.** The default takes the vendor's
  brand colour, which is right on a product page and wrong twenty times in a
  row: it was a fruit salad, and several vendor colours are too pale to carry
  white label text at button size. In a list the identity belongs to the logo.
- **Caught in a render, not in review:** with `tone="ink"` the button is
  `--surface-ink`, and in dark mode the CARD is also ink, so the CTA vanished
  into its own background. Dark now swaps it to sand with ink text, which is
  the swap `.nav-cta-on-ink` already makes for the same reason.
- **`isCustom` earns its keep.** Eleven of twenty products publish no list
  price. The long note under "Pricing on request" is dropped, because repeating
  "the vendor does not publish a list price" eleven times buries the nine cards
  that do have a number.
- **No shadow, no lift, no scale on hover.** §12 bans a grid of identical
  rounded cards with identical shadows. What stops these reading that way is
  that the data differs, not the container. The border goes to control weight
  and nothing moves.
- The whole card is a pointer target via a `::after` overlay on the name link,
  with the two buttons lifted above it. The card is not itself a link, because
  nesting buttons inside one is broken for a keyboard and a screen reader.

### Known, and deliberately not fixed here

- **Dark vendor marks disappear on a dark card.** PaySpace's wordmark is
  near-black artwork, so in dark mode its card looks logo-less. It affects the
  whole site, not just this section — `SoftwareCard` has always had it. The
  principled fix is to measure each mark's luminance the way
  `scripts/measure-logos.ts` already measures its ink area, and invert only the
  dark ones in dark mode.
- **Twenty cards is 6 900px of scrolling at 390.** That is what twenty cards
  costs on a phone. If it wants shortening, the cut is a shorter mobile list
  plus a link to `/software`, not smaller cards.
- **This section and the top-rated table are the same catalogue twice.** The
  grid answers "what is out there and what does it cost"; the table answers
  "who is best". If one goes, it should be the table — this is the one with
  prices on it.

### Footer, same pass

- The mark went 3.75rem to 5rem. `.brand-logo-mark` crops the artwork at 180%
  and hides the overflow, so the glyph reads at about half the box; at 3.75rem
  it looked undersized beside a `display-xl` wordmark.
- The comparison row is centred, and it is the only centred block on the page.
  Three short pills hanging off the left edge under a full-width rule read as an
  unfinished row rather than a set.

### Sand buttons, a real gloss, and the logo gets its colours back (2026-09-09)

#### The button system

`.btn-glossy` is the single base class behind every primary button on the site
— twelve call sites through `GlossyButton` plus four direct — so all of this is
one change in one place.

- **The fill is sand, not ink.** Sand's defined role is fills, and ink on sand
  is 8.21:1 so the label never pays for it. The hero Search button, the
  newsletter Subscribe, the compare tray, the showcase CTAs and the navbar all
  moved together.
- **The rim is a darkened mix of the fill**, not the fill itself. Sand against
  paper is about 1.5:1, and WCAG 1.4.11 wants a control boundary to be
  findable; deriving the rim from `--btn-bg` also means it stays correct when
  `AffiliateCTAButton` sets a vendor colour inline.
- **Hover mixes toward the LABEL colour**, not toward bone. On a sand or brand
  fill the label is ink so the button darkens; on the ink variant the label is
  bone so it lightens. One rule, right in both directions, and it survives the
  inline brand colours.
- **The gloss is two inset shadows** — a lit top rim and a soft shade along the
  bottom — with a brighter pair on hover (`--gloss-inset-strong`). §4 grants
  the inner highlight as the single exception to the no-gradient rule, and this
  stays inside it: no gradient, no image, no `backdrop-filter`.

  The request was for "a glass effect". Actual glassmorphism is on the §12
  blocklist, and a blurred backdrop would also cost a compositing layer per
  button on a page carrying twenty of them. A lit convex pill is what was built
  instead.

- The navbar CTA was ink at rest and sand only once docked, so the most visible
  button on the site changed colour as you scrolled past it. It is sand in both
  states now.

#### The logo keeps its own colours

The mark is two-tone — measured at about 90% ink and 6% sand, which is the
brand palette exactly. Every dark surface was showing it through
`filter: brightness(0) invert(0.93)`, which flattens it to one near-white
silhouette and throws the sand away. That is a visible change to somebody's
logo, made for a real reason (ink is invisible on ink) with the wrong fix.

No CSS filter can lighten the ink and leave the sand: `invert(1)` turns sand
into a dark blue, anything through `grayscale` turns it dark. So
`scripts/make-logo-variant.ts` generates `public/logos/indaba-mark-light.png`
with the ink repainted to bone by luma threshold and the sand untouched, and
`LogoMark` now ships both files with CSS choosing by surface. No JavaScript, no
flash, and the pans stay sand on the footer, the docked capsule and in dark.

Re-run the script if the source mark is ever replaced.

#### The footer mark was never the size it was set to

`.footer-mark { width: 5rem }` did nothing: `LogoMark` puts `size-8` on itself,
Tailwind utilities sit in a later cascade layer than `@layer components`, and a
later layer wins however specific the component selector is. This is the second
time the same trap has bitten in this footer — the wordmark had it too. The fix
both times is to stop fighting the utility: pass a conflicting size utility and
let `twMerge` replace it.

#### The grid stopped being a fruit salad

Twenty vendor marks at full chroma is the problem the proof marquee solves with
`brightness(0)`. A product card has to stay recognisable, so the fix here is
gentler: `saturate(0.5)` at rest, full colour on the hovered card. Enough to
tell Xero blue from Sage green, not enough to make the section shout.

#### Placement, again

The request to set Sage's rating to 4.7 was not built. Ratings are what the
reviews say; the lever for prominence is `featured`, which pins a product to
the front of the grid with a visible chip on it, and it is the lever this
section was designed around. See the previous entry for why the line is there.

### The compare tray was invisible from the grid, and three other fixes (2026-09-09)

#### Pressing Compare on a card did nothing

`useCompareTrayVisibility` anchored the tray to
`section[aria-labelledby="h2h-heading"]` — the comparison section, which sits
BELOW the new product grid. The grid is where the Compare buttons now live, so
pressing one put a product into a tray the reader had not scrolled to yet: no
feedback, and the selection looked like it had been swallowed.

The anchor moved to the grid, and the empty slot became an instruction —
"Pick one more product to compare" — with `aria-live="polite"` on it, because
the tray appears in response to a click somewhere else on the page and a
screen reader otherwise gets no notice that anything happened.

Verified: one click docks the tray with one chip and the prompt; a second gives
two chips and `/compare/sage-accounting-vs-simplepay`.

Worth remembering as a class of bug: **a viewport-gated component has to be
gated on the earliest thing that can trigger it**, not on the section it was
originally designed next to. Adding a trigger above the gate silently disables
the feedback.

#### The hover gloss was real and imperceptible

Measured, hover was already changing the shadow from `rgba(255,255,255,.45)` /
`rgba(0,0,0,.09)` to `.7` / `.16`. It reported as a change and read as nothing:
a 1px inner line getting slightly whiter is below the threshold anybody
notices.

The hover state now brightens the rim to 0.9, adds an inner bloom, deepens the
bottom shade, and — the part that actually makes it legible — lifts the button
on an outer shadow. Elevation is rationed to two levels and this is the second.
Still no gradient and no `backdrop-filter`.

#### The intro plays on every reload

§9 of the brief specifies once per session via `sessionStorage`. The owner
asked for every reload, so the gate is gone from the pre-paint script and the
key is neither read nor written any more.

Both exclusions survive and were re-checked: reduced motion still resolves to
`data-intro="off"`, and so does the admin area. A client-side route change
still does not replay it, because the script only runs on a real document load
and the component writes `off` when it finishes. Measured across three
consecutive loads: `run, run, run`; with reduced motion: `off`.

#### The footer shows the mark on its own

The "Indaba" wordmark text is gone from the footer masthead; the mark stands
alone at `size-32`. The link keeps its `aria-label`, which is now its entire
accessible name. `.footer-wordmark` went with the text it styled.

#### The mark moved to the base row

The footer masthead lost the wordmark text first, then the mark itself: it now
closes the page bottom right, beside the copyright, opposite the affiliate
disclosure. `.footer-endmark` places it; below 1024 it drops under the text
rather than squeezing beside it.

`.brand-logo-mark` also took `data-bleed`. The artwork is scaled to 180% and
cropped on purpose, so the box always reports more content than it shows, and
the screenshot rig started flagging it the moment the footer mark grew past the
audit minimum-width threshold. That is the mark being framed, not a layout bug.

### The splash screen, the watermark, and gloss you can actually see (2026-09-09)

#### The gloss was on hover only, and nobody noticed a hover

Twice reported as "not coming". Measured, it was firing — but the whole effect
lived in the hover delta, and the RESTING button was flat. A glossy button has
to look glossy standing still.

`--gloss-inset` is now a full specular treatment at rest: a hard white top rim,
a soft bright bloom under it, a deep shade along the bottom. Hover intensifies
all three and lifts the button on an outer shadow. Still inset shadows plus one
elevation, still no gradient and no backdrop-filter.

Lesson worth keeping: **a state change measured is not a state change seen.**
The first fix moved an inner rim from 45% to 70% opacity, which is a real
change and completely invisible.

#### The end mark is a watermark

Bigger and much quieter — `opacity: 0.22`, rising to 0.5 on hover or focus,
sized 9rem and 13rem past 1024. It closes the page bottom right without
competing with the disclosure beside it.

**And it disappeared once on the way there.** `size-full` was passed to
LogoMark, whose parent had no dimensions, so it collapsed to nothing — and the
CSS width that should have caught it lost to the utility, because utilities sit
in a later cascade layer. That is the third time this exact trap has bitten in
this footer. The rule, now stated as plainly as it can be: **if an element
carries a Tailwind utility, size it with a Tailwind utility.** Breakpoints
included — `size-36 lg:size-52`, never a media query in `@layer components`.

#### The splash screen got a real sequence

It is a **splash screen** — also called a preloader or an intro sequence. Not a
page: the whole site is already rendered underneath it the entire time. §9 of
the brief calls it the page load sequence; the code is `Intro.tsx`.

It was three beats and 780ms. It is now five beats and 1100ms, inside the
1200ms cap:

     80   a sand rule sweeps out through the mark
    120   the mark tips like a balance and settles level
    200   the wordmark wipes in beside it
    640   the wordmark lifts, the mark travels to the navbar, the curtain
          retreats upward to uncover the page
   1100   done

The tip-and-settle is the beat that means something: the mark is a balance, so
it arrives by finding its own level. Everything else is entrance and exit.

Two structural notes. The curtain is a separate element from the lockup, so it
can retreat while the mark is still travelling over it — when one element did
both, the mark faded out halfway through its own journey and the handover to
the navbar was never actually seen. And the settle animation sits on the mark
itself rather than on `.intro-mark`, because that element is already carrying
the measured travel and a second transform would overwrite it.

**Capturing it needs the animation timeline, not the wall clock.** In dev the
first paint lands hundreds of milliseconds after DCL, so sampling by elapsed
time reads the wrong part of the sequence and it looks broken when it is not.
Pause the animations inside `.intro-overlay` and set `currentTime` — and use a
fresh page per frame, because the unmount timer keeps running in real time
regardless.

### The shine became an animation, and the pills went flat again (2026-09-09)

Reverted: the full specular finish from the previous entry. Bright rim, inner
bloom and deep bottom shade on every primary button made the whole site look
like a tray of boiled sweets, and the navbar CTA worst of all. Restraint is the
trust signal — that is §16, and it was the right call in the first place.

`--gloss-inset` is back to one hairline along the top edge at 0.16.
`--gloss-inset-strong` and `--gloss-lift` are gone, and `.nav-cta` carries no
box-shadow at all. Its three separate rule blocks were merged into one while I
was in there.

**The shine is a hover sweep now.** A narrow band of light crosses the button
left to right when the reader hovers or focuses it, and the button is flat
otherwise. That is the better trade: quiet at rest, and the one moment of
shine answers something the reader did.

It is also the one place a gradient earns its keep. §4 bans gradient washes,
§7 rule 2 welcomes motion that answers a user action, and a swept highlight is
the second drawn with the first. The banned relative is `.btn-shine`, which
did this on a TIMER — an automatic shimmer on a control, which reads as a
loading state and never stops. Hover-triggered is a different thing.

**The sweep has to be linear**, and this is the part worth keeping.
`--ease-out-quint` puts about two thirds of the travel into the first 120ms, so
with it the band was past the label before the eye caught it and the button
simply looked like it flickered. Stepped frame by frame with the animation
paused, at 260ms of a 620ms ease-out sweep the band had already left the
button. At 700ms linear it reads as light crossing a surface. **A traversal
animation wants a constant rate; easing is for arrivals.**

## Sage-first recommendations and comparison-tray visibility (2026-09-09)

The homepage now presents Recommended software in editorial order, with Sage
Accounting first and no featured badge. Its eight-item shortlist reuses the loaded
catalogue and existing top-rated query; no query contract, rating calculation or
catalogue data was edited. Numeric rank markers were removed, and visible copy
states that catalogue ratings are separate from editorial order. The current
catalogue supplies Sage at 4.7/377; this differs from the previously inspected
4.2 value because the catalogue changed outside these edits. That score was not
researched or verified by this change. Other concurrently added homepage sections
were preserved.

The saved comparison tray now stays hidden above the homepage comparison section,
becomes available when that section enters view, and hides again on returning to
the top. Other routes retain normal tray behavior. useCompareTrayVisibility uses
route-aware external-store snapshots, intersection notifications and throttled
scroll notifications (including jumps past the entire section). Its listeners and
animation frames are cleaned up. The compare-open layout attribute follows actual
visibility, so hidden selections do not leave reserved bottom space.

Production build and typecheck pass. Lint passes for the new hook and recommendation
files; CompareTray retains its pre-existing set-state-in-effect error in session
restoration. Browser checks at 1280/390 in light/dark pass: first Sage row, no featured
badge, no overflow, hidden tray at the hero, visible tray at comparisons, jump scrolling,
client-side route changes and preserved selections after reload. Screenshots and
verification.json are in .screens/sage-recommendation/. No git commands used.

---

## The software directory, rebuilt (2026-09-12)

`/software` was one of the pages HANDOVER §3.7 lists as still on the old design
language, and it showed: a centred header with an accented half-heading, star
glyphs, `card-modern` cards, radio inputs in a client component, and ten
products per page.

### The finding that shaped the page

**Twenty-five of the thirty-nine products publish no price at all.** Only
fourteen do.

That killed the first design. The plan had been a price-distribution chart at
the top — the buyer's first question, drawn. With 64% of the data in a "no
public price" bucket, that chart is one tall bar and five stubs: a picture of
missing data. Per the dataviz form heuristic, when the story is a single number
the number IS the chart.

So the page opens with three figures instead — publish a price, free plan, free
trial, each counted against the total and each a filter. It is the honest
headline for a directory whose whole claim is that it checks prices against the
vendor's own page, and the closing note says outright why so many carry none.

### Every filter is a link

The old page put radio inputs in a client component. This one renders anchors
whose href is the current query with one parameter added or removed. Three
things follow, and all three matter on this page specifically:

- A filtered view is a URL, so it can be sent to a colleague and the back
  button walks the choices actually made.
- It needs no JavaScript, on the page organic search lands on.
- There is no client state to fall out of step with the URL, which is the usual
  bug in a filter panel.

A category page does the opposite deliberately — see the note atop
CategoryResults. It is already the filtered view and its controls narrow nine
rows entirely on screen. **Directory: URL. Category: client.** Not an
inconsistency; the same rule at two page sizes.

`href()` always drops `page`. Changing a filter while on page three and keeping
the page is how a listing shows an empty result for a filter that matched
plenty.

### Ten per page was costing the page its job

Four pages for thirty-nine products: three extra round trips to see a list that
fits in one scroll, and three quarters of the catalogue invisible to a crawler
on the page that IS the directory. `PER_PAGE` is 48; `Pagination` renders
nothing at a single page and comes back the day the catalogue outgrows it.

### The mobile rail

Four stacked filter groups put about a thousand pixels of controls above the
first product. Below 1024 each group is now a horizontally scrolling row of
pills — same links, same hrefs, still no JavaScript, roughly 200px.

A `<details>` disclosure was the other candidate and was rejected: forcing a
closed `<details>` back open at the desktop breakpoint depends on overriding UA
rendering that browsers keep changing, and a filter panel that silently
collapses on a wide screen is the worse failure.

### The cascade-layer trap, twice more

`Group` rendered its list with `flex flex-col` utilities, so the mobile rule
turning it into a row lost — utilities sit in a later cascade layer than
`@layer components` and win however specific the selector is. The list now
carries its own class and CSS owns both directions.

That is the fifth and sixth time this has bitten in this redesign. The rule, one
more time: **if an element carries a Tailwind utility for a property, every
value of that property must come from a utility too — breakpoints included.**

### Also

- `SoftwareResultRow` extracted from CategoryResults and shared with the
  directory, so the two listings render the identical object. Two listings that
  differ by a few pixels read as two different products.
- The compare box got a visible "Compare" beside it. On its own it was an
  unlabelled square at the end of a row.
- The empty state names the filters that are actually on. The first version
  advised removing the rating floor, which was wrong whenever no rating filter
  was set — and the commonest empty result here is a category plus "publishes a
  price", because whole categories publish nothing. Payroll is one of them: all
  seven products, no public price.
- `DirectoryFilters` gained `hasPrice` and `DirectoryResult` gained `facets`,
  both additive. The facets are counted over the filtered set before
  pagination, so a caller cannot count `items` and be quietly wrong on page two.

### The directory, second pass (2026-09-12)

Four changes, and two of them fixed defects rather than adding anything.

#### The figures count up

`CountUp` from the hero stats, staggered 90ms apart. The row now arrives as a
tally being taken rather than three numbers that were always there. It
server-renders the finished value, so a crawler and a reader with no JavaScript
get the real figure at 0ms, and it reserves the final width while it runs.

Measured across a load: server HTML says `14, 15, 26`; hydration resets to zero
and counts up staggered; settles exactly on `14, 15, 26` with the tile widths
unchanged at 375/354/354 throughout. The denominator does not animate — it is
the constant the other number is measured against, and animating both makes
neither legible.

#### The rows were truncating, which nothing on this site may do

`description_short` runs to 186 characters, so the row clamped it to two lines
and rendered an ellipsis: "…genuinely gets less annoying the longe…". Every
product has a `tagline` instead, written to be one line — 29 to 61 characters
across the whole catalogue — so it never truncates and says the same thing in
the space a listing row actually has.

#### Two specifics per row

From the catalogue's own `top_features`. A listing that carries only a rating
and a price makes every product look the same; these are the lines a buyer
scans once price has stopped being the question. Two, not three: the third
pushes every row past the height where the list still reads as a list.

The tick is bronze, not sand. A sand tick measures 1.70:1 on paper and would be
a mark nobody can see — the same reason the star rating resolves to bronze.

#### Search, as a real GET form

Thirty-nine products and no way to find one by name. It is a `<form
method="get">` with hidden inputs carrying the rest of the query, so it costs no
JavaScript, lands on a URL like every other filter here, and cannot silently
clear the category the reader had already chosen.

It matches name and tagline only, never the full description: a directory
search that matches body copy returns half the catalogue for a word like
"invoice", which is worse than returning nothing because the reader cannot tell
whether the match meant anything.

#### The masthead

The heading wraps at its own measure and was leaving about half the row empty
beside it, with the figures in a separate band underneath. Moving the figures
into that space fixes both at once: statement left, evidence right, one
masthead. Below 1024 they fall back to a stacked list under the standfirst.

`DirectoryEvidence` is exported separately from `DirectoryBoard` for that
reason alone. Both share the same `href()` builder, so a figure and its rail
option can never disagree about what a filter does.

---

## The head-to-head page, rebuilt (2026-09-13)

`/compare/[pair]` is the page the brief calls the brand thesis. It was a centre
axis, a slab of sand, and a flat alphabetical feature table.

### Why the centre axis had to go

It put the row label in the middle with one value either side, so the eye went
out, in, out, in — once per row, forty times. It is a lovely idea about balance
and it fights the only thing a reader is doing, which is scanning a column.
Every comparison table worth copying puts labels on the left and values in
columns, and it does that because reading down a column is free and reading
across a gap is not.

### What replaced it

**Two product columns** carrying what a decision turns on: mark, name, tagline,
rating, review count, entry price, the plan ladder, a "Pick X if" list, and the
affiliate CTA. `margin-top: auto` on the actions puts both buttons on the same
line however many reasons or plans each side has.

**The plan ladder is new and it is the biggest omission the old page had.**
`pricing_plans` was in the catalogue all along and nothing rendered it: Sage has
two tiers at R240 and R435, Xero three at R450, R795 and R1 095. An entry price
is one number; what a business actually pays depends on the tier it lands on,
and that is the question every pricing page in the references exists to answer.

**A grouped matrix** — Ratings, What it costs, Features, Integrations, Support —
with a **sticky column header** and a **differences-only toggle**. Measured: 49
rows, 38 of which differ; the toggle drops 11 and `aria-pressed` follows. The
header stays at the top of the viewport 60% of the way down the page.

Three things the old table did not do, and each is why it read as a wall: the
names disappeared after one screen, forty rows sat in one flat alphabetical
list, and rows where both tick — which say nothing about which to buy — could
not be hidden.

### What was NOT copied from the references

All three are pricing pages with a **Most Popular** badge on the middle tier.
That is a vendor marking up its own plans. This page compares two vendors it
does not own, on a site whose claim is that placement is not for sale, so
neither column is recommended. What is marked instead is per row, in the
matrix, where the data actually says one leads — and only where it does: a
published price against "pricing on request" is scored as a tie, because that
is a comparison that cannot be made rather than a win for the one that
answered.

### The verdict shrank

It used to carry two paragraphs of reasoning under the centred statement. Those
facts now sit in the "Pick X if" list inside each column, beside the button they
argue for, where they can be scanned instead of read. Keeping them in the band
as well was the page making its case twice and burying its own headline under a
slab of sand. The band is one statement now, at `--section-2` instead of
`--section-3`.

### Derivation lives in lib, not the component

`lib/compare-matrix.ts`. The matrix is a client component because of the toggle,
and `SoftwareWithCategory` carries `description_full` — a page of HTML per
product. Passing two of those over the boundary to render a table of ticks
would ship the long-form review twice to draw forty rows. The client receives
the derived rows and nothing else.

### Cleanup

`CompareAxis`, `CompareFeatures` and `CompareStickyBar` are deleted rather than
left in the tree, along with 202 lines of their CSS. HANDOVER §3.8 is about
exactly this: `CompareDashboard` was orphaned during Phase 6 and is still
sitting there as a template for work nobody should copy. It is still orphaned —
worth deleting next time someone is in this area.

`CompareStickyBar` also used `backdrop-blur-xl`, which §12 bans outright. The
sticky column header replaces what it was for and does it at every width rather
than only below `lg`.

### Small fixes found on the way

- `buildReasons` lower-cased the feature name to fit its sentence, which turned
  "VAT201 preparation" into "vat201 preparation". The acronym is the part a
  South African bookkeeper scans for, so the name keeps its own case.
- The sticky header parks at `4rem`, not `4.5rem`. The docked nav capsule ends
  at 72px and matching that exactly leaves a 1–2px seam that row text slides
  through; overlapping by 8px closes it.

### The compare page gets the balance (2026-09-13)

The rebuild above was correct and plain. Two paper cards, hairlines, small
type — a well-set document rather than something that lands. The owner said
so, and they were right.

What was missing was not decoration. **This site invented a balance for the
hero and then did not put it on the page that IS a comparison.** Its signature
object was absent from the one page it was designed for, and the hero — which
only demonstrates a comparison — was carrying it alone.

So the two panels now hang from one. Same mechanism as the hero at page scale:
a single `--lean` in [-1, 1] drives the beam rotation, a counter-rotation per
rope so both hang plumb, and the two panel translations. Positive SINKS the
LEFT product: it is a weighing scale, and the heavier thing goes down.

**The tilt is the overall rating gap** — the same gap the first row of the
matrix prints — capped at half a point, level on a tie. It is not an effect;
it is the page reporting one number in the shape of the thing that measures it.

#### Two proportion lessons, both found by rendering

**Fractions of the width, not rem.** The hero rig is 5rem tall in a 512px
column. Reused verbatim at 1400px the beam became a 950px hairline and the
hangers splayed into a shallow tent whose feet missed the panels entirely.
Every dimension is now cqw: 12cqw of drop against a hanger half-span of about
7cqw puts the ropes near 30 degrees off vertical, which is what a hanging pan
looks like.

**And the instrument is capped at 70rem.** Even correctly proportioned, a
1px stroke reads as wire rather than beam past about 600px, and each card was
900px wide with sparse content stretched across it. At 70rem the beam is 576px
— the proportion the hero was tuned at — and the cards land near a reading
measure.

Measured: rope feet at 526 and 548, panel tops at 526 and 548 — welded to the
pixel, and again at 900px wide. Below 768 the rig is not drawn and the panels
sit level, which is the same rule the hero follows.

The leading side takes one 1px sand top edge, the identical mark the hero
panels use, so "this one is ahead" looks the same wherever it appears.
