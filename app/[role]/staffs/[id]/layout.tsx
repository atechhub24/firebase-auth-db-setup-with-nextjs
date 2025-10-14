import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staff Details",
  description: "View and manage staff details.",
};

export default function StaffDetailsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
