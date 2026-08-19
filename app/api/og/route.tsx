import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

import { SITE_DOMAIN, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

/*
  The palette is repeated here rather than read from globals.css because satori
  renders outside the document and never sees a custom property. These four
  values are the navy panel, the lime, the ink that sits on lime, and the muted
  text, and they must stay in step with the tokens of the same name.
*/
const NAVY = "#1b1f3b";
const BRAND = "#d9f65f";
const BRAND_INK = "#1a2008";
const MUTED = "rgba(255, 255, 255, 0.62)";

const SIZE = { width: 1200, height: 630 };

/**
 * Dynamic Open Graph images.
 *
 *   /api/og?title=Xero&eyebrow=Accounting&rating=4.5&reviews=412
 *
 * Everything is optional. With no parameters this renders the site card, which
 * is what the home page and the static pages want, so one route covers both
 * cases instead of shipping a checked in fallback PNG that drifts.
 *
 * No custom font is loaded. Fetching a web font on every render would put a
 * network call in the path of a crawler that has already decided how long it
 * will wait, and a missed OG image is worse than one set in the default face.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  // Truncated rather than wrapped without limit: three lines of product name
  // would push the rating off the card.
  const title = (params.get("title") ?? SITE_NAME).slice(0, 80);
  const eyebrow = params.get("eyebrow")?.slice(0, 40) ?? null;
  const rating = params.get("rating");
  const reviews = params.get("reviews");
  const subtitle = params.get("subtitle")?.slice(0, 120) ?? SITE_TAGLINE;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: NAVY,
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        {/* A lime wash in the corner, the same gesture the hero plate makes. */}
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -160,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: BRAND,
            opacity: 0.1,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 820 }}>
          {eyebrow && (
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                borderRadius: 9999,
                background: "rgba(255,255,255,0.10)",
                padding: "10px 24px",
                fontSize: 26,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {eyebrow}
            </div>
          )}

          <div
            style={{
              display: "flex",
              fontSize: title.length > 34 ? 74 : 92,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.08,
              letterSpacing: -2,
            }}
          >
            {title}
          </div>

          <div style={{ display: "flex", fontSize: 30, color: MUTED, lineHeight: 1.4 }}>
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                width: 46,
                height: 46,
                borderRadius: 14,
                background: BRAND,
              }}
            />
            <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: "#ffffff" }}>
              {SITE_DOMAIN}
            </div>
          </div>

          {rating && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                borderRadius: 9999,
                background: BRAND,
                color: BRAND_INK,
                padding: "14px 30px",
                fontSize: 32,
                fontWeight: 700,
              }}
            >
              <div style={{ display: "flex" }}>{rating} out of 5</div>
              {reviews && (
                <div style={{ display: "flex", fontWeight: 400, fontSize: 26 }}>
                  {reviews} reviews
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    ),
    SIZE,
  );
}
