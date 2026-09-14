# Handover — Indaba redesign, branch `redesign/v2`

Written 2026-09-08 at the end of the session that built Phases 0–6.

Companions: `docs/design/design-system.md` (the approved plan and its arithmetic) and
`docs/design/design-notes.md` (a long log of what was tried and rejected, phase by
phase). This file is the short version plus the things that will bite.

**Read §3 before writing any code.** Several items there are invisible to a
fresh session and two of them will waste an hour each.

---

## 1. Files created and modified

### Created

**Motion primitives** — four, which is the cap the brief sets.

| Path | What it is |
|---|---|
| `components/motion/springs.ts` | The whole motion vocabulary: two easings, two springs, three durations. |
| `components/motion/reduced-motion.ts` | `useReducedMotionSafe()`, which resolves `null` to `true` so the still state renders before the media query is known. |
| `components/motion/Tilt.tsx` | Pointer tilt plus idle sway, on a spring. Used by the hero scale only. |
| `components/motion/MaskReveal.tsx` | Line-by-line clip-path reveal. Takes `active` as a prop; it must not decide for itself. |

**Public components**

| Path | What it is |
|---|---|
| `components/public/Figure.tsx` | The number primitive. Every figure on the site goes through it. **Read its header comment before using it.** |
| `components/public/Rail.tsx` | `Rail` and `RailSection` — the structural rail every section is built on. |
| `components/public/Intro.tsx` | The page-load sequence, plus `IntroScript` (a blocking pre-paint script) and `introIsRunning()`. |
| `components/public/CategorySheet.tsx` | The categories mega-sheet. Click only, focus trapped, Escape returns focus. |
| `components/public/SearchProvider.tsx` | One `SearchDialog` for the site; the navbar and the hero field both open it. |
| `components/public/HeroScale.tsx` | The scale, its sand disc, and the two live vendor chips. |
| `components/public/VendorMarquee.tsx` | Seam-free logo marquee. Server Component. |
| `components/public/CompareTray.tsx` | `CompareProvider`, `useCompare`, `CompareToggle` and the docked tray. |
| `components/public/CompareAxis.tsx` | The compare page's centre axis. |
| `components/public/CompareFeatures.tsx` | Feature-by-feature table plus the two affiliate CTAs. |
| `components/public/CategoryResults.tsx` | Category listing: filter rail, sticky count, empty state. |
| `components/public/home/CategoryIndex.tsx` | Editorial category index with hover preview. |
| `components/public/home/TopRatedTable.tsx` | Top rated as a ranked table. |
| `components/public/home/HeadToHead.tsx` | A/B split cards. |
| `components/public/home/HowWeRate.tsx` | The three-step trust engine. |
| `components/public/home/Testimonials.tsx` | Pull-quote plus multi-column flow. |
| `components/public/home/Guides.tsx` | Lead article plus four. |

**Library**

| Path | What it is |
|---|---|
| `lib/queries/nav.ts` | `getNavCategories()` and `getNavFeaturedComparison()` for the mega-sheet. New module; no existing query contract was reshaped. |
| `lib/logo-mark.ts` | `hasBundledMark(slug)`. See §3.4 — this exists because of a real outage. |

**Docs**

`docs/design/design-system.md`, `docs/design/design-notes.md`, `docs/design/redesign-brief.md`, and this file.

### Modified

