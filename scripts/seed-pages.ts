/**
 * Seeds the legal and trust pages.
 *
 *   npm run seed:pages
 *
 * Idempotent by slug. Once seeded, these are edited through the admin rather
 * than in code, so re running this will overwrite any edits made there. That
 * is deliberate: the code is the reference copy.
 */

import { PAGE_SEEDS } from "../lib/content/pages";
import { done, fail, getServiceClient, step } from "./lib/client";

async function main() {
  const supabase = getServiceClient();

  console.log(`\nSeeding ${PAGE_SEEDS.length} pages\n`);

  const rows = PAGE_SEEDS.map((page) => ({
    slug: page.slug,
    title: page.title,
    content: page.content.trim(),
    meta_title: page.metaTitle,
    meta_description: page.metaDescription,
    status: "published",
  }));

  const { error } = await supabase
    .from("pages")
    .upsert(rows, { onConflict: "slug" });

  if (error) fail("could not seed pages", error);

  for (const page of PAGE_SEEDS) step(page.slug);

  console.log(
    "\n  Note: the PAIA manual has a prescribed form and the privacy policy\n" +
      "  makes commitments on your behalf. Have both reviewed by an attorney\n" +
      "  before launch.",
  );
  done(`Seeded ${rows.length} pages.`);
}

main().catch((error) => fail("page seed crashed", error));
