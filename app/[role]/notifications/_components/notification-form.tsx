"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useFirebaseRealtime } from "@/hooks/use-firebase-realtime";
import { MultiSelectAutocomplete } from "@/components/core/multi-select-autocomplete";
import { NotificationPreview } from "./notification-preview";
import type { NotificationPayload } from "@/lib/types/notification.type";
import type { User } from "@/lib/types/user.type";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const notificationSchema = z.object({
  userIds: z.array(z.string()).min(1, "Please select at least one user"),
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  body: z.string().min(1, "Description is required").max(500, "Description is too long"),
  image: z.string().url("Invalid URL").optional().or(z.literal("")),
  icon: z.string().url("Invalid URL").optional().or(z.literal("")),
  clickAction: z.string().url("Invalid URL").optional().or(z.literal("")),
  priority: z.enum(["normal", "high"]).default("normal"),
  sound: z.string().optional(),
  enableSound: z.boolean().default(false),
});

type NotificationFormData = z.infer<typeof notificationSchema>;

export function NotificationForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch users from Firebase
  const { data: usersData, loading: usersLoading } = useFirebaseRealtime<User>(
    "users",
    {
      asArray: true,
      filter: (user) => user.status === "active",
    }
  );

  const users = (usersData as User[]) || [];

  // Convert users to autocomplete options
  const userOptions = users.map((user) => ({
    value: user.uid,
    label: `${user.name} (${user.email})`,
  }));

  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      userIds: [],
      title: "",
      body: "",
      image: "",
      icon: "",
      clickAction: "",
      priority: "normal",
      sound: "default",
      enableSound: false,
    },
  });

  // Watch form values for preview
  const watchedValues = form.watch();
  const previewPayload: NotificationPayload = {
    title: watchedValues.title || "",
    body: watchedValues.body || "",
    image: watchedValues.image || undefined,
    icon: watchedValues.icon || undefined,
    clickAction: watchedValues.clickAction || undefined,
    priority: watchedValues.priority,
    sound: watchedValues.enableSound ? watchedValues.sound || "default" : undefined,
  };

  const onSubmit = async (data: NotificationFormData) => {
    setIsLoading(true);
    try {
      const payload: NotificationPayload = {
        title: data.title,
        body: data.body,
        image: data.image || undefined,
        icon: data.icon || undefined,
        clickAction: data.clickAction || undefined,
        priority: data.priority,
        sound: data.enableSound ? data.sound || "default" : undefined,
      };

      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIds: data.userIds,
          payload,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          `Successfully sent ${result.totalSent} notification(s)`,
        );
        // Reset form
        form.reset();
        // Optionally redirect or stay on page
      } else {
        toast.error(result.message || "Failed to send notifications");
        if (result.results) {
          const failedCount = result.totalFailed;
          if (failedCount > 0) {
            toast.error(`${failedCount} notification(s) failed to send`);
          }
        }
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notifications. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Send Notification</CardTitle>
          <CardDescription>
            Send push notifications to selected users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* User Selection */}
              <FormField
                control={form.control}
                name="userIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipients</FormLabel>
                    <FormControl>
                      <MultiSelectAutocomplete
                        options={userOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={
                          usersLoading
                            ? "Loading users..."
                            : "Select users to notify..."
                        }
                        emptyMessage="No users found"
                        disabled={usersLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Select one or more users to receive this notification
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Notification title"
                        {...field}
                        maxLength={100}
                      />
                    </FormControl>
                    <FormDescription>
                      The notification title (max 100 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Body */}
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Notification description"
                        {...field}
                        maxLength={500}
                        rows={4}
                      />
                    </FormControl>
                    <FormDescription>
                      The notification description (max 500 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Image URL */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      URL to an image to display in the notification
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Icon URL */}
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com/icon.png"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      URL to an icon to display in the notification
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Click Action URL */}
              <FormField
                control={form.control}
                name="clickAction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Click Action URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com/action"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      URL to navigate to when the notification is clicked
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Priority */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Notification priority level
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sound */}
              <FormField
                control={form.control}
                name="enableSound"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Sound</FormLabel>
                      <FormDescription>
                        Enable notification sound
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {watchedValues.enableSound && (
                <FormField
                  control={form.control}
                  name="sound"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sound Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="default"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Sound to play (default, notification, etc.)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Sending..." : "Send Notification"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Preview */}
      <div className="lg:sticky lg:top-4 lg:self-start">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              How the notification will appear to users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationPreview payload={previewPayload} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

