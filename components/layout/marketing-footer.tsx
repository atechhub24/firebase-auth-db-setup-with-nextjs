"use client";

import Link from "next/link";
import { marketingSite } from "@/lib/config/marketing";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import {
  Twitter,
  Github,
  Linkedin,
  Youtube,
  Facebook,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";

export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/40">
      <motion.div
        className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="space-y-2">
          <p className="text-base font-semibold text-foreground">
            {marketingSite.title}
          </p>
          <p>
            © {year} {marketingSite.domain}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2">
              <Phone className="size-4" />
              {marketingSite.contactPhone}
            </span>
            <Link
              href={`mailto:${marketingSite.contactEmail}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
            >
              <Mail className="size-4" />
              {marketingSite.contactEmail}
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-sm md:items-end">
          <Button variant="secondary" asChild size="sm">
            <Link href="/signup" className="flex items-center gap-2">
              Start your project
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <nav className="flex items-center gap-4 text-muted-foreground">
            <Link
              href={marketingSite.social.twitter}
              className="transition-colors hover:text-foreground"
            >
              <span className="sr-only">Twitter</span>
              <Twitter className="size-4" />
            </Link>
            <Link
              href={marketingSite.social.github}
              className="transition-colors hover:text-foreground"
            >
              <span className="sr-only">GitHub</span>
              <Github className="size-4" />
            </Link>
            <Link
              href={marketingSite.social.linkedin}
              className="transition-colors hover:text-foreground"
            >
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="size-4" />
            </Link>
            <Link
              href={marketingSite.social.youtube}
              className="transition-colors hover:text-foreground"
            >
              <span className="sr-only">YouTube</span>
              <Youtube className="size-4" />
            </Link>
            <Link
              href={marketingSite.social.facebook}
              className="transition-colors hover:text-foreground"
            >
              <span className="sr-only">Facebook</span>
              <Facebook className="size-4" />
            </Link>
          </nav>
        </div>
      </motion.div>
    </footer>
  );
}
