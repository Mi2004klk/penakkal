"use client";

import { useState, useCallback } from "react";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UploadDropzone() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only images are supported");
      return;
    }

    try {
      setIsUploading(true);
      
      // 1. Get Presigned URL
      const presignRes = await fetch("/api/admin/upload-presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          size: file.size,
        }),
      });
      
      if (!presignRes.ok) throw new Error("Failed to get presigned URL");
      const { uploadUrl, mediaId } = await presignRes.json();

      // 2. Upload to R2 directly
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      if (!uploadRes.ok) throw new Error("Upload failed");

      // 3. Trigger processing
      const processRes = await fetch(`/api/admin/media/${mediaId}/process`, {
        method: "POST",
      });

      if (!processRes.ok) throw new Error("Processing failed");

      toast.success("Image uploaded successfully!");
      router.refresh();
      
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }, [router]);

  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-cards p-12 text-center transition-colors ${
        isDragging ? "border-moss bg-moss/5" : "border-border-default bg-surface-card"
      }`}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`p-4 rounded-full ${isDragging ? "bg-moss/10 text-moss" : "bg-surface-page text-muted-text"}`}>
          <UploadCloud className="w-8 h-8" />
        </div>
        <div>
          <p className="font-ui font-bold text-heading text-lg">
            {isUploading ? "Uploading..." : "Drag & drop an image here"}
          </p>
          <p className="text-muted-text text-sm font-ui mt-1">
            or click to browse from your computer (Max 25MB)
          </p>
        </div>
      </div>
    </div>
  );
}
