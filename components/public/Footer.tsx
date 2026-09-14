import Link from "next/link";
import { ArrowRight, ArrowUp, ArrowUpRight, Coins, MapPin, ReceiptText } from "lucide-react";

import { LogoMark } from "@/components/public/BrandLogo";
import { CategoryIcon } from "@/components/public/CategoryIcon";
import { Figure } from "@/components/public/Figure";
import { FooterHorizon } from "@/components/public/FooterHorizon";
import { NewsletterForm } from "@/components/public/NewsletterForm";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { getCategories } from "@/lib/queries/categories";
import { getTrendingComparisons } from "@/lib/queries/comparisons";
import {
  COMPANY_NAV,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  DEFAULT_CURRENCY,
  LEGAL_NAV,
  MAIN_NAV,
  SITE_LOCATION,
  SITE_NAME,
  SITE_TAGLINE,
  SOCIAL_LINKS,
  VAT_RATE,
} from "@/lib/site";
import { canonicalComparisonSlug } from "@/lib/utils";

/**
 * The footer, and the end of every page.
 *
 * THE NEWSLETTER LIVES HERE NOW, and the reasoning has come full circle, so it
 * is worth writing down properly.
 *
 * Phase 5 pulled the form out of the footer because the home page then carried
 * two sign-ups within a screen of each other — one in a full-bleed ink band,
 * one in the footer — and because the colour rules ration a page to three ink
 * surfaces. That was correct about the duplication and wrong about where the
 * survivor should live. A standalone ink band immediately above an ink footer
 * put two dark slabs back to back with the horizon strip wedged between them,
 * which is exactly the seam this rebuild was meant to close.
 *
 * So there is still only one sign-up, and it is in the footer. The band is
 * gone from the home page and the blog post page, `NewsletterSection` with it.
 * The ink budget improves rather than degrades: the bottom of the page is now
 * one surface instead of two with a stripe of bone between them.
 *
 * WHAT ELSE IS HERE, and why each thing earns its row:
 *
 *  - **A drawn horizon.** See FooterHorizon. The page ends at a place, not a
 *    rule, and the site's one real claim — that it is South African — is in
 *    the design rather than only in 14px of type.
 *  - **The masthead.** The wordmark at `display-xl` beside the newsletter, so
 *    the footer opens with a statement instead of a sitemap.
 *  - **Real comparisons.** Three live head-to-heads with both vendor marks.
 *    A directory footer that lists only its own pages describes itself; one
 *    that shows two products being weighed against each other demonstrates
 *    what the site is for, and every one of them is an internal link to a
 *    compare page, which is where the organic search traffic goes.
 *
 * Every market signal is read from lib/site.ts. If a country, a currency or a
 * tax rate ever appears hardcoded in this file, that is the bug.
 */
