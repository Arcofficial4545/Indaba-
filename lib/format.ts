import {
  CURRENCY_SYMBOLS,
  DEFAULT_CURRENCY,
  SITE_LOCALE,
  VAT_RATE,
} from "@/lib/site";

/**
 * South African digit grouping uses a space, not a comma, and the decimal
 * separator is a comma. Intl handles both correctly for en-ZA, so everything
 * here goes through it rather than through hand rolled string work.
 *
 *   240      ->  R240
 *   1375     ->  R1 375
 *   23844    ->  R23 844
 *   1375.5   ->  R1 375,50
 *
 * Whole rand amounts never show decimals. Trailing ",00" on a price makes a
 * page look like a spreadsheet export.
 */

/*
  en-ZA groups thousands with U+00A0, a no-break space. The grouping is right
  and stays: it is the South African convention and a comma would be wrong.
  The character is the problem. A no-break space carries a full word space of
  advance, so at display sizes "6 196" stops reading as one figure and starts
  reading as a 6 followed by a 196.

  U+202F, the narrow no-break space, is the same thing typographically at about
  a third of the width. Still a space, still non-breaking, so the number can
  never wrap across the gap; just no longer wide enough to split the figure in
  two. Applied here rather than at the one call site, so a price and a count
  group the same way.
*/
const NARROW_NO_BREAK_SPACE = "\u202F";

function groupDigits(amount: number, fractionDigits: number): string {
  return new Intl.NumberFormat(SITE_LOCALE, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
    .format(amount)
    .replaceAll("\u00A0", NARROW_NO_BREAK_SPACE);
}

/** `R1 375`, or `US$49`. The symbol is prefixed with no space. */
export function formatPrice(
  amount: number | null | undefined,
  currency: string = DEFAULT_CURRENCY,
): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return "Custom pricing";
  }
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `;
  const isWhole = Number.isInteger(amount);
  return `${symbol}${groupDigits(amount, isWhole ? 0 : 2)}`;
}

const PERIOD_SUFFIX: Record<string, string> = {
  month: "/mo",
  monthly: "/mo",
  year: "/yr",
  yearly: "/yr",
  annual: "/yr",
  user: "/user",
  employee: "/employee",
  once: "",
  "one-time": "",
};

/** `R240/mo`. An unknown period falls back to no suffix rather than guessing. */
export function formatPricePerPeriod(
  amount: number | null | undefined,
  period: string = "month",
  currency: string = DEFAULT_CURRENCY,
): string {
  const price = formatPrice(amount, currency);
  if (amount === null || amount === undefined) return price;
  return `${price}${PERIOD_SUFFIX[period.toLowerCase()] ?? ""}`;
}

export type StartingPriceLabel = {
  /** The headline figure, or the words shown when there is no public price. */
  amount: string;
  /** A short qualifier that sits under the figure. */
  note: string;
  /** True when the vendor publishes no price and the buyer must ask. */
  isCustom: boolean;
};

/**
 * Splits a starting price into a headline plus a short note, and flags the
 * vendors who publish no price at all. Quoting a fabricated number for an
 * enterprise ERP is the fastest way to lose a reader's trust, so those return
 * `isCustom` and the UI says so plainly.
 */
export function startingPriceLabel(software: {
  starting_price?: number | null;
  price_currency?: string | null;
  billing_period?: string | null;
  free_version?: boolean | null;
  vat_inclusive?: boolean | null;
}): StartingPriceLabel {
  const {
    starting_price,
    price_currency,
    billing_period,
    free_version,
    vat_inclusive,
  } = software;

  if (starting_price === null || starting_price === undefined) {
    return {
      amount: "Pricing on request",
      note: "The vendor does not publish a list price",
      isCustom: true,
    };
  }

  if (starting_price === 0) {
    return {
      amount: "Free",
      note: free_version ? "Free plan available" : "No cost to start",
      isCustom: false,
    };
  }

  const currency = price_currency ?? DEFAULT_CURRENCY;
  const period = billing_period ?? "month";
  const vatNote =
    vat_inclusive === true
      ? "including VAT"
      : vat_inclusive === false
        ? "excluding VAT"
        : "VAT status unconfirmed";

  return {
    amount: formatPricePerPeriod(starting_price, period, currency),
    note: `Starting price, ${vatNote}`,
    isCustom: false,
  };
}

/** Add 15% VAT to an exclusive figure. */
export function addVat(amount: number): number {
  return Math.round(amount * (1 + VAT_RATE) * 100) / 100;
}

/** Strip 15% VAT out of an inclusive figure. */
export function removeVat(amount: number): number {
  return Math.round((amount / (1 + VAT_RATE)) * 100) / 100;
}

/** `6 178`. Space grouped, for counts and totals. */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "0";
  return groupDigits(value, 0);
}

/** `4 May 2026`. Long form, en-ZA order. */
export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(SITE_LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** `May 2026`. For review cards where the exact day adds nothing. */
export function formatMonthYear(value: string | Date | null | undefined): string {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(SITE_LOCALE, {
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Ratings always show one decimal, with a full stop rather than the en-ZA
 * comma. A rating is a numeric label rather than a measurement, readers
 * expect `4.3`, and schema.org wants a full stop in the JSON-LD anyway.
 */
export function formatRating(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "0.0";
  return value.toFixed(1);
}

/** `1 200 reviews`, with the singular handled. */
export function formatReviewCount(count: number): string {
  return `${formatNumber(count)} ${count === 1 ? "review" : "reviews"}`;
}

/** `4 min read` */
export function formatReadTime(minutes: number | null | undefined): string {
  return `${minutes && minutes > 0 ? minutes : 1} min read`;
}
