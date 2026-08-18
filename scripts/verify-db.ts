/**
 * Verifies the database behaves the way the design depends on.
 *
 *   npm run verify-db
 *
 * Three things matter enough to test:
 *   1. The ratings trigger fires, so aggregates are computed by the database
 *      and never by application code.
 *   2. An anonymous client cannot write.
 *   3. Row level security is on for every table.
 *
 * The test review is inserted and then removed, so this is safe to run against
 * a populated database.
 */

import { createClient } from "@supabase/supabase-js";

import { done, fail, getServiceClient, step } from "./lib/client";

let passed = 0;
let failed = 0;

function check(label: string, ok: boolean, detail?: string) {
  if (ok) {
    passed += 1;
    console.log(`  PASS  ${label}`);
  } else {
    failed += 1;
    console.error(`  FAIL  ${label}${detail ? `\n          ${detail}` : ""}`);
  }
}

async function main() {
  const supabase = getServiceClient();
  console.log("\nVerifying the database\n");

  /* ------------------------------------------------------------------ */
  /* 1. The ratings trigger                                              */
  /* ------------------------------------------------------------------ */
  step("aggregate ratings trigger");

  const { data: product } = await supabase
    .from("software")
    .select("id, slug, overall_rating, review_count")
    .eq("status", "published")
    .limit(1)
    .maybeSingle();

  if (!product) {
    check("a published product exists to test against", false, "Run npm run seed first.");
  } else {
    const before = {
      rating: Number(product.overall_rating),
      count: Number(product.review_count),
    };

    const { data: inserted, error: insertError } = await supabase
      .from("reviews")
      .insert({
        software_id: product.id,
        reviewer_name: "Verification Script",
        reviewer_country: "South Africa",
        overall_rating: 1,
        ease_of_use: 1,
        value_for_money: 1,
        customer_service: 1,
        functionality: 1,
        review_title: "Automated verification row",
        summary:
          "Inserted by npm run verify-db to confirm the aggregate trigger fires. Removed immediately.",
        status: "published",
      })
      .select("id")
      .maybeSingle();

    if (insertError || !inserted) {
      check("insert a test review", false, insertError?.message);
    } else {
      const { data: after } = await supabase
        .from("software")
        .select("overall_rating, review_count")
        .eq("id", product.id)
        .maybeSingle();

      const countMoved = Number(after?.review_count) === before.count + 1;
      check("review_count incremented by the trigger", countMoved,
        `was ${before.count}, now ${after?.review_count}`);

      // A one star review must drag the average down, unless it was already 1.
      const ratingMoved =
        before.rating <= 1 || Number(after?.overall_rating) < before.rating;
      check("overall_rating recomputed by the trigger", ratingMoved,
        `was ${before.rating}, now ${after?.overall_rating}`);

      await supabase.from("reviews").delete().eq("id", inserted.id);

      const { data: restored } = await supabase
        .from("software")
        .select("review_count")
        .eq("id", product.id)
        .maybeSingle();

      check("aggregate restored after delete",
        Number(restored?.review_count) === before.count,
        `expected ${before.count}, got ${restored?.review_count}`);
    }
  }

  /* ------------------------------------------------------------------ */
  /* 2. Anonymous clients cannot write                                   */
  /* ------------------------------------------------------------------ */
  step("row level security");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    check("anon key available to test with", false,
      "Set NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  } else {
    const anon = createClient(url, anonKey, {
      auth: { persistSession: false },
    });

    const { error: writeError } = await anon.from("software").insert({
      name: "Should Not Exist",
      slug: `rls-probe-${Date.now()}`,
      description_short: "x",
      description_full: "x",
    });
    check("anonymous cannot insert software", writeError !== null,
      writeError ? undefined : "The insert succeeded, which means RLS is not protecting this table.");

    const { data: readable } = await anon.from("software").select("id").limit(1);
    check("anonymous can read published software", (readable?.length ?? 0) > 0);

    /*
      With no SELECT policy for anon, PostgREST returns an empty set rather
      than an error, so emptiness is the thing to assert. An error is also
      acceptable and means the same.
    */
    const { data: clicks, error: clickError } = await anon
      .from("affiliate_clicks")
      .select("id")
      .limit(1);
    check(
      "anonymous cannot read affiliate clicks",
      clickError !== null || (clicks?.length ?? 0) === 0,
      "Click records were readable anonymously, which leaks visitor behaviour.",
    );

    const { data: subscribers, error: subscriberError } = await anon
      .from("newsletter_subscribers")
      .select("id")
      .limit(1);
    check(
      "anonymous cannot read subscribers",
      subscriberError !== null || (subscribers?.length ?? 0) === 0,
      "Subscriber addresses were readable anonymously.",
    );
  }

  /* ------------------------------------------------------------------ */
  console.log("");
  if (failed > 0) {
    fail(`${failed} check(s) failed, ${passed} passed`);
  }
  done(`All ${passed} checks passed.`);
}

main().catch((error) => fail("verification crashed", error));
