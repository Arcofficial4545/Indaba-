# Indaba v2 — design plan

Phase 1 deliverable for `docs/design/redesign-brief.md`. Every number in here was
computed or measured, not estimated. Where this document departs from the
brief, the departure is marked **DEVIATION** and carries its arithmetic.

Companion file: `docs/design/design-notes.md` records what gets tried and rejected
during the build so later phases do not re-argue settled points.

---

## 1. Colour

### 1.1 The brand scale

Seven values. They are theme-independent constants: they never change meaning
between light and dark, only which semantic role points at them.

| Token | Hex | Role |
|---|---|---|
| `--bone` | `#EEEFE9` | Page ground in light. Type colour in dark. |
| `--paper` | `#F6F6F2` | Raised surface in light. Lifts by being *lighter* than the page, so no shadow is needed. |
| `--ink` | `#262626` | Type in light. Dark surface in both themes. |
| `--sand` | `#D1BD91` | The one warm accent. Fills, rules, rating marks, the hero disc. Never text on a light ground. |
| `--bronze` | `#7A5F31` | Sand-family *text*: links, hovers, small accented type. Light theme only. |
| `--petrol` | `#1E3A34` | The cool counterweight. Chart series B, secondary dark surfaces, "pro" markers. |
| `--brick` | `#9A3B2A` | Functional negative only. Cons, negative deltas. Never decorative. |

### 1.2 Measured contrast

Computed with the WCAG 2.x relative-luminance formula. Every ratio below is a
real calculation over the exact hex values, not a repeat of the brief's
estimates.

| Pair | Ratio | Verdict |
|---|---|---|
| `ink` on `bone` | **13.09** | AA / AAA |
| `ink` on `paper` | **13.97** | AA / AAA |
| `ink` on `sand` | **8.21** | AA / AAA |
| `bronze` on `bone` | **5.18** | AA (brief estimated 5.2 — confirmed) |
| `bronze` on `paper` | **5.52** | AA |
| `petrol` on `bone` | **10.62** | AA / AAA |
| `brick` on `bone` | **5.99** | AA (brief estimated 5.4 — actual is better) |
| `bone` on `ink` | **13.09** | AA / AAA |
| `sand` on `ink` | **8.21** | AA / AAA |
| `sand` on `petrol` | **6.67** | AA |
| **`sand` on `bone`** | **1.59** | **FAIL — confirms the brief's ban.** |

### 1.3 Muted text, derived

One muted step only. A second one always drifts under 4.5:1 the moment someone
uses it on `paper` instead of `bone`.

| Token | Value | Resolves to | On page ground |
|---|---|---|---|
| `--text-muted` (light) | `color-mix(in oklch, var(--ink) 70%, var(--bone))` | `#626261` | **5.27:1** ✅ |
| `--text-muted` (dark) | `color-mix(in oklch, var(--bone) 70%, var(--page))` | `#ADADA9` | **8.20:1** ✅ |

`ink 64%` computes to 4.40:1 and fails. `ink 66%` is 4.67:1 and passes. 70% is
chosen for headroom, because this token also lands on `paper` and inside the
ink band, and a token that only just passes on one surface is a token that will
fail on the next one someone uses it on.

### 1.4 Borders — DEVIATION

The brief mandates one border: `color-mix(in oklch, var(--color-ink) 12%,
transparent)`, 1px, everywhere. That computes to `#D6D7D2` on bone, which is
**1.25:1**.

That is correct and deliberate for decorative separation. It is not legal for a
form control: WCAG 2.2 SC 1.4.11 requires **3:1** for the boundary of a UI
component a user has to find and operate. Measured on bone:

```
ink 12%  1.25   ink 30%  1.83   ink 45%  2.62
ink 25%  1.64   ink 40%  2.31   ink 50%  2.98   ← still short
ink 55%  3.41   ✅ first value that clears 3:1
```

So there are **two** border tokens, and the second one is rationed hard:

| Token | Value | Used on |
|---|---|---|
| `--border` | `ink 12%` | Every decorative rule, card edge, table row, section divider. This is the brief's single border weight and it is the default. |
| `--border-control` | `ink 55%` (`#8A8B88`→`#80807E`, 3.41:1) | **Only** the outline of something you operate: text inputs, checkboxes, radio, the compare-tray controls, the segmented compare selector. |

The Definition of Done asks for Lighthouse Accessibility 100. A 1.25:1 checkbox
outline does not get there, so this is not an aesthetic preference.

### 1.5 The rating bar — DEVIATION

§11.7 specifies "rating bar in sand". A sand fill on `bone` is 1.59:1 and on
`paper` is **1.70:1**. On the top-rated table it would be very close to
invisible, and at a glance the table would look like it had empty cells.

Resolution, which keeps sand and stays legal:

- Track: `--border` (ink 12%) on `paper`.
- Fill: `sand`, with a 1px `bronze` edge on the fill's leading side so the bar
  has a findable boundary.
