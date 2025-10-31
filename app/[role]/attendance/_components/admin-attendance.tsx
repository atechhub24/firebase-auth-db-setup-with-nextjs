"use client";

import { useEffect, useState } from "react";
import { Loader2, MapPin, Clock, Calendar, CheckCircle2, XCircle, User } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { attendanceService, staffService } from "@/lib/services";
import { StaffSelector } from "./staff-selector";
import type { Attendance } from "@/lib/types/attendance.type";
import type { User as UserType } from "@/lib/types/user.type";
import { formatDate, formatTime } from "@/lib/utils/date";
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

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function AdminAttendance() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [staffs, setStaffs] = useState<UserType[]>([]);
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
                    {/* Header with staff info */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Avatar className="size-10 shrink-0">
                          <AvatarImage
                            src={staffInfo?.profilePicture}
                            alt={record.staffName}
                          />
                          <AvatarFallback className="text-xs">
                            {getInitials(record.staffName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-sm truncate">
                            {record.staffName}
                          </div>
                          {staffInfo?.email && (
                            <div className="text-xs text-muted-foreground truncate">
                              {staffInfo.email}
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${
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

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="size-4 text-muted-foreground shrink-0" />
                      <span className="font-medium">
                        {formatDate(record.punchInTime, "PP")}
                      </span>
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
              );
            })}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

