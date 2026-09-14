import { ArrowUpRight, Star, ReceiptText, Wallet, Users, ContactRound, Building2, Kanban, LayoutGrid } from "lucide-react";
import Link from "next/link";

import { Figure } from "@/components/public/Figure";
import { VendorMark } from "@/components/public/home/VendorMark";
import { formatNumber, formatRating } from "@/lib/format";
import type { NavCategory } from "@/lib/queries/nav";

type CategoryLeader = { name: string; rating: number; reviews: number };

const CATEGORY_ICONS = {
  "accounting-software": ReceiptText,
  "payroll-software": Wallet,
  "hr-software": Users,
  "crm-software": ContactRound,
  "erp-software": Building2,
  "project-management": Kanban,
};

/** All category facts stay visible, including on touch and without JavaScript. */
export function CategoryIndex({ categories, leaders }: {
  categories: NavCategory[];
  leaders: Record<string, CategoryLeader | undefined>;
}) {
  return (
    <ul className="category-grid">
      {categories.map((category) => {
        const leader = leaders[category.slug];
        const Icon = CATEGORY_ICONS[category.slug as keyof typeof CATEGORY_ICONS] ?? LayoutGrid;
        return (
          <li key={category.id}>
            <Link href={`/category/${category.slug}`} className="category-card">
              <div className="category-card-heading">
                <span className="category-symbol"><Icon size={23} strokeWidth={1.5} aria-hidden="true" /></span>
                <div>
                  <h3 className="category-card-name">{category.name}</h3>
                  <p className="category-card-count">
                    <Figure>{formatNumber(category.count)}</Figure>{" "}
                    {category.count === 1 ? "product" : "products"}
                  </p>
                </div>
                <ArrowUpRight size={20} aria-hidden="true" />
              </div>
              <div className="category-card-logos">
                {category.leaders.slice(0, 3).map((product) => <VendorMark key={product.slug} {...product} />)}
              </div>
              {leader && (
                <div className="category-card-leader">
                  <div>
                    <p className="home-detail-label">Highest rated</p>
                    <p className="category-card-product">{leader.name}</p>
                  </div>
                  <div className="category-card-score">
                    <p className="home-rating"><Star size={14} aria-hidden="true" /><Figure>{formatRating(leader.rating)}</Figure><span>/ <Figure>5</Figure></span></p>
                    <p className="home-detail-label"><Figure>{formatNumber(leader.reviews)}</Figure> {leader.reviews === 1 ? "review" : "reviews"}</p>
                  </div>
                </div>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
