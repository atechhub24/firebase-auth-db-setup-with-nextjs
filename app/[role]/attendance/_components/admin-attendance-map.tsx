"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { attendanceService, staffService } from "@/lib/services";
import { StaffSelector } from "./staff-selector";
import type { Attendance } from "@/lib/types/attendance.type";
import type { User } from "@/lib/types/user.type";
import { toast } from "sonner";

const AttendanceMapClient = dynamic(
  () => import("./attendance-map-client").then((mod) => ({ default: mod.AttendanceMapClient })),
  { ssr: false }
);

export function AdminAttendanceMap() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [staffs, setStaffs] = useState<User[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStaffs();
    loadRecords();
  }, []);

  useEffect(() => {
    loadRecords();
  }, [selectedStaffId]);

  const loadStaffs = async () => {
    try {
      const data = await staffService.getAll();
      setStaffs(data);
    } catch (error) {
      console.error("Failed to load staffs:", error);
      toast.error("Failed to load staffs");
    }
  };

  const loadRecords = async () => {
    try {
      setLoading(true);
      let data: Attendance[];
      if (selectedStaffId === "all") {
        data = await attendanceService.getAll();
      } else {
        data = await attendanceService.getByStaffId(selectedStaffId);
      }
      setRecords(data);
    } catch (error) {
      console.error("Failed to load attendance records:", error);
      toast.error("Failed to load attendance records");
    } finally {
      setLoading(false);
    }
  };

  if (loading && records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Staff Attendance Map</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="size-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Staff Attendance Map</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <StaffSelector
          staffs={staffs}
          selectedStaffId={selectedStaffId}
          onSelect={setSelectedStaffId}
          placeholder="Select staff"
        />

        {records.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No attendance records found
          </div>
        ) : (
          <>
            <AttendanceMapClient records={records} showStaffName />
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="size-4 rounded-full bg-green-500 border-2 border-white shadow" />
                <span>Punch In</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-4 rounded-full bg-red-500 border-2 border-white shadow" />
                <span>Punch Out</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

