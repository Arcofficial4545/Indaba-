/**
 * The product catalogue.
 *
 * 39 products across six categories, chosen because South African businesses
 * actually shortlist them rather than because they rank well globally. That is
 * why SYSPRO, Omni Accounts, PaySoft and Paymaster appear alongside Salesforce
 * and Asana.
 *
 * Pricing is not stored here. It comes from lib/content/pricing.ts, which
 * carries its own provenance, so a price can never be edited into this file
 * without an accompanying source.
 *
 * Editorial standard: plain sentences, real specifics, honest about
 * weaknesses, British and South African spelling, and no em dashes.
 */

export type CatalogueEntry = {
  slug: string;
  name: string;
  categorySlug: string;
  tagline: string;
  descriptionShort: string;
  /** HTML, rendered into .prose-content on the profile page. */
  descriptionFull: string;
  vendorName: string;
  vendorWebsite: string;
  foundedYear: number | null;
  featured: boolean;

  topFeatures: string[];
  features: string[];
  integrations: string[];
  supportTypes: string[];
  countries: string[];
  languages: string[];

  /** Target averages the review generator aims at. */
  rating: number;
  ease: number;
  value: number;
  service: number;
  functionality: number;
  reviewCount: number;

  /** Curated alternatives by slug, in order. Never left to chance. */
  alternatives: string[];
  /** Best for taxonomy terms. */
  bestFor: string[];
};

