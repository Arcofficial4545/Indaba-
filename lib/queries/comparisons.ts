import { FALLBACK_COMPARISONS } from "@/lib/fallback-data";
import { createClient } from "@/lib/supabase/server";
import type { Comparison, SoftwareWithCategory } from "@/lib/types";

import { getAllSoftware } from "./software";

export type ComparisonPair = {
  comparison: Comparison;
  a: SoftwareWithCategory;
  b: SoftwareWithCategory;
};

/**
 * Resolve `a-vs-b` to two products, accepting either order.
 *
 * Both directions must resolve so a long tail query is never lost, but only
 * one is canonical. The caller redirects to the canonical form when the
 * requested slug is the reverse, which keeps the ranking on a single URL.
 */
export async function getComparisonPair(
  pair: string,
): Promise<{ a: SoftwareWithCategory; b: SoftwareWithCategory } | null> {
  const parts = pair.split("-vs-");
  if (parts.length !== 2) return null;

  const software = await getAllSoftware();
  const bySlug = new Map(software.map((s) => [s.slug, s]));

  const a = bySlug.get(parts[0]);
  const b = bySlug.get(parts[1]);
  if (!a || !b || a.id === b.id) return null;

  return { a, b };
}

/** Head to head match ups, resolved to both product records for the cards. */
export async function getTrendingComparisons(
  limit = 3,
): Promise<ComparisonPair[]> {
  const supabase = await createClient();
  const software = await getAllSoftware();
  const byId = new Map(software.map((s) => [s.id, s]));

  let comparisons: Comparison[] = FALLBACK_COMPARISONS;

  if (supabase) {
    const { data, error } = await supabase
      .from("comparisons")
      .select("*")
      .eq("status", "published")
      .limit(limit);
    if (!error && data && data.length > 0) comparisons = data as Comparison[];
  }

  const pairs: ComparisonPair[] = [];
  for (const comparison of comparisons.slice(0, limit)) {
    const a = byId.get(comparison.software_a_id);
    const b = byId.get(comparison.software_b_id);
    // Skip rather than render half a comparison card.
    if (a && b) pairs.push({ comparison, a, b });
  }
  return pairs;
}