- **The numeric rating is always set adjacent in tabular figures.** The bar
  reinforces a number that is already stated as text, so it is decoration, not
  the sole carrier of information (WCAG 1.4.1). That is what makes the low fill
  contrast acceptable rather than a defect.

Flagged for a visual check at Phase 5. If it still reads weak in a screenshot,
the fill goes to `bronze` and sand moves to the sponsored-slot highlight only.
That decision gets recorded in `docs/design/design-notes.md` rather than reopened.

### 1.6 Dark theme — the gap the brief leaves

The brief gives the dark theme as: page `#141413`, surface `#262626`, type
`bone`, links `bronze` → `sand`. Measured, that swap is necessary and
sufficient for links:

```
bronze on #141413   3.08   FAIL
sand   on #141413  10.01   ✅   ← confirms the brief
```

But `petrol` and `brick` are also specified as *text* roles ("pro" markers,
cons, negative deltas) and neither survives the inversion:

```
petrol #1E3A34 on #141413   1.50   FAIL
brick  #9A3B2A on #141413   2.66   FAIL
```

So each gets exactly one dark-theme sibling. These are dark-only; they are
never used on a light ground.

| Token | Light | Dark | Dark ratio on `#141413` |
|---|---|---|---|
| accent text | `bronze` `#7A5F31` | `sand` `#D1BD91` | 10.01 ✅ |
| cool / "pro" text | `petrol` `#1E3A34` | `#63A192` | 6.18 ✅ |
| negative text | `brick` `#9A3B2A` | `#D2755F` | 5.66 ✅ |

`petrol` and `brick` keep their original values as **surfaces and chart fills**
in both themes. Only their text role swaps. Nine hex values total across both
themes, which is still a small palette.

### 1.7 Token architecture

Two layers, and components may only ever touch the second one.

```
LAYER 1  brand constants, theme-independent
         --bone --paper --ink --sand --bronze --petrol --brick
         --petrol-lift --brick-lift            (dark-theme text siblings)

LAYER 2  semantic roles, swapped by the .dark class
         --surface-page      bone          →  #141413
         --surface-raised    paper         →  #262626
         --surface-ink       ink           →  ink          (unchanged)
         --text              ink           →  bone
         --text-muted        ink 70%       →  bone 70%
         --text-accent       bronze        →  sand
         --text-negative     brick         →  brick-lift
         --text-cool         petrol        →  petrol-lift
         --border            ink 12%       →  bone 14%
         --border-control    ink 55%       →  bone 40%     (3.47:1 ✅)
         --focus             bronze        →  sand
```

Declared in `globals.css` under Tailwind v4 `@theme`. Components address
`--color-surface-raised`, never `--sand`. If a colour is not in Layer 2, a
component cannot reach it.

### 1.8 Why `petrol` survives as the counterweight

The brief invites a better cool anchor. I am keeping petrol, for a reason worth
recording: the obvious alternative is a blue, and §13 rejects the blue-SaaS read
outright. Petrol is a *green* cool — it separates from sand by 6.67:1, gives the
distribution charts a second series that is legible on both grounds, and reads
as ledger green rather than dashboard blue. It breaks the beige without walking
into the cluster the brief is trying to escape.

### 1.9 Rationing

- **Ink surfaces per page: three.** The docked nav capsule, the footer, and one
  full-bleed band. On home that band is the newsletter. Nothing else.
- **Shadows: none by default.** Elevation is `paper` + `--border`. Two shadow
  levels exist as tokens for the two things that genuinely float above the
  document and must not be mistaken for part of it: the docked nav capsule and
  the compare tray. Cards never get one.
- **Gradients: none.** The single exception is `box-shadow: inset 0 1px 0
  rgb(255 255 255 / .14)` on the ink capsule and ink buttons. That is an inner
  highlight, not a wash, and the distinction holds site-wide.

---

## 2. Typography

### 2.1 Face — decision, with the delivery route resolved

**Switzer variable, roman, one file, served from `cdn.fontshare.com`.**

Measured rather than assumed:

| | Bytes |
|---|---|
| Switzer **variable** roman woff2, full 100–900 axis | **43,220** |
| Switzer static 400 woff2 | 16,728 |
| Three statics (400/500/600) | ~50,000 |

The variable file is *smaller* than the three statics it replaces and it is the
only option that can actually animate the 400 → 500 nav hover the brief
specifies. One file, one request. Decided; no mixing.

**DEVIATION on the delivery mechanics.** The brief says to load Fontshare's CSS
route with a `preconnect`. That route puts the `@font-face` rules on
`api.fontshare.com` and the font binary on `cdn.fontshare.com` — two origins,
two DNS+TLS handshakes, and a render-blocking stylesheet in front of the LCP
element. Instead:

- The `@font-face` block is written directly into `globals.css`, pointing
  straight at the `cdn.fontshare.com` woff2 URL.
- `<link rel="preconnect" href="https://cdn.fontshare.com" crossorigin>` in the
  root layout. One origin.
