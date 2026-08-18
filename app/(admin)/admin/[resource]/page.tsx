import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlusIcon } from "lucide-react";

import { AdminShell } from "@/components/admin/AdminShell";
import { GlossyButton } from "@/components/public/GlossyButton";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/public/Pagination";
import { listRows } from "@/lib/admin/data";
import { RESOURCE_KEYS, getResource } from "@/lib/admin/resources";
import { formatDate, formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

const PER_PAGE = 25;

export async function generateMetadata(
  props: PageProps<"/admin/[resource]">,
): Promise<Metadata> {
  const { resource } = await props.params;
  const definition = getResource(resource);
  return {
    title: definition ? `${definition.plural} | Admin` : "Admin",
    robots: { index: false, follow: false },
  };
}

export function generateStaticParams() {
  return RESOURCE_KEYS.map((resource) => ({ resource }));
}

export default async function ResourceListPage(
  props: PageProps<"/admin/[resource]">,
) {
  const { resource } = await props.params;
  const searchParams = await props.searchParams;

  const definition = getResource(resource);
  if (!definition) notFound();

  const asString = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const page = Number(asString(searchParams.page) ?? "1") || 1;
  const query = asString(searchParams.q) ?? "";

  const { rows, total } = await listRows(definition, {
    page,
    perPage: PER_PAGE,
    query,
  });

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <AdminShell
      title={definition.plural}
      description={`${formatNumber(total)} ${total === 1 ? "row" : "rows"}`}
      actions={
        definition.canCreate !== false && (
          <GlossyButton href={`/admin/${definition.key}/new`} size="sm">
            <PlusIcon aria-hidden="true" />
            New {definition.label.toLowerCase()}
          </GlossyButton>
        )
      }
    >
      <div className="flex flex-col gap-5">
        <form method="get" role="search" className="flex gap-2">
          <label htmlFor="admin-search" className="sr-only">
            Search {definition.plural}
          </label>
          <input
            id="admin-search"
            name="q"
            defaultValue={query}
            placeholder={`Search ${definition.plural.toLowerCase()}`}
            className="h-10 w-full max-w-sm rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-[var(--color-brand-dark)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          />
          <button
            type="submit"
            className="rounded-xl border border-border px-4 text-sm transition-colors hover:bg-muted"
          >
            Search
          </button>
        </form>

        {rows.length === 0 ? (
          <div className="card-modern p-12 text-center">
            <p className="font-heading text-base font-bold tracking-tight">
              Nothing here yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {query
                ? "No rows matched that search."
                : "Run the seed scripts, or create the first row."}
            </p>
          </div>
        ) : (
          <div className="card-modern overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {definition.listColumns.map((column) => (
                      <th
                        key={column.name}
                        scope="col"
                        className="px-4 py-3 text-left text-[0.7rem] font-bold tracking-widest text-muted-foreground uppercase whitespace-nowrap"
                      >
                        {column.label}
                      </th>
                    ))}
                    <th scope="col" className="px-4 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={String(row.id)}
                      className="border-b border-border last:border-0 hover:bg-muted/40"
                    >
                      {definition.listColumns.map((column) => (
                        <td key={column.name} className="px-4 py-3 align-middle">
                          <Cell value={row[column.name]} type={column.type} />
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/${definition.key}/${String(row.id)}`}
                          className="text-sm font-medium text-[var(--color-brand-dark)] hover:underline"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          basePath={`/admin/${definition.key}`}
          params={{ q: query }}
        />
      </div>
    </AdminShell>
  );
}

function Cell({ value, type }: { value: unknown; type?: string }) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-muted-foreground/50">Not set</span>;
  }

  if (type === "badge") {
    const text = String(value);
    return (
      <Badge variant={text === "published" ? "success" : "muted"}>{text}</Badge>
    );
  }

  if (type === "date") {
    return <span className="whitespace-nowrap">{formatDate(String(value))}</span>;
  }

  if (type === "number") {
    return <span className="tabular-nums">{String(value)}</span>;
  }

  const text = String(value);
  return (
    <span className="line-clamp-1 max-w-xs">
      {text.length > 70 ? `${text.slice(0, 70)}...` : text}
    </span>
  );
}
