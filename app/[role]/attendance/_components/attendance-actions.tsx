"use client";

import { RotateCcw, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AttendanceActionsProps {
  onResetFilters: () => void;
  onRefetch: () => void;
}

export function AttendanceActions({
  onResetFilters,
  onRefetch,
}: AttendanceActionsProps) {
  return (
    <div className="flex items-center gap-2 w-full sm:flex-1 lg:flex-initial flex-shrink-0">
      <Button
        variant="outline"
        size="sm"
        onClick={onResetFilters}
        className="gap-2 flex-1 sm:w-1/2 lg:flex-initial"
      >
        <RotateCcw className="size-4" />
        <span className="hidden sm:inline">Reset Filters</span>
        <span className="sm:hidden">Reset</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onRefetch}
        className="gap-2 flex-1 sm:w-1/2 lg:flex-initial"
      >
        <RefreshCw className="size-4" />
        <span className="hidden sm:inline">Refetch</span>
        <span className="sm:hidden">Refresh</span>
      </Button>
    </div>
  );
}

