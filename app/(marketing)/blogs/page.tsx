"use client";

import { useEffect, useState, useMemo } from "react";
import { blogService } from "@/lib/services/blog.service";
import type { Blog } from "@/lib/types/blog.type";
import { BlogCard } from "./_components/blog-card";
import { BlogFilters } from "./_components/blog-filters";
import { BlogSortControls } from "./_components/blog-sort-controls";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  useQueryState,
  parseAsArrayOf,
  parseAsString,
  parseAsBoolean,
} from "nuqs";
import { motion, AnimatePresence } from "motion/react";
import { staggerContainer, scaleIn } from "@/lib/utils/motion-variants";
import { BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useQueryState(
    "search",
    parseAsString.withDefault(""),
  );
  const [selectedCategories] = useQueryState(
    "categories",
    parseAsArrayOf(parseAsString).withDefault([]),
  );
  const [selectedTags] = useQueryState(
    "tags",
    parseAsArrayOf(parseAsString).withDefault([]),
  );
  const [selectedAuthor] = useQueryState(
    "author",
    parseAsString.withDefault("all"),
  );
  const [showFeaturedOnly] = useQueryState(
    "featured",
    parseAsBoolean.withDefault(false),
  );
  const [sortOption] = useQueryState(
    "sort",
    parseAsString.withDefault("new-first"),
  );
  const [viewMode] = useQueryState("view", parseAsString.withDefault("grid"));

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await blogService.getPublished();
      setBlogs(data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filter and sort blogs
  const filteredBlogs = useMemo(() => {
    let filtered = blogs.filter((blog) => {
      // Search filter
      const matchesSearch =
        !searchTerm ||
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      // Category filter
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(blog.category);

      // Tag filter
      const matchesTag =
        selectedTags.length === 0 ||
        blog.tags?.some((tag) => selectedTags.includes(tag));

      // Author filter
      const matchesAuthor =
        selectedAuthor === "all" || blog.author === selectedAuthor;

      // Featured filter
      const matchesFeatured = !showFeaturedOnly || blog.featured;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesTag &&
        matchesAuthor &&
        matchesFeatured
      );
    });

    // Sort blogs
    filtered = [...filtered].sort((a, b) => {
      if (sortOption === "new-first") {
        const aTime =
          a.publishedAt ||
          (typeof a.createdAt === "string"
            ? new Date(a.createdAt).getTime()
            : 0);
        const bTime =
          b.publishedAt ||
          (typeof b.createdAt === "string"
            ? new Date(b.createdAt).getTime()
            : 0);
        return bTime - aTime;
      } else if (sortOption === "old-first") {
        const aTime =
          a.publishedAt ||
          (typeof a.createdAt === "string"
            ? new Date(a.createdAt).getTime()
            : 0);
        const bTime =
          b.publishedAt ||
          (typeof b.createdAt === "string"
            ? new Date(b.createdAt).getTime()
            : 0);
        return aTime - bTime;
      } else if (sortOption === "a-z") {
        return a.title.localeCompare(b.title);
      } else if (sortOption === "z-a") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

    return filtered;
  }, [
    blogs,
    searchTerm,
    selectedCategories,
    selectedTags,
    selectedAuthor,
    showFeaturedOnly,
    sortOption,
  ]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-8">
        {/* Header Skeletons */}
        <div className="space-y-4">
          <Skeleton className="h-12 w-64 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        {/* Content Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Skeleton className="h-64" />
          <div className="lg:col-span-3 space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border-2 border-destructive/50 bg-destructive/10 p-8 text-center"
        >
          <h3 className="text-lg font-semibold text-destructive mb-2">Error</h3>
          <p className="text-muted-foreground">{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="container mx-auto p-4 md:p-6 space-y-8 max-w-7xl"
    >
      {/* Hero Header with Animated Glow */}
      <motion.div variants={scaleIn} className="text-center space-y-4">
        <div className="relative inline-block">
          {/* Animated glow background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent rounded-full blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          {/* Title with gradient text */}
          <motion.h1
            className="relative text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Blog
          </motion.h1>
        </div>
        {/* Subtitle with fade-in */}
        <motion.p
          className="text-muted-foreground text-lg md:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Discover our latest articles and insights
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <BlogFilters blogs={blogs} />
        </motion.div>

        {/* Blog List */}
        <motion.div
          className="lg:col-span-3 space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          {/* Search, Sort, and View Controls in One Row */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-lg border-2 border-border/50 bg-card/50 backdrop-blur-sm shadow-sm"
          >
            {/* Search Bar */}
            <div className="relative flex-1 min-w-0">
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value || null)}
                  className="h-9 pl-9 pr-3 text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-300 placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Sort and View Controls */}
            <BlogSortControls />
          </motion.div>

          <AnimatePresence mode="popLayout">
            {filteredBlogs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border/50 bg-muted/30 p-12 text-center"
              >
                {/* Animated Icon */}
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="inline-block mb-4"
                >
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">No blogs found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter terms.
                </p>
              </motion.div>
            ) : (
              <motion.div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-6"
                }
                layout
              >
                {filteredBlogs.map((blog, index) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <BlogCard blog={blog} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
