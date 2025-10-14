"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { staffService } from "@/lib/services";
import type { User } from "@/lib/types/user.type";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: User | null;
  onSuccess: () => void;
}

export function DeleteStaffDialog({
  open,
  onOpenChange,
  staff,
  onSuccess,
}: DeleteStaffDialogProps) {
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!staff || !deletePassword.trim()) {
      toast.error("Please enter the staff password to confirm deletion");
      return;
    }

    setIsDeleting(true);
    try {
      await staffService.delete(staff.id, staff.email, deletePassword);
      toast.success("Staff deleted successfully!");
      onSuccess();
      onOpenChange(false);
      setDeletePassword("");
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error(
        "Failed to delete staff. Please check the password and try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setDeletePassword("");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Staff</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{staff?.name}</strong>? This
            action will permanently remove the staff account and cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <div className="space-y-2">
            <Label htmlFor="delete-password">Enter Staff Password</Label>
            <Input
              id="delete-password"
              type="password"
              placeholder="Enter staff password to confirm deletion"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              disabled={isDeleting}
            />
            <p className="text-sm text-muted-foreground">
              You must enter the staff's password to confirm deletion.
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting || !deletePassword.trim()}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
