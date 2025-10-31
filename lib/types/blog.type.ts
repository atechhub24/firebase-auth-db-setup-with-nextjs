import type { BaseEntity } from "./common.type";

export type BlogCategory =
  | "health"
  | "news"
  | "tips"
  | "wellness"
  | "research"
  | "general";

export type BlogStatus = "draft" | "published";

export interface Blog extends BaseEntity {
  title: string;
  slug: string;
  content: Record<string, unknown>; // TipTap JSON content
  excerpt: string;
  coverImage?: string; // URL from UploadThing
  coverImageFileKey?: string; // File key from UploadThing for deletion
  author: string; // User ID or author name
  category: BlogCategory;
  tags?: string[];
  publishedAt?: number; // Unix timestamp when published
  status: BlogStatus;
  featured: boolean;
}

export interface BlogInput {
  title: string;
  slug?: string; // Optional, will be auto-generated if not provided
  content: Record<string, unknown>;
  excerpt: string;
  coverImage?: string;
  coverImageFileKey?: string;
  author: string;
  category: BlogCategory;
  tags?: string[];
  publishedAt?: number;
  status?: BlogStatus;
  featured?: boolean;
}

export interface BlogUpdateInput {
  title?: string;
  slug?: string;
  content?: Record<string, unknown>;
  excerpt?: string;
  coverImage?: string;
  coverImageFileKey?: string;
  author?: string;
  category?: BlogCategory;
  tags?: string[];
  publishedAt?: number;
  status?: BlogStatus;
  featured?: boolean;
}
