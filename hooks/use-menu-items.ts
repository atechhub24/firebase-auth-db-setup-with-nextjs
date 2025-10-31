import { Home, Settings, Users2Icon, Clock } from "lucide-react";
import type { UserRole } from "@/lib/types/user.type";

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
    {
      title: "Attendance",
      url: "/attendance",
      icon: Clock,
      roles: ["admin", "staff"],
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
