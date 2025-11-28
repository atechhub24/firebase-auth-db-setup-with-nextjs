"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useFirebaseRealtime } from "@/hooks/use-firebase-realtime";
import type { Blog } from "@/lib/types/blog.type";
import { BlogForm } from "../_components/blog-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function EditBlogPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, loading, error } = useFirebaseRealtime<Blog>("blogs", {
    asArray: true,
  });

  const allBlogs = (data as Blog[]) || [];

  const blog = useMemo(() => {
    if (!id || !allBlogs.length) return null;
    return allBlogs.find((b) => b.id === id) || null;
  }, [id, allBlogs]);

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

  if (error) {
    return (
      <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-red-600">Error</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Failed to load blog. Please try again."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!loading && !blog) {
    return (
      <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-red-600">Blog not found</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The blog you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <BlogForm blog={blog ?? undefined} />;
}
