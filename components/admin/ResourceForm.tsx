"use client";

import Link from "next/link";
import { useActionState } from "react";

import { deleteResource, saveResource, type SaveState } from "@/app/(admin)/admin/actions";
import { GlossyButton } from "@/components/public/GlossyButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Field, Resource } from "@/lib/admin/resources";
import { cn } from "@/lib/utils";

const initialState: SaveState = { status: "idle", message: "" };

export type OptionSet = Record<string, { value: string; label: string }[]>;

export function ResourceForm({
  resource,
  row,
  options,
}: {
  resource: Resource;
  row?: Record<string, unknown>;
  /** Options for select fields that load from another table. */
  options: OptionSet;
}) {
  const [state, formAction, pending] = useActionState(saveResource, initialState);
  const id = row?.id ? String(row.id) : "";

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex flex-col gap-6">
        <input type="hidden" name="__resource" value={resource.key} />
        <input type="hidden" name="__id" value={id} />

        {state.status === "error" && state.message && (
          <p
            role="alert"
            className="rounded-2xl bg-destructive/10 p-4 text-sm text-destructive"
          >
            {state.message}
          </p>
        )}

        <div className="card-modern grid gap-5 p-6 sm:grid-cols-2">
          {resource.fields.map((field) => (
            <FieldRenderer
              key={field.name}
              field={field}
              value={row?.[field.name]}
              options={options}
              error={state.fieldErrors?.[field.name]}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <GlossyButton size="lg" disabled={pending}>
            {pending ? "Saving" : id ? "Save changes" : `Create ${resource.label.toLowerCase()}`}
          </GlossyButton>
          <Link
            href={`/admin/${resource.key}`}
            className="rounded-xl px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Cancel
          </Link>
        </div>
      </form>

      {/* Separate form: nesting one inside the other is invalid HTML. */}
      {id && resource.canDelete !== false && (
        <form
          action={deleteResource}
          className="flex items-center justify-between gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-5"
        >
          <input type="hidden" name="__resource" value={resource.key} />
          <input type="hidden" name="__id" value={id} />
          <div>
            <p className="text-sm font-medium">Delete this {resource.label.toLowerCase()}</p>
            <p className="text-sm text-muted-foreground">
              This cannot be undone, though the audit log keeps a copy of the row.
            </p>
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-xl border border-destructive px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:outline-none"
          >
            Delete
          </button>
        </form>
      )}
    </div>
  );
}

function FieldRenderer({
  field,
  value,
  options,
  error,
}: {
  field: Field;
  value: unknown;
  options: OptionSet;
  error?: string;
}) {
  const id = `field-${field.name}`;
  const wide = field.wide || field.type === "html" || field.type === "json";

  const selectOptions = field.optionsFrom
    ? (options[field.name] ?? [])
    : (field.options ?? []);

  return (
    <div className={cn("flex flex-col gap-2", wide && "sm:col-span-2")}>
      {field.type !== "checkbox" && (
        <Label htmlFor={id}>
          {field.label}
          {field.required && (
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          )}
        </Label>
      )}

      {(() => {
        switch (field.type) {
          case "textarea":
            return (
              <Textarea
                id={id}
                name={field.name}
                rows={4}
                defaultValue={asText(value)}
                aria-invalid={Boolean(error)}
              />
            );

          case "html":
            return (
              <Textarea
                id={id}
                name={field.name}
                rows={14}
                defaultValue={asText(value)}
                aria-invalid={Boolean(error)}
                className="font-mono text-xs"
              />
            );

          case "json":
            return (
              <Textarea
                id={id}
                name={field.name}
                rows={6}
                defaultValue={
                  value === null || value === undefined
                    ? ""
                    : JSON.stringify(value, null, 2)
                }
                aria-invalid={Boolean(error)}
                className="font-mono text-xs"
              />
            );

          case "checkbox":
            return (
              <label className="flex cursor-pointer items-center gap-2.5 py-2 text-sm">
                <input
                  id={id}
                  type="checkbox"
                  name={field.name}
                  defaultChecked={value === true}
                  className="size-4 accent-[var(--color-brand-dark)]"
                />
                {field.label}
              </label>
            );

          case "select":
            return (
              <select
                id={id}
                name={field.name}
                defaultValue={asText(value)}
                aria-invalid={Boolean(error)}
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-[var(--color-brand-dark)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                <option value="">Not set</option>
                {selectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            );

          case "color":
            return (
              <div className="flex items-center gap-2">
                <input
                  id={id}
                  type="color"
                  name={field.name}
                  defaultValue={asText(value) || "#00a86b"}
                  className="h-10 w-16 cursor-pointer rounded-xl border border-input bg-background p-1"
                />
                <span className="text-xs text-muted-foreground">
                  {asText(value) || "Falls back to the brand colour map"}
                </span>
              </div>
            );

          case "date":
            return (
              <Input
                id={id}
                type="date"
                name={field.name}
                defaultValue={asDate(value)}
                aria-invalid={Boolean(error)}
              />
            );

          case "number":
            return (
              <Input
                id={id}
                type="number"
                step="any"
                name={field.name}
                defaultValue={asText(value)}
                aria-invalid={Boolean(error)}
              />
            );

          default:
            return (
              <Input
                id={id}
                name={field.name}
                defaultValue={asText(value)}
                aria-invalid={Boolean(error)}
              />
            );
        }
      })()}

      {field.help && (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {field.help}
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function asText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return "";
}

/** `<input type="date">` wants yyyy-mm-dd, not an ISO timestamp. */
function asDate(value: unknown): string {
  if (typeof value !== "string" || value === "") return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}
