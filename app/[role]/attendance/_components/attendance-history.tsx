"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/hooks/use-app-store";
import { attendanceService } from "@/lib/services";
import { AttendanceCard, cardVariants } from "./attendance-card";
import type { Attendance } from "@/lib/types/attendance.type";

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

export interface AttendanceHistoryRef {
  refetch: () => void;
}

export const AttendanceHistory = forwardRef<AttendanceHistoryRef>((_, ref) => {
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
          {records.map((record) => (
            <AttendanceCard key={record.id} record={record} />
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
});

AttendanceHistory.displayName = "AttendanceHistory";
