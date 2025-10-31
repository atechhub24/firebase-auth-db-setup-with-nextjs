"use client";

import { useAppStore } from "@/hooks/use-app-store";
import { AdminAttendanceView } from "./_components/admin-attendance-view";
import { StaffAttendance } from "./_components/staff-attendance";

export default function AttendancePage() {
  const user = useAppStore((state) => state.user);
  const isAdmin = user?.role === "admin";

  if (isAdmin) {
    return <AdminAttendanceView />;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
      <StaffAttendance />
    </div>
  );
}
