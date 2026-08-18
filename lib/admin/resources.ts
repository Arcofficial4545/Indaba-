/**
 * The admin resource registry.
 *
 * One field map per table drives both the form renderer and the save action.
 * That is the whole security design: a field that is not in this map is not
 * rendered and, more importantly, is stripped before the write. Nothing
 * outside the whitelist can be set, whatever the browser posts.
 *
 * Note what is deliberately absent from `software`: overall_rating and its
 * four siblings, and review_count. Those are written only by the database
 * trigger. Putting them here would make it possible for a person to overwrite
 * a computed rating, which is the one thing this platform must never allow.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "html"
  | "number"
  | "checkbox"
  | "select"
  | "date"
  | "color"
  | "json";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  options?: { value: string; label: string }[];
  /** Populate the options from another table at render time. */
  optionsFrom?: { table: string; value: string; label: string };
  /** Full width in the two column form grid. */
  wide?: boolean;
};

export type Resource = {
  key: string;
  label: string;
  plural: string;
  table: string;
  /** Column used in the URL and for uniqueness. */
  slugField?: string;
  /** Columns shown in the list view. */
  listColumns: { name: string; label: string; type?: "badge" | "date" | "number" }[];
  /** Default ordering for the list view. */
  orderBy: { column: string; ascending: boolean };
  /** Columns searched by the list filter. */
  searchColumns: string[];
  fields: Field[];
  /** Set false where creating a row by hand makes no sense. */
  canCreate?: boolean;
  canDelete?: boolean;
};

const STATUS_FIELD: Field = {
  name: "status",
  label: "Status",
  type: "select",
  required: true,
  options: [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
  ],
};

