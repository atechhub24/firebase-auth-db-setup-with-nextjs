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
import { attendanceService, staffService } from "@/lib/services";
import { StaffSelector } from "./staff-selector";
import type { Attendance } from "@/lib/types/attendance.type";
import type { User } from "@/lib/types/user.type";
import { formatDate, formatTime } from "@/lib/utils/date";
import { toast } from "sonner";

export function AdminAttendanceTable() {
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
          <CardTitle>All Staff Attendance</CardTitle>
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
        <CardTitle>All Staff Attendance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <StaffSelector
          staffs={staffs}
          selectedStaffId={selectedStaffId}
          onSelect={setSelectedStaffId}
          placeholder="Select staff"
          className="w-full sm:w-80"
        />

        {records.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No attendance records found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Name</TableHead>
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
                  <TableCell className="font-medium">
                    {record.staffName}
                  </TableCell>
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
        )}
      </CardContent>
    </Card>
  );
}

