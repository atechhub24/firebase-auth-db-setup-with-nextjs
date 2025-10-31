"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useQueryState, parseAsString, useQueryStates } from "nuqs";
import { motion } from "motion/react";
import { MapPin, List } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { useAppStore } from "@/hooks/use-app-store";
import { StaffAttendance } from "./_components/staff-attendance";
import { AdminAttendanceAnalytics } from "./_components/admin-attendance-analytics";
import { AdminAttendance } from "./_components/admin-attendance";
import { AdminAttendanceMap } from "./_components/admin-attendance-map";
import { AttendanceFilters } from "./_components/attendance-filters";
import { AttendanceActions } from "./_components/attendance-actions";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { staffService } from "@/lib/services";
import type { User } from "@/lib/types/user.type";
import { toast } from "sonner";

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

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        setDateStr(format(date, "yyyy-MM-dd"));
        setCalendarOpen(false);
      }
    },
    [setDateStr]
  );

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

            <AttendanceFilters
              selectedDate={selectedDate}
              selectedStaffId={selectedStaffId || "all"}
              staffs={staffs}
              calendarOpen={calendarOpen}
              onDateSelect={handleDateSelect}
              onStaffSelect={setSelectedStaffId}
              onCalendarOpenChange={setCalendarOpen}
            />

            <AttendanceActions
              onResetFilters={handleResetFilters}
              onRefetch={handleRefetch}
            />
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
