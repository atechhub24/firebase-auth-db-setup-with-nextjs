import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staffs",
  description: "Manage staff information and settings.",
};

export default function StaffsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
