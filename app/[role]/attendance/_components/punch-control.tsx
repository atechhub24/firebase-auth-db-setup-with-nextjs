"use client";

import { useEffect, useState, useCallback } from "react";
import { Clock, MapPin, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAppStore } from "@/hooks/use-app-store";
import { attendanceService } from "@/lib/services";
import { getCurrentLocation } from "@/lib/utils/location";
import { formatDateTime } from "@/lib/utils/date";
import type { Attendance } from "@/lib/types/attendance.type";
import { toast } from "sonner";

export function PunchControl() {
  const user = useAppStore((state) => state.user);
  const [todayRecord, setTodayRecord] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(true);
  const [punching, setPunching] = useState(false);
  const [locationPermission, setLocationPermission] = useState<
    "granted" | "denied" | "prompt" | "checking"
  >("checking");

  const loadTodayRecord = useCallback(async () => {
    if (!user?.uid) return;

    try {
      const record = await attendanceService.getTodayPunchIn(user.uid);
      setTodayRecord(record);
    } catch (error) {
      console.error("Failed to load today's record:", error);
      toast.error("Failed to load attendance record");
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  const checkLocationPermission = useCallback(async () => {
    if (!navigator.permissions) {
      setLocationPermission("prompt");
      return;
    }

    try {
      const result = await navigator.permissions.query({
        name: "geolocation" as PermissionName,
      });
      setLocationPermission(
        result.state === "granted"
          ? "granted"
          : result.state === "denied"
          ? "denied"
          : "prompt"
      );

      result.onchange = () => {
        setLocationPermission(
          result.state === "granted"
            ? "granted"
            : result.state === "denied"
            ? "denied"
            : "prompt"
        );
      };
    } catch {
      setLocationPermission("prompt");
    }
  }, []);

  useEffect(() => {
    checkLocationPermission();
    loadTodayRecord();
  }, [checkLocationPermission, loadTodayRecord]);

  const requestLocationPermission = async () => {
    try {
      await getCurrentLocation();
      await checkLocationPermission();
      toast.success("Location permission granted");
    } catch {
      toast.error("Location permission denied");
      await checkLocationPermission();
    }
  };

  const handlePunchIn = async () => {
    if (!user?.uid || !user?.name) {
      toast.error("User information not available");
      return;
    }

    setPunching(true);
    try {
      const location = await getCurrentLocation();
      console.log("Punching in with location:", location);

      const recordId = await attendanceService.punchIn({
        staffId: user.uid,
        staffName: user.name,
        location,
      });

      console.log("Punch in successful, record ID:", recordId);

      // Reload today's record to verify it was saved
      const updatedRecord = await attendanceService.getTodayPunchIn(user.uid);
      setTodayRecord(updatedRecord);

      // Verify the record was saved correctly
      if (updatedRecord) {
        console.log("Today's record after punch in:", {
          id: updatedRecord.id,
          staffId: updatedRecord.staffId,
          staffName: updatedRecord.staffName,
          date: updatedRecord.date,
          punchInTime: updatedRecord.punchInTime,
          punchInLocation: updatedRecord.punchInLocation,
          status: updatedRecord.status,
        });
      } else {
        console.warn(
          "Record not found after punch in - this might indicate a save issue"
        );
      }

      toast.success("Punched in successfully");
    } catch (error) {
      console.error("Punch in error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to punch in";
      toast.error(message);
    } finally {
      setPunching(false);
    }
  };

  const handlePunchOut = async () => {
    if (!todayRecord?.id) {
      toast.error("No punch in record found");
      return;
    }

    setPunching(true);
    try {
      const location = await getCurrentLocation();
      await attendanceService.punchOut(todayRecord.id, location);

      await loadTodayRecord();
      toast.success("Punched out successfully");
    } catch (error) {
      console.error("Punch out error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to punch out";
      toast.error(message);
    } finally {
      setPunching(false);
    }
  };

  const canPunchIn = !todayRecord && locationPermission === "granted";
  const canPunchOut =
    todayRecord &&
    !todayRecord.punchOutTime &&
    locationPermission === "granted";

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="size-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Punch In/Out</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {locationPermission === "denied" && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Location Permission Required</AlertTitle>
            <AlertDescription>
              Location access is required to track attendance. Please grant
              location permission to continue.
            </AlertDescription>
          </Alert>
        )}

        {locationPermission === "prompt" && (
          <Alert>
            <AlertCircle />
            <AlertTitle>Location Permission Needed</AlertTitle>
            <AlertDescription>
              <Button
                variant="outline"
                size="sm"
                onClick={requestLocationPermission}
                className="mt-2"
              >
                Request Location Permission
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {todayRecord && (
          <div className="space-y-2 rounded-lg border p-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="size-4" />
              <span className="font-medium">Punch In:</span>
              <span>{formatDateTime(todayRecord.punchInTime)}</span>
            </div>
            {todayRecord.punchInLocation && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="size-4 mt-0.5" />
                <div>
                  <span className="font-medium">Location:</span>
                  <p className="text-muted-foreground">
                    {todayRecord.punchInLocation.address}
                  </p>
                </div>
              </div>
            )}
            {todayRecord.punchOutTime && (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="size-4" />
                  <span className="font-medium">Punch Out:</span>
                  <span>{formatDateTime(todayRecord.punchOutTime)}</span>
                </div>
                {todayRecord.punchOutLocation && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="size-4 mt-0.5" />
                    <div>
                      <span className="font-medium">Location:</span>
                      <p className="text-muted-foreground">
                        {todayRecord.punchOutLocation.address}
                      </p>
                    </div>
                  </div>
                )}
                {todayRecord.totalHours && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="size-4" />
                    <span className="font-medium">Total Hours:</span>
                    <span>{todayRecord.totalHours} hours</span>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handlePunchIn}
            disabled={!canPunchIn || punching}
            className="flex-1"
          >
            {punching ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Punch In"
            )}
          </Button>
          <Button
            onClick={handlePunchOut}
            disabled={!canPunchOut || punching}
            variant="destructive"
            className="flex-1"
          >
            {punching ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Punch Out"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
