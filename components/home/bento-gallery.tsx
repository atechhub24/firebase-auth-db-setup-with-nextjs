"use client";

import { X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type BentoGalleryItem = {
  id: number | string;
  title: string;
  desc: string;
  url: string;
  span?: string;
};

export interface BentoGalleryProps {
  imageItems: BentoGalleryItem[];
  title: string;
  description: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, easing: "ease-out" },
  },
};

const ImageModal = ({
  item,
  onClose,
}: {
  item: BentoGalleryItem;
  onClose: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={item.url}
          alt={item.title}
          width={1600}
          height={900}
          className="h-auto max-h-[90vh] w-full rounded-lg object-contain"
        />
      </motion.div>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 text-white/80 transition-colors hover:text-white"
        aria-label="Close image view"
      >
        <X size={24} />
      </button>
    </motion.div>
  );
};

export function BentoGallery({
  imageItems,
  title,
  description,
}: BentoGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<BentoGalleryItem | null>(
    null
  );
  const [isPaused, setIsPaused] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const topItems = useMemo(
    () => imageItems.filter((_, i) => i % 2 === 0),
    [imageItems]
  );
  const bottomItems = useMemo(
    () => imageItems.filter((_, i) => i % 2 === 1),
    [imageItems]
  );

  // Duplicate items multiple times for seamless infinite scroll
  // Using 3 copies ensures items are always visible and creates seamless loop
  const duplicatedTopItems = useMemo(
    () => [...topItems, ...topItems, ...topItems],
    [topItems]
  );
  const duplicatedBottomItems = useMemo(
    () => [...bottomItems, ...bottomItems, ...bottomItems],
    [bottomItems]
  );

  useEffect(() => {
    const speedPxPerFrame = 0.7;
    let rafIdTop: number;
    let rafIdBottom: number;

    // Initialize scroll positions after items are rendered
    // Wait for next frame to ensure DOM is ready
    const initScroll = () => {
      // Top row starts at 0 (showing first items)
      if (topRef.current) {
        topRef.current.scrollLeft = 0;
      }

      // Bottom row starts showing items from the middle set for seamless loop
      if (bottomRef.current) {
        const container = bottomRef.current;
        const itemWidth = container.scrollWidth / duplicatedBottomItems.length;
        const startPosition = itemWidth * bottomItems.length;
        container.scrollLeft = startPosition;
      }
    };

    // Use setTimeout to ensure DOM is fully rendered
    const timeoutId = setTimeout(initScroll, 0);

    const tickTop = () => {
      const container = topRef.current;
      if (container && !isPaused) {
        const itemWidth = container.scrollWidth / duplicatedTopItems.length;
        const maxScroll = itemWidth * topItems.length;

        if (container.scrollLeft >= maxScroll - 1) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += speedPxPerFrame;
        }
      }
      rafIdTop = requestAnimationFrame(tickTop);
    };

    const tickBottom = () => {
      const container = bottomRef.current;
      if (container && !isPaused) {
        const itemWidth = container.scrollWidth / duplicatedBottomItems.length;
        const maxScroll = itemWidth * bottomItems.length;

        if (container.scrollLeft <= 0) {
          container.scrollLeft = maxScroll;
        } else {
          container.scrollLeft -= speedPxPerFrame;
        }
      }
      rafIdBottom = requestAnimationFrame(tickBottom);
    };

    rafIdTop = requestAnimationFrame(tickTop);
    rafIdBottom = requestAnimationFrame(tickBottom);

    return () => {
      cancelAnimationFrame(rafIdTop);
      cancelAnimationFrame(rafIdBottom);
      clearTimeout(timeoutId);
    };
  }, [
    isPaused,
    duplicatedTopItems.length,
    duplicatedBottomItems.length,
    topItems.length,
    bottomItems.length,
  ]);

  return (
    <section className="relative w-full overflow-hidden bg-background py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          {description}
        </p>
      </motion.div>

      <section className="relative mt-12 w-full space-y-4">
        {/* Top row - scrolling left to right */}
        <section
          ref={topRef}
          className="w-full overflow-x-auto no-scrollbar"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          aria-label="Scrolling image gallery row 1"
        >
          <motion.div
            className="flex gap-4 px-4 md:px-8"
            variants={containerVariants}
            initial="visible"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {duplicatedTopItems.map((item, index) => (
              <motion.div
                key={`${item.id}-${index}`}
                variants={itemVariants}
                initial="visible"
                className={cn(
                  "group relative flex h-full min-h-[15rem] w-full min-w-[15rem] cursor-pointer items-end overflow-hidden rounded-xl border bg-card p-4 shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  item.span || "md:min-w-[20rem]"
                )}
                onClick={() => setSelectedItem(item)}
                onKeyDown={(e) => e.key === "Enter" && setSelectedItem(item)}
                tabIndex={0}
                aria-label={`View ${item.title}`}
              >
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 60vw, 33vw"
                  className="absolute inset-0 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-white/80">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Bottom row - scrolling right to left */}
        <section
          ref={bottomRef}
          className="w-full overflow-x-auto no-scrollbar"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          aria-label="Scrolling image gallery row 2"
        >
          <motion.div
            className="flex gap-4 px-4 md:px-8"
            variants={containerVariants}
            initial="visible"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {duplicatedBottomItems.map((item, index) => (
              <motion.div
                key={`${item.id}-${index}`}
                variants={itemVariants}
                initial="visible"
                className={cn(
                  "group relative flex h-full min-h-[15rem] w-full min-w-[15rem] cursor-pointer items-end overflow-hidden rounded-xl border bg-card p-4 shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  item.span || "md:min-w-[20rem]"
                )}
                onClick={() => setSelectedItem(item)}
                onKeyDown={(e) => e.key === "Enter" && setSelectedItem(item)}
                tabIndex={0}
                aria-label={`View ${item.title}`}
              >
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 60vw, 33vw"
                  className="absolute inset-0 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-white/80">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </section>

      {selectedItem && (
        <ImageModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </section>
  );
}
