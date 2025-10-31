"use client";

import { PunchControl } from "./punch-control";
import { AttendanceStats } from "./attendance-stats";
import { AttendanceAnalytics } from "./attendance-analytics";
import { AttendanceMap } from "./attendance-map";
import { AttendanceHistory } from "./attendance-history";

export function StaffAttendance() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <PunchControl />
        <AttendanceStats />
      </div>
      <AttendanceAnalytics />
      <AttendanceMap />
      <AttendanceHistory />
    </div>
  );
}
