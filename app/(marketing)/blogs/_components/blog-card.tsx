"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Blog } from "@/lib/types/blog.type";
import { formatBlogDate } from "@/lib/utils/blog-utils";
import { Calendar, User, Star, Tag } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/blogs/${blog.slug}`}>
        <Card className="h-full cursor-pointer transition-shadow hover:shadow-lg">
          {blog.coverImage && (
            <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
              {blog.featured && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-yellow-500 text-white">
                    <Star className="h-3 w-3 mr-1 fill-white" />
                    Featured
                  </Badge>
                </div>
              )}
            </div>
          )}
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-xl font-semibold line-clamp-2">{blog.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {blog.excerpt}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {blog.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {blog.publishedAt
                    ? formatBlogDate(blog.publishedAt)
                    : formatBlogDate(blog.createdAt)}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{blog.category}</Badge>
                {blog.tags &&
                  blog.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