export async function Footer() {
  /*
    Both reads are already warm: the layout is statically rendered and
    revalidated hourly, and getTrendingComparisons resolves against the same
    getAllSoftware() the rest of the page has loaded.
  */
  const [categories, comparisons] = await Promise.all([
    getCategories(),
    getTrendingComparisons(3),
  ]);
  const year = new Date().getFullYear();

  // Every destination remains available, with one home for shared links.
  // The directory owns the primary action; policies remain in the legal group.
  const exploreLinks = MAIN_NAV.filter(
    (link) => link.href !== "/software" && link.href !== "/about",
  );
  const columns = [
    {
      title: "Company",
      links: COMPANY_NAV.filter(
        (link) => !LEGAL_NAV.some((legal) => legal.href === link.href),
      ),
    },
    { title: "Legal & trust", links: LEGAL_NAV },
  ];

  return (
    <footer className="site-footer">
      <FooterHorizon />

      <div className="footer-body">
        <div className="container-site">
          {/* ---- masthead: the name, and the one action ------------------ */}
          <div className="footer-masthead">
            <div className="footer-brand-block">
              {/*
                Composed here rather than through BrandLogo, because this is the
                one place the wordmark is set at display size and BrandLogo
                hard-codes a body-size utility onto it.
              */}
              <p className="footer-tagline">{SITE_TAGLINE}.</p>

              <ul className="footer-contact">
                <li>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="footer-link">
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li>
                  <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="footer-link">
                    <Figure as="span">{CONTACT_PHONE}</Figure>
                  </a>
                </li>
                <li className="footer-muted">{SITE_LOCATION}</li>
              </ul>

              {/*
                Marks rather than badges: a single path each, drawn in the same
                ink family as everything else. Vendor-coloured social buttons
                would be the only saturated thing on the page.
              */}
              <ul className="footer-social">
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      className="footer-social-link"
                      aria-label={`${SITE_NAME} on ${social.label}`}
                      rel="me noreferrer"
                      target="_blank"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                        <path d={social.path} fill="currentColor" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-signup">
              <h2 className="footer-signup-heading">
                Software pricing moves. We tell you when.
              </h2>
              <p className="footer-signup-note">
                Every quarter we re-check each listed price against the vendor&apos;s
                own South African page. One email a month and never more.
              </p>
              <NewsletterForm tone="dark" source="footer" className="mt-6" />
              <p className="footer-signup-fine">
                A welcome email arrives straight away, and every email has a
                one-click unsubscribe.
              </p>
            </div>
          </div>

          {/* ---- what the site actually does ----------------------------- */}
          {comparisons.length > 0 && (
            <section aria-labelledby="footer-compare" className="footer-compare">
              <h2 id="footer-compare" className="footer-compare-title">
                Compare two products
              </h2>
              <ul className="footer-compare-list">
                {comparisons.map(({ a, b }) => (
                  <li key={`${a.slug}-${b.slug}`}>
                    <Link
                      href={`/compare/${canonicalComparisonSlug(a.slug, b.slug)}`}
                      className="footer-compare-pill"
                    >
                      <SoftwareLogo
                        name={a.name}
                        slug={a.slug}
                        logoUrl={a.logo_url}
                        size={22}
                      />
                      <span>{a.name}</span>
                      {/* A word, not an arrow: §12 bans arrows in link text. */}
                      <span className="footer-compare-vs">vs</span>
                      <span>{b.name}</span>
                      <SoftwareLogo
                        name={b.name}
                        slug={b.slug}
                        logoUrl={b.logo_url}
                        size={22}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* A clear next step leads the directory; utility links stay secondary. */}
          <div className="footer-directory">
            <section aria-labelledby="footer-discover-heading" className="footer-discover">
              <p className="footer-discover-eyebrow">
                <span aria-hidden="true" /> A better next step
              </p>
              <h2 id="footer-discover-heading" className="footer-discover-heading">
                Find software.<br />Move forward.
              </h2>
              <p className="footer-discover-copy">
                Less guesswork. A clearer shortlist. Find the right tools for
                the way your business works.
              </p>
              <Link href="/software" className="footer-discover-cta">
                <span>Browse software</span>
                <span className="footer-discover-arrow" aria-hidden="true">
                  <ArrowUpRight size={22} strokeWidth={1.7} />
                </span>
              </Link>
              <nav aria-label="Explore Indaba" className="footer-explore">
                {exploreLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}<ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                ))}
              </nav>
            </section>

            <nav aria-label="Footer" className="footer-nav">
              <div className="footer-category-section">
                <h2 className="footer-column-title">Browse by category</h2>
                <ul className="footer-category-list">
                  {categories.map((category) => (
                    <li key={category.slug}>
                      <Link href={`/category/${category.slug}`} className="footer-category-link">
                        <CategoryIcon name={category.icon} className="footer-category-icon" />
                        <span>{category.name.replace(/ Software$/, "")}</span>
                        <ArrowUpRight className="footer-category-arrow" size={16} aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="footer-utility-nav">
                {columns.map((column) => (
                  <div key={column.title}>
                    <h2 className="footer-column-title">{column.title}</h2>
                    <ul className="footer-column-list">
                      {column.links.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} className="footer-link">
                            <span>{link.label}</span>
                            <ArrowRight size={13} aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </nav>
          </div>

          {/* ---- the base ------------------------------------------------ */}
          <div className="footer-base">
            <div className="footer-trust-row">
              <div className="footer-editorial-note">
                <p className="footer-trust-eyebrow">The Indaba standard</p>
                <h2 className="footer-principle">Independent by design.</h2>
                <p className="footer-disclosure">
                  Some vendor links earn us a commission. That never changes a
                  rating, review or ranking. Your decision comes first.
                </p>
                <Link href="/editorial-policy" className="footer-policy-link">
                  How we stay independent
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </div>
              <dl className="footer-signals">
                <div className="footer-market">
                  <dt><MapPin size={16} aria-hidden="true" /> Our market</dt>
                  <dd>{SITE_LOCATION}</dd>
                </div>
                <div>
                  <dt><Coins size={16} aria-hidden="true" /> Prices in</dt>
                  <dd><Figure as="span">{DEFAULT_CURRENCY}</Figure></dd>
                </div>
                <div>
                  <dt><ReceiptText size={16} aria-hidden="true" /> Standard VAT</dt>
                  <dd><Figure as="span">{Math.round(VAT_RATE * 100)}%</Figure></dd>
                </div>
              </dl>
            </div>

            <div className="footer-signature">
              <div className="footer-signature-brand">
                <Link href="/" className="footer-endmark" aria-label={`${SITE_NAME} home`}>
                  <LogoMark className="size-11 md:size-[clamp(3rem,4.25vw,4.5rem)]" />
                  <span className="footer-endmark-name font-heading">{SITE_NAME}</span>
                </Link>
                <p className="footer-endmark-caption">{SITE_TAGLINE}.</p>
              </div>
              <p className="footer-closing-line">
                Good software.<br />
                <span>Better decisions.</span>
              </p>
            </div>

            <div className="footer-colophon">
              <p className="footer-copyright">
                © {year} {SITE_NAME}. Independent and reader funded.
              </p>
              <a href="#main" className="footer-back-top">
                Back to top
                <span className="footer-back-top-icon"><ArrowUp size={18} aria-hidden="true" /></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * Single-path glyphs, so a social row costs three inline paths rather than an
 * icon dependency. Drawn at 24 and rendered at 18.
 */
const SOCIALS = [
  {
    label: "LinkedIn",
    href: SOCIAL_LINKS.linkedin,
    path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0h3.8v1.65h.05a4.17 4.17 0 0 1 3.75-2.06c4 0 4.75 2.64 4.75 6.07V21h-4v-5.5c0-1.31-.03-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V21h-4V9Z",
  },
  {
    label: "X",
    href: SOCIAL_LINKS.x,
    path: "M17.53 3h3.2l-7 8 8.23 10h-6.44l-5.05-6.6L3.6 21H.4l7.49-8.56L0 3h6.6l4.57 6.04L17.53 3Zm-1.12 16.1h1.77L6.67 4.8H4.77l11.64 14.3Z",
  },
  {
    label: "Facebook",
    href: SOCIAL_LINKS.facebook,
    path: "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.9h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z",
  },
] as const;
