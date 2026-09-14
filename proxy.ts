import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Next 16 renamed `middleware` to `proxy`. It runs on the Node runtime.
 *
 * Two jobs:
 *   1. Consult the redirects table so URLs can change without losing rankings.
 *   2. Refresh the Supabase session and keep unauthenticated visitors out of
 *      the admin.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

type Redirect = { from_path: string; to_path: string; status_code: number };

/*
  Redirects are read once and cached in module scope for five minutes. Querying
  the table on every request would put a database round trip in front of every
  page load, which is a poor trade for a table that changes rarely.
*/
let redirectCache: { rows: Redirect[]; expires: number } | null = null;
const CACHE_MS = 5 * 60 * 1000;

async function getRedirects(): Promise<Redirect[]> {
  if (redirectCache && redirectCache.expires > Date.now()) {
    return redirectCache.rows;
  }
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/redirects?select=from_path,to_path,status_code`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      },
    );
    if (!response.ok) return redirectCache?.rows ?? [];

    const rows = (await response.json()) as Redirect[];
    redirectCache = { rows, expires: Date.now() + CACHE_MS };
    return rows;
  } catch {
    // A redirect lookup failure must not take the site down.
    return redirectCache?.rows ?? [];
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  /* ------------------------------------------------------------------ */
  /* 1. Redirects                                                        */
  /* ------------------------------------------------------------------ */
  if (!pathname.startsWith("/api") && !pathname.startsWith("/_next")) {
    const redirects = await getRedirects();
    const match = redirects.find((row) => row.from_path === pathname);
    if (match) {
      const url = new URL(match.to_path, request.url);
      url.search = search;
      return NextResponse.redirect(url, match.status_code === 302 ? 302 : 301);
    }
  }

  /* ------------------------------------------------------------------ */
  /* 2. Session refresh and admin guard                                  */
  /* ------------------------------------------------------------------ */
  let response = NextResponse.next({ request });
  let sessionHeaders: Record<string, string> = {};

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // Without Supabase there is no admin to protect and no session to refresh.
    return response;
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        // Supabase passes no-store headers alongside a refreshed session. A
        // cached copy of this response would hand one visitor's tokens to the
        // next, so they go on the response with the cookies.
        sessionHeaders = headers;
        for (const [key, value] of Object.entries(headers)) {
          response.headers.set(key, value);
        }
      },
    },
  });

  // getUser revalidates against the auth server. getSession would trust the
  // cookie, which is not good enough for an access decision.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminArea = pathname === "/admin" || pathname.startsWith("/admin/");
  const isLoginPage = pathname === "/admin/login";

  /*
    A redirect is a new response, so it does not inherit what getUser() just
    wrote. Dropping those cookies leaves the browser holding a refresh token
    Supabase has already rotated out, and the next request signs the admin out.
  */
  const redirectWithSession = (url: URL) => {
    const redirect = NextResponse.redirect(url);
    for (const cookie of response.cookies.getAll()) {
      redirect.cookies.set(cookie);
    }
    for (const [key, value] of Object.entries(sessionHeaders)) {
      redirect.headers.set(key, value);
    }
    return redirect;
  };

  if (isAdminArea && !isLoginPage && !user) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("next", pathname);
    return redirectWithSession(url);
  }

  // Already signed in, so the login page has nothing to offer.
  if (isLoginPage && user) {
    return redirectWithSession(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
      Everything except static assets, image files and the OG image route.
      Those never need a redirect lookup or a session, and matching them would
      put an auth round trip in front of every asset request.
    */
    "/((?!_next/static|_next/image|favicon.ico|api/og|logos/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|txt|xml|css|js|map|woff|woff2|ttf|otf|mp4|webm|pdf|webmanifest)$).*)",
  ],
};
