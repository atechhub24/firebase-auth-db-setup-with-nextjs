"use client";

import { useState } from "react";
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
import { User, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthorComboboxProps {
  authors: string[];
  selectedAuthor: string;
  onSelect: (author: string) => void;
}

export function AuthorCombobox({
  authors,
  selectedAuthor,
  onSelect,
}: AuthorComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between border-2 border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all"
        >
          <div className="flex items-center gap-2 min-w-0">
            <User className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="truncate font-medium">
              {selectedAuthor === "all"
                ? "All Authors"
                : selectedAuthor || "Select author..."}
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
          <CommandInput placeholder="Search authors..." />
          <CommandList>
            <CommandEmpty>No author found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all authors"
                onSelect={() => {
                  onSelect("all");
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedAuthor === "all" ? "opacity-100" : "opacity-0",
                  )}
                />
                <User className="mr-2 h-4 w-4" />
                <span className="font-medium">All Authors</span>
              </CommandItem>
              {authors.map((author) => (
                <CommandItem
                  key={author}
                  value={author}
                  onSelect={() => {
                    onSelect(author);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedAuthor === author ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="font-medium">{author}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
