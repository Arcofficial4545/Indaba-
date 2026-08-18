import { generateReviews } from "@/lib/content/generateReviews";
import { FALLBACK_SOFTWARE } from "@/lib/fallback-data";
import { createClient } from "@/lib/supabase/server";
import type { Review } from "@/lib/types";

/** How many reviews the fallback generates per product. */
const FALLBACK_PAGE = 36;

function fallbackReviews(softwareId: string): Review[] {
  const software = FALLBACK_SOFTWARE.find((s) => s.id === softwareId);
  if (!software) return [];

  return generateReviews({
    slug: software.slug,
    count: Math.min(FALLBACK_PAGE, software.review_count),
    targetRating: software.overall_rating,
  }).map((review, index) => ({
    ...review,
    id: `${software.slug}-review-${index}`,
    software_id: softwareId,
    reviewer_avatar_url: null,
  }));
}

export type ReviewFilters = {
  rating?: number;
  companySize?: string;
  sort?: "recent" | "helpful" | "highest" | "lowest";
  limit?: number;
  offset?: number;
};

export async function getReviews(
  softwareId: string,
  filters: ReviewFilters = {},
): Promise<{ reviews: Review[]; total: number }> {
  const { rating, companySize, sort = "recent", limit = 10, offset = 0 } = filters;
  const supabase = await createClient();

  if (!supabase) {
    let rows = fallbackReviews(softwareId);
    if (rating) rows = rows.filter((r) => r.overall_rating === rating);
    if (companySize) {
      rows = rows.filter((r) => r.reviewer_company_size === companySize);
    }
    rows = sortReviews(rows, sort);
    return { reviews: rows.slice(offset, offset + limit), total: rows.length };
  }

  let query = supabase
    .from("reviews")
    .select("*", { count: "exact" })
    .eq("software_id", softwareId)
    .eq("status", "published");

  if (rating) query = query.eq("overall_rating", rating);
  if (companySize) query = query.eq("reviewer_company_size", companySize);

  switch (sort) {
    case "helpful":
      query = query.order("helpful_count", { ascending: false });
      break;
    case "highest":
      query = query.order("overall_rating", { ascending: false });
      break;
    case "lowest":
      query = query.order("overall_rating", { ascending: true });
      break;
    default:
      query = query.order("review_date", { ascending: false });
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error || !data) {
    const rows = sortReviews(fallbackReviews(softwareId), sort);
    return { reviews: rows.slice(offset, offset + limit), total: rows.length };
  }

  return { reviews: data as Review[], total: count ?? data.length };
}

function sortReviews(reviews: Review[], sort: ReviewFilters["sort"]): Review[] {
  const copy = [...reviews];
  switch (sort) {
    case "helpful":
      return copy.sort((a, b) => b.helpful_count - a.helpful_count);
    case "highest":
      return copy.sort((a, b) => b.overall_rating - a.overall_rating);
    case "lowest":
      return copy.sort((a, b) => a.overall_rating - b.overall_rating);
    default:
      return copy.sort(
        (a, b) =>
          new Date(b.review_date).getTime() - new Date(a.review_date).getTime(),
      );
  }
}

/** Counts by company size, for the reviewer profile chart on the profile page. */
export async function getCompanySizeBreakdown(
  softwareId: string,
): Promise<Record<string, number>> {
  const supabase = await createClient();
  const rows = supabase
    ? ((
        await supabase
          .from("reviews")
          .select("reviewer_company_size")
          .eq("software_id", softwareId)
          .eq("status", "published")
      ).data as { reviewer_company_size: string | null }[] | null) ?? []
    : fallbackReviews(softwareId);

  const breakdown: Record<string, number> = {};
  for (const row of rows) {
    const size = row.reviewer_company_size;
    if (!size) continue;
    breakdown[size] = (breakdown[size] ?? 0) + 1;
  }
  return breakdown;
}
