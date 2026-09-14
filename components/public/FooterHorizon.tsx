/**
 * The horizon the footer rises out of.
 *
 * WHY THIS EXISTS. The footer was a flat ink slab with a straight top edge: it
 * ended the page without closing it, and nothing about it said where this site
 * is from. The one thing Indaba sells is that it is South African — every
 * price is in rand, every reviewer is local, the tax rate is the local one —
 * and that claim was being made only in words, in 14px type, in the base row.
 *
 * So the boundary between page and footer is a South African skyline in flat
 * ink: Lion's Head, Table Mountain and Devil's Peak on the left, a city running
 * east through the Hillbrow Tower and the Sandton towers, then a pylon, a wind
 * turbine and acacia out into the veld. It is drawn, not photographed, because
 * a stock photograph of a skyline is exactly the tell this design avoids.
 *
 * HOW IT IS BUILT, and the three constraints it had to satisfy.
 *
 *  1. TWO FLAT COLOURS, NO GRADIENT. The palette rules ban gradient washes
 *     outright. The shapes overlap freely and their union is the silhouette:
 *     ink for the body, a sand hairline along the outer edge. Nothing is
 *     stroked individually, so there are no internal seams where two buildings
 *     meet — see Skyline for how the edge is drawn without tracing all of them.
 *
 *  2. IT CARRIES ITS OWN PAGE BACKGROUND. On the home page the newsletter is a
 *     full-bleed ink band sitting directly above the footer, so an ink
 *     silhouette on a transparent strip would be ink on ink and vanish on the
 *     most important page of the site. The strip paints `--color-surface-page`
 *     behind itself: invisible on a bone page, and deliberate air between two
 *     ink surfaces on the home page.
 *
 *  3. THE BOTTOM IS DISPOSABLE. Below the ground line the artwork is solid and
 *     the footer body underneath is the same ink, so the strip can crop its own
 *     bottom at any height with no visible seam. That is what lets the height
 *     be capped at wide viewports instead of growing to 260px at 1920.
 *
 * Decorative, so `aria-hidden`. Everything it alludes to is stated as text in
 * the footer's signals row, which is where a screen reader gets it.
 */

/** Where the ground sits in viewBox units. Everything is measured off it. */
const GROUND = 178;

/**
 * The city between Table Mountain and the veld.
 *
 * Held as data rather than 20 hand-typed rects because the failure mode of
 * hand-typing them is exactly what the first draft did: near-identical widths
 * at evenly spaced intervals, which reads as a bar chart rather than a city.
 * Varied widths, deliberate overlaps and a `cap` setback on the taller slabs
 * are what break that up.
 */
const CITY: { x: number; w: number; h: number; cap?: { inset: number; h: number } }[] = [
  { x: 648, w: 46, h: 40 },
  { x: 686, w: 22, h: 58 },
  { x: 702, w: 38, h: 30 },
  { x: 734, w: 30, h: 66, cap: { inset: 7, h: 12 } },
  { x: 760, w: 52, h: 44 },
  { x: 806, w: 24, h: 74 },
  { x: 824, w: 44, h: 34 },
  { x: 862, w: 34, h: 88, cap: { inset: 9, h: 16 } },
  { x: 890, w: 26, h: 50 },
  { x: 910, w: 48, h: 68 },
  { x: 952, w: 20, h: 40 },
  // Sandton, east of the tower: taller, and the slabs get wider as they go.
  { x: 1072, w: 38, h: 96 },
  { x: 1104, w: 26, h: 62 },
  { x: 1124, w: 34, h: 122, cap: { inset: 10, h: 20 } },
  { x: 1152, w: 44, h: 78 },
  { x: 1190, w: 28, h: 104, cap: { inset: 8, h: 14 } },
  { x: 1212, w: 40, h: 56 },
];

/**
 * An acacia: a bare trunk under a flat, layered canopy. The flat top is the
 * whole identification — a round canopy reads as an oak and puts this skyline
 * in the wrong hemisphere.
 */
function Acacia({ x, scale = 1 }: { x: number; scale?: number }) {
  const h = 42 * scale;
  return (
    <g>
      <rect x={x - 2.25 * scale} y={GROUND - h} width={4.5 * scale} height={h + 8} />
      <ellipse cx={x} cy={GROUND - h - 2} rx={34 * scale} ry={6.5 * scale} />
      <ellipse cx={x - 3 * scale} cy={GROUND - h - 11 * scale} rx={21 * scale} ry={5 * scale} />
    </g>
  );
}

/**
 * The silhouette, with no paint of its own — the two <g> wrappers below supply
 * it. Rendered twice: once stroked in sand, once filled in ink on top.
 *
 * That is what draws a hairline along the horizon without showing every seam
 * where two buildings meet. Strokes go down first, fills go down second, so
 * every stroke that falls INSIDE the union is painted over and only the outer
 * edge survives. Stroking the shapes individually would trace all of them.
 *
 * The edge is not decoration. In dark mode the footer ink is #262626 against a
 * #141413 page — 1.35:1 — and the whole skyline all but vanished. Cards on
 * this site solve the same problem with a hairline border; this is that rule
 * applied to a drawing, and sand is the token for rules and marks.
 */
