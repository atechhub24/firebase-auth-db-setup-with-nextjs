"use client";

import { ProfileDropdown } from "@/components/core/profile-dropdown";
import { ThemeToggle } from "@/components/core/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useParams } from "next/navigation";

export function AppHeader() {
  const params = useParams();
  const role = params.role as string;

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      {/* Left side - Sidebar trigger and breadcrumbs */}
      <div className="flex items-center gap-2 flex-1">
        <SidebarTrigger className="-ml-1" />
        <div className="text-lg font-semibold capitalize">{role} Panel</div>
      </div>

      {/* Right side - Actions and profile */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <ProfileDropdown />
      </div>
    </header>
  );
}
