import Image from "next/image";
import Link from "next/link";

import { CountUp } from "@/components/public/CountUp";
import { HeroSearch } from "@/components/public/HeroSearch";
import { LOGO_FILES } from "@/lib/logo-manifest";
import { getBrandKey } from "@/lib/logos";
import type { SiteStats } from "@/lib/queries/stats";
import { HERO_COPY } from "@/lib/site";
import type { Category, SoftwareWithCategory } from "@/lib/types";

/*
  The load sequence, in one place.

  Order is headline, subheading, search, category chips, illustration, then
  the proof band: the rule, the counts, and the marquee last. Reading the
  numbers down this list is the whole timeline; nothing else schedules motion.
*/
const BEAT = {
  headline: 0,
  subheading: 80,
  search: 160,
  chips: 240,
  illustration: 310,
  proof: 830,
  trust: 890,
  marks: 970,
  /* The three figures start in sequence rather than moving as one block. */
  countStagger: 80,
} as const;

type HeroMark = {
  brand: string;
  name: string;
  file: string;
  shape: "mark" | "wordmark";
};

/**
 * A horizontal lockup is at least three times as wide as it is tall. Anything
 * squarer that still calls itself a wordmark is a stacked lockup: a name over
 * a tagline, or a symbol over a name. Set to the height of this row, each of
 * its two lines lands at about eight pixels and the whole thing reduces to a
 * grey smear, so it is not eligible. Measured off the manifest's own
 * dimensions rather than kept as a list of brand names, which would rot the
 * first time the catalogue changed.
 */
const MIN_WORDMARK_ASPECT = 3;

/**
 * The two names a South African buyer recognises before any other.
 *
 * Putting them first in the track was the wrong instinct: the band is a loop,
 * so first is the position that leaves the screen soonest and does not come
 * back for a full cycle. To actually carry more weight they have to recur, so
 * they are spread through the track at even intervals instead.
 */
const LEAD_BRANDS = ["sage", "quickbooks"];

/** Appearances per lead brand, per cycle. */
const LEAD_REPEATS = 3;

/**
 * Interleave the lead brands back through the running order.
 *
 * Spacing is even and wide: with roughly seven logos on screen at once and a
 * lead every fifth slot, one is almost always in view and two are never
 * adjacent, so it reads as a brand recurring rather than as a list that has
 * stuttered.
 */
function spreadLeads(marks: HeroMark[]): HeroMark[] {
  const leads = LEAD_BRANDS.map((key) =>
    marks.find((mark) => mark.brand === key),
  ).filter((mark): mark is HeroMark => Boolean(mark));

  if (leads.length === 0) return marks;

  const rest = marks.filter((mark) => !LEAD_BRANDS.includes(mark.brand));
  const inserts = leads.length * LEAD_REPEATS;
  const every = Math.max(1, Math.ceil(rest.length / inserts));

  const out: HeroMark[] = [];
  let placed = 0;

  rest.forEach((mark, index) => {
    if (index % every === 0 && placed < inserts) {
      out.push(leads[placed % leads.length]);
      placed += 1;
    }
    out.push(mark);
  });

  // A short catalogue can run out of slots before every lead has been placed.
  while (placed < leads.length) {
    out.push(leads[placed % leads.length]);
    placed += 1;
  }

  return out;
}

/**
 * Every brand in the catalogue whose mark can sit bare on the canvas, ordered
 * by review volume, then interleaved so the lead brands recur.
 *
 * Brands are deduplicated first, because six Sage products would otherwise
 * become six identical logos. Wordmarks are included now that this is a
 * marquee: the static row had to skip them all, because a lockup shrunk into a
 * 26px slot proves nothing to anybody, but a band has room to set one at its
 * own height.
 */
function pickLogoBrands(software: SoftwareWithCategory[]): HeroMark[] {
  const seen = new Set<string>();
  const picked: HeroMark[] = [];

  const byRecognition = [...software].sort(
    (a, b) => (b.review_count ?? 0) - (a.review_count ?? 0),
  );

  for (const item of byRecognition) {
    const key = getBrandKey(item.slug);
    const logo = key ? LOGO_FILES[key] : undefined;
    if (!key || !logo || seen.has(key)) continue;

    if (logo.shape === "wordmark") {
      const aspect =
        logo.width && logo.height ? logo.width / logo.height : Infinity;
      if (aspect < MIN_WORDMARK_ASPECT) continue;
    }

    seen.add(key);
    picked.push({
      brand: key,
      name: item.name,
      file: logo.file,
      shape: logo.shape,
    });
  }

  return spreadLeads(picked);
}

