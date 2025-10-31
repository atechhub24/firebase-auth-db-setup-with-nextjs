"use client";

import { useEffect, useState, useMemo } from "react";
import { blogService } from "@/lib/services/blog.service";
import type { Blog } from "@/lib/types/blog.type";
import { BlogCard } from "./_components/blog-card";
import { BlogFilters } from "./_components/blog-filters";
import { BlogSortControls } from "./_components/blog-sort-controls";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { motion } from "motion/react";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );
  const [selectedCategories] = useQueryState(
    "categories",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [selectedTags] = useQueryState(
    "tags",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [sortOption] = useQueryState(
    "sort",
    parseAsString.withDefault("new-first")
  );
  const [viewMode] = useQueryState(
    "view",
    parseAsString.withDefault("grid")
  );

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
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Category filter
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(blog.category);

      // Tag filter
      const matchesTag =
        selectedTags.length === 0 ||
        blog.tags?.some((tag) => selectedTags.includes(tag));

      return matchesSearch && matchesCategory && matchesTag;
    });

    // Sort blogs
    filtered = [...filtered].sort((a, b) => {
      if (sortOption === "new-first") {
        const aTime = a.publishedAt || (typeof a.createdAt === "string" ? new Date(a.createdAt).getTime() : 0);
        const bTime = b.publishedAt || (typeof b.createdAt === "string" ? new Date(b.createdAt).getTime() : 0);
        return bTime - aTime;
      } else if (sortOption === "old-first") {
        const aTime = a.publishedAt || (typeof a.createdAt === "string" ? new Date(a.createdAt).getTime() : 0);
        const bTime = b.publishedAt || (typeof b.createdAt === "string" ? new Date(b.createdAt).getTime() : 0);
        return aTime - bTime;
      } else if (sortOption === "a-z") {
        return a.title.localeCompare(b.title);
      } else if (sortOption === "z-a") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

    return filtered;
  }, [blogs, searchTerm, selectedCategories, selectedTags, sortOption]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="text-muted-foreground">
          Discover our latest articles and insights
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <BlogFilters blogs={blogs} />
        </div>

        {/* Blog List */}
        <div className="lg:col-span-3 space-y-4">
          <BlogSortControls />

          {filteredBlogs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No blogs found</p>
              </CardContent>
            </Card>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                  : "space-y-4"
              }
            >
              {filteredBlogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <BlogCard blog={blog} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

