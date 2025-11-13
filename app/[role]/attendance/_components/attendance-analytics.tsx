"use client";

import {
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useQueryState, parseAsString } from "nuqs";
import { Clock, Calendar, TrendingUp, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/hooks/use-app-store";
import { attendanceService } from "@/lib/services";
import type { AttendanceAnalytics as AttendanceAnalyticsType } from "@/lib/types/attendance.type";
import { toast } from "sonner";

export interface AttendanceAnalyticsRef {
  refetch: () => void;
}

export const AttendanceAnalytics = forwardRef<AttendanceAnalyticsRef>(
  (_, ref) => {
    const user = useAppStore((state) => state.user);
    const [analytics, setAnalytics] = useState<AttendanceAnalyticsType | null>(
      null,
    );
    const [loading, setLoading] = useState(true);

    // URL state management
    const [period, setPeriod] = useQueryState(
      "analyticsPeriod",
      parseAsString.withDefault("week").withOptions({
        clearOnDefault: true,
      }),
    );

    const loadAnalytics = useCallback(async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);
        const data = await attendanceService.getStaffAnalytics(
          user.uid,
          (period as "week" | "month") || "week",
        );
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to load analytics:", error);
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }, [user?.uid, period]);

    useEffect(() => {
      if (user?.uid) {
        loadAnalytics();
      }
    }, [user?.uid, loadAnalytics]);

    useImperativeHandle(ref, () => ({
      refetch: loadAnalytics,
    }));

    if (loading) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="size-6 animate-spin" />
          </CardContent>
        </Card>
      );
    }

    if (!analytics) {
      return null;
    }

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Analytics</CardTitle>
            <Select
              value={period || "week"}
              onValueChange={(v) => setPeriod(v as "week" | "month")}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4" />
                <span>Total Hours</span>
              </div>
              <div className="text-2xl font-bold">{analytics.totalHours}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="size-4" />
                <span>Present Days</span>
              </div>
              <div className="text-2xl font-bold">{analytics.presentDays}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="size-4" />
                <span>Absent Days</span>
              </div>
              <div className="text-2xl font-bold">{analytics.absentDays}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="size-4" />
                <span>Avg Hours/Day</span>
              </div>
              <div className="text-2xl font-bold">
                {analytics.averageHoursPerDay}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
);

AttendanceAnalytics.displayName = "AttendanceAnalytics";
