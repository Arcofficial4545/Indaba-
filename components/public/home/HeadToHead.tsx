import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";

import { Figure } from "@/components/public/Figure";
import { VendorMark } from "@/components/public/home/VendorMark";
import { formatNumber, formatRating, startingPriceLabel } from "@/lib/format";
import type { ComparisonPair } from "@/lib/queries/comparisons";
import { canonicalComparisonSlug } from "@/lib/utils";

/** Equal columns let readers compare the same facts on the same baseline. */
export function HeadToHead({ pairs }: { pairs: ComparisonPair[] }) {
  return (
    <ul className="h2h-list">
      {pairs.map(({ comparison, a, b }) => (
        <li key={comparison.id}>
          <Link href={`/compare/${canonicalComparisonSlug(a.slug, b.slug)}`} className="h2h"
            aria-label={`Compare ${a.name} and ${b.name}`}>
            <p className="h2h-category">{a.category?.name ?? "Software"}</p>
            <div className="h2h-split">
              <Side software={a} />
              <span aria-hidden="true" className="h2h-axis"><span>vs</span></span>
              <Side software={b} />
            </div>
            <div className="h2h-foot">
              <span className="h2h-link-label">See comparison <ArrowRight size={16} aria-hidden="true" /></span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Side({ software }: { software: ComparisonPair["a"] }) {
  const price = startingPriceLabel(software);
  return (
    <div className="h2h-side">
      <div className="h2h-product">
        <VendorMark name={software.name} slug={software.slug} logoUrl={software.logo_url} size={32} />
        <h3>{software.name}</h3>
      </div>
      <div className="h2h-facts">
        <div>
          <p className="home-rating"><Star size={15} aria-hidden="true" /><Figure>{formatRating(software.overall_rating)}</Figure><span>/ <Figure>5</Figure></span></p>
          <p className="home-detail-label"><Figure>{formatNumber(software.review_count)}</Figure> reviews</p>
        </div>
        <div>
          <p className="h2h-price">{price.isCustom || software.starting_price === 0 ? price.amount : <>From <Figure>{price.amount}</Figure></>}</p>
          {!price.isCustom && <p className="home-detail-label">{price.note.replace(/^Starting price, /, "")}</p>}
        </div>
      </div>
    </div>
  );
}
