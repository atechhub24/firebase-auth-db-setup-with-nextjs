"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { CalendarIcon, Loader2, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { attendanceService, staffService } from "@/lib/services";
import { StaffSelector } from "./staff-selector";
import { formatTime } from "@/lib/utils/date";
import type { Attendance } from "@/lib/types/attendance.type";
import type { User } from "@/lib/types/user.type";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AttendanceMapClient = dynamic(
  () => import("./attendance-map-client").then((mod) => ({ default: mod.AttendanceMapClient })),
  { ssr: false }
);

export function AdminAttendanceMap() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [staffs, setStaffs] = useState<User[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    loadStaffs();
    loadRecords();
  }, []);

  useEffect(() => {
    loadRecords();
  }, [selectedStaffId, selectedDate]);

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
      const dateStr = format(selectedDate, "yyyy-MM-dd");
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
  };

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
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <CardTitle>Attendance Map</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[240px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                      setCalendarOpen(false);
                    }
                  }}
                  modifiers={{
                    hasRecords: (date) =>
                      dateWithRecords.has(format(date, "yyyy-MM-dd")),
                  }}
                  modifiersClassNames={{
                    hasRecords: "bg-green-100 dark:bg-green-900",
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <StaffSelector
              staffs={staffs}
              selectedStaffId={selectedStaffId}
              onSelect={setSelectedStaffId}
              placeholder="Select staff"
              className="w-full sm:w-[240px]"
            />
          </div>
        </div>
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
}
