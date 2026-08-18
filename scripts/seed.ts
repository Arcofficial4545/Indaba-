/**
 * Seeds categories, software, curated alternatives and the best for taxonomy.
 *
 *   npm run seed
 *
 * Idempotent by slug: running it again updates rather than duplicating, so it
 * is safe to re run after editing the catalogue.
 *
 * Pricing comes from lib/content/pricing.ts and never from this file, so a
 * price can only change alongside its recorded source.
 */

import { CATALOGUE, catalogueStats } from "../lib/content/catalogue";
import { PRICING, resolvePrice } from "../lib/content/pricing";
import { done, fail, getServiceClient, step } from "./lib/client";

const CATEGORIES = [
  { name: "Accounting Software", slug: "accounting-software", icon: "calculator", display_order: 1, description: "Ledgers, invoicing, VAT201 returns and SARS eFiling for South African businesses." },
  { name: "Payroll Software", slug: "payroll-software", icon: "wallet", display_order: 2, description: "EMP201 submissions, IRP5 certificates, UIF declarations and ACB payment files." },
  { name: "HR Software", slug: "hr-software", icon: "users", display_order: 3, description: "Leave tracking against BCEA entitlements, performance reviews and employee records." },
  { name: "CRM Software", slug: "crm-software", icon: "handshake", display_order: 4, description: "Pipelines, quoting and customer records for sales teams selling into the local market." },
  { name: "ERP Software", slug: "erp-software", icon: "boxes", display_order: 5, description: "Integrated finance, stock and manufacturing for businesses that have outgrown a ledger." },
  { name: "Project Management", slug: "project-management", icon: "kanban", display_order: 6, description: "Task boards, timelines and resource planning for agencies, consultancies and internal teams." },
];

const TAXONOMY = [
  { kind: "business_size", name: "Sole traders", slug: "sole-trader" },
  { kind: "business_size", name: "Small businesses", slug: "small-business" },
  { kind: "business_size", name: "Growing businesses", slug: "growing-business" },
  { kind: "business_size", name: "Medium businesses", slug: "medium-business" },
  { kind: "business_size", name: "Large businesses", slug: "large-business" },
  { kind: "business_size", name: "Enterprises", slug: "enterprise" },
  { kind: "business_size", name: "Startups", slug: "startups" },
  { kind: "role", name: "Accountants in practice", slug: "accountants" },
  { kind: "role", name: "Sales teams", slug: "sales-teams" },
  { kind: "role", name: "Consultants", slug: "consultants" },
  { kind: "role", name: "Agencies", slug: "agencies" },
  { kind: "industry", name: "Manufacturing", slug: "manufacturing" },
  { kind: "industry", name: "Distribution", slug: "distribution" },
  { kind: "industry", name: "Retail", slug: "retail" },
  { kind: "industry", name: "Print and signage", slug: "print" },
  { kind: "industry", name: "Stock heavy businesses", slug: "stock-heavy" },
  { kind: "industry", name: "Telesales", slug: "telesales" },
  { kind: "industry", name: "Multinationals", slug: "multinational" },
  { kind: "role", name: "VAT registered businesses", slug: "vat-registered" },
  { kind: "role", name: "Exporters", slug: "exporters" },
  { kind: "role", name: "Zoho users", slug: "zoho-users" },
  { kind: "role", name: "Microsoft shops", slug: "microsoft-shops" },
  { kind: "role", name: "Cost conscious buyers", slug: "cost-conscious" },
  { kind: "role", name: "Complex payroll", slug: "complex-payroll" },
  { kind: "role", name: "Simple payroll", slug: "simple-payroll" },
  { kind: "role", name: "Compliance heavy", slug: "compliance-heavy" },
  { kind: "role", name: "Complex sales processes", slug: "complex-sales" },
  { kind: "role", name: "Marketing led businesses", slug: "marketing-led" },
  { kind: "role", name: "People focused teams", slug: "people-focused" },
  { kind: "role", name: "Outsourcing payroll", slug: "outsourcing" },
  { kind: "role", name: "Established businesses", slug: "established-business" },
  { kind: "role", name: "Unreliable connectivity", slug: "unreliable-connectivity" },
];

