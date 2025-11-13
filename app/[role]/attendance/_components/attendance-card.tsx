"use client";

import { MapPin, Clock, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Attendance } from "@/lib/types/attendance.type";
import type { User } from "@/lib/types/user.type";
import { formatDate, formatTime } from "@/lib/utils/date";

interface AttendanceCardProps {
  record: Attendance;
  staffInfo?: User;
  showStaffInfo?: boolean;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export function AttendanceCard({
  record,
  staffInfo,
  showStaffInfo = false,
}: AttendanceCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Status indicator bar */}
      <div
        className={`absolute left-0 top-0 h-full w-1 ${
          record.status === "present" ? "bg-green-500" : "bg-red-500"
        }`}
      />

      <div className="ml-3 space-y-3">
        {/* Header */}
        {showStaffInfo && staffInfo ? (
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Avatar className="size-10 shrink-0">
                <AvatarImage
                  src={staffInfo.profilePicture}
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
                {staffInfo.email && (
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
        ) : (
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
        )}

        {/* Date - only show if staff info is shown */}
        {showStaffInfo && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="size-4 text-muted-foreground shrink-0" />
            <span className="font-medium">
              {formatDate(record.punchInTime, "PP")}
            </span>
          </div>
        )}

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
                <span className="text-xs text-muted-foreground">worked</span>
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
}
