/**
 * Researched pricing.
 *
 * Every figure here was gathered on 2026-08-18 and carries a verification
 * level, because "R450" is worthless without knowing where it came from and
 * whether VAT is in it. The harnesses that produced the raw evidence are
 * scripts/research-pricing.ts and scripts/research-pricing-deep.ts, and the
 * human readable audit trail is data/pricing/SOURCES.md.
 *
 * Verification levels, in descending order of confidence:
 *
 *   vendor-page          Fetched the vendor's own pricing page and read the
 *                        figure off it. Only this level sets price_verified_at.
 *   vendor-page-indexed  The figure comes from the vendor's own page, but the
 *                        page blocks automated access, so it was read through
 *                        a search index rather than fetched. Needs a human to
 *                        confirm in a browser.
 *   quote-only           The vendor genuinely publishes no list price. This is
 *                        a fact about the product, not a research failure.
 *   unconfirmed          Could not be established. Renders as unverified.
 *
 * A single module rather than 39 JSON files: this gets type checked, so the
 * seed script and the fallback data cannot drift apart from it.
 */

export type Verification =
  | "vendor-page"
  | "vendor-page-indexed"
  | "quote-only"
  | "unconfirmed";

/**
 * Reference rate used for every product a vendor quotes in a foreign currency.
 * Stated rather than silent, because a rand figure derived from dollars is a
 * different kind of number from one the vendor actually charges in rand.
 */
export const FX = {
  source: "European Central Bank reference rates via frankfurter.app",
  date: "2026-08-17",
  usdToZar: 16.1767,
  gbpToZar: 21.9342,
  eurToZar: 18.7536,
} as const;

export type PricingPlanRecord = {
  name: string;
  /** Amount in the currency the vendor actually quotes. */
  amount: number | null;
  currency: "ZAR" | "USD" | "GBP" | "EUR";
  period: "month" | "year" | "user" | "employee";
  /** Null where the vendor does not say. */
  vatInclusive: boolean | null;
  note?: string;
  highlighted?: boolean;
};

export type PricingRecord = {
  slug: string;
  /** The entry level published price, in the vendor's own currency. */
  startingAmount: number | null;
  currency: "ZAR" | "USD" | "GBP" | "EUR";
  period: "month" | "year" | "user" | "employee";
  vatInclusive: boolean | null;
  freeTrialDays: number | null;
  freeVersion: boolean;
  verification: Verification;
  sourceUrl: string;
  checkedAt: string;
  notes: string;
  plans?: PricingPlanRecord[];
};

const CHECKED = "2026-08-18";

