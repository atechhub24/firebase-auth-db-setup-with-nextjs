"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MinusIcon, PlusIcon } from "lucide-react";
import type { FaqItem, FaqConfig, FaqCategory } from "@/lib/config/faq";

const categories = [
  { id: "all", label: "All" },
  { id: "general", label: "General" },
  { id: "technical", label: "Technical" },
  { id: "pricing", label: "Pricing" },
  { id: "support", label: "Support" },
];

export interface FaqProps {
  faqItems?: FaqItem[];
  config?: FaqConfig;
}

export function Faq({ faqItems: items, config }: FaqProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFaqs = useMemo(() => {
    if (!items || items.length === 0) return [];
    return activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  const availableCategories = useMemo(() => {
    if (!items || items.length === 0) return [];
    const cats = new Set(items.map((item) => item.category));
    return categories.filter(
      (cat) => cat.id === "all" || cats.has(cat.id as FaqCategory)
    );
  }, [items]);

  if (!items || items.length === 0) {
    return null;
  }

  const faqTitle = config?.title || "Frequently Asked Questions";
  const faqDescription =
    config?.description || "Find answers to common questions.";
  const contactText =
    config?.contactText || "Can't find what you're looking for?";
  const contactLink = config?.contactLink || "#contact";

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="bg-background py-20">
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-center">
          <Badge
            variant="outline"
            className="border-primary mb-4 px-3 py-1 text-xs font-medium tracking-wider uppercase"
          >
            FAQs
          </Badge>

          <h2 className="text-foreground mb-6 text-center text-4xl font-bold tracking-tight md:text-5xl">
            {faqTitle}
          </h2>

          <p className="text-muted-foreground max-w-2xl text-center">
            {faqDescription}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {availableCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all",
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <AnimatePresence>
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  "border-border h-fit overflow-hidden rounded-xl border",
                  expandedId === faq.id ? "shadow-3xl bg-card/50" : "bg-card/50"
                )}
                style={{ minHeight: "88px" }}
              >
                <button
                  type="button"
                  onClick={() => toggleExpand(faq.id)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <h3 className="text-foreground text-lg font-medium">
                    {faq.question}
                  </h3>
                  <div className="ml-4 flex-shrink-0">
                    {expandedId === faq.id ? (
                      <MinusIcon className="text-primary h-5 w-5" />
                    ) : (
                      <PlusIcon className="text-primary h-5 w-5" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {expandedId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-border border-t px-6 pt-2 pb-6">
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-4">{contactText}</p>
          <a
            href={contactLink}
            className="border-primary text-foreground hover:bg-primary hover:text-primary-foreground inline-flex items-center justify-center rounded-lg border-2 px-6 py-3 font-medium transition-colors"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </section>
  );
}
