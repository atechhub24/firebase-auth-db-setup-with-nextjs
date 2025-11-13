"use client";

import {
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import dynamic from "next/dynamic";
import { Loader2, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { attendanceService } from "@/lib/services";
import { formatTime } from "@/lib/utils/date";
import type { Attendance } from "@/lib/types/attendance.type";
import { format, parse, isValid } from "date-fns";
import { toast } from "sonner";

const AttendanceMapClient = dynamic(
  () =>
    import("./attendance-map-client").then((mod) => ({
      default: mod.AttendanceMapClient,
    })),
  { ssr: false },
);

export interface AdminAttendanceMapRef {
  refetch: () => void;
}

interface AdminAttendanceMapProps {
  selectedStaffId: string;
  dateStr: string;
}

export const AdminAttendanceMap = forwardRef<
  AdminAttendanceMapRef,
  AdminAttendanceMapProps
>(({ selectedStaffId, dateStr }, ref) => {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  // Convert date string to Date object
  const selectedDate = dateStr
    ? (() => {
        const parsed = parse(dateStr, "yyyy-MM-dd", new Date());
        return isValid(parsed) ? parsed : new Date();
      })()
    : new Date();

  const loadRecords = useCallback(async () => {
    if (!dateStr) return;

    try {
      setLoading(true);
      let data: Attendance[];

      if (selectedStaffId === "all") {
        data = await attendanceService.getByDate(dateStr);
      } else {
        const allData = await attendanceService.getByStaffId(selectedStaffId);
        data = allData.filter((record) => record.date === dateStr);
      }

      setRecords(data);
    } catch (error) {
      console.error("Failed to load attendance records:", error);
      toast.error("Failed to load attendance records");
    } finally {
      setLoading(false);
    }
  }, [selectedStaffId, dateStr]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  useImperativeHandle(ref, () => ({
    refetch: loadRecords,
  }));

  const dateWithRecords = new Set(records.map((r) => r.date));

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
        <CardTitle>Attendance Map</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {records.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No attendance records found for {format(selectedDate, "PP")}
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-[1fr_300px]">
              <div className="space-y-2">
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
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">
                  {format(selectedDate, "PP")} - Records ({records.length})
                </h3>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {records.map((record) => (
                    <div
                      key={record.id}
                      className="rounded-lg border p-3 text-sm space-y-1"
                    >
                      <div className="font-medium">{record.staffName}</div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          <span>In: {formatTime(record.punchInTime)}</span>
                        </div>
                        {record.punchOutTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="size-3" />
                            <span>Out: {formatTime(record.punchOutTime)}</span>
                          </div>
                        )}
                      </div>
                      {record.totalHours && (
                        <div className="text-xs font-medium text-green-600 dark:text-green-400">
                          {record.totalHours}h worked
                        </div>
                      )}
                      {record.punchInLocation && (
                        <div className="flex items-start gap-1 text-xs text-muted-foreground">
                          <MapPin className="size-3 mt-0.5 shrink-0" />
                          <span className="line-clamp-2">
                            {record.punchInLocation.address}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
});

AdminAttendanceMap.displayName = "AdminAttendanceMap";
