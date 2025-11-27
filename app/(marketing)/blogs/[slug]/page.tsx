"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useFirebaseRealtime } from "@/hooks/use-firebase-realtime";
import { getRelatedBlogs } from "@/lib/utils/blog-utils";
import type { Blog } from "@/lib/types/blog.type";
import { RichTextRenderer } from "@/components/ui/rich-text-renderer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBlogDate } from "@/lib/utils/blog-utils";
import { Calendar, User, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BlogCard } from "../_components/blog-card";
import { motion, AnimatePresence } from "motion/react";
import { staggerContainer } from "@/lib/utils/motion-variants";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: allBlogsData, loading, error } = useFirebaseRealtime<Blog>(
    "blogs",
    {
      asArray: true,
      filter: (blog) => blog.status === "published",
    },
  );

  const allBlogs = (allBlogsData as Blog[]) || [];

  const blog = useMemo(() => {
    if (!slug || !allBlogs.length) return null;
    return allBlogs.find((b) => b.slug === slug) || null;
  }, [slug, allBlogs]);

  const relatedBlogs = useMemo(() => {
    if (!blog || !allBlogs.length) return [];
    return getRelatedBlogs(blog, allBlogs, 3);
  }, [blog, allBlogs]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
        <Skeleton className="h-10 w-32 mb-4" />
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-64 w-full mb-6" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-red-600">Error</h2>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {error instanceof Error ? error.message : "Failed to load blog. Please try again."}
              </p>
              <Link href="/blogs">
                <Button variant="outline" className="mt-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blogs
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!loading && !blog) {
    return (
      <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-red-600">Blog not found</h2>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The blog you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/blogs">
                <Button variant="outline" className="mt-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blogs
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="container mx-auto p-4 sm:p-6 max-w-4xl space-y-6"
    >
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Link href="/blogs">
          <Button variant="ghost" size="sm" className="group">
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Blogs
          </Button>
        </Link>
      </motion.div>

      {/* Blog Content */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-2"
          >
            <Badge variant="outline" className="capitalize">
              {blog.category}
            </Badge>
            <AnimatePresence>
              {blog.tags?.map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: 0.25 + index * 0.05 }}
                >
                  <Badge variant="secondary" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
          >
            {blog.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-lg md:text-xl text-muted-foreground"
          >
            {blog.excerpt}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {blog.author}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {blog.publishedAt
                ? formatBlogDate(blog.publishedAt)
                : formatBlogDate(blog.createdAt)}
            </div>
          </motion.div>
        </div>

        {/* Cover Image */}
        {blog.coverImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="relative w-full h-64 sm:h-96 rounded-lg overflow-hidden shadow-2xl"
          >
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          <RichTextRenderer content={blog.content} />
        </motion.div>
      </motion.article>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-2xl md:text-3xl font-bold">Related Blogs</h2>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {relatedBlogs.map((relatedBlog) => (
              <BlogCard key={relatedBlog.id} blog={relatedBlog} />
            ))}
          </motion.div>
        </motion.section>
      )}
    </motion.div>
  );
}
