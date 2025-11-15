"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { X, Database, Settings, Image, FileCode, ExternalLink, LogIn, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/core/theme-toggle";
import type { MarketingSite } from "@/lib/marketing-config";
import { cn } from "@/lib/utils";

const iconMap = {
  Database,
  Settings,
  Image,
  FileCode,
} as const;

type MegaMenuItem = MarketingSite["megaMenu"][number]["items"][number];

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  navLinks: Array<{ label: string; href: string }>;
  resourcesItems: MegaMenuItem[];
  toggleTheme: () => void;
}

export function MobileMenu({
  open,
  onClose,
  navLinks,
  resourcesItems,
  toggleTheme,
}: MobileMenuProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[45] bg-black/60 backdrop-blur-md md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-y-0 right-0 z-[50] w-full max-w-sm bg-white dark:bg-gray-950 shadow-xl border-l border-gray-200 dark:border-gray-800 md:hidden overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4">
                <span className="text-base font-semibold text-gray-900 dark:text-gray-100">Menu</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link, index) => {
                    if (link.href === "#resources") {
                      return (
                        <Accordion
                          key={link.href}
                          type="single"
                          collapsible
                          className="w-full"
                        >
                          <AccordionItem value="resources" className="border-none">
                            <AccordionTrigger className="py-3 text-sm font-medium text-gray-900 dark:text-gray-100 hover:no-underline">
                              {link.label}
                            </AccordionTrigger>
                            <AccordionContent className="pb-2">
                              <div className="flex flex-col gap-2 pl-4">
                                {resourcesItems.map((item, itemIndex) => {
                                  const Icon =
                                    iconMap[item.icon as keyof typeof iconMap];
                                  const isExternal = item.href.startsWith("http");

                                  return (
                                    <motion.div
                                      key={item.href}
                                      initial={{ opacity: 0, x: -12 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{
                                        delay: itemIndex * 0.05,
                                        duration: 0.2,
                                      }}
                                    >
                                      <Link
                                        href={item.href}
                                        target={isExternal ? "_blank" : undefined}
                                        rel={
                                          isExternal
                                            ? "noopener noreferrer"
                                            : undefined
                                        }
                                        onClick={onClose}
                                        className={cn(
                                          "group flex items-start gap-3 rounded-md p-3 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm",
                                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                                        )}
                                      >
                                        {Icon && (
                                          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50">
                                            <Icon className="size-4" />
                                          </div>
                                        )}
                                        <div className="flex flex-1 flex-col gap-1">
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                              {item.label}
                                            </span>
                                            {item.featured && (
                                              <Badge
                                                variant="secondary"
                                                className="h-4 px-1.5 text-[10px] font-medium"
                                              >
                                                Popular
                                              </Badge>
                                            )}
                                            {isExternal && (
                                              <ExternalLink className="size-3 shrink-0 text-gray-400 dark:text-gray-500 opacity-0 transition-opacity group-hover:opacity-100" />
                                            )}
                                          </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                              {item.description}
                                            </p>
                                        </div>
                                      </Link>
                                    </motion.div>
                                  );
                                })}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      );
                    }

                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: index * 0.05,
                          duration: 0.2,
                        }}
                      >
                        <Link
                          href={link.href}
                          onClick={onClose}
                          className="block rounded-md px-3 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-3">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <div className="pointer-events-none">
                    <ThemeToggle />
                  </div>
                  <span>Toggle theme</span>
                </button>
                <Button variant="outline" className="w-full" asChild>
                  <Link
                    href="/signin"
                    className="flex items-center justify-center gap-2"
                    onClick={onClose}
                  >
                    <LogIn className="size-4" />
                    Sign in
                  </Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link
                    href="/signup"
                    className="flex items-center justify-center gap-2"
                    onClick={onClose}
                  >
                    Get started
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

