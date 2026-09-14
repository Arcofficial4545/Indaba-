import {
  FALLBACK_CATEGORIES,
  FALLBACK_REVIEW_TOTAL,
  FALLBACK_SOFTWARE,
} from "@/lib/fallback-data";
import { createPublicClient } from "@/lib/supabase/public";

export type SiteStats = {
  reviewCount: number;
  softwareCount: number;
  categoryCount: number;
};

/**
 * The three numbers in the stats bar under the hero. They are live counts,
 * because a directory that overstates its own size is the first thing a
 * sceptical reader checks.
 */
const FALLBACK_STATS: SiteStats = {
  reviewCount: FALLBACK_REVIEW_TOTAL,
  softwareCount: FALLBACK_SOFTWARE.length,
  categoryCount: FALLBACK_CATEGORIES.length,
};

export async function getSiteStats(): Promise<SiteStats> {
  const supabase = createPublicClient();

  if (!supabase) return FALLBACK_STATS;

  const [reviews, software, categories] = await Promise.all([
    supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("software")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    supabase.from("categories").select("*", { count: "exact", head: true }),
  ]);

  /*
    No published software means the database is connected but not seeded yet.
    Every other query serves the fallback catalogue in that case, so the counts
    have to as well. A count of 0 is not null, so `??` alone printed 0 beside a
    page full of products.
  */
  if (!software.count) return FALLBACK_STATS;

  return {
    reviewCount: reviews.count ?? FALLBACK_REVIEW_TOTAL,
    softwareCount: software.count ?? FALLBACK_SOFTWARE.length,
    categoryCount: categories.count ?? FALLBACK_CATEGORIES.length,
  };
}
