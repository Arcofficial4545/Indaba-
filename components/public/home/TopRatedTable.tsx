import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";

import { CompareToggle } from "@/components/public/CompareTray";
import { Figure } from "@/components/public/Figure";
import { VendorMark } from "@/components/public/home/VendorMark";
import { formatNumber, formatRating, startingPriceLabel } from "@/lib/format";
import type { SoftwareWithCategory } from "@/lib/types";

/** An editorial shortlist; catalogue scores are displayed without modification. */
export function TopRatedTable({ software }: {
  software: SoftwareWithCategory[];
}) {
  return (
    <div className="top-rated">
      <div className="ranked-list-heading">
        <p>Editorial order. Catalogue ratings shown separately.</p>
        <Link href="/editorial-policy">About our ratings <ArrowRight size={14} aria-hidden="true" /></Link>
      </div>
      <ul className="ranked-list" aria-label="Software recommendations selected by Indaba">
        {software.map((item) => (
          <li key={item.id} className="ranked-row">
            <div className="ranked-product">
              <VendorMark name={item.name} slug={item.slug} logoUrl={item.logo_url} />
              <div>
                <Link href={`/software/${item.slug}`} className="ranked-product-name">{item.name}</Link>
                <p className="home-detail-label">{item.category?.name ?? "Software"}</p>
              </div>
            </div>
            <div className="ranked-rating"><Rating software={item} /></div>
            <div className="ranked-price"><Price software={item} /></div>
            <label className="ranked-compare" aria-label={`Compare ${item.name}`}><CompareToggle slug={item.slug} name={item.name} /><span aria-hidden="true">Compare</span></label>
            <div className="ranked-action">
              <Link href={`/software/${item.slug}`} className="btn-glossy inline-flex h-9 items-center px-4 text-sm">
                Read review<span className="sr-only"> of {item.name}</span>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Rating({ software }: { software: SoftwareWithCategory }) {
  return <>
    <p className="home-rating"><Star size={15} aria-hidden="true" /><Figure>{formatRating(software.overall_rating)}</Figure><span>/ <Figure>5</Figure></span></p>
    <p className="home-detail-label"><Figure>{formatNumber(software.review_count)}</Figure> reviews</p>
  </>;
}

function Price({ software }: { software: SoftwareWithCategory }) {
  const price = startingPriceLabel(software);
  return <>
    <p className="ranked-price-amount">{price.isCustom || software.starting_price === 0 ? price.amount : <>From <Figure>{price.amount}</Figure></>}</p>
    {!price.isCustom && <p className="home-detail-label">{price.note.replace(/^Starting price, /, "")}</p>}
  </>;
}
