"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/hooks/use-app-store";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export function ProfileDropdown() {
  const params = useParams();
  const router = useRouter();
  const role = params.role as string;
  const { user } = useAppStore();

  const handleSettingsClick = () => {
    router.push(`/${role}/settings`);
  };

  const handleLogout = async () => {
    try {
      const { firebaseAuth } = await import("@atechhub/firebase");
      await firebaseAuth({
        action: "logout",
      });
      router.push("/signin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full hover:bg-muted"
        >
          <Avatar className="h-10 w-10 border-2 border-border">
            <AvatarImage alt={user?.name || "User"} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.name ? getUserInitials(user.name) : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end" forceMount>
        {/* Active Account Section */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 border-2 border-border">
              <AvatarImage alt={user?.name || "User"} />
              <AvatarFallback className="bg-primary text-primary-foreground text-base">
                {user?.name ? getUserInitials(user.name) : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || "No email"}{" "}
                {user?.role && (
                  <Badge
                    variant="secondary"
                    className="mt-2 text-xs capitalize font-normal"
                  >
                    {user.role}
                  </Badge>
                )}
              </p>
            </div>
          </div>

          {/* Account Actions */}
          <div className="mt-4 space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start h-9"
              onClick={handleSettingsClick}
            >
              <Settings className="mr-2 h-4 w-4" />
              Manage account
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-9"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator className="my-0" />

        {/* Footer */}
        <div className="p-3 bg-muted/50">
          <p className="text-xs text-center text-muted-foreground">
            Secured by{" "}
            <span className="font-semibold text-foreground">Firebase Auth</span>
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
