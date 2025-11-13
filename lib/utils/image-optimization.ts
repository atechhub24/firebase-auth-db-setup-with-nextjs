import imageCompression from "browser-image-compression";

export interface ImageOptimizationOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  quality?: number;
  convertToWebP?: boolean;
}

/**
 * Optimize and compress image before upload
 * Converts to WEBP format for better compression
 */
export async function optimizeImage(
  file: File,
  options: ImageOptimizationOptions = {},
): Promise<File> {
  const {
    maxSizeMB = 0.5, // Target 500KB max
    maxWidthOrHeight = 1920, // Max dimension
    useWebWorker = true,
    quality = 0.85, // 85% quality - good balance
    convertToWebP = true,
  } = options;

  try {
    // Compress and optimize the image
    const compressedFile = await imageCompression(file, {
      maxSizeMB,
      maxWidthOrHeight,
      useWebWorker,
      fileType: convertToWebP ? "image/webp" : file.type,
      initialQuality: quality,
    });

    // If converting to WEBP, ensure the file has .webp extension
    if (convertToWebP && compressedFile.type === "image/webp") {
      const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
      return new File([compressedFile], fileName, {
        type: "image/webp",
        lastModified: Date.now(),
      });
    }

    return compressedFile;
  } catch (error) {
    console.error("Error optimizing image:", error);
    // Return original file if optimization fails
    return file;
  }
}

/**
 * Get image file size in MB
 */
export function getFileSizeMB(file: File): number {
  return file.size / (1024 * 1024);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}
