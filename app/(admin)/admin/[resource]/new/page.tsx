import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { loadOptions } from "@/lib/admin/data";
import { getResource } from "@/lib/admin/resources";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function NewResourcePage(
  props: PageProps<"/admin/[resource]/new">,
) {
  const { resource } = await props.params;
  const definition = getResource(resource);
  if (!definition || definition.canCreate === false) notFound();

  const options = await loadOptions(definition);

  return (
    <AdminShell
      title={`New ${definition.label.toLowerCase()}`}
      description={`Adding a row to ${definition.table}`}
    >
      <ResourceForm resource={definition} options={options} />
    </AdminShell>
  );
}
