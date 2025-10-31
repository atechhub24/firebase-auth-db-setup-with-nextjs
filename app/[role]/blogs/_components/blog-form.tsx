"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Heart,
  Newspaper,
  Lightbulb,
  Sparkles,
  Microscope,
  Folder,
  X,
  Plus,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Switch } from "@/components/ui/switch";
import { ImageEditor } from "@/components/ui/image-editor";
import { useUploadThing } from "@/lib/utils/uploadthing";
import { blogService } from "@/lib/services/blog.service";
import { generateSlug } from "@/lib/utils/blog-utils";
import type { Blog, BlogCategory, BlogStatus } from "@/lib/types/blog.type";
import { useAppStore } from "@/hooks/use-app-store";

const blogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(300, "Excerpt must be at most 300 characters"),
  content: z
    .any()
    .refine((val) => val && typeof val === "object" && "type" in val, {
      message: "Content is required",
    }),
  coverImage: z.string().optional(),
  author: z.string().min(1, "Author is required"),
  category: z.enum([
    "health",
    "news",
    "tips",
    "wellness",
    "research",
    "general",
  ]),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]),
  featured: z.boolean(),
});

type BlogFormData = z.infer<typeof blogSchema>;

const categories: {
  value: BlogCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "health", label: "Health", icon: Heart },
  { value: "news", label: "News", icon: Newspaper },
  { value: "tips", label: "Tips", icon: Lightbulb },
  { value: "wellness", label: "Wellness", icon: Sparkles },
  { value: "research", label: "Research", icon: Microscope },
  { value: "general", label: "General", icon: Folder },
];

interface BlogFormProps {
  blog?: Blog;
}

export function BlogForm({ blog }: BlogFormProps) {
  const router = useRouter();
  const params = useParams();
  const role = params.role as string;
  const { user } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.url) {
        form.setValue("coverImage", res[0].url);
        toast.success("Cover image uploaded!");
        setSelectedFile(null);
      }
    },
    onUploadError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: blog?.title || "",
      slug: blog?.slug || "",
      excerpt: blog?.excerpt || "",
      content: blog?.content || { type: "doc", content: [] },
      coverImage: blog?.coverImage || "",
      author: blog?.author || user?.name || "",
      category: (blog?.category || "general") as BlogCategory,
      tags: blog?.tags || [],
      status: (blog?.status || "draft") as BlogStatus,
      featured: blog?.featured || false,
    },
  });

  const watchedSlug = form.watch("slug");
  const watchedTags = form.watch("tags") || [];

  // Auto-generate slug when title changes
  const handleTitleChange = (value: string) => {
    form.setValue("title", value);
    if (!blog || !watchedSlug) {
      form.setValue("slug", generateSlug(value));
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setShowImageEditor(true);
  };

  const handleImageEditorSave = async (optimizedFile: File) => {
    setShowImageEditor(false);
    setSelectedFile(optimizedFile);
    // Don't upload here, wait for form submit
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !watchedTags.includes(tagInput.trim())) {
      form.setValue("tags", [...watchedTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    form.setValue(
      "tags",
      watchedTags.filter((t) => t !== tag)
    );
  };

  const onSubmit = async (data: BlogFormData) => {
    setIsLoading(true);
    try {
      let coverImageUrl = data.coverImage;

      // Upload cover image if a new file is selected
      if (selectedFile) {
        const uploadResult = await startUpload([selectedFile]);
        if (uploadResult?.[0]?.url) {
          coverImageUrl = uploadResult[0].url;
        }
      }

      const blogData = {
        ...data,
        coverImage: coverImageUrl,
      };

      if (blog) {
        // Update existing blog
        await blogService.update(blog.id, blogData);
        toast.success("Blog updated successfully!");
      } else {
        // Create new blog
        await blogService.create(blogData);
        toast.success("Blog created successfully!");
      }

      router.push(`/${role}/blogs`);
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error(
        `Failed to ${blog ? "update" : "create"} blog. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold tracking-tight">
          {blog ? "Edit Blog" : "Create Blog"}
        </h1>
        <p className="text-muted-foreground">
          {blog
            ? "Update your blog post details and content."
            : "Create a new blog post with rich content and images."}
        </p>
      </motion.div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Set up the basic details for your blog post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          placeholder="Enter blog title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="url-friendly-slug"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="A short description of your blog post (max 300 characters)"
                          maxLength={300}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">
                        {field.value?.length || 0}/300 characters
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          {field.value && (
                            <div className="relative w-full h-48 rounded-md overflow-hidden border">
                              <img
                                src={field.value}
                                alt="Cover preview"
                                className="w-full h-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon-sm"
                                className="absolute top-2 right-2"
                                onClick={() => {
                                  form.setValue("coverImage", "");
                                  setSelectedFile(null);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileSelect(file);
                                }
                              }}
                              className="cursor-pointer"
                            />
                            {isUploading && (
                              <p className="text-sm text-muted-foreground self-center">
                                Uploading...
                              </p>
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
                <CardDescription>
                  Write your blog post content using the rich text editor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RichTextEditor
                          content={field.value}
                          onChange={field.onChange}
                          placeholder="Start writing your blog post..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Metadata */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
                <CardDescription>
                  Set category, tags, and publication settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Author name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-3 gap-2">
                          {categories.map((cat) => {
                            const Icon = cat.icon;
                            return (
                              <Button
                                key={cat.value}
                                type="button"
                                variant={
                                  field.value === cat.value
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => field.onChange(cat.value)}
                                className="flex items-center gap-2"
                              >
                                <Icon className="h-4 w-4" />
                                {cat.label}
                              </Button>
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddTag();
                                }
                              }}
                              placeholder="Add a tag and press Enter"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleAddTag}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          {watchedTags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {watchedTags.map((tag) => (
                                <div
                                  key={tag}
                                  className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                                >
                                  {tag}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="h-4 w-4"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="space-y-0.5">
                    <FormLabel>Status</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {form.watch("status") === "published"
                        ? "Published - Visible to public"
                        : "Draft - Not visible to public"}
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Draft</span>
                            <Switch
                              checked={field.value === "published"}
                              onCheckedChange={(checked) =>
                                field.onChange(checked ? "published" : "draft")
                              }
                            />
                            <span className="text-sm">Published</span>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border rounded-md">
                      <div className="space-y-0.5">
                        <FormLabel>Featured</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Highlight this post on the blog homepage
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end gap-2"
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isUploading}>
              {isLoading
                ? blog
                  ? "Updating..."
                  : "Creating..."
                : blog
                  ? "Update Blog"
                  : "Create Blog"}
            </Button>
          </motion.div>
        </form>
      </Form>

      {/* Image Editor Dialog */}
      {selectedFile && (
        <ImageEditor
          imageFile={selectedFile}
          open={showImageEditor}
          onSave={handleImageEditorSave}
          onCancel={() => {
            setShowImageEditor(false);
            setSelectedFile(null);
          }}
          aspectRatio={16 / 9}
          circularCrop={false}
          title="Edit Cover Image"
          description="Crop, rotate, and optimize your blog cover image. It will be converted to WEBP format for better compression."
        />
      )}
    </div>
  );
}