export const PRICING: Record<string, PricingRecord> = {
  /* ------------------------------------------------------------------ */
  /* Accounting                                                          */
  /* ------------------------------------------------------------------ */

  xero: {
    slug: "xero",
    startingAmount: 450,
    currency: "ZAR",
    period: "month",
    vatInclusive: true,
    freeTrialDays: 30,
    freeVersion: false,
    verification: "vendor-page",
    sourceUrl: "https://www.xero.com/za/pricing-plans/",
    checkedAt: CHECKED,
    notes:
      "The page states plainly that prices are in ZAR including VAT. An 80% discount runs for the first three months, which is why the advertised figure looks lower than the ongoing one.",
    plans: [
      { name: "Starter", amount: 450, currency: "ZAR", period: "month", vatInclusive: true, note: "20 invoices and 5 bills a month" },
      { name: "Standard", amount: 795, currency: "ZAR", period: "month", vatInclusive: true, note: "Unlimited invoices and bills", highlighted: true },
      { name: "Premium", amount: 1095, currency: "ZAR", period: "month", vatInclusive: true, note: "Adds multi currency" },
    ],
  },

  "zoho-books": {
    slug: "zoho-books",
    startingAmount: 99,
    currency: "ZAR",
    period: "month",
    vatInclusive: false,
    freeTrialDays: 14,
    freeVersion: true,
    verification: "vendor-page",
    sourceUrl: "https://www.zoho.com/za/books/pricing/",
    checkedAt: CHECKED,
    notes:
      "Rand pricing on Zoho's South African site. The page states prices are exclusive of local taxes, so add 15% VAT. Priced per organisation rather than per user, which makes it unusually cheap for small teams. The annual commitment is materially cheaper.",
    plans: [
      { name: "Free", amount: 0, currency: "ZAR", period: "month", vatInclusive: false, note: "Solopreneurs and micro businesses" },
      { name: "Standard", amount: 99, currency: "ZAR", period: "month", vatInclusive: false, note: "R82.50 billed annually", highlighted: true },
      { name: "Professional", amount: 199, currency: "ZAR", period: "month", vatInclusive: false, note: "R165.83 billed annually" },
      { name: "Premium", amount: 299, currency: "ZAR", period: "month", vatInclusive: false, note: "R249.17 billed annually" },
      { name: "Elite", amount: 1290, currency: "ZAR", period: "month", vatInclusive: false, note: "Adds full inventory management" },
      { name: "Ultimate", amount: 2490, currency: "ZAR", period: "month", vatInclusive: false, note: "Adds business intelligence" },
    ],
  },

  "sage-accounting": {
    slug: "sage-accounting",
    startingAmount: 240,
    currency: "ZAR",
    period: "month",
    vatInclusive: true,
    freeTrialDays: 30,
    freeVersion: false,
    verification: "vendor-page-indexed",
    sourceUrl: "https://www.sage.com/en-za/sage-business-cloud/accounting/pricing/",
    checkedAt: CHECKED,
    notes:
      "Sage returns 403 to every automated request, so this could not be read off the page directly. The figures come from Sage's own South African pricing page through a search index: Accounting Start from R240 a month including VAT, Accounting Standard from R435 a month for two users including VAT. Confirm in a browser before relying on it.",
    plans: [
      { name: "Accounting Start", amount: 240, currency: "ZAR", period: "month", vatInclusive: true, note: "Single user" },
      { name: "Accounting Standard", amount: 435, currency: "ZAR", period: "month", vatInclusive: true, note: "Two users", highlighted: true },
    ],
  },

  "quickbooks-online": {
    slug: "quickbooks-online",
    startingAmount: null,
    currency: "ZAR",
    period: "month",
    vatInclusive: null,
    freeTrialDays: 30,
    freeVersion: false,
    verification: "unconfirmed",
    sourceUrl: "https://quickbooks.intuit.com/za/pricing/",
    checkedAt: CHECKED,
    notes:
      "The South African pricing page renders its figures client side and exposes nothing to a plain fetch. The 30 day free trial is confirmed. The price itself needs a manual check in a browser.",
  },

  freshbooks: {
    slug: "freshbooks",
    startingAmount: 21,
    currency: "USD",
    period: "month",
    vatInclusive: false,
    freeTrialDays: 30,
    freeVersion: false,
    verification: "vendor-page",
    sourceUrl: "https://www.freshbooks.com/pricing",
    checkedAt: CHECKED,
    notes:
      "FreshBooks quotes in US dollars with no South African rand pricing, so the rand figure shown here is converted at the stated reference rate and will move with the exchange rate. Card charges may also attract a currency conversion fee from your bank.",
    plans: [
      { name: "Lite", amount: 21, currency: "USD", period: "month", vatInclusive: false, note: "5 billable clients" },
      { name: "Plus", amount: 38, currency: "USD", period: "month", vatInclusive: false, note: "50 billable clients", highlighted: true },
      { name: "Premium", amount: 65, currency: "USD", period: "month", vatInclusive: false, note: "Unlimited clients" },
    ],
  },

  "wave-accounting": {
    slug: "wave-accounting",
    startingAmount: 0,
    currency: "USD",
    period: "month",
    vatInclusive: null,
    freeTrialDays: null,
    freeVersion: true,
    verification: "vendor-page",
    sourceUrl: "https://www.waveapps.com/pricing",
    checkedAt: CHECKED,
    notes:
      "Wave's accounting and invoicing are free to use. It earns on payment processing instead. Note that Wave has no South African bank feeds and no VAT201 support, so it suits sole traders invoicing in foreign currency far better than a VAT registered local business.",
  },

  "sage-50cloud-pastel": {
    slug: "sage-50cloud-pastel",
    startingAmount: null,
    currency: "ZAR",
    period: "month",
    vatInclusive: null,
    freeTrialDays: null,
    freeVersion: false,
    verification: "quote-only",
    sourceUrl: "https://www.sage.com/en-za/products/sage-50cloud-pastel/",
    checkedAt: CHECKED,
    notes:
      "Sold through Sage business partners rather than at a published list price, and the cost depends on modules and user count. Sage also blocks automated access to the page.",
  },

  "omni-accounts": {
    slug: "omni-accounts",
    startingAmount: null,
    currency: "ZAR",
    period: "month",
    vatInclusive: null,
    freeTrialDays: null,
    freeVersion: true,
    verification: "quote-only",
    sourceUrl: "https://www.omniaccounts.co.za/",
    checkedAt: CHECKED,
    notes:
      "South African vendor selling through a partner network. Pricing is modular and quoted per business, with a free entry level edition available.",
  },

  "quickeasy-bos": {
    slug: "quickeasy-bos",
    startingAmount: null,
    currency: "ZAR",
    period: "month",
    vatInclusive: null,
    freeTrialDays: null,
    freeVersion: false,
    verification: "quote-only",
    sourceUrl: "https://www.quickeasy.co.za/",
    checkedAt: CHECKED,
    notes:
      "South African business operating system sold on a quoted basis, scoped per business.",
  },

  /* ------------------------------------------------------------------ */
  /* Payroll                                                             */
  /* ------------------------------------------------------------------ */

  simplepay: {
    slug: "simplepay",
    startingAmount: null,
    currency: "ZAR",
    period: "employee",
    vatInclusive: false,
    freeTrialDays: 30,
    freeVersion: false,
    verification: "vendor-page",
    sourceUrl: "https://www.simplepay.co.za/pricing",
    checkedAt: CHECKED,
    notes:
      "One plan with every feature included, charged on a base price plus a per employee rate that steps down as headcount rises. The exact rate sits behind a quote calculator, so the headline figure is deliberately not stated here. The page confirms prices are exclusive of VAT and that there is a 30 day free onboarding period. Businesses over 500 employees and accounting practices are quoted separately.",
  },

  payspace: {
    slug: "payspace",
    startingAmount: null,
    currency: "ZAR",
    period: "employee",
    vatInclusive: null,
    freeTrialDays: null,
    freeVersion: false,
    verification: "quote-only",
    sourceUrl: "https://www.payspace.com/",
    checkedAt: CHECKED,
    notes:
      "Quoted per business. Pricing depends on headcount and on how many African countries you run payroll in, which is the case PaySpace is built for.",
  },

  "sage-pastel-payroll": {
    slug: "sage-pastel-payroll",
    startingAmount: null,
    currency: "ZAR",
    period: "month",
    vatInclusive: null,
    freeTrialDays: 30,
    freeVersion: false,
    verification: "unconfirmed",
    sourceUrl: "https://www.sage.com/en-za/products/sage-pastel-payroll/",
    checkedAt: CHECKED,
    notes:
      "Priced in bands by employee count and sold through Sage partners. Sage blocks automated access, so the current band pricing needs a manual check.",
  },

  "sage-business-cloud-payroll": {
    slug: "sage-business-cloud-payroll",
    startingAmount: null,
    currency: "ZAR",
    period: "month",
    vatInclusive: null,
    freeTrialDays: 30,
    freeVersion: false,
    verification: "unconfirmed",
    sourceUrl: "https://www.sage.com/africa/sage-business-cloud/payroll/pricing/",
    checkedAt: CHECKED,
    notes:
      "Sage publishes a payroll pricing page for Africa but blocks automated access to it. Priced in employee count bands. Needs a manual check.",
  },

  paysoft: {
    slug: "paysoft",
    startingAmount: null,
    currency: "ZAR",
    period: "employee",
    vatInclusive: null,
    freeTrialDays: null,
    freeVersion: false,
    verification: "quote-only",
    sourceUrl: "https://www.paysoft.co.za/",
    checkedAt: CHECKED,
    notes: "South African payroll vendor quoting per business on headcount.",
  },

  paymaster: {
    slug: "paymaster",
    startingAmount: null,
    currency: "ZAR",
    period: "employee",
    vatInclusive: null,
    freeTrialDays: null,
    freeVersion: false,
    verification: "quote-only",
    sourceUrl: "https://www.paymaster.co.za/",
    checkedAt: CHECKED,
    notes:
      "Outsourced and in house payroll from a South African provider, quoted per business.",
  },

  "labournet-payroll": {
    slug: "labournet-payroll",
    startingAmount: null,
    currency: "ZAR",
    period: "employee",
    vatInclusive: null,
    freeTrialDays: null,
    freeVersion: false,
    verification: "quote-only",
    sourceUrl: "https://www.labournet.com/",
    checkedAt: CHECKED,
    notes:
      "Sold as part of a broader compliance and industrial relations service rather than as standalone software, and quoted accordingly.",
  },

  /* ------------------------------------------------------------------ */
  /* HR                                                                  */
  /* ------------------------------------------------------------------ */

  "sage-hr": {
    slug: "sage-hr",
    startingAmount: null,
    currency: "ZAR",
    period: "employee",
    vatInclusive: null,
    freeTrialDays: 30,
    freeVersion: false,
    verification: "unconfirmed",
    sourceUrl: "https://www.sage.com/en-za/products/sage-hr/",
    checkedAt: CHECKED,
    notes:
      "Priced per employee per month with modules added individually. Sage blocks automated access, so the per employee rate needs a manual check.",
  },

  bamboohr: {
    slug: "bamboohr",
    startingAmount: 17,
    currency: "USD",
    period: "employee",
    vatInclusive: false,
    freeTrialDays: 7,
    freeVersion: false,
    verification: "vendor-page",
    sourceUrl: "https://www.bamboohr.com/pricing",
    checkedAt: CHECKED,
    notes:
      "The Pro tier is listed at 17 US dollars per employee per month. The entry level Core tier is quoted rather than listed. There is no rand pricing, so the figure shown here is converted at the stated reference rate. BambooHR carries no South African statutory logic at all, which matters more than the price for most local buyers.",
    plans: [
      { name: "Core", amount: null, currency: "USD", period: "employee", vatInclusive: false, note: "Quoted, not listed" },
      { name: "Pro", amount: 17, currency: "USD", period: "employee", vatInclusive: false, note: "Adds performance management", highlighted: true },
    ],
  },

  "zoho-people": {
    slug: "zoho-people",
    startingAmount: null,
    currency: "ZAR",
    period: "employee",
    vatInclusive: null,
    freeTrialDays: 15,
    freeVersion: false,
    verification: "unconfirmed",
    sourceUrl: "https://www.zoho.com/people/",
    checkedAt: CHECKED,
    notes:
      "Zoho publishes rand pricing for other products in the suite, so rand pricing is likely, but the People pricing page could not be reached at the expected address. Needs a manual check.",
  },

  peoplehr: {
    slug: "peoplehr",
    startingAmount: 3,
    currency: "GBP",
    period: "employee",
    vatInclusive: false,
    freeTrialDays: 14,
    freeVersion: false,
    verification: "vendor-page",
    sourceUrl: "https://www.peoplehr.com/en-gb/pricing/",
    checkedAt: CHECKED,
    notes:
      "Quoted in pounds per employee per month across four tiers. The rand figure here is converted at the stated reference rate and carries exchange rate risk on every renewal.",
    plans: [
      { name: "Starter", amount: 3, currency: "GBP", period: "employee", vatInclusive: false },
      { name: "Core", amount: 5.5, currency: "GBP", period: "employee", vatInclusive: false, highlighted: true },
      { name: "Pro", amount: 8, currency: "GBP", period: "employee", vatInclusive: false },
      { name: "Elite", amount: 9.5, currency: "GBP", period: "employee", vatInclusive: false },
    ],
  },

  "sap-successfactors": {
    slug: "sap-successfactors",
    startingAmount: null,
    currency: "USD",
    period: "employee",
    vatInclusive: null,
    freeTrialDays: null,
    freeVersion: false,
    verification: "quote-only",
    sourceUrl: "https://www.sap.com/products/hcm.html",
    checkedAt: CHECKED,
    notes:
      "Enterprise HCM sold through SAP and its partners on a quoted basis. Implementation normally exceeds the first year of licence cost.",
  },

  "workday-hcm": {
    slug: "workday-hcm",
    startingAmount: null,
    currency: "USD",
    period: "employee",
    vatInclusive: null,
    freeTrialDays: null,
    freeVersion: false,
    verification: "quote-only",
    sourceUrl:
      "https://www.workday.com/en-us/products/human-capital-management/overview.html",
    checkedAt: CHECKED,
    notes:
      "Workday publishes no list price anywhere. Pricing is negotiated per organisation and is aimed at large enterprises.",
  },

  /* ------------------------------------------------------------------ */
  /* CRM                                                                 */
  /* ------------------------------------------------------------------ */

  "zoho-crm": {
    slug: "zoho-crm",
    startingAmount: null,
    currency: "ZAR",
    period: "user",
    vatInclusive: null,
    freeTrialDays: 15,
    freeVersion: true,
    verification: "unconfirmed",
    sourceUrl: "https://www.zoho.com/crm/zohocrm-pricing.html",
    checkedAt: CHECKED,
    notes:
      "Zoho prices its South African editions in rand, and the CRM pricing page hints at a per user rand figure, but it could not be read cleanly enough to publish. There is a free tier for up to three users. Needs a manual check on the South African edition of the page.",
  },

  "salesforce-sales-cloud": {
    slug: "salesforce-sales-cloud",
    startingAmount: 25,
    currency: "USD",
    period: "user",
    vatInclusive: false,
    freeTrialDays: 30,
    freeVersion: true,
    verification: "vendor-page",
    sourceUrl: "https://www.salesforce.com/eu/sales/pricing/",
    checkedAt: CHECKED,
    notes:
      "Quoted in dollars, euro and pounds but not in rand. Starter Suite is 25 dollars per user per month billed monthly or annually, rising steeply through the tiers. The rand figure here is converted at the stated reference rate.",
    plans: [
      { name: "Free Suite", amount: 0, currency: "USD", period: "user", vatInclusive: false },
      { name: "Starter Suite", amount: 25, currency: "USD", period: "user", vatInclusive: false, highlighted: true },
      { name: "Pro Suite", amount: 100, currency: "USD", period: "user", vatInclusive: false, note: "Billed annually" },
      { name: "Enterprise", amount: 175, currency: "USD", period: "user", vatInclusive: false, note: "Billed annually" },
      { name: "Unlimited", amount: 350, currency: "USD", period: "user", vatInclusive: false, note: "Billed annually" },
    ],
  },

  "hubspot-crm": {
    slug: "hubspot-crm",
    startingAmount: 0,
    currency: "USD",
    period: "user",
    vatInclusive: false,
    freeTrialDays: 14,
    freeVersion: true,
    verification: "unconfirmed",
    sourceUrl: "https://www.hubspot.com/pricing/crm",
    checkedAt: CHECKED,
    notes:
      "The free CRM tier is real and genuinely usable, which is the figure shown. Paid tier pricing renders client side and could not be read, and HubSpot's cost model depends heavily on marketing contact volumes rather than on seats alone, so model it against your own list size before committing.",
  },

  pipedrive: {
    slug: "pipedrive",
    startingAmount: null,
    currency: "USD",
    period: "user",
    vatInclusive: null,
    freeTrialDays: 14,
    freeVersion: false,
    verification: "unconfirmed",
    sourceUrl: "https://www.pipedrive.com/en/pricing",
    checkedAt: CHECKED,
    notes:
      "Pipedrive blocks automated access to its pricing page. Priced per seat per month in dollars or euro with no rand option. Needs a manual check.",
  },

  freshsales: {
    slug: "freshsales",
    startingAmount: null,
    currency: "USD",
    period: "user",
    vatInclusive: null,
    freeTrialDays: 21,
    freeVersion: true,
    verification: "unconfirmed",
    sourceUrl: "https://www.freshworks.com/crm/",
    checkedAt: CHECKED,
    notes:
      "Priced per user per month in dollars with a free tier. The pricing page could not be reached at the expected address and needs a manual check.",
  },

  bitrix24: {
    slug: "bitrix24",
    startingAmount: 49,
    currency: "USD",
    period: "month",
    vatInclusive: false,
    freeTrialDays: 15,
    freeVersion: true,
    verification: "vendor-page",
    sourceUrl: "https://www.bitrix24.com/prices/",
    checkedAt: CHECKED,
    notes:
      "Priced per organisation rather than per user, which makes it unusually good value for a team of any size. Basic is 49 dollars a month billed annually or 69 billed monthly, and includes five users. Converted to rand at the stated reference rate.",
    plans: [
      { name: "Free", amount: 0, currency: "USD", period: "month", vatInclusive: false, note: "Unlimited users" },
      { name: "Basic", amount: 49, currency: "USD", period: "month", vatInclusive: false, note: "5 users, billed annually", highlighted: true },
      { name: "Standard", amount: 99, currency: "USD", period: "month", vatInclusive: false, note: "50 users, billed annually" },
      { name: "Professional", amount: 199, currency: "USD", period: "month", vatInclusive: false, note: "100 users, billed annually" },
      { name: "Enterprise", amount: 399, currency: "USD", period: "month", vatInclusive: false, note: "From 250 users, billed annually" },
    ],
  },

  insightly: {
    slug: "insightly",
    startingAmount: null,
    currency: "USD",
    period: "user",
    vatInclusive: null,
    freeTrialDays: 14,
    freeVersion: true,
    verification: "unconfirmed",
    sourceUrl: "https://www.insightly.com/pricing/",
    checkedAt: CHECKED,
    notes:
      "Blocks automated access. Priced per user per month in dollars. Needs a manual check.",
  },

  /* ------------------------------------------------------------------ */
  /* ERP                                                                 */
  /* ------------------------------------------------------------------ */

  odoo: {
    slug: "odoo",
    startingAmount: null,
    currency: "ZAR",
    period: "user",
    vatInclusive: null,
    freeTrialDays: 15,
    freeVersion: true,
    verification: "unconfirmed",
    sourceUrl: "https://www.odoo.com/pricing",
    checkedAt: CHECKED,
    notes:
      "Odoo localises pricing by country and renders the figure client side, so the rand rate could not be read. One app is free forever for unlimited users, which is genuine and is what the free tier flag reflects. The paid plans are per user per month. Needs a manual check for the South African rate.",
  },

  "sap-business-one": {
    slug: "sap-business-one",
    startingAmount: null,
    currency: "USD",
    period: "user",
    vatInclusive: null,
    freeTrialDays: null,
    freeVersion: false,
    verification: "quote-only",
    sourceUrl: "https://www.sap.com/products/erp/business-one.html",
    checkedAt: CHECKED,
    notes:
      "Sold and implemented through SAP partners. Licence, implementation, data migration and training are quoted together, and implementation frequently exceeds the first year of licence cost.",
  },

  "sage-200-evolution": {
    slug: "sage-200-evolution",
    startingAmount: null,
    currency: "ZAR",
    period: "user",
    vatInclusive: null,
    freeTrialDays: null,
    freeVersion: false,
    verification: "quote-only",
    sourceUrl: "https://www.sage.com/en-za/products/sage-200-evolution/",
    checkedAt: CHECKED,
    notes:
      "Sold through Sage business partners on a quoted basis, scoped by modules and user count.",
  },

  syspro: {
    slug: "syspro",
    startingAmount: null,
    currency: "ZAR",
    period: "user",
    vatInclusive: null,
    freeTrialDays: null,
    freeVersion: false,
    verification: "quote-only",
    sourceUrl: "https://za.syspro.com/",
    checkedAt: CHECKED,
    notes:
      "A South African founded ERP aimed at manufacturing and distribution, sold on a quoted basis through partners.",
  },

  "dynamics-365-business-central": {
    slug: "dynamics-365-business-central",
    startingAmount: null,
    currency: "USD",
    period: "user",
    vatInclusive: null,
    freeTrialDays: 30,
    freeVersion: false,
    verification: "unconfirmed",
    sourceUrl:
      "https://www.microsoft.com/en-za/dynamics-365/products/business-central/pricing",
    checkedAt: CHECKED,
    notes:
      "Microsoft runs a South African pricing page but renders the figures client side. Priced per user per month across Essentials and Premium tiers. Needs a manual check.",
  },

  /* ------------------------------------------------------------------ */
  /* Project management                                                  */
  /* ------------------------------------------------------------------ */

  "monday-com": {
    slug: "monday-com",
    startingAmount: 9,
    currency: "USD",
    period: "user",
    vatInclusive: false,
    freeTrialDays: 14,
    freeVersion: true,
    verification: "vendor-page",
    sourceUrl: "https://monday.com/pricing",
    checkedAt: CHECKED,
    notes:
      "Read from the structured data the pricing page publishes. Basic is 9 dollars per seat per month on an annual commitment and 12 billed monthly. Seats are sold in blocks of three, so the real entry cost is three seats, not one. Converted to rand at the stated reference rate.",
    plans: [
      { name: "Free", amount: 0, currency: "USD", period: "user", vatInclusive: false, note: "Up to 2 seats" },
      { name: "Basic", amount: 9, currency: "USD", period: "user", vatInclusive: false, note: "12 billed monthly" },
      { name: "Standard", amount: 12, currency: "USD", period: "user", vatInclusive: false, note: "14 billed monthly", highlighted: true },
      { name: "Pro", amount: 19, currency: "USD", period: "user", vatInclusive: false, note: "24 billed monthly" },
    ],
  },

  asana: {
    slug: "asana",
    startingAmount: 10.99,
    currency: "USD",
    period: "user",
    vatInclusive: false,
    freeTrialDays: 30,
    freeVersion: true,
    verification: "vendor-page",
    sourceUrl: "https://asana.com/pricing",
    checkedAt: CHECKED,
    notes:
      "Read from the structured data the pricing page publishes. Starter is 10.99 dollars per user per month billed annually, Advanced is 24.99. The free Personal tier supports up to ten collaborators. Converted to rand at the stated reference rate.",
    plans: [
      { name: "Personal", amount: 0, currency: "USD", period: "user", vatInclusive: false, note: "Up to 10 collaborators" },
      { name: "Starter", amount: 10.99, currency: "USD", period: "user", vatInclusive: false, note: "Billed annually", highlighted: true },
      { name: "Advanced", amount: 24.99, currency: "USD", period: "user", vatInclusive: false, note: "Billed annually" },
    ],
  },

  trello: {
    slug: "trello",
    startingAmount: 5,
    currency: "USD",
    period: "user",
    vatInclusive: false,
    freeTrialDays: 14,
    freeVersion: true,
    verification: "vendor-page",
    sourceUrl: "https://trello.com/pricing",
    checkedAt: CHECKED,
    notes:
      "Standard is 5 dollars per user per month billed annually and 6 billed monthly. Premium is 10 annually and 12.50 monthly. The free tier is genuinely usable for a small team. Converted to rand at the stated reference rate.",
    plans: [
      { name: "Free", amount: 0, currency: "USD", period: "user", vatInclusive: false, note: "Unlimited cards, 10 boards" },
      { name: "Standard", amount: 5, currency: "USD", period: "user", vatInclusive: false, note: "6 billed monthly", highlighted: true },
      { name: "Premium", amount: 10, currency: "USD", period: "user", vatInclusive: false, note: "12.50 billed monthly" },
    ],
  },

  clickup: {
    slug: "clickup",
    startingAmount: 10,
    currency: "USD",
    period: "user",
    vatInclusive: false,
    freeTrialDays: 14,
    freeVersion: true,
    verification: "unconfirmed",
    sourceUrl: "https://clickup.com/pricing",
    checkedAt: CHECKED,
    notes:
      "A per user monthly figure of 10 dollars appears on the page but could not be tied confidently to a named tier, so treat it as indicative. The free forever tier is real. Needs a manual check.",
  },

  wrike: {
    slug: "wrike",
    startingAmount: null,
    currency: "USD",
    period: "user",
    vatInclusive: null,
    freeTrialDays: 14,
    freeVersion: true,
    verification: "unconfirmed",
    sourceUrl: "https://www.wrike.com/price/",
    checkedAt: CHECKED,
    notes:
      "The 14 day free trial is confirmed. Per user pricing renders client side and could not be read. Needs a manual check.",
  },
};

