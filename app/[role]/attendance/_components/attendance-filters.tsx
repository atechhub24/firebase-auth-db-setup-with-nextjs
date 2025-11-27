"use client";

import { CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Autocomplete, type AutocompleteOption } from "@/components/core/autocomplete";
import type { User } from "@/lib/types/user.type";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface AttendanceFiltersProps {
  selectedDate: Date;
  selectedStaffId: string;
  staffs: User[];
  calendarOpen: boolean;
  onDateSelect: (date: Date | undefined) => void;
  onStaffSelect: (staffId: string) => void;
  onCalendarOpenChange: (open: boolean) => void;
}

export function AttendanceFilters({
  selectedDate,
  selectedStaffId,
  staffs,
  calendarOpen,
  onDateSelect,
  onStaffSelect,
  onCalendarOpenChange,
}: AttendanceFiltersProps) {
  const staffOptions = useMemo<AutocompleteOption[]>(() => {
    const options: AutocompleteOption[] = [
      { value: "all", label: "All Staff" },
    ];
    staffs.forEach((staff) => {
      options.push({
        value: staff.uid,
        label: staff.name,
      });
    });
    return options;
  }, [staffs]);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:flex-1 lg:flex-initial min-w-0">
      <Popover open={calendarOpen} onOpenChange={onCalendarOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full sm:w-1/2 lg:w-[240px] justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <div className="w-full sm:w-1/2 lg:w-[240px] min-w-0">
        <Autocomplete
          options={staffOptions}
          value={selectedStaffId || "all"}
          onChange={onStaffSelect}
          placeholder="Select staff"
          emptyMessage="No staff found."
          className="w-full"
        />
      </div>
    </div>
  );
}
