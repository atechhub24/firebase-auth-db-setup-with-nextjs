"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import type { UserRole } from "@/lib/types/user.type";
import { BarChart3, Home, LogOut, Settings, Users2Icon } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";

const today = new Date().toLocaleDateString();

type NavigationItem = {
  title: string;
  url: string;
  icon: React.ElementType;
  roles: UserRole[];
};

// Navigation items
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

export function AppSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const role = params.role as UserRole;

  const handleLogout = async () => {
    try {
      // Import firebaseAuth dynamically to avoid SSR issues
      const { firebaseAuth } = await import("@atechhub/firebase");
      await firebaseAuth({
        action: "logout",
      });
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <BarChart3 className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold capitalize">
              {role} Panel
            </span>
            <span
              className="truncate text-xs text-sidebar-foreground/70 capitalize"
              suppressHydrationWarning
            >
              {today}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems
                .filter((item) => item.roles.includes(role))
                .map((item) => {
                  const href = `/${role}${item.url}`;
                  const isActive = pathname.startsWith(href);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link href={href}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-0" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => {
                const href = `/${role}${item.url}`;
                const isActive = pathname === href;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Logout"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
