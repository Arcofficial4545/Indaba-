import type { MetadataRoute } from "next";

import { PAGE_SEEDS } from "@/lib/content/pages";
import { getLatestArticles } from "@/lib/queries/articles";
import { getCategories } from "@/lib/queries/categories";
import { getTrendingComparisons } from "@/lib/queries/comparisons";
import { getAllSoftware } from "@/lib/queries/software";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

/**
 * Generated from the database, covering every published entity.
 *
 * The review archive and alternatives pages are included per product because
 * they carry distinct long tail queries. Search and form pages are excluded,
 * matching their robots directives.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [software, categories, articles, comparisons] = await Promise.all([
    getAllSoftware(),
    getCategories(),
    getLatestArticles(500),
    getTrendingComparisons(500),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/software`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/categories`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/newsletter`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  const softwareRoutes: MetadataRoute.Sitemap = software.flatMap((item) => [
    {
      url: `${SITE_URL}/software/${item.slug}`,
      lastModified: new Date(item.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/software/${item.slug}/reviews`,
      lastModified: new Date(item.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/software/${item.slug}/alternatives`,
      lastModified: new Date(item.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ]);

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/category/${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/blog/${article.slug}`,
    lastModified: new Date(article.published_date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const comparisonRoutes: MetadataRoute.Sitemap = comparisons.map((pair) => ({
    url: `${SITE_URL}/compare/${pair.comparison.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const legalRoutes: MetadataRoute.Sitemap = PAGE_SEEDS.map((page) => ({
    url: `${SITE_URL}/${page.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [
    ...staticRoutes,
    ...softwareRoutes,
    ...categoryRoutes,
    ...articleRoutes,
    ...comparisonRoutes,
    ...legalRoutes,
  ];
}
