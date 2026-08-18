/**
 * Seeds the buying guides.
 *
 *   npm run seed:articles
 *
 * Idempotent by slug.
 */

import { ARTICLE_SEEDS } from "../lib/content/articles";
import { done, fail, getServiceClient, step } from "./lib/client";

async function main() {
  const supabase = getServiceClient();

  console.log(`\nSeeding ${ARTICLE_SEEDS.length} articles\n`);

  const rows = ARTICLE_SEEDS.map((article) => ({
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content.trim(),
    featured_image_url: article.featured_image_url,
    category_tag: article.category_tag,
    author_name: article.author_name,
    author_bio: article.author_bio,
    author_avatar_url: article.author_avatar_url,
    author_title: article.author_title,
    meta_title: article.meta_title,
    meta_description: article.meta_description,
    read_time_minutes: article.read_time_minutes,
    status: article.status,
    featured: article.featured,
    published_date: article.published_date,
  }));

  const { error } = await supabase
    .from("articles")
    .upsert(rows, { onConflict: "slug" });

  if (error) fail("could not seed articles", error);

  for (const article of ARTICLE_SEEDS) step(article.slug);
  done(`Seeded ${rows.length} articles.`);
}

main().catch((error) => fail("article seed crashed", error));
