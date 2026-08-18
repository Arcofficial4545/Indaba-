import { LogOutIcon } from "lucide-react";

import { signOut } from "@/app/(admin)/admin/actions";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-white/55 transition-colors hover:bg-[var(--sidebar-accent)] hover:text-white focus-visible:ring-2 focus-visible:ring-[var(--sidebar-ring)] focus-visible:outline-none"
      >
        <LogOutIcon className="size-4 shrink-0" aria-hidden="true" />
        Sign out
      </button>
    </form>
  );
}
