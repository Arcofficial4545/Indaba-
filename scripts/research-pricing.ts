/**
 * Pricing research harness.
 *
 *   npx tsx scripts/research-pricing.ts
 *
 * Fetches each vendor's own pricing page, strips it to text, and pulls out
 * every currency figure with the surrounding sentence plus any statement about
 * VAT. It does not decide anything. A human reads the report and writes the
 * curated JSON, because "R450" on a page means nothing until you know whether
 * it is per user, per month, promotional, or inclusive of VAT.
 *
 * Output: scratch report at data/pricing/_research-report.md
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

type Target = { slug: string; label: string; url: string };

const TARGETS: Target[] = [
  // Accounting
  { slug: "sage-accounting", label: "Sage Accounting ZA", url: "https://www.sage.com/en-za/products/sage-accounting/pricing/" },
  { slug: "xero", label: "Xero ZA", url: "https://www.xero.com/za/pricing-plans/" },
  { slug: "quickbooks-online", label: "QuickBooks ZA", url: "https://quickbooks.intuit.com/za/pricing/" },
  { slug: "zoho-books", label: "Zoho Books ZA", url: "https://www.zoho.com/za/books/pricing/" },
  { slug: "freshbooks", label: "FreshBooks", url: "https://www.freshbooks.com/pricing" },
  { slug: "wave-accounting", label: "Wave", url: "https://www.waveapps.com/pricing" },
  { slug: "sage-50cloud-pastel", label: "Sage 50cloud Pastel ZA", url: "https://www.sage.com/en-za/products/sage-50cloud-pastel/" },
  { slug: "omni-accounts", label: "Omni Accounts ZA", url: "https://www.omniaccounts.co.za/pricing/" },
  { slug: "quickeasy-bos", label: "QuickEasy BOS ZA", url: "https://www.quickeasy.co.za/pricing" },

  // Payroll
  { slug: "simplepay", label: "SimplePay ZA", url: "https://www.simplepay.co.za/pricing" },
  { slug: "payspace", label: "PaySpace", url: "https://www.payspace.com/pricing/" },
  { slug: "sage-pastel-payroll", label: "Sage Pastel Payroll ZA", url: "https://www.sage.com/en-za/products/sage-pastel-payroll/" },
  { slug: "sage-business-cloud-payroll", label: "Sage Business Cloud Payroll ZA", url: "https://www.sage.com/en-za/products/sage-business-cloud-payroll/" },
  { slug: "paysoft", label: "PaySoft ZA", url: "https://www.paysoft.co.za/pricing/" },
  { slug: "paymaster", label: "Paymaster ZA", url: "https://www.paymaster.co.za/pricing/" },
  { slug: "labournet-payroll", label: "LabourNet ZA", url: "https://www.labournet.com/payroll/" },

  // HR
  { slug: "sage-hr", label: "Sage HR", url: "https://www.sage.com/en-za/products/sage-hr/" },
  { slug: "bamboohr", label: "BambooHR", url: "https://www.bamboohr.com/pricing" },
  { slug: "zoho-people", label: "Zoho People ZA", url: "https://www.zoho.com/za/people/pricing/" },
  { slug: "peoplehr", label: "People HR", url: "https://www.peoplehr.com/en-gb/pricing/" },
  { slug: "sap-successfactors", label: "SAP SuccessFactors", url: "https://www.sap.com/products/hcm/pricing.html" },
  { slug: "workday-hcm", label: "Workday HCM", url: "https://www.workday.com/en-us/products/human-capital-management/overview.html" },

  // CRM
  { slug: "zoho-crm", label: "Zoho CRM ZA", url: "https://www.zoho.com/za/crm/zohocrm-pricing.html" },
  { slug: "salesforce-sales-cloud", label: "Salesforce Sales Cloud", url: "https://www.salesforce.com/eu/sales/pricing/" },
  { slug: "hubspot-crm", label: "HubSpot", url: "https://www.hubspot.com/pricing/crm" },
  { slug: "pipedrive", label: "Pipedrive", url: "https://www.pipedrive.com/en/pricing" },
  { slug: "freshsales", label: "Freshsales", url: "https://www.freshworks.com/crm/sales/pricing/" },
  { slug: "bitrix24", label: "Bitrix24", url: "https://www.bitrix24.com/prices/" },
  { slug: "insightly", label: "Insightly", url: "https://www.insightly.com/pricing/" },

  // ERP
  { slug: "odoo", label: "Odoo", url: "https://www.odoo.com/pricing" },
  { slug: "sap-business-one", label: "SAP Business One", url: "https://www.sap.com/products/erp/business-one.html" },
  { slug: "sage-200-evolution", label: "Sage 200 Evolution ZA", url: "https://www.sage.com/en-za/products/sage-200-evolution/" },
  { slug: "syspro", label: "SYSPRO ZA", url: "https://za.syspro.com/" },
  { slug: "dynamics-365-business-central", label: "Dynamics 365 Business Central", url: "https://www.microsoft.com/en-za/dynamics-365/products/business-central/pricing" },

  // Project management
  { slug: "monday-com", label: "monday.com", url: "https://monday.com/pricing" },
  { slug: "asana", label: "Asana", url: "https://asana.com/pricing" },
  { slug: "trello", label: "Trello", url: "https://trello.com/pricing" },
  { slug: "clickup", label: "ClickUp", url: "https://clickup.com/pricing" },
  { slug: "wrike", label: "Wrike", url: "https://www.wrike.com/price/" },
];

/** Currency figures worth looking at, in the currencies vendors actually quote. */
const MONEY =
  /(?:R\s?\d[\d\s.,]{0,10}|ZAR\s?\d[\d\s.,]{0,10}|US?\$\s?\d[\d.,]{0,8}|€\s?\d[\d.,]{0,8}|£\s?\d[\d.,]{0,8})/g;
