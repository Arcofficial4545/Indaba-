import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { formatDate } from "@/lib/format";
import { getPageBySlug } from "@/lib/queries/pages";
import { SITE_URL } from "@/lib/site";

/**
 * Renders one of the legal and trust pages.
 *
 * Each route is a thin file that calls this, which keeps the seven pages
 * consistent and means a change to the layout happens once.
 */
export async function LegalPage({ slug }: { slug: string }) {
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  return (
    <div className="container-site flex flex-col gap-10 py-8">
      <Breadcrumbs items={[{ label: page.title }]} />

      <article className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-3">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.12]">
            {page.title}
          </h1>
          {page.updated_at && (
            <p className="text-sm text-muted-foreground">
              Last updated {formatDate(page.updated_at)}
            </p>
          )}
        </header>

        <div
          className="legal-content"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </article>
    </div>
  );
}

/** Metadata helper so each route file stays to a few lines. */
export async function legalMetadata(slug: string): Promise<Metadata> {
  const page = await getPageBySlug(slug);
  if (!page) return { title: "Not found" };

  return {
    title: page.meta_title ?? page.title,
    description: page.meta_description ?? undefined,
    alternates: { canonical: `${SITE_URL}/${page.slug}` },
  };
}
