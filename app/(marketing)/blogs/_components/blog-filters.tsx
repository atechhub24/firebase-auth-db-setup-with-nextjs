"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { Blog, BlogCategory } from "@/lib/types/blog.type";
import { Search, X } from "lucide-react";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";

interface BlogFiltersProps {
  blogs: Blog[];
}

const categories: BlogCategory[] = [
  "health",
  "news",
  "tips",
  "wellness",
  "research",
  "general",
];

export function BlogFilters({ blogs }: BlogFiltersProps) {
  const [searchTerm, setSearchTerm] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );
  const [selectedCategories, setSelectedCategories] = useQueryState(
    "categories",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  // Get unique tags from blogs
  const allTags = Array.from(
    new Set(blogs.flatMap((blog) => blog.tags || []))
  ).sort();

  const [selectedTags, setSelectedTags] = useQueryState(
    "tags",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const toggleCategory = (category: BlogCategory) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newCategories.length > 0 ? newCategories : null);
  };

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags.length > 0 ? newTags : null);
  };

  const clearFilters = () => {
    setSearchTerm(null);
    setSelectedCategories(null);
    setSelectedTags(null);
  };

  const hasActiveFilters =
    searchTerm || selectedCategories.length > 0 || selectedTags.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={clearFilters}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label>Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value || null)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <Label>Categories</Label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                />
                <Label
                  htmlFor={`category-${category}`}
                  className="text-sm font-normal cursor-pointer capitalize"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

