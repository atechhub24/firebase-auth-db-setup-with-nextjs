"use client";

import { PunchControl } from "./punch-control";
import { AttendanceStats } from "./attendance-stats";
import { AttendanceAnalytics } from "./attendance-analytics";
import { AttendanceMap } from "./attendance-map";
import { AttendanceHistoryTable } from "./attendance-history-table";

export function StaffAttendance() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <PunchControl />
        <AttendanceStats />
      </div>
      <AttendanceAnalytics />
      <AttendanceMap />
      <AttendanceHistoryTable />
    </div>
  );
}

