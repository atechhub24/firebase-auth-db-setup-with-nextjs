"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { blogService } from "@/lib/services/blog.service";
import type { Blog } from "@/lib/types/blog.type";
import { BlogForm } from "../_components/blog-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";

export default function EditBlogPage() {
  const params = useParams();
  const id = params.id as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await blogService.getById(id);
        if (!data) {
          setError("Blog not found");
          return;
        }
        setBlog(data);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog. Please try again.");
        toast.error("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
        <div className="space-y-2 mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
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
            <p className="text-muted-foreground">
              {error || "Blog not found"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <BlogForm blog={blog} />;
}

