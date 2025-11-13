"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { User } from "@/lib/types/user.type";
import {
  Building2,
  Calendar,
  CheckCircle,
  Edit,
  Key,
  Mail,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { BulkActionDialog } from "./bulk-action-dialog";
import { DeleteStaffDialog } from "./delete-staff-dialog";
import { EditStaffDialog } from "./edit-staff-dialog";

interface StaffsTableProps {
  staffs: User[];
  onRefresh: () => void;
}

export function StaffsTable({ staffs, onRefresh }: StaffsTableProps) {
  const router = useRouter();
  const params = useParams();
  const role = params.role as string;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<User | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false);

  // Filter staffs based on search term
  const filteredStaffs = staffs.filter(
    (staff) =>
      staff.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openDeleteDialog = (staff: User) => {
    setSelectedStaff(staff);
    setDeleteDialogOpen(true);
  };

  const openEditDialog = (staff: User) => {
    setSelectedStaff(staff);
    setEditDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    onRefresh();
    setSelectedStaff(null);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
      toast.success("Staffs list refreshed");
    } catch (error) {
      console.error("Error refreshing staffs:", error);
      toast.error("Failed to refresh staffs list");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Bulk selection functions
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredStaffs.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };

  const openBulkActionDialog = (action: string) => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one staff");
      return;
    }
    setBulkAction(action);
    setBulkActionDialogOpen(true);
  };

  const handleBulkActionSuccess = () => {
    setSelectedIds([]);
    onRefresh();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Active
          </Badge>
        );
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "pending":
        return (
          <Badge
            variant="outline"
            className="border-yellow-300 text-yellow-800"
          >
            Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Staffs
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage staff accounts and their access to the platform.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button
            onClick={() => router.push(`/${role}/staffs/create`)}
            className="flex items-center gap-2"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Staff</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Search and Stats */}
      <Card>
        <CardHeader className="space-y-4 p-4 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
                Staff Management
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {filteredStaffs.length} of {staffs.length} staffs
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staffs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
            </div>
            {selectedIds.length > 0 && (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {selectedIds.length} selected
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => openBulkActionDialog("active")}
                    className="flex items-center gap-1 bg-emerald-500 text-white hover:bg-emerald-600 text-xs sm:text-sm"
                  >
                    <CheckCircle className="h-3 w-3" />
                    <span className="hidden sm:inline">Activate</span>
                    <span className="sm:hidden">Act</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => openBulkActionDialog("inactive")}
                    className="flex items-center gap-1 bg-rose-500 text-white hover:bg-rose-600 text-xs sm:text-sm"
                  >
                    <XCircle className="h-3 w-3" />
                    <span className="hidden sm:inline">Deactivate</span>
                    <span className="sm:hidden">Deact</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {filteredStaffs.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                No staffs found
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Get started by adding your first staff."}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => router.push(`/${role}/staffs/create`)}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Staff
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={
                            selectedIds.length === filteredStaffs.length &&
                            filteredStaffs.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Staff</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-[70px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaffs.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(staff.id)}
                            onCheckedChange={(checked) =>
                              handleSelectOne(staff.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{staff.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ID: {staff.id}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3" />
                              {staff.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(staff.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(staff.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => openEditDialog(staff)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Name
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(
                                    `/${role}/staffs/${staff.id}/password`,
                                  )
                                }
                              >
                                <Key className="mr-2 h-4 w-4" />
                                Change Password
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(staff)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {filteredStaffs.map((staff) => (
                  <Card key={staff.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <Checkbox
                          checked={selectedIds.includes(staff.id)}
                          onCheckedChange={(checked) =>
                            handleSelectOne(staff.id, checked as boolean)
                          }
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0 space-y-2">
                          <div>
                            <div className="font-medium text-sm truncate">
                              {staff.name}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              ID: {staff.id}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{staff.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(staff.status)}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(staff.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 flex-shrink-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => openEditDialog(staff)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Name
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/${role}/staffs/${staff.id}/password`,
                              )
                            }
                          >
                            <Key className="mr-2 h-4 w-4" />
                            Change Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(staff)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <DeleteStaffDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        staff={selectedStaff}
        onSuccess={handleDialogSuccess}
      />

      <EditStaffDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        staff={selectedStaff}
        onSuccess={handleDialogSuccess}
      />

      <BulkActionDialog
        open={bulkActionDialogOpen}
        onOpenChange={setBulkActionDialogOpen}
        selectedIds={selectedIds}
        bulkAction={bulkAction}
        onSuccess={handleBulkActionSuccess}
      />
    </div>
  );
}
