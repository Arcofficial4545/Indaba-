"use client";

import { StarIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

/**
 * A radio group that looks like stars.
 *
 * Built on real radio inputs rather than buttons, so it is keyboard operable
 * with arrow keys, announces itself correctly and submits with the form
 * without any JavaScript bookkeeping.
 */
export function StarSelector({
  name,
  label,
  required = true,
  className,
}: {
  name: string;
  label: string;
  required?: boolean;
  className?: string;
}) {
  const [value, setValue] = useState(0);
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <fieldset className={cn("flex flex-wrap items-center gap-4", className)}>
      <legend className="sr-only">{label}</legend>
      <span className="w-40 shrink-0 text-sm font-medium">{label}</span>

      <div
        className="flex items-center gap-1"
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <label
            key={star}
            className="cursor-pointer p-0.5"
            onMouseEnter={() => setHover(star)}
          >
            <input
              type="radio"
              name={name}
              value={star}
              required={required && star === 1}
              checked={value === star}
              onChange={() => setValue(star)}
              className="sr-only peer"
            />
            <StarIcon
              className={cn(
                "size-6 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--ring)]",
                star <= shown
                  ? "fill-[var(--color-star)] text-[var(--color-star)]"
                  : "text-muted-foreground/35",
              )}
              aria-hidden="true"
            />
            <span className="sr-only">
              {star} star{star === 1 ? "" : "s"}
            </span>
          </label>
        ))}
      </div>

      <span className="text-sm text-muted-foreground tabular-nums">
        {value > 0 ? `${value} of 5` : "Not rated"}
      </span>
    </fieldset>
  );
}
