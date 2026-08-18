import type { Article } from "@/lib/types";

/**
 * Buying guides.
 *
 * Written to the editorial standard in the brief: plain confident sentences,
 * varied length, real numbers, honest about weaknesses, British and South
 * African spelling, and no em dashes used as punctuation anywhere.
 *
 * The same objects feed the fallback data and the seed script, so what you
 * read locally is what lands in the database.
 */

export type ArticleSeed = Omit<Article, "id"> & { id: string };

const NOMSA = {
  author_name: "Nomsa Dlamini",
  author_title: "Senior editor",
  author_bio:
    "Nomsa has written about business software and small business finance for eleven years, most of it spent talking to the people who actually have to run the systems.",
  author_avatar_url: null,
};

const RIAAN = {
  author_name: "Riaan Botha",
  author_title: "Contributing writer",
  author_bio:
    "Riaan is a chartered accountant in practice in Johannesburg. He has migrated more ledgers than he cares to count.",
  author_avatar_url: null,
};

const PRIYA = {
  author_name: "Priya Naidoo",
  author_title: "Contributing writer",
  author_bio:
    "Priya spent nine years in payroll and HR operations before writing about the systems full time.",
  author_avatar_url: null,
};

export const ARTICLE_SEEDS: ArticleSeed[] = [
  {
    id: "art-accounting-guide",
    title: "The best accounting software for South African small businesses",
    slug: "best-accounting-software-south-africa",
    excerpt:
      "We compared nine packages on VAT201 handling, SARS eFiling, bank feed coverage and what they actually cost in rand.",
    featured_image_url: null,
    category_tag: "Accounting",
    related_software_id: null,
    ...NOMSA,
    meta_title: "Best accounting software in South Africa",
    meta_description:
      "Nine accounting packages compared on VAT201, SARS eFiling, bank feeds and rand pricing, for South African small businesses.",
    read_time_minutes: 11,
    status: "published",
    featured: true,
    published_date: "2026-07-28T00:00:00.000Z",
    content: `
<p>Choosing accounting software feels like a software decision and is really a compliance decision. Almost every package on the market can raise an invoice and produce a trial balance. Far fewer will hand you a VAT201 that reconciles to your ledger without somebody rebuilding the figures in a spreadsheet first, and that difference is worth more than any feature list.</p>

<p>We looked at nine packages that South African businesses genuinely shortlist. Here is what separated them.</p>

<h2>Start with VAT, not with dashboards</h2>

<p>VAT is where accounting software either earns its money or quietly costs you a weekend every second month. The standard rate is 15%, and your return has to account separately for standard rated, zero rated and exempt supplies. That sounds simple until you have a business that does all three.</p>

<p>Ask any vendor for a demonstration that starts from real transactions and ends with a submitted VAT201. Not a slide. An actual return. If the answer involves exporting to Excel at any point, you have learned something important.</p>

<h2>Bank feeds are not a solved problem</h2>

<p>Every vendor lists Absa, FNB, Standard Bank, Nedbank and Capitec on a logo wall. Coverage in practice varies by product, and sometimes by account type within the same bank. A business account may feed cleanly while a credit card does not.</p>

<p>The only reliable test is your own accounts. Ask for a trial, connect the accounts you actually use, and watch a week of transactions come through. Reconciliation that suggests the right coding is genuinely transformative for month end. Reconciliation that guesses badly is worse than manual capture, because now you are checking the machine as well as the books.</p>

<h2>Your accountant is part of the decision</h2>

<p>This is the factor most comparison articles ignore, and it is often the one that decides the matter. If an external bookkeeper or accountant maintains your ledger, the package they already know will cost you less in billed hours than a technically better package they have to learn on your account.</p>

<p>It is worth asking your practitioner directly which systems they work in daily. Their answer is real information about your total cost, not just their preference.</p>

<h2>Where each one lands</h2>

<p>Sage Accounting stays on most local shortlists for a reason. Its VAT and eFiling work is the most thoroughly South African of the cloud packages, and support answers during South African hours. The interface is not the most modern, and it does not pretend to be.</p>

<p>Xero is the better piece of software on almost every dimension that is not compliance. The reconciliation is excellent, the marketplace of add ons is deep, and it is a pleasure to use. Local VAT handling needs a little more setup than Sage, which is a one time cost rather than an ongoing one.</p>

<p>QuickBooks Online is capable and well known, with strong management reporting. South African support is thinner than either Sage or Xero, and some local tax workflows benefit from a practitioner configuring them properly at the start.</p>

<p>Zoho Books is priced aggressively and makes obvious sense if you already run Zoho CRM. The trade off is that its local tax features lag the incumbents, so check your specific requirements rather than assuming parity.</p>

<p>Sage 50cloud Pastel deserves a mention that has nothing to do with its interface, which is dated. It runs on a desktop. When load shedding takes out your connectivity, a desktop ledger keeps working. For some businesses that is decisive, and dismissing desktop software as obsolete misreads the conditions many South African firms actually operate in.</p>

<h2>What to do next</h2>

<ul>
<li>Write down the three compliance tasks that cost you the most time this year. Test those specifically, on real data, during a trial.</li>
<li>Connect your own bank accounts during the trial rather than using the demo company.</li>
<li>Ask your accountant which systems they work in daily, and what they charge for work in each.</li>
<li>Get the price in rand, and establish in writing whether it includes VAT. Vendors quote both ways and the difference is 15%.</li>
</ul>

<p>The best accounting software for your business is usually the one that handles your worst compliance job without complaint, that your accountant already knows, and that you can afford at the size you expect to be in three years. Everything else is preference.</p>
`,
  },

  {
    id: "art-emp501",
    title: "What EMP501 season actually requires from your payroll system",
    slug: "emp501-payroll-requirements",
    excerpt:
      "Reconciliation season catches out businesses whose payroll cannot produce a clean e@syFile export. Here is what to check before it starts.",
    featured_image_url: null,
    category_tag: "Payroll",
    related_software_id: null,
    ...RIAAN,
    meta_title: "EMP501 reconciliation: what your payroll system must do",
    meta_description:
      "A practical guide to EMP501 reconciliation season, e@syFile exports, IRP5 certificates and the payroll failures that cause them.",
    read_time_minutes: 8,
    status: "published",
    featured: false,
    published_date: "2026-07-14T00:00:00.000Z",
    content: `
<p>Twice a year, payroll software gets an examination it cannot talk its way out of. The EMP501 reconciliation has to agree with the EMP201 declarations you submitted month by month, and with the IRP5 and IT3(a) certificates you are about to issue. Three sets of numbers, one answer. Software that has been quietly approximating all year has nowhere left to hide.</p>

<p>Most of the pain I see in practice is avoidable, and almost all of it is visible months before the deadline if anyone looks.</p>

<h2>The three way agreement</h2>

<p>Your EMP501 must reconcile the tax you declared each month on the EMP201, the tax you actually deducted, and the tax reflected on employee certificates. Differences arise for legitimate reasons. A mid year correction, a backdated increase, a terminated employee paid out after their final period. Good payroll software carries those forward correctly. Weaker software leaves you reconciling by hand.</p>

<p>The test is simple and worth running now rather than in reconciliation week. Produce a draft EMP501 mid period and see whether it balances. If it does not, you want to know in September rather than in October.</p>

<h2>e@syFile is the real deadline</h2>

<p>SARS accepts submissions through e@syFile, and e@syFile is particular about file layouts. It changes them. A payroll system that produced a clean file last year may need an update to produce one this year, and vendors do not always announce that loudly.</p>

<p>Ask your vendor, in writing, which e@syFile version their current release targets. Then produce a test file and import it before you need to. An import that fails at 16:00 on the deadline is a different problem from one that fails three weeks earlier.</p>

<h2>The things that go wrong</h2>

<ul>
<li><strong>Employees with incomplete details.</strong> A missing or invalid tax number will fail validation. Run an exception report early, because chasing twelve employees for documents takes longer than you think.</li>
<li><strong>Directors and variable earnings.</strong> Directors of private companies have their own rules, and payroll that treats them as ordinary employees will produce a certificate that does not reflect reality.</li>
<li><strong>ETI claimed incorrectly.</strong> The Employment Tax Incentive is easy to under claim and easy to over claim. Both cause problems. Software that calculates it automatically, and shows its working, is worth paying for.</li>
<li><strong>Terminations processed in the wrong period.</strong> A final payment recorded against the wrong month throws out both the EMP201 and the certificate.</li>
</ul>

<h2>What good looks like</h2>

<p>The payroll packages that get through reconciliation season quietly share a few traits. They produce the EMP501 from the same data that produced the EMP201s, rather than recalculating from scratch. They validate employee records continuously and flag problems as they arise. They handle UIF and the skills development levy without being asked, and they generate an ACB file your bank accepts for the salary run itself.</p>

<p>SimplePay is the one most accountants in practice recommend first, largely because this work simply happens without a fight. PaySpace is stronger if you run payroll across several African countries and can absorb a heavier implementation. Sage Pastel Payroll handles complex statutory cases well, though newer staff often find it unintuitive at first.</p>

<h2>A short checklist</h2>

<ul>
<li>Produce a draft EMP501 now, out of season, and confirm it balances.</li>
<li>Generate a test e@syFile export and import it.</li>
<li>Run an employee data exception report and fix what it finds.</li>
<li>Check your ETI calculation against a manual working for two or three employees.</li>
<li>Confirm your vendor's release supports the current file layout.</li>
</ul>

<p>None of this is difficult. All of it is much easier in a quiet month than in a deadline week, and payroll software is one of the few purchases where the correct question is not what it can do but whether it will hold up under examination.</p>
`,
  },

  {
    id: "art-xero-vs-sage",
    title: "Xero or Sage Accounting: which suits a South African business",
    slug: "xero-vs-sage-accounting-guide",
    excerpt:
      "Both are good. They suit different businesses, and the deciding factor is usually who does your books rather than the feature list.",
    featured_image_url: null,
    category_tag: "Comparison",
    related_software_id: null,
    ...NOMSA,
    meta_title: "Xero vs Sage Accounting for South African businesses",
    meta_description:
      "A practical comparison of Xero and Sage Accounting for South African businesses: VAT handling, bank feeds, support and rand pricing.",
    read_time_minutes: 9,
    status: "published",
    featured: false,
    published_date: "2026-06-30T00:00:00.000Z",
    content: `
<p>This is the comparison South African businesses make most often, and it is usually framed the wrong way. The question is not which package is better. Both are good. The question is which one fits how your business already works.</p>

<h2>Where Xero is stronger</h2>

<p>Xero is the better piece of software to use. The bank reconciliation learns your coding and gets progressively less annoying, the interface is clean without hiding things, and the add on marketplace is genuinely deep. If you want your accounting system to talk to your ecommerce platform, your payroll and your expense tool without custom work, Xero makes that easier.</p>

<p>It also handles multi currency properly, which matters if you invoice outside South Africa. Businesses that export or that buy in dollars usually find this decides the matter on its own.</p>

<h2>Where Sage is stronger</h2>

<p>Sage Accounting is the more thoroughly South African product. Its VAT201 preparation and SARS eFiling work is built for this market rather than localised into it, and support answers during South African working hours. That last point sounds minor until you have a submission deadline and a question that needs an answer today.</p>

<p>Sage also has the wider base of local bookkeepers and accountants who work in it daily. If you use an external practitioner, that is a real cost difference rather than a preference.</p>

<h2>The honest weaknesses</h2>

<p>Xero's local VAT handling needs a little more configuration than Sage's. It is a one time task and a competent practitioner will do it in an afternoon, but it is real. Support is also further away, both in time zone and in local tax knowledge.</p>

<p>Sage's interface is dated in places, and the pace of improvement is slower. The add on ecosystem is narrower. If your business depends on connecting several systems together, you will feel that limit.</p>

<h2>What it costs</h2>

<p>Both publish rand pricing, and both change it. Check the current figure on the vendor's own South African page before budgeting, and establish whether the quoted number includes VAT. Sage generally quotes including, Xero generally quotes excluding, and comparing the two headline numbers without adjusting for that will mislead you by 15%.</p>

<h2>How to decide</h2>

<p>Ask three questions in this order.</p>

<ul>
<li>Who maintains your ledger, and what do they work in? If an external accountant does your books and works in Sage, that usually settles it.</li>
<li>Do you invoice in currencies other than rand? If yes, Xero.</li>
<li>How many other systems does your accounting need to talk to? The more there are, the more Xero's marketplace matters.</li>
</ul>

<p>If those three point in different directions, take both trials and run the same real month through each. Not the demo company. Your own invoices, your own bank feed, your own VAT position. Two days of that will tell you more than any comparison article, including this one.</p>
`,
  },

  {
    id: "art-load-shedding",
    title: "Cloud or desktop: what load shedding actually changes",
    slug: "cloud-or-desktop-load-shedding",
    excerpt:
      "The industry treats desktop software as obsolete. For some South African businesses that assumption is simply wrong, and it is worth understanding why.",
    featured_image_url: null,
    category_tag: "Accounting",
    related_software_id: null,
    ...RIAAN,
    meta_title: "Cloud or desktop accounting software during load shedding",
    meta_description:
      "Why desktop accounting software still makes sense for some South African businesses, and how to decide which side of the line you are on.",
    read_time_minutes: 7,
    status: "published",
    featured: false,
    published_date: "2026-06-16T00:00:00.000Z",
    content: `
<p>Software vendors have spent a decade explaining that desktop applications are finished. In most markets that is broadly true. In South Africa the picture is more complicated, and businesses that adopt the global consensus without thinking about it sometimes regret it.</p>

<h2>The actual failure mode</h2>

<p>Load shedding does not usually stop a business working. Most offices have a UPS on the essentials and laptops hold charge. What it stops is connectivity. Fibre terminals and cellular towers go down or get congested, and a cloud application with no offline mode becomes a blank browser tab.</p>

<p>If your work during those hours is invoicing, capturing supplier bills or answering a customer about their account, a desktop ledger keeps going and a cloud one does not. That is the whole argument, and it applies to fewer businesses than desktop advocates claim and more than cloud vendors admit.</p>

<h2>Who genuinely needs offline</h2>

<ul>
<li>Retail and trade counters that invoice continuously through the day.</li>
<li>Businesses in areas with poor cellular fallback, which is much of the country outside the metros.</li>
<li>Operations where a two hour stop has a direct cost, such as dispatch or manufacturing.</li>
</ul>

<h2>Who does not</h2>

<ul>
<li>Professional services firms that capture time and invoice monthly.</li>
<li>Businesses whose finance team is two people who can work around an outage.</li>
<li>Anyone whose staff already work from several locations, where cloud access is worth more than offline capability.</li>
</ul>

<h2>The middle path</h2>

<p>The distinction is softer than it looks. A cloud package with a capable mobile app that caches data is workable if your outage is connectivity rather than power, because a phone on a different network often still has signal. Equally, a desktop package with cloud backup gives you resilience without giving up remote access entirely.</p>

<p>Sage 50cloud Pastel sits deliberately in this space, and its continued popularity is not nostalgia. It is a rational response to operating conditions that most software is not designed for.</p>

<h2>How to test it honestly</h2>

<p>Do not model this on paper. During your trial, turn the office wifi off for two hours during a working day and see what your team can and cannot do. Then decide. The answer is different for a Cape Town design agency and a Polokwane hardware supplier, and both answers are correct.</p>
`,
  },

  {
    id: "art-crm-adoption",
    title: "Why most CRM projects fail, and what to do differently",
    slug: "why-crm-projects-fail",
    excerpt:
      "The software is rarely the problem. Adoption is, and adoption is decided in the first fortnight.",
    featured_image_url: null,
    category_tag: "CRM",
    related_software_id: null,
    ...PRIYA,
    meta_title: "Why CRM projects fail and how to fix adoption",
    meta_description:
      "Most CRM implementations fail on adoption rather than capability. A practical guide to choosing and rolling out a CRM that sales teams actually use.",
    read_time_minutes: 8,
    status: "published",
    featured: false,
    published_date: "2026-05-29T00:00:00.000Z",
    content: `
<p>A CRM that nobody updates is a very expensive contact list. That is the ordinary outcome of a CRM project, and it is almost never because the software could not do the job.</p>

<h2>The pattern</h2>

<p>It goes the same way most times. Management buys a capable system. Consultants configure it thoroughly, with custom fields for everything anyone mentioned. Sales staff are trained for a morning. For three weeks the pipeline looks wonderful. By week six the real deals are back in inboxes and WhatsApp, and the CRM contains only what somebody remembers to enter before a pipeline meeting.</p>

<p>The cause is usually that the system costs a sales person time and gives them nothing back. Every minute of data entry is a minute not selling, and if the only beneficiary is a management report, the incentive points the wrong way.</p>

<h2>What to do differently</h2>

<ul>
<li><strong>Configure less at the start.</strong> Every required field is a tax on adoption. Start with the minimum that produces a usable pipeline and add fields only when somebody asks for them.</li>
<li><strong>Give the sales person something first.</strong> Quote generation, email templates, a meeting scheduler, automatic call logging. If the CRM saves them twenty minutes a day before it asks them for ten, adoption follows.</li>
<li><strong>Handle WhatsApp.</strong> A great deal of South African business happens there. A CRM that cannot record those conversations is missing most of the relationship, and asking staff to duplicate them by hand will not work.</li>
<li><strong>Make the pipeline meeting run off the CRM.</strong> If the meeting uses a spreadsheet, the CRM is optional and everyone knows it.</li>
</ul>

<h2>Choosing on the right criterion</h2>

<p>When you evaluate, put a sales person in front of it rather than a manager. Ask them to log a call and move a deal. If they cannot do both within a few minutes of first seeing the system, adoption will be a fight regardless of what the product can do.</p>

<p>Zoho CRM does most of what the expensive systems do for considerably less, at the cost of patience during configuration. HubSpot is the easiest to adopt and the most pleasant to use, with costs that climb steeply as contact volumes grow, so model that before committing. Salesforce is the most capable and the most demanding, and it rewards businesses with the discipline to run it properly.</p>

<h2>The measure that matters</h2>

<p>Six weeks after go live, count how many deals in the pipeline were updated in the last seven days by the person who owns them. That number tells you whether you have a CRM or an expensive contact list. Everything else is a vanity metric.</p>
`,
  },

  {
    id: "art-hidden-costs",
    title: "The costs vendors leave out of the quote",
    slug: "hidden-costs-business-software",
    excerpt:
      "The licence fee is the number everyone compares. It is rarely the number that decides what the software costs you.",
    featured_image_url: null,
    category_tag: "Buying",
    related_software_id: null,
    ...NOMSA,
    meta_title: "The hidden costs of business software",
    meta_description:
      "Implementation, migration, training and integration costs routinely exceed the licence fee. How to get the real number before you sign.",
    read_time_minutes: 7,
    status: "published",
    featured: false,
    published_date: "2026-05-12T00:00:00.000Z",
    content: `
<p>Ask what a system costs and you will be told a monthly figure per user. That number is accurate and frequently irrelevant. The total cost of putting business software into a company is made up of several things, and the licence is often not the largest.</p>

<h2>What gets left out</h2>

<ul>
<li><strong>Implementation.</strong> For anything larger than a small business accounting package, somebody is paid to configure it. On ERP this routinely exceeds the first year of licence fees.</li>
<li><strong>Data migration.</strong> Moving history across is almost never the afternoon it is described as. Opening balances, historical transactions, customer records and document attachments each carry their own problems.</li>
<li><strong>Training.</strong> Not the vendor's two hour session. The three weeks during which your team is slower because they are learning.</li>
<li><strong>Integration.</strong> Connecting the new system to the ones you keep. This is where "it has an API" turns into a quoted development project.</li>
<li><strong>The parallel run.</strong> Sensible businesses run old and new together for a period. That means doing the work twice.</li>
<li><strong>Annual increases.</strong> Ask what the increase has been for the last three years rather than what it is capped at.</li>
</ul>

<h2>How to get the real number</h2>

<p>Ask for total cost of ownership over three years, in rand, in writing, itemised. A vendor who can produce that quickly is used to being asked by serious buyers. A vendor who resists it is telling you something.</p>

<p>Then ask two follow up questions. What is the cost of adding ten more users. And what is the cost of leaving, including getting your data out in a usable form. The second question is the one vendors least expect and the answer is often revealing.</p>

<h2>Where the money actually goes</h2>

<p>For a small business on cloud accounting, the licence genuinely is most of the cost, and a rand comparison between products is meaningful. For payroll it is close, with the caveat that a system which fails at reconciliation costs you accountant hours that dwarf the licence.</p>

<p>For CRM the cost is adoption. A system nobody updates costs its full price and returns nothing.</p>

<p>For ERP the licence is a minority of the cost, sometimes a small one. Comparing ERP products on their monthly figures is close to meaningless, and any comparison that does so should be read with that in mind.</p>

<h2>The question worth asking yourself</h2>

<p>Before any of this, write down what the new system replaces and what that currently costs in time and licences. If you cannot name what gets switched off, the business case rests entirely on the new thing being nicer, and that is a much weaker argument than it feels like in a demonstration.</p>
`,
  },
];

/** Article rows without the heavy body, for index pages. */
export function articleSummaries(): Article[] {
  return ARTICLE_SEEDS.map((article) => ({ ...article }));
}