async function main() {
  const supabase = getServiceClient();
  const stats = catalogueStats();

  console.log(`\nSeeding ${stats.products} products across ${CATEGORIES.length} categories\n`);

  /* ---------------------------------------------------------------- */
  /* Categories                                                        */
  /* ---------------------------------------------------------------- */
  step("categories");
  const { data: categoryRows, error: categoryError } = await supabase
    .from("categories")
    .upsert(CATEGORIES, { onConflict: "slug" })
    .select("id, slug");

  if (categoryError) fail("could not seed categories", categoryError);
  const categoryId = new Map(
    (categoryRows ?? []).map((row) => [row.slug as string, row.id as string]),
  );
  step(`  ${categoryId.size} categories`);

  /* ---------------------------------------------------------------- */
  /* Taxonomy                                                          */
  /* ---------------------------------------------------------------- */
  step("taxonomy terms");
  const { data: termRows, error: termError } = await supabase
    .from("taxonomy_terms")
    .upsert(TAXONOMY, { onConflict: "slug" })
    .select("id, slug");

  if (termError) fail("could not seed taxonomy", termError);
  const termId = new Map(
    (termRows ?? []).map((row) => [row.slug as string, row.id as string]),
  );
  step(`  ${termId.size} terms`);

  /* ---------------------------------------------------------------- */
  /* Software                                                          */
  /* ---------------------------------------------------------------- */
  step("software");
  const softwareRows = CATALOGUE.map((entry) => {
    const price = resolvePrice(entry.slug);
    const record = PRICING[entry.slug];

    return {
      name: entry.name,
      slug: entry.slug,
      tagline: entry.tagline,
      description_short: entry.descriptionShort,
      description_full: entry.descriptionFull.trim(),
      category_id: categoryId.get(entry.categorySlug) ?? null,

      starting_price: price?.zar ?? null,
      price_currency: "ZAR",
      billing_period: record?.period ?? "month",
      vat_inclusive: price?.vatInclusive ?? null,
      price_source_url: price?.sourceUrl ?? null,
      price_verified_at: price?.checkedAt ?? null,
      free_trial: Boolean(record?.freeTrialDays),
      free_trial_days: record?.freeTrialDays ?? null,
      free_version: record?.freeVersion ?? false,
      pricing_plans: record?.plans ?? [],

      features: entry.features,
      top_features: entry.topFeatures,
      integrations: entry.integrations,

      vendor_website: entry.vendorWebsite,
      affiliate_url: entry.vendorWebsite,
      vendor_name: entry.vendorName,
      founded_year: entry.foundedYear,
      support_types: entry.supportTypes,
      countries_available: entry.countries,
      languages: entry.languages,

      status: "published",
      featured: entry.featured,
    };
  });

  const { data: softwareResult, error: softwareError } = await supabase
    .from("software")
    .upsert(softwareRows, { onConflict: "slug" })
    .select("id, slug");

  if (softwareError) fail("could not seed software", softwareError);
  const softwareId = new Map(
    (softwareResult ?? []).map((row) => [row.slug as string, row.id as string]),
  );
  step(`  ${softwareId.size} products`);

  /* ---------------------------------------------------------------- */
  /* Curated alternatives                                              */
  /*                                                                   */
  /* The reference build left this table empty and let the profile page */
  /* silently fall back to category peers. Seeding it properly is what  */
  /* makes the recommendations editorial rather than accidental.        */
  /* ---------------------------------------------------------------- */
  step("curated alternatives");
  const alternatives = CATALOGUE.flatMap((entry) => {
    const source = softwareId.get(entry.slug);
    if (!source) return [];
    return entry.alternatives
      .map((slug, index) => {
        const target = softwareId.get(slug);
        if (!target || target === source) return null;
        return { software_id: source, alternative_id: target, display_order: index };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null);
  });

  const { error: altError } = await supabase
    .from("software_alternatives")
    .upsert(alternatives, { onConflict: "software_id,alternative_id" });

  if (altError) fail("could not seed alternatives", altError);
  step(`  ${alternatives.length} alternative links`);

  /* ---------------------------------------------------------------- */
  /* Best for taxonomy                                                 */
  /* ---------------------------------------------------------------- */
  step("best for tagging");
  const tags = CATALOGUE.flatMap((entry) => {
    const source = softwareId.get(entry.slug);
    if (!source) return [];
    return entry.bestFor
      .map((slug) => {
        const term = termId.get(slug);
        return term ? { software_id: source, term_id: term } : null;
      })
      .filter((row): row is NonNullable<typeof row> => row !== null);
  });

  const { error: tagError } = await supabase
    .from("software_taxonomy")
    .upsert(tags, { onConflict: "software_id,term_id" });

  if (tagError) fail("could not seed taxonomy tags", tagError);
  step(`  ${tags.length} tags`);

  /* ---------------------------------------------------------------- */
  step("rebuilding aggregates");
  const { error: rebuildError } = await supabase.rpc("rebuild_all_aggregates");
  if (rebuildError) fail("could not rebuild aggregates", rebuildError);

  done(
    `Seeded ${softwareId.size} products. Run npm run seed:reviews next, which is the long one.`,
  );
}

main().catch((error) => fail("seed crashed", error));
