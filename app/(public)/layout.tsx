import { Footer } from "@/components/public/Footer";
import { Navbar } from "@/components/public/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { getSearchIndex } from "@/lib/queries/search";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchIndex = await getSearchIndex();

  return (
    <>
      <Navbar searchIndex={searchIndex} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <Toaster />
    </>
  );
}
