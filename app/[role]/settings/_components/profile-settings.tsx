"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/hooks/use-app-store";
import { mutate } from "@atechhub/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  CheckCircle,
  Loader2,
  Mail,
  Shield,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileSettings() {
  const { user, setUser } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  // Update form values when user data becomes available
  useEffect(() => {
    if (user?.name) {
      form.setValue("name", user.name);
    }
  }, [user?.name, form]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user?.uid) {
      toast.error("User not found");
      return;
    }

    setIsLoading(true);
    try {
      await mutate({
        action: "update",
        path: `users/${user.uid}`,
        data: {
          name: data.name,
          updatedAt: new Date().toISOString(),
          updatedBy: {
            timestamp: new Date().toISOString(),
            actionBy: "user-profile-update",
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenResolution: `${screen.width}x${screen.height}`,
            browser: navigator.userAgent.split(" ")[0],
          },
        },
        actionBy: "user-profile-update",
      });

      // Update local state
      setUser({
        ...user,
        name: data.name,
        updatedAt: new Date().toISOString(),
      });

      // Show success alert with transition
      setShowSuccess(true);

      // Hide success alert after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
          </CardTitle>
          <CardDescription>Manage your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please log in to view your profile settings.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Settings
        </CardTitle>
        <CardDescription>
          Manage your profile information and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Success Alert with Transition */}
            {showSuccess && (
              <Alert className="border-green-200 bg-green-50 text-green-800 transition-all duration-300 ease-in-out animate-in slide-in-from-top-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Profile updated successfully!
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Shield className="h-4 w-4" />
                  Role
                </Label>
                <Input
                  value={user?.role === "admin" ? "Admin" : "Staff"}
                  readOnly
                  className="bg-muted cursor-not-allowed capitalize"
                />
                <p className="text-xs text-muted-foreground">
                  Role cannot be changed
                </p>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Account Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Created: {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {user.updatedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Updated: {new Date(user.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Status: {user.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>UID: {user.uid}</span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
