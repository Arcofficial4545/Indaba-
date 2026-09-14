import { FALLBACK_CATEGORIES } from "@/lib/fallback-data";
import { createPublicClient } from "@/lib/supabase/public";
import type { Category } from "@/lib/types";

export async function getCategories(): Promise<Category[]> {
  const supabase = createPublicClient();
  if (!supabase) return FALLBACK_CATEGORIES;

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error || !data || data.length === 0) return FALLBACK_CATEGORIES;
  return data as Category[];
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const supabase = createPublicClient();
  if (!supabase) {
    return FALLBACK_CATEGORIES.find((c) => c.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return FALLBACK_CATEGORIES.find((c) => c.slug === slug) ?? null;
  }
  return data as Category;
}
