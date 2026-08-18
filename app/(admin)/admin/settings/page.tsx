import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/AdminShell";
import { GlossyButton } from "@/components/public/GlossyButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/server";
import { saveSettings } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Settings | Admin",
  robots: { index: false, follow: false },
};

/**
 * Site settings live in a key value table so they can change without a deploy.
 * Only the keys listed here are rendered or written, which keeps the same
 * whitelist discipline the resource registry uses.
 */
const SETTINGS = [
  { key: "site_announcement", label: "Announcement banner", help: "Shown across the top of the public site. Leave empty for none." },
  { key: "adsense_account", label: "AdSense account ID", help: "For example ca-pub-0000000000000000" },
  { key: "google_site_verification", label: "Google site verification", help: "The content value of the verification meta tag." },
  { key: "contact_email", label: "Contact email override" },
  { key: "contact_phone", label: "Contact phone override" },
];

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const rows = supabase
    ? ((await supabase.from("site_settings").select("key, value")).data ?? [])
    : [];

  const values = new Map(
    rows.map((row) => [String(row.key), String(row.value ?? "")]),
  );

  return (
    <AdminShell
      title="Settings"
      description="Values that can change without a deploy"
    >
      <form action={saveSettings} className="flex max-w-2xl flex-col gap-6">
        <div className="card-modern flex flex-col gap-5 p-6">
          {SETTINGS.map((setting) => (
            <div key={setting.key} className="flex flex-col gap-2">
              <Label htmlFor={setting.key}>{setting.label}</Label>
              <Input
                id={setting.key}
                name={setting.key}
                defaultValue={values.get(setting.key) ?? ""}
              />
              {setting.help && (
                <p className="text-xs text-muted-foreground">{setting.help}</p>
              )}
            </div>
          ))}
        </div>

        <div>
          <GlossyButton size="lg">Save settings</GlossyButton>
        </div>
      </form>

      <p className="mt-8 max-w-2xl text-xs leading-relaxed text-muted-foreground">
        Anything secret belongs in environment variables rather than here. This
        table is readable by anonymous visitors, because the public site reads
        the announcement banner from it.
      </p>
    </AdminShell>
  );
}
