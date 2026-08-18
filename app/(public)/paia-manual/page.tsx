import type { Metadata } from "next";

import { LegalPage, legalMetadata } from "@/components/public/LegalPage";

const SLUG = "paia-manual";

export const revalidate = 3600;

export function generateMetadata(): Promise<Metadata> {
  return legalMetadata(SLUG);
}

export default function Page() {
  return <LegalPage slug={SLUG} />;
}
