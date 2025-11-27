"use client";

import type { NotificationPayload } from "@/lib/types/notification.type";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";

interface NotificationPreviewProps {
  payload: NotificationPayload;
  className?: string;
}

export function NotificationPreview({
  payload,
  className,
}: NotificationPreviewProps) {
  const { title, body, icon, image } = payload;

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-semibold">Preview</h3>

      {/* Desktop Preview */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Desktop</p>
        <div className="relative rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-start gap-3">
            {/* Icon */}
            {icon ? (
              <img
                src={icon}
                alt="Notification icon"
                className="h-10 w-10 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bell className="h-5 w-5" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-sm leading-tight">{title || "Notification Title"}</h4>
                <span className="text-xs text-muted-foreground">now</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {body || "Notification description will appear here..."}
              </p>
              {image && (
                <img
                  src={image}
                  alt="Notification image"
                  className="mt-2 max-h-32 w-full rounded object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Preview */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Mobile</p>
        <div className="relative rounded-lg border bg-card p-3 shadow-sm">
          <div className="flex items-start gap-2">
            {/* Icon */}
            {icon ? (
              <img
                src={icon}
                alt="Notification icon"
                className="h-8 w-8 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bell className="h-4 w-4" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 space-y-0.5 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-xs leading-tight truncate">{title || "Title"}</h4>
                <span className="text-[10px] text-muted-foreground shrink-0">now</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {body || "Description..."}
              </p>
            </div>
          </div>
          {image && (
            <img
              src={image}
              alt="Notification image"
              className="mt-2 w-full rounded object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

