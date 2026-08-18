import { Toaster } from "@/components/ui/sonner";

/**
 * The admin shell is deliberately separate from the public layout: no navbar,
 * no footer, no search index, and a dark sidebar chrome of its own.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      {children}
      <Toaster />
    </div>
  );
}
