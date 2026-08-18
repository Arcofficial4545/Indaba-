import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLinkIcon } from "lucide-react";

import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { getRow, loadOptions } from "@/lib/admin/data";
import { getResource } from "@/lib/admin/resources";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Where this row appears on the public site, if anywhere. */
function publicHref(resourceKey: string, row: Record<string, unknown>) {
  const slug = typeof row.slug === "string" ? row.slug : null;
  if (!slug) return null;

  switch (resourceKey) {
    case "software":
      return `/software/${slug}`;
    case "articles":
      return `/blog/${slug}`;
    case "categories":
      return `/category/${slug}`;
    case "comparisons":
      return `/compare/${slug}`;
    case "pages":
      return `/${slug}`;
    default:
      return null;
  }
}

export default async function EditResourcePage(
  props: PageProps<"/admin/[resource]/[id]">,
) {
  const { resource, id } = await props.params;

  const definition = getResource(resource);
  if (!definition) notFound();

  const row = await getRow(definition, id);
  if (!row) notFound();

  const options = await loadOptions(definition);
  const href = publicHref(definition.key, row);

  const title =
    (typeof row.name === "string" && row.name) ||
    (typeof row.title === "string" && row.title) ||
    (typeof row.review_title === "string" && row.review_title) ||
    `Edit ${definition.label.toLowerCase()}`;

  return (
    <AdminShell
      title={title}
      description={`Editing a row in ${definition.table}`}
      actions={
        href && (
          <Link
            href={href}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm transition-colors hover:bg-muted"
          >
            View live
            <ExternalLinkIcon className="size-3.5" aria-hidden="true" />
          </Link>
        )
      }
    >
      <ResourceForm resource={definition} row={row} options={options} />
    </AdminShell>
  );
}
