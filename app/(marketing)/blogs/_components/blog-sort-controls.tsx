"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grid3x3, List } from "lucide-react";
import { useQueryState, parseAsString } from "nuqs";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function BlogSortControls() {
  const [sortOption, setSortOption] = useQueryState(
    "sort",
    parseAsString.withDefault("new-first"),
  );
  const [viewMode, setViewMode] = useQueryState(
    "view",
    parseAsString.withDefault("grid"),
  );

  return (
    <div className="flex items-center gap-3 shrink-0">
      <Select value={sortOption} onValueChange={setSortOption}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new-first">Newest First</SelectItem>
          <SelectItem value="old-first">Oldest First</SelectItem>
          <SelectItem value="a-z">A-Z</SelectItem>
          <SelectItem value="z-a">Z-A</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex gap-1 p-0.5 rounded-md bg-muted/30 border border-border/50">
        <motion.button
          onClick={() => setViewMode("grid")}
          className={cn(
            "relative px-2 py-1 rounded-sm text-xs font-medium transition-all duration-300",
            viewMode === "grid"
              ? "text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {viewMode === "grid" && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-sm"
              layoutId="viewBg"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1">
            <Grid3x3 className="h-4 w-4" />
            Grid
          </span>
        </motion.button>
        <motion.button
          onClick={() => setViewMode("list")}
          className={cn(
            "relative px-2 py-1 rounded-sm text-xs font-medium transition-all duration-300",
            viewMode === "list"
              ? "text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {viewMode === "list" && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-sm"
              layoutId="viewBg"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1">
            <List className="h-4 w-4" />
            List
          </span>
        </motion.button>
      </div>
    </div>
  );
}
