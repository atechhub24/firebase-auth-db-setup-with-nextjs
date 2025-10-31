"use client";

import { Loader2, MapPin, Clock, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/hooks/use-app-store";
import { attendanceService } from "@/lib/services";
import type { Attendance } from "@/lib/types/attendance.type";
import { formatDate, formatTime } from "@/lib/utils/date";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function AttendanceHistory() {
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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {records.map((record, index) => (
            <motion.div
              key={record.id}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative overflow-hidden rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Status indicator bar */}
              <div
                className={`absolute left-0 top-0 h-full w-1 ${
                  record.status === "present"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              />

              <div className="ml-3 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-muted-foreground" />
                      <span className="font-semibold text-sm">
                        {formatDate(record.punchInTime, "PP")}
                      </span>
                    </div>
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                        record.status === "present"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {record.status === "present" ? (
                        <CheckCircle2 className="size-3" />
                      ) : (
                        <XCircle className="size-3" />
                      )}
                      <span className="capitalize">{record.status}</span>
                    </div>
                  </div>
                </div>

                {/* Time information */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="size-4 text-muted-foreground shrink-0" />
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">
                        In: {formatTime(record.punchInTime)}
                      </span>
                      {record.punchOutTime && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <span className="font-medium">
                            Out: {formatTime(record.punchOutTime)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {record.totalHours && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1.5 rounded-md bg-muted px-2 py-1">
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {record.totalHours}h
                        </span>
                        <span className="text-xs text-muted-foreground">
                          worked
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Location */}
                {record.punchInLocation && (
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <MapPin className="size-3.5 mt-0.5 shrink-0" />
                    <span className="line-clamp-2 leading-relaxed">
                      {record.punchInLocation.address}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
}

