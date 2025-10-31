"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Attendance } from "@/lib/types/attendance.type";
import { formatDate, formatTime } from "@/lib/utils/date";

// Fix default marker icons for Next.js
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

interface AttendanceMapClientProps {
  records: Attendance[];
  showStaffName?: boolean;
}

export function AttendanceMapClient({
  records,
  showStaffName = false,
}: AttendanceMapClientProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize map
    const map = L.map(containerRef.current).setView([28.6139, 77.209], 13);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const bounds: L.LatLngBoundsExpression = [];

    records.forEach((record) => {
      // Add punch in marker (green)
      if (record.punchInLocation) {
        const punchInIcon = L.divIcon({
          html: `<div style="background-color: #22c55e; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          className: "custom-marker",
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const popupContent = `
          <div style="min-width: 200px;">
            <strong>Punch In</strong><br/>
            ${showStaffName ? `<strong>${record.staffName}</strong><br/>` : ""}
            Date: ${formatDate(record.punchInTime, "PP")}<br/>
            Time: ${formatTime(record.punchInTime)}<br/>
            Address: ${record.punchInLocation.address}
          </div>
        `;

        const marker = L.marker(
          [record.punchInLocation.lat, record.punchInLocation.lng],
          { icon: punchInIcon }
        )
          .addTo(mapRef.current!)
          .bindPopup(popupContent);

        markersRef.current.push(marker);
        bounds.push([record.punchInLocation.lat, record.punchInLocation.lng]);
      }

      // Add punch out marker (red)
      if (record.punchOutLocation) {
        const punchOutIcon = L.divIcon({
          html: `<div style="background-color: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          className: "custom-marker",
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const popupContent = `
          <div style="min-width: 200px;">
            <strong>Punch Out</strong><br/>
            ${showStaffName ? `<strong>${record.staffName}</strong><br/>` : ""}
            Date: ${formatDate(record.punchOutTime, "PP")}<br/>
            Time: ${formatTime(record.punchOutTime)}<br/>
            Address: ${record.punchOutLocation.address}
          </div>
        `;

        const marker = L.marker(
          [record.punchOutLocation.lat, record.punchOutLocation.lng],
          { icon: punchOutIcon }
        )
          .addTo(mapRef.current!)
          .bindPopup(popupContent);

        markersRef.current.push(marker);
        bounds.push([
          record.punchOutLocation.lat,
          record.punchOutLocation.lng,
        ]);
      }
    });

    // Fit map to show all markers
    if (bounds.length > 0) {
      mapRef.current.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [records, showStaffName]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[500px] rounded-lg border"
      style={{ zIndex: 0 }}
    />
  );
}

