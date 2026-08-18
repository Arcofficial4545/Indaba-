/**
 * The "best for" taxonomy.
 *
 * Buyers do not search for "accounting software". They search for "best
 * accounting software for sole traders in South Africa", and that is where the
 * volume sits. These terms are tagged onto products in the catalogue and then
 * crossed with categories to produce the /best landing pages.
 *
 * Two slugs per term, deliberately:
 *
 *   `slug`     the database key, singular, stable, never changes
 *   `urlSlug`  the plural reading form that appears in the URL
 *
 * The database key stays singular because it is a foreign key in
 * software_taxonomy and renaming it would orphan every tag. The URL form reads
 * as a sentence, which is what the page title needs.
 */

import { slugify } from "@/lib/utils";

export type TaxonomyKind = "business_size" | "role" | "industry";

export type TaxonomyTermSeed = {
  kind: TaxonomyKind;
  name: string;
  slug: string;
  /** How the term completes "best <category> for ...". */
  phrase: string;
  description: string;
};

export const TAXONOMY_TERMS: TaxonomyTermSeed[] = [
  /* Business size ---------------------------------------------------------- */
  {
    kind: "business_size",
    name: "Sole traders",
    slug: "sole-trader",
    phrase: "sole traders",
    description:
      "One person, no payroll, and a VAT registration that may or may not be needed yet. The deciding factors are the monthly cost and how little time the books take.",
  },
  {
    kind: "business_size",
    name: "Small businesses",
    slug: "small-business",
    phrase: "small businesses",
    description:
      "Two to twenty staff, a bookkeeper who is often also the office manager, and an external accountant who signs off. Familiarity matters as much as features.",
  },
  {
    kind: "business_size",
    name: "Growing businesses",
    slug: "growing-business",
    phrase: "growing businesses",
    description:
      "Headcount is climbing and the spreadsheets have started to break. What matters is whether the product still fits in three years without a migration.",
  },
  {
    kind: "business_size",
    name: "Medium businesses",
    slug: "medium-business",
    phrase: "medium sized businesses",
    description:
      "Fifty to two hundred staff, a finance team rather than a bookkeeper, and real reporting requirements. Permissions and audit trails stop being optional.",
  },
  {
    kind: "business_size",
    name: "Large businesses",
    slug: "large-business",
    phrase: "large businesses",
    description:
      "Multiple entities, consolidations and a finance function that answers to a board. Integration with what is already installed drives the decision.",
  },
  {
    kind: "business_size",
    name: "Enterprises",
    slug: "enterprise",
    phrase: "enterprises",
    description:
      "Implementation is a project with a budget and a partner, not a signup. Licence cost is rarely the largest line in the business case.",
  },
  {
    kind: "business_size",
    name: "Startups",
    slug: "startups",
    phrase: "startups",
    description:
      "Cash is the constraint and the requirements will change twice before year end. A free tier that grows up gracefully beats a discount on an annual contract.",
  },

  /* Role and buying situation ---------------------------------------------- */
  {
    kind: "role",
    name: "Accountants in practice",
    slug: "accountants",
    phrase: "accountants in practice",
    description:
      "Managing many client sets at once. Practice tooling, bulk client access and a partner programme count for more than any single feature.",
  },
  {
    kind: "role",
    name: "Sales teams",
    slug: "sales-teams",
    phrase: "sales teams",
    description:
      "Pipeline discipline, quoting and reporting a sales manager will actually read. Adoption by reps is the whole game.",
  },
  {
    kind: "role",
    name: "Consultants",
    slug: "consultants",
    phrase: "consultants",
    description:
      "Time is the product, so recording it accurately and billing it without a spreadsheet is the requirement.",
  },
  {
    kind: "role",
    name: "Agencies",
    slug: "agencies",
    phrase: "agencies",
    description:
      "Many small projects, shifting deadlines and clients who need visibility. Boards and workload views beat Gantt charts.",
  },
  {
    kind: "role",
    name: "VAT registered businesses",
    slug: "vat-registered",
    phrase: "VAT registered businesses",
    description:
      "The VAT201 has to reconcile to the ledger and the eFiling submission has to go through without figures being rebuilt by hand.",
  },
  {
    kind: "role",
    name: "Exporters",
    slug: "exporters",
    phrase: "exporters",
    description:
      "Multi currency invoicing, exchange differences posted correctly and zero rated supplies treated properly on the VAT201.",
  },
  {
    kind: "role",
    name: "Zoho users",
    slug: "zoho-users",
    phrase: "businesses already on Zoho",
    description:
      "The rest of the suite is already in place, so the integration is free and the switching cost is close to nothing.",
  },
  {
    kind: "role",
    name: "Microsoft shops",
    slug: "microsoft-shops",
    phrase: "Microsoft shops",
    description:
      "Everything already runs through Microsoft 365 and Teams. Products that live inside that stack win on adoption alone.",
  },
  {
    kind: "role",
    name: "Cost conscious buyers",
    slug: "cost-conscious",
    phrase: "cost conscious buyers",
    description:
      "The monthly figure is the decision. What matters is the real total in rand once VAT and the per user charge are counted.",
  },
  {
    kind: "role",
    name: "Complex payroll",
    slug: "complex-payroll",
    phrase: "complex payroll",
    description:
      "Shift workers, multiple pay frequencies, bargaining council rules and ETI claims that have to survive an EMP501 reconciliation.",
  },
  {
    kind: "role",
    name: "Simple payroll",
    slug: "simple-payroll",
    phrase: "simple payroll",
    description:
      "A handful of salaried staff on the same cycle. EMP201, IRP5 and UIF handled correctly, and nothing else in the way.",
  },
  {
    kind: "role",
    name: "Compliance heavy businesses",
    slug: "compliance-heavy",
    phrase: "compliance heavy businesses",
    description:
      "Audit trails, retention rules and reporting that stands up to scrutiny from SARS, an auditor or the Department of Employment and Labour.",
  },
  {
    kind: "role",
    name: "Complex sales processes",
    slug: "complex-sales",
    phrase: "complex sales processes",
    description:
      "Long cycles, several decision makers and approvals. Workflow and forecasting matter more than contact management.",
  },
  {
    kind: "role",
    name: "Marketing led businesses",
    slug: "marketing-led",
    phrase: "marketing led businesses",
    description:
      "Leads arrive from content and campaigns rather than cold calling, so attribution and nurture sequences carry the weight.",
  },
  {
    kind: "role",
    name: "People focused teams",
    slug: "people-focused",
    phrase: "people focused teams",
    description:
      "Performance conversations, leave that respects BCEA entitlements and a self service portal staff will log into willingly.",
  },
  {
    kind: "role",
    name: "Businesses outsourcing payroll",
    slug: "outsourcing",
    phrase: "businesses outsourcing payroll",
    description:
      "A bureau or accountant runs the payroll. What matters is what they already use and how cleanly the data comes back.",
  },
  {
    kind: "role",
    name: "Established businesses",
    slug: "established-business",
    phrase: "established businesses",
    description:
      "Years of history to carry across, staff who know the current system and a low appetite for a migration that goes wrong.",
  },
  {
    kind: "role",
    name: "Businesses with unreliable connectivity",
    slug: "unreliable-connectivity",
    phrase: "businesses with unreliable connectivity",
    description:
      "Load shedding and thin rural links are real constraints. Desktop software that keeps working through an outage still earns its place.",
  },

  /* Industry --------------------------------------------------------------- */
  {
    kind: "industry",
    name: "Manufacturing",
    slug: "manufacturing",
    phrase: "manufacturers",
    description:
      "Bills of material, work orders and costing that reflects what a run actually consumed rather than what it was meant to.",
  },
  {
    kind: "industry",
    name: "Distribution",
    slug: "distribution",
    phrase: "distributors",
    description:
      "Multiple warehouses, landed cost and stock valuation that holds up when the rand moves against you mid shipment.",
  },
  {
    kind: "industry",
    name: "Retail",
    slug: "retail",
    phrase: "retailers",
    description:
      "Point of sale that reconciles to the ledger, stock counted accurately and pricing changed without a spreadsheet.",
  },
  {
    kind: "industry",
    name: "Print and signage",
    slug: "print",
    phrase: "print and signage businesses",
    description:
      "Quoting that reflects real material use, job costing per order and a workflow built around jobs rather than invoices.",
  },
  {
    kind: "industry",
    name: "Stock heavy businesses",
    slug: "stock-heavy",
    phrase: "stock heavy businesses",
    description:
      "Serial and batch tracking, multiple locations and valuation methods applied properly rather than approximated.",
  },
  {
    kind: "industry",
    name: "Telesales",
    slug: "telesales",
    phrase: "telesales teams",
    description:
      "Call volume is the metric. Dialling, call logging and scripting inside the record, with reporting per agent.",
  },
  {
    kind: "industry",
    name: "Multinationals",
    slug: "multinational",
    phrase: "multinationals",
    description:
      "Several countries, several currencies and a group reporting pack that has to consolidate without manual adjustment.",
  },
];