| Path | Change |
|---|---|
| `app/globals.css` | Rewritten in place, 1 433 → 3 106 lines. New token system, nav, load sequence, hero, sections, template pages. Section-numbered with the reasoning attached. |
| `app/layout.tsx` | `next/font` removed entirely; preconnect and preload for Switzer; `IntroScript` in `<head>`; `themeColor` now bone. |
| `app/(public)/layout.tsx` | Wraps the tree in `SearchProvider` and `CompareProvider`; renders `<Intro />`; fetches nav data. |
| `app/(public)/page.tsx` | Rebuilt around `RailSection`. |
| `app/(public)/compare/[pair]/page.tsx` | Centre axis, verdict band, `CompareFeatures`. |
| `app/(public)/category/[slug]/page.tsx` | Rail header, `CategoryResults`, checklist section. |
| `app/(public)/software/[slug]/page.tsx` | Header moved off centre onto the rail; charts repointed to series colours. |
| `app/(public)/blog/[slug]/page.tsx` | Newsletter band moved outside the container. |
| `components/public/Navbar.tsx` | Rebuilt: bare at rest, ink capsule on scroll, mega-sheet, mobile sheet. |
| `components/public/BrandLogo.tsx` | Single-colour wordmark, sand mark, weight 500, `data-logo-mark` hook. |
| `components/public/ThemeToggle.tsx` | Colour removed so it inherits (it was invisible on the ink capsule). |
| `components/public/Hero.tsx` | Rebuilt. Server Component; headline is server-rendered text. |
| `components/public/HeroSearch.tsx` | Opens the shared cmdk panel; still a real GET form. |
| `components/public/Footer.tsx` | Rebuilt: large wordmark, sitemap, market signals, affiliate disclosure. Newsletter form and `SparklesIcon` removed. |
| `components/public/NewsletterSection.tsx` | Full-bleed ink band on the rail. |
| `components/public/SectionHeader.tsx` | Keeps its name and four call sites; stops rendering the eyebrow pill, the accented word and the centring. |
| `components/public/SoftwareSidebar.tsx` | ALL-CAPS labels removed; add-to-compare added. |
| `lib/queries/reviews.ts` | **Appended only.** Adds `getFeaturedReviews()` and `pickVaried()`. Existing exports untouched. |
| `scripts/shoot.ts` | Rewritten from a hero-only rig to a seven-width, any-route audit. |
| `next.config.ts` | `images.formats = ["image/avif", "image/webp"]`. |
| `package.json` | Adds `motion` (resolved to **13.2.0**, not the 12 the brief names; `motion/react` re-exports framer-motion and every API used is unchanged). |
| `public/hero/comparison-scale.png` | **Replaced.** See §3.1. |

### Deleted

- `app/fonts/` and its three woff2 files (Inter, IBM Plex Mono ×2).

---

## 2. Finished vs half-done

### Working, screenshotted at seven widths in both themes

- **Phase 2 — tokens, Switzer, motion primitives.** The foundation the user
  has said to keep. Verified: the CDN font returns 200 and loads; the
  metric-matched fallback measures 487.7 against Switzer's 487.7, so the swap
  contributes no layout shift; the rendered page uses weights 400/500/600 only.
- **Phase 3 — navbar and load sequence.** Transparent at rest, contracts to an
  853px centred ink capsule on scroll, expands on scroll-up. The intro is in
  the server HTML, gone 977ms after DCL, never fires on a route change or a
  reload, and is absent for reduced motion and for a crawler.
- **Phase 4 — hero.** Disc bleeds off the right edge at 1024/1100/1200/1279/
  1280/1440/1536/1920 with zero page overflow, and never touches the search
  field. `6 196` renders with U+202F (verified by codepoint).
- **Phase 5 — home sections and the compare tray.** All 14 width/theme
  combinations report no sideways scroll. The tray was verified end to end
  including survival across a route change.

### Half-done

- **Phase 6.** Compare, category listing and product profile are rebuilt,
  typecheck clean, all routes 200 — **but they never got the seven-width
  screenshot pass** the earlier phases had. Only 390/768/1280/1920 in light.
  Dark mode on these three pages has not been looked at once.
- **Not started in Phase 6:** `/search`, `/blog` index, the legal pages,
  `/not-found.tsx`, and the admin retokenise pass.
- **Phase 7 entirely.** No responsive sweep at 125% scaling, no accessibility
  audit, no Lighthouse run. The brief's Definition of Done is unverified.

### Not started, and blocked

The user replaced the brief with a v2 that supersedes everything after Phase 2
and lists four things the old brief got wrong. **That file never reached the
disk** — `docs/design/redesign-brief.md` is byte-identical to the v1 committed at
`35efcf8`, and the root `REDESIGN-BRIEF.md` is 0 bytes. Do not guess at the
four corrections; ask for the file.

