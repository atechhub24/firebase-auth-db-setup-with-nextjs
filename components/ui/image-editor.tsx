"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { optimizeImage } from "@/lib/utils/image-optimization";
import { Crop, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop as CropType,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageEditorProps {
  imageFile: File;
  onSave: (optimizedFile: File) => void;
  onCancel: () => void;
  open: boolean;
  aspectRatio?: number;
  circularCrop?: boolean;
  title?: string;
  description?: string;
}

export function ImageEditor({
  imageFile,
  onSave,
  onCancel,
  open,
  aspectRatio = 1,
  circularCrop = true,
  title = "Edit Image",
  description = "Crop, rotate, and optimize your image. It will be converted to WEBP format for better compression.",
}: ImageEditorProps) {
  const [imgSrc, setImgSrc] = useState<string>("");
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize image source when file changes
  useEffect(() => {
    if (imageFile && open) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgSrc(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile, open]);

  // Center crop on image load
  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { naturalWidth, naturalHeight } = e.currentTarget;
      const crop = centerCrop(
        makeAspectCrop(
          {
            unit: "%",
            width: 90,
          },
          aspectRatio,
          naturalWidth,
          naturalHeight
        ),
        naturalWidth,
        naturalHeight
      );
      setCrop(crop);
    },
    [aspectRatio]
  );

  // Draw cropped image to canvas
  const drawCroppedImage = useCallback(
    async (
      image: HTMLImageElement,
      crop: PixelCrop,
      rotation: number
    ): Promise<File | null> => {
      if (!crop.width || !crop.height) return null;

      const canvas = canvasRef.current;
      if (!canvas) return null;

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      const pixelRatio = window.devicePixelRatio;
      canvas.width = crop.width * pixelRatio * scaleX;
      canvas.height = crop.height * pixelRatio * scaleY;

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = "high";

      const cropX = crop.x * scaleX;
      const cropY = crop.y * scaleY;

      const rotateRads = (rotation * Math.PI) / 180;
      const centerX = image.naturalWidth / 2;
      const centerY = image.naturalHeight / 2;

      ctx.save();
      ctx.translate(-cropX, -cropY);
      ctx.translate(centerX, centerY);
      ctx.rotate(rotateRads);
      ctx.translate(-centerX, -centerY);
      ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight
      );
      ctx.restore();

      return new Promise<File | null>((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(null);
              return;
            }
            const fileName = imageFile.name.replace(/\.[^/.]+$/, "") + ".webp";
            const file = new File([blob], fileName, {
              type: "image/webp",
              lastModified: Date.now(),
            });
            resolve(file);
          },
          "image/webp",
          0.95
        );
      });
    },
    [imageFile.name]
  );

  const handleSave = async () => {
    if (!completedCrop || !imgRef.current) return;

    setIsProcessing(true);
    try {
      // Get cropped image
      const croppedFile = await drawCroppedImage(
        imgRef.current,
        completedCrop,
        rotation
      );

      if (!croppedFile) {
        throw new Error("Failed to crop image");
      }

      // Optimize and compress the cropped image
      const optimizedFile = await optimizeImage(croppedFile, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        quality: 0.85,
        convertToWebP: true,
      });

      onSave(optimizedFile);
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="md:max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crop className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image Crop Area */}
          <div className="flex justify-center items-center bg-muted rounded-lg p-4 min-h-[400px]">
            {imgSrc && (
              <div className="relative">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspectRatio}
                  circularCrop={circularCrop}
                  minWidth={100}
                  minHeight={100}
                >
                  <img
                    ref={imgRef}
                    alt="Crop preview"
                    src={imgSrc}
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                      maxWidth: "100%",
                      maxHeight: "70vh",
                    }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Zoom Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <ZoomIn className="h-4 w-4" />
                  <span>Zoom</span>
                </div>
                <span className="text-muted-foreground">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
              <Slider
                value={[zoom]}
                onValueChange={([value]) => setZoom(value)}
                min={0.5}
                max={3}
                step={0.1}
              />
            </div>

            {/* Rotation Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <RotateCw className="h-4 w-4" />
                  <span>Rotation</span>
                </div>
                <span className="text-muted-foreground">{rotation}°</span>
              </div>
              <Slider
                value={[rotation]}
                onValueChange={([value]) => setRotation(value)}
                min={-180}
                max={180}
                step={1}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isProcessing || !completedCrop}
          >
            {isProcessing ? "Processing..." : "Save & Upload"}
          </Button>
        </DialogFooter>

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
