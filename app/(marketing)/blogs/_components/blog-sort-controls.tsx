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

export function BlogSortControls() {
  const [sortOption, setSortOption] = useQueryState(
    "sort",
    parseAsString.withDefault("new-first")
  );
  const [viewMode, setViewMode] = useQueryState(
    "view",
    parseAsString.withDefault("grid")
  );

  return (
    <div className="flex items-center justify-between gap-4">
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

      <div className="flex gap-2">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="icon-sm"
          onClick={() => setViewMode("grid")}
        >
          <Grid3x3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="icon-sm"
          onClick={() => setViewMode("list")}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

