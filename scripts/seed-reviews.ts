/**
 * Seeds the review corpus.
 *
 *   npm run seed:reviews
 *   npm run seed:reviews -- --fresh    delete existing reviews first
 *
 * This is the long one, and the one with a real performance trap in it.
 *
 * update_software_ratings() is an AFTER INSERT FOR EACH ROW trigger that
 * recomputes an average across every sibling review. Inserting six thousand
 * rows with it enabled is quadratic and takes hours. So the script switches
 * the review triggers off through a SECURITY DEFINER helper, bulk inserts in
 * batches, switches them back on, and then calls rebuild_all_aggregates()
 * once.
 *
 * The aggregates still end up computed exclusively by the database. No
 * application code writes a rating column at any point.
 */

import { CATALOGUE } from "../lib/content/catalogue";
import { generateReviews } from "../lib/content/generateReviews";
import { done, fail, getServiceClient, step } from "./lib/client";

const BATCH = 500;
const fresh = process.argv.includes("--fresh");

async function main() {
  const supabase = getServiceClient();

  const { data: softwareRows, error: softwareError } = await supabase
    .from("software")
    .select("id, slug");

  if (softwareError) fail("could not read software", softwareError);
  const softwareId = new Map(
    (softwareRows ?? []).map((row) => [row.slug as string, row.id as string]),
  );

  if (softwareId.size === 0) {
    fail("no software found. Run npm run seed first.");
  }

  const target = CATALOGUE.reduce((sum, entry) => sum + entry.reviewCount, 0);
  console.log(`\nSeeding roughly ${target.toLocaleString("en-ZA")} reviews\n`);

  if (fresh) {
    step("deleting existing reviews");
    const { error } = await supabase
      .from("reviews")
      .delete()
      .not("id", "is", null);
    if (error) fail("could not clear reviews", error);
  }

  /* ------------------------------------------------------------------ */
  step("disabling review triggers for the bulk load");
  const { error: offError } = await supabase.rpc("set_reviews_triggers", {
    enabled: false,
  });
  if (offError) {
    fail(
      "could not disable the review triggers. Apply 0002_triggers.sql, which defines set_reviews_triggers().",
      offError,
    );
  }

  let inserted = 0;
  let failed = false;

  try {
    for (const entry of CATALOGUE) {
      const id = softwareId.get(entry.slug);
      if (!id) {
        step(`  skipping ${entry.slug}, not in the database`);
        continue;
      }

      const reviews = generateReviews({
        slug: entry.slug,
        count: entry.reviewCount,
        targetRating: entry.rating,
      }).map((review) => ({ ...review, software_id: id }));

      for (let i = 0; i < reviews.length; i += BATCH) {
        const chunk = reviews.slice(i, i + BATCH);
        const { error } = await supabase.from("reviews").insert(chunk);
        if (error) {
          failed = true;
          fail(`could not insert reviews for ${entry.slug}`, error);
        }
        inserted += chunk.length;
      }

      step(`  ${entry.slug.padEnd(32)} ${reviews.length}`);
    }
  } finally {
    // Always put the triggers back, even if the load failed part way.
    step("re enabling review triggers");
    const { error: onError } = await supabase.rpc("set_reviews_triggers", {
      enabled: true,
    });
    if (onError) {
      console.error(
        "\n  WARNING: the review triggers could not be re enabled. Run this in the SQL editor:\n" +
          "    select set_reviews_triggers(true);\n",
      );
    }
  }

  if (failed) return;

  step("rebuilding aggregates in one pass");
  const { error: rebuildError } = await supabase.rpc("rebuild_all_aggregates");
  if (rebuildError) fail("could not rebuild aggregates", rebuildError);

  done(`Inserted ${inserted.toLocaleString("en-ZA")} reviews.`);
}

main().catch((error) => fail("review seed crashed", error));
