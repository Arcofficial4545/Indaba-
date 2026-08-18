/**
 * Row types mirroring the Postgres schema.
 *
 * Aggregate rating fields are marked readonly because they are written only by
 * the `update_software_ratings()` trigger. If application code ever needs to
 * assign one, that is the bug, not the type.
 */

export type PublishStatus = "published" | "draft";
export type ReviewStatus = "published" | "hidden";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  software_count: number;
  display_order: number;
  created_at: string;
}

export interface PricingPlan {
  name: string;
  price: number | null;
  period: string;
  currency: string;
  vat_inclusive: boolean | null;
  description?: string;
  features: string[];
  highlighted?: boolean;
  user_limit?: string | null;
}

export interface Screenshot {
  url: string;
  alt: string;
  caption?: string;
}

export interface Software {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description_short: string;
  /** HTML, rendered into `.prose-content` */
  description_full: string;
  logo_url: string | null;
  screenshots: Screenshot[];
  category_id: string | null;

  starting_price: number | null;
  price_currency: string;
  billing_period: string;
  /** Vendors quote differently. Null means we have not confirmed it. */
  vat_inclusive: boolean | null;
  price_source_url: string | null;
  price_verified_at: string | null;
  free_trial: boolean;
  free_trial_days: number | null;
  free_version: boolean;
  pricing_plans: PricingPlan[];

  features: string[];
  top_features: string[];
  integrations: string[];
  brand_color: string | null;

  affiliate_url: string | null;
  vendor_website: string | null;
  vendor_name: string | null;
  founded_year: number | null;
  support_types: string[];
  countries_available: string[];
  languages: string[];

  readonly overall_rating: number;
  readonly ease_of_use_rating: number;
  readonly value_for_money_rating: number;
  readonly customer_service_rating: number;
  readonly functionality_rating: number;
  readonly review_count: number;

  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;

  status: PublishStatus;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

/** A software row joined to its category, which is how most pages need it. */
export interface SoftwareWithCategory extends Software {
  category: Pick<Category, "id" | "name" | "slug" | "icon"> | null;
}

export interface Review {
  id: string;
  software_id: string;
  reviewer_name: string;
  reviewer_job_title: string | null;
  reviewer_company: string | null;
  reviewer_industry: string | null;
  reviewer_company_size: string | null;
  reviewer_country: string;
  reviewer_city: string | null;
  reviewer_avatar_url: string | null;
  verified_linkedin: boolean;
  verified_badge: boolean;
  used_for_duration: string | null;

  overall_rating: number;
  ease_of_use: number;
  value_for_money: number;
  customer_service: number;
  functionality: number;

  review_title: string;
  summary: string;
  pros: string | null;
  cons: string | null;
  vendor_response: string | null;
  vendor_response_date: string | null;
  review_date: string;
  helpful_count: number;
  status: ReviewStatus;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string | null;
  category_tag: string | null;
  related_software_id: string | null;
  author_name: string;
  author_bio: string | null;
  author_avatar_url: string | null;
  author_title: string | null;
  meta_title: string | null;
  meta_description: string | null;
  read_time_minutes: number;
  status: PublishStatus;
  featured: boolean;
  published_date: string;
}

export interface Comparison {
  id: string;
  software_a_id: string;
  software_b_id: string;
  slug: string;
  custom_verdict: string | null;
  meta_title: string | null;
  meta_description: string | null;
  status: PublishStatus;
  created_at: string;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  status: PublishStatus;
  updated_at: string;
}

export interface AffiliateClick {
  id: string;
  software_id: string | null;
  software_name: string;
  affiliate_url: string;
  clicked_at: string;
  /** Peppered SHA-256. A raw IP is never stored, for POPIA reasons. */
  ip_hash: string | null;
  user_agent: string | null;
  referrer: string | null;
  country_code: string | null;
}

export type SubscriberStatus = "pending" | "confirmed" | "unsubscribed";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: SubscriberStatus;
  interests: string[];
  confirm_token: string | null;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  consent_ip_hash: string | null;
  consent_source: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface PriceHistoryEntry {
  id: string;
  software_id: string;
  starting_price: number | null;
  price_currency: string;
  vat_inclusive: boolean | null;
  source_url: string | null;
  recorded_at: string;
}

/** The five dimensions every rating is broken down by. */
export const RATING_DIMENSIONS = [
  { key: "ease_of_use", label: "Ease of use" },
  { key: "value_for_money", label: "Value for money" },
  { key: "customer_service", label: "Customer service" },
  { key: "functionality", label: "Functionality" },
] as const;

export type RatingDimension = (typeof RATING_DIMENSIONS)[number]["key"];

/** Star counts 1 to 5, used by the distribution bars. */
export type StarDistribution = Record<1 | 2 | 3 | 4 | 5, number>;

export const COMPANY_SIZES = [
  "1 to 10 employees",
  "11 to 50 employees",
  "51 to 200 employees",
  "201 to 500 employees",
  "501 or more employees",
] as const;

export type CompanySize = (typeof COMPANY_SIZES)[number];
