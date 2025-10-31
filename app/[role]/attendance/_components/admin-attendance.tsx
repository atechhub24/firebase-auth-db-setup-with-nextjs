"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { attendanceService, staffService } from "@/lib/services";
import { StaffSelector } from "./staff-selector";
import { AttendanceCard } from "./attendance-card";
import type { Attendance } from "@/lib/types/attendance.type";
import type { User as UserType } from "@/lib/types/user.type";
import { toast } from "sonner";

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

export function AdminAttendance() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [staffs, setStaffs] = useState<UserType[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const loadStaffs = useCallback(async () => {
    try {
      const data = await staffService.getAll();
      setStaffs(data);
    } catch (error) {
      console.error("Failed to load staffs:", error);
      toast.error("Failed to load staffs");
    }
  }, []);

  const loadRecords = useCallback(async () => {
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
  }, [selectedStaffId]);

  useEffect(() => {
    loadStaffs();
  }, [loadStaffs]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const getStaffInfo = (staffId: string) => {
    return staffs.find((staff) => staff.uid === staffId);
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
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {records.map((record) => {
              const staffInfo = getStaffInfo(record.staffId);
              return (
                <AttendanceCard
                  key={record.id}
                  record={record}
                  staffInfo={staffInfo}
                  showStaffInfo={true}
                />
              );
            })}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
