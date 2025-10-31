import type { AttendanceLocation } from "@/lib/types/attendance.type";

/**
 * Get current GPS location with reverse geocoding
 * Converts coordinates to human-readable address using Nominatim API
 */
export function getCurrentLocation(): Promise<AttendanceLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Reverse geocoding using Nominatim
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                "User-Agent": "GenexLifeCare/1.0", // Required by Nominatim ToS
              },
            }
          );

          if (!response.ok) {
            throw new Error("Geocoding request failed");
          }

          const data = await response.json();
          const address =
            data.display_name ||
            `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

          resolve({
            lat: latitude,
            lng: longitude,
            address,
          });
        } catch (error) {
          // Fallback to coordinates if geocoding fails
          resolve({
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          });
        }
      },
      (error) => {
        let errorMessage = "Failed to get location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