- `font-display: swap`.

This still serves from Fontshare, so the ITF licence position the brief relies
on is unchanged — nothing is redistributed from this repo. It removes one
origin and one render-blocking request from the critical path, which the LCP
budget in §16 needs.

The existing `app/fonts/` local files and `next/font/local` setup are deleted:
Inter and IBM Plex Mono both go. The repo's hermetic-build convention (never
`next/font/google`) is preserved, because nothing here resolves a font at build
time.

### 2.2 Fallback, metric-matched

Measured in a real browser at 100px, string `Hxpg 6196`:

| Face | Width | Ascent | Descent |
|---|---|---|---|
| Switzer | 487.70 | 98 | 25 |
| Arial | 483.70 | 91 | 21 |

So the fallback is tuned rather than guessed:

```css
@font-face {
  font-family: "Switzer Fallback";
  src: local("Arial"), local("Helvetica");
  size-adjust: 100.83%;      /* 487.70 / 483.70 */
  ascent-override: 97.2%;    /* 98 / 100.83 */
  descent-override: 24.8%;   /* 25 / 100.83 */
  line-gap-override: 0%;
}
```

A 0.83% width error across the whole hero headline is not a visible reflow.
This is what keeps CLS at 0 while `font-display: swap` is on.

### 2.3 Figures — a finding that changes the plan

Switzer's digits are **already tabular by default**. Measured advance at 100px:

```
0 1 2 3 4 5 6 7 8 9  →  57.6 57.6 57.6 57.6 57.6 57.6 57.6 57.6 57.6 57.6
```

All ten identical. So `font-variant-numeric: tabular-nums` is a no-op in
Switzer. It stays on the `.data` class anyway, as a guarantee that holds during
the swap period when the Arial fallback (which is *not* tabular) is painting.
That is precisely the moment a comparison table would visibly jitter, so the
declaration earns its place.

`lib/format.ts` already solves the "6 196" problem correctly — it substitutes
U+202F (narrow no-break space) for the U+00A0 that `Intl.NumberFormat('en-ZA')`
emits. That work is kept as-is. What the brief additionally asks for is the
render-side half, which does not exist yet:

```css
.data {
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  word-spacing: -0.12em;
}
```

Delivered as one `<Figure>` primitive so no call site can forget it, and used
for every number on the site.

### 2.4 Scale — with one added step

| Step | Size | Leading | Tracking | Weight | Used for |
|---|---|---|---|---|---|
| `display-xl` | `clamp(3rem, 7.5vw, 7.5rem)` | 0.92 | -0.035em | 500 | **Full-bleed only**: footer wordmark, 404. |
| `display-hero` | `clamp(2.5rem, 5.2vw, 4.75rem)` | 0.94 | -0.032em | 500 | The hero headline. **Added — see below.** |
| `display-l` | `clamp(2.25rem, 4.5vw, 4rem)` | 0.98 | -0.030em | 500 | The one pull-quote, the compare verdict. |
| `h2` | `clamp(1.75rem, 2.6vw, 2.75rem)` | 1.05 | -0.020em | 500 | Section headings. |
| `h3` | `1.375rem` | 1.20 | -0.010em | 500 | Sub-headings, card titles. |
| `body` | `1.0625rem` | 1.60 | 0 | 400 | Copy. Max 68ch. |
| `small` | `0.875rem` | 1.45 | 0 | 400 | Labels, meta, rail text. |
| `data` | inherit | — | — | 500 | Every figure. Tabular, nowrap, `word-spacing: -0.12em`. |

Weights: **400, 500, 600 only.**

**DEVIATION — why `display-hero` exists.** §10 asks for the hero headline at
`display-xl`, left-aligned, in roughly six columns, three lines maximum. Those
four constraints cannot all hold. The arithmetic:

```
container-site           max-width 1440, padding-inline 3rem at ≥1024
viewport 1280            inner width 1184px
headline well, 7 of 12   ≈ 691px
display-xl at 1280       7.5vw = 96px
Switzer advance          0.54em avg, minus 0.035em tracking = 0.505em
per character at 96px    48.5px
characters per line      691 / 48.5 = 14.2
three lines              ≈ 43 characters, and no line may exceed 14
```

"Business software," alone is 18 characters and needs 873px. The brief's own
headline is 53 characters. At `display-xl` in a 7-column well it sets in four to
five lines, not three. The clamp is tuned for a headline that spans the page,
which is what it now does — the footer wordmark.

`display-hero` at `clamp(2.5rem, 5.2vw, 4.75rem)` gives 66.6px at 1280,
33.6px per character, **20.6 characters per line**. Because the well and the
type both scale with `vw`, that character count is near-constant from 1024 to
1920, so the headline holds three lines across the whole desktop range:

```
1024   53.2px type / 560px well  →  20.8 ch per line
1280   66.6px type / 691px well  →  20.6 ch per line
1920   76.0px type (capped) / 790px well  →  20.6 ch per line
```

