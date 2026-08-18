"use client";

import { useRouter } from "next/navigation";
import { BookOpenIcon, LayersIcon, PackageIcon } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export type SearchIndexItem = {
  id: string;
  title: string;
  subtitle: string | null;
  href: string;
  group: "Software" | "Guides" | "Categories";
};

const GROUP_ICON = {
  Software: PackageIcon,
  Guides: BookOpenIcon,
  Categories: LayersIcon,
} as const;

const GROUP_ORDER: SearchIndexItem["group"][] = [
  "Software",
  "Categories",
  "Guides",
];

export function SearchDialog({
  open,
  onOpenChange,
  items,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: SearchIndexItem[];
}) {
  const router = useRouter();

  const select = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search"
      description="Find software, categories and buying guides"
    >
      <CommandInput placeholder="Search software, categories and guides" />
      <CommandList>
        <CommandEmpty>
          Nothing matched that. Try a vendor name such as Sage or Xero.
        </CommandEmpty>

        {GROUP_ORDER.map((group) => {
          const groupItems = items.filter((item) => item.group === group);
          if (groupItems.length === 0) return null;
          const Icon = GROUP_ICON[group];

          return (
            <CommandGroup key={group} heading={group}>
              {groupItems.map((item) => (
                <CommandItem
                  key={item.id}
                  value={`${item.title} ${item.subtitle ?? ""}`}
                  onSelect={() => select(item.href)}
                >
                  <Icon
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate font-medium">{item.title}</span>
                    {item.subtitle && (
                      <span className="truncate text-xs text-muted-foreground">
                        {item.subtitle}
                      </span>
                    )}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}
