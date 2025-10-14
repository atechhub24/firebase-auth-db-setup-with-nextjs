import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Staff",
  description: "Add a new staff to the system.",
};

export default function CreateStaffLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
