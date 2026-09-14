import "server-only";

import { SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Transactional email through Resend's HTTP API.
 *
 * Optional by design. With no key configured, or while the Resend account has
 * no verified domain (Resend then delivers only to the account owner's own
 * address), a send is refused and the caller gets `false`. Callers treat that
 * as "not sent" and say so, rather than promising an inbox.
 */
async function send(message: {
  to: string;
  subject: string;
  text: string;
  html: string;
  headers?: Record<string, string>;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return false;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [message.to],
        subject: message.subject,
        text: message.text,
        html: message.html,
        headers: message.headers,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      // Status only. The address is personal information and stays out of logs.
      console.error(`Resend refused an email: HTTP ${response.status}`);
    }
    return response.ok;
  } catch {
    console.error("Resend could not be reached");
    return false;
  }
}

/**
 * The double opt in email. The token is the pending row's confirm_token, which
 * is also what the unsubscribe page matches on.
 */
export function sendNewsletterConfirmation(
  email: string,
  token: string,
): Promise<boolean> {
  const confirmUrl = `${SITE_URL}/api/newsletter/confirm?token=${token}`;
  const unsubscribeUrl = `${SITE_URL}/newsletter/unsubscribe?token=${token}`;

  const text = [
    "Hello,",
    "",
    `Someone, hopefully you, asked to receive the ${SITE_NAME} newsletter at this address. Nothing is sent until you confirm.`,
    "",
    `Confirm your subscription: ${confirmUrl}`,
    "",
    `If this was not you, ignore this email and you will not hear from us again. You can also remove this address now: ${unsubscribeUrl}`,
    "",
    `${SITE_NAME}, ${SITE_URL}`,
  ].join("\n");

  const html = `<p>Hello,</p>
<p>Someone, hopefully you, asked to receive the ${SITE_NAME} newsletter at this address. Nothing is sent until you confirm.</p>
<p><a href="${confirmUrl}">Confirm your subscription</a></p>
<p>If this was not you, ignore this email and you will not hear from us again. You can also <a href="${unsubscribeUrl}">remove this address now</a>.</p>
<p>${SITE_NAME}, <a href="${SITE_URL}">${SITE_URL}</a></p>`;

  return send({
    to: email,
    subject: `Confirm your ${SITE_NAME} subscription`,
    text,
    html,
    headers: { "List-Unsubscribe": `<${unsubscribeUrl}>` },
  });
}