The gain from this is that **the existing headline survives**:

```
South African          (13)
business software,     (18)
weighed in the open.   (20)
```

Three lines, every line inside 20.6 characters. Cutting "South African" out of
the hero of a site whose entire proposition is South African, in order to fit a
clamp that was tuned for a different measure, would be the wrong trade.

Below 1024 the hero stacks and the headline runs full width at 40px, setting in
four lines on a 390px screen. "Three lines maximum" is read as a desktop
composition rule, which is where the occlusion it protects actually happens.

### 2.5 Bans, enforced

None of these appear anywhere. All six are present in the current build and all
six are removed:

- Tracked-out ALL-CAPS eyebrows. The `SectionHeader` `eyebrow` prop is deleted,
  not just left unused, along with the "Independent · Cape Town, South Africa"
  string.
- One-word headline accenting. `SectionHeader`'s `highlight` prop is deleted —
  it is used on every section of the current home page.
- Middle-dot meta strings.
- `WORD — fragment` labels with a spaced em dash. (The repo already forbids em
  dashes in editorial copy; this extends it to labels.)
- Monospace for data labels. IBM Plex Mono is removed from the project.
- `→` in button and link text.

Serif display type of any kind is banned and there is none: Switzer is the only
family on the site.

---

## 3. Layout DNA

### 3.1 The rail

12 columns, 24px gutter, inside `container-site` (max-width 1440, padding 1rem
/ 2rem / 3rem). One structural rail on the left of every section on every page.

```
cols 1–2     RAIL     ~177px at 1280.  Section label (sentence case, small,
                      text-muted) and a live count in tabular figures. Sticky
                      to the top of its own section on ≥1024.
cols 3–12    WELL     ~983px.  Default content width.
cols 3–9     MEASURE  ~683px.  Prose. 68ch at 17px Switzer = 666px. Fits.
```

Below 1024 the rail unstacks into a single row above the well: label left,
count right, `--border` hairline under it. It never disappears, because the
count is evidence and evidence is the point.

The rail is what makes every section header a statement of fact rather than a
marketing label, and it is the one element that repeats on every page and every
template. It replaces the eyebrow it is not allowed to be.

### 3.2 Comparison as structure

The two-pan logic is layout, not iconography:

- **Compare page** splits on a true centre axis, one shared row rhythm, so the
  eye tracks horizontally across matched rows rather than reading two stacked
  columns.
- **Head-to-head cards** on home are split A|B across a vertical rule. Never
  stacked.
- **The compare tray** docks to the bottom of the viewport the moment a second
  product is selected anywhere on the site, and survives route changes. State
  lives in `sessionStorage` plus a small React context in the `(public)`
  layout — no new state manager, per §15.

### 3.3 Radii and rhythm

| Value | Applied to |
|---|---|
| `999px` | Buttons, chips, the search field, the nav capsule, tray controls. |
| `14px` | Cards, panels, sheets, the mega-sheet. |
| `0` | Full-bleed bands, table cells, the hero disc's straight edge. |

Section rhythm on an 8px base, four steps, all clamped:

```
--section-1  clamp(4rem,   8vw,  6rem)    96px    tight pairs
--section-2  clamp(5rem,  10vw,  8rem)   128px    default between sections
--section-3  clamp(6rem,  12vw, 10rem)   160px    before a major shift
--section-4  clamp(7rem,  14vw, 12rem)   192px    around the full-bleed band
```

Applied as `padding-block` on the `<section>` only. Element-level spacing uses
margin exclusively, so the two systems can never cancel — that specificity
collision is called out in the brief and this is the rule that prevents it.

---

## 4. Wireframes

### 4.1 Home

