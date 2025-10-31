"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useQueryState, parseAsString, useQueryStates } from "nuqs";
import { motion } from "motion/react";
import { RotateCcw, RefreshCw, MapPin, List, CalendarIcon } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { useAppStore } from "@/hooks/use-app-store";
import { StaffAttendance } from "./_components/staff-attendance";
import { AdminAttendanceAnalytics } from "./_components/admin-attendance-analytics";
import { AdminAttendance } from "./_components/admin-attendance";
import { AdminAttendanceMap } from "./_components/admin-attendance-map";
import { StaffSelector } from "./_components/staff-selector";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { staffService } from "@/lib/services";
import type { User } from "@/lib/types/user.type";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "map", label: "Map", icon: MapPin },
  { id: "list", label: "List", icon: List },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function AttendancePage() {
  const user = useAppStore((state) => state.user);
  const isAdmin = user?.role === "admin";
  const [refetchKey, setRefetchKey] = useState(0);
  const [staffs, setStaffs] = useState<User[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsString.withDefault("map")
  );

  // Filter state management
  const [selectedStaffId, setSelectedStaffId] = useQueryState(
    "staff",
    parseAsString.withDefault("all")
  );
  const [dateStr, setDateStr] = useQueryState(
    "date",
    parseAsString.withDefault(format(new Date(), "yyyy-MM-dd"))
  );

  // Get all query state setters for reset
  const [, setFilters] = useQueryStates({
    staff: parseAsString,
    date: parseAsString,
    analyticsPeriod: parseAsString,
  });

  // Convert date string to Date object
  const selectedDate = dateStr
    ? (() => {
        const parsed = parse(dateStr, "yyyy-MM-dd", new Date());
        return isValid(parsed) ? parsed : new Date();
      })()
    : new Date();

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDateStr(format(date, "yyyy-MM-dd"));
      setCalendarOpen(false);
    }
  };

  const loadStaffs = useCallback(async () => {
    try {
      const data = await staffService.getAll();
      setStaffs(data);
    } catch (error) {
      console.error("Failed to load staffs:", error);
      toast.error("Failed to load staffs");
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadStaffs();
    }
  }, [isAdmin, loadStaffs]);

  const analyticsRef = useRef<{ refetch: () => void }>(null);
  const mapRef = useRef<{ refetch: () => void }>(null);
  const listRef = useRef<{ refetch: () => void }>(null);

  const handleResetFilters = () => {
    // Clear all filter query params (keeps tab)
    setFilters({
      staff: null,
      date: null,
      analyticsPeriod: null,
    });
  };

  const handleRefetch = () => {
    analyticsRef.current?.refetch();
    loadStaffs(); // Reload staffs list
    const tab = activeTab || "map";
    switch (tab) {
      case "map":
        mapRef.current?.refetch();
        break;
      case "list":
        listRef.current?.refetch();
        break;
    }
    setRefetchKey((prev) => prev + 1);
  };

  if (isAdmin) {
    return (
      <div className="container mx-auto p-4 sm:p-6 max-w-7xl space-y-6">
        <AdminAttendanceAnalytics
          ref={analyticsRef}
          key={`analytics-${refetchKey}`}
        />

        <Tabs
          value={activeTab || "map"}
          onValueChange={(value) => setActiveTab(value as TabId)}
          className="w-full"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
            <TabsList className="grid w-full lg:w-auto grid-cols-2 flex-shrink-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
                    <Icon className="size-4" />
                    <span>{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:flex-1 lg:flex-initial min-w-0">
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full sm:w-1/2 lg:w-[240px] justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
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
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <div className="w-full sm:w-1/2 lg:w-[240px] min-w-0">
                <StaffSelector
                  staffs={staffs}
                  selectedStaffId={selectedStaffId || "all"}
                  onSelect={setSelectedStaffId}
                  placeholder="Select staff"
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="gap-2 flex-1 sm:flex-initial"
              >
                <RotateCcw className="size-4" />
                <span className="hidden sm:inline">Reset Filters</span>
                <span className="sm:hidden">Reset</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefetch}
                className="gap-2 flex-1 sm:flex-initial"
              >
                <RefreshCw className="size-4" />
                <span className="hidden sm:inline">Refetch</span>
                <span className="sm:hidden">Refresh</span>
              </Button>
            </div>
          </div>

          <TabsContent value="map" className="mt-0">
            <motion.div
              key={`map-${activeTab}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AdminAttendanceMap
                ref={mapRef}
                key={`map-${refetchKey}`}
                selectedStaffId={selectedStaffId || "all"}
                dateStr={dateStr || format(new Date(), "yyyy-MM-dd")}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <motion.div
              key={`list-${activeTab}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AdminAttendance
                ref={listRef}
                key={`list-${refetchKey}`}
                selectedStaffId={selectedStaffId || "all"}
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
      <StaffAttendance />
    </div>
  );
}
