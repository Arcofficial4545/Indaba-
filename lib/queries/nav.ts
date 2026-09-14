import { getCategories } from "@/lib/queries/categories";
import { getTrendingComparisons } from "@/lib/queries/comparisons";
import { getSoftwareByCategory } from "@/lib/queries/software";

/**
 * Data for the navigation's categories sheet.
 *
 * A new module rather than a change to an existing one. The sheet needs each
 * category joined to its live product count and its three leading vendor
 * logos, and no existing query returns that shape; reshaping
 * `getCategories()` to carry it would change a contract that six other call
 * sites depend on, which the engineering constraints rule out.
 *
 * Everything here composes existing queries. Nothing new touches the database
 * and no schema changes.
 */

export type NavCategory = {
  id: string;
  name: string;
  slug: string;
  /** Live, from the category row. Never typed in. */
  count: number;
  /** The three highest rated products in the category, for their marks. */
  leaders: { name: string; slug: string; logoUrl: string | null }[];
};

export type NavComparison = {
  href: string;
  a: { name: string; slug: string; rating: number; logoUrl: string | null };
  b: { name: string; slug: string; rating: number; logoUrl: string | null };
};

export async function getNavCategories(): Promise<NavCategory[]> {
  const categories = await getCategories();

  /*
    Six categories, so six concurrent reads. This is called from the public
    layout, which means it is on every page, so it must stay cheap: the layout
    is statically rendered and revalidated hourly like everything else, so in
    practice this runs once an hour rather than once a request.
  */
  const withLeaders = await Promise.all(
    categories.map(async (category) => {
      const software = await getSoftwareByCategory(category.id, 3);
      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        count: category.software_count,
        leaders: software.map((s) => ({
          name: s.name,
          slug: s.slug,
          logoUrl: s.logo_url,
        })),
      };
    }),
  );

  return withLeaders;
}

/** One real head-to-head for the sheet's right-hand column. */
export async function getNavFeaturedComparison(): Promise<NavComparison | null> {
  const pairs = await getTrendingComparisons(1);
  const pair = pairs[0];
  if (!pair) return null;

  return {
    href: `/compare/${pair.a.slug}-vs-${pair.b.slug}`,
    a: {
      name: pair.a.name,
      slug: pair.a.slug,
      rating: pair.a.overall_rating,
      logoUrl: pair.a.logo_url,
    },
    b: {
      name: pair.b.name,
      slug: pair.b.slug,
      rating: pair.b.overall_rating,
      logoUrl: pair.b.logo_url,
    },
  };
}
