/**
 * Serialises structured data for a `<script type="application/ld+json">` tag.
 *
 * JSON.stringify leaves "<" as it is, so any value containing "</script>" (a
 * product name, an article title, a published review) would close the tag and
 * let the rest of the string run as HTML. Escaping "<" as < keeps the JSON
 * identical to a parser and inert to the HTML tokenizer.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
