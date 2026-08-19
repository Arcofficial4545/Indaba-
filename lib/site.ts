/**
 * Single source of truth for every market signal.
 *
 * Nothing about the South African framing should be hardcoded anywhere else.
 * If a country, currency or contact detail appears in a component, it comes
 * from here.
 */

export const SITE_NAME = "Indaba";
export const SITE_DOMAIN = "indaba.co.za";
export const SITE_TAGLINE =
  "South Africa's independent business software guide";
export const SITE_DESCRIPTION =
  "Independent reviews, verified ratings and side by side comparisons of accounting, payroll, HR, CRM, ERP and project management software for South African businesses.";

export const CONTACT_EMAIL = "hello@indaba.co.za";
export const CONTACT_PHONE = "+27 21 300 4820";
export const SITE_LOCATION = "Cape Town, South Africa";
export const SITE_LOCALE = "en-ZA";
export const OG_LOCALE = "en_ZA";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  `https://${SITE_DOMAIN}`;

export const REVIEWER_COUNTRIES = [
  "South Africa",
  "Namibia",
  "Botswana",
  "Zambia",
  "Kenya",
  "Nigeria",
  "Zimbabwe",
  "Other",
] as const;

export type ReviewerCountry = (typeof REVIEWER_COUNTRIES)[number];

export const DEFAULT_REVIEWER_COUNTRY: ReviewerCountry = "South Africa";

export const CURRENCIES = ["ZAR", "USD", "EUR", "GBP"] as const;
export type Currency = (typeof CURRENCIES)[number];
export const DEFAULT_CURRENCY: Currency = "ZAR";

export const CURRENCY_SYMBOLS: Record<string, string> = {
  ZAR: "R",
  USD: "US$",
  EUR: "€",
  GBP: "£",
};

/** VAT is 15% in South Africa. Used wherever a price needs a VAT note. */
export const VAT_RATE = 0.15;

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/company/indaba-reviews",
  x: "https://x.com/indaba_reviews",
  facebook: "https://www.facebook.com/indabareviews",
} as const;

/** Primary navigation, used by the navbar and the footer Explore column. */
export const MAIN_NAV = [
  { label: "Software", href: "/software" },
  { label: "Categories", href: "/categories" },
  { label: "Compare", href: "/compare" },
  { label: "Guides", href: "/blog" },
  { label: "About", href: "/about" },
] as const;

export const LEGAL_NAV = [
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Cookie policy", href: "/cookie-policy" },
  { label: "Terms", href: "/terms" },
  { label: "PAIA manual", href: "/paia-manual" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Editorial policy", href: "/editorial-policy" },
  { label: "Affiliate disclosure", href: "/affiliate-disclosure" },
] as const;

export const COMPANY_NAV = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Editorial policy", href: "/editorial-policy" },
] as const;

/**
 * The Open Graph card URL for a page.
 *
 * Built here rather than inline at each call site so every card carries the
 * same parameter names, and so a change to the card only has to be made in one
 * place plus the route that draws it.
 */
export function ogImageUrl(params: {
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  rating?: string | number;
  reviews?: string | number;
}): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && String(value).length > 0) {
      query.set(key, String(value));
    }
  }
  const search = query.toString();
  return `${SITE_URL}/api/og${search ? `?${search}` : ""}`;
}

/**
 * Hero copy.
 *
 * It lives here rather than in the component because every line of it is a
 * market signal: the country, the currency, the tax and the city. A component
 * that hardcoded "rands" or "South African" would have to be found and edited
 * by hand the day this directory covers a second market.
 */
export const HERO_COPY = {
  /** 8 words. Names the country, names the method. */
  headline: "South African business software, weighed in the open.",
  /**
   * 19 words, and every clause is checkable: prices carry `vat_inclusive`,
   * reviews carry `reviewer_name` and `verified_linkedin`, and the ordering is
   * a weighted average of ratings, as the editorial policy states.
   */
  subheading:
    "Every price in rands with VAT shown, every reviewer named and verified, and no vendor can buy a ranking.",
  /** A query a buyer actually types, not a list of nouns. */
  searchPlaceholder: "payroll that submits EMP201 to SARS",
  searchLabel: "Search South African business software",
  chipsLabel: "Popular categories",
  /*
    Labels the row of vendor marks under the counts. It claims only what the
    catalogue can back: these products carry reviews here. It does not claim
    partnership, endorsement or sponsorship, none of which exist.
  */

} as const;
