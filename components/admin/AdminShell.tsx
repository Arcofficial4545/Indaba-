import Link from "next/link";
import {
  BarChart3Icon,
  BookOpenIcon,
  FileTextIcon,
  LayersIcon,
  LayoutDashboardIcon,
  MailIcon,
  MessagesSquareIcon,
  PackageIcon,
  ScaleIcon,
  SettingsIcon,
  SignpostIcon,
  StarIcon,
} from "lucide-react";

import { BrandLogo } from "@/components/public/BrandLogo";
import { SignOutButton } from "@/components/admin/SignOutButton";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/admin/software", label: "Software", icon: PackageIcon },
  { href: "/admin/reviews", label: "Reviews", icon: StarIcon },
  { href: "/admin/categories", label: "Categories", icon: LayersIcon },
  { href: "/admin/articles", label: "Articles", icon: BookOpenIcon },
  { href: "/admin/comparisons", label: "Comparisons", icon: ScaleIcon },
  { href: "/admin/pages", label: "Pages", icon: FileTextIcon },
  { href: "/admin/redirects", label: "Redirects", icon: SignpostIcon },
] as const;

const OPERATIONS = [
  { href: "/admin/newsletter", label: "Newsletter", icon: MailIcon },
  { href: "/admin/contact", label: "Messages", icon: MessagesSquareIcon },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3Icon },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
] as const;

export function AdminShell({
  children,
  title,
  description,
  actions,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col overflow-y-auto bg-[var(--sidebar)] text-[var(--sidebar-foreground)] lg:flex">
        <div className="p-5">
          <BrandLogo href="/admin" className="text-white [&_span]:text-white" />
        </div>

        <nav aria-label="Content" className="flex flex-col gap-0.5 px-3">
          <p className="px-3 pt-3 pb-2 text-[0.65rem] font-bold tracking-[0.18em] text-white/35 uppercase">
            Content
          </p>
          {NAV.map((item) => (
            <SidebarLink key={item.href} {...item} />
          ))}

          <p className="px-3 pt-5 pb-2 text-[0.65rem] font-bold tracking-[0.18em] text-white/35 uppercase">
            Operations
          </p>
          {OPERATIONS.map((item) => (
            <SidebarLink key={item.href} {...item} />
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-2 p-3">
          <Link
            href="/"
            className="rounded-xl px-3 py-2 text-sm text-white/55 transition-colors hover:bg-[var(--sidebar-accent)] hover:text-white"
          >
            View the site
          </Link>
          <SignOutButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-border bg-background/80 px-5 py-5 backdrop-blur-xl sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl font-bold tracking-tight">
                {title}
              </h1>
              {description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>

          {/* The sidebar is hidden below lg, so the nav has to appear here. */}
          <nav
            aria-label="Admin sections"
            className="mt-4 flex gap-1 overflow-x-auto lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {[...NAV, ...OPERATIONS].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full bg-muted px-3 py-1.5 text-sm whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="flex-1 px-5 py-6 sm:px-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-[var(--sidebar-accent)] hover:text-white focus-visible:ring-2 focus-visible:ring-[var(--sidebar-ring)] focus-visible:outline-none"
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      {label}
    </Link>
  );
}
