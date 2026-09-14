import { CATALOGUE } from "@/lib/content/catalogue";
import { HERO_EVIDENCE, type HeroEvidence } from "@/lib/content/hero-evidence";
import { addVat, formatNumber, formatPrice, formatPricePerPeriod, formatRating } from "@/lib/format";
import type { HeroDifference, HeroMatchup, HeroSide } from "@/lib/hero-matchup";
import { hasBundledMark } from "@/lib/logo-mark";
import type { SoftwareWithCategory } from "@/lib/types";
import { canonicalComparisonSlug } from "@/lib/utils";

/**
 * Reuses the catalogue the homepage already loaded: no duplicate DB request.
 * Pairs come from existing curated alternatives; numbers come only from
 * sourced observations in `lib/content/hero-evidence.ts`, never the
 * catalogue's generated review targets. Missing evidence removes a pair rather
 * than inventing a value — the hero is the one place on the site where nothing
 * may be made up.
 *
 * The source URLs and the retrieval date stay in the evidence file rather than
 * travelling to the client. The hero no longer prints an attribution line, so
 * shipping the URLs into the bundle would be dead weight; `/compare` carries
 * the visible attribution and reads the same file.
 */
export function getHeroMatchups(software: SoftwareWithCategory[]): HeroMatchup[] {
  const bySlug = new Map(software.map((product) => [product.slug, product]));
  const pairs = new Map<string, HeroMatchup>();
  for (const entry of CATALOGUE) {
    if (!HERO_EVIDENCE[entry.slug]) continue;
    for (const alternative of entry.alternatives) {
      if (!HERO_EVIDENCE[alternative]) continue;
      const slug = canonicalComparisonSlug(entry.slug, alternative);
      if (pairs.has(slug)) continue;
      const [left, right] = slug.split("-vs-");
      const a = bySlug.get(left);
      const b = bySlug.get(right);
      if (!a || !b || a.status !== "published" || b.status !== "published") continue;
      if ((!a.logo_url && !hasBundledMark(a.slug)) ||
          (!b.logo_url && !hasBundledMark(b.slug))) continue;
      const aEvidence = HERO_EVIDENCE[left];
      const bEvidence = HERO_EVIDENCE[right];
      const [aDifference, bDifference] = differences(aEvidence, bEvidence);
      pairs.set(slug, {
        slug,
        href: `/compare/${slug}`,
        a: toSide(a, aEvidence, aDifference),
        b: toSide(b, bEvidence, bDifference),
      });
      if (pairs.size === 4) return [...pairs.values()];
    }
  }
  return [...pairs.values()];
}

function amount(evidence: HeroEvidence): number {
  return evidence.vatInclusive === false ? addVat(evidence.price) : evidence.price;
}

function toSide(
  product: SoftwareWithCategory,
  evidence: HeroEvidence,
  difference: HeroDifference,
): HeroSide {
  const rands = amount(evidence);
  return {
    slug: product.slug,
    name: product.name,
    logoUrl: product.logo_url,
    rating: evidence.rating,
    ratingLabel: formatRating(evidence.rating),
    reviewCount: formatNumber(evidence.reviews),
    /*
      A zero is a free plan, not a price. "R0/mo" is technically the same
      claim and reads as a rounding accident, which on the one number a buyer
      is scanning for is worse than saying nothing.
    */
    price: rands === 0 ? "Free" : formatPricePerPeriod(rands),
    priceNote: rands === 0
      ? evidence.plan
      : evidence.vatInclusive === null
        ? "VAT unconfirmed"
        : "incl. VAT",
    difference,
  };
}

/**
 * The single sharpest difference between the two, stated once per side on the
 * same axis so the panels stay symmetrical.
 *
 * A free entry plan outranks a price gap: it is the difference a buyer acts on
 * first, and comparing R0 against R450 as a monthly delta would overstate it.
 */
function differences(a: HeroEvidence, b: HeroEvidence): [HeroDifference, HeroDifference] {
  if (a.freePlan !== b.freePlan) {
    const free: HeroDifference = { figure: "", label: "Free entry plan" };
    const paid: HeroDifference = { figure: "", label: "No free plan" };
    return a.freePlan ? [free, paid] : [paid, free];
  }

  const gap = Math.abs(amount(a) - amount(b));
  if (gap === 0) {
    const same: HeroDifference = { figure: "", label: "Same entry price" };
    return [same, { ...same }];
  }

  const figure = formatPrice(gap);
  const cheaper: HeroDifference = { figure, label: "a month cheaper" };
  const dearer: HeroDifference = { figure, label: "a month dearer" };
  return amount(a) < amount(b) ? [cheaper, dearer] : [dearer, cheaper];
}
