"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Star } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { useMemo } from "react";

export function Highlight({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "bg-primary/10 p-1 py-0.5 font-bold text-primary",
        className
      )}
    >
      {children}
    </span>
  );
}

export interface TestimonialCardProps {
  name: string;
  role: string;
  img?: string;
  description: React.ReactNode;
  className?: string;
}

export type TestimonialItem = Omit<TestimonialCardProps, "className">;

export interface TestimonialsMarqueeProps {
  testimonials?: TestimonialItem[];
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export function TestimonialCard({
  description,
  name,
  img,
  role,
  className,
  ...props // Capture the rest of the props
}: TestimonialCardProps) {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        "mb-4 flex w-full cursor-pointer break-inside-avoid flex-col items-center justify-between gap-6 rounded-xl p-4",
        // theme styles
        "border-border bg-card/50 border shadow-sm",
        // hover effect
        "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
      {...props}
    >
      <div className="text-muted-foreground text-sm font-normal select-none">
        {description}
        <div className="flex flex-row py-1">
          <Star className="size-4 fill-primary text-primary" />
          <Star className="size-4 fill-primary text-primary" />
          <Star className="size-4 fill-primary text-primary" />
          <Star className="size-4 fill-primary text-primary" />
          <Star className="size-4 fill-primary text-primary" />
        </div>
      </div>

      <div className="flex w-full items-center justify-start gap-5 select-none">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20 ring-offset-2 text-sm font-semibold text-primary">
          {initials}
        </div>

        <div>
          <p className="text-foreground font-medium">{name}</p>
          <p className="text-muted-foreground text-xs font-normal">{role}</p>
        </div>
      </div>
    </div>
  );
}
export function TestimonialsMarquee({
  testimonials,
}: TestimonialsMarqueeProps) {
  const columnKeys = useMemo(
    () =>
      Array.from(
        { length: Math.ceil((testimonials?.length ?? 0) / 3) },
        (_, i) => `marquee-column-${i}`
      ),
    [testimonials?.length]
  );

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonials"
      className="w-full overflow-hidden bg-muted/30 py-20"
    >
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Decorative elements */}
        <div className="absolute top-20 -left-20 z-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-20 bottom-20 z-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Don&apos;t just take our word for it. Here&apos;s what our valued
            customers have to say about their jewelry shopping experience with
            us.
          </p>
        </motion.div>

        <div className="relative max-h-[800px] overflow-hidden">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {columnKeys.map((key, i) => (
              <div key={key} className="h-[800px] overflow-hidden">
                <Marquee
                  vertical
                  repeat={3}
                  pauseOnHover
                  className={cn("h-full", {
                    "[--duration:60s]": i === 1,
                    "[--duration:30s]": i === 2,
                    "[--duration:70s]": i === 3,
                    "[--duration:50s]": i === 0,
                  })}
                >
                  {(testimonials ?? [])
                    .slice(i * 3, (i + 1) * 3)
                    .map((card) => (
                      <motion.div
                        key={card.name}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: Math.random() * 0.8,
                          duration: 1.2,
                        }}
                      >
                        <TestimonialCard {...card} />
                      </motion.div>
                    ))}
                </Marquee>
              </div>
            ))}
          </div>
          <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 w-full bg-gradient-to-t from-20%"></div>
          <div className="from-background pointer-events-none absolute inset-x-0 top-0 h-1/4 w-full bg-gradient-to-b from-20%"></div>
        </div>
      </div>
    </section>
  );
}
