import type { UserRole } from "@/lib/types/user.type";
import { BarChart3, Home, Settings, Users2Icon } from "lucide-react";

export type NavigationItem = {
  title: string;
  url: string;
  icon: React.ElementType;
  roles: UserRole[];
};

export function useMenuItems() {
  const navigationItems: NavigationItem[] = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      roles: ["admin", "staff"],
    },
    {
      title: "Staffs",
      url: "/staffs",
      icon: Users2Icon,
      roles: ["admin"],
    },
  ];

  const settingsItems = [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ];

  return {
    navigationItems,
    settingsItems,
  };
}