```
┌───────────────────────────────────────────────────────────────────────────┐
│ Indaba      Software  Categories  Compare  Guides  About    ( List yours ) │  no background
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  South African                              ......................        │
│  business software,                       ....  sand disc, flat,  ....    │
│  weighed in the o̲p̲e̲n̲.  ←── the scale occludes  bleeds off the right ..     │
│                                          ..        ▲                ..    │
│  Independent reviews from South          ..    ════╪════            ..    │
│  African businesses, every price         ..   [Xero]  [Sage]        ..    │
│  in rands with VAT shown, and no          ..   live vendor chips   ..     │
│  vendor can buy a ranking.                  ....              ....        │
│                                                ..................         │
│  ╭──────────────────────────────────────────╮                             │
│  │ ⌕  payroll that submits EMP201 to SARS ⌘K│  paper · pill · 1px         │
│  ╰──────────────────────────────────────────╯                             │
│  (Accounting) (Payroll) (HR) (CRM) (ERP) (Project management)             │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────┤
│  ‹ sage · xero · simplepay · payspace · odoo · monday · asana · pipedri… › │  marquee
├───────────────────────────────────────────────────────────────────────────┤
│      6 196              │            39             │          6          │
│      reviews            │          products         │      categories     │  hairlines
├───────────────────────────────────────────────────────────────────────────┤
│ RAIL          │ WELL                                                      │
│ Categories    │  Accounting Software        9    [x][s][q]  ┐             │
│ 6             │ ─────────────────────────────────────────   │  hovering   │
│               │  Payroll Software           7    [s][p][p]  │  a row      │
│               │ ─────────────────────────────────────────   │  previews   │
│               │  HR Software                6    [b][z][p]  │  its top    │
│               │ ─────────────────────────────────────────   │  product    │
│               │  CRM Software               7    [h][p][z]  │  in the     │
│               │ ─────────────────────────────────────────   │  right      │
│               │  ERP Software               5    [o][s][d]  │  column     │
│               │ ─────────────────────────────────────────   │             │
│               │  Project Management         5    [m][a][c]  ┘             │
├───────────────────────────────────────────────────────────────────────────┤
│ How we rate   │  1   Reviews are verified                                 │
│ 3 steps       │      Named reviewer, company, LinkedIn check.  6 196 live │
│               │ ─────────────────────────────────────────────────────────  │
│               │  2   Prices are checked in rands                          │
│               │      Every figure carries a source URL and a date.        │
│               │ ─────────────────────────────────────────────────────────  │
│               │  3   Ranking is a weighted average                        │
│               │      Bayesian, trigger-computed. Sponsorship buys a label,│
│               │      never a position.        ────△────  small flat scale │
├───────────────────────────────────────────────────────────────────────────┤
│ Head to head  │ ┌─────────────┬─────────────┐  ┌─────────────┬───────────┐│
│ 3 pairs       │ │ Sage        │ Xero        │  │ SimplePay   │ PaySpace  ││
│               │ │ 4.3   R240  │ 4.5   R310  │  │ 4.6   R 20  │ 4.4  R…   ││
│               │ └─────────────┴─────────────┘  └─────────────┴───────────┘│
│               │            ↑ split on a real axis, never stacked          │
├───────────────────────────────────────────────────────────────────────────┤
│ Top rated     │  #  Product          Rating          Reviews   From    ☐  │
│ 39 ranked     │ ───────────────────────────────────────────────────────── │
│               │  1  [◨] SimplePay    4.6 ▰▰▰▰▱          412   R20    ☐   │
│               │  2  [◨] Xero         4.5 ▰▰▰▰▱          389   R310   ☐   │
│               │  3  [◨] Sage Acc.    4.3 ▰▰▰▰▱          356   R240   ☐   │
│               │      ↑ a table, not cards. ☐ fills the compare tray.      │
├───────────────────────────────────────────────────────────────────────────┤
│ In their own  │  "We moved off spreadsheets in a weekend and              │
│ words         │   the EMP201 just submitted."          ← display-l        │
│ 6 196 reviews │                                                           │
│               │  ┌────────────┐ ┌──────────────────┐ ┌──────────┐         │
│               │  │ short quote│ │ longer quote here│ │ short    │  ← staggered
│               │  └────────────┘ └──────────────────┘ └──────────┘    widths│
├───────────────────────────────────────────────────────────────────────────┤
│ Guides        │ ┌───────────────────────────┐ · VAT201 without a bookkeeper│
│ 6 published   │ │  LEAD ARTICLE             │ · Payroll for 1–10 staff     │
│               │ │  title at h2              │ · What ERP actually costs    │
│               │ └───────────────────────────┘ · Moving off Pastel          │
├───────────────────────────────────────────────────────────────────────────┤
│                        THE ONE INK BAND — newsletter                      │
│  One email a month. Price changes and new reviews. Double opt-in.         │
│  ╭────────────────────────────╮ ( Subscribe )     ← left-aligned on rail  │
├───────────────────────────────────────────────────────────────────────────┤
│  I N D A B A                              display-xl wordmark, ink footer │
│  Software   Categories   Company   Legal                                  │
│  South Africa · ZAR · VAT 15%   ← from lib/site.ts                        │
└───────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Category listing

```
┌───────────────────────────────────────────────────────────────────────────┐
│ Payroll Software                                                          │
│ 7 products, 1 284 reviews, prices verified 12 August 2026                 │
├──────────────┬────────────────────────────────────────────────────────────┤
│ FILTER RAIL  │  7 products            Sorted by rating ▾   ☰ Grid │ List  │ ← sticky summary
│ cols 1–3     │ ───────────────────────────────────────────────────────── │
│              │  [◨] SimplePay                          4.6  ▰▰▰▰▱   ☐    │
│ Price        │       Cloud payroll, EMP201 + IRP5           412 reviews  │
│ ☐ Free       │       From R20/employee/mo, excl. VAT                     │
│ ☐ Under R500 │ ───────────────────────────────────────────────────────── │
│ ☐ R500–2000  │  [◨] PaySpace                           4.4  ▰▰▰▰▱   ☐    │
│              │       …                                                   │
│ Rating       │ ───────────────────────────────────────────────────────── │
│ ☐ 4.5+       │                                                           │
│ ☐ 4.0+       │  Filters live in the query string, never in state, so     │
│              │  every view is linkable and the back button is correct.   │
│ Free trial   │                                                           │
│ ☐ Yes        │  EMPTY STATE: "No payroll product under R500 also files   │
│              │  EMP201. Widen the price filter, or tell us what you're   │
│ ( Clear 3 )  │  looking for."     ( Clear price )  ( Suggest a product ) │
└──────────────┴────────────────────────────────────────────────────────────┘
```

### 4.3 Product profile

```
┌───────────────────────────────────────────────────────────────────────────┐
│ Home / Payroll Software / SimplePay                                       │
├────────────────────────────────────────────────┬──────────────────────────┤
│ [◨] SimplePay                                  │  STICKY SUMMARY RAIL     │
│ Cloud payroll for South African businesses     │  ┌────────────────────┐  │
│                                                │  │ 4.6  ▰▰▰▰▱         │  │
│ 4.6 out of 5   412 reviews   Payroll Software  │  │ 412 reviews        │  │
│                                                │  │                    │  │
│ ┌─── screenshot carousel ───────────────────┐  │  │ From R20           │  │
│ │  3 of 7                                   │  │  │ per employee/mo    │  │
│ └───────────────────────────────────────────┘  │  │ excl. VAT          │  │
│                                                │  │ verified 12 Aug    │  │
│ Overview ─────────────────────────────────────  │  │                    │  │
│ prose at 68ch                                  │  │ ( Visit SimplePay )│  │
│                                                │  │ ☐ Add to compare   │  │
│ Pricing ──────────────────────────────────────  │  │                    │  │
│ Plan      Price      VAT        Per            │  │ Affiliate link.    │  │
│ Basic     R20        excl.      employee/mo    │  │ We may earn a fee. │  │
│ …                                              │  └────────────────────┘  │
│                                                │                          │
│ Ratings ──────────────────────────────────────  │                          │
│ Ease of use      4.7  ▰▰▰▰▰   petrol/sand      │                          │
│ Value            4.5  ▰▰▰▰▱   two series       │                          │
│ Support          4.4  ▰▰▰▰▱                    │                          │
│                                                │                          │
│ Features · Integrations · FAQs · Alternatives  │                          │
│ Reviews (412) + submission form                │                          │
└────────────────────────────────────────────────┴──────────────────────────┘
   JSON-LD: Product + AggregateRating + Review + FAQPage + BreadcrumbList
