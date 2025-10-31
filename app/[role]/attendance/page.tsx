"use client";

import { useAppStore } from "@/hooks/use-app-store";
import { StaffAttendance } from "./_components/staff-attendance";
import { AdminAttendanceAnalytics } from "./_components/admin-attendance-analytics";
import { AdminAttendance } from "./_components/admin-attendance";
import { AdminAttendanceMap } from "./_components/admin-attendance-map";

export default function AttendancePage() {
  const user = useAppStore((state) => state.user);
  const isAdmin = user?.role === "admin";

  if (isAdmin) {
    return (
      <div className="container mx-auto p-4 sm:p-6 space-y-6 max-w-7xl">
        <AdminAttendanceAnalytics />
        <AdminAttendanceMap />
        <AdminAttendance />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
      <StaffAttendance />
    </div>
  );
}
