import { getArrFromObj } from "@ashirbad/js-core";
import { mutate } from "@atechhub/firebase";
import type {
  Blog,
  BlogInput,
  BlogUpdateInput,
  BlogCategory,
  BlogStatus,
} from "@/lib/types/blog.type";
import { generateSlug } from "@/lib/utils/blog-utils";

class BlogService {
  /**
   * Generate slug from title
   */
  private generateSlug(title: string): string {
    return generateSlug(title);
  }

  /**
   * Create a new blog
   */
  async create(data: BlogInput): Promise<string> {
    const now = Date.now();
    const nowISO = new Date().toISOString();

    // Auto-generate slug if not provided
    const slug = data.slug || this.generateSlug(data.title);

    // Set publishedAt if status is published
    const publishedAt = data.status === "published" ? now : data.publishedAt;

    const blogData = {
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt,
      coverImage: data.coverImage,
      coverImageFileKey: data.coverImageFileKey,
      author: data.author,
      category: data.category,
      tags: data.tags || [],
      publishedAt,
      status: data.status || "draft",
      featured: data.featured || false,
      createdAt: nowISO,
      updatedAt: nowISO,
    };

    const id = await mutate({
      action: "createWithId",
      path: "blogs",
      data: blogData,
      actionBy: "admin",
    });

    return id;
  }

  /**
   * Get all blogs
   */
  async getAll(): Promise<Blog[]> {
    const data = await mutate({
      action: "get",
      path: "blogs",
    });
    const blogs = getArrFromObj(data || {}) as unknown as Blog[];

    // Sort by createdAt (newest first)
    return blogs.sort((a, b) => {
      const aTime =
        typeof a.createdAt === "string" ? new Date(a.createdAt).getTime() : 0;
      const bTime =
        typeof b.createdAt === "string" ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
  }

  /**
   * Get only published blogs
   */
  async getPublished(): Promise<Blog[]> {
    const blogs = await this.getAll();
    return blogs.filter((blog) => blog.status === "published");
  }

  /**
   * Get blog by ID
   */
  async getById(id: string): Promise<Blog | null> {
    const data = await mutate({
      action: "get",
      path: `blogs/${id}`,
    });
    if (!data) {
      return null;
    }
    // Add id to the blog object
    return { ...data, id } as Blog;
  }

  /**
   * Get blog by slug
   */
  async getBySlug(slug: string): Promise<Blog | null> {
    const blogs = await this.getAll();
    return blogs.find((blog) => blog.slug === slug) || null;
  }

  /**
   * Update blog
   */
  async update(id: string, data: BlogUpdateInput): Promise<void> {
    if (!id) {
      throw new Error("Blog ID is required");
    }

    // Try to get existing blog to check if it exists and get current values
    let existingBlog: Blog | null = null;
    try {
      existingBlog = await this.getById(id);
    } catch {
      // If getById fails, try getting from getAll
      const allBlogs = await this.getAll();
      existingBlog = allBlogs.find((b) => b.id === id) || null;
    }

    // If still not found, check if blog exists in database
    if (!existingBlog) {
      const allBlogs = await this.getAll();
      const blogExists = allBlogs.find((b) => b.id === id);
      if (!blogExists) {
        throw new Error(`Blog with ID "${id}" not found`);
      }
      existingBlog = blogExists;
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    // Auto-update slug if title changes (unless slug explicitly provided)
    if (data.title && data.title !== existingBlog.title) {
      if (data.slug !== undefined) {
        updateData.slug = data.slug;
      } else {
        updateData.slug = this.generateSlug(data.title);
      }
      updateData.title = data.title;
    } else if (data.slug !== undefined) {
      updateData.slug = data.slug;
    }

    // Auto-set publishedAt when status changes to published
    if (data.status === "published" && existingBlog.status !== "published") {
      updateData.publishedAt = Date.now();
    } else if (data.status === "draft" && existingBlog.status === "published") {
      // Keep publishedAt even if changed to draft (for history)
      // Optionally remove: updateData.publishedAt = undefined;
    }

    if (data.content !== undefined) updateData.content = data.content;
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
    if (data.coverImageFileKey !== undefined)
      updateData.coverImageFileKey = data.coverImageFileKey;
    if (data.author !== undefined) updateData.author = data.author;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.publishedAt !== undefined)
      updateData.publishedAt = data.publishedAt;

    await mutate({
      action: "update",
      path: `blogs/${id}`,
      data: updateData,
      actionBy: "admin",
    });
  }

  /**
   * Delete blog
   */
  async delete(id: string): Promise<void> {
    await mutate({
      action: "delete",
      path: `blogs/${id}`,
      actionBy: "admin",
    });
  }

  /**
   * Get blogs by category
   */
  async getByCategory(category: BlogCategory): Promise<Blog[]> {
    const blogs = await this.getAll();
    return blogs.filter((blog) => blog.category === category);
  }

  /**
   * Get blogs by tag
   */
  async getByTag(tag: string): Promise<Blog[]> {
    const blogs = await this.getAll();
    return blogs.filter((blog) =>
      blog.tags?.some((t) => t.toLowerCase() === tag.toLowerCase()),
    );
  }

  /**
   * Get blogs by author
   */
  async getByAuthor(authorId: string): Promise<Blog[]> {
    const blogs = await this.getAll();
    return blogs.filter((blog) => blog.author === authorId);
  }

  /**
   * Get blogs by status
   */
  async getByStatus(status: BlogStatus): Promise<Blog[]> {
    const blogs = await this.getAll();
    return blogs.filter((blog) => blog.status === status);
  }

  /**
   * Search blogs
   */
  async search(query: string): Promise<Blog[]> {
    const blogs = await this.getAll();
    const lowerQuery = query.toLowerCase();

    return blogs.filter((blog) => {
      // Search in title
      if (blog.title?.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      // Search in excerpt
      if (blog.excerpt?.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      // Search in author
      if (blog.author?.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      // Search in tags
      if (blog.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))) {
        return true;
      }

      // Search in content (basic text extraction)
      try {
        const contentStr = JSON.stringify(blog.content).toLowerCase();
        if (contentStr.includes(lowerQuery)) {
          return true;
        }
      } catch {
        // Ignore parsing errors
      }

      return false;
    });
  }
}

export const blogService = new BlogService();
