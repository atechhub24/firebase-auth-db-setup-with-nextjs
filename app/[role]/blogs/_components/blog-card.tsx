"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Blog } from "@/lib/types/blog.type";
import { formatBlogDate } from "@/lib/utils/blog-utils";
import {
  Calendar,
  User,
  Star,
  Tag,
  Edit,
  Trash2,
  MoreHorizontal,
  FileText,
} from "lucide-react";
import { motion } from "motion/react";
import { useParams, useRouter } from "next/navigation";

interface BlogCardProps {
  blog: Blog;
  onDelete: (blog: Blog) => void;
}

export const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const getCategoryColors = (category: string) => {
  const colors: Record<string, { bg: string; text: string }> = {
    health: {
      bg: "bg-red-100 dark:bg-red-900",
      text: "text-red-800 dark:text-red-200",
    },
    news: {
      bg: "bg-blue-100 dark:bg-blue-900",
      text: "text-blue-800 dark:text-blue-200",
    },
    tips: {
      bg: "bg-yellow-100 dark:bg-yellow-900",
      text: "text-yellow-800 dark:text-yellow-200",
    },
    wellness: {
      bg: "bg-purple-100 dark:bg-purple-900",
      text: "text-purple-800 dark:text-purple-200",
    },
    research: {
      bg: "bg-indigo-100 dark:bg-indigo-900",
      text: "text-indigo-800 dark:text-indigo-200",
    },
    general: {
      bg: "bg-gray-100 dark:bg-gray-900",
      text: "text-gray-800 dark:text-gray-200",
    },
  };
  return colors[category] || colors.general;
};

export function BlogCard({ blog, onDelete }: BlogCardProps) {
  const router = useRouter();
  const params = useParams();
  const role = params.role as string;

  const categoryColors = getCategoryColors(blog.category);

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Status indicator bar */}
      <div
        className={`absolute left-0 top-0 h-full w-1 ${
          blog.status === "published" ? "bg-green-500" : "bg-yellow-500"
        }`}
      />

      <div className="ml-3 p-4 space-y-3">
        {/* Cover Image */}
        {blog.coverImage && (
          <div className="relative h-40 w-full overflow-hidden rounded-md -mx-4 -mt-4 mb-2">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
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

        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base line-clamp-2 mb-1">
              {blog.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {blog.excerpt}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/${role}/blogs/${blog.id}`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(blog)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span className="truncate">{blog.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatBlogDate(blog.createdAt)}</span>
          </div>
        </div>

        {/* Category and Status */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="outline"
            className={`${categoryColors.bg} ${categoryColors.text} border-0`}
          >
            <FileText className="h-3 w-3 mr-1" />
            {blog.category}
          </Badge>
          <Badge
            variant={blog.status === "published" ? "default" : "secondary"}
            className={
              blog.status === "published"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : ""
            }
          >
            {blog.status}
          </Badge>
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {blog.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {blog.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{blog.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
