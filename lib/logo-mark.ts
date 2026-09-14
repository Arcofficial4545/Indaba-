import { LOGO_FILES } from "@/lib/logo-manifest";
import { getBrandKey } from "@/lib/logos";

/**
 * Does this product have a real vendor mark bundled for it?
 *
 * The trap this exists to close: `software.logo_url` is the admin's upload
 * override, and it is null for every row in the catalogue. The marks that
 * actually render come from `lib/logo-manifest.ts`, keyed by brand, resolved
 * from the slug. `SoftwareLogo` already does that lookup internally and falls
 * back to an initials chip, so a component that only wants products with a
 * real mark cannot tell by looking at the row.
 *
 * Filtering on `logo_url` therefore silently returns nothing, which is how the
 * hero came to render with no chips and throw. This is the predicate to use
 * instead, and it mirrors exactly what `SoftwareLogo` will do with the same
 * slug.
 */
export function hasBundledMark(slug: string): boolean {
  const brandKey = getBrandKey(slug);
  return Boolean(brandKey && LOGO_FILES[brandKey]);
}
