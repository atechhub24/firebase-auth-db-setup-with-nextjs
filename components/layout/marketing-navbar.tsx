"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { marketingSite } from "@/lib/marketing-config";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/core/theme-toggle";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, ArrowRight, LogIn } from "lucide-react";

const marketingNavLinks = [
  { label: "Home", href: "/" },
  { label: "Blogs", href: "/blogs" },
  { label: "Resources", href: "#resources" },
] as const;

export function MarketingNavbar() {
  const [open, setOpen] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggleMenu = () => setOpen((prev) => !prev);

  const toggleTheme = () => {
    const current = resolvedTheme || theme;
    setTheme(current === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-base font-semibold tracking-tight">
          {marketingSite.title}
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {marketingNavLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
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

      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              className="fixed inset-x-0 top-16 bottom-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              className="fixed inset-x-4 top-24 z-40 rounded-lg border bg-card p-6 shadow-lg md:hidden"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-col gap-4 text-sm">
                {marketingNavLinks.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.05 * index,
                      duration: 0.2,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href={item.href}
                      className="block rounded-md px-3 py-2 transition-colors hover:bg-muted"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-6 flex flex-col gap-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.2 }}
              >
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <div className="pointer-events-none">
                    <ThemeToggle />
                  </div>
                  <span>Toggle theme</span>
                </button>
                <Button variant="outline" asChild>
                  <Link
                    href="/signin"
                    className="flex items-center justify-center gap-2"
                    onClick={() => setOpen(false)}
                  >
                    <LogIn className="size-4" />
                    Sign in
                  </Link>
                </Button>
                <Button asChild>
                  <Link
                    href="/signup"
                    className="flex items-center justify-center gap-2"
                    onClick={() => setOpen(false)}
                  >
                    Get started
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
