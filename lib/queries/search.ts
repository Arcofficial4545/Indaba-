import type { SearchIndexItem } from "@/components/public/SearchDialog";
import { createClient } from "@/lib/supabase/server";
import type { Article, SoftwareWithCategory } from "@/lib/types";

import { getLatestArticles } from "./articles";
import { getCategories } from "./categories";
import { getAllSoftware } from "./software";

/**
 * The index behind the navbar command palette. Built once in the layout and
 * passed down, so opening search costs no round trip.
 */
export async function getSearchIndex(): Promise<SearchIndexItem[]> {
  const [software, categories, articles] = await Promise.all([
    getAllSoftware(),
    getCategories(),
    getLatestArticles(50),
  ]);

  return [
    ...software.map((item) => ({
      id: `software-${item.id}`,
      title: item.name,
      subtitle: item.category?.name ?? item.vendor_name,
      href: `/software/${item.slug}`,
      group: "Software" as const,
    })),
    ...categories.map((item) => ({
      id: `category-${item.id}`,
      title: item.name,
      subtitle: `${item.software_count} products`,
      href: `/category/${item.slug}`,
      group: "Categories" as const,
    })),
    ...articles.map((item) => ({
      id: `article-${item.id}`,
      title: item.title,
      subtitle: item.category_tag,
      href: `/blog/${item.slug}`,
      group: "Guides" as const,
    })),
  ];
}

export type SearchResults = {
  software: SoftwareWithCategory[];
  articles: Article[];
  total: number;
};

/** Normalise for the in memory fallback match. */
function matches(haystack: (string | null | undefined)[], needle: string) {
  const query = needle.toLowerCase();
  return haystack.some((value) => value?.toLowerCase().includes(query));
}

/**
 * Full text search.
 *
 * Postgres does the work through the generated `search_vector` columns when a
 * database is connected. Without one, it falls back to a substring match over
 * the local data, which is enough for a catalogue this size.
 */
export async function search(query: string): Promise<SearchResults> {
  const trimmed = query.trim();
  if (!trimmed) return { software: [], articles: [], total: 0 };

  const supabase = await createClient();

  if (supabase) {
    const [softwareResult, articleResult] = await Promise.all([
      supabase
        .from("software")
        .select("*, category:categories (id, name, slug, icon)")
        .eq("status", "published")
        .textSearch("search_vector", trimmed, {
          type: "websearch",
          config: "english",
        })
        .limit(20),
      supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .textSearch("search_vector", trimmed, {
          type: "websearch",
          config: "english",
        })
        .limit(10),
    ]);

    if (!softwareResult.error && !articleResult.error) {
      const software = (softwareResult.data ?? []) as unknown as SoftwareWithCategory[];
      const articles = (articleResult.data ?? []) as Article[];
      return { software, articles, total: software.length + articles.length };
    }
  }

  const [allSoftware, allArticles] = await Promise.all([
    getAllSoftware(),
    getLatestArticles(200),
  ]);

  const software = allSoftware.filter((item) =>
    matches(
      [item.name, item.tagline, item.description_short, item.vendor_name],
      trimmed,
    ),
  );
  const articles = allArticles.filter((item) =>
    matches([item.title, item.excerpt, item.category_tag], trimmed),
  );

  return { software, articles, total: software.length + articles.length };
}
