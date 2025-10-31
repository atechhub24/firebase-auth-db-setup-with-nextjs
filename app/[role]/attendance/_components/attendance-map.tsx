"use client";

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/hooks/use-app-store";
import { attendanceService } from "@/lib/services";
import type { Attendance } from "@/lib/types/attendance.type";
import { toast } from "sonner";

const AttendanceMapClient = dynamic(
  () => import("./attendance-map-client").then((mod) => ({ default: mod.AttendanceMapClient })),
  { ssr: false }
);

export interface AttendanceMapRef {
  refetch: () => void;
}

export const AttendanceMap = forwardRef<AttendanceMapRef>((_, ref) => {
  const user = useAppStore((state) => state.user);
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      loadRecords();
    }
  }, [user?.uid]);

  useImperativeHandle(ref, () => ({
    refetch: loadRecords,
  }));

  const loadRecords = async () => {
    if (!user?.uid) return;

    try {
      const data = await attendanceService.getByStaffId(user.uid);
      setRecords(data);
    } catch (error) {
      console.error("Failed to load attendance records:", error);
      toast.error("Failed to load attendance records");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance Map</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="size-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance Map</CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center text-muted-foreground">
          No attendance records found
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Map</CardTitle>
      </CardHeader>
      <CardContent>
        <AttendanceMapClient records={records} />
        <div className="mt-4 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="size-4 rounded-full bg-green-500 border-2 border-white shadow" />
            <span>Punch In</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-4 rounded-full bg-red-500 border-2 border-white shadow" />
            <span>Punch Out</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

AttendanceMap.displayName = "AttendanceMap";

