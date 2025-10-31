"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { blogService } from "@/lib/services/blog.service";
import { getRelatedBlogs } from "@/lib/utils/blog-utils";
import type { Blog } from "@/lib/types/blog.type";
import { RichTextRenderer } from "@/components/ui/rich-text-renderer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBlogDate } from "@/lib/utils/blog-utils";
import { Calendar, User, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BlogCard } from "../_components/blog-card";
import { motion } from "motion/react";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await blogService.getBySlug(slug);
        if (!data) {
          setError("Blog not found");
          return;
        }
        setBlog(data);

        // Fetch related blogs
        const allBlogs = await blogService.getPublished();
        const related = getRelatedBlogs(data, allBlogs, 3);
        setRelatedBlogs(related);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

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

  if (error || !blog) {
    return (
      <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-red-600">Error</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error || "Blog not found"}</p>
            <Link href="/blogs">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blogs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-4xl space-y-6">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link href="/blogs">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Button>
        </Link>
      </motion.div>

      {/* Blog Content */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {blog.category}
            </Badge>
            {blog.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {blog.title}
          </h1>

          <p className="text-lg text-muted-foreground">{blog.excerpt}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
          </div>
        </div>

        {/* Cover Image */}
        {blog.coverImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative w-full h-64 sm:h-96 rounded-lg overflow-hidden"
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
          transition={{ delay: 0.3 }}
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
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold">Related Blogs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedBlogs.map((relatedBlog) => (
              <BlogCard key={relatedBlog.id} blog={relatedBlog} />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}