function Skyline() {
  return (
    <>
      {/* ---- Cape Town: Lion's Head, Table Mountain, Devil's Peak ------ */}
      <path d="M120 188 L176 96 L232 188 Z" />
      {/*
        The plateau is dead flat and long, the faces either side are steep,
        and the whole massif out-tops the city. All three matter: shorten the
        plateau and it reads as a barn roof, slope the faces and it becomes a
        hill, and let the office towers overtake it and the eye stops reading
        it as a mountain at all. Devil's Peak is the notch and second summit
        on its right; Lion's Head is the separate cone to its left, and it has
        to stay separate or the two merge into one lump.
      */}
      <path d="M256 188 L288 106 L302 62 L470 62 L482 102 L508 140 L550 100 L566 90 L600 146 L640 188 Z" />

      {/* ---- the city, west to east ------------------------------------ */}
      {CITY.map((b) => (
        <g key={`${b.x}-${b.h}`}>
          <rect x={b.x} y={GROUND - b.h} width={b.w} height={b.h + 10} />
          {b.cap && (
            <rect
              x={b.x + b.cap.inset}
              y={GROUND - b.h - b.cap.h}
              width={b.w - b.cap.inset * 2}
              height={b.cap.h + 4}
            />
          )}
        </g>
      ))}

      {/*
        The Hillbrow Tower: slim shaft, a collar near the top, a mast. The
        silhouette Johannesburg is recognised by, and the tallest thing on
        this horizon — which is also true of the real one.
      */}
      <rect x={1018} y={26} width={4} height={38} />
      <path d="M1002 62 H1038 L1042 90 H998 Z" />
      <rect x={1012} y={88} width={16} height={GROUND - 88 + 10} />
      <path d="M1004 156 H1036 L1046 188 H994 Z" />

      {/*
        A tower crane. One line of it does more than another three slabs: it
        is the only element here that says the skyline is still being built.
      */}
      <rect x={981} y={70} width={6} height={GROUND - 70 + 10} />
      <rect x={928} y={62} width={92} height={7} />
      <rect x={949} y={69} width={5} height={17} />
      <path d="M985 70 L1018 63 L1018 69 Z" />

      {/*
        A transmission pylon. Unglamorous on purpose: this is a directory for
        people who run businesses, and the grid is the thing every one of them
        has an opinion about.
      */}
      <path d="M1287 188 L1299 188 L1329 104 L1321 104 Z" />
      <path d="M1367 188 L1355 188 L1325 104 L1333 104 Z" />
      <rect x={1295} y={135} width={64} height={7} />
      <rect x={1304} y={111} width={46} height={7} />
      <rect x={1323} y={82} width={8} height={24} />

      {/* ---- a turbine off the N7, and then the veld -------------------- */}
      <path d="M1411 188 L1427 188 L1423 74 L1415 74 Z" />
      <circle cx={1419} cy={71} r={7} />
      <path d="M1414 68 H1424 L1422 18 H1416 Z" />
      <path d="M1414 75 L1420 81 L1371 104 L1367 95 Z" />
      <path d="M1424 75 L1418 81 L1467 104 L1471 95 Z" />

      <Acacia x={86} scale={0.86} />
      <Acacia x={1500} />
      <Acacia x={1562} scale={0.7} />

      {/*
      The ground. Drawn last so every shape above is welded to it, and run
      out past the viewBox on three sides — the root svg clips there, so the
      sand edge never draws along the bottom or the sides of the strip. Only
      the horizon itself gets an edge, which is the whole point of it.
      */}
      <path
      d={`M-40 ${GROUND - 4}
          C 180 ${GROUND - 12}, 340 ${GROUND + 4}, 540 ${GROUND - 2}
          C 760 ${GROUND - 8}, 940 ${GROUND + 6}, 1140 ${GROUND + 2}
          C 1320 ${GROUND - 2}, 1460 ${GROUND - 10}, 1640 ${GROUND - 6}
          L 1640 264 L -40 264 Z`}
      />
    </>
  );
}

export function FooterHorizon() {
  return (
    /* data-bleed: below about 700px the artwork is deliberately wider than the
       strip and crops at the sides, which is a design decision rather than a
       layout bug. The screenshot rig has an opt-out for exactly this. */
    <div className="footer-horizon" data-bleed="" aria-hidden="true">
      <svg viewBox="0 0 1600 220" role="presentation" focusable="false">
        <g className="footer-horizon-edge">
          <Skyline />
        </g>
        <g className="footer-horizon-fill">
          <Skyline />
        </g>
      </svg>
    </div>
  );
}
