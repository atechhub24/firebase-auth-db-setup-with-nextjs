"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Blog } from "@/lib/types/blog.type";
import { formatBlogDate } from "@/lib/utils/blog-utils";
import { Calendar, User, Star, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { cardVariants } from "./motion-variants";

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="h-full"
    >
      <Link href={`/blogs/${blog.slug}`}>
        <Card className="group h-full cursor-pointer overflow-hidden border-2 border-border/50 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-sm hover:border-primary/50 hover:shadow-2xl transition-all duration-500 ease-out flex flex-col relative">
          {/* Cover Image with Zoom Effect */}
          {blog.coverImage && (
            <div className="relative h-56 w-full overflow-hidden">
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-10" />
              
              {/* Image with Scale on Hover */}
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              
              {/* Featured Badge with Entrance Animation */}
              {blog.featured && (
                <motion.div
                  className="absolute top-4 right-4 z-20"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                >
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-950 shadow-lg">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                </motion.div>
              )}
            </div>
          )}

          {/* Content */}
          <CardHeader className="flex-1 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <motion.h3
                className="font-bold text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                {blog.title}
              </motion.h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {blog.excerpt}
            </p>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col gap-4">
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
                <Badge variant="outline" className="capitalize">
                  {blog.category}
                </Badge>
                {blog.tags &&
                  blog.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>

            {/* Read More Link with Expanding Gap */}
            <motion.div
              className="flex items-center gap-1 text-primary font-semibold text-sm mt-auto"
              whileHover={{ gap: 6 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <span>Read more</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
            </motion.div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
