/**
 * Editorial introductions per category.
 *
 * These say what a South African buyer should actually check, in the specific
 * terms they will meet on a vendor call. Generic advice about "scalability"
 * helps nobody; knowing to ask whether the VAT201 export reconciles without
 * rebuilding the figures does.
 */

export type CategoryIntro = {
  standfirst: string;
  checklist: { title: string; body: string }[];
};

export const CATEGORY_INTROS: Record<string, CategoryIntro> = {
  "accounting-software": {
    standfirst:
      "Accounting software gets chosen once and lived with for years, so the decision deserves more than a feature comparison. In South Africa the deciding factors are usually compliance, bank feeds and whoever does your books.",
    checklist: [
      {
        title: "VAT201 and SARS eFiling",
        body: "The VAT201 report should reconcile to the ledger without anyone rebuilding figures in a spreadsheet. Ask to see a real return produced from real data, covering standard rated, zero rated and exempt supplies at the 15% standard rate.",
      },
      {
        title: "Bank feed coverage",
        body: "Support for Absa, FNB, Standard Bank, Nedbank and Capitec varies between products, and sometimes between account types at the same bank. Confirm your own accounts specifically rather than trusting a logo on a marketing page.",
      },
      {
        title: "Who does your books",
        body: "If an external accountant or bookkeeper maintains your ledger, their familiarity with the package matters more than any feature. A system your practitioner knows well will cost you less in billed hours than a better system they have to learn.",
      },
      {
        title: "Working offline",
        body: "Load shedding still makes desktop software genuinely useful in some sectors. If your business cannot stop when connectivity does, weigh that honestly against the convenience of cloud access.",
      },
    ],
  },

  "payroll-software": {
    standfirst:
      "Payroll is the least forgiving software a small business runs. It has hard deadlines, statutory formats and penalties for getting it wrong, so the bar is correctness rather than elegance.",
    checklist: [
      {
        title: "EMP201 and EMP501",
        body: "Monthly EMP201 declarations and the biannual EMP501 reconciliation must come out of the system cleanly. The reconciliation is where weak payroll software shows itself, because it has to agree with twelve months of submissions.",
      },
      {
        title: "IRP5, IT3(a) and e@syFile",
        body: "Certificates must export in a format e@syFile accepts without manual editing. Ask specifically about the current tax year's file layout, since SARS changes it.",
      },
      {
        title: "UIF, SDL and ETI",
        body: "UIF declarations to the Department of Employment and Labour, the skills development levy and the Employment Tax Incentive should all calculate automatically. ETI in particular is easy to under claim by hand.",
      },
      {
        title: "ACB payment files and BCEA leave",
        body: "Salary runs should produce an ACB file your bank accepts, and leave should accrue according to BCEA entitlements rather than a generic overseas default.",
      },
    ],
  },

  "hr-software": {
    standfirst:
      "HR software earns its keep by removing admin rather than by adding dashboards. For most South African businesses under two hundred people, leave, records and performance are the whole requirement.",
    checklist: [
      {
        title: "BCEA leave rules",
        body: "Annual, sick and family responsibility leave should follow BCEA entitlements out of the box. International products often model a generic policy that has to be configured into compliance, which is a task somebody has to own.",
      },
      {
        title: "Payroll integration",
        body: "If leave and payroll do not talk to each other, somebody re captures the numbers every month. That is where errors enter.",
      },
      {
        title: "Employment equity reporting",
        body: "Businesses above the designated employer thresholds need workforce data in a form that supports EEA2 and EEA4 reporting. Check whether the system stores the fields required rather than assuming it does.",
      },
      {
        title: "Pricing basis",
        body: "Most HR products price per employee per month. Model the cost at the headcount you expect in two years, not the one you have now.",
      },
    ],
  },

  "crm-software": {
    standfirst:
      "A CRM only works if the sales team uses it, which makes adoption the real selection criterion. The most capable system in the category is worthless if deals still live in somebody's inbox.",
    checklist: [
      {
        title: "Time to first value",
        body: "If a sales person cannot log a call and move a deal within a day of being shown it, adoption will fail regardless of what the system can do.",
      },
      {
        title: "Quoting and accounting links",
        body: "Quotes that become invoices without re keying save real time. Check the integration with whatever ledger you run, and whether it handles rand amounts and VAT correctly.",
      },
      {
        title: "WhatsApp and local channels",
        body: "A great deal of South African business is done on WhatsApp. A CRM that cannot record those conversations is missing most of the relationship.",
      },
      {
        title: "Cost at scale",
        body: "Per seat pricing and contact tier pricing both climb steeply. Model the cost at double your current size before committing, particularly on products with generous free tiers.",
      },
    ],
  },

  "erp-software": {
    standfirst:
      "ERP is the point at which software stops being a purchase and becomes a project. The licence is rarely the largest number on the page, and the implementation partner matters as much as the product.",
    checklist: [
      {
        title: "Total first year cost",
        body: "Ask for licence, implementation, data migration, training and support as one figure. Implementation frequently exceeds the first year of licence fees, and a quote that omits it is not a quote.",
      },
      {
        title: "The partner, not just the product",
        body: "Most ERP in South Africa is sold and implemented through partners of uneven quality. Ask to speak to two of their clients in your industry, and ask those clients what went wrong rather than what went well.",
      },
      {
        title: "Local statutory reporting",
        body: "VAT, and where relevant customs and excise, must be handled natively. Global ERP products usually need a localisation pack, so confirm it is included and currently maintained.",
      },
      {
        title: "What it replaces",
        body: "The business case is normally the systems and reconciliation work it removes. If you cannot name what gets switched off, the project is unlikely to pay for itself.",
      },
    ],
  },

  "project-management": {
    standfirst:
      "Project management tools are the easiest category to buy and the easiest to abandon. Most teams need less than they think, and the tool that gets used beats the tool that impresses.",
    checklist: [
      {
        title: "Match the tool to the work",
        body: "A board is enough for most teams. Dependencies, critical paths and resource levelling only matter if somebody will genuinely maintain them.",
      },
      {
        title: "Guest and client access",
        body: "If clients need visibility, check whether guest seats are free or billed. This is where per seat pricing quietly doubles.",
      },
      {
        title: "Time tracking and billing",
        body: "Agencies and consultancies should check whether tracked time flows into an invoice without export and re import.",
      },
      {
        title: "Offline and mobile",
        body: "Site based teams need apps that work on a weak connection. Test this on mobile data rather than on office fibre.",
      },
    ],
  },
};

export function getCategoryIntro(slug: string): CategoryIntro | null {
  return CATEGORY_INTROS[slug] ?? null;
}
