import { FALLBACK_ARTICLES } from "@/lib/fallback-data";
import { createClient } from "@/lib/supabase/server";
import type { Article } from "@/lib/types";

export async function getLatestArticles(limit = 3): Promise<Article[]> {
  const supabase = await createClient();
  if (!supabase) return FALLBACK_ARTICLES.slice(0, limit);

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_date", { ascending: false })
    .limit(limit);

  if (error || !data || data.length === 0) {
    return FALLBACK_ARTICLES.slice(0, limit);
  }
  return data as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = await createClient();
  if (!supabase) return FALLBACK_ARTICLES.find((a) => a.slug === slug) ?? null;

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    return FALLBACK_ARTICLES.find((a) => a.slug === slug) ?? null;
  }
  return data as Article;
}
