"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AttendanceActionsProps {
  onResetFilters: () => void;
}

export function AttendanceActions({
  onResetFilters,
}: AttendanceActionsProps) {
  return (
    <Button
      variant="outline"
      onClick={onResetFilters}
      className="w-full sm:w-1/2 lg:w-[240px] justify-start text-left font-normal gap-2"
    >
      <RotateCcw className="size-4" />
      <span>Reset Filters</span>
    </Button>
  );
}