```

### 4.4 Compare

```
┌───────────────────────────────────────────────────────────────────────────┐
│                          SimplePay  vs  PaySpace                          │
├─────────────────────────────┬─┬───────────────────────────────────────────┤
│         [◨] SimplePay       │ │       [◨] PaySpace                        │  ← sticky header row
│         4.6   412 reviews   │ │       4.4   287 reviews                   │
├─────────────────────────────┼─┼───────────────────────────────────────────┤
│ Starting price              │ │                                           │
│ R20 /employee/mo  excl. VAT │▮│ R25 /employee/mo  excl. VAT               │  ▮ = the axis
│                             │ │                                           │
├─────────────────────────────┼─┼───────────────────────────────────────────┤
│ EMP201 submission           │ │                                           │
│ Yes                         │▮│ Yes                                       │
├─────────────────────────────┼─┼───────────────────────────────────────────┤
│ Free trial                  │ │                                           │
│ 30 days              ◂ sand │▮│ None                                      │  ← difference highlighted
├─────────────────────────────┴─┴───────────────────────────────────────────┤
│  WHAT TO PICK                                                             │
│  Under 50 staff and you file your own EMP201: SimplePay, on price and     │
│  on the trial. Over 200 staff or multi-country: PaySpace.                 │
│  display-l, ink on sand block. The only centred text on the site.         │
└───────────────────────────────────────────────────────────────────────────┘
   Rows share one rhythm, so the eye tracks across rather than reading
   two stacked columns. This is the brand thesis as a layout.
