"use client";

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Clock, Calendar, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/hooks/use-app-store";
import { attendanceService } from "@/lib/services";
import { formatTime } from "@/lib/utils/date";
import type { Attendance } from "@/lib/types/attendance.type";
import { toast } from "sonner";

export interface AttendanceStatsRef {
  refetch: () => void;
}

export const AttendanceStats = forwardRef<AttendanceStatsRef>((_, ref) => {
  const user = useAppStore((state) => state.user);
  const [todayRecord, setTodayRecord] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTodayRecord = async () => {
    if (!user?.uid) return;

    try {
      const record = await attendanceService.getTodayPunchIn(user.uid);
      setTodayRecord(record);
    } catch (error) {
      console.error("Failed to load today's record:", error);
      toast.error("Failed to load attendance record");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      loadTodayRecord();
    }
  }, [user?.uid]);

  useImperativeHandle(ref, () => ({
    refetch: loadTodayRecord,
  }));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Status</CardTitle>
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
        <CardTitle>Today&apos;s Status</CardTitle>
      </CardHeader>
      <CardContent>
        {todayRecord ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  todayRecord.status === "present"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {todayRecord.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4" />
                <span>Punch In</span>
              </div>
              <span className="font-medium">
                {formatTime(todayRecord.punchInTime)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4" />
                <span>Punch Out</span>
              </div>
              <span className="font-medium">
                {todayRecord.punchOutTime
                  ? formatTime(todayRecord.punchOutTime)
                  : "Not punched out"}
              </span>
            </div>
            {todayRecord.punchOutTime && todayRecord.totalHours && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="size-4" />
                  <span>Total Hours</span>
                </div>
                <span className="font-medium">
                  {todayRecord.totalHours}h
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No attendance record for today
          </div>
        )}
      </CardContent>
    </Card>
  );
});

AttendanceStats.displayName = "AttendanceStats";

