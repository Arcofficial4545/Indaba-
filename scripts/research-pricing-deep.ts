/**
 * Second pass for pricing pages that render client side.
 *
 * The first harness strips <script> before reading, which is right for normal
 * pages and useless for a single page app. Modern pricing pages usually ship
 * their numbers inside an embedded JSON payload, so this pass searches the raw
 * HTML including scripts, and reports price shaped fragments with context.
 *
 *   npx tsx scripts/research-pricing-deep.ts
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const TARGETS: { slug: string; label: string; urls: string[] }[] = [
  {
    slug: "zoho-crm",
    label: "Zoho CRM",
    urls: [
      "https://www.zoho.com/crm/zohocrm-pricing.html",
      "https://www.zoho.com/en-za/crm/zohocrm-pricing.html",
    ],
  },
  {
    slug: "zoho-people",
    label: "Zoho People",
    urls: ["https://www.zoho.com/people/pricing.html"],
  },
  {
    slug: "hubspot-crm",
    label: "HubSpot Sales",
    urls: [
      "https://www.hubspot.com/pricing/sales",
      "https://www.hubspot.com/pricing/sales/starter",
    ],
  },
  {
    slug: "quickbooks-online",
    label: "QuickBooks ZA",
    urls: ["https://quickbooks.intuit.com/za/pricing/"],
  },
  { slug: "odoo", label: "Odoo", urls: ["https://www.odoo.com/pricing-plan"] },
  { slug: "clickup", label: "ClickUp", urls: ["https://clickup.com/pricing"] },
  { slug: "wrike", label: "Wrike", urls: ["https://www.wrike.com/price/"] },
  { slug: "monday-com", label: "monday.com", urls: ["https://monday.com/pricing"] },
  { slug: "asana", label: "Asana", urls: ["https://asana.com/pricing"] },
];

/**
 * Wider net than the first pass. Vendors embed prices as bare JSON numbers
 * next to a plan name far more often than as formatted currency strings.
 */
const PATTERNS: { name: string; re: RegExp }[] = [
  { name: "plan-price-json", re: /"(?:name|title|planName)"\s*:\s*"([A-Za-z][A-Za-z0-9 +]{2,24})"[^}]{0,400}?"(?:price|amount|monthly|monthlyPrice|priceMonthly)"\s*:\s*"?(\d[\d.,]{0,8})/gi },
  { name: "price-json", re: /"(?:price|amount|monthlyPrice|priceMonthly|annualPrice)"\s*:\s*"?(\d[\d.,]{0,8})"?/gi },
  { name: "currency-text", re: /(?:R|ZAR|US?\$|£|€)\s?\d[\d.,]{0,8}\s*(?:\/|per\s+)?(?:user|seat|employee|month|mo\b|organization|org)/gi },
  { name: "vat", re: /(?:excl(?:uding|usive)?\.?\s*(?:of\s*)?(?:VAT|local taxes)|incl(?:uding|usive)?\.?\s*(?:of\s*)?VAT|plus\s*VAT)/gi },
  { name: "trial", re: /\b(\d{1,2})[\s-]day free trial|free trial of (\d{1,2})/gi },
];

function unique(values: string[], cap: number) {
  return Array.from(new Set(values.map((v) => v.replace(/\s+/g, " ").trim()))).slice(0, cap);
}

async function main() {
  const outDir = path.join(process.cwd(), "data", "pricing");
  await mkdir(outDir, { recursive: true });
  const lines: string[] = ["# Deep pricing scan (pass 2)", "", `Generated ${new Date().toISOString()}`, ""];

  for (const target of TARGETS) {
    lines.push(`## ${target.label}`, "");

    for (const url of target.urls) {
      process.stdout.write(`  ${target.slug.padEnd(20)} ${url.slice(0, 50).padEnd(52)}`);
      try {
        const response = await fetch(url, {
          headers: {
            "user-agent": UA,
            "accept-language": "en-ZA,en;q=0.9",
            accept: "text/html,application/xhtml+xml",
          },
          redirect: "follow",
        });

        if (!response.ok) {
          console.log(`HTTP ${response.status}`);
          lines.push(`- ${url} -> HTTP ${response.status}`);
          continue;
        }

        const body = await response.text();
        const hits: string[] = [];
        for (const pattern of PATTERNS) {
          const matches = unique(Array.from(body.matchAll(pattern.re)).map((m) => m[0]), 12);
          if (matches.length) hits.push(`  - **${pattern.name}**: ${matches.join(" | ")}`);
        }

        console.log(hits.length ? `ok (${hits.length})` : "ok (nothing)");
        lines.push(`- ${url} -> HTTP 200, ${body.length} bytes`);
        lines.push(...(hits.length ? hits : ["  - nothing extractable"]));
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(`FAIL ${message}`);
        lines.push(`- ${url} -> FAILED ${message}`);
      }
    }
    lines.push("");
  }

  const reportPath = path.join(outDir, "_deep-scan-2.md");
  await writeFile(reportPath, lines.join("\n"), "utf8");
  console.log(`\nReport written to ${reportPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
