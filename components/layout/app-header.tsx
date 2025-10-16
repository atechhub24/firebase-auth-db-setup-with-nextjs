"use client";

import { ProfileDropdown } from "@/components/core/profile-dropdown";
import { ThemeToggle } from "@/components/core/theme-toggle";
import { CommandPalette } from "@/components/core/command-palette";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useMenuItems } from "@/hooks/use-menu-items";
import type { UserRole } from "@/lib/types/user.type";
import { useParams } from "next/navigation";

export function AppHeader() {
  const params = useParams();
  const role = params.role as UserRole;
  const { navigationItems, settingsItems } = useMenuItems();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      {/* Left side - Sidebar trigger, breadcrumbs, and command palette */}
      <div className="flex items-center gap-2 flex-1">
        <SidebarTrigger className="-ml-1" />
        <CommandPalette
          role={role}
          navigationItems={navigationItems}
          settingsItems={settingsItems}
        />
      </div>

      {/* Right side - Actions and profile */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <ProfileDropdown />
      </div>
    </header>
  );
}
