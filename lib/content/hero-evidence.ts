/**
 * Public-source snapshots for the three products demonstrated in the hero.
 * Retrieved 2026-09-08. Capterra figures were read from its indexed product
 * pages (direct requests returned unsupported content); they are snapshots,
 * not a live review feed and never Indaba review aggregates.
 *
 * Prices were read from the linked vendor pages. Xero uses the regular
 * Starter price, not the temporary 80% promotion; Sage's FAQ confirms R240/mo.
 * Zoho's entry plan is free. No generated catalogue ratings are used here.
 */
export type HeroEvidence = {
  rating: number;
  reviews: number;
  ratingSource: string;
  price: number;
  vatInclusive: boolean | null;
  freePlan: boolean;
  plan: string;
  priceSource: string;
};

export const HERO_EVIDENCE_DATE = "2026-09-08";
export const HERO_EVIDENCE: Record<string, HeroEvidence> = {
  "sage-accounting": {
    rating: 4.5, reviews: 547,
    ratingSource: "https://www.capterra.co.za/software/140059/sage-one-uk",
    price: 240, vatInclusive: true, freePlan: false, plan: "Accounting Start",
    priceSource: "https://www.sage.com/en-za/sage-business-cloud/accounting/pricing/",
  },
  xero: {
    rating: 4.4, reviews: 3250,
    ratingSource: "https://www.capterra.co.za/software/169561/xero",
    price: 450, vatInclusive: true, freePlan: false, plan: "Starter",
    priceSource: "https://www.xero.com/za/pricing-plans/",
  },
  "zoho-books": {
    rating: 4.4, reviews: 671,
    ratingSource: "https://www.capterra.co.za/software/134507/zoho-books",
    price: 0, vatInclusive: false, freePlan: true, plan: "Free plan",
    priceSource: "https://www.zoho.com/za/books/pricing/",
  },
};
