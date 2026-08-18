import { PAGE_SEEDS } from "@/lib/content/pages";
import { createClient } from "@/lib/supabase/server";
import type { Page } from "@/lib/types";

function fromSeed(slug: string): Page | null {
  const seed = PAGE_SEEDS.find((page) => page.slug === slug);
  if (!seed) return null;
  return {
    id: `page-${seed.slug}`,
    slug: seed.slug,
    title: seed.title,
    content: seed.content.trim(),
    meta_title: seed.metaTitle,
    meta_description: seed.metaDescription,
    status: "published",
    updated_at: "2026-08-18T00:00:00.000Z",
  };
}

/**
 * Legal pages come from the database so an admin can correct a policy without
 * a deploy, and fall back to the seeded copy so a fresh install is never
 * missing its privacy policy.
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  const supabase = await createClient();
  if (!supabase) return fromSeed(slug);

  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return fromSeed(slug);
  return data as Page;
}
