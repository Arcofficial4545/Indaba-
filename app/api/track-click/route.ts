import { NextResponse, type NextRequest } from "next/server";

import { clientIp, hashIp } from "@/lib/hash";
import { getSoftwareBySlug } from "@/lib/queries/software";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/site";

/**
 * Affiliate click tracking.
 *
 * THE RULE THIS ROUTE EXISTS TO ENFORCE: a logging failure must never cost a
 * click. The insert is wrapped, its result is ignored, and the redirect is
 * issued regardless. Money first, analytics second.
 *
 * Anything that could throw before the redirect is either inside the try or
 * has a fallback, including resolving the product itself.
 */
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("software");

  // Nothing to redirect to. Send them somewhere useful rather than erroring.
  if (!slug) {
    return NextResponse.redirect(new URL("/software", SITE_URL), 302);
  }

  let destination = `${SITE_URL}/software/${slug}`;
  let softwareId: string | null = null;
  let softwareName = slug;

  try {
    const software = await getSoftwareBySlug(slug);
    if (software) {
      softwareId = software.id.startsWith("sw-") ? null : software.id;
      softwareName = software.name;
      destination =
        software.affiliate_url ?? software.vendor_website ?? destination;
    }
  } catch {
    // Resolution failed. The reader still gets sent to the product page.
  }

  // Log, but never let it block or break the redirect.
  try {
    const supabase = createServiceRoleClient();
    if (supabase) {
      await supabase.from("affiliate_clicks").insert({
        software_id: softwareId,
        software_name: softwareName,
        affiliate_url: destination,
        ip_hash: hashIp(clientIp(request.headers)),
        user_agent: request.headers.get("user-agent"),
        referrer: request.headers.get("referer"),
        country_code:
          request.headers.get("x-vercel-ip-country") ??
          request.headers.get("cf-ipcountry"),
      });
    }
  } catch {
    // Deliberately swallowed. A analytics outage is not a reason to lose a
    // click, and there is nothing useful to tell the reader.
  }

  return NextResponse.redirect(destination, 302);
}
