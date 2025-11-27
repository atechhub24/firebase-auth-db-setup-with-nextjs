"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "next-themes";
import { marketingSite } from "@/lib/marketing-config";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/core/theme-toggle";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, ArrowRight, LogIn } from "lucide-react";
import { MegaMenu } from "@/components/layout/mega-menu";
import { MobileMenu } from "@/components/layout/mobile-menu";

const marketingNavLinks = [
  { label: "Home", href: "/" },
  { label: "Blogs", href: "/blogs" },
  { label: "Resources", href: "#resources" },
] as const;

export function MarketingNavbar() {
  const [open, setOpen] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  const toggleMenu = () => setOpen((prev) => !prev);

  const toggleTheme = () => {
    const current = resolvedTheme || theme;
    setTheme(current === "dark" ? "light" : "dark");
  };

  const resourcesMenu = marketingSite.megaMenu[0];
  const simpleNavLinks = marketingNavLinks.filter(
    (link) => link.href !== "#resources"
  );

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-base font-semibold tracking-tight">
            {marketingSite.title}
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            {simpleNavLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <MegaMenu
              label={resourcesMenu.label}
              href={resourcesMenu.href}
              items={resourcesMenu.items}
            />
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/signin" className="flex items-center gap-1">
                <LogIn className="size-4" />
                Sign in
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup" className="flex items-center gap-1">
                Get started
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                >
                  <X className="size-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                >
                  <Menu className="size-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </header>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        navLinks={marketingNavLinks}
        resourcesItems={resourcesMenu.items}
        toggleTheme={toggleTheme}
      />
    </>
  );
}