/**
 * One vendor mark, bare on the canvas.
 *
 * A plain img, matching SoftwareLogo: these files are well under a kilobyte
 * and most are SVG, so the optimiser would gain nothing and
 * dangerouslyAllowSVG would have to be turned on for no reason. The shape
 * drives the sizing in CSS rather than a class per case.
 */
function HeroMarkImage({ logo, lazy }: { logo: HeroMark; lazy?: boolean }) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={logo.file}
      alt={lazy ? "" : logo.name}
      data-shape={logo.shape}
      loading={lazy ? "lazy" : "eager"}
      decoding="async"
      className="hero-mark"
    />
  );
}

export function Hero({
  categories,
  stats,
  software,
}: {
  categories: Category[];
  stats: SiteStats;
  software: SoftwareWithCategory[];
}) {
  const logos = pickLogoBrands(software);
  const chips = categories.slice(0, 5);

  const counts = [
    { value: stats.reviewCount, label: "Verified reviews" },
    { value: stats.softwareCount, label: "Products listed" },
    { value: stats.categoryCount, label: "Categories covered" },
  ];

  return (
    /*
      overflow-x-clip, not hidden: the hero must never become a scroll container
      or the sticky navbar above it stops sticking.
    */
    <section
      aria-labelledby="hero-heading"
      className="hero-band relative overflow-x-clip"
    >
      <div className="container-site">
        {/*
          Three cells, two rows.

            row 1   copy (cols 1-7)   illustration (cols 8-12)
            row 2   proof band, all twelve columns

          The band is content height, deliberately. An earlier version gave
          row 1 a viewport derived minimum and let it take the slack, which
          looked settled at 1440x900 and fell apart at 1920x1080: the copy
          centred itself in 200px of spare row while the illustration stayed
          pinned to the floor, so the two columns only lined up at one window
          size. Sized by its content, the composition is the same at every
          desktop width and the top spacing is a number rather than a remainder.

          Below 1024px the grid collapses and the three cells stack in source
          order: copy, illustration, proof. The illustration lands between the
          search and the proof rather than orphaned under everything.
        */}
        <div className="hero-exit grid grid-cols-1 gap-y-10 pt-[var(--hero-pad-top)] pb-[var(--hero-pad-bottom)] sm:gap-y-12 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-6">
          {/* -------------------------------------------------------------- */}
          {/* Copy. Everything left aligned to one edge.                      */}
          {/* -------------------------------------------------------------- */}
          <div className="flex flex-col justify-center lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:pr-10">
            <h1
              id="hero-heading"
              className="hero-rise-blur max-w-[16ch] font-heading text-hero font-bold text-balance text-hero-ink"
              style={{ "--d": `${BEAT.headline}ms` } as React.CSSProperties}
            >
              {HERO_COPY.headline}
            </h1>

            <p
              className="hero-rise mt-6 max-w-[46ch] text-hero-sub text-pretty text-muted-foreground"
              style={{ "--d": `${BEAT.subheading}ms` } as React.CSSProperties}
            >
              {HERO_COPY.subheading}
            </p>

            <div
              className="hero-rise mt-8"
              style={{ "--d": `${BEAT.search}ms` } as React.CSSProperties}
            >
              <HeroSearch />
            </div>

            <nav
              aria-label={HERO_COPY.chipsLabel}
              className="hero-rise mt-4 flex flex-wrap gap-2"
              style={{ "--d": `${BEAT.chips}ms` } as React.CSSProperties}
            >
              {chips.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className={`hero-chip px-4 py-2 text-sm font-medium text-hero-ink/80 hover:text-hero-ink${
                    index > 3 ? " hidden sm:inline-block" : ""
                  }`}
                >
                  {category.name.replace(" Software", "")}
                </Link>
              ))}
            </nav>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* The signature. A verdict already reached.                       */}
          {/* -------------------------------------------------------------- */}
          <div className="flex items-center lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:items-end">
            {/*
              No panel, no plate, no card. comparison-scale.png carries a real
              alpha channel so the object sits on the band's own canvas, and the
              column earns its weight from the size of the object and the air
              around it.

              Left aligned in its cell rather than centred, at every width, so
              the object starts on the same vertical as everything below it.
              460px is the ceiling: the source is 316px wide and Next will not
              upscale it, so anything larger only buys softness.
            */}
            <div className="w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[460px]">
              <div className="hero-float">
                <div
                  className="hero-rise"
                  style={
                    { "--d": `${BEAT.illustration}ms` } as React.CSSProperties
                  }
                >
                  <div
                    className="hero-settle"
                    style={
                      {
                        "--d": `${BEAT.illustration + 120}ms`,
                      } as React.CSSProperties
                    }
                  >
                    <Image
                      src="/hero/comparison-scale.png"
                      alt="A balance scale weighing two sets of software against each other, with a magnifier in front of it"
                      width={316}
                      height={303}
                      sizes="(min-width: 1024px) 460px, (min-width: 640px) 360px, 300px"
                      preload
                      className="h-auto w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* The proof band. One hairline across the whole container, the    */}
          {/* counts under it, then the marquee.                              */}
          {/*                                                                 */}
          {/* There were three horizontal lines here: a lime rule under the   */}
          {/* scale, a rule over the counts, and a third over the logo row    */}
          {/* that only aligned with the second above 1024px. The lime one is */}
          {/* gone. Its job was to divide the scale from the vendor marks     */}
          {/* sitting under it, and the marks are no longer there. Lime now   */}
          {/* appears twice, as before: the search button, and the short      */}
          {/* segment at the head of this rule marking where the proof opens. */}
          {/* -------------------------------------------------------------- */}
          <div
            className="hero-proof hero-rise relative border-t border-hero-rule pt-7 lg:col-span-12 lg:col-start-1 lg:row-start-2"
            style={{ "--d": `${BEAT.proof}ms` } as React.CSSProperties}
          >
            {/*
              The rule spans the container; what sits under it keeps the
              column structure of the rows above. The counts stay on the
              copy's seven columns and the marquee stays in the
              illustration's five, which is where the logo row has always
              been.
            */}
            <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0">
              <dl
                className="hero-rise grid grid-cols-3 gap-x-4 sm:flex sm:flex-wrap sm:gap-x-16 sm:gap-y-6 lg:col-span-7 lg:col-start-1 lg:pr-10"
                style={{ "--d": `${BEAT.trust}ms` } as React.CSSProperties}
              >
                {counts.map((count, index) => (
                  /*
                    A dl group may only hold dt and dd, so the label is the dt
                    and the pair is reversed visually rather than with markup.
                  */
                  <div key={count.label} className="flex flex-col-reverse">
                    <dt className="mt-1 text-[0.6875rem] font-medium tracking-[0.04em] text-muted-foreground uppercase sm:text-xs sm:tracking-[0.08em]">
                      {count.label}
                    </dt>
                    {/*
                      Ungrouped, unlike every other number on the site. en-ZA
                      groups with a space, and at this size any space at all
                      splits "6 196" into a 6 and a 196 no matter how narrow
                      the character is. A four digit count is short enough to
                      read at a glance without grouping, so the separator is
                      dropped here rather than swapped for a comma, which would
                      be the wrong convention for the market. formatNumber and
                      its narrow separator still run everywhere else.
                    */}
                    <dd className="font-mono text-hero-stat font-medium text-hero-ink tabular-nums">
                      <CountUp
                        value={count.value}
                        formatted={String(count.value)}
                        group={false}
                        delay={BEAT.trust + index * BEAT.countStagger}
                      />
                    </dd>
                  </div>
                ))}
              </dl>

              {/* ---------------------------------------------------------- */}
              {/* The marquee, in the illustration's column.                  */}
              {/* ---------------------------------------------------------- */}
              <div
                className="hero-rise lg:col-span-5 lg:col-start-8"
                style={{ "--d": `${BEAT.marks}ms` } as React.CSSProperties}
              >
                {/*
                One period of the animation is one copy of the list, so the
                duration is set from the number of brands rather than fixed:
                the band travels at the same speed whatever the catalogue
                happens to hold.
              */}
                <div
                  className="hero-marquee mt-5"
                  style={
                    {
                      "--marquee-duration": `${Math.max(24, logos.length * 1.7).toFixed(0)}s`,
                    } as React.CSSProperties
                  }
                >
                  <div className="hero-marquee-track">
                    <ul
                      aria-labelledby="hero-marks-label"
                      className="hero-marquee-run"
                    >
                      {logos.map((logo, index) => (
                        <li key={`${logo.brand}-${index}`}>
                          {/*
                            A lead brand appears several times in the running
                            order. Only its first appearance is announced and
                            eagerly fetched; the repeats are decoration, so
                            they carry an empty alt rather than reading the
                            same product name out three times.
                          */}
                          <HeroMarkImage
                            logo={logo}
                            lazy={
                              logos.findIndex((m) => m.brand === logo.brand) !==
                              index
                            }
                          />
                        </li>
                      ))}
                    </ul>

                    {/*
                      The second copy exists only so the track can loop. It is
                      the same content, so it is hidden from assistive tech
                      rather than read out twice.
                    */}
                    <ul aria-hidden="true" className="hero-marquee-run">
                      {logos.map((logo, index) => (
                        <li key={`${logo.brand}-${index}`}>
                          <HeroMarkImage logo={logo} lazy />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