```

---

## 5. Motion inventory

Easings and durations exactly as §7 specifies. Spring `{ stiffness: 220,
damping: 26 }`.

| # | Animation | Trigger | Duration | Reduced motion |
|---|---|---|---|---|
| 1 | Load sequence, four beats | First full page load, once per session | ≤1200ms | Skipped entirely |
| 2 | Hero headline lines reveal under a `clip-path` mask, 60ms stagger | Beat 3 of #1 | 700ms | Final state at 0ms |
| 3 | Scale settles on its spring, one 2° overshoot | Beat 4 of #1 | spring | Final state at 0ms |
| 4 | Scale tilts ±3° tracking the pointer | `pointermove` in the hero | spring | Not bound |
| 5 | Scale idle sway, 0.8° amplitude | No pointer for 2s; stops on pointer | 6s loop | Not bound |
| 6 | Vendor chips swap on the pans, beam settles to a new angle | 4s interval | spring | Static pair, no swap |
| 7 | Sand disc parallax, 20px of travel | Scroll. CSS `animation-timeline: view()` behind `@supports`, no JS | scroll-linked | Not bound |
| 8 | Search placeholder cross-fades behind a mask wipe | 3.5s interval | 320ms | Static placeholder |
| 9 | Nav contracts to the ink capsule via `layout` animation | Scroll past 80px; reverses on scroll-up | spring | Instant swap, no layout animation |
| 10 | Nav link hover: `wght` 400→500 plus an underline drawn from the left | `:hover` / `:focus-visible` | 160ms | Underline only, no weight shift |
| 11 | Press `scale(0.98)` | `:active` on buttons and links | 120ms | Not bound |
| 12 | Categories mega-sheet `clip-path` reveal from the top edge | Click. Never hover | 320ms | Instant open |
| 13 | Mobile sheet, items stagger at 40ms | Click | 320ms | Instant, no stagger |
| 14 | Compare tray docks in and out | Second product selected / tray cleared | 320ms | Instant |
| 15 | Vendor logo marquee, continuous translate | Always. Pauses on hover | 40s loop | Becomes a static row |
| 16 | Stats count up | Viewport entry, once | 700ms | Final figures at 0ms |
| 17 | Section heading **first line only** reveals under a mask | Viewport entry | 700ms | Final state at 0ms |
| 18 | Accordion / FAQ expand | Click | 320ms | Instant |
| 19 | cmdk panel opens | `⌘K` or search focus | 320ms | Instant |

Transform, opacity and `clip-path` only. Nothing animates `width`, `height`,
`top` or `left`. Every animated element is present and correct in the
server-rendered HTML; if JavaScript never runs, the page reads and ranks.

**How this satisfies "one orchestrated moment per viewport".** §7 rule 1 and
§10 pull against each other — §10 asks for sway, chip swaps, a placeholder
cross-fade, a marquee and a count-up, all in the top two viewports. Read
together: **the hero band is the one moment**, and items 2–8, 15 and 16 are its
component parts, not nine separate decisions. Everything below that band gets
exactly one non-user-triggered animation, #17, and it touches the first line of
the heading only. No section fades up. No card lifts on hover.

Items 4, 5, 7 and 11 are deliberately not bound to `prefers-reduced-motion`:
they are either pointer-driven (a direct response to a user action, which rule 2
welcomes) or, in the case of #7, a 20px scroll-linked translate that carries no
vestibular risk. Every automatic animation is bound.

---

## 6. What stops this looking like every other directory

**The rail.** Every section on every page opens with a live count in tabular
figures sitting in a fixed left-hand column. It is the site telling you the size
of its own evidence before it tells you anything else, and it is the element
that repeats often enough to become the layout's signature.

**The page is built out of the comparison it sells.** Top-rated is a ranked
table where a directory would put cards; the category index is an index with
vendor logos where a directory would put six icon tiles; head-to-heads split
across a real axis; and a compare tray follows you across routes. The structure
argues the product rather than describing it.

**One moving object above the fold, and it is the thing the brand is named
for.** Everything else holds still.

---

## 7. Self-critique

The test the brief sets: write down what "modern professional software
directory, warm neutral palette" would produce, then delete anything in the plan
that matches.

**What the generic prompt produces:** a centred hero with a big headline and a
search bar under it; three feature cards with lucide icons; a 3-up grid of
product cards with identical rounded corners and identical soft shadows; a
testimonial carousel; a dark full-width CTA band with a centred email input; a
four-column footer. Cream background, high-contrast display type, a warm accent
on the buttons, `rounded-2xl` everywhere, and a fade-up-on-scroll on every
section.

Six things in my first pass matched that output. All six are changed:

| Default I had written | What it is now | Why |
|---|---|---|
| "How Indaba rates" as three numbered cards in a row | Three **rows** on the rail: numeral in the rail, claim in the well, and a real figure as evidence in each | Three cards in a row is the single most generic section shape in existence. Rows on the rail also match the rest of the page, so the section stops being an island. |
| `CategoryIcon` (lucide) on each category row | The **top three vendor logos** for that category, pulled live | An icon is a decoration that says "category". Three real logos are evidence that says "these nine products are in here". The brief asks for this and I had defaulted away from it. |
| Newsletter band with a centred heading and centred input | Left-aligned on the same rail as everything else | A centred CTA band is the tell. The brief allows one centred element per page and I am spending it on the compare verdict, which is genuinely a single focal statement. |
| Testimonials as equal-width quote cards | One `display-l` pull-quote plus dense, unequal-width smalls | Equal cards in a row is the carousel shape with the carousel removed. Staggered widths force real editorial hierarchy. |
| Fade-up reveal on every section | First heading line only, masked (#17) | This is the machine-generated signature the brief names outright. |
| Hover-lift plus shadow on cards | No lift, no shadow. Elevation is `paper` + a 1px border; hover moves the border and the link underline only | "Same soft grey shadow under every card" is called out in §4 as a template tell. |

**Two things I am keeping despite the resemblance**, with reasons:

- **Search under the headline.** It matches the generic shape, but on a
  directory search *is* the product, and the differences are real: it sits in an
  asymmetric column rather than centred, it is the same cmdk implementation as
  `⌘K` rather than a decorative input, and the chips under it come from live
  category data.
- **Count-up on the stats.** Brief-mandated, and a default. Mitigated by
  presentation — plainly typeset figures on the bone separated by hairlines,
  never floating cards — and by scarcity: it is the only count-up on the site.

**§19, the one thing to remove.** The strongest candidate is the search
placeholder cross-fade (#8). It puts a second automatic animation in the same
viewport as the scale for very little return, and the hero's whole argument is
that one object moves. It stays in the plan for now because §10 asks for it
explicitly, but it is the first cut at Phase 7, decided against a screenshot
rather than in the abstract.

---

## 8. What Phase 0 found that changes the work

Four things worth carrying forward:

1. **The working tree was already clean.** The in-flight work §2.4 warns about
   is committed at `93d4326`. Nothing was stashed; `redesign/v2` branches off a
   clean `main`, and `npm run typecheck` passes on it as a baseline.

2. **The hero asset carries the old brand lime.** `comparison-scale.png` is a
   dark charcoal balance scale whose icon accents are `#E7FE9A`/`#D9F65F` — the
   lime this redesign deletes. 1 224 accent pixels. It cannot ship as-is against
   bone and sand. **Plan:** remap the lime accents to `sand` with a small
   scripted pass at Phase 4, writing a new asset alongside the original rather
   than over it, and generate the AVIF/WebP variants §16 asks for at the same
   time.

