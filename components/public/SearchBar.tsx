"use client";

import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { useState } from "react";

import { GlossyButton } from "@/components/public/GlossyButton";
import { cn } from "@/lib/utils";

export function SearchBar({
  className,
  placeholder = "Search accounting, payroll, CRM and more",
  autoFocus = false,
  defaultValue = "",
}: {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
  defaultValue?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/software");
  };

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className={cn(
        "flex w-full items-center gap-2 rounded-2xl border border-border/60 bg-background/90 p-2 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.6)] backdrop-blur-md",
        className,
      )}
    >
      <label htmlFor="site-search" className="sr-only">
        Search software
      </label>
      <span className="grid size-10 shrink-0 place-items-center text-muted-foreground">
        <SearchIcon className="size-5" aria-hidden="true" />
      </span>
      <input
        id="site-search"
        type="search"
        name="q"
        value={query}
        autoFocus={autoFocus}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className="h-11 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
      />
      <GlossyButton size="md" className="shrink-0">
        Search
      </GlossyButton>
    </form>
  );
}
