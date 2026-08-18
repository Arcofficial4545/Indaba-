import "server-only";

import type { OptionSet } from "@/components/admin/ResourceForm";
import type { Resource } from "@/lib/admin/resources";
import { createClient } from "@/lib/supabase/server";

/**
 * Loads the option lists for any select field that draws from another table.
 *
 * Done once per form render rather than per field, and only for the tables the
 * registry actually references.
 */
export async function loadOptions(resource: Resource): Promise<OptionSet> {
  const supabase = await createClient();
  if (!supabase) return {};

  const needed = resource.fields.filter((field) => field.optionsFrom);
  if (needed.length === 0) return {};

  const result: OptionSet = {};

  await Promise.all(
    needed.map(async (field) => {
      const source = field.optionsFrom;
      if (!source) return;

      const { data } = await supabase
        .from(source.table)
        .select(`${source.value}, ${source.label}`)
        .order(source.label, { ascending: true });

      result[field.name] = (
        (data ?? []) as unknown as Record<string, string>[]
      ).map((row) => ({
        value: String(row[source.value]),
        label: String(row[source.label]),
      }));
    }),
  );

  return result;
}

export type ListResult = {
  rows: Record<string, unknown>[];
  total: number;
};

export async function listRows(
  resource: Resource,
  { page = 1, perPage = 25, query = "" }: { page?: number; perPage?: number; query?: string },
): Promise<ListResult> {
  const supabase = await createClient();
  if (!supabase) return { rows: [], total: 0 };

  let request = supabase
    .from(resource.table)
    .select("*", { count: "exact" })
    .order(resource.orderBy.column, { ascending: resource.orderBy.ascending });

  if (query && resource.searchColumns.length > 0) {
    // PostgREST `or` with ilike across the configured search columns.
    const clause = resource.searchColumns
      .map((column) => `${column}.ilike.%${query}%`)
      .join(",");
    request = request.or(clause);
  }

  const from = (page - 1) * perPage;
  const { data, count, error } = await request.range(from, from + perPage - 1);

  if (error) return { rows: [], total: 0 };
  return { rows: (data ?? []) as Record<string, unknown>[], total: count ?? 0 };
}

export async function getRow(
  resource: Resource,
  id: string,
): Promise<Record<string, unknown> | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from(resource.table)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as Record<string, unknown>;
}
