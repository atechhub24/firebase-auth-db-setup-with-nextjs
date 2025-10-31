import { getArrFromObj } from "@ashirbad/js-core";
import { mutate } from "@atechhub/firebase";
import type {
  Attendance,
  AttendanceInput,
  AttendanceLocation,
  AttendanceAnalytics,
  AdminAnalytics,
} from "@/lib/types/attendance.type";

class AttendanceService {
  /**
   * Punch in - Create new attendance record
   */
  async punchIn(data: AttendanceInput): Promise<string> {
    const now = Date.now();
    const nowISO = new Date().toISOString();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Validate required fields
    if (!data.staffId || !data.staffName || !data.location) {
      throw new Error("Missing required fields for punch in");
    }

    // Validate location structure
    if (
      typeof data.location.lat !== "number" ||
      typeof data.location.lng !== "number" ||
      !data.location.address
    ) {
      throw new Error("Invalid location data");
    }

    const recordData = {
      staffId: data.staffId,
      staffName: data.staffName,
      date: today,
      punchInTime: now,
      punchInLocation: {
        lat: data.location.lat,
        lng: data.location.lng,
        address: data.location.address,
        ...(data.location.locationId && {
          locationId: data.location.locationId,
        }),
      },
      status: "present" as const,
      createdAt: nowISO,
      updatedAt: nowISO,
    };

    console.log("Creating attendance record with data:", {
      ...recordData,
      punchInLocation: {
        ...recordData.punchInLocation,
        address: recordData.punchInLocation.address.substring(0, 50) + "...",
      },
    });

    const recordId = await mutate({
      action: "createWithId",
      path: "attendance",
      data: recordData,
      actionBy: data.staffId,
    });

    console.log("Attendance record created with ID:", recordId);

    return recordId;
  }

  /**
   * Punch out - Update existing record with punch out time and location
   */
  async punchOut(
    recordId: string,
    location: AttendanceLocation
  ): Promise<void> {
    const record = await this.getById(recordId);
    if (!record) {
      throw new Error("Attendance record not found");
    }

    const punchOutTime = Date.now();
    const nowISO = new Date().toISOString();
    const totalHours =
      Math.round(
        ((punchOutTime - record.punchInTime) / (1000 * 60 * 60)) * 100
      ) / 100;

    await mutate({
      action: "update",
      path: `attendance/${recordId}`,
      data: {
        punchOutTime,
        punchOutLocation: location,
        totalHours,
        updatedAt: nowISO,
      },
      actionBy: record.staffId,
    });
  }

  /**
   * Get today's punch in record for a staff member
   */
  async getTodayPunchIn(staffId: string): Promise<Attendance | null> {
    const today = new Date().toISOString().split("T")[0];
    const records = await this.getByStaffId(staffId);
    return (
      records.find((record) => record.date === today && !record.punchOutTime) ||
      null
    );
  }

  /**
   * Get attendance record by ID
   */
  async getById(recordId: string): Promise<Attendance | null> {
    const data = await mutate({
      action: "get",
      path: `attendance/${recordId}`,
    });
    if (!data) return null;
    return {
      ...data,
      id: recordId,
    } as Attendance;
  }

  /**
   * Get all attendance records for a staff member
   */
  async getByStaffId(
    staffId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Attendance[]> {
    const data = await mutate({
      action: "get",
      path: "attendance",
    });

    const allRecords = getArrFromObj(data || {}) as unknown as Attendance[];
    let filtered = allRecords.filter((record) => record.staffId === staffId);

    if (startDate) {
      filtered = filtered.filter((record) => record.date >= startDate);
    }

    if (endDate) {
      filtered = filtered.filter((record) => record.date <= endDate);
    }

    // Sort by date descending
    return filtered.sort((a, b) => {
      if (a.date === b.date) {
        return b.punchInTime - a.punchInTime;
      }
      return b.date.localeCompare(a.date);
    });
  }

  /**
   * Get all attendance records for a specific date
   */
  async getByDate(date: string): Promise<Attendance[]> {
    const data = await mutate({
      action: "get",
      path: "attendance",
    });

    const allRecords = getArrFromObj(data || {}) as unknown as Attendance[];
    return allRecords
      .filter((record) => record.date === date)
      .sort((a, b) => a.punchInTime - b.punchInTime);
  }

  /**
   * Get all attendance records (admin view)
   */
  async getAll(startDate?: string, endDate?: string): Promise<Attendance[]> {
    const data = await mutate({
      action: "get",
      path: "attendance",
    });

    let allRecords = getArrFromObj(data || {}) as unknown as Attendance[];

    if (startDate) {
      allRecords = allRecords.filter((record) => record.date >= startDate);
    }

    if (endDate) {
      allRecords = allRecords.filter((record) => record.date <= endDate);
    }

    // Sort by date descending, then by punch in time
    return allRecords.sort((a, b) => {
      if (a.date === b.date) {
        return b.punchInTime - a.punchInTime;
      }
      return b.date.localeCompare(a.date);
    });
  }

  /**
   * Get staff analytics for a period
   */
  async getStaffAnalytics(
    staffId: string,
    period: "week" | "month"
  ): Promise<AttendanceAnalytics> {
    const now = new Date();
    const startDate = new Date();
    if (period === "week") {
      startDate.setDate(now.getDate() - 7);
    } else {
      startDate.setMonth(now.getMonth() - 1);
    }

    const startDateStr = startDate.toISOString().split("T")[0];
    const records = await this.getByStaffId(staffId, startDateStr);

    const completedRecords = records.filter(
      (record) => record.punchOutTime && record.totalHours
    );
    const totalHours = completedRecords.reduce(
      (sum, record) => sum + (record.totalHours || 0),
      0
    );
    const presentDays = new Set(records.map((r) => r.date)).size;
    const totalDays = Math.ceil(
      (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const absentDays = totalDays - presentDays;
    const averageHoursPerDay =
      presentDays > 0 ? Math.round((totalHours / presentDays) * 100) / 100 : 0;

    return {
      totalHours: Math.round(totalHours * 100) / 100,
      totalDays,
      presentDays,
      absentDays,
      averageHoursPerDay,
    };
  }

  /**
   * Get admin analytics for a period
   */
  async getAdminAnalytics(period: "week" | "month"): Promise<AdminAnalytics> {
    const now = new Date();
    const startDate = new Date();
    if (period === "week") {
      startDate.setDate(now.getDate() - 7);
    } else {
      startDate.setMonth(now.getMonth() - 1);
    }

    const startDateStr = startDate.toISOString().split("T")[0];
    const records = await this.getAll(startDateStr);

    const today = now.toISOString().split("T")[0];
    const todayRecords = records.filter((record) => record.date === today);
    const uniqueStaffIds = new Set(records.map((r) => r.staffId));
    const presentStaffIds = new Set(
      todayRecords.filter((r) => r.status === "present").map((r) => r.staffId)
    );

    const completedRecords = records.filter(
      (record) => record.punchOutTime && record.totalHours
    );
    const totalHours = completedRecords.reduce(
      (sum, record) => sum + (record.totalHours || 0),
      0
    );

    const averageHoursPerStaff =
      uniqueStaffIds.size > 0
        ? Math.round((totalHours / uniqueStaffIds.size) * 100) / 100
        : 0;

    return {
      totalStaff: uniqueStaffIds.size,
      presentStaff: presentStaffIds.size,
      absentStaff: uniqueStaffIds.size - presentStaffIds.size,
      averageHoursPerStaff,
      totalHours: Math.round(totalHours * 100) / 100,
    };
  }
}

export const attendanceService = new AttendanceService();
