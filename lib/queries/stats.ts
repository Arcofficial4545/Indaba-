import {
  FALLBACK_CATEGORIES,
  FALLBACK_REVIEW_TOTAL,
  FALLBACK_SOFTWARE,
} from "@/lib/fallback-data";
import { createClient } from "@/lib/supabase/server";

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
export async function getSiteStats(): Promise<SiteStats> {
  const supabase = await createClient();

  if (!supabase) {
    return {
      reviewCount: FALLBACK_REVIEW_TOTAL,
      softwareCount: FALLBACK_SOFTWARE.length,
      categoryCount: FALLBACK_CATEGORIES.length,
    };
  }

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

  return {
    reviewCount: reviews.count ?? FALLBACK_REVIEW_TOTAL,
    softwareCount: software.count ?? FALLBACK_SOFTWARE.length,
    categoryCount: categories.count ?? FALLBACK_CATEGORIES.length,
  };
}
