"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/lib/types/user.type";

interface StaffSelectorProps {
  staffs: User[];
  selectedStaffId: string;
  onSelect: (staffId: string) => void;
  placeholder?: string;
  className?: string;
}

export function StaffSelector({
  staffs,
  selectedStaffId,
  onSelect,
  placeholder = "Select staff...",
  className,
}: StaffSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const selectedStaff =
    selectedStaffId === "all"
      ? null
      : staffs.find((staff) => staff.uid === selectedStaffId);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedStaffId === "all" ? (
            <div className="flex items-center gap-2">
              <Users className="size-4" />
              <span>All Staff</span>
            </div>
          ) : selectedStaff ? (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Avatar className="size-6 shrink-0">
                <AvatarImage
                  src={selectedStaff.profilePicture}
                  alt={selectedStaff.name}
                />
                <AvatarFallback className="text-xs">
                  {getInitials(selectedStaff.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start min-w-0 flex-1">
                <span className="text-sm font-medium truncate">
                  {selectedStaff.name}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {selectedStaff.email}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search staff..." />
          <CommandList>
            <CommandEmpty>No staff found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={() => {
                  onSelect("all");
                  setOpen(false);
                }}
              >
                <div className="flex items-center gap-2 flex-1">
                  <Users className="size-4 shrink-0" />
                  <span>All Staff</span>
                </div>
                <Check
                  className={cn(
                    "ml-auto size-4 shrink-0",
                    selectedStaffId === "all" ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
              {staffs.map((staff) => (
                <CommandItem
                  key={staff.uid}
                  value={`${staff.name} ${staff.email}`}
                  onSelect={() => {
                    onSelect(staff.uid);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="size-8 shrink-0">
                      <AvatarImage
                        src={staff.profilePicture}
                        alt={staff.name}
                      />
                      <AvatarFallback className="text-xs">
                        {getInitials(staff.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm font-medium truncate">
                        {staff.name}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {staff.email}
                      </span>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto size-4 shrink-0",
                      selectedStaffId === staff.uid
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
