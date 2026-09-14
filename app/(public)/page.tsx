import { Hero } from "@/components/public/Hero";
import { CategoryIndex } from "@/components/public/home/CategoryIndex";
import { Guides } from "@/components/public/home/Guides";
import { HeadToHead } from "@/components/public/home/HeadToHead";
import { RailSection } from "@/components/public/Rail";
import { SoftwareShowcase } from "@/components/public/home/SoftwareShowcase";
import { TopRatedTable } from "@/components/public/home/TopRatedTable";
import { formatNumber } from "@/lib/format";
import { getLatestArticles } from "@/lib/queries/articles";
import { getCategories } from "@/lib/queries/categories";
import { getTrendingComparisons } from "@/lib/queries/comparisons";
import { getHeroMatchups } from "@/lib/queries/hero";
import { getNavCategories } from "@/lib/queries/nav";
import {
  getAllSoftware,
  getSoftwareShowcase,
  getTopRatedSoftware,
} from "@/lib/queries/software";
import { getSiteStats } from "@/lib/queries/stats";

export const revalidate = 3600;

export default async function HomePage() {
  const [
    categories,
    navCategories,
    stats,
    topRated,
    allSoftware,
    articles,
    comparisons,
    showcase,
  ] = await Promise.all([
    getCategories(),
    getNavCategories(),
    getSiteStats(),
    getTopRatedSoftware(8),
    getAllSoftware(),
    getLatestArticles(3),
    getTrendingComparisons(3),
    getSoftwareShowcase(20),
  ]);

  // The navigation query already ranks each category. Reuse its first product
  // and the loaded catalogue for the always-visible card details.
  const softwareBySlug = new Map(allSoftware.map((product) => [product.slug, product]));
  const sage = softwareBySlug.get("sage-accounting");
  // Homepage recommendations are editorial; review-based queries stay intact.
  const recommended = sage
    ? [sage, ...topRated.filter((product) => product.slug !== sage.slug)].slice(0, 8)
    : topRated;
  const leaders = Object.fromEntries(
    navCategories.map((category) => {
      const top = softwareBySlug.get(category.leaders[0]?.slug ?? "");
      return [
        category.slug,
        top
          ? {
              name: top.name,
              rating: top.overall_rating,
              reviews: top.review_count,
            }
          : undefined,
      ] as const;
    }),
  );

  return (
    <>
      <Hero
        categories={categories}
        stats={stats}
        software={allSoftware}
        matchups={getHeroMatchups(allSoftware)}
      />

      <RailSection
        id="categories-heading"
        label="Categories"
        count={formatNumber(navCategories.length)}
        note="Each judged against the same local yardstick."
        heading="Browse by category"
        rhythm={1}
      >
        <CategoryIndex categories={navCategories} leaders={leaders} />
      </RailSection>

      <RailSection
        id="showcase-heading"
        label="Software"
        count={formatNumber(stats.softwareCount)}
        note="Prices checked against the vendor&rsquo;s own page."
        heading="Browse software by price and rating"
        rhythm={1}
      >
        <SoftwareShowcase software={showcase} />
      </RailSection>

      {comparisons.length > 0 && (
        <RailSection
          id="h2h-heading"
          label="Comparisons"
          count={formatNumber(comparisons.length)}
          note="Ratings and starting prices, side by side."
          heading="Compare two products"
          rhythm={1}
        >
          <HeadToHead pairs={comparisons} />
        </RailSection>
      )}

      <RailSection
        id="top-rated-heading"
        label="Recommendations"
        count={formatNumber(recommended.length)}
        note="Software selected by Indaba."
        heading="Recommended software"
        rhythm={1}
      >
        <TopRatedTable software={recommended} />
      </RailSection>

      <Guides articles={articles} />
    </>
  );
}
