import type { Blog, BlogCategory } from "@/lib/types/blog.type";

/**
 * Generate URL-friendly slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Extract excerpt from TipTap content
 */
export function generateExcerpt(
  content: Record<string, unknown>,
  maxLength: number = 150
): string {
  try {
    if (!content || typeof content !== "object") {
      return "";
    }

    const extractText = (node: unknown): string => {
      if (typeof node === "string") {
        return node;
      }

      if (Array.isArray(node)) {
        return node.map(extractText).join(" ");
      }

      if (node && typeof node === "object") {
        if ("text" in node && typeof node.text === "string") {
          return node.text;
        }
        if ("content" in node && Array.isArray(node.content)) {
          return extractText(node.content);
        }
      }

      return "";
    };

    const text = extractText(content);
    return text.length > maxLength
      ? `${text.substring(0, maxLength).trim()}...`
      : text.trim();
  } catch {
    return "";
  }
}

/**
 * Format date from timestamp
 */
export function formatBlogDate(timestamp: number | string): string {
  try {
    const date =
      typeof timestamp === "string" ? new Date(timestamp) : new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return "";
  }
}

/**
 * Get related blogs based on category and tags
 */
export function getRelatedBlogs(
  blog: Blog,
  allBlogs: Blog[],
  limit: number = 3
): Blog[] {
  const related = allBlogs
    .filter((b) => {
      if (b.id === blog.id || b.status !== "published") {
        return false;
      }

      // Same category
      if (b.category === blog.category) {
        return true;
      }

      // Shared tags
      if (
        blog.tags &&
        blog.tags.length > 0 &&
        b.tags &&
        b.tags.some((tag) => blog.tags?.includes(tag))
      ) {
        return true;
      }

      return false;
    })
    .slice(0, limit);

  return related;
}

/**
 * Get unique categories from blogs
 */
export function getUniqueCategories(blogs: Blog[]): BlogCategory[] {
  const categories = new Set<BlogCategory>();
  blogs.forEach((blog) => {
    categories.add(blog.category);
  });
  return Array.from(categories);
}

/**
 * Get all unique tags from blogs
 */
export function getAllTags(blogs: Blog[]): string[] {
  const tags = new Set<string>();
  blogs.forEach((blog) => {
    if (blog.tags && blog.tags.length > 0) {
      blog.tags.forEach((tag) => tags.add(tag.toLowerCase()));
    }
  });
  return Array.from(tags).sort();
}

