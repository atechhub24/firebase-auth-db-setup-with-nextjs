import type { Metadata } from "next";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingNavbar } from "@/components/layout/marketing-navbar";
import { marketingSite } from "@/lib/marketing-config";

const ogImageUrl = new URL(
  "/opengraph-image",
  marketingSite.url.endsWith("/") ? marketingSite.url : `${marketingSite.url}/`
).toString();

export const metadata: Metadata = {
  title: {
    default: marketingSite.title,
    template: `%s | ${marketingSite.title}`,
  },
  description: marketingSite.description,
  openGraph: {
    title: marketingSite.title,
    description: marketingSite.description,
    url: marketingSite.url,
    siteName: marketingSite.name,
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: marketingSite.title,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: marketingSite.title,
    description: marketingSite.description,
    images: [ogImageUrl],
  },
  metadataBase: new URL(marketingSite.url),
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <MarketingNavbar />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}
