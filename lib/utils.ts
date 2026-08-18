import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names, with later Tailwind utilities winning. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Turn a product or article name into a URL safe slug. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Clamp a number into a range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Comparison slugs read `a-vs-b`. Both directions must resolve so a long tail
 * query is never lost, and the alphabetically first slug is the canonical one.
 */
export function comparisonSlug(slugA: string, slugB: string): string {
  return `${slugA}-vs-${slugB}`;
}

export function canonicalComparisonSlug(slugA: string, slugB: string): string {
  const [first, second] = [slugA, slugB].sort((a, b) => a.localeCompare(b));
  return comparisonSlug(first, second);
}

/** Split `a-vs-b` back into its two product slugs. */
export function parseComparisonSlug(pair: string): [string, string] | null {
  const parts = pair.split("-vs-");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  return [parts[0], parts[1]];
}

/** Trim prose to a length without cutting a word in half. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength).trimEnd()}...`;
}

/** Strip HTML so a description can be reused as a meta description. */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
