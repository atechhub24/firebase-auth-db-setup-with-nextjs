"use client";

import { useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PunchControl } from "./punch-control";
import { AttendanceStats } from "./attendance-stats";
import { AttendanceAnalytics } from "./attendance-analytics";
import { AttendanceMap } from "./attendance-map";
import { AttendanceHistory } from "./attendance-history";

export function StaffAttendance() {
  const [refetchKey, setRefetchKey] = useState(0);
  const punchControlRef = useRef<{ refetch: () => void }>(null);
  const attendanceStatsRef = useRef<{ refetch: () => void }>(null);
  const attendanceAnalyticsRef = useRef<{ refetch: () => void }>(null);
  const attendanceMapRef = useRef<{ refetch: () => void }>(null);
  const attendanceHistoryRef = useRef<{ refetch: () => void }>(null);

  const handleRefresh = () => {
    punchControlRef.current?.refetch();
    attendanceStatsRef.current?.refetch();
    attendanceAnalyticsRef.current?.refetch();
    attendanceMapRef.current?.refetch();
    attendanceHistoryRef.current?.refetch();
    setRefetchKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Attendance</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="gap-2"
        >
          <RefreshCw className="size-4" />
          Refresh
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <PunchControl ref={punchControlRef} key={`punch-${refetchKey}`} />
        <AttendanceStats ref={attendanceStatsRef} key={`stats-${refetchKey}`} />
      </div>
      <AttendanceAnalytics
        ref={attendanceAnalyticsRef}
        key={`analytics-${refetchKey}`}
      />
      <AttendanceMap ref={attendanceMapRef} key={`map-${refetchKey}`} />
      <AttendanceHistory
        ref={attendanceHistoryRef}
        key={`history-${refetchKey}`}
      />
    </div>
  );
}