export const CATALOGUE: CatalogueEntry[] = [
  /* ==================================================================== */
  /* Accounting                                                            */
  /* ==================================================================== */
  {
    slug: "sage-accounting",
    name: "Sage Accounting",
    categorySlug: "accounting-software",
    tagline: "Cloud accounting built around South African tax",
    descriptionShort:
      "Sage Accounting handles VAT201 preparation and SARS eFiling submissions without rebuilding figures, which is why it stays on most local shortlists even when the interface loses on looks.",
    descriptionFull: `
<p>Sage Accounting is the cloud package most South African bookkeepers reach for first, and the reason is compliance rather than charm. The VAT201 report reconciles to the ledger, the eFiling submission works, and the whole tax side of the product was built for this market rather than localised into it afterwards.</p>
<p>The everyday experience is competent without being remarkable. Bank feeds from the major banks pull through and the reconciliation suggestions are usually right. Invoicing, quoting and supplier management all do what you expect. Where it falls behind newer products is in polish and in the depth of its add on ecosystem, and Sage has been slow to close that gap.</p>
<p>What it buys you is the largest pool of local practitioners who already know it. If an external accountant maintains your books, the odds are good that they work in Sage daily, and that familiarity translates directly into fewer billed hours. For a VAT registered business with straightforward requirements, that is usually the deciding argument.</p>
<p>Support answers during South African working hours, which sounds like a small thing until you have a submission deadline and a question that will not wait until tomorrow.</p>`,
    vendorName: "Sage South Africa",
    vendorWebsite: "https://www.sage.com/en-za/",
    foundedYear: 1981,
    featured: true,
    topFeatures: [
      "VAT201 preparation that reconciles to the ledger",
      "SARS eFiling submission",
      "Bank feeds for Absa, FNB, Standard Bank, Nedbank and Capitec",
      "Multi currency invoicing",
    ],
    features: [
      "VAT201 preparation that reconciles to the ledger",
      "SARS eFiling submission",
      "Bank feeds for Absa, FNB, Standard Bank, Nedbank and Capitec",
      "Multi currency invoicing",
      "Quotes and sales orders",
      "Supplier and purchase management",
      "Inventory tracking",
      "Recurring invoices",
      "Cash flow forecasting",
      "Management reporting pack",
      "Multi user access with permissions",
      "Mobile app for iOS and Android",
    ],
    integrations: ["Sage Pastel Payroll", "SimplePay", "Yoco", "PayFast", "Zapier"],
    supportTypes: ["Telephone", "Email", "Live chat", "Knowledge base", "Partner network"],
    countries: ["South Africa", "Namibia", "Botswana", "Zimbabwe"],
    languages: ["English", "Afrikaans"],
    rating: 4.2, ease: 4.0, value: 4.1, service: 3.8, functionality: 4.4,
    reviewCount: 377,
    alternatives: ["xero", "quickbooks-online", "zoho-books", "sage-50cloud-pastel"],
    bestFor: ["small-business", "vat-registered", "accountants"],
  },

  {
    slug: "xero",
    name: "Xero",
    categorySlug: "accounting-software",
    tagline: "Clean cloud accounting with a deep app ecosystem",
    descriptionShort:
      "Xero is the better piece of software on almost every dimension that is not local compliance, and its bank reconciliation genuinely gets less annoying the longer you use it.",
    descriptionFull: `
<p>Xero is the most pleasant cloud ledger to actually use. The bank reconciliation learns how you code transactions and progressively stops asking, the interface hides complexity without hiding information, and the mobile app is a real product rather than an afterthought.</p>
<p>Its strongest argument in South Africa is the marketplace. If your accounting has to talk to an ecommerce platform, a payroll system, an expense tool and a point of sale, Xero connects to all of them without custom development. Multi currency is handled properly, which decides the matter outright for businesses that invoice outside the country.</p>
<p>The honest weakness is local tax setup. VAT works correctly but takes more configuration than Sage does, and a practitioner will usually want an afternoon to get it right at the start. Support is also further away, both in time zone and in depth of local tax knowledge. Neither is a reason to avoid it, but both are real costs that a feature comparison will not show you.</p>
<p>Prices are published in rand including VAT, which is more transparency than most of its competitors offer.</p>`,
    vendorName: "Xero Limited",
    vendorWebsite: "https://www.xero.com/za/",
    foundedYear: 2006,
    featured: true,
    topFeatures: [
      "Bank reconciliation that learns your coding",
      "Over a thousand marketplace integrations",
      "Multi currency on the Premium plan",
      "Rand pricing published including VAT",
    ],
    features: [
      "Bank reconciliation that learns your coding",
      "Over a thousand marketplace integrations",
      "Multi currency on the Premium plan",
      "Send invoices and quotes",
      "Automated bill entry and tracking",
      "Smart document capture",
      "Cash flow forecasting up to 60 days",
      "Financial health scorecards",
      "Project profitability tracking",
      "Employee expense claims as an add on",
      "Customisable performance dashboards",
      "Mobile app for iOS and Android",
    ],
    integrations: ["SimplePay", "PaySpace", "Yoco", "Shopify", "HubSpot", "Stripe", "Zapier"],
    supportTypes: ["Email", "Live chat", "Knowledge base", "Advisor network"],
    countries: ["South Africa", "Namibia", "Botswana", "Kenya", "Nigeria"],
    languages: ["English"],
    rating: 4.5, ease: 4.6, value: 4.0, service: 4.1, functionality: 4.5,
    reviewCount: 474,
    alternatives: ["sage-accounting", "quickbooks-online", "zoho-books", "freshbooks"],
    bestFor: ["small-business", "growing-business", "exporters"],
  },

  {
    slug: "quickbooks-online",
    name: "QuickBooks Online",
    categorySlug: "accounting-software",
    tagline: "Familiar accounting with strong management reporting",
    descriptionShort:
      "QuickBooks is capable and widely known, with the best management reporting of the mainstream cloud ledgers, but South African support is thinner than Sage or Xero.",
    descriptionFull: `
<p>QuickBooks Online is a mature, capable ledger with reporting that is genuinely better than its main competitors. If you want to slice the numbers by class, location or project without exporting anything, this is the product that does it most comfortably.</p>
<p>In South Africa it sits third by adoption, and that has practical consequences. Fewer local bookkeepers work in it daily, the partner network is thinner, and some local tax workflows benefit from a practitioner configuring them properly at the outset rather than being obvious out of the box.</p>
<p>None of that makes it a bad choice. For a business with an in house finance person who knows QuickBooks, or one migrating from QuickBooks elsewhere, it remains a strong option. For a business relying on an external accountant, ask that accountant first, because their answer usually settles it.</p>
<p>Intuit does not publish South African pricing in a form we could read directly, so confirm the current figure and its VAT basis before budgeting.</p>`,
    vendorName: "Intuit",
    vendorWebsite: "https://quickbooks.intuit.com/za/",
    foundedYear: 1983,
    featured: false,
    topFeatures: [
      "Class and location tracking",
      "Customisable management reports",
      "Cash flow forecasting",
      "Receipt capture from the mobile app",
    ],
    features: [
      "Class and location tracking",
      "Customisable management reports",
      "Cash flow forecasting",
      "Receipt capture from the mobile app",
      "VAT tracking",
      "Invoicing and quoting",
      "Bank feed reconciliation",
      "Inventory management",
      "Project profitability",
      "Budgeting",
      "Multi user access",
      "Audit trail",
    ],
    integrations: ["PayFast", "Shopify", "Zoho CRM", "Stripe", "Zapier"],
    supportTypes: ["Email", "Live chat", "Knowledge base"],
    countries: ["South Africa", "United Kingdom", "United States"],
    languages: ["English"],
    rating: 4.0, ease: 4.2, value: 3.9, service: 3.6, functionality: 4.2,
    reviewCount: 231,
    alternatives: ["xero", "sage-accounting", "zoho-books", "freshbooks"],
    bestFor: ["small-business", "growing-business"],
  },

  {
    slug: "zoho-books",
    name: "Zoho Books",
    categorySlug: "accounting-software",
    tagline: "Accounting priced per organisation, not per user",
    descriptionShort:
      "Zoho Books is priced in rand per organisation rather than per user, which makes it dramatically cheaper than its rivals for a small team, with a free tier that is genuinely usable.",
    descriptionFull: `
<p>Zoho Books is the value argument in this category and it is a strong one. Pricing is per organisation rather than per user, published in rand, and starts at a figure the competition cannot approach. There is a real free tier for solo operators, and the paid tiers add capability rather than merely lifting arbitrary limits.</p>
<p>It makes obvious sense if you already run anything else in the Zoho suite. The link to Zoho CRM is tight enough that quotes become invoices without re keying, and the shared customer record removes a whole class of reconciliation problems.</p>
<p>The trade off is local depth. Zoho publishes a South African edition with VAT tracking and VAT return support, but the tax features do not go as deep as Sage's, and the pool of local practitioners who know it well is small. For a business with straightforward VAT and no external bookkeeper, that matters little. For a complex VAT position, test it hard during the trial.</p>
<p>Prices are stated exclusive of local taxes, so add 15% to every figure you compare against a VAT inclusive competitor.</p>`,
    vendorName: "Zoho Corporation",
    vendorWebsite: "https://www.zoho.com/za/books/",
    foundedYear: 1996,
    featured: false,
    topFeatures: [
      "Priced per organisation, not per user",
      "Free tier for solo operators",
      "VAT returns and audit reports",
      "Tight Zoho CRM integration",
    ],
    features: [
      "Priced per organisation, not per user",
      "Free tier for solo operators",
      "VAT returns and audit reports",
      "Tight Zoho CRM integration",
      "Client portal",
      "Workflow automation",
      "Recurring invoices and expenses",
      "Bank feed connections",
      "Project time tracking",
      "Inventory management on higher tiers",
      "Document autoscan add on",
      "Mobile app for iOS and Android",
    ],
    integrations: ["Zoho CRM", "Zoho People", "PayFast", "Stripe", "Zapier"],
    supportTypes: ["Email", "Telephone", "Live chat", "Knowledge base"],
    countries: ["South Africa", "Kenya", "Nigeria", "India"],
    languages: ["English"],
    rating: 4.1, ease: 4.0, value: 4.6, service: 3.9, functionality: 3.9,
    reviewCount: 145,
    alternatives: ["xero", "sage-accounting", "quickbooks-online", "wave-accounting"],
    bestFor: ["sole-trader", "small-business", "zoho-users"],
  },

  {
    slug: "sage-50cloud-pastel",
    name: "Sage 50cloud Pastel",
    categorySlug: "accounting-software",
    tagline: "The desktop ledger that keeps working when the power does not",
    descriptionShort:
      "Pastel is dated and it does not care. It runs on a desktop, which means load shedding does not stop your invoicing, and for some businesses that single fact outweighs everything else.",
    descriptionFull: `
<p>Pastel has been the backbone of South African bookkeeping for three decades, and dismissing it as legacy software misreads the conditions many local businesses actually operate in. It runs on a desktop. When connectivity goes down, and in this country it goes down, a desktop ledger keeps invoicing.</p>
<p>Beyond resilience, its inventory handling is deeper than most cloud packages manage. Serial number tracking, multiple warehouses and complex stock valuation are all handled properly rather than approximated. Businesses that carry real stock often find the cloud alternatives thin by comparison.</p>
<p>The interface is genuinely dated, and there is no pretending otherwise. New staff find it unintuitive, the learning curve is steeper than it should be, and the pace of improvement is slow. Remote access requires more thought than a browser tab.</p>
<p>Choose it when connectivity is unreliable, when stock is complex, or when your bookkeeper has worked in it for fifteen years. Choose against it if your team is distributed or if you want the software to feel modern.</p>`,
    vendorName: "Sage South Africa",
    vendorWebsite: "https://www.sage.com/en-za/",
    foundedYear: 1989,
    featured: false,
    topFeatures: [
      "Works offline through load shedding",
      "Deep inventory and stock valuation",
      "Serial number and batch tracking",
      "Familiar to most local bookkeepers",
    ],
    features: [
      "Works offline through load shedding",
      "Deep inventory and stock valuation",
      "Serial number and batch tracking",
      "Multiple warehouse management",
      "VAT201 preparation",
      "Bill of materials",
      "Job costing",
      "Point of sale add on",
      "Cloud backup",
      "Multi company support",
      "Extensive report library",
      "Sage Pastel Payroll integration",
    ],
    integrations: ["Sage Pastel Payroll", "Sage 200 Evolution", "Yoco"],
    supportTypes: ["Telephone", "Email", "Partner network", "Knowledge base"],
    countries: ["South Africa", "Namibia", "Botswana", "Zimbabwe", "Zambia"],
    languages: ["English", "Afrikaans"],
    rating: 3.7, ease: 3.2, value: 3.6, service: 3.5, functionality: 4.3,
    reviewCount: 326,
    alternatives: ["sage-accounting", "omni-accounts", "quickeasy-bos", "sage-200-evolution"],
    bestFor: ["stock-heavy", "unreliable-connectivity", "established-business"],
  },

  {
    slug: "freshbooks",
    name: "FreshBooks",
    categorySlug: "accounting-software",
    tagline: "Invoicing first accounting for people who bill their time",
    descriptionShort:
      "FreshBooks is built around invoicing and time tracking rather than around a general ledger, which suits consultants and agencies and suits VAT registered traders far less.",
    descriptionFull: `
<p>FreshBooks approaches accounting from the invoice rather than from the ledger, and for the businesses it suits that is exactly right. Consultants, designers, agencies and anyone who bills time will find the workflow faster and less cluttered than a full accounting package.</p>
<p>Time tracking, project profitability, retainers and client communication are all first class. Chasing an overdue invoice takes one click. The reporting is adequate rather than deep, which is a reasonable trade for the simplicity.</p>
<p>For a South African business the caveats are significant. It is priced in US dollars with no rand option, so your cost moves with the exchange rate and your card may add a conversion fee. Local VAT handling is generic rather than built for SARS, and there are no local bank feeds. That combination rules it out for most VAT registered businesses and leaves it as a strong option for service firms invoicing abroad.</p>`,
    vendorName: "FreshBooks",
    vendorWebsite: "https://www.freshbooks.com/",
    foundedYear: 2003,
    featured: false,
    topFeatures: [
      "Invoicing and payment chasing",
      "Time tracking on projects",
      "Retainer management",
      "Client facing project portal",
    ],
    features: [
      "Invoicing and payment chasing",
      "Time tracking on projects",
      "Retainer management",
      "Client facing project portal",
      "Expense capture",
      "Estimates and proposals",
      "Recurring billing",
      "Profitability by project",
      "Double entry accounting reports",
      "Mileage tracking",
      "Mobile app for iOS and Android",
    ],
    integrations: ["Stripe", "PayPal", "Gusto", "Zapier"],
    supportTypes: ["Email", "Telephone", "Knowledge base"],
    countries: ["South Africa", "United States", "Canada", "United Kingdom"],
    languages: ["English"],
    rating: 4.1, ease: 4.5, value: 3.6, service: 4.2, functionality: 3.7,
    reviewCount: 74,
    alternatives: ["xero", "zoho-books", "quickbooks-online", "wave-accounting"],
    bestFor: ["sole-trader", "consultants", "agencies"],
  },

  {
    slug: "wave-accounting",
    name: "Wave",
    categorySlug: "accounting-software",
    tagline: "Free invoicing and accounting, with real limits",
    descriptionShort:
      "Wave gives away its accounting and invoicing and earns on payment processing, which makes it hard to argue with on price and unsuitable for a VAT registered South African business.",
    descriptionFull: `
<p>Wave is free, and not in the sense of a limited trial. The accounting and invoicing are genuinely free to use, with the company earning through payment processing instead. For a sole trader who needs to raise invoices and keep a simple set of books, that is a difficult proposition to beat.</p>
<p>The software itself is clean and easy to learn. Invoicing, receipts, basic reporting and bank connections in supported countries all work without fuss.</p>
<p>The limits matter here more than usual. There are no South African bank feeds, no VAT201 support and no SARS integration of any kind. Support is thin. For a VAT registered local business this is not a serious option, and we would rather say so plainly than pad the review. Where it fits is the sole trader invoicing overseas clients who needs a tidy record and nothing more.</p>`,
    vendorName: "Wave Financial",
    vendorWebsite: "https://www.waveapps.com/",
    foundedYear: 2010,
    featured: false,
    topFeatures: [
      "Free accounting and invoicing",
      "Unlimited invoices and estimates",
      "Receipt scanning",
      "Simple to learn",
    ],
    features: [
      "Free accounting and invoicing",
      "Unlimited invoices and estimates",
      "Receipt scanning",
      "Recurring billing",
      "Basic financial reports",
      "Multi business support",
      "Payment processing",
      "Mobile app",
    ],
    integrations: ["Stripe", "PayPal", "Zapier"],
    supportTypes: ["Email", "Knowledge base", "Community forum"],
    countries: ["South Africa", "United States", "Canada"],
    languages: ["English"],
    rating: 3.6, ease: 4.4, value: 4.7, service: 2.9, functionality: 3.0,
    reviewCount: 57,
    alternatives: ["zoho-books", "freshbooks", "xero", "sage-accounting"],
    bestFor: ["sole-trader", "startups"],
  },

  {
    slug: "omni-accounts",
    name: "Omni Accounts",
    categorySlug: "accounting-software",
    tagline: "A modular South African ledger built for trading businesses",
    descriptionShort:
      "Omni is a South African package sold in modules, so a small trader can start narrow and add stock, point of sale or manufacturing later without changing systems.",
    descriptionFull: `
<p>Omni Accounts has been built in South Africa for South African trading conditions since the early nineties, and it shows in the details. VAT, local reporting and the habits of local wholesalers and retailers are all accounted for without configuration gymnastics.</p>
<p>Its distinguishing feature is modularity. You switch on the parts you need and pay for those, which keeps the entry cost sensible for a small business while leaving room to add point of sale, manufacturing, job costing or advanced stock later. Businesses that expect to grow into complexity avoid a migration this way.</p>
<p>It is sold through a partner network rather than at a published list price, so the quality of your implementation depends on which partner you get. Ask for references in your own industry. The interface is functional rather than beautiful, and the product is far better known in Durban and Johannesburg trading circles than in the startup world.</p>`,
    vendorName: "Omni Accounts",
    vendorWebsite: "https://www.omniaccounts.co.za/",
    foundedYear: 1992,
    featured: false,
    topFeatures: [
      "Modular, pay for what you switch on",
      "Built in South Africa for local trade",
      "Deep stock and point of sale options",
      "Free entry level edition",
    ],
    features: [
      "Modular licensing",
      "VAT201 support",
      "Point of sale module",
      "Multi warehouse stock",
      "Job costing",
      "Manufacturing module",
      "Debtors and creditors management",
      "Cash book and bank reconciliation",
      "Serial and batch tracking",
      "Multi company",
      "Report writer",
    ],
    integrations: ["Sage Pastel Payroll", "SimplePay"],
    supportTypes: ["Telephone", "Email", "Partner network"],
    countries: ["South Africa", "Namibia", "Botswana"],
    languages: ["English", "Afrikaans"],
    rating: 3.9, ease: 3.5, value: 4.2, service: 4.0, functionality: 4.1,
    reviewCount: 49,
    alternatives: ["sage-50cloud-pastel", "quickeasy-bos", "sage-accounting", "syspro"],
    bestFor: ["stock-heavy", "retail", "small-business"],
  },

  {
    slug: "quickeasy-bos",
    name: "QuickEasy BOS",
    categorySlug: "accounting-software",
    tagline: "A business operating system aimed at print and manufacturing",
    descriptionShort:
      "QuickEasy BOS bundles quoting, job management, stock and accounting into one South African system, and it is unusually strong in print, signage and light manufacturing.",
    descriptionFull: `
<p>QuickEasy BOS is not really an accounting package. It is a business operating system that happens to include a ledger, and it is aimed squarely at businesses that quote complex jobs, manufacture them and then invoice them.</p>
<p>Its estimating engine is the reason people buy it. In print, signage and light manufacturing, quoting accurately means modelling materials, machine time, setup and waste, and doing that in a spreadsheet is how margin quietly disappears. BOS handles it properly and carries the estimate through to the job card and the invoice without re keying.</p>
<p>It is a South African product with local VAT and reporting built in, sold on a quoted basis. The cost is meaningfully higher than a standalone ledger, and the implementation is a project rather than a signup. For the specific businesses it targets that trade is usually worth it. For a general small business it is more system than the job requires.</p>`,
    vendorName: "QuickEasy Software",
    vendorWebsite: "https://www.quickeasy.co.za/",
    foundedYear: 1996,
    featured: false,
    topFeatures: [
      "Estimating built for print and manufacturing",
      "Quote through to job card to invoice",
      "Stock and purchasing",
      "Built in South Africa",
    ],
    features: [
      "Job costing and estimating",
      "Production scheduling",
      "Stock control",
      "Purchasing and supplier management",
      "Full accounting ledger",
      "VAT201 support",
      "CRM module",
      "Document management",
      "Delivery notes and dispatch",
      "Management reporting",
    ],
    integrations: ["Sage Pastel Payroll", "SimplePay"],
    supportTypes: ["Telephone", "Email", "On site training"],
    countries: ["South Africa"],
    languages: ["English", "Afrikaans"],
    rating: 3.8, ease: 3.3, value: 3.9, service: 4.1, functionality: 4.3,
    reviewCount: 32,
    alternatives: ["omni-accounts", "sage-200-evolution", "syspro", "sage-50cloud-pastel"],
    bestFor: ["manufacturing", "print", "growing-business"],
  },

  /* ==================================================================== */
  /* Payroll                                                               */
  /* ==================================================================== */
  {
    slug: "simplepay",
    name: "SimplePay",
    categorySlug: "payroll-software",
    tagline: "Payroll that does the SARS paperwork without a fight",
    descriptionShort:
      "SimplePay is the payroll most South African accountants recommend first, because EMP201, EMP501, IRP5 and e@syFile exports all simply work.",
    descriptionFull: `
<p>Payroll is the least forgiving software a small business runs. It has hard deadlines, statutory formats and penalties for getting it wrong. SimplePay is the product that most consistently gets through reconciliation season without drama, and that is the entire case for it.</p>
<p>EMP201 declarations, the biannual EMP501 reconciliation, IRP5 and IT3(a) certificates and e@syFile exports all come out of the same data rather than being recalculated, which is why they agree with each other. UIF, SDL and the Employment Tax Incentive calculate automatically, and ETI in particular is easy to under claim by hand. Salary runs produce an ACB file your bank accepts.</p>
<p>There is one plan with everything included, priced on a base fee plus a per employee rate that steps down as headcount rises, quoted exclusive of VAT. That simplicity is deliberate and welcome in a category that usually hides capability behind tiers.</p>
<p>The interface is plain. It is not trying to impress anyone, and payroll administrators tend to regard that as a feature. Leave management and employee self service are included but are lighter than a dedicated HR system.</p>`,
    vendorName: "SimplePay",
    vendorWebsite: "https://www.simplepay.co.za/",
    foundedYear: 2010,
    featured: true,
    topFeatures: [
      "EMP201 and EMP501 submissions",
      "IRP5 and IT3(a) certificates",
      "e@syFile export that imports cleanly",
      "ETI calculated automatically",
      "ACB payment files for salary runs",
    ],
    features: [
      "EMP201 and EMP501 submissions",
      "IRP5 and IT3(a) certificates",
      "e@syFile export",
      "ETI calculated automatically",
      "ACB payment files",
      "UIF declarations",
      "SDL calculations",
      "BCEA leave entitlements",
      "Employee self service portal",
      "Bargaining council reporting",
      "Multi company payroll",
      "Accounting system integration",
    ],
    integrations: ["Xero", "Sage Accounting", "QuickBooks Online", "Zoho Books"],
    supportTypes: ["Email", "Telephone", "Knowledge base", "Free online training"],
    countries: ["South Africa", "Namibia", "Botswana", "Zimbabwe"],
    languages: ["English", "Afrikaans"],
    rating: 4.7, ease: 4.8, value: 4.7, service: 4.6, functionality: 4.5,
    reviewCount: 414,
    alternatives: ["sage-pastel-payroll", "payspace", "paysoft", "sage-business-cloud-payroll"],
    bestFor: ["small-business", "accountants", "growing-business"],
  },

  {
    slug: "payspace",
    name: "PaySpace",
    categorySlug: "payroll-software",
    tagline: "Enterprise payroll across the continent",
    descriptionShort:
      "PaySpace runs payroll in more than forty African countries from one system, which is exactly right for a group operating across borders and heavy going for a single company in Pretoria.",
    descriptionFull: `
<p>PaySpace is built for the problem of running payroll in several African countries at once, and at that job it has no serious local rival. Statutory rules for each country are maintained centrally, so a group with operations in South Africa, Botswana, Kenya and Nigeria runs one system rather than four.</p>
<p>The South African compliance work is thorough. EMP201, EMP501, IRP5, UIF, SDL and ETI are all handled, along with bargaining council requirements and detailed statutory reporting. Employee self service is genuinely capable rather than a token portal.</p>
<p>The cost of that capability is weight. Implementation is a project with a scoping phase, not a signup, and the interface reflects a system that has to satisfy large payroll teams rather than one bookkeeper. Pricing is quoted per business and depends on headcount and country coverage.</p>
<p>For a single South African company under a hundred employees, SimplePay will do the same statutory job with far less effort. For a multinational group, PaySpace is the sensible answer.</p>`,
    vendorName: "PaySpace",
    vendorWebsite: "https://www.payspace.com/",
    foundedYear: 2004,
    featured: false,
    topFeatures: [
      "Payroll in over forty African countries",
      "Employee self service portal",
      "BCEA leave rules built in",
      "Detailed statutory reporting",
    ],
    features: [
      "Payroll in over forty African countries",
      "Employee self service portal",
      "BCEA leave rules",
      "EMP201 and EMP501 submissions",
      "IRP5 and IT3(a) certificates",
      "ETI and SDL handling",
      "Bargaining council reporting",
      "Workflow approvals",
      "Organisation structure management",
      "Custom reporting",
      "API access",
      "Single sign on",
    ],
    integrations: ["Sage HR", "Microsoft Dynamics", "SAP Business One", "Xero"],
    supportTypes: ["Telephone", "Email", "Account manager", "Implementation partner"],
    countries: ["South Africa", "Namibia", "Botswana", "Zambia", "Kenya", "Nigeria", "Zimbabwe"],
    languages: ["English", "French", "Portuguese"],
    rating: 4.3, ease: 3.9, value: 4.0, service: 4.2, functionality: 4.7,
    reviewCount: 214,
    alternatives: ["simplepay", "sage-pastel-payroll", "labournet-payroll", "sap-successfactors"],
    bestFor: ["enterprise", "multinational", "large-business"],
  },

  {
    slug: "sage-pastel-payroll",
    name: "Sage Pastel Payroll",
    categorySlug: "payroll-software",
    tagline: "Long standing payroll with deep statutory coverage",
    descriptionShort:
      "A mature package that handles awkward statutory cases well, at the cost of an interface that newer staff consistently describe as unintuitive.",
    descriptionFull: `
<p>Sage Pastel Payroll has been running South African payrolls for three decades and it handles the complicated cases that trip up newer products. Bargaining councils, complex leave structures, multiple pay frequencies and unusual earnings and deductions are all catered for.</p>
<p>Statutory coverage is comprehensive. EMP201, EMP501, IRP5, IT3(a), UIF, SDL and ETI are all present, along with a deep library of reports that auditors tend to like.</p>
<p>The recurring complaint in reviews is the interface. Experienced payroll administrators work in it quickly, but people coming to it fresh find it dense and unintuitive, and training is a real cost rather than an afternoon. Integration with Sage's own accounting products is tight; integration with anything else takes more effort.</p>
<p>It is priced in bands by employee count and sold through Sage partners, so get a written quote for your actual headcount rather than working from a headline figure.</p>`,
    vendorName: "Sage South Africa",
    vendorWebsite: "https://www.sage.com/en-za/",
    foundedYear: 1994,
    featured: false,
    topFeatures: [
      "Deep statutory coverage",
      "Bargaining council reporting",
      "Leave liability reporting",
      "Multi company payroll",
    ],
    features: [
      "EMP201 and EMP501 submissions",
      "IRP5 and IT3(a) certificates",
      "e@syFile export",
      "UIF and SDL handling",
      "ETI calculations",
      "Bargaining council reporting",
      "Leave liability reports",
      "Multi company payroll",
      "Multiple pay frequencies",
      "Extensive report library",
      "Sage accounting integration",
      "Employee self service add on",
    ],
    integrations: ["Sage 50cloud Pastel", "Sage Accounting", "Sage 200 Evolution"],
    supportTypes: ["Telephone", "Email", "Partner network", "Knowledge base"],
    countries: ["South Africa", "Namibia", "Botswana"],
    languages: ["English", "Afrikaans"],
    rating: 3.9, ease: 3.4, value: 3.7, service: 3.8, functionality: 4.4,
    reviewCount: 301,
    alternatives: ["simplepay", "sage-business-cloud-payroll", "payspace", "paysoft"],
    bestFor: ["established-business", "complex-payroll", "medium-business"],
  },

  {
    slug: "sage-business-cloud-payroll",
    name: "Sage Business Cloud Payroll",
    categorySlug: "payroll-software",
    tagline: "Sage payroll without the desktop",
    descriptionShort:
      "The cloud version of Sage's payroll, lighter and easier to learn than Pastel Payroll, and correspondingly less capable on the awkward statutory cases.",
    descriptionFull: `
<p>Sage Business Cloud Payroll is the modern, browser based member of the Sage payroll family, and it is a considerably more pleasant experience than Pastel Payroll for anyone learning payroll software for the first time.</p>
<p>The core statutory work is there. EMP201 and EMP501 submissions, IRP5 certificates, UIF, SDL and ETI all function, and the link into Sage Accounting removes the double capture of salary journals.</p>
<p>What it gives up is depth. Bargaining council structures, unusual pay frequencies and the more exotic earnings and deductions are handled less comprehensively than in Pastel Payroll. Businesses with a straightforward monthly payroll will not notice; businesses in construction, security or motor trade often will.</p>
<p>Pricing is banded by employee count. Sage does not expose it to automated access, so ask for a written quote at your headcount.</p>`,
    vendorName: "Sage South Africa",
    vendorWebsite: "https://www.sage.com/en-za/",
    foundedYear: 2015,
    featured: false,
    topFeatures: [
      "Browser based, no installation",
      "EMP201 and EMP501 submissions",
      "Sage Accounting integration",
      "Easier to learn than Pastel Payroll",
    ],
    features: [
      "EMP201 and EMP501 submissions",
      "IRP5 and IT3(a) certificates",
      "UIF and SDL handling",
      "ETI calculations",
      "BCEA leave tracking",
      "Employee self service",
      "Payslip email distribution",
      "Sage Accounting integration",
      "Multi user access",
      "Automatic legislative updates",
    ],
    integrations: ["Sage Accounting", "Sage HR"],
    supportTypes: ["Telephone", "Email", "Knowledge base"],
    countries: ["South Africa"],
    languages: ["English", "Afrikaans"],
    rating: 3.8, ease: 4.1, value: 3.8, service: 3.6, functionality: 3.7,
    reviewCount: 153,
    alternatives: ["simplepay", "sage-pastel-payroll", "paysoft", "payspace"],
    bestFor: ["small-business", "simple-payroll"],
  },

  {
    slug: "paysoft",
    name: "PaySoft",
    categorySlug: "payroll-software",
    tagline: "Straightforward South African payroll from a local vendor",
    descriptionShort:
      "PaySoft is a long established local payroll product with solid statutory coverage and support that answers the phone, aimed at small and medium employers.",
    descriptionFull: `
<p>PaySoft has been supplying South African payroll software for years without ever chasing attention, and its users tend to be loyal for a simple reason: the statutory work is correct and somebody answers when they ring.</p>
<p>It covers the required ground. PAYE, UIF, SDL and ETI calculate correctly, EMP201 and EMP501 come out of the system, and IRP5 certificates export for e@syFile. Leave follows BCEA entitlements.</p>
<p>It is not a modern cloud product and does not present itself as one. The interface is functional, the feature set is focused on payroll rather than on HR, and integration with other systems is limited. Pricing is quoted per business on headcount.</p>
<p>For a small or medium employer who wants payroll to be correct and unremarkable, and who values speaking to a South African support desk, it is worth a quote.</p>`,
    vendorName: "PaySoft",
    vendorWebsite: "https://www.paysoft.co.za/",
    foundedYear: 1998,
    featured: false,
    topFeatures: [
      "PAYE, UIF, SDL and ETI handled",
      "EMP201 and EMP501 submissions",
      "Local telephone support",
      "BCEA leave tracking",
    ],
    features: [
      "PAYE, UIF, SDL and ETI calculations",
      "EMP201 and EMP501 submissions",
      "IRP5 and IT3(a) certificates",
      "e@syFile export",
      "BCEA leave entitlements",
      "Payslip distribution",
      "Multi company payroll",
      "Standard payroll reports",
      "Bank payment files",
    ],
    integrations: ["Sage Accounting", "Sage 50cloud Pastel"],
    supportTypes: ["Telephone", "Email", "Remote assistance"],
    countries: ["South Africa"],
    languages: ["English", "Afrikaans"],
    rating: 4.0, ease: 3.9, value: 4.3, service: 4.4, functionality: 3.8,
    reviewCount: 67,
    alternatives: ["simplepay", "paymaster", "sage-pastel-payroll", "sage-business-cloud-payroll"],
    bestFor: ["small-business", "medium-business"],
  },

  {
    slug: "paymaster",
    name: "Paymaster",
    categorySlug: "payroll-software",
    tagline: "Payroll software or payroll outsourced, your choice",
    descriptionShort:
      "Paymaster offers both software and a fully outsourced payroll bureau, which suits businesses that would rather hand the whole problem to somebody else.",
    descriptionFull: `
<p>Paymaster's distinguishing feature is that you can buy the software, buy the service, or move between the two. For a business where payroll is one person's occasional responsibility rather than anybody's job, outsourcing it entirely is often the right answer, and Paymaster is set up for that.</p>
<p>The statutory coverage is what you would expect from an established local provider: PAYE, UIF, SDL, ETI, EMP201, EMP501, IRP5 and e@syFile exports. Leave follows BCEA rules.</p>
<p>Where it earns its keep is in taking the deadline anxiety away. The bureau service handles submissions and reconciliations, which is worth real money to a business that has been caught out by an EMP501 before.</p>
<p>The software on its own is capable but unremarkable, and it is not the choice for a business that wants deep self service or slick integration. Pricing is quoted per business.</p>`,
    vendorName: "Paymaster People Solutions",
    vendorWebsite: "https://www.paymaster.co.za/",
    foundedYear: 2001,
    featured: false,
    topFeatures: [
      "Software or fully outsourced bureau",
      "Submissions handled for you",
      "PAYE, UIF, SDL and ETI",
      "Local support",
    ],
    features: [
      "Outsourced payroll bureau option",
      "PAYE, UIF, SDL and ETI calculations",
      "EMP201 and EMP501 submissions",
      "IRP5 and IT3(a) certificates",
      "BCEA leave tracking",
      "Payslip distribution",
      "Bank payment files",
      "Employee self service",
      "Payroll reporting",
    ],
    integrations: ["Sage Accounting", "Xero"],
    supportTypes: ["Telephone", "Email", "Dedicated consultant"],
    countries: ["South Africa"],
    languages: ["English", "Afrikaans"],
    rating: 4.1, ease: 4.0, value: 3.9, service: 4.5, functionality: 3.7,
    reviewCount: 55,
    alternatives: ["paysoft", "simplepay", "labournet-payroll", "payspace"],
    bestFor: ["small-business", "outsourcing", "medium-business"],
  },

  {
    slug: "labournet-payroll",
    name: "LabourNet Payroll",
    categorySlug: "payroll-software",
    tagline: "Payroll wrapped in industrial relations support",
    descriptionShort:
      "LabourNet sells payroll as part of a broader compliance and industrial relations service, which is the point: you are buying the advice as much as the software.",
    descriptionFull: `
<p>LabourNet is a compliance business that also runs payroll, rather than a payroll business that mentions compliance. For South African employers dealing with CCMA matters, bargaining councils, employment equity reporting and skills development, that framing is the whole value proposition.</p>
<p>The payroll itself covers the statutory requirements competently. What surrounds it is access to industrial relations specialists, employment equity and skills development levy support, and help with the reporting obligations that catch out designated employers.</p>
<p>This is not the choice for a business that simply wants payslips out the door cheaply. It is priced as a service, quoted per business, and it makes sense when your exposure is on the labour law side rather than the arithmetic side.</p>
<p>Businesses in sectors with active bargaining councils, or with a history of CCMA referrals, tend to find the bundle worth it. Others will find it more than they need.</p>`,
    vendorName: "LabourNet",
    vendorWebsite: "https://www.labournet.com/",
    foundedYear: 1997,
    featured: false,
    topFeatures: [
      "Industrial relations support included",
      "Employment equity reporting",
      "Skills development levy support",
      "Bargaining council expertise",
    ],
    features: [
      "Payroll processing",
      "EMP201 and EMP501 submissions",
      "IRP5 certificates",
      "Employment equity reporting",
      "Skills development levy support",
      "CCMA representation",
      "BCEA and LRA advice",
      "Bargaining council reporting",
      "Health and safety compliance",
      "Employee records management",
    ],
    integrations: ["Sage Accounting", "PaySpace"],
    supportTypes: ["Telephone", "Email", "On site consultant", "Regional offices"],
    countries: ["South Africa"],
    languages: ["English", "Afrikaans", "isiZulu"],
    rating: 3.9, ease: 3.6, value: 3.7, service: 4.3, functionality: 3.9,
    reviewCount: 45,
    alternatives: ["payspace", "paymaster", "simplepay", "sage-pastel-payroll"],
    bestFor: ["medium-business", "compliance-heavy", "large-business"],
  },

  /* ==================================================================== */
  /* HR                                                                    */
  /* ==================================================================== */
  {
    slug: "sage-hr",
    name: "Sage HR",
    categorySlug: "hr-software",
    tagline: "Leave, performance and records without the enterprise weight",
    descriptionShort:
      "Sage HR covers everyday HR admin properly and prices per employee, which keeps it reasonable for teams under about a hundred people.",
    descriptionFull: `
<p>Sage HR does the unglamorous work that eats a manager's week: leave requests, approvals, employee records, documents and performance reviews. It does them well enough that the spreadsheet finally gets retired, which is the actual goal.</p>
<p>Leave follows BCEA entitlements out of the box, which sounds minor and is not. International HR products routinely model a generic policy that somebody then has to configure into compliance, and that somebody is usually you.</p>
<p>It is modular, so you switch on performance, recruitment or shift scheduling as you need them and pay accordingly. The link to Sage's payroll products removes the double capture of leave and employee changes.</p>
<p>Above roughly a hundred and fifty employees it starts to feel light, particularly on reporting and on workflow complexity. Sage also does not expose its pricing to automated access, so get a written quote per employee before comparing it with anything else.</p>`,
    vendorName: "Sage South Africa",
    vendorWebsite: "https://www.sage.com/en-za/",
    foundedYear: 2012,
    featured: false,
    topFeatures: [
      "BCEA leave entitlements built in",
      "Performance reviews",
      "Employee records and documents",
      "Sage payroll integration",
    ],
    features: [
      "BCEA leave entitlements",
      "Leave requests and approvals",
      "Performance reviews and goals",
      "Employee records and documents",
      "Organisation chart",
      "Recruitment module",
      "Shift scheduling module",
      "Expense claims",
      "Employee self service",
      "Timesheets",
      "Mobile app",
      "Reporting dashboards",
    ],
    integrations: ["Sage Pastel Payroll", "Sage Business Cloud Payroll", "Sage Accounting", "Slack"],
    supportTypes: ["Email", "Telephone", "Knowledge base"],
    countries: ["South Africa", "Namibia", "Botswana", "Kenya"],
    languages: ["English", "Afrikaans"],
    rating: 4.1, ease: 4.3, value: 4.0, service: 3.9, functionality: 4.0,
    reviewCount: 164,
    alternatives: ["bamboohr", "zoho-people", "peoplehr", "payspace"],
    bestFor: ["small-business", "growing-business", "medium-business"],
  },

  {
    slug: "bamboohr",
    name: "BambooHR",
    categorySlug: "hr-software",
    tagline: "The most pleasant HR system to actually use",
    descriptionShort:
      "BambooHR is the best designed product in this category by a distance, and it carries no South African statutory logic whatsoever, which matters more than the design does.",
    descriptionFull: `
<p>BambooHR is a genuinely lovely piece of software. Onboarding flows, applicant tracking, employee records and satisfaction surveys are all thought through, and staff adopt it without being chased, which is rare in HR systems.</p>
<p>Reporting is strong, the mobile experience is good, and the whole product feels like it was designed rather than accumulated.</p>
<p>Now the caveat that decides it for most South African buyers. BambooHR contains no local statutory logic at all. BCEA leave entitlements, employment equity reporting and any SARS related requirement are simply not modelled, and somebody has to configure the leave policies into compliance and then keep them there. It is also priced in US dollars per employee per month, so your cost moves with the rand and your bank may add a conversion fee.</p>
<p>Choose it if your requirement is genuinely about people experience and your compliance lives elsewhere, in payroll. Choose against it if you expected the HR system to keep you compliant.</p>`,
    vendorName: "BambooHR",
    vendorWebsite: "https://www.bamboohr.com/",
    foundedYear: 2008,
    featured: false,
    topFeatures: [
      "Applicant tracking and hiring",
      "Onboarding workflows",
      "Employee satisfaction surveys",
      "Strong reporting",
    ],
    features: [
      "Applicant tracking system",
      "Onboarding and offboarding workflows",
      "Employee records and documents",
      "Time off tracking",
      "Performance management",
      "Employee satisfaction surveys",
      "Organisation chart",
      "Custom reporting",
      "Mobile app",
      "Electronic signatures",
      "Open API",
    ],
    integrations: ["Slack", "Google Workspace", "Greenhouse", "Zapier", "Microsoft 365"],
    supportTypes: ["Email", "Telephone", "Knowledge base", "Onboarding specialist"],
    countries: ["South Africa", "United States", "United Kingdom"],
    languages: ["English"],
    rating: 4.4, ease: 4.7, value: 3.8, service: 4.3, functionality: 4.2,
    reviewCount: 127,
    alternatives: ["sage-hr", "peoplehr", "zoho-people", "sap-successfactors"],
    bestFor: ["growing-business", "medium-business", "people-focused"],
  },

  {
    slug: "zoho-people",
    name: "Zoho People",
    categorySlug: "hr-software",
    tagline: "Capable HR at a price that does not sting",
    descriptionShort:
      "Zoho People covers leave, attendance, performance and records at a fraction of what the better known products charge, with the usual Zoho trade off of configuration effort.",
    descriptionFull: `
<p>Zoho People does most of what an HR system needs to do and charges considerably less than its better known competitors. Leave management, attendance, timesheets, performance appraisals and employee records are all present and all workable.</p>
<p>It makes particular sense alongside the rest of the Zoho suite. Shared records across Books, CRM and People remove duplicate data entry and give you one view of a person across the business.</p>
<p>The trade off is the one that runs through Zoho's whole range. Getting it configured to your policies takes patience, the defaults are generic rather than South African, and the documentation assumes more than it should. Leave rules need to be set up against BCEA entitlements rather than arriving that way.</p>
<p>For a cost conscious business willing to spend a week getting it right, the value is hard to argue with. For one that wants it working on Friday, look elsewhere.</p>`,
    vendorName: "Zoho Corporation",
    vendorWebsite: "https://www.zoho.com/people/",
    foundedYear: 2008,
    featured: false,
    topFeatures: [
      "Leave and attendance management",
      "Performance appraisals",
      "Timesheets and project time",
      "Zoho suite integration",
    ],
    features: [
      "Leave management",
      "Attendance and shift tracking",
      "Timesheets",
      "Performance appraisals",
      "Employee records and documents",
      "Onboarding workflows",
      "Case management",
      "Organisation chart",
      "Custom forms and workflows",
      "Mobile app",
      "Reporting and analytics",
    ],
    integrations: ["Zoho Books", "Zoho CRM", "Slack", "Microsoft 365", "Zapier"],
    supportTypes: ["Email", "Telephone", "Live chat", "Knowledge base"],
    countries: ["South Africa", "India", "Kenya", "Nigeria"],
    languages: ["English"],
    rating: 3.9, ease: 3.7, value: 4.5, service: 3.8, functionality: 4.0,
    reviewCount: 72,
    alternatives: ["sage-hr", "bamboohr", "peoplehr", "zoho-crm"],
    bestFor: ["small-business", "zoho-users", "growing-business"],
  },

  {
    slug: "peoplehr",
    name: "People HR",
    categorySlug: "hr-software",
    tagline: "Tidy HR for small and mid sized teams",
    descriptionShort:
      "People HR is a competent mid market system priced per employee in pounds, which makes it a currency risk rather than a compliance one for South African buyers.",
    descriptionFull: `
<p>People HR handles the standard HR requirement cleanly: employee records, holiday and absence, appraisals, applicant tracking and reporting. It is well organised and staff pick it up quickly.</p>
<p>The reporting is a genuine strength for a product at this price, and the applicant tracking is more capable than most bundled offerings.</p>
<p>For a South African business the issue is pricing rather than function. It is quoted in pounds per employee per month, so your cost rises whenever the rand weakens and your bank may add a conversion fee on top. There is also no local statutory content, so leave policies need configuring against BCEA entitlements yourself.</p>
<p>It is a reasonable option for a business with foreign currency income, where a pound denominated cost is a natural hedge rather than an exposure. For a rand only business, a local product usually makes more sense.</p>`,
    vendorName: "Access People HR",
    vendorWebsite: "https://www.peoplehr.com/",
    foundedYear: 2011,
    featured: false,
    topFeatures: [
      "Strong reporting for the price",
      "Applicant tracking included",
      "Holiday and absence management",
      "Appraisals and objectives",
    ],
    features: [
      "Employee records and documents",
      "Holiday and absence management",
      "Applicant tracking",
      "Appraisals and objectives",
      "Custom reporting",
      "Organisation chart",
      "Expenses",
      "Timesheets",
      "Employee self service",
      "Mobile app",
    ],
    integrations: ["Microsoft 365", "Google Workspace", "Slack", "Zapier"],
    supportTypes: ["Email", "Telephone", "Knowledge base"],
    countries: ["South Africa", "United Kingdom", "Ireland"],
    languages: ["English"],
    rating: 3.9, ease: 4.1, value: 3.7, service: 3.8, functionality: 3.9,
    reviewCount: 45,
    alternatives: ["sage-hr", "bamboohr", "zoho-people", "sap-successfactors"],
    bestFor: ["medium-business", "growing-business"],
  },

  {
    slug: "sap-successfactors",
    name: "SAP SuccessFactors",
    categorySlug: "hr-software",
    tagline: "Enterprise HCM for organisations with thousands of people",
    descriptionShort:
      "SuccessFactors is a serious enterprise HCM platform, and for any business under about five hundred people it is more system than the problem requires.",
    descriptionFull: `
<p>SAP SuccessFactors is built for organisations managing thousands of employees across multiple countries, with the succession planning, learning management, workforce analytics and compensation modelling that implies.</p>
<p>At that scale it earns its place. Workforce planning against real data, structured succession pipelines and global compliance handling are things smaller products do not attempt.</p>
<p>The commitment is substantial in both money and time. Licensing is quoted per organisation, implementation runs for months through SAP or a partner, and implementation cost routinely exceeds the first year of licensing. Nobody buys this without a business case.</p>
<p>In South Africa it appears mainly in listed companies, large mining and manufacturing groups and the public sector. If you are reading this as a two hundred person business, the honest advice is to look at Sage HR or BambooHR first.</p>`,
    vendorName: "SAP",
    vendorWebsite: "https://www.sap.com/products/hcm.html",
    foundedYear: 2001,
    featured: false,
    topFeatures: [
      "Succession and workforce planning",
      "Learning management",
      "Workforce analytics",
      "Global compliance handling",
    ],
    features: [
      "Core HR records",
      "Succession and development planning",
      "Learning management system",
      "Performance and goals",
      "Compensation management",
      "Recruiting and onboarding",
      "Workforce analytics",
      "Global compliance",
      "Employee central payroll option",
      "Mobile app",
      "Extensive API",
    ],
    integrations: ["SAP Business One", "SAP S/4HANA", "PaySpace", "Microsoft 365"],
    supportTypes: ["Account manager", "Partner network", "Telephone", "Knowledge base"],
    countries: ["South Africa", "Global"],
    languages: ["English", "Afrikaans", "French", "Portuguese"],
    rating: 3.8, ease: 3.1, value: 3.3, service: 3.9, functionality: 4.7,
    reviewCount: 59,
    alternatives: ["workday-hcm", "payspace", "bamboohr", "sage-hr"],
    bestFor: ["enterprise", "large-business", "multinational"],
  },

  {
    slug: "workday-hcm",
    name: "Workday HCM",
    categorySlug: "hr-software",
    tagline: "Enterprise HR and finance on one data model",
    descriptionShort:
      "Workday is the benchmark for large enterprise HCM, publishes no pricing anywhere, and is only a sensible conversation above roughly a thousand employees.",
    descriptionFull: `
<p>Workday's argument is that human capital and finance should sit on one data model rather than two systems joined by an interface. For large organisations that argument holds, and the analytics that follow from it are genuinely better than the alternatives.</p>
<p>Core HR, talent, learning, compensation and workforce planning are all strong, the interface is unusually good for enterprise software, and the reporting is a real differentiator.</p>
<p>Workday publishes no list price anywhere and negotiates per organisation. Implementations run for the better part of a year through certified partners, and the total cost puts it firmly out of reach of the mid market.</p>
<p>In South Africa it appears in large listed groups and multinationals. There is no local payroll module, so it is typically paired with PaySpace or a similar local system for the statutory work.</p>`,
    vendorName: "Workday",
    vendorWebsite: "https://www.workday.com/",
    foundedYear: 2005,
    featured: false,
    topFeatures: [
      "HR and finance on one data model",
      "Workforce planning and analytics",
      "Talent and learning management",
      "Strong reporting",
    ],
    features: [
      "Core HR records",
      "Talent management",
      "Learning management",
      "Compensation planning",
      "Workforce planning",
      "Advanced analytics",
      "Recruiting",
      "Time tracking",
      "Global compliance",
      "Mobile app",
      "Extensive API",
    ],
    integrations: ["PaySpace", "Microsoft 365", "Salesforce", "ServiceNow"],
    supportTypes: ["Account manager", "Partner network", "Community"],
    countries: ["South Africa", "Global"],
    languages: ["English"],
    rating: 4.0, ease: 3.6, value: 3.2, service: 3.9, functionality: 4.6,
    reviewCount: 42,
    alternatives: ["sap-successfactors", "payspace", "bamboohr", "sage-hr"],
    bestFor: ["enterprise", "large-business", "multinational"],
  },

  /* ==================================================================== */
  /* CRM                                                                   */
  /* ==================================================================== */
  {
    slug: "zoho-crm",
    name: "Zoho CRM",
    categorySlug: "crm-software",
    tagline: "Most of what Salesforce does, for a fraction of the money",
    descriptionShort:
      "Zoho CRM delivers genuinely comparable capability to the expensive platforms at a small fraction of the cost, provided you have the patience to configure it.",
    descriptionFull: `
<p>Zoho CRM is the best value proposition in this category and it is not particularly close. Pipeline management, workflow automation, quoting, forecasting and territory management are all present at a per user price the enterprise platforms cannot approach. There is a free tier for up to three users that is genuinely usable.</p>
<p>Integration across the Zoho suite is its second advantage. Quotes flowing into Zoho Books without re keying, and a shared customer record across sales, finance and support, removes a category of reconciliation work entirely.</p>
<p>The cost is your time. Configuration takes patience, the interface exposes more complexity than it needs to, and the documentation assumes familiarity. Teams that invest a fortnight in setting it up properly are usually very happy. Teams that expect it to work well out of the box are usually not.</p>
<p>Zoho publishes South African editions priced in rand, which is more than most of its competitors manage.</p>`,
    vendorName: "Zoho Corporation",
    vendorWebsite: "https://www.zoho.com/crm/",
    foundedYear: 1996,
    featured: true,
    topFeatures: [
      "Free tier for up to three users",
      "Workflow automation",
      "Quote and invoice generation",
      "Sales forecasting",
    ],
    features: [
      "Pipeline and deal management",
      "Workflow automation",
      "Quote and invoice generation",
      "Sales forecasting",
      "Territory management",
      "Email integration and templates",
      "Web forms and lead capture",
      "Custom modules and fields",
      "Reports and dashboards",
      "Mobile app",
      "WhatsApp Business integration",
      "Open API",
    ],
    integrations: ["Zoho Books", "Zoho People", "Xero", "Mailchimp", "WhatsApp Business", "Zapier"],
    supportTypes: ["Email", "Telephone", "Live chat", "Knowledge base"],
    countries: ["South Africa", "Kenya", "Nigeria", "India"],
    languages: ["English"],
    rating: 4.2, ease: 3.9, value: 4.6, service: 3.8, functionality: 4.3,
    reviewCount: 264,
    alternatives: ["hubspot-crm", "salesforce-sales-cloud", "pipedrive", "bitrix24"],
    bestFor: ["small-business", "growing-business", "zoho-users"],
  },

  {
    slug: "salesforce-sales-cloud",
    name: "Salesforce Sales Cloud",
    categorySlug: "crm-software",
    tagline: "The most capable CRM, and the most demanding",
    descriptionShort:
      "Salesforce can model almost any sales process you can describe, which is exactly why it punishes businesses that have not decided what their process is.",
    descriptionFull: `
<p>Salesforce is the most capable CRM on the market and has been for a long time. If your sales process is complex, your territories are structured and your forecasting matters to the board, it will model all of it. The platform and its ecosystem can extend to almost anything.</p>
<p>That power is conditional. Salesforce rewards organisations with the discipline to define their process first and configure second. Businesses that buy it hoping the software will impose order tend to end up with an expensive, half maintained contact database and a consulting bill.</p>
<p>Cost rises steeply through the tiers, and the real figure is rarely the licence. Administration, configuration and integration are ongoing commitments, usually requiring somebody whose job that partly is.</p>
<p>It is quoted in dollars, euro and pounds but not in rand, so South African buyers carry exchange rate risk on renewal. For a large or fast growing sales organisation it remains the right answer. For a ten person team, Zoho or Pipedrive will do the job for a tenth of the total cost.</p>`,
    vendorName: "Salesforce",
    vendorWebsite: "https://www.salesforce.com/",
    foundedYear: 1999,
    featured: false,
    topFeatures: [
      "Models almost any sales process",
      "Deep forecasting and pipeline insight",
      "Vast app ecosystem",
      "Free starter tier available",
    ],
    features: [
      "Lead, account, contact and opportunity management",
      "Sales forecasting",
      "Territory management",
      "Quote and order management",
      "Workflow and approval automation",
      "Einstein AI insights",
      "Custom objects and fields",
      "AppExchange ecosystem",
      "Advanced reporting and dashboards",
      "Mobile app",
      "Extensive API",
      "Sandbox environments",
    ],
    integrations: ["Slack", "Microsoft 365", "Mailchimp", "DocuSign", "Zapier"],
    supportTypes: ["Account manager", "Partner network", "Knowledge base", "Community"],
    countries: ["South Africa", "Global"],
    languages: ["English"],
    rating: 4.1, ease: 3.4, value: 3.4, service: 3.9, functionality: 4.8,
    reviewCount: 224,
    alternatives: ["hubspot-crm", "zoho-crm", "pipedrive", "dynamics-365-business-central"],
    bestFor: ["enterprise", "large-business", "complex-sales"],
  },

  {
    slug: "hubspot-crm",
    name: "HubSpot",
    categorySlug: "crm-software",
    tagline: "Marketing and sales on one customer record",
    descriptionShort:
      "HubSpot is the easiest CRM to get a team using and the one whose costs most often surprise people later, because pricing scales with contacts rather than seats.",
    descriptionFull: `
<p>HubSpot's free CRM is the most generous serious offering in this category, and its paid tiers are the easiest to adopt. Sales people start using it without being chased, which is the single biggest predictor of whether a CRM project succeeds.</p>
<p>Having marketing and sales on one customer record is a genuine advantage. Email sequences, landing pages, forms, meeting scheduling and pipeline all reference the same contact, so nobody argues about whose numbers are right.</p>
<p>The warning is about cost trajectory. Pricing scales with marketing contact volumes as well as with seats, and businesses that grow their list find the bill rising in ways they did not model at signup. Get a projection at three times your current contact count before committing, because migrating away later is painful.</p>
<p>It is priced in dollars with no rand option. Start on the free tier, which is not a trap, and upgrade only when a specific limit is genuinely in your way.</p>`,
    vendorName: "HubSpot",
    vendorWebsite: "https://www.hubspot.com/",
    foundedYear: 2006,
    featured: false,
    topFeatures: [
      "Genuinely usable free CRM",
      "Email sequences and templates",
      "Meeting scheduler",
      "Landing pages and forms",
    ],
    features: [
      "Contact and deal management",
      "Email sequences and templates",
      "Meeting scheduler",
      "Landing pages and forms",
      "Live chat and chatbots",
      "Marketing automation",
      "Sales pipeline and forecasting",
      "Quotes and e signature",
      "Reporting dashboards",
      "Mobile app",
      "Extensive integration marketplace",
    ],
    integrations: ["Xero", "Zoom", "Gmail", "WordPress", "Slack", "Zapier"],
    supportTypes: ["Email", "Live chat", "Telephone on paid tiers", "Academy", "Community"],
    countries: ["South Africa", "Global"],
    languages: ["English"],
    rating: 4.4, ease: 4.5, value: 3.9, service: 4.2, functionality: 4.4,
    reviewCount: 308,
    alternatives: ["zoho-crm", "salesforce-sales-cloud", "pipedrive", "freshsales"],
    bestFor: ["small-business", "growing-business", "marketing-led"],
  },

  {
    slug: "pipedrive",
    name: "Pipedrive",
    categorySlug: "crm-software",
    tagline: "A CRM that sales people will actually update",
    descriptionShort:
      "Pipedrive does one thing properly, which is moving deals through a pipeline, and its restraint is exactly why adoption rates are so much better than average.",
    descriptionFull: `
<p>Pipedrive was designed by sales people who were tired of CRMs built for managers, and the difference is visible in the first five minutes. The pipeline is the interface. Logging a call and moving a deal takes seconds. Nothing is required that does not help the person entering it.</p>
<p>That restraint is the product. Adoption rates are consistently better than the more capable alternatives, and a CRM that gets updated is worth more than a CRM that could theoretically do more.</p>
<p>The limits show as you grow. Marketing automation is thin, reporting is adequate rather than deep, and complex approval workflows are not really its territory. Businesses that need those will outgrow it.</p>
<p>It is priced per seat per month in dollars or euro with no rand option, so budget for exchange rate movement. For a small to mid sized sales team that wants the pipeline updated and nothing else, it is arguably the best choice in this list.</p>`,
    vendorName: "Pipedrive",
    vendorWebsite: "https://www.pipedrive.com/",
    foundedYear: 2010,
    featured: false,
    topFeatures: [
      "Pipeline first interface",
      "Very high adoption rates",
      "Activity based selling",
      "Quick to configure",
    ],
    features: [
      "Visual pipeline management",
      "Activity reminders and scheduling",
      "Email integration and tracking",
      "Web forms and lead capture",
      "Sales reporting",
      "Goal tracking",
      "Products catalogue",
      "Workflow automation",
      "Mobile app",
      "Open API",
    ],
    integrations: ["Xero", "Slack", "Google Workspace", "Mailchimp", "Zapier"],
    supportTypes: ["Email", "Live chat", "Knowledge base"],
    countries: ["South Africa", "Global"],
    languages: ["English"],
    rating: 4.3, ease: 4.6, value: 4.1, service: 4.0, functionality: 3.9,
    reviewCount: 118,
    alternatives: ["zoho-crm", "hubspot-crm", "freshsales", "salesforce-sales-cloud"],
    bestFor: ["small-business", "sales-teams", "growing-business"],
  },

  {
    slug: "freshsales",
    name: "Freshsales",
    categorySlug: "crm-software",
    tagline: "A tidy CRM with built in phone and chat",
    descriptionShort:
      "Freshsales bundles telephony and chat into the CRM itself, which suits teams that sell by phone and saves stitching three tools together.",
    descriptionFull: `
<p>Freshsales differentiates by putting the phone inside the CRM. Built in telephony, chat and email mean a sales team that works the phone does not need a separate dialler, and every interaction lands on the contact record automatically.</p>
<p>Beyond that it is a competent modern CRM: visual pipelines, lead scoring, workflow automation and reasonable reporting, with a free tier to start on.</p>
<p>It is less well known in South Africa than Zoho or HubSpot, which means fewer local implementation partners and a smaller pool of people who have used it before. Pricing is per user per month in dollars.</p>
<p>Worth a look if telephony matters to how you sell. Otherwise Zoho CRM covers similar ground with a larger local footprint.</p>`,
    vendorName: "Freshworks",
    vendorWebsite: "https://www.freshworks.com/crm/",
    foundedYear: 2010,
    featured: false,
    topFeatures: [
      "Built in telephony",
      "Chat and email in one place",
      "AI lead scoring",
      "Free tier available",
    ],
    features: [
      "Visual pipeline management",
      "Built in phone and chat",
      "AI powered lead scoring",
      "Email sequences",
      "Workflow automation",
      "Territory management",
      "Reports and dashboards",
      "Web forms",
      "Mobile app",
      "Open API",
    ],
    integrations: ["Slack", "Google Workspace", "Mailchimp", "Zapier", "Xero"],
    supportTypes: ["Email", "Telephone", "Live chat", "Knowledge base"],
    countries: ["South Africa", "Global"],
    languages: ["English"],
    rating: 4.0, ease: 4.2, value: 4.2, service: 3.9, functionality: 4.0,
    reviewCount: 65,
    alternatives: ["zoho-crm", "pipedrive", "hubspot-crm", "bitrix24"],
    bestFor: ["small-business", "sales-teams", "telesales"],
  },

  {
    slug: "bitrix24",
    name: "Bitrix24",
    categorySlug: "crm-software",
    tagline: "CRM, intranet and project management priced per company",
    descriptionShort:
      "Bitrix24 charges per organisation rather than per user, which makes it extraordinary value for a larger team and a lot of product to wade through for a small one.",
    descriptionFull: `
<p>Bitrix24's pricing model is the headline. You pay per organisation, not per user, so a fifty person team pays the same as a five person team on the same tier. For a growing business that is a materially different cost curve from every per seat competitor.</p>
<p>What you get is broad rather than deep: CRM, project management, an intranet, document storage, telephony, a website builder and internal chat, all in one place. Businesses that would otherwise buy three or four separate tools can consolidate.</p>
<p>Breadth is also the weakness. Each module is decent rather than excellent, the interface is dense, and new users find it overwhelming. It rewards a business willing to commit to it as a whole rather than one wanting a focused CRM.</p>
<p>Priced in dollars with a free tier that supports unlimited users, which is unusual and genuine.</p>`,
    vendorName: "Bitrix24",
    vendorWebsite: "https://www.bitrix24.com/",
    foundedYear: 1998,
    featured: false,
    topFeatures: [
      "Priced per organisation, not per user",
      "Free tier with unlimited users",
      "CRM, projects and intranet in one",
      "Built in telephony",
    ],
    features: [
      "CRM and sales pipeline",
      "Project and task management",
      "Company intranet and chat",
      "Document storage and management",
      "Built in telephony",
      "Website and landing page builder",
      "Web forms",
      "Sales automation",
      "Time tracking",
      "Mobile app",
      "Open API",
    ],
    integrations: ["Google Workspace", "Microsoft 365", "Mailchimp", "Zapier"],
    supportTypes: ["Email", "Knowledge base", "Partner network", "Community"],
    countries: ["South Africa", "Global"],
    languages: ["English"],
    rating: 3.8, ease: 3.3, value: 4.6, service: 3.5, functionality: 4.2,
    reviewCount: 52,
    alternatives: ["zoho-crm", "hubspot-crm", "freshsales", "monday-com"],
    bestFor: ["growing-business", "medium-business", "cost-conscious"],
  },

  {
    slug: "insightly",
    name: "Insightly",
    categorySlug: "crm-software",
    tagline: "CRM with project delivery attached",
    descriptionShort:
      "Insightly joins the sales pipeline to project delivery, which suits businesses where winning the work and then doing it are the same continuous process.",
    descriptionFull: `
<p>Insightly's useful idea is that for many businesses the deal does not end when it is won. Agencies, consultancies and professional services firms hand a signed deal straight to a delivery team, and Insightly keeps that on one record rather than two systems.</p>
<p>Pipelines, projects, milestones and task assignment all live together, so the account manager can see delivery status without asking anybody.</p>
<p>As a pure CRM it is less refined than Pipedrive and less capable than Zoho. As a project tool it is lighter than a dedicated one. The argument for it is entirely about the join between the two, and if you do not need that join, better options exist on both sides.</p>
<p>Priced per user per month in dollars. Its South African presence is small, so expect to implement it yourself.</p>`,
    vendorName: "Insightly",
    vendorWebsite: "https://www.insightly.com/",
    foundedYear: 2009,
    featured: false,
    topFeatures: [
      "Sales pipeline joined to project delivery",
      "Milestone and task tracking",
      "Custom objects",
      "Free tier for two users",
    ],
    features: [
      "Contact and deal management",
      "Project management",
      "Milestone tracking",
      "Task assignment",
      "Workflow automation",
      "Custom objects and fields",
      "Email templates and tracking",
      "Reports and dashboards",
      "Mobile app",
      "Open API",
    ],
    integrations: ["Google Workspace", "Microsoft 365", "Mailchimp", "Xero", "Zapier"],
    supportTypes: ["Email", "Knowledge base", "Community"],
    countries: ["South Africa", "Global"],
    languages: ["English"],
    rating: 3.7, ease: 3.8, value: 3.6, service: 3.5, functionality: 3.8,
    reviewCount: 33,
    alternatives: ["zoho-crm", "pipedrive", "monday-com", "hubspot-crm"],
    bestFor: ["agencies", "consultants", "small-business"],
  },

  /* ==================================================================== */
  /* ERP                                                                   */
  /* ==================================================================== */
  {
    slug: "odoo",
    name: "Odoo",
    categorySlug: "erp-software",
    tagline: "Modular ERP you can start small with",
    descriptionShort:
      "Odoo lets you switch on only the modules you need, which makes ERP genuinely affordable for a mid sized business, provided you choose your implementation partner carefully.",
    descriptionFull: `
<p>Odoo has done something the traditional ERP vendors did not manage, which is to make integrated business software approachable for a company that is not enormous. You switch on accounting, then inventory, then manufacturing, then ecommerce, paying for what you use and adding capability as the business needs it.</p>
<p>The open source core means the ceiling is high. If you need something unusual, it can be built, and there is a large developer community that has probably built something close already. One app is free forever for unlimited users, which is a real offer rather than a lead magnet.</p>
<p>The variable is the implementation partner. Odoo's local partner network ranges from excellent to poor, and your experience will be decided more by that choice than by the software. Ask for references in your industry and speak to them about what went wrong, not what went well.</p>
<p>Odoo localises pricing by country and renders it client side, so confirm the South African per user rate directly before budgeting.</p>`,
    vendorName: "Odoo SA",
    vendorWebsite: "https://www.odoo.com/",
    foundedYear: 2005,
    featured: true,
    topFeatures: [
      "One app free forever for unlimited users",
      "Modular, add capability as you grow",
      "Manufacturing and inventory included",
      "Open source core",
    ],
    features: [
      "Accounting and invoicing",
      "Inventory and warehouse management",
      "Manufacturing and MRP",
      "Purchase management",
      "CRM and sales",
      "Website and ecommerce",
      "Point of sale",
      "Project management",
      "HR and recruitment modules",
      "Field service",
      "Extensive app store",
      "Open API",
    ],
    integrations: ["PayFast", "Shopify", "Xero", "Zapier", "WooCommerce"],
    supportTypes: ["Email", "Partner network", "Community", "Knowledge base"],
    countries: ["South Africa", "Global"],
    languages: ["English", "Afrikaans", "French"],
    rating: 4.2, ease: 3.7, value: 4.5, service: 3.6, functionality: 4.6,
    reviewCount: 196,
    alternatives: ["sage-200-evolution", "sap-business-one", "syspro", "dynamics-365-business-central"],
    bestFor: ["growing-business", "medium-business", "manufacturing"],
  },

  {
    slug: "sap-business-one",
    name: "SAP Business One",
    categorySlug: "erp-software",
    tagline: "Serious ERP for established mid market businesses",
    descriptionShort:
      "SAP Business One is a substantial commitment in money and time, and where it fits it replaces a dozen smaller systems and ends the reconciliation problem for good.",
    descriptionFull: `
<p>SAP Business One is the mid market member of the SAP family, aimed at established businesses that have outgrown a ledger and a spreadsheet stack. Financials, stock, purchasing, production planning and business intelligence all sit on one database, which is the entire point.</p>
<p>For businesses running several disconnected systems and reconciling between them monthly, the case is straightforward. One version of the numbers, available to everyone, removes a class of work that nobody enjoys and nobody should be doing.</p>
<p>The commitment is real. Licence, implementation, data migration, training and a parallel run all have to be budgeted, and implementation frequently exceeds the first year of licence fees. Get total cost of ownership over three years, itemised, in writing, before going further.</p>
<p>It is sold through SAP partners whose quality varies considerably. The partner matters as much as the product, and possibly more.</p>`,
    vendorName: "SAP",
    vendorWebsite: "https://www.sap.com/products/erp/business-one.html",
    foundedYear: 1972,
    featured: false,
    topFeatures: [
      "Full financials and stock on one database",
      "Production planning",
      "Business intelligence built in",
      "Multi company consolidation",
    ],
    features: [
      "Financial management",
      "Inventory and warehouse management",
      "Production planning and MRP",
      "Purchasing and procurement",
      "Sales and CRM",
      "Business intelligence and analytics",
      "Multi currency and multi company",
      "Service management",
      "Project costing",
      "Fixed asset management",
      "Extensive partner add ons",
    ],
    integrations: ["PaySpace", "Microsoft 365", "SAP SuccessFactors"],
    supportTypes: ["Partner network", "Telephone", "Knowledge base", "Account manager"],
    countries: ["South Africa", "Global"],
    languages: ["English", "Afrikaans"],
    rating: 3.9, ease: 3.2, value: 3.4, service: 3.9, functionality: 4.8,
    reviewCount: 110,
    alternatives: ["sage-200-evolution", "odoo", "syspro", "dynamics-365-business-central"],
    bestFor: ["medium-business", "large-business", "manufacturing"],
  },

  {
    slug: "sage-200-evolution",
    name: "Sage 200 Evolution",
    categorySlug: "erp-software",
    tagline: "The step up from Pastel, without leaving Sage",
    descriptionShort:
      "Sage 200 Evolution is the natural upgrade for South African businesses that have outgrown Pastel but are not ready for the cost and disruption of SAP.",
    descriptionFull: `
<p>Sage 200 Evolution occupies a useful position in the local market: more capable than Pastel, considerably less demanding than SAP Business One, and familiar to the same partner and bookkeeping community that already supports Sage products.</p>
<p>It handles multi company, multi warehouse, manufacturing, job costing and serious inventory properly, with South African VAT and reporting built in rather than localised on. For a business turning over between roughly twenty and two hundred million rand it is often the right size of system.</p>
<p>Migration from Pastel is a well trodden path, which matters. Partners have done it many times and the data usually comes across cleanly, which is not something you can say about every ERP migration.</p>
<p>It is sold on a quoted basis through Sage partners, scoped by modules and users. The interface is functional rather than modern, and businesses coming from cloud products find it dated.</p>`,
    vendorName: "Sage South Africa",
    vendorWebsite: "https://www.sage.com/en-za/",
    foundedYear: 2003,
    featured: false,
    topFeatures: [
      "Natural upgrade path from Pastel",
      "Multi company and multi warehouse",
      "South African VAT built in",
      "Established local partner network",
    ],
    features: [
      "Financial management",
      "Multi company consolidation",
      "Inventory and multi warehouse",
      "Manufacturing module",
      "Job costing",
      "Bill of materials",
      "Point of sale",
      "CRM module",
      "Fixed assets",
      "Business intelligence add on",
      "Sage payroll integration",
      "Extensive reporting",
    ],
    integrations: ["Sage Pastel Payroll", "Sage 50cloud Pastel", "SimplePay"],
    supportTypes: ["Partner network", "Telephone", "Email", "Knowledge base"],
    countries: ["South Africa", "Namibia", "Botswana", "Zimbabwe"],
    languages: ["English", "Afrikaans"],
    rating: 3.8, ease: 3.4, value: 3.8, service: 3.7, functionality: 4.4,
    reviewCount: 130,
    alternatives: ["sap-business-one", "syspro", "odoo", "sage-50cloud-pastel"],
    bestFor: ["medium-business", "stock-heavy", "manufacturing"],
  },

  {
    slug: "syspro",
    name: "SYSPRO",
    categorySlug: "erp-software",
    tagline: "South African built ERP for manufacturing and distribution",
    descriptionShort:
      "SYSPRO was built in South Africa for manufacturers and distributors, and its depth in production and inventory is the reason it competes with far larger vendors.",
    descriptionFull: `
<p>SYSPRO is one of the genuine South African software successes, founded in Johannesburg in 1978 and now sold worldwide, still with its strongest concentration of expertise here.</p>
<p>Its specialisation is manufacturing and distribution, and the depth shows. Material requirements planning, production scheduling, lot traceability, quality management and complex inventory valuation are all handled at a level that generic ERP products approximate at best. For a manufacturer, that difference is the whole decision.</p>
<p>Being locally headquartered has practical benefits. Support is in your time zone, the consultants understand South African trading conditions, and local VAT and statutory reporting are native rather than bolted on.</p>
<p>It is an ERP commitment with everything that implies: quoted licensing, a scoped implementation and a real training requirement. For a business outside manufacturing or distribution it is more specialised than the job needs.</p>`,
    vendorName: "SYSPRO",
    vendorWebsite: "https://za.syspro.com/",
    foundedYear: 1978,
    featured: false,
    topFeatures: [
      "Built in South Africa since 1978",
      "Deep manufacturing and MRP",
      "Lot traceability and quality management",
      "Local support and consultants",
    ],
    features: [
      "Material requirements planning",
      "Production scheduling",
      "Lot and serial traceability",
      "Quality management",
      "Inventory valuation methods",
      "Warehouse management",
      "Financial management",
      "Purchase and supplier management",
      "Sales order management",
      "Business intelligence",
      "Landed cost tracking",
      "Extensive reporting",
    ],
    integrations: ["Sage Pastel Payroll", "PaySpace", "Microsoft 365"],
    supportTypes: ["Telephone", "Email", "Partner network", "On site consultants"],
    countries: ["South Africa", "Namibia", "Botswana", "Zimbabwe", "Kenya"],
    languages: ["English", "Afrikaans"],
    rating: 4.0, ease: 3.3, value: 3.9, service: 4.2, functionality: 4.7,
    reviewCount: 92,
    alternatives: ["sap-business-one", "sage-200-evolution", "odoo", "quickeasy-bos"],
    bestFor: ["manufacturing", "distribution", "medium-business"],
  },

  {
    slug: "dynamics-365-business-central",
    name: "Dynamics 365 Business Central",
    categorySlug: "erp-software",
    tagline: "ERP for businesses already living in Microsoft 365",
    descriptionShort:
      "Business Central makes obvious sense if your business already runs on Microsoft 365, because the integration with Excel, Teams and Outlook is deeper than any competitor can match.",
    descriptionFull: `
<p>Microsoft's mid market ERP earns its place through integration rather than through any individual feature. If your finance team lives in Excel and your business runs on Teams and Outlook, Business Central connects to all of it natively, and that removes friction no competitor can match.</p>
<p>Functionally it covers the expected ground: financials, supply chain, project management, sales and service, with Power BI for reporting and the Power Platform available for extending it.</p>
<p>The South African implementation partner market is smaller than Sage's, which matters for both cost and availability. Microsoft runs a local pricing page but renders figures client side, so confirm the per user rate directly.</p>
<p>Choose it when the Microsoft alignment is genuine and strategic. Choose against it if you are picking on features alone, because Odoo and Sage 200 Evolution both offer more for less in the South African mid market.</p>`,
    vendorName: "Microsoft",
    vendorWebsite:
      "https://www.microsoft.com/en-za/dynamics-365/products/business-central/",
    foundedYear: 1975,
    featured: false,
    topFeatures: [
      "Deep Microsoft 365 integration",
      "Native Excel and Teams working",
      "Power BI reporting",
      "Power Platform extensibility",
    ],
    features: [
      "Financial management",
      "Supply chain management",
      "Project management",
      "Sales and service management",
      "Warehouse management",
      "Manufacturing on Premium tier",
      "Power BI reporting",
      "Excel and Outlook integration",
      "Multi company consolidation",
      "Power Platform extensibility",
      "Open API",
    ],
    integrations: ["Microsoft 365", "Power BI", "Teams", "Power Automate", "Dynamics 365 Sales"],
    supportTypes: ["Partner network", "Knowledge base", "Community", "Telephone"],
    countries: ["South Africa", "Global"],
    languages: ["English", "Afrikaans"],
    rating: 3.9, ease: 3.6, value: 3.7, service: 3.6, functionality: 4.4,
    reviewCount: 75,
    alternatives: ["odoo", "sage-200-evolution", "sap-business-one", "syspro"],
    bestFor: ["medium-business", "microsoft-shops", "growing-business"],
  },

  /* ==================================================================== */
  /* Project management                                                    */
  /* ==================================================================== */
  {
    slug: "monday-com",
    name: "monday.com",
    categorySlug: "project-management",
    tagline: "Visual work management that teams actually adopt",
    descriptionShort:
      "monday.com is the easiest of the project tools to get a whole team using, and its per seat cost adds up faster than most businesses model at signup.",
    descriptionFull: `
<p>monday.com's strength is adoption. The boards are colourful, the interface is immediately legible, and non technical staff start using it without training. In a category where the tool that gets used beats the tool that impresses, that matters enormously.</p>
<p>It has grown well beyond task boards. Timelines, Gantt views, workload management, no code automations, forms and dashboards all work, and it flexes into CRM, recruitment or asset tracking if you want it to.</p>
<p>The cost trajectory deserves attention. Seats are sold in blocks of three, so a four person team pays for six, and per seat pricing at Standard or Pro tiers adds up quickly past twenty people. Model it at the size you expect to be, not the size you are.</p>
<p>It is priced in dollars with no rand option, so exchange rate movement flows through to your renewal. Guest access for clients is available and worth checking against your use case.</p>`,
    vendorName: "monday.com",
    vendorWebsite: "https://monday.com/",
    foundedYear: 2012,
    featured: false,
    topFeatures: [
      "Boards, timelines and Gantt views",
      "Workload management",
      "Automations without code",
      "Client guest access",
    ],
    features: [
      "Kanban boards and timelines",
      "Gantt charts",
      "Workload and capacity view",
      "No code automations",
      "Custom dashboards",
      "Forms and request intake",
      "Time tracking",
      "Client guest access",
      "Document collaboration",
      "Mobile app",
      "Extensive integrations",
      "Open API",
    ],
    integrations: ["Slack", "Google Drive", "Xero", "HubSpot", "Microsoft Teams", "Zapier"],
    supportTypes: ["Email", "Live chat", "Knowledge base", "Community"],
    countries: ["South Africa", "Global"],
    languages: ["English"],
    rating: 4.4, ease: 4.6, value: 4.0, service: 4.2, functionality: 4.3,
    reviewCount: 285,
    alternatives: ["asana", "clickup", "trello", "wrike"],
    bestFor: ["growing-business", "agencies", "medium-business"],
  },

  {
    slug: "asana",
    name: "Asana",
    categorySlug: "project-management",
    tagline: "Structured work management for teams that plan properly",
    descriptionShort:
      "Asana is the most disciplined of the mainstream project tools, with genuine strength in dependencies, portfolios and goals that lighter products do not attempt.",
    descriptionFull: `
<p>Asana sits a step up in seriousness from board first tools. Task dependencies, portfolio views, goal tracking and workload management are all first class, and for organisations running many projects across departments that structure is the reason to choose it.</p>
<p>It is also well designed. The interface manages to expose real complexity without feeling heavy, and switching between list, board, timeline and calendar views takes one click.</p>
<p>The free Personal tier supports up to ten collaborators and is genuinely usable for a small team. Paid tiers are priced per user per month in dollars, billed annually for the advertised rate.</p>
<p>The honest limitation is that Asana rewards teams who will maintain the structure. If nobody updates dependencies or keeps the portfolio current, you are paying for capability you are not using, and a simpler board would serve you better.</p>`,
    vendorName: "Asana",
    vendorWebsite: "https://asana.com/",
    foundedYear: 2008,
    featured: false,
    topFeatures: [
      "Task dependencies done properly",
      "Portfolio and goal tracking",
      "Workload management",
      "Free tier for up to ten collaborators",
    ],
    features: [
      "List, board, timeline and calendar views",
      "Task dependencies",
      "Portfolio management",
      "Goal tracking",
      "Workload management",
      "Custom fields and rules",
      "Forms and request intake",
      "Approvals and proofing",
      "Reporting dashboards",
      "Mobile app",
      "Extensive integrations",
      "Open API",
    ],
    integrations: ["Slack", "Google Drive", "Microsoft Teams", "Zoom", "Zapier"],
    supportTypes: ["Email", "Knowledge base", "Academy", "Community"],
    countries: ["South Africa", "Global"],
    languages: ["English"],
    rating: 4.3, ease: 4.2, value: 3.9, service: 4.0, functionality: 4.4,
    reviewCount: 187,
    alternatives: ["monday-com", "clickup", "wrike", "trello"],
    bestFor: ["medium-business", "growing-business", "agencies"],
  },

  {
    slug: "trello",
    name: "Trello",
    categorySlug: "project-management",
    tagline: "The simplest board that works",
    descriptionShort:
      "Trello does one thing well and costs almost nothing, and it runs out of road the moment you need dependencies, resourcing or reporting.",
    descriptionFull: `
<p>Trello is the easiest project tool in existence to start using. Cards on lists, drag them across, done. A team can be productive in it inside ten minutes with no training and no configuration, and its free tier is genuinely usable rather than a trap.</p>
<p>Power ups extend it where needed, Butler automation handles repetitive moves, and the mobile apps work properly offline, which matters more here than in most markets.</p>
<p>Its limits are honest and well known. There are no real task dependencies, no resource management and no meaningful reporting. The moment your projects need a critical path or you need to know who is over capacity, you have outgrown it.</p>
<p>That is not a criticism. Most teams need less than they think, and a board that everyone updates is worth more than a planning system nobody maintains. Priced per user per month in dollars, with the free tier covering a lot of small teams entirely.</p>`,
    vendorName: "Atlassian",
    vendorWebsite: "https://trello.com/",
    foundedYear: 2011,
    featured: false,
    topFeatures: [
      "Free plan that is genuinely usable",
      "Butler automation",
      "Power ups for extra capability",
      "Mobile apps that work offline",
    ],
    features: [
      "Kanban boards and cards",
      "Checklists and due dates",
      "Butler automation",
      "Power up integrations",
      "Board templates",
      "Calendar and timeline views on paid tiers",
      "File attachments",
      "Guest access",
      "Mobile apps",
      "Open API",
    ],
    integrations: ["Slack", "Google Drive", "Jira", "Confluence", "Zapier"],
    supportTypes: ["Email", "Knowledge base", "Community"],
    countries: ["South Africa", "Global"],
    languages: ["English"],
    rating: 4.3, ease: 4.8, value: 4.5, service: 3.7, functionality: 3.6,
    reviewCount: 345,
    alternatives: ["asana", "monday-com", "clickup", "wrike"],
    bestFor: ["sole-trader", "small-business", "startups"],
  },

  {
    slug: "clickup",
    name: "ClickUp",
    categorySlug: "project-management",
    tagline: "Enormous capability, and an interface to match",
    descriptionShort:
      "ClickUp offers more features per rand than anything else in this category, and the density of its interface is a genuine barrier to team adoption.",
    descriptionFull: `
<p>ClickUp's proposition is that one tool should replace tasks, documents, goals, whiteboards, time tracking and chat. On features per rand it wins this category comfortably, and its free forever tier is unusually generous.</p>
<p>Views are its strength. List, board, Gantt, calendar, timeline, workload, mind map and table are all available on the same data, so different people can work the way they prefer without fragmenting the project.</p>
<p>The cost is cognitive. There is a great deal of interface, the settings run deep, and teams routinely report that adoption stalls because people find it overwhelming. It rewards a business willing to configure it down to what they actually need and hide the rest.</p>
<p>Priced per user per month in dollars. Worth a trial if you have somebody willing to own the configuration, and worth avoiding if you do not.</p>`,
    vendorName: "ClickUp",
    vendorWebsite: "https://clickup.com/",
    foundedYear: 2017,
    featured: false,
    topFeatures: [
      "Very generous free forever tier",
      "Many views on the same data",
      "Docs, goals and whiteboards included",
      "Built in time tracking",
    ],
    features: [
      "List, board, Gantt and calendar views",
      "Workload and timeline views",
      "Documents and wikis",
      "Goals and targets",
      "Whiteboards",
      "Time tracking",
      "Custom fields and statuses",
      "Automations",
      "Forms",
      "Dashboards and reporting",
      "Mobile app",
      "Open API",
    ],
    integrations: ["Slack", "Google Drive", "Microsoft Teams", "Zoom", "Zapier"],
    supportTypes: ["Email", "Live chat", "Knowledge base", "Community"],
    countries: ["South Africa", "Global"],
    languages: ["English"],
    rating: 4.1, ease: 3.5, value: 4.5, service: 3.9, functionality: 4.6,
    reviewCount: 121,
    alternatives: ["monday-com", "asana", "wrike", "trello"],
    bestFor: ["growing-business", "agencies", "cost-conscious"],
  },

  {
    slug: "wrike",
    name: "Wrike",
    categorySlug: "project-management",
    tagline: "Project management for teams that bill their time",
    descriptionShort:
      "Wrike is built for professional services delivery, with proofing, resource management and time tracking that agencies and consultancies genuinely need.",
    descriptionFull: `
<p>Wrike is aimed squarely at businesses that deliver client work, and it shows in which features are strong. Resource management, time tracking, request forms and creative proofing are all handled properly rather than bolted on.</p>
<p>For an agency, the proofing workflow alone can justify it. Marking up creative work in the same system that holds the task and the timesheet removes a whole round of email.</p>
<p>Reporting is strong and the custom workflows are flexible enough for most delivery processes without needing a consultant.</p>
<p>It is less immediately friendly than monday.com and takes longer to set up than Trello. The interface is dense in places and new users need a proper introduction. Priced per user per month in dollars, with a free tier for small teams and a 14 day trial on paid plans.</p>`,
    vendorName: "Wrike",
    vendorWebsite: "https://www.wrike.com/",
    foundedYear: 2006,
    featured: false,
    topFeatures: [
      "Creative proofing and approvals",
      "Resource management",
      "Time tracking and billing",
      "Custom request forms",
    ],
    features: [
      "Task and project management",
      "Gantt charts and timelines",
      "Resource and capacity management",
      "Time tracking",
      "Creative proofing and approvals",
      "Custom request forms",
      "Custom workflows",
      "Reporting and dashboards",
      "Client guest access",
      "Mobile app",
      "Open API",
    ],
    integrations: ["Slack", "Google Drive", "Microsoft Teams", "Adobe Creative Cloud", "Zapier"],
    supportTypes: ["Email", "Knowledge base", "Community", "Telephone on higher tiers"],
    countries: ["South Africa", "Global"],
    languages: ["English"],
    rating: 4.0, ease: 3.7, value: 3.8, service: 3.9, functionality: 4.3,
    reviewCount: 68,
    alternatives: ["asana", "monday-com", "clickup", "insightly"],
    bestFor: ["agencies", "consultants", "medium-business"],
  },
];

/** Sanity check used by the seed script and the tests. */
export function catalogueStats() {
  const byCategory = new Map<string, number>();
  let reviews = 0;
  for (const entry of CATALOGUE) {
    byCategory.set(entry.categorySlug, (byCategory.get(entry.categorySlug) ?? 0) + 1);
    reviews += entry.reviewCount;
  }
  return { products: CATALOGUE.length, reviews, byCategory };
}
