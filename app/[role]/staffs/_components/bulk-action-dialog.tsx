"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import { staffService } from "@/lib/services";

interface BulkActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  bulkAction: string;
  onSuccess: () => void;
}

export function BulkActionDialog({
  open,
  onOpenChange,
  selectedIds,
  bulkAction,
  onSuccess,
}: BulkActionDialogProps) {
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  const handleBulkAction = async () => {
    if (selectedIds.length === 0) return;

    setIsBulkProcessing(true);
    try {
      const promises = selectedIds.map((id) =>
        staffService.update(id, {
          status: bulkAction as "active" | "inactive" | "pending",
        }),
      );

      await Promise.all(promises);

      toast.success(
        `Successfully updated ${selectedIds.length} staffs to ${bulkAction}`,
      );
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error performing bulk action:", error);
      toast.error("Failed to update staffs. Please try again.");
    } finally {
      setIsBulkProcessing(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bulk Status Update</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to set <strong>{selectedIds.length}</strong>{" "}
            staffs to <strong>{bulkAction}</strong> status? This action will
            update all selected staffs.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleBulkAction}
            disabled={isBulkProcessing}
          >
            {isBulkProcessing ? "Updating..." : `Set to ${bulkAction}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
