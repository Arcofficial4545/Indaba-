import { mkdir, writeFile } from "node:fs/promises";

// Small local vector illustrations keep the editorial cards sharp at every size.
// No remote image service, stock-photo dependency or additional package is needed.
const ink = "#262626";
const accent = "#d1bd91";
const paper = "#eeefe9";
const muted = "#738077";
const rect = (x, y, w, h, fill, radius = 18) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}"/>`;
const line = (x1, y1, x2, y2, colour = muted, width = 4) => `<path d="M${x1} ${y1}H${x2}V${y2}" fill="none" stroke="${colour}" stroke-width="${width}" stroke-linecap="round"/>`;
const check = (x, y) => `<path d="m${x} ${y} 12 12 25-29" fill="none" stroke="${ink}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
const circle = (x, y, r, fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
const label = (x, y, text, size = 16, fill = ink) => `<text x="${x}" y="${y}" fill="${fill}" font-family="Arial, sans-serif" font-size="${size}" font-weight="700">${text}</text>`;

const covers = [
  {
    slug: "demo-scorecard", category: "THE BUYER'S DESK", title: ["Less sales pitch.", "More proof."], subtitle: "A better software demo", number: "01",
    art: rect(720, 142, 334, 352, paper) + rect(751, 179, 122, 12, ink, 6) + [0, 1, 2].map((i) => rect(751, 230 + i * 77, 45, 45, accent, 12) + check(756, 252 + i * 77) + rect(819, 240 + i * 77, 180 - i * 25, 9, muted, 4) + rect(819, 261 + i * 77, 130, 7, "#d3d7ca", 3)).join("") + circle(1041, 154, 42, accent) + label(1019, 163, "3/3", 22),
  },
  {
    slug: "accounting-migration", category: "ACCOUNTING / FIELD NOTES", title: ["New ledger.", "Clean start."], subtitle: "Make the balances agree", number: "02",
    art: rect(678, 190, 205, 261, "#d4d9cb") + rect(700, 221, 109, 12, ink, 6) + [0, 1, 2, 3].map(i => line(701, 271 + i * 39, 855, 271 + i * 39, "#a1aa9b", 3)).join("") + rect(899, 154, 220, 297, paper) + rect(924, 186, 107, 12, ink, 6) + [0, 1, 2, 3].map(i => line(924, 240 + i * 44, 1090, 240 + i * 44, "#c4ccbf", 3)).join("") + circle(894, 332, 47, accent) + `<path d="M869 332h50m-18-18 18 18-18 18" stroke="${ink}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  {
    slug: "payroll-check", category: "PAYROLL / BEFORE PAYDAY", title: ["Check twice.", "Pay once."], subtitle: "The parallel-run checklist", number: "03",
    art: rect(700, 171, 388, 300, paper) + rect(700, 171, 388, 62, accent) + label(726, 211, "PAYROLL REVIEW", 19) + label(744, 279, "OLD", 13, muted) + label(912, 279, "NEW", 13, muted) + [0, 1, 2].map(i => rect(743, 304 + i * 44, 100, 10, "#bcc6b4", 5) + rect(910, 304 + i * 44, 100, 10, "#bcc6b4", 5)).join("") + circle(1058, 449, 51, accent) + check(1038, 451),
  },
  {
    slug: "employee-self-service", category: "HR / EVERYDAY ACCESS", title: ["Less admin.", "More access."], subtitle: "Self-service that works", number: "04",
    art: rect(804, 113, 224, 403, "#85927b", 37) + rect(814, 123, 204, 383, paper, 29) + rect(872, 137, 89, 13, ink, 6) + circle(915, 215, 38, accent) + circle(915, 204, 12, ink) + `<path d="M891 236q24-29 48 0" fill="${ink}"/>` + rect(839, 278, 154, 51, "#e0e5d7", 12) + label(856, 309, "MY REQUESTS", 13) + rect(839, 344, 154, 51, accent, 12) + label(856, 375, "APPROVED", 14) + rect(878, 474, 76, 5, ink, 2) + circle(765, 372, 29, accent) + circle(1067, 246, 18, accent),
  },
  {
    slug: "crm-pipeline", category: "CRM / SALES OPERATIONS", title: ["Real progress.", "Clear next steps."], subtitle: "Build a pipeline you can trust", number: "05",
    art: [0, 1, 2].map(i => rect(691 + i * 139, 184, 123, 274, "#41413c", 16) + rect(708 + i * 139, 206, 66, 7, accent, 3)).join("") + rect(704, 239, 97, 61, paper, 10) + rect(704, 313, 97, 61, "#a7b59b", 10) + rect(843, 239, 97, 61, paper, 10) + rect(982, 239, 97, 61, accent, 10) + check(1010, 270) + `<path d="M741 494h289m-18-18 18 18-18 18" stroke="${accent}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  {
    slug: "erp-readiness", category: "ERP / THE BIG DECISION", title: ["Connect the work.", "Then the systems."], subtitle: "Is your business ready for ERP?", number: "06",
    art: line(784, 223, 921, 322, "#778c68", 5) + line(1048, 223, 921, 322, "#778c68", 5) + line(784, 433, 921, 322, "#778c68", 5) + line(1048, 433, 921, 322, "#778c68", 5) + rect(722, 173, 124, 91, paper) + rect(986, 173, 124, 91, paper) + rect(722, 390, 124, 91, paper) + rect(986, 390, 124, 91, paper) + label(742, 225, "ORDERS", 16) + label(1007, 225, "STOCK", 16) + label(739, 443, "FINANCE", 16) + label(1004, 443, "PEOPLE", 16) + circle(921, 322, 62, accent) + `<path d="m895 308 26-14 26 14v29l-26 15-26-15zm0 0 26 15 26-15m-26 15v29" stroke="${ink}" stroke-width="4" fill="none" stroke-linejoin="round"/>`,
  },
];

await mkdir("public/blog", { recursive: true });
for (const cover of covers) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="${ink}"/>
<path d="M648 0v630M0 550h1200" stroke="#474741" stroke-width="1"/>
${circle(1200, 0, 220, "#30302d")}
${label(65, 94, cover.category, 17, accent)}
${label(62, 271, cover.title[0], 49, paper)}
${label(62, 335, cover.title[1], 49, paper)}
<text x="65" y="397" fill="#b4bdae" font-family="Arial, sans-serif" font-size="22">${cover.subtitle}</text>
${label(65, 594, "indaba", 28, paper)}
${label(908, 590, "FIELD GUIDE / " + cover.number, 15, accent)}
${cover.art}
</svg>`;
  await writeFile(`public/blog/${cover.slug}.svg`, svg, "utf8");
}
console.log(`Created ${covers.length} blog thumbnails.`);