export const RESOURCES: Record<string, Resource> = {
  software: {
    key: "software",
    label: "Product",
    plural: "Software",
    table: "software",
    slugField: "slug",
    orderBy: { column: "name", ascending: true },
    searchColumns: ["name", "slug", "vendor_name"],
    listColumns: [
      { name: "name", label: "Name" },
      { name: "vendor_name", label: "Vendor" },
      { name: "overall_rating", label: "Rating", type: "number" },
      { name: "review_count", label: "Reviews", type: "number" },
      { name: "status", label: "Status", type: "badge" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true, help: "Used in the URL. Changing it breaks existing links unless you add a redirect." },
      { name: "tagline", label: "Tagline", type: "text", wide: true },
      { name: "description_short", label: "Short description", type: "textarea", required: true, wide: true },
      { name: "description_full", label: "Full description", type: "html", required: true, wide: true, help: "HTML. Rendered into the profile page prose style." },
      { name: "category_id", label: "Category", type: "select", optionsFrom: { table: "categories", value: "id", label: "name" } },

      { name: "starting_price", label: "Starting price", type: "number", help: "In rand. Leave empty where the vendor publishes no list price." },
      { name: "billing_period", label: "Billing period", type: "select", options: [
        { value: "month", label: "Per month" },
        { value: "year", label: "Per year" },
        { value: "user", label: "Per user" },
        { value: "employee", label: "Per employee" },
      ] },
      { name: "vat_inclusive", label: "VAT included", type: "checkbox", help: "Leave off only when you have confirmed the price excludes VAT." },
      { name: "price_source_url", label: "Price source URL", type: "text", wide: true, help: "The vendor page the figure came from. Required before a price counts as verified." },
      { name: "price_verified_at", label: "Price verified on", type: "date" },
      { name: "free_trial", label: "Has a free trial", type: "checkbox" },
      { name: "free_trial_days", label: "Trial length in days", type: "number" },
      { name: "free_version", label: "Has a free plan", type: "checkbox" },
      { name: "pricing_plans", label: "Pricing plans", type: "json", wide: true },

      { name: "top_features", label: "Top features", type: "json", wide: true, help: "Array of strings. Shown highlighted on the profile." },
      { name: "features", label: "All features", type: "json", wide: true },
      { name: "integrations", label: "Integrations", type: "json", wide: true },
      { name: "support_types", label: "Support types", type: "json" },
      { name: "countries_available", label: "Countries", type: "json" },
      { name: "languages", label: "Languages", type: "json" },
      { name: "screenshots", label: "Screenshots", type: "json", wide: true },

      { name: "brand_color", label: "Brand colour", type: "color" },
      { name: "logo_url", label: "Logo URL", type: "text", wide: true },
      { name: "vendor_name", label: "Vendor name", type: "text" },
      { name: "vendor_website", label: "Vendor website", type: "text" },
      { name: "affiliate_url", label: "Affiliate URL", type: "text", wide: true },
      { name: "founded_year", label: "Founded", type: "number" },

      { name: "meta_title", label: "Meta title", type: "text", wide: true },
      { name: "meta_description", label: "Meta description", type: "textarea", wide: true },
      { name: "og_image_url", label: "OG image URL", type: "text", wide: true },

      STATUS_FIELD,
      { name: "featured", label: "Featured", type: "checkbox" },
    ],
    canCreate: true,
    canDelete: true,
  },

  reviews: {
    key: "reviews",
    label: "Review",
    plural: "Reviews",
    table: "reviews",
    orderBy: { column: "review_date", ascending: false },
    searchColumns: ["reviewer_name", "review_title"],
    listColumns: [
      { name: "reviewer_name", label: "Reviewer" },
      { name: "review_title", label: "Title" },
      { name: "overall_rating", label: "Rating", type: "number" },
      { name: "review_date", label: "Date", type: "date" },
      { name: "status", label: "Status", type: "badge" },
    ],
    fields: [
      { name: "software_id", label: "Product", type: "select", required: true, optionsFrom: { table: "software", value: "id", label: "name" } },
      { name: "reviewer_name", label: "Reviewer name", type: "text", required: true },
      { name: "reviewer_job_title", label: "Job title", type: "text" },
      { name: "reviewer_company", label: "Company", type: "text" },
      { name: "reviewer_industry", label: "Industry", type: "text" },
      { name: "reviewer_company_size", label: "Company size", type: "text" },
      { name: "reviewer_city", label: "City", type: "text" },
      { name: "reviewer_country", label: "Country", type: "text" },
      { name: "used_for_duration", label: "Used for", type: "text" },

      { name: "overall_rating", label: "Overall", type: "number", required: true, help: "1 to 5. This feeds the product average through the database trigger." },
      { name: "ease_of_use", label: "Ease of use", type: "number", required: true },
      { name: "value_for_money", label: "Value for money", type: "number", required: true },
      { name: "customer_service", label: "Customer service", type: "number", required: true },
      { name: "functionality", label: "Functionality", type: "number", required: true },

      { name: "review_title", label: "Title", type: "text", required: true, wide: true },
      { name: "summary", label: "Summary", type: "textarea", required: true, wide: true },
      { name: "pros", label: "Pros", type: "textarea", wide: true },
      { name: "cons", label: "Cons", type: "textarea", wide: true },
      { name: "vendor_response", label: "Vendor response", type: "textarea", wide: true },
      { name: "vendor_response_date", label: "Response date", type: "date" },
      { name: "review_date", label: "Review date", type: "date" },

      { name: "verified_badge", label: "Verified", type: "checkbox" },
      { name: "verified_linkedin", label: "LinkedIn verified", type: "checkbox" },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        options: [
          { value: "hidden", label: "Hidden, awaiting moderation" },
          { value: "published", label: "Published" },
        ],
      },
    ],
    canCreate: true,
    canDelete: true,
  },

  categories: {
    key: "categories",
    label: "Category",
    plural: "Categories",
    table: "categories",
    slugField: "slug",
    orderBy: { column: "display_order", ascending: true },
    searchColumns: ["name", "slug"],
    listColumns: [
      { name: "name", label: "Name" },
      { name: "slug", label: "Slug" },
      { name: "software_count", label: "Products", type: "number" },
      { name: "display_order", label: "Order", type: "number" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "icon", label: "Icon", type: "select", options: [
        { value: "calculator", label: "Calculator" },
        { value: "wallet", label: "Wallet" },
        { value: "users", label: "Users" },
        { value: "handshake", label: "Handshake" },
        { value: "boxes", label: "Boxes" },
        { value: "kanban", label: "Kanban" },
      ] },
      { name: "display_order", label: "Display order", type: "number" },
      { name: "description", label: "Description", type: "textarea", wide: true },
    ],
    canCreate: true,
    canDelete: true,
  },

  articles: {
    key: "articles",
    label: "Article",
    plural: "Articles",
    table: "articles",
    slugField: "slug",
    orderBy: { column: "published_date", ascending: false },
    searchColumns: ["title", "slug", "author_name"],
    listColumns: [
      { name: "title", label: "Title" },
      { name: "category_tag", label: "Category" },
      { name: "author_name", label: "Author" },
      { name: "published_date", label: "Published", type: "date" },
      { name: "status", label: "Status", type: "badge" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, wide: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "category_tag", label: "Category tag", type: "text" },
      { name: "excerpt", label: "Excerpt", type: "textarea", required: true, wide: true },
      { name: "content", label: "Content", type: "html", required: true, wide: true },
      { name: "featured_image_url", label: "Featured image URL", type: "text", wide: true },
      { name: "related_software_id", label: "Related product", type: "select", optionsFrom: { table: "software", value: "id", label: "name" } },
      { name: "author_name", label: "Author", type: "text", required: true },
      { name: "author_title", label: "Author title", type: "text" },
      { name: "author_bio", label: "Author bio", type: "textarea", wide: true },
      { name: "author_avatar_url", label: "Author avatar URL", type: "text", wide: true },
      { name: "read_time_minutes", label: "Read time in minutes", type: "number" },
      { name: "published_date", label: "Published date", type: "date" },
      { name: "meta_title", label: "Meta title", type: "text", wide: true },
      { name: "meta_description", label: "Meta description", type: "textarea", wide: true },
      STATUS_FIELD,
      { name: "featured", label: "Featured", type: "checkbox" },
    ],
    canCreate: true,
    canDelete: true,
  },

  comparisons: {
    key: "comparisons",
    label: "Comparison",
    plural: "Comparisons",
    table: "comparisons",
    slugField: "slug",
    orderBy: { column: "created_at", ascending: false },
    searchColumns: ["slug"],
    listColumns: [
      { name: "slug", label: "Pair" },
      { name: "status", label: "Status", type: "badge" },
      { name: "created_at", label: "Created", type: "date" },
    ],
    fields: [
      { name: "software_a_id", label: "First product", type: "select", required: true, optionsFrom: { table: "software", value: "id", label: "name" } },
      { name: "software_b_id", label: "Second product", type: "select", required: true, optionsFrom: { table: "software", value: "id", label: "name" } },
      { name: "slug", label: "Slug", type: "text", required: true, help: "Format a-vs-b. Use the alphabetically first slug on the left." },
      { name: "custom_verdict", label: "Custom verdict", type: "html", wide: true, help: "Leave empty to use the generated verdict." },
      { name: "meta_title", label: "Meta title", type: "text", wide: true },
      { name: "meta_description", label: "Meta description", type: "textarea", wide: true },
      STATUS_FIELD,
    ],
    canCreate: true,
    canDelete: true,
  },

  pages: {
    key: "pages",
    label: "Page",
    plural: "Pages",
    table: "pages",
    slugField: "slug",
    orderBy: { column: "slug", ascending: true },
    searchColumns: ["title", "slug"],
    listColumns: [
      { name: "title", label: "Title" },
      { name: "slug", label: "Slug" },
      { name: "status", label: "Status", type: "badge" },
      { name: "updated_at", label: "Updated", type: "date" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "content", label: "Content", type: "html", required: true, wide: true },
      { name: "meta_title", label: "Meta title", type: "text", wide: true },
      { name: "meta_description", label: "Meta description", type: "textarea", wide: true },
      STATUS_FIELD,
    ],
    canCreate: true,
    canDelete: true,
  },

  redirects: {
    key: "redirects",
    label: "Redirect",
    plural: "Redirects",
    table: "redirects",
    orderBy: { column: "from_path", ascending: true },
    searchColumns: ["from_path", "to_path"],
    listColumns: [
      { name: "from_path", label: "From" },
      { name: "to_path", label: "To" },
      { name: "status_code", label: "Code", type: "number" },
    ],
    fields: [
      { name: "from_path", label: "From path", type: "text", required: true, help: "Starts with a slash, for example /software/old-name" },
      { name: "to_path", label: "To path", type: "text", required: true },
      { name: "status_code", label: "Status code", type: "select", required: true, options: [
        { value: "301", label: "301 permanent" },
        { value: "302", label: "302 temporary" },
      ] },
    ],
    canCreate: true,
    canDelete: true,
  },
};

