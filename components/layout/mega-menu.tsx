"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  Settings,
  Image,
  FileCode,
  ExternalLink,
} from "lucide-react";
import type { MarketingSite } from "@/lib/marketing-config";
import { cn } from "@/lib/utils";

const iconMap = {
  Database,
  Settings,
  Image,
  FileCode,
} as const;

type MegaMenuItem = MarketingSite["megaMenu"][number]["items"][number];

interface MegaMenuContentProps {
  items: readonly MegaMenuItem[];
}

function MegaMenuContent({ items }: MegaMenuContentProps) {
  return (
    <div className="w-[600px] p-4">
      <div className="grid grid-cols-2 gap-4">
        {items.map((item, index) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isExternal = item.href.startsWith("http");

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
            >
              <NavigationMenuLink asChild>
                <Link
                  href={item.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className={cn(
                    "group flex flex-col gap-2 rounded-lg border border-transparent bg-card p-4 transition-all",
                    "hover:border-border hover:bg-accent/50 hover:shadow-sm",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {Icon && (
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                          <Icon className="size-5" />
                        </div>
                      )}
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold leading-none">
                            {item.label}
                          </span>
                          {item.featured && (
                            <Badge
                              variant="secondary"
                              className="h-5 px-1.5 text-[10px] font-medium shrink-0"
                            >
                              Popular
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    {isExternal && (
                      <ExternalLink className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 mt-1" />
                    )}
                  </div>
                </Link>
              </NavigationMenuLink>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

interface MegaMenuProps {
  label: string;
  href: string;
  items: readonly MegaMenuItem[];
}

export function MegaMenu({ label, href, items }: MegaMenuProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            {label}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <MegaMenuContent items={items} />
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