const VAT = /(?:VAT|excl\.?\s|incl\.?\s|exclusive of|inclusive of|plus tax|ex tax)/gi;

function toText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function windows(text: string, pattern: RegExp, radius: number, cap: number) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    const start = Math.max(0, index - radius);
    const snippet = text.slice(start, Math.min(text.length, index + radius)).trim();
    const key = snippet.slice(0, 60);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(snippet);
    if (out.length >= cap) break;
  }
  return out;
}

async function main() {
  const outDir = path.join(process.cwd(), "data", "pricing");
  await mkdir(outDir, { recursive: true });

  const lines: string[] = [
    "# Pricing research report",
    "",
    `Generated ${new Date().toISOString()}`,
    "",
    "Raw extraction only. Figures still need a human to decide what they mean.",
    "",
  ];

  for (const target of TARGETS) {
    process.stdout.write(`  ${target.slug.padEnd(32)}`);
    try {
      const response = await fetch(target.url, {
        headers: { "user-agent": UA, "accept-language": "en-ZA,en;q=0.9" },
        redirect: "follow",
      });

      if (!response.ok) {
        console.log(`HTTP ${response.status}`);
        lines.push(`## ${target.label}\n`, `- URL: ${target.url}`, `- **BLOCKED: HTTP ${response.status}**`, "");
        continue;
      }

      const text = toText(await response.text());
      const money = windows(text, MONEY, 110, 14);
      const vat = windows(text, VAT, 90, 5);

      console.log(`ok  ${money.length} figures`);
      lines.push(
        `## ${target.label}`,
        "",
        `- URL: ${target.url}`,
        `- Text length: ${text.length}`,
        "",
        "### Money mentions",
        ...(money.length ? money.map((m) => `- ...${m}...`) : ["- none found"]),
        "",
        "### VAT mentions",
        ...(vat.length ? vat.map((m) => `- ...${m}...`) : ["- none found"]),
        "",
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`FAIL ${message}`);
      lines.push(`## ${target.label}\n`, `- URL: ${target.url}`, `- **FAILED: ${message}**`, "");
    }
  }

  const reportPath = path.join(outDir, "_research-report.md");
  await writeFile(reportPath, lines.join("\n"), "utf8");
  console.log(`\nReport written to ${reportPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
