"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { ImageEditor } from "@/components/ui/image-editor";
import { formatFileSize } from "@/lib/utils/image-optimization";
import { useAppStore } from "@/hooks/use-app-store";
import { useUploadThing } from "@/lib/utils/uploadthing";
import { mutate } from "@atechhub/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  CheckCircle,
  Image as ImageIcon,
  Loader2,
  Mail,
  Shield,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  profilePicture: z.string().url().optional().or(z.literal("")),
  profilePictureFileKey: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileSettings() {
  const { user, setUser } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [previousFileKey, setPreviousFileKey] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      profilePicture: user?.profilePicture || "",
      profilePictureFileKey: user?.profilePictureFileKey || "",
    },
  });

  // Helper function to delete old image from UploadThing via API using fileKey
  const deleteOldImage = async (fileKey: string | null | undefined) => {
    if (!fileKey) return;

    try {
      const response = await fetch(
        `/api/uploadthing/delete?fileKey=${encodeURIComponent(fileKey)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      console.log("Deleted old image:", fileKey);
    } catch (error) {
      console.error("Error deleting old image:", error);
      // Don't throw - deletion failure shouldn't block the upload
    }
  };

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (res) => {
      if (res?.[0]?.url && res?.[0]?.key && user?.uid) {
        const profilePictureUrl = res[0].url;
        const fileKey = res[0].key;

        // Update form value
        form.setValue("profilePicture", profilePictureUrl);
        form.setValue("profilePictureFileKey", fileKey);
        setImagePreview(profilePictureUrl);

        // Auto-save to Firebase
        try {
          await mutate({
            action: "update",
            path: `users/${user.uid}`,
            data: {
              profilePicture: profilePictureUrl,
              profilePictureFileKey: fileKey,
              updatedAt: new Date().toISOString(),
              updatedBy: {
                timestamp: new Date().toISOString(),
                actionBy: "user-profile-picture-update",
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                screenResolution: `${screen.width}x${screen.height}`,
                browser: navigator.userAgent.split(" ")[0],
              },
            },
            actionBy: "user-profile-picture-update",
          });

          // Update local state
          setUser({
            ...user,
            profilePicture: profilePictureUrl,
            profilePictureFileKey: fileKey,
            updatedAt: new Date().toISOString(),
          });

          // Clear previous fileKey tracking (old file was already deleted before upload)
          setPreviousFileKey(null);

          toast.success("Profile picture uploaded and saved!");
        } catch (error) {
          console.error("Error saving profile picture:", error);
          toast.error("Uploaded but failed to save. Please try again.");
        }
      }
    },
    onUploadError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
      setImagePreview(user?.profilePicture || null);
      // Reset previous fileKey on error
      setPreviousFileKey(null);
    },
  });

  // Update form values when user data becomes available
  useEffect(() => {
    if (user?.name) {
      form.setValue("name", user.name);
    }
    if (user?.profilePicture) {
      form.setValue("profilePicture", user.profilePicture);
      setImagePreview(user.profilePicture);
    }
    if (user?.profilePictureFileKey) {
      form.setValue("profilePictureFileKey", user.profilePictureFileKey);
    }
  }, [user?.name, user?.profilePicture, user?.profilePictureFileKey, form]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (10MB - we'll compress it)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }

    // Store previous image fileKey before upload (for deletion later)
    if (user?.profilePictureFileKey) {
      setPreviousFileKey(user.profilePictureFileKey);
    }

    // Set selected file and show editor
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Open image editor
    setShowImageEditor(true);
  };

  const handleEditorSave = async (optimizedFile: File) => {
    if (!user?.uid) {
      toast.error("User not found");
      return;
    }

    setShowImageEditor(false);

    // Show file size info
    const originalSize = selectedFile
      ? formatFileSize(selectedFile.size)
      : "0 KB";
    const optimizedSize = formatFileSize(optimizedFile.size);
    const compressionRatio = selectedFile
      ? ((1 - optimizedFile.size / selectedFile.size) * 100).toFixed(1)
      : "0";

    toast.success(
      `Image optimized: ${originalSize} → ${optimizedSize} (${compressionRatio}% reduction)`
    );

    // Delete old file BEFORE uploading new one (if fileKey exists)
    // Note: UploadThing doesn't support overwriting files - each upload creates a new fileKey
    // By deleting first, we ensure only one profile picture file exists per user
    if (previousFileKey) {
      try {
        await deleteOldImage(previousFileKey);
        console.log("Deleted old file before upload:", previousFileKey);
      } catch (error) {
        console.error("Error deleting old file:", error);
        // Continue with upload even if deletion fails
      }
    }

    // Auto-upload optimized file with custom filename
    try {
      await startUpload([
        new File([optimizedFile], `${user.uid}-${Date.now()}-profile.webp`, {
          type: "image/webp",
        }),
      ]);
    } catch (error) {
      console.error("Error uploading image:", error);
      // Reset previous fileKey on error
      setPreviousFileKey(null);
    }
  };

  const handleEditorCancel = () => {
    setShowImageEditor(false);
    setSelectedFile(null);
    setImagePreview(user?.profilePicture || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async () => {
    if (!user?.uid) return;

    const fileKeyToRemove = user.profilePictureFileKey;

    setImagePreview(null);
    form.setValue("profilePicture", "");
    form.setValue("profilePictureFileKey", "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Remove from Firebase
    try {
      await mutate({
        action: "update",
        path: `users/${user.uid}`,
        data: {
          profilePicture: null,
          profilePictureFileKey: null,
          updatedAt: new Date().toISOString(),
          updatedBy: {
            timestamp: new Date().toISOString(),
            actionBy: "user-profile-picture-remove",
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenResolution: `${screen.width}x${screen.height}`,
            browser: navigator.userAgent.split(" ")[0],
          },
        },
        actionBy: "user-profile-picture-remove",
      });

      // Update local state
      setUser({
        ...user,
        profilePicture: undefined,
        profilePictureFileKey: undefined,
        updatedAt: new Date().toISOString(),
      });

      // Delete from UploadThing storage using fileKey
      if (fileKeyToRemove) {
        await deleteOldImage(fileKeyToRemove);
      }

      toast.success("Profile picture removed");
    } catch (error) {
      console.error("Error removing profile picture:", error);
      toast.error("Failed to remove profile picture");
    }
  };

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

            {/* Profile Picture Upload */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <ImageIcon className="h-4 w-4" />
                Profile Picture
              </Label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative">
                  <Avatar className="size-20 sm:size-24">
                    <AvatarImage
                      src={imagePreview || user?.profilePicture}
                      alt={user?.name || "Profile"}
                    />
                    <AvatarFallback className="text-lg sm:text-xl">
                      {user?.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {(imagePreview || user?.profilePicture) && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-1 -right-1 size-6 rounded-full"
                      onClick={handleRemoveImage}
                      disabled={isLoading || isUploading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="flex-1 space-y-2 w-full sm:w-auto">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={isLoading || isUploading}
                    className="hidden"
                    id="profile-picture-input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading || isUploading}
                    className="w-full sm:w-auto"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        {imagePreview || user?.profilePicture
                          ? "Change Picture"
                          : "Upload Picture"}
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Select an image to upload (max 10MB). You can crop, rotate,
                    and optimize before upload. Images are automatically
                    converted to WEBP format for better compression.
                  </p>
                </div>
              </div>
            </div>

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

            <div className="bg-muted/50 p-3 sm:p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Account Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm text-muted-foreground">
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

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button
                type="submit"
                disabled={isLoading || isUploading}
                className="w-full sm:w-auto"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </Form>

        {/* Image Editor Dialog */}
        {selectedFile && (
          <ImageEditor
            imageFile={selectedFile}
            onSave={handleEditorSave}
            onCancel={handleEditorCancel}
            open={showImageEditor}
            aspectRatio={1}
            circularCrop={true}
          />
        )}
      </CardContent>
    </Card>
  );
}
