import { format, isValid } from "date-fns";

/**
 * Safely format a timestamp to a date string
 * Handles invalid timestamps gracefully
 */
export function formatDate(
  timestamp: number | string | undefined | null,
  formatStr: string = "PP",
): string {
  if (!timestamp) return "-";

  try {
    // Convert to number if it's a string
    const numTimestamp =
      typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp;

    // Check if it's a valid number
    if (Number.isNaN(numTimestamp) || numTimestamp <= 0) {
      return "-";
    }

    const date = new Date(numTimestamp);

    // Check if date is valid
    if (!isValid(date)) {
      return "-";
    }

    return format(date, formatStr);
  } catch {
    return "-";
  }
}

/**
 * Safely format a timestamp to a time string
 */
export function formatTime(
  timestamp: number | string | undefined | null,
): string {
  return formatDate(timestamp, "p");
}

/**
 * Safely format a timestamp to a date and time string
 */
export function formatDateTime(
  timestamp: number | string | undefined | null,
): string {
  return formatDate(timestamp, "PPp");
}
