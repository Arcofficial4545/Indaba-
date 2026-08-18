/**
 * Seeds head to head comparisons.
 *
 *   npm run seed:comparisons
 *
 * Pairs are generated from each product's curated alternatives, then de
 * duplicated so a pair never exists twice in opposite orders. The slug always
 * uses the alphabetically first product on the left, which matches the
 * canonical form the compare route redirects to.
 */

import { CATALOGUE } from "../lib/content/catalogue";
import { done, fail, getServiceClient, step } from "./lib/client";

/** How many alternatives per product become a published comparison. */
const PER_PRODUCT = 2;

async function main() {
  const supabase = getServiceClient();

  const { data: softwareRows, error: softwareError } = await supabase
    .from("software")
    .select("id, slug");

  if (softwareError) fail("could not read software", softwareError);
  const softwareId = new Map(
    (softwareRows ?? []).map((row) => [row.slug as string, row.id as string]),
  );

  if (softwareId.size === 0) fail("no software found. Run npm run seed first.");

  const seen = new Set<string>();
  const rows: Record<string, unknown>[] = [];

  for (const entry of CATALOGUE) {
    for (const alternativeSlug of entry.alternatives.slice(0, PER_PRODUCT)) {
      const [a, b] = [entry.slug, alternativeSlug].sort((x, y) =>
        x.localeCompare(y),
      );
      const slug = `${a}-vs-${b}`;
      if (seen.has(slug)) continue;

      const left = softwareId.get(a);
      const right = softwareId.get(b);
      if (!left || !right || left === right) continue;

      seen.add(slug);
      rows.push({
        software_a_id: left,
        software_b_id: right,
        slug,
        status: "published",
        meta_title: null,
        meta_description: null,
        custom_verdict: null,
      });
    }
  }

  console.log(`\nSeeding ${rows.length} comparisons\n`);

  const { error } = await supabase
    .from("comparisons")
    .upsert(rows, { onConflict: "slug" });

  if (error) fail("could not seed comparisons", error);

  for (const row of rows) step(String(row.slug));
  done(`Seeded ${rows.length} comparisons.`);
}

main().catch((error) => fail("comparison seed crashed", error));
