import { SITE_LOCALE, SITE_LOCATION, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Email templates, kept apart from lib/email.ts so they have no `server-only`
 * import and can be rendered to a file for a preview without sending anything.
 *
 * WRITTEN TO LAND IN THE PRIMARY TAB AND STILL LOOK LIKE A PRODUCT.
 * Gmail files campaign-shaped mail under Promotions: multi-column layouts,
 * icon grids, many buttons and links. So this is one column with one button,
 * two content links in total, and the brand carried by the real mark, the
 * palette and a single soft panel rather than by layout. Tab placement is
 * still Gmail's call; a verified sending domain matters more than any markup.
 *
 * THINGS THAT LOOKED CHEAP IN A REAL INBOX, AND WHAT REPLACED THEM:
 *  - The subscriber's address in the body. Gmail auto-links it in blue, off
 *    palette, and the reader already knows their own address. It is gone.
 *  - Bare hostnames, which Gmail also auto-links. The one that remains is a
 *    real link styled in the footer colour, so Gmail has nothing to restyle.
 *  - A text-only wordmark, which read as a placeholder. The mark is the site's
 *    own asset, loaded from SITE_URL. It is left out when SITE_URL is not
 *    https, because Gmail cannot fetch an image from localhost and a broken
 *    image is worse than none.
 *
 * EMAIL IS NOT THE WEB. Tables and inline styles, longhand font properties,
 * and literal hex from the site's palette, because custom properties and most
 * <style> rules do not survive an email client.
 *
 * The copy says what the newsletter covers and nothing about how often it is
 * sent, so it stays true however the schedule changes.
 */

const COLOUR = {
  bone: "#eeefe9",
  panel: "#f6f6f2",
  card: "#ffffff",
  ink: "#262626",
  body: "#3d3d3b",
  muted: "#6b6c67",
  sand: "#d1bd91",
  sandEdge: "#b9a578",
  bronze: "#7a5f31",
  line: "#e3e4df",
} as const;

const FONT =
  "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** What the newsletter covers. Content only: no frequency, no promises about volume. */
const COVERS = [
  {
    title: "Price changes, in rand",
    body: "When software you are weighing gets cheaper or dearer, with the VAT basis stated.",
  },
  {
    title: "Side-by-side comparisons",
    body: "New head-to-heads across accounting, payroll, HR, CRM and more.",
  },
  {
    title: "Software worth a look",
    body: "Tools that suit how South African businesses actually work.",
  },
];

export type EmailMessage = { subject: string; text: string; html: string };

/**
 * Sent the moment someone subscribes. There is no confirmation step: entering
 * the address is the subscription, and this email is the receipt. The
 * unsubscribe link is the safeguard against an address somebody else typed in.
 */
export function newsletterWelcomeEmail({
  unsubscribeUrl,
}: {
  email: string;
  unsubscribeUrl: string;
}): EmailMessage {
  const subject = `Welcome to ${SITE_NAME}`;
  const preheader = "Real prices in rand, honest comparisons, and a good place to start.";
  const siteHost = new URL(SITE_URL).host;
  const logoUrl = SITE_URL.startsWith("https://")
    ? // A tight crop of indaca_logo7.png at 96px: the site asset carries so much
      // padding that the scale shrank to a speck at email size.
      `${SITE_URL}/logos/indaba-mark-email.png`
    : null;

  const safeName = escapeHtml(SITE_NAME);
  const safeSite = escapeHtml(SITE_URL);
  const safeUnsubscribe = escapeHtml(unsubscribeUrl);

  const coverRows = COVERS.map(
    (cover, index) => `
                      <tr>
                        <td width="22" valign="top" style="padding:${index === 0 ? "8px" : "22px"} 0 0 0;">
                          <div style="width:8px;height:8px;border-radius:999px;background:${COLOUR.sand};line-height:8px;font-size:0;">&nbsp;</div>
                        </td>
                        <td valign="top" style="padding:${index === 0 ? "0" : "14px"} 0 0 0;">
                          <p style="margin:0;${FONT}font-size:15px;line-height:24px;font-weight:600;color:${COLOUR.ink};">${escapeHtml(cover.title)}</p>
                          <p style="margin:2px 0 0 0;${FONT}font-size:14px;line-height:22px;color:${COLOUR.muted};">${escapeHtml(cover.body)}</p>
                        </td>
                      </tr>`,
  ).join("");

  const brand = logoUrl
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle" style="padding:0 10px 0 0;"><img src="${escapeHtml(logoUrl)}" width="36" height="36" alt="" style="display:block;width:36px;height:36px;border:0;outline:none;text-decoration:none;"></td>
                  <td valign="middle" style="${FONT}font-size:20px;line-height:24px;font-weight:600;letter-spacing:-0.02em;color:${COLOUR.ink};">${safeName}</td>
                </tr>
              </table>`
    : `<p style="margin:0;${FONT}font-size:20px;line-height:24px;font-weight:600;letter-spacing:-0.02em;color:${COLOUR.ink};">${safeName}</p>`;

  const html = `<!doctype html>
<html lang="${SITE_LOCALE}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${escapeHtml(subject)}</title>
  <style>
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; }
      .px { padding-left: 24px !important; padding-right: 24px !important; }
      .headline { font-size: 26px !important; line-height: 32px !important; }
      .button-table { width: 100% !important; }
      .button-cell, .button-link { display: block !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${COLOUR.bone};">
  <div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(preheader)}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLOUR.bone};">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" class="container" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px;max-width:560px;">
          <tr>
            <td class="px" bgcolor="${COLOUR.card}" style="background:${COLOUR.card};border:1px solid ${COLOUR.line};border-radius:14px;padding:32px 40px 36px 40px;">

              ${brand}

              <p style="margin:32px 0 0 0;${FONT}font-size:14px;line-height:20px;font-weight:600;color:${COLOUR.bronze};">You are subscribed</p>
              <h1 class="headline" style="margin:6px 0 0 0;${FONT}font-size:30px;line-height:36px;font-weight:600;letter-spacing:-0.025em;color:${COLOUR.ink};">Welcome to ${safeName}</h1>
              <p style="margin:14px 0 0 0;${FONT}font-size:17px;line-height:28px;color:${COLOUR.body};">
                Thanks for joining. We help South African businesses choose software with real prices in rand, the VAT basis stated, and ratings that are never for sale.
              </p>

              <!-- What they get -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 0 0;">
                <tr>
                  <td bgcolor="${COLOUR.panel}" style="background:${COLOUR.panel};border-radius:14px;padding:22px 24px 24px 24px;">
                    <p style="margin:0 0 16px 0;${FONT}font-size:13px;line-height:18px;font-weight:600;color:${COLOUR.muted};">What you will get</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${coverRows}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- The one action -->
              <table role="presentation" class="button-table" cellpadding="0" cellspacing="0" border="0" style="margin:30px 0 0 0;">
                <tr>
                  <td class="button-cell" align="center" bgcolor="${COLOUR.sand}" style="border-radius:999px;background:${COLOUR.sand};">
                    <a class="button-link" href="${safeSite}/software" target="_blank" style="display:inline-block;padding:15px 34px;border:1px solid ${COLOUR.sandEdge};border-radius:999px;${FONT}font-size:16px;line-height:20px;font-weight:600;color:${COLOUR.ink};text-decoration:none;">Browse software</a>
                  </td>
                </tr>
              </table>
              <p style="margin:14px 0 0 0;${FONT}font-size:14px;line-height:22px;color:${COLOUR.muted};">
                Or <a href="${safeSite}/compare" target="_blank" style="color:${COLOUR.bronze};font-weight:600;">compare two products side by side</a>.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:30px 0 0 0;">
                <tr><td style="border-top:1px solid ${COLOUR.line};font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>

              <p style="margin:22px 0 0 0;${FONT}font-size:14px;line-height:22px;color:${COLOUR.body};">
                <strong style="color:${COLOUR.ink};">One small thing:</strong> add this address to your contacts so our next email lands in your main inbox.
              </p>
              <p style="margin:18px 0 0 0;${FONT}font-size:15px;line-height:24px;color:${COLOUR.body};">The ${safeName} team</p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="px" align="center" style="padding:22px 40px 8px 40px;${FONT}font-size:12px;line-height:19px;color:${COLOUR.muted};">
              <p style="margin:0;"><strong style="color:${COLOUR.body};">${safeName}</strong>, ${escapeHtml(SITE_LOCATION)}</p>
              <p style="margin:6px 0 0 0;">You are receiving this because you subscribed on <a href="${safeSite}" target="_blank" style="color:${COLOUR.muted};text-decoration:underline;">${escapeHtml(siteHost)}</a>.</p>
              <p style="margin:10px 0 0 0;">
                <a href="${safeUnsubscribe}" target="_blank" style="color:${COLOUR.muted};text-decoration:underline;">Unsubscribe with one click</a>
                &nbsp;&nbsp;&nbsp;
                <a href="${safeSite}/privacy-policy" target="_blank" style="color:${COLOUR.muted};text-decoration:underline;">Privacy policy</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `Welcome to ${SITE_NAME}`,
    "",
    "Thanks for joining. We help South African businesses choose software with real prices in rand, the VAT basis stated, and ratings that are never for sale.",
    "",
    "What you will get",
    ...COVERS.map((cover) => `- ${cover.title}: ${cover.body}`),
    "",
    `Browse software: ${SITE_URL}/software`,
    `Or compare two products side by side: ${SITE_URL}/compare`,
    "",
    "One small thing: add this address to your contacts so our next email lands in your main inbox.",
    "",
    `The ${SITE_NAME} team`,
    "",
    "---",
    `${SITE_NAME}, ${SITE_LOCATION}`,
    `You are receiving this because you subscribed on ${siteHost}.`,
    `Unsubscribe with one click: ${unsubscribeUrl}`,
    `Privacy policy: ${SITE_URL}/privacy-policy`,
  ].join("\n");

  return { subject, text, html };
}