/* -------------------------------------------------------------------------- */

/** Convert a foreign amount into rand at the recorded reference rate. */
export function toZar(amount: number, currency: PricingRecord["currency"]): number {
  switch (currency) {
    case "ZAR":
      return amount;
    case "USD":
      return Math.round(amount * FX.usdToZar);
    case "GBP":
      return Math.round(amount * FX.gbpToZar);
    case "EUR":
      return Math.round(amount * FX.eurToZar);
  }
}

export type ResolvedPrice = {
  /** Always in rand, ready to store on the software row. */
  zar: number | null;
  vatInclusive: boolean | null;
  /** True when the vendor does not quote in rand and this figure is derived. */
  converted: boolean;
  verified: boolean;
  sourceUrl: string;
  checkedAt: string | null;
  note: string;
};

/**
 * The single place that turns a research record into the numbers the software
 * row carries. Products the vendor prices in dollars keep an honest note
 * saying so, because a converted figure is not the same promise as a rand one.
 */
export function resolvePrice(slug: string): ResolvedPrice | null {
  const record = PRICING[slug];
  if (!record) return null;

  const converted = record.currency !== "ZAR" && record.startingAmount !== null;
  const verified = record.verification === "vendor-page";

  return {
    zar:
      record.startingAmount === null
        ? null
        : toZar(record.startingAmount, record.currency),
    vatInclusive: record.vatInclusive,
    converted,
    verified,
    sourceUrl: record.sourceUrl,
    // Only a figure read off the vendor's own page counts as verified.
    checkedAt: verified ? record.checkedAt : null,
    note: converted
      ? `${record.notes} Converted from ${record.currency} at ${FX.usdToZar} to the rand, ${FX.source}, ${FX.date}.`
      : record.notes,
  };
}