The user has also revoked autonomous running: **stop after every phase, show
screenshots at 1280 and 390, and wait for an explicit go.**

---

## 3. Things that will bite, which a fresh session will not discover

### 3.1 The hero asset is a placeholder I generated, not the real export

`public/hero/comparison-scale.png` is **1600×1280, 51.9KB**, drawn in
ink/sand/petrol only. The original — 316×303, with lime accents from the old
brand — is in git history and is recoverable.

The hero composition is tuned to this placeholder's proportions, specifically:
the drawing fills its canvas, and the pans sit at roughly 4–24% / 36–44% of
the frame (left) and 79–99% / 28–36% (right). `.hero-chip-left` and
`.hero-chip-right` are positioned from those measurements. **A replacement
export with different proportions will need those retuned.**

A related open question: with a *symmetric* scale the asset cannot literally
overlap the headline — the left pan sits ~345px right of where the headline
text ends, and closing that gap puts the figure over the search field, which
the brief forbids. Phase 4 resolved it by having the disc occlude instead. An
asymmetric asset would allow the literal reading.

### 3.2 `public/heroback.jpg` was NOT deleted, despite what the notes say

The Phase 4 commit message and `docs/design/design-notes.md` both state that this
2 MB unreferenced file was removed. **It is still there.** The command that
would have deleted it was chained ahead of a heredoc that failed to parse, so
bash never executed any of it, and the claim went into the commit message
anyway. It is unreferenced and safe to delete; the notes are simply wrong.

### 3.3 Next's image cache is at `.next/dev/cache/images`, not `.next/cache/images`

Replacing a file in `public/` does **not** invalidate the optimiser. After
swapping the hero asset the browser kept receiving the old 316×303 image for
two full rounds of debugging, with `naturalWidth` reporting 158 while the file
on disk was 1600 wide. Clearing the documented path does nothing in dev.

### 3.4 `software.logo_url` is null for every row — it is not the logo

Vendor marks resolve from `lib/logo-manifest.ts` **by slug**, inside
`SoftwareLogo`, which falls back to an initials chip. `logo_url` is the
admin's upload override and is null throughout the catalogue.

Filtering on it therefore silently returns an empty list, which is what took
the whole home page to a 500 during Phase 4. Use `hasBundledMark(slug)` from
`lib/logo-mark.ts`. 38 of 39 products have a real mark.

### 3.5 `<Figure>` must wrap the number, never the sentence around it

`word-spacing: -0.12em` cannot tell the gap inside `6 196` from the gap
between two words, so it closes both. This shipped **five times** and every
instance was caught in a screenshot rather than in review:

```
<Figure>{formatReviewCount(n)}</Figure>   ->  "414reviews"
<Figure>{price.amount}</Figure>           ->  "Pricingonrequest"
```

The rule and all three failure shapes are written at the top of
`components/public/Figure.tsx`. `startingPriceLabel()` returns `isCustom`
precisely so a caller can tell a price from a sentence.

### 3.6 Legacy colour tokens are repointed, not deleted — do not delete them yet

`--color-brand` and friends still resolve, to the new palette, so unmigrated
components render correctly. Live counts as of now:

```
color-brand        96 refs        brand-highlight   15 refs
color-star          8 refs        color-amber        6 refs
color-navy          1 ref
```

`glass-`, `hero-canvas`, `btn-shine` and `reveal-on-scroll` are down to **0
refs in components** and can be removed from `globals.css` safely. The others
cannot until the pages listed in §3.7 are migrated. Deleting them early blanks
half the site.

`.brand-highlight` is deliberately a no-op selector, not a deletion, because
`SectionHeader` still passes a `highlight` prop from several call sites.

### 3.7 These pages are still on the old design language

They render correctly — the token repointing repainted them — but they have
not been redesigned:

