"use client";

import { useRef, useState } from "react";
import { useQueryState, parseAsString, useQueryStates } from "nuqs";
import { motion, AnimatePresence } from "motion/react";
import { RotateCcw, RefreshCw, MapPin, List } from "lucide-react";
import { useAppStore } from "@/hooks/use-app-store";
import { StaffAttendance } from "./_components/staff-attendance";
import { AdminAttendanceAnalytics } from "./_components/admin-attendance-analytics";
import { AdminAttendance } from "./_components/admin-attendance";
import { AdminAttendanceMap } from "./_components/admin-attendance-map";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const tabs = [
  { id: "map", label: "Map", icon: MapPin },
  { id: "list", label: "List", icon: List },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function AttendancePage() {
  const user = useAppStore((state) => state.user);
  const isAdmin = user?.role === "admin";
  const [refetchKey, setRefetchKey] = useState(0);

  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsString.withDefault("map")
  );

  // Get all query state setters for reset
  const [, setFilters] = useQueryStates({
    staff: parseAsString,
    date: parseAsString,
    analyticsPeriod: parseAsString,
  });

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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-2">
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

            <div className="flex items-center gap-2 w-full sm:w-auto">
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

          <AnimatePresence mode="wait">
            <TabsContent value="map" className="mt-0">
              <motion.div
                key="map"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <AdminAttendanceMap ref={mapRef} key={`map-${refetchKey}`} />
              </motion.div>
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <AdminAttendance ref={listRef} key={`list-${refetchKey}`} />
              </motion.div>
            </TabsContent>
          </AnimatePresence>
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
