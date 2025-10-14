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
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EditStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: User | null;
  onSuccess: () => void;
}

export function EditStaffDialog({
  open,
  onOpenChange,
  staff,
  onSuccess,
}: EditStaffDialogProps) {
  const [editName, setEditName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Update editName when staff changes
  useEffect(() => {
    if (staff) {
      setEditName(staff.name);
    }
  }, [staff]);

  const handleEdit = async () => {
    if (!staff || !editName.trim()) {
      toast.error("Please enter a valid staff name");
      return;
    }

    setIsEditing(true);
    try {
      await staffService.update(staff.id, {
        name: editName.trim(),
      });
      toast.success("Staff name updated successfully!");
      onSuccess();
      onOpenChange(false);
      setEditName("");
    } catch (error) {
      console.error("Error updating staff:", error);
      toast.error("Failed to update staff name. Please try again.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditName("");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Staff Name</AlertDialogTitle>
          <AlertDialogDescription>
            Update the name for <strong>{staff?.name}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Staff Name</Label>
            <Input
              id="edit-name"
              type="text"
              placeholder="Enter staff name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              disabled={isEditing}
            />
            <p className="text-sm text-muted-foreground">
              This will update the staff's display name.
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isEditing}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleEdit}
            disabled={isEditing || !editName.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isEditing ? "Updating..." : "Update Name"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
