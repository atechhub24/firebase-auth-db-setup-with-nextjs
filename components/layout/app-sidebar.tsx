"use client";

import { BarChart3, LogOut } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
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
import { useMenuItems } from "@/hooks/use-menu-items";
import type { UserRole } from "@/lib/types/user.type";

const today = new Date().toLocaleDateString();

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const logoVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const logoutVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function AppSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const role = params.role as UserRole;
  const { navigationItems, settingsItems } = useMenuItems();

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
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-2 px-4 py-2"
        >
          <motion.div
            variants={logoVariants}
            initial="hidden"
            animate="visible"
            className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
          >
            <BarChart3 className="size-4" />
          </motion.div>
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
        </motion.div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-1"
              >
                {navigationItems
                  .filter((item) => item.roles.includes(role))
                  .map((item) => {
                    const href = `/${role}${item.url}`;
                    const isActive = pathname.startsWith(href);

                    return (
                      <motion.div
                        key={item.title}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            tooltip={item.title}
                            className="group relative transition-all duration-200 hover:bg-sidebar-accent/80 hover:shadow-md"
                          >
                            <Link
                              href={href}
                              className="flex items-center gap-3"
                            >
                              <motion.div
                                className={`flex items-center justify-center rounded-lg p-1.5 transition-all duration-200 ${
                                  isActive
                                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                                    : "bg-sidebar-accent/50 text-sidebar-foreground/70 group-hover:bg-sidebar-accent group-hover:text-sidebar-accent-foreground"
                                }`}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                              >
                                <item.icon className="size-4" />
                              </motion.div>
                              <span className="font-medium">{item.title}</span>
                              {isActive && (
                                <motion.div
                                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary shadow-sm"
                                  layoutId="activeIndicator"
                                  transition={{
                                    type: "spring",
                                    stiffness: 380,
                                    damping: 30,
                                  }}
                                />
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </motion.div>
                    );
                  })}
              </motion.div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-0 my-2" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-1"
              >
                {settingsItems.map((item) => {
                  const href = `/${role}${item.url}`;
                  const isActive = pathname === href;

                  return (
                    <motion.div
                      key={item.title}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={item.title}
                          className="group relative transition-all duration-200 hover:bg-sidebar-accent/80 hover:shadow-md"
                        >
                          <Link href={href} className="flex items-center gap-3">
                            <motion.div
                              className={`flex items-center justify-center rounded-lg p-1.5 transition-all duration-200 ${
                                isActive
                                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                                  : "bg-sidebar-accent/50 text-sidebar-foreground/70 group-hover:bg-sidebar-accent group-hover:text-sidebar-accent-foreground"
                              }`}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <item.icon className="size-4" />
                            </motion.div>
                            <span className="font-medium">{item.title}</span>
                            {isActive && (
                              <motion.div
                                className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary shadow-sm"
                                layoutId="activeIndicator"
                                transition={{
                                  type: "spring",
                                  stiffness: 380,
                                  damping: 30,
                                }}
                              />
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </motion.div>
                  );
                })}
              </motion.div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <motion.div
            variants={logoutVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                tooltip="Logout"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 transition-all duration-200"
              >
                <LogOut className="transition-transform duration-200 group-hover:scale-110" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </motion.div>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
