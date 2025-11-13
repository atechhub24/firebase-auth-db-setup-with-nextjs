"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  useQueryState,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsString,
} from "nuqs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Filter,
  Star,
  Sparkles,
  RotateCcw,
  X,
  Heart,
  Newspaper,
  Lightbulb,
  Sparkles as SparklesIcon,
  Microscope,
  Folder,
} from "lucide-react";
import type { Blog, BlogCategory } from "@/lib/types/blog.type";
import { TagsMultiSelect } from "./tags-multi-select";
import { AuthorCombobox } from "./author-combobox";

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

const categoryIcons: Record<
  BlogCategory,
  React.ComponentType<{ className?: string }>
> = {
  health: Heart,
  news: Newspaper,
  tips: Lightbulb,
  wellness: SparklesIcon,
  research: Microscope,
  general: Folder,
};

export function BlogFilters({ blogs }: BlogFiltersProps) {
  // URL Query State
  const [selectedCategories, setSelectedCategories] = useQueryState(
    "categories",
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  const [selectedTags, setSelectedTags] = useQueryState(
    "tags",
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  const [selectedAuthor, setSelectedAuthor] = useQueryState(
    "author",
    parseAsString.withDefault("all"),
  );

  const [showFeaturedOnly, setShowFeaturedOnly] = useQueryState(
    "featured",
    parseAsBoolean.withDefault(false),
  );

  // Get unique tags and authors from blogs
  const allTags = useMemo(
    () => Array.from(new Set(blogs.flatMap((blog) => blog.tags || []))).sort(),
    [blogs],
  );

  const allAuthors = useMemo(
    () =>
      Array.from(
        new Set(blogs.map((blog) => blog.author).filter(Boolean)),
      ).sort(),
    [blogs],
  );

  const handleCategoryToggle = (category: BlogCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setSelectedAuthor("all");
    setShowFeaturedOnly(false);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedTags.length > 0 ||
    selectedAuthor !== "all" ||
    showFeaturedOnly;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-2 border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <CardTitle>Filters</CardTitle>
            </div>
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilters}
                    className="h-8 text-xs hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Featured Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              Featured Posts
            </Label>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50 group hover:bg-muted/50 transition-colors">
              <Label
                htmlFor="featured-filter"
                className="text-sm font-normal cursor-pointer group-hover:text-yellow-600 transition-colors flex-1"
              >
                Show only featured posts
              </Label>
              <Switch
                id="featured-filter"
                checked={showFeaturedOnly}
                onCheckedChange={setShowFeaturedOnly}
                className="data-[state=checked]:bg-yellow-500"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Categories</Label>
            <div className="space-y-2">
              {categories.map((category, index) => {
                const IconComponent = categoryIcons[category];
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-2 group"
                  >
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label
                      htmlFor={`category-${category}`}
                      className="text-sm font-normal cursor-pointer capitalize group-hover:text-primary transition-colors flex items-center gap-2 flex-1"
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{category}</span>
                    </Label>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Tags</Label>
              <TagsMultiSelect
                tags={allTags}
                selectedTags={selectedTags}
                onSelect={setSelectedTags}
              />
            </div>
          )}

          {/* Author */}
          {allAuthors.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Author</Label>
              <AuthorCombobox
                authors={allAuthors}
                selectedAuthor={selectedAuthor}
                onSelect={setSelectedAuthor}
              />
            </div>
          )}

          {/* Active Filters Section */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 pt-4 border-t"
              >
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-primary" />
                  Active Filters
                </Label>
                <div className="flex flex-wrap gap-2">
                  {/* Category Badges */}
                  {selectedCategories.map((category) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge variant="secondary" className="capitalize">
                        {category}
                      </Badge>
                    </motion.div>
                  ))}

                  {/* Tag Badges */}
                  {selectedTags.map((tag) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge variant="secondary">{tag}</Badge>
                    </motion.div>
                  ))}

                  {/* Author Badge */}
                  {selectedAuthor !== "all" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge variant="secondary">{selectedAuthor}</Badge>
                    </motion.div>
                  )}

                  {/* Featured Badge */}
                  {showFeaturedOnly && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge
                        variant="secondary"
                        className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                      >
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Featured
                      </Badge>
                    </motion.div>
                  )}
                </div>

                {/* Reset Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.1 }}
                  className="pt-3"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetFilters}
                    className="w-full border-2 border-destructive/50 bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset All Filters
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
