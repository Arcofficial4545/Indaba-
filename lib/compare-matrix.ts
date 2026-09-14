import { formatNumber, formatPricePerPeriod, formatRating } from "@/lib/format";
import type { SoftwareWithCategory } from "@/lib/types";

/**
 * The head-to-head matrix, derived once on the server.
 *
 * WHY THE DERIVATION LIVES HERE AND NOT IN THE COMPONENT. The matrix is a
 * client component — it carries a "differences only" toggle — and a
 * `SoftwareWithCategory` includes `description_full`, which is a page of HTML
 * per product. Passing two of those across the boundary to render forty rows
 * of ticks would ship the long-form review twice to draw a table. Deriving
 * here means the client receives the rows and nothing else.
 *
 * Everything below is computed from fields the catalogue already has. Nothing
 * is invented, and where a fact is unknown the cell says so rather than
 * guessing — an empty cell and a false one mean different things to somebody
 * spending money on the answer.
 */

export type CompareCell =
  /** A 0-5 score. Rendered with a bar, because five numbers in a column are
   *  four comparisons the reader should not have to do in their head. */
  | { kind: "rating"; value: number }
  /** Rands per period, or null when the vendor publishes nothing. */
  | { kind: "price"; value: number | null; label: string }
  | { kind: "bool"; value: boolean }
  | { kind: "text"; value: string }
  | { kind: "count"; value: number; label: string };

export type CompareRow = {
  label: string;
  a: CompareCell;
  b: CompareCell;
  /**
   * Which side this row favours, if either.
   *
   * Computed per row rather than declared, so it cannot drift from the values
   * printed beside it. "same" is a real answer and the commonest one — on a
   * forty-row matrix most rows tie, which is exactly why the differences
   * toggle exists.
   */
  leads: "a" | "b" | "same";
};

export type CompareGroup = {
  title: string;
  /** Shown under the group title. Says what the reader is looking at. */
  note?: string;
  rows: CompareRow[];
};

export type ComparePlan = {
  name: string;
  price: string;
  note: string;
};

function ratingRow(label: string, a: number, b: number): CompareRow {
  return {
    label,
    a: { kind: "rating", value: a },
    b: { kind: "rating", value: b },
    leads: a === b ? "same" : a > b ? "a" : "b",
  };
}

function boolRow(label: string, a: boolean, b: boolean): CompareRow {
  return {
    label,
    a: { kind: "bool", value: a },
    b: { kind: "bool", value: b },
    leads: a === b ? "same" : a ? "a" : "b",
  };
}

/** The union of two lists, alphabetical, as one tick row each. */
function unionRows(a: string[], b: string[]): CompareRow[] {
  return Array.from(new Set([...a, ...b]))
    .sort((x, y) => x.localeCompare(y))
    .map((item) => boolRow(item, a.includes(item), b.includes(item)));
}

export function buildCompareGroups(
  a: SoftwareWithCategory,
  b: SoftwareWithCategory,
): CompareGroup[] {
  /*
    Cheaper leads, and only when both are known. A published price against
    "pricing on request" is not a win for the published one — it is a
    comparison that cannot be made, and marking it as a win would be the page
    inventing a result.
  */
  const priceLeads: CompareRow["leads"] =
    a.starting_price === null || b.starting_price === null
      ? "same"
      : a.starting_price === b.starting_price
        ? "same"
        : a.starting_price < b.starting_price
          ? "a"
          : "b";

  const priceCell = (s: SoftwareWithCategory): CompareCell => ({
    kind: "price",
    value: s.starting_price,
    label:
      s.starting_price === null
        ? "Pricing on request"
        : formatPricePerPeriod(s.starting_price, s.billing_period ?? "month"),
  });

  const vat = (s: SoftwareWithCategory) =>
    s.vat_inclusive === true
      ? "Including VAT"
      : s.vat_inclusive === false
        ? "Excluding VAT"
        : "VAT basis unconfirmed";

  // Annotated, so the inline cell literals keep their discriminant instead of
  // widening `kind` to string.
  const groups: CompareGroup[] = [
    {
      title: "Ratings",
      note: ratingsNote(a, b),
      rows: [
        ratingRow("Overall", a.overall_rating, b.overall_rating),
        ratingRow("Ease of use", a.ease_of_use_rating, b.ease_of_use_rating),
        ratingRow("Value for money", a.value_for_money_rating, b.value_for_money_rating),
        ratingRow("Customer service", a.customer_service_rating, b.customer_service_rating),
        ratingRow("Functionality", a.functionality_rating, b.functionality_rating),
        {
          label: "Reviews behind the score",
          a: { kind: "count", value: a.review_count, label: formatNumber(a.review_count) },
          b: { kind: "count", value: b.review_count, label: formatNumber(b.review_count) },
          leads:
            a.review_count === b.review_count
              ? "same"
              : a.review_count > b.review_count
                ? "a"
                : "b",
        },
      ],
    },
    {
      title: "What it costs",
      note: "Entry price as the vendor publishes it, in rand.",
      rows: [
        { label: "Starting price", a: priceCell(a), b: priceCell(b), leads: priceLeads },
        {
          label: "VAT basis",
          a: { kind: "text", value: vat(a) },
          b: { kind: "text", value: vat(b) },
          leads: "same",
        },
        boolRow("Free plan", a.free_version, b.free_version),
        boolRow("Free trial", a.free_trial, b.free_trial),
        {
          label: "Trial length",
          a: {
            kind: "text",
            value: a.free_trial_days ? `${a.free_trial_days} days` : "No trial",
          },
          b: {
            kind: "text",
            value: b.free_trial_days ? `${b.free_trial_days} days` : "No trial",
          },
          leads:
            (a.free_trial_days ?? 0) === (b.free_trial_days ?? 0)
              ? "same"
              : (a.free_trial_days ?? 0) > (b.free_trial_days ?? 0)
                ? "a"
                : "b",
        },
      ],
    },
    {
      title: "Features",
      note: "Both lists merged, so neither product hides behind the other.",
      rows: unionRows(a.features, b.features),
    },
    {
      title: "Integrations",
      note: "Named connections each vendor lists.",
      rows: unionRows(a.integrations, b.integrations),
    },
    {
      title: "Support",
      note: "How you reach a human when it breaks.",
      rows: unionRows(a.support_types ?? [], b.support_types ?? []),
    },
  ];

  return groups.filter((group) => group.rows.length > 0);
}

