import type { Metadata } from "next";

import { LoginForm } from "@/components/admin/LoginForm";
import { BrandLogo } from "@/components/public/BrandLogo";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage(
  props: PageProps<"/admin/login">,
) {
  const searchParams = await props.searchParams;
  const raw = Array.isArray(searchParams.next)
    ? searchParams.next[0]
    : searchParams.next;

  // Only accept an internal path, so the login page cannot be used as an open
  // redirect to somebody else's site.
  const next = raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/admin";

  return (
    <div className="grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <BrandLogo href={null} />
        </div>

        <div className="card-modern p-8">
          <h1 className="font-heading text-xl font-bold tracking-tight">
            Sign in
          </h1>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">
            This area is for the site editor.
          </p>

          <LoginForm next={next} />
        </div>
      </div>
    </div>
  );
}
