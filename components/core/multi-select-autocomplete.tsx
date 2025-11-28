"use client";

import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface MultiSelectAutocompleteOption {
  value: string;
  label: string;
}

interface MultiSelectAutocompleteProps {
  options: MultiSelectAutocompleteOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  maxSelected?: number;
}

export function MultiSelectAutocomplete({
  options,
  value = [],
  onChange,
  placeholder = "Select options...",
  emptyMessage = "No option found.",
  disabled = false,
  className,
  maxSelected,
}: MultiSelectAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const selectedOptions = options.filter((option) => value.includes(option.value));

  // Filter options based on search and exclude already selected
  const filteredOptions = React.useMemo(() => {
    let filtered = options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    );
    // Optionally show selected items at the top or exclude them
    return filtered;
  }, [options, search]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  React.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Reset search when dropdown closes
  React.useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const handleSelect = (optionValue: string) => {
    if (optionValue === undefined || optionValue === null) {
      return;
    }

    if (value.includes(optionValue)) {
      // Deselect
      onChange(value.filter((v) => v !== optionValue));
    } else {
      // Check max selected limit
      if (maxSelected && value.length >= maxSelected) {
        return;
      }
      // Select
      onChange([...value, optionValue]);
    }
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  const isSelected = (optionValue: string) => value.includes(optionValue);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={cn(
          "flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "hover:bg-accent hover:text-accent-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          value.length === 0 && "text-muted-foreground"
        )}
      >
        {selectedOptions.length === 0 ? (
          <span className="truncate">{placeholder}</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {selectedOptions.map((option) => (
              <Badge
                key={option.value}
                variant="secondary"
                className="flex items-center gap-1 pr-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(option.value, e);
                }}
              >
                <span className="truncate max-w-[200px]">{option.label}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemove(option.value, e)}
                  className="ml-1 rounded-full hover:bg-secondary-foreground/20 p-0.5"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md"
          >
            {/* Search Input */}
            <div className="flex items-center border-b px-3 py-2">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={placeholder}
                className="flex h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setOpen(false);
                  }
                }}
              />
            </div>

            {/* Options List */}
            <div className="max-h-[300px] overflow-y-auto p-1">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredOptions.map((option, index) => {
                    const selected = isSelected(option.value);
                    const isDisabled = !!(
                      maxSelected &&
                      !selected &&
                      value.length >= maxSelected
                    );

                    return (
                      <motion.button
                        key={`${option.value}-${index}`}
                        type="button"
                        onClick={() => handleSelect(option.value)}
                        disabled={isDisabled}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className={cn(
                          "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                          "hover:bg-accent hover:text-accent-foreground",
                          "focus:bg-accent focus:text-accent-foreground",
                          selected && "bg-accent text-accent-foreground",
                          isDisabled && "cursor-not-allowed opacity-50"
                        )}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="truncate">{option.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