/** Says where each side's ratings come from, so a sourced score is never passed off as ours. */
function ratingsNote(a: SoftwareWithCategory, b: SoftwareWithCategory): string {
  const sources = [a, b]
    .map((s) =>
      s.review_count === 0
        ? `${s.name} has no reviews yet`
        : s.rating_source
          ? `${s.name} from ${s.rating_source.name}`
          : null,
    )
    .filter(Boolean);
  return sources.length === 0
    ? "Out of 5, from reviews left on Indaba."
    : `Out of 5. ${sources.join("; ")}.`;
}

/** A vendor's published tiers, for the plan ladder beside the matrix. */
export function buildPlans(software: SoftwareWithCategory): ComparePlan[] {
  return (software.pricing_plans ?? []).map((plan) => ({
    name: plan.name,
    price:
      plan.price === null || plan.price === undefined
        ? "On request"
        : plan.price === 0
          ? "Free"
          : formatPricePerPeriod(plan.price, plan.period, plan.currency),
    note:
      plan.vat_inclusive === true
        ? "incl. VAT"
        : plan.vat_inclusive === false
          ? "excl. VAT"
          : "VAT unconfirmed",
  }));
}

/**
 * The reasons to pick one side, in the order a buyer weighs them.
 *
 * Every line is a fact already printed elsewhere on the page — this block does
 * not know anything the matrix does not. Its job is to save the reader from
 * doing forty comparisons to reach a conclusion the data already supports.
 */
export function buildReasons(
  self: SoftwareWithCategory,
  other: SoftwareWithCategory,
): string[] {
  const reasons: string[] = [];
  // A score against a product with no reviews is not a lead.
  const bothRated = self.review_count > 0 && other.review_count > 0;

  if (bothRated && self.overall_rating > other.overall_rating) {
    reasons.push(
      `Rated higher overall — ${formatRating(self.overall_rating)} against ${formatRating(other.overall_rating)}.`,
    );
  }

  const dimensions = [
    ["ease of use", self.ease_of_use_rating, other.ease_of_use_rating],
    ["value for money", self.value_for_money_rating, other.value_for_money_rating],
    ["customer service", self.customer_service_rating, other.customer_service_rating],
    ["functionality", self.functionality_rating, other.functionality_rating],
  ] as const;
  const best = dimensions
    .filter(([, mine, theirs]) => bothRated && mine > theirs)
    .sort((x, y) => y[1] - y[2] - (x[1] - x[2]))[0];
  if (best) {
    reasons.push(
      `Leads on ${best[0]}, ${formatRating(best[1])} against ${formatRating(best[2])}.`,
    );
  }

  if (
    self.starting_price !== null &&
    other.starting_price !== null &&
    self.starting_price < other.starting_price
  ) {
    reasons.push(
      `Cheaper to start: ${formatPricePerPeriod(self.starting_price, self.billing_period ?? "month")} against ${formatPricePerPeriod(other.starting_price, other.billing_period ?? "month")}.`,
    );
  }

  if (self.free_version && !other.free_version) {
    reasons.push("Has a free plan; the other does not.");
  }
  if (self.free_trial && !other.free_trial) {
    reasons.push("Has a free trial; the other does not.");
  }

  /*
    The feature name keeps its own case. Lower-casing it to fit the sentence
    turned "VAT201 preparation" into "vat201 preparation" — the acronym is the
    part a South African bookkeeper is scanning for.
  */
  const onlyMine = self.features.filter((f) => !other.features.includes(f));
  if (onlyMine.length > 0) {
    reasons.push(
      `${formatNumber(onlyMine.length)} ${onlyMine.length === 1 ? "feature" : "features"} the other does not have, starting with ${onlyMine[0]}.`,
    );
  }

  if (bothRated && self.review_count > other.review_count * 1.5) {
    reasons.push(
      `More evidence behind the score: ${formatNumber(self.review_count)} reviews against ${formatNumber(other.review_count)}.`,
    );
  }

  return reasons.slice(0, 4);
}
