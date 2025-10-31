"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Blog, BlogCategory, BlogStatus } from "@/lib/types/blog.type";
import {
  Plus,
  Search,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { BlogCard, cardVariants } from "./blog-card";
import { DeleteBlogDialog } from "./delete-blog-dialog";

interface BlogsListProps {
  blogs: Blog[];
  onRefresh: () => void;
}

const categories: BlogCategory[] = [
  "health",
  "news",
  "tips",
  "wellness",
  "research",
  "general",
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export function BlogsList({ blogs, onRefresh }: BlogsListProps) {
  const router = useRouter();
  const params = useParams();
  const role = params.role as string;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BlogStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<BlogCategory | "all">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"date" | "alphabetical">("date");
  const [sortOrder, setSortOrder] = useState<"new" | "old">("new");
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Filter and sort blogs
  const filteredBlogs = useMemo(() => {
    let filtered = blogs.filter((blog) => {
      const matchesSearch =
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        statusFilter === "all" || blog.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || blog.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sort blogs
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "date") {
        const aTime =
          typeof a.createdAt === "string"
            ? new Date(a.createdAt).getTime()
            : 0;
        const bTime =
          typeof b.createdAt === "string"
            ? new Date(b.createdAt).getTime()
            : 0;
        return sortOrder === "new" ? bTime - aTime : aTime - bTime;
      } else {
        // Alphabetical
        return sortOrder === "new"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
    });

    return filtered;
  }, [blogs, searchTerm, statusFilter, categoryFilter, sortBy, sortOrder]);

  const openDeleteDialog = (blog: Blog) => {
    setSelectedBlog(blog);
    setDeleteDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    onRefresh();
    setSelectedBlog(null);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Blogs</CardTitle>
          <CardDescription>Manage your blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as BlogStatus | "all")}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={categoryFilter}
              onValueChange={(v) =>
                setCategoryFilter(v as BlogCategory | "all")
              }
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(v) => {
                const [by, order] = v.split("-");
                setSortBy(by as "date" | "alphabetical");
                setSortOrder(order as "new" | "old");
              }}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-new">Newest First</SelectItem>
                <SelectItem value="date-old">Oldest First</SelectItem>
                <SelectItem value="alphabetical-new">A-Z</SelectItem>
                <SelectItem value="alphabetical-old">Z-A</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => router.push(`/${role}/blogs/create`)}
              className="w-full md:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Blog
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Blog Cards Grid */}
      {filteredBlogs.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No blogs found
          </CardContent>
        </Card>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onDelete={openDeleteDialog}
            />
          ))}
        </motion.div>
      )}

      <DeleteBlogDialog
        blog={selectedBlog}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDeleted={handleDialogSuccess}
      />
    </div>
  );
}

