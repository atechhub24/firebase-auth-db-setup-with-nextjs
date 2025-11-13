"use client";

import {
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useQueryState, parseAsString } from "nuqs";
import { Users, Clock, TrendingUp, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { attendanceService } from "@/lib/services";
import type { AdminAnalytics } from "@/lib/types/attendance.type";
import { toast } from "sonner";

export interface AdminAttendanceAnalyticsRef {
  refetch: () => void;
}

export const AdminAttendanceAnalytics = forwardRef<AdminAttendanceAnalyticsRef>(
  (_, ref) => {
    const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
    const [loading, setLoading] = useState(true);

    // URL state management
    const [period, setPeriod] = useQueryState(
      "analyticsPeriod",
      parseAsString.withDefault("week").withOptions({
        clearOnDefault: true,
      }),
    );

    const loadAnalytics = useCallback(async () => {
      try {
        setLoading(true);
        const data = await attendanceService.getAdminAnalytics(
          (period as "week" | "month") || "week",
        );
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to load analytics:", error);
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }, [period]);

    useEffect(() => {
      loadAnalytics();
    }, [loadAnalytics]);

    useImperativeHandle(ref, () => ({
      refetch: loadAnalytics,
    }));

    if (loading) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Organization Analytics</CardTitle>
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
            <CardTitle>Organization Analytics</CardTitle>
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
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="size-4" />
                <span>Total Staff</span>
              </div>
              <div className="text-2xl font-bold">{analytics.totalStaff}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="size-4" />
                <span>Present</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {analytics.presentStaff}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="size-4" />
                <span>Absent</span>
              </div>
              <div className="text-2xl font-bold text-red-600">
                {analytics.absentStaff}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4" />
                <span>Total Hours</span>
              </div>
              <div className="text-2xl font-bold">{analytics.totalHours}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="size-4" />
                <span>Avg Hours/Staff</span>
              </div>
              <div className="text-2xl font-bold">
                {analytics.averageHoursPerStaff}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
);

AdminAttendanceAnalytics.displayName = "AdminAttendanceAnalytics";
