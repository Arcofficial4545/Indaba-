import {
  BoxesIcon,
  CalculatorIcon,
  HandshakeIcon,
  KanbanIcon,
  LayersIcon,
  UsersIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react";
import { createElement } from "react";

import { cn } from "@/lib/utils";

/**
 * Categories store an icon name as text, so the mapping lives here rather than
 * letting the database dictate a component import.
 */
const ICONS: Record<string, LucideIcon> = {
  calculator: CalculatorIcon,
  wallet: WalletIcon,
  users: UsersIcon,
  handshake: HandshakeIcon,
  boxes: BoxesIcon,
  kanban: KanbanIcon,
};

export function getCategoryIcon(name: string | null | undefined): LucideIcon {
  if (!name) return LayersIcon;
  return ICONS[name] ?? LayersIcon;
}

export function CategoryIcon({
  name,
  className,
}: {
  name: string | null | undefined;
  className?: string;
}) {
  /*
    createElement rather than binding the looked up icon to a capitalised local
    and rendering it as JSX. The latter reads to the compiler as creating a
    component during render, which it rightly refuses.
  */
  return createElement(getCategoryIcon(name), {
    className: cn("size-5", className),
    "aria-hidden": "true",
  });
}
