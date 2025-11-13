import type { Metadata } from "next";
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
  return <>{children}</>;
}
