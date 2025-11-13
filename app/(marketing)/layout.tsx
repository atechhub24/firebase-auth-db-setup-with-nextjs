import type { Metadata } from "next";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingNavbar } from "@/components/layout/marketing-navbar";
import { marketingSite } from "@/lib/marketing-config";

export const metadata: Metadata = {
  title: marketingSite.title,
  description: marketingSite.description,
  openGraph: {
    title: marketingSite.title,
    description: marketingSite.description,
    url: marketingSite.url,
    siteName: marketingSite.name,
    type: "website",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingNavbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
}
