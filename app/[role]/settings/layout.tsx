import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Configure application settings and preferences.",
};

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
