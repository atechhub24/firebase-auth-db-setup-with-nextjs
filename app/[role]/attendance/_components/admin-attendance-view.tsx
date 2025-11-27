"use client";

import { format, isValid, parse } from "date-fns";
import { BarChart3, List, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { parseAsString, useQueryState } from "nuqs";
import { useCallback, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFirebaseRealtime } from "@/hooks/use-firebase-realtime";
import type { User } from "@/lib/types/user.type";
import { AdminAttendance } from "./admin-attendance";
import { AdminAttendanceAnalytics } from "./admin-attendance-analytics";
import { AdminAttendanceCharts } from "./admin-attendance-charts";
import { AdminAttendanceMap } from "./admin-attendance-map";
import { AttendanceFilters } from "./attendance-filters";

const tabs = [
  { id: "map", label: "Map", icon: MapPin },
  { id: "list", label: "List", icon: List },
  { id: "charts", label: "Charts", icon: BarChart3 },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function AdminAttendanceView() {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const { data: staffsData } = useFirebaseRealtime<User>("users", {
    asArray: true,
    filter: (user) => user.role === "staff",
  });

  const staffs = (staffsData as User[]) || [];

  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsString.withDefault("map"),
  );

  // Filter state management
  const [selectedStaffId, setSelectedStaffId] = useQueryState(
    "staff",
    parseAsString.withDefault("all"),
  );
  const [dateStr, setDateStr] = useQueryState(
    "date",
    parseAsString.withDefault(format(new Date(), "yyyy-MM-dd")),
  );


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
    [setDateStr],
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl space-y-6">
      <AdminAttendanceAnalytics />

      <Tabs
        value={activeTab || "map"}
        onValueChange={(value) => setActiveTab(value as TabId)}
        className="w-full"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
          <TabsList className="grid w-full lg:w-auto grid-cols-3 flex-shrink-0">
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
              selectedStaffId={selectedStaffId || "all"}
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="charts" className="mt-0">
          <motion.div
            key={`charts-${activeTab}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <AdminAttendanceCharts
              selectedStaffId={selectedStaffId || "all"}
              dateStr={dateStr || format(new Date(), "yyyy-MM-dd")}
            />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
