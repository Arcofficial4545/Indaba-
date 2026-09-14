import { ArrowRight, BookOpen, Clock3 } from "lucide-react";
import Link from "next/link";

import { Figure } from "@/components/public/Figure";
import type { Article } from "@/lib/types";

/** A short, server-rendered reading list. Full articles remain on the blog. */
export function Guides({ articles }: { articles: Article[] }) {
  const selected = articles.slice(0, 3);
  if (selected.length === 0) return null;

  return (
    <section aria-labelledby="guides-heading" className="container-site buying-guides">
      <div className="buying-guides-heading">
        <div>
          <h2 id="guides-heading" className="section-heading">Software buying guides</h2>
          <p>Know what to check before you choose.</p>
        </div>
        <Link href="/blog" className="buying-guides-all">View all guides <ArrowRight size={17} aria-hidden="true" /></Link>
      </div>
      <ul className="buying-guides-grid">
        {selected.map((article, index) => (
          <li key={article.id}>
            <Link href={`/blog/${article.slug}`} className={`buying-guide${index === 0 ? " buying-guide-lead" : ""}`}>
              <div className="buying-guide-meta">
                <span>{article.category_tag || "Buying guide"}</span>
                <span><Clock3 size={14} aria-hidden="true" /><Figure>{article.read_time_minutes}</Figure> min read</span>
              </div>
              <div className="buying-guide-body">
                <BookOpen size={30} strokeWidth={1.4} aria-hidden="true" />
                <h3>{article.title}</h3>
                {index === 0 && article.excerpt && <p>{article.excerpt}</p>}
              </div>
              <div className="buying-guide-footer">
                <span>Read guide</span>
                <span className="buying-guide-arrow"><ArrowRight size={20} aria-hidden="true" /></span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