```
app/(public)/software/page.tsx          app/(public)/about/page.tsx
app/(public)/blog/page.tsx              app/(public)/contact/page.tsx
app/(public)/categories/page.tsx        app/(public)/search/page.tsx
app/(public)/compare/page.tsx           app/(public)/newsletter/*
app/(public)/software/[slug]/reviews/*  app/not-found.tsx
app/(public)/software/[slug]/alternatives/page.tsx
```

Plus the admin, which is a retokenise-only job — **do not touch its logic,
routing, or the `[resource]` CRUD.**

### 3.8 `components/public/CompareDashboard.tsx` is orphaned

Nothing imports it any more; `CompareFeatures` replaced it on the compare
page. It still exists and still carries the old blue/lime styling. Delete it
or port anything wanted from it, but do not leave it as a template for new work.

### 3.9 `ProfileNav` reads an attribute nothing sets

It reads `data-header-hidden` off `<html>`, which the old navbar set when it
translated away on scroll. The new navbar docks instead of hiding, so nothing
writes it. `ProfileNav` therefore always takes its header-visible offset —
which is the correct one — but the code reads as if it were dynamic and is not.

### 3.10 A stale `.next/dev/types` produces phantom TypeScript errors

`tsconfig.json` includes **both** `.next/types/**` and `.next/dev/types/**`.
Next 16 writes dev output to `.next/dev`, and a copy left from an older dev
run declares a different global `AppRoutes` union. The symptom is a route-type
error on a file nobody touched. Fix: `rm -rf .next/dev`, which regenerates.

### 3.11 The Switzer CDN URL is pinned in two places and fails silently

`app/globals.css` §2 (`@font-face` src) and `app/layout.tsx` (`<link
rel="preload">`) must stay in sync. Fetched and verified 2026-09-07. If
Fontshare ever rotates the path the request 404s, the site falls back to the
metric-matched Arial **permanently**, and nothing in the build catches it —
the CSS is valid, the build succeeds, and the only symptom is that the site is
set in Arial. Re-fetch from `https://api.fontshare.com/v2/css?f[]=switzer@1`.
Do not add a second `src` fallback: a font that degrades silently is worse
than one that fails visibly.

### 3.12 Screenshot rig gotchas

`scripts/shoot.ts` — run `npm run dev` first, then
`npx tsx scripts/shoot.ts /route --widths 1280,390 --theme light`.

- It measures **whether the window actually scrolls sideways**, not
  `scrollWidth > clientWidth`. Those disagree in both directions.
- It freezes `.reveal-line` during capture. A `fullPage` screenshot stitches
  the document at scroll 0, so every scroll-timeline reveal below the fold
  would otherwise be frozen clipped to nothing. **Headings look missing in raw
  full-page captures; that is the screenshot, not the page.**
- `data-bleed` on an element opts it out of the cut-content heuristic. The
  hero band uses it because its disc runs off the canvas by design.
- Base DPR is 1. `--scale 1.25` models Windows display scaling. At DPR 2 a
  full-page shot of the home page is a 3840×25000 bitmap and Chromium times
  out encoding it.

### 3.13 A dev server is still listening on port 3000

PID **28376** was left running. A second `npm run dev` will take port 3001 and
then exit with "Another next dev server is already running", which looks like
a crash and is not.

### 3.14 Memory is in an inconsistent state

`~/.claude/projects/e--Indaba/memory/stop-after-every-phase.md` was written,
but the session was interrupted before the pointer line was added to
`MEMORY.md` — **which does not exist at all.** The memory will not be loaded
into a future session until that index is created.

---

## 4. Suggested first moves

1. Get the v2 brief onto disk. Nothing after Phase 2 should be rebuilt until
   its four corrections are known, since they exist specifically to overturn
   decisions already made here.
2. Create `~/.claude/projects/e--Indaba/MEMORY.md` with a pointer to
   `stop-after-every-phase.md`, or that instruction is lost.
3. Delete `public/heroback.jpg` and correct the claim in `docs/design/design-notes.md`.
4. Confirm whether the real hero export is coming, since §3.1 governs how much
   of Phase 4 survives.