/** The URL form of a term, always derived so the two cannot drift apart. */
export function termUrlSlug(term: TaxonomyTermSeed): string {
  return slugify(term.phrase);
}

const BY_SLUG = new Map(TAXONOMY_TERMS.map((term) => [term.slug, term]));
const BY_URL_SLUG = new Map(
  TAXONOMY_TERMS.map((term) => [termUrlSlug(term), term]),
);

export function findTermBySlug(slug: string): TaxonomyTermSeed | null {
  return BY_SLUG.get(slug) ?? null;
}

export function findTermByUrlSlug(slug: string): TaxonomyTermSeed | null {
  return BY_URL_SLUG.get(slug) ?? null;
}

/**
 * The `/best/...` path is `<category>-for-<term>`, for example
 * `accounting-software-for-sole-traders`. Category slugs and term URL slugs
 * never contain the literal `-for-`, which is what makes the split safe.
 */
export const BEST_FOR_SEPARATOR = "-for-";

export function bestForSlug(categorySlug: string, term: TaxonomyTermSeed): string {
  return `${categorySlug}${BEST_FOR_SEPARATOR}${termUrlSlug(term)}`;
}

export function parseBestForSlug(
  slug: string,
): { categorySlug: string; term: TaxonomyTermSeed } | null {
  const index = slug.indexOf(BEST_FOR_SEPARATOR);
  if (index <= 0) return null;

  const categorySlug = slug.slice(0, index);
  const termSlug = slug.slice(index + BEST_FOR_SEPARATOR.length);
  const term = findTermByUrlSlug(termSlug);
  if (!categorySlug || !term) return null;

  return { categorySlug, term };
}
