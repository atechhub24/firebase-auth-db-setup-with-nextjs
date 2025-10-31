"use client";

import { useEffect, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppStore } from "@/hooks/use-app-store";
import { attendanceService } from "@/lib/services";
import type { Attendance } from "@/lib/types/attendance.type";
import { formatDate, formatTime } from "@/lib/utils/date";
import { toast } from "sonner";

export function AttendanceHistoryTable() {
  const user = useAppStore((state) => state.user);
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      loadRecords();
    }
  }, [user?.uid]);

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
          <CardTitle>Attendance History</CardTitle>
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
          <CardTitle>Attendance History</CardTitle>
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
        <CardTitle>Attendance History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Punch In</TableHead>
              <TableHead>Punch Out</TableHead>
              <TableHead>Total Hours</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  {formatDate(record.punchInTime, "PP")}
                </TableCell>
                <TableCell>
                  {formatTime(record.punchInTime)}
                </TableCell>
                <TableCell>
                  {formatTime(record.punchOutTime)}
                </TableCell>
                <TableCell>
                  {record.totalHours ? `${record.totalHours}h` : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex items-start gap-1 max-w-[200px]">
                    <MapPin className="size-3 mt-1 shrink-0" />
                    <span className="text-xs truncate">
                      {record.punchInLocation.address}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      record.status === "present"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {record.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

