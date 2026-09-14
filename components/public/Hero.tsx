import Link from "next/link";

import { CountUp } from "@/components/public/CountUp";
import { Figure } from "@/components/public/Figure";
import { HeroCompare } from "@/components/public/HeroCompare";
import { HeroSearch } from "@/components/public/HeroSearch";
import { VendorMarquee } from "@/components/public/VendorMarquee";
import { formatNumber } from "@/lib/format";
import type { HeroMatchup } from "@/lib/hero-matchup";
import type { SiteStats } from "@/lib/queries/stats";
import { HERO_COPY } from "@/lib/site";
import type { Category, SoftwareWithCategory } from "@/lib/types";

/**
 * The hero.
 *
 * A Server Component, and it has to stay one. The headline is the LCP element
 * and it must be server-rendered text — never inside a client component gated
 * on an animation. Three children are client components and no more: the
 * search field, the comparison, and the count-ups.
 *
 * COMPOSITION. Left seven columns carry the headline, the mechanism sentence
 * and the search field. Right five carry a live comparison of two real
 * products.
 *
 * The right column used to hold a large drawing of a balance scale on a sand
 * ellipse. It has been deleted rather than resized. On a comparison directory
 * a picture of a comparison is the product rendered as decoration: it occupied
 * the most valuable space on the site and told a first-time visitor nothing
 * she could check. Two real products with their real ratings and real rand
 * prices occupy the same space and demonstrate what the site is for. That is
 * the differentiator — no other directory shows a working comparison in its
 * hero — and it comes from the data being real, not from the animation.
 *
 * Below 1024 the composition stacks: copy first, then the panels.
 */
export function Hero({
  categories,
  stats,
  software,
  matchups,
}: {
  categories: Category[];
  stats: SiteStats;
  software: SoftwareWithCategory[];
  matchups: HeroMatchup[];
}) {
  const popular = categories.slice(0, 6);

  return (
    <>
      <section aria-labelledby="hero-heading" className="hero-band">
        <div className="container-site">
          <div className="hero-grid">
            {/* ---- Left: the argument --------------------------------- */}
            <div className="hero-copy">
              <h1 id="hero-heading" className="hero-headline">{HERO_COPY.headline}</h1>
  
              <p className="hero-sub">{HERO_COPY.subheading}</p>
  
              <div className="hero-search-slot">
                <HeroSearch />
              </div>
  
              <nav aria-label={HERO_COPY.chipsLabel} className="hero-chips">
                {popular.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="hero-chip"
                  >
                    {category.name.replace(/ Software$/, "")}
                  </Link>
                ))}
              </nav>
            </div>
  
            {/* ---- Right: the demonstration --------------------------- */}
            <div className="hero-object">
              {/*
                Rendered only when the catalogue actually yields a usable
                matchup. An empty frame with placeholder products would be worse
                than no panel at all, and the hero is the one place on the site
                where nothing may be invented.
              */}
              {matchups.length > 0 && (
                <section aria-label="A comparison from the directory">
                  <HeroCompare matchups={matchups} />
                </section>
            )}
          </div>
        </div>
      </div>

    </section>
      {/* ---- Below the hero: proof --------------------------------- */}
      <div className="hero-proof">
        <VendorMarquee software={software} />

        <div className="container-site">
          <dl className="hero-stats">
            <Stat label="Verified reviews" value={stats.reviewCount} delay={0} />
            <Stat label="Products listed" value={stats.softwareCount} delay={80} />
            <Stat
              label="Categories covered"
              value={stats.categoryCount}
              delay={160}
            />
          </dl>
        </div>
      </div>
    </>
  );
}

/**
 * One figure, plainly typeset on the bone, separated from its neighbours by a
 * hairline. Not a floating card, not a glass panel, not a tile.
 *
 * The pair is visually reversed with flex-col-reverse rather than reordered in
 * the markup, because a <dl> group may only hold <dt> then <dd> and swapping
 * them would be invalid.
 */
function Stat({
  label,
  value,
  delay,
}: {
  label: string;
  value: number;
  delay: number;
}) {
  return (
    <div className="hero-stat">
      <div className="flex flex-col-reverse">
        <dt className="hero-stat-label">{label}</dt>
        <dd className="hero-stat-value">
          {/*
            The server renders the finished, formatted figure, so the number is
            correct with JavaScript off and correct for a crawler. The count-up
            is layered on top of that markup.

            `formatNumber` is what puts the narrow no-break space in, so this
            reads as "6 196" and not "6196"; <Figure> is what stops it ever
            splitting across a line.
          */}
          <Figure>
            <CountUp
              value={value}
              formatted={formatNumber(value)}
              delay={delay}
            />
          </Figure>
        </dd>
      </div>
    </div>
  );
}