3. **The asset is 316×303px.** It has clean alpha (64 642 fully transparent,
   6 446 partial, bbox 2,2→313,300) and the linework is dark, so it will sit
   correctly on a light sand disc in both themes exactly as §10 predicts. But at
   the ~560px display width the composition wants, it is being upscaled 1.8×.
   **Plan:** cap its rendered width and let the sand disc carry the scale of the
   composition instead. This is also why the disc must genuinely bleed off the
   canvas rather than being a circle sized to the image.

4. **There is no `public/brand/`.** The wordmark gets built in Switzer inside a
   single `<Logo />` component, so a supplied SVG drops in later without
   touching the navbar, the footer or the load sequence — all three of which
   reference the same component and the same `layoutId`.

---

## 9. Deviations, collected

Every departure from the brief, in one place, for approval:

| § | Brief says | Plan does | Why |
|---|---|---|---|
| 4 | One border, `ink 12%`, site-wide | Adds `--border-control` at `ink 55%` for operable controls only | `ink 12%` is 1.25:1. WCAG 1.4.11 needs 3:1 on a control boundary, and the DoD asks for Accessibility 100. |
| 4 | Dark theme is a four-line swap | Adds `petrol-lift` `#63A192` and `brick-lift` `#D2755F` as dark-only text siblings | `petrol` is 1.50:1 and `brick` is 2.66:1 on `#141413`. Both are specified as text roles; neither survives the inversion. |
| 5 | Serve Switzer via Fontshare's CSS route | Inlines the `@font-face` in `globals.css` pointing at the same `cdn.fontshare.com` file; preconnects one origin | The CSS route adds a second origin and a render-blocking stylesheet in front of the LCP element. Nothing is redistributed, so the licence position is unchanged. |
| 5 | Hero headline at `display-xl` | Adds `display-hero`, `clamp(2.5rem, 5.2vw, 4.75rem)` | `display-xl` in a 7-column well sets the headline in 4–5 lines, not 3. `display-xl` is kept for the full-bleed uses it was tuned for. |
| 11.7 | Rating bar in sand | Sand fill, `ink 12%` track, 1px `bronze` edge, numeric value always adjacent | Sand on paper is 1.70:1. The adjacent figure is what makes it legal under 1.4.1 rather than a defect. |

Everything else in the brief is followed as written.

---

## 10. Phase order from here

```
Phase 2  Tokens, Switzer, motion primitives, <Figure>, <Logo>, theme   → commit
Phase 3  Navbar + load sequence                        → commit + screenshots
Phase 4  Hero, incl. the asset recolour and AVIF/WebP  → commit + screenshots
Phase 5  Home sections + compare tray                  → commit per section
Phase 6  Template pages                                → commit per page
Phase 7  Responsive sweep, a11y audit, Lighthouse      → commit
```

A browser tool is available: `scripts/shoot.ts` already drives Playwright at
five widths in both themes and checks for horizontal overflow and reduced-motion
correctness. It gets widened to the seven widths §16 requires (390, 768, 1024,
1280, 1440, 1536, 1920) and generalised past the hero band at Phase 3, so every
visual phase can be screenshotted and critiqued before it is committed.
