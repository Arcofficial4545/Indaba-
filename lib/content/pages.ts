import { CONTACT_EMAIL, CONTACT_PHONE, SITE_LOCATION, SITE_NAME } from "@/lib/site";

/**
 * Legal and trust pages.
 *
 * These are stored in the `pages` table so an admin can edit them without a
 * deploy, and seeded from here so a fresh database is never missing its
 * privacy policy.
 *
 * A note on what this is and is not. The content below is written to be
 * accurate about how this site actually works, which is the part that matters
 * most and the part a generic template gets wrong. It is not a substitute for
 * review by an attorney before launch, particularly the PAIA manual, which has
 * a prescribed form.
 */

export type PageSeed = {
  slug: string;
  title: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
};

const UPDATED = "18 August 2026";

export const PAGE_SEEDS: PageSeed[] = [
  {
    slug: "privacy-policy",
    title: "Privacy policy",
    metaTitle: "Privacy policy",
    metaDescription: `How ${SITE_NAME} collects, uses and protects personal information, in line with POPIA.`,
    content: `
<p>Last updated ${UPDATED}.</p>

<p>This policy explains what personal information ${SITE_NAME} collects, why we collect it and what we do with it. It is written to comply with the Protection of Personal Information Act 4 of 2013, which South Africans generally call POPIA.</p>

<h2>Who we are</h2>
<p>${SITE_NAME} is an independent business software review and comparison publisher based in ${SITE_LOCATION}. You can reach us at ${CONTACT_EMAIL} or on ${CONTACT_PHONE}.</p>

<h2>What we collect</h2>
<ul>
<li><strong>Nothing, if you simply read.</strong> Browsing the site does not require an account and we do not ask you to create one.</li>
<li><strong>Your email address</strong>, if you subscribe to our newsletter. We also record the date and time you consented and the source of that consent, because POPIA requires us to be able to demonstrate it.</li>
<li><strong>What you tell us</strong>, if you submit a review or use the contact form. That includes your name, and optionally your job title, company, industry and city.</li>
<li><strong>Technical information</strong> when you click a link to a vendor, described below.</li>
</ul>

<h2>What we do not collect</h2>
<p>We do not store raw IP addresses. Where we need to distinguish one visitor from another, for example to prevent the same person voting on a review repeatedly, we store a one way hash combined with a secret value held on our server. That hash cannot be reversed to recover the address, which is the point of doing it that way rather than simply hashing the address on its own.</p>

<h2>Affiliate links</h2>
<p>When you click through to a vendor, we record which product you clicked, the time, a hashed identifier as described above, your browser's user agent string, the page you came from and a country code. We use this to understand which reviews are useful and to reconcile commission. We do not sell this data.</p>

<h2>Why we may process your information</h2>
<ul>
<li><strong>Consent</strong>, for the newsletter. You give it, and you can withdraw it at any time with one click.</li>
<li><strong>Legitimate interest</strong>, for click measurement and for keeping the site working and secure.</li>
<li><strong>Performance of a contract or a request</strong>, when you ask us something through the contact form.</li>
</ul>

<h2>Who we share it with</h2>
<p>We use third party service providers to host the site, store data and send email. Those providers process information on our instructions only. We do not sell personal information to anyone, and we do not share your details with the software vendors we review.</p>

<h2>Where your information is stored</h2>
<p>Our database and file storage sit in a data centre outside South Africa, because no major provider offers a South African region at present. POPIA permits cross border transfer where the receiving country's laws provide comparable protection, and our providers are subject to such laws and are contractually bound to protect the information.</p>

<h2>How long we keep it</h2>
<ul>
<li>Newsletter subscriptions: until you unsubscribe, then we keep a record of the unsubscribe so we do not contact you again by mistake.</li>
<li>Reviews: for as long as the review is published, because it is editorial content other readers rely on.</li>
<li>Contact messages: two years.</li>
<li>Click records: twenty four months.</li>
</ul>

<h2>Your rights</h2>
<p>Under POPIA you may ask us what personal information we hold about you, ask us to correct it, ask us to delete it, object to how we are processing it, and complain to the Information Regulator. Write to ${CONTACT_EMAIL} and we will respond within a reasonable period.</p>

<p>The Information Regulator can be reached at enquiries@inforegulator.org.za.</p>

<h2>Changes</h2>
<p>If we change this policy we will update the date at the top. Material changes will be announced on the site.</p>
`,
  },

  {
    slug: "cookie-policy",
    title: "Cookie policy",
    metaTitle: "Cookie policy",
    metaDescription: `What cookies ${SITE_NAME} uses and how to control them.`,
    content: `
<p>Last updated ${UPDATED}.</p>

<p>Cookies are small files a website stores in your browser. This page explains which ones we use and why.</p>

<h2>What we use</h2>
<ul>
<li><strong>Theme preference.</strong> When you switch between the light and dark themes we remember your choice so the site does not flash the wrong one on your next visit. This stays on your device.</li>
<li><strong>Analytics.</strong> We use privacy focused analytics to count page views and understand which reviews readers find useful. It does not build a profile of you across other websites.</li>
<li><strong>Advertising.</strong> Where we display advertising, the ad network may set its own cookies. Those are governed by that network's policy rather than ours.</li>
</ul>

<h2>What we do not use</h2>
<p>We do not use cookies to track you across other websites for our own purposes, and we do not sell any data derived from them.</p>

<h2>Controlling cookies</h2>
<p>Every major browser lets you see, block and delete cookies through its settings. Blocking them will not stop you reading the site, though your theme preference will not be remembered.</p>

<p>Questions about this policy can go to ${CONTACT_EMAIL}.</p>
`,
  },

  {
    slug: "terms",
    title: "Terms of use",
    metaTitle: "Terms of use",
    metaDescription: `The terms on which you may use ${SITE_NAME}.`,
    content: `
<p>Last updated ${UPDATED}.</p>

<p>By using this site you agree to these terms. If you do not agree with them, please do not use the site.</p>

<h2>What this site is</h2>
<p>${SITE_NAME} publishes independent reviews, ratings and comparisons of business software. It is editorial content and general information. It is not financial, accounting, tax or legal advice, and it is not a recommendation to buy any particular product.</p>

<h2>Accuracy</h2>
<p>We work hard to be accurate. We research prices from vendors' own published sources, record where each figure came from and re check them periodically. Even so, software vendors change prices, features and terms without telling us. Always confirm the current position with the vendor before you commit money.</p>

<h2>User submitted reviews</h2>
<p>If you submit a review you confirm that you have genuinely used the product, that the review is your own honest opinion, and that you are not connected to the vendor or to a competitor in a way you have not disclosed. We check reviews before publishing and we may decline or remove any review. We publish critical reviews as readily as positive ones, and we do not edit reviews to suit a vendor.</p>

<h2>Intellectual property</h2>
<p>The editorial content, design and code of this site belong to us. Vendor names, logos and trade marks belong to their respective owners and are used here to identify the products being reviewed. That use does not imply any endorsement or affiliation.</p>

<h2>Links to other sites</h2>
<p>We link to vendor websites, and some of those links earn us a commission. We are not responsible for the content, products or practices of any site we link to.</p>

<h2>Limitation of liability</h2>
<p>We provide this site as it is. To the extent the law allows, we are not liable for any loss arising from your use of the site or from a decision you make based on it. Nothing in these terms limits liability that cannot lawfully be limited, including under the Consumer Protection Act 68 of 2008.</p>

<h2>Governing law</h2>
<p>These terms are governed by the law of the Republic of South Africa.</p>

<p>Questions can go to ${CONTACT_EMAIL}.</p>
`,
  },

  {
    slug: "affiliate-disclosure",
    title: "Affiliate disclosure",
    metaTitle: "Affiliate disclosure",
    metaDescription: `How ${SITE_NAME} makes money, and why it does not affect our ratings.`,
    content: `
<p>Last updated ${UPDATED}.</p>

<p>This page explains exactly how we make money, because you deserve to know that before you trust a rating.</p>

<h2>How we earn</h2>
<p>Some links on this site are affiliate links. If you click one and go on to buy, the vendor may pay us a commission. It costs you nothing extra. We also sell display advertising, which is always labelled as sponsored.</p>

<h2>What that does not affect</h2>
<ul>
<li><strong>Ratings.</strong> Aggregate ratings are calculated by our database from verified user reviews. No person, at this company or at any vendor, can adjust them.</li>
<li><strong>Rankings.</strong> Products are ordered by a weighted average of user ratings, not by what they pay.</li>
<li><strong>What we write.</strong> Our reviews name weaknesses plainly, including for products that earn us the most.</li>
<li><strong>Which products we list.</strong> We include products that have no affiliate programme at all, because leaving them out would make the directory less useful.</li>
</ul>

<h2>How to tell</h2>
<p>Every commercial link carries a visible disclosure next to it, and is marked with the sponsored attribute so search engines can see it too. Advertising units carry a visible sponsored label.</p>

<h2>Why we do it this way</h2>
<p>A review site that lets commercial relationships influence its verdicts is worthless, and readers work that out quickly. Our only durable asset is that you can trust what you read here. Protecting that is worth more than any single commission.</p>

<p>If you ever think a review reads like it was bought, tell us at ${CONTACT_EMAIL}. We will look into it.</p>
`,
  },

  {
    slug: "editorial-policy",
    title: "Editorial policy",
    metaTitle: "Editorial policy",
    metaDescription: `How ${SITE_NAME} researches, writes and rates business software.`,
    content: `
<p>Last updated ${UPDATED}.</p>

<h2>How we choose what to review</h2>
<p>We list the products South African businesses actually shortlist. That means local vendors sit alongside global ones, and it means we include products with no affiliate programme. A directory that only lists what pays is a catalogue, not a guide.</p>

<h2>How ratings work</h2>
<p>Every rating on this site comes from verified user reviews across five dimensions: overall, ease of use, value for money, customer service and functionality. Averages are calculated by our database and are never written by a person.</p>

<p>Where we rank products, we use a weighted average rather than a raw star average. A product with four hundred reviews at 4.1 is a more reliable signal than one with thirty reviews at 4.3, and our ordering reflects that.</p>

<h2>How we handle reviews</h2>
<p>Reviews are checked before publication. We look for reviews that are obviously from the vendor, from a competitor, or written by somebody who has clearly never used the product. We publish critical reviews as readily as positive ones. We never edit a review to suit a vendor, and vendors cannot pay to have a review removed. Vendors may reply publicly, and their replies are labelled.</p>

<h2>How we handle pricing</h2>
<p>Every price is researched from the vendor's own South African pricing page or official shop, recorded with its source and the date it was checked, and stated in rand with the VAT basis given. Where a vendor quotes in another currency we say so and state the conversion rate and date we used. Where a vendor publishes no price we say that plainly rather than guessing.</p>

<p>We re check prices quarterly. If we have not been able to verify a figure, the page says so.</p>

<h2>Corrections</h2>
<p>If we get something wrong, tell us at ${CONTACT_EMAIL} and we will correct it. Material corrections are noted on the page.</p>

<h2>Independence</h2>
<p>Vendors have no influence over our editorial content, our ratings or our rankings. See our affiliate disclosure for how we make money.</p>
`,
  },

  {
    slug: "accessibility",
    title: "Accessibility statement",
    metaTitle: "Accessibility statement",
    metaDescription: `${SITE_NAME}'s commitment to an accessible website, and how to report a problem.`,
    content: `
<p>Last updated ${UPDATED}.</p>

<p>We want this site to be usable by everyone, including people who use screen readers, keyboard navigation or magnification.</p>

<h2>What we have done</h2>
<ul>
<li>Every page can be operated by keyboard alone, and every interactive element shows a visible focus ring.</li>
<li>A skip to content link is the first thing a keyboard user reaches.</li>
<li>Colour is never the only way information is conveyed. Ratings always show a number beside the stars, and comparison tables label wins in text as well as colour.</li>
<li>We respect the reduce motion setting. If your system asks for less animation, the site honours it.</li>
<li>Images carry alternative text, and decorative graphics are hidden from assistive technology rather than described pointlessly.</li>
<li>Form fields have real labels, and errors are announced rather than only shown in red.</li>
<li>The site works in both light and dark themes, and we check text contrast in both.</li>
</ul>

<h2>Where we fall short</h2>
<p>We are honest about this. Some third party advertising units are outside our control and may not meet the same standard. Complex data visualisations carry text equivalents, but a chart is still harder to read than a table for some users.</p>

<h2>Standard we aim at</h2>
<p>We aim to meet WCAG 2.2 at level AA.</p>

<h2>Telling us about a problem</h2>
<p>If something on this site is hard to use, please tell us at ${CONTACT_EMAIL}. Describe the page and what happened, and we will fix it and reply to you.</p>
`,
  },

  {
    slug: "paia-manual",
    title: "PAIA manual",
    metaTitle: "PAIA manual",
    metaDescription: `${SITE_NAME}'s manual in terms of the Promotion of Access to Information Act.`,
    content: `
<p>Last updated ${UPDATED}.</p>

<p>This manual is published in terms of section 51 of the Promotion of Access to Information Act 2 of 2000, as amended.</p>

<h2>1. Particulars</h2>
<ul>
<li><strong>Name:</strong> ${SITE_NAME}</li>
<li><strong>Physical and postal address:</strong> ${SITE_LOCATION}</li>
<li><strong>Telephone:</strong> ${CONTACT_PHONE}</li>
<li><strong>Email:</strong> ${CONTACT_EMAIL}</li>
<li><strong>Information Officer:</strong> The Information Officer, contactable at ${CONTACT_EMAIL}</li>
</ul>

<h2>2. The guide by the Information Regulator</h2>
<p>The Regulator has published a guide in terms of section 10 explaining how to use the Act. It is available from the Information Regulator, enquiries@inforegulator.org.za, and on the Regulator's website.</p>

<h2>3. Records available without a request</h2>
<p>The following are freely available on this website and require no PAIA request: all published reviews, ratings, comparisons and buying guides, our privacy policy, cookie policy, terms of use, editorial policy, affiliate disclosure and accessibility statement.</p>

<h2>4. Records held</h2>
<ul>
<li>Editorial records: reviews, ratings, articles, comparisons and the sources supporting them.</li>
<li>Subscriber records: email addresses and consent records for the newsletter.</li>
<li>Correspondence: messages sent through the contact form.</li>
<li>Operational records: click measurement data, in the hashed form described in our privacy policy.</li>
<li>Statutory records: company, tax and financial records as required by law.</li>
</ul>

<h2>5. How to request a record</h2>
<p>Requests must be made on the prescribed form and sent to the Information Officer at ${CONTACT_EMAIL}. The request must give enough detail to identify the record and the requester, state the form of access required, and give an address for our reply. Where the request is for the exercise or protection of a right, that right must be identified and the request must explain how the record would assist.</p>

<p>We will respond within thirty days. That period may be extended in the circumstances the Act allows, and we will tell you if it is.</p>

<h2>6. Fees</h2>
<p>Fees are those prescribed under the Act. A request fee may be payable before we process a request, and an access fee may be payable for reproduction and search time. We will tell you what is payable before doing the work.</p>

<h2>7. Grounds for refusal</h2>
<p>We may refuse access on any ground set out in Chapter 4 of Part 2 of the Act. Those include the mandatory protection of the privacy of a third party, the protection of commercial information of a third party, records privileged from production in legal proceedings, and the protection of our own research and commercial information.</p>

<h2>8. Remedies</h2>
<p>If a request is refused, you may lodge a complaint with the Information Regulator or apply to a court as provided for in the Act.</p>

<h2>9. Processing of personal information</h2>
<p>The categories of data subject and personal information we process, the purposes, recipients and security measures, are set out in our privacy policy, which forms part of this manual.</p>

<h2>10. Availability of this manual</h2>
<p>This manual is available on this website and, on request, by email from the Information Officer.</p>
`,
  },
];
