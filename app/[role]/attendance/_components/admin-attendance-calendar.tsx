"use client";

import { useEffect, useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { attendanceService } from "@/lib/services";
import { formatDate, formatTime } from "@/lib/utils/date";
import type { Attendance } from "@/lib/types/attendance.type";
import { format } from "date-fns";
import { toast } from "sonner";

export function AdminAttendanceCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      loadRecords();
    }
  }, [selectedDate]);

  const loadRecords = async () => {
    if (!selectedDate) return;

    try {
      setLoading(true);
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const data = await attendanceService.getByDate(dateStr);
      setRecords(data);
    } catch (error) {
      console.error("Failed to load attendance records:", error);
      toast.error("Failed to load attendance records");
    } finally {
      setLoading(false);
    }
  };

  const dateWithRecords = new Set(records.map((r) => r.date));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Calendar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CalendarComponent
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          modifiers={{
            hasRecords: (date) =>
              dateWithRecords.has(format(date, "yyyy-MM-dd")),
          }}
          modifiersClassNames={{
            hasRecords: "bg-green-100 dark:bg-green-900",
          }}
        />
        {selectedDate && (
          <div className="space-y-2">
            <h3 className="font-semibold">
              {format(selectedDate, "PP")} - Attendance Records
            </h3>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="size-4 animate-spin" />
              </div>
            ) : records.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No attendance records for this date
              </p>
            ) : (
              <div className="space-y-2">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="rounded-lg border p-3 text-sm"
                  >
                    <div className="font-medium">{record.staffName}</div>
                    <div className="text-muted-foreground">
                      Punch In: {formatTime(record.punchInTime)}
                      {record.punchOutTime && (
                        <> | Punch Out: {formatTime(record.punchOutTime)}</>
                      )}
                      {record.totalHours && <> | Hours: {record.totalHours}h</>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
