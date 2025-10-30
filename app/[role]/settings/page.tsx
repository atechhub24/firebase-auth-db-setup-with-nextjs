"use client";

import { Lock, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PasswordSettings } from "./_components/password-settings";
import { ProfileSettings } from "./_components/profile-settings";

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-4xl">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="profile"
            className="flex items-center justify-center gap-2"
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className="flex items-center justify-center gap-2"
          >
            <Lock className="h-4 w-4" />
            <span>Password</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="profile"
          className="space-y-4 sm:space-y-6 mt-4 sm:mt-6"
        >
          <ProfileSettings />
        </TabsContent>

        <TabsContent
          value="password"
          className="space-y-4 sm:space-y-6 mt-4 sm:mt-6"
        >
          <PasswordSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
