"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Tag, X, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagsMultiSelectProps {
  tags: string[];
  selectedTags: string[];
  onSelect: (tags: string[]) => void;
}

export function TagsMultiSelect({
  tags,
  selectedTags,
  onSelect,
}: TagsMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTags = useMemo(() => {
    if (!searchTerm) return tags;
    return tags.filter((tag) =>
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tags, searchTerm]);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onSelect(selectedTags.filter((t) => t !== tag));
    } else {
      onSelect([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    onSelect(selectedTags.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-2">
      {/* Selected Tags with AnimatePresence */}
      <AnimatePresence mode="popLayout">
        {selectedTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 pb-2"
          >
            {selectedTags.map((tag) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant="secondary"
                  className="pr-1.5 pl-2 py-1.5 text-xs cursor-default group"
                >
                  <Tag className="h-3 w-3 mr-1.5 shrink-0" />
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTag(tag);
                    }}
                    className="ml-1.5 rounded-full hover:bg-destructive/20 p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3 text-muted-foreground group-hover:text-destructive transition-colors" />
                  </button>
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Combobox */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between border-2 border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate text-sm">
                {selectedTags.length > 0
                  ? `${selectedTags.length} tag${
                      selectedTags.length > 1 ? "s" : ""
                    } selected`
                  : "Select tags..."}
              </span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput
              placeholder="Search tags..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              <CommandEmpty>No tags found.</CommandEmpty>
              <CommandGroup>
                {filteredTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <CommandItem
                      key={tag}
                      value={tag}
                      onSelect={() => {
                        handleTagToggle(tag);
                        setSearchTerm("");
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <Tag className="mr-2 h-4 w-4 shrink-0" />
                      <span className="flex-1">{tag}</span>
                      {isSelected && (
                        <Badge
                          variant="secondary"
                          className="ml-2 h-5 px-1.5 text-xs"
                        >
                          Selected
                        </Badge>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