export function getResource(key: string): Resource | null {
  return RESOURCES[key] ?? null;
}

export const RESOURCE_KEYS = Object.keys(RESOURCES);

/**
 * Strips a submitted payload down to the registry's fields and coerces each
 * value to the right shape. Anything not in the map is dropped silently,
 * which is the point.
 */
export function sanitisePayload(
  resource: Resource,
  form: FormData,
): { values: Record<string, unknown>; errors: Record<string, string> } {
  const values: Record<string, unknown> = {};
  const errors: Record<string, string> = {};

  for (const field of resource.fields) {
    const raw = form.get(field.name);

    switch (field.type) {
      case "checkbox":
        values[field.name] = raw === "on" || raw === "true";
        break;

      case "number": {
        if (raw === null || raw === "") {
          values[field.name] = null;
        } else {
          const parsed = Number(raw);
          if (Number.isNaN(parsed)) {
            errors[field.name] = "Must be a number.";
          } else {
            values[field.name] = parsed;
          }
        }
        break;
      }

      case "json": {
        const text = String(raw ?? "").trim();
        if (!text) {
          values[field.name] = [];
        } else {
          try {
            values[field.name] = JSON.parse(text);
          } catch {
            errors[field.name] = "Not valid JSON.";
          }
        }
        break;
      }

      case "date": {
        const text = String(raw ?? "").trim();
        values[field.name] = text ? new Date(text).toISOString() : null;
        break;
      }

      default: {
        const text = String(raw ?? "").trim();
        values[field.name] = text === "" ? null : text;
      }
    }

    if (field.required) {
      const value = values[field.name];
      const empty =
        value === null ||
        value === undefined ||
        (typeof value === "string" && value === "");
      if (empty && field.type !== "checkbox") {
        errors[field.name] = `${field.label} is required.`;
      }
    }
  }

  return { values, errors };
}
