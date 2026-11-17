"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Upload, Loader2, X, AlertCircle } from "lucide-react";

interface ImageUploaderProps {
  type: "avatar" | "cover";
  currentUrl?: string | null;
  onUploaded: (url: string) => void;
  label?: string;
  aspectRatio?: "square" | "banner";
}

export function ImageUploader({
  type,
  currentUrl,
  onUploaded,
  label,
  aspectRatio = type === "avatar" ? "square" : "banner",
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    // Instant local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const res = await fetch("/api/member/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to upload image.");
      }

      const uploadedUrl = data.data.url;
      setPreview(uploadedUrl);
      onUploaded(uploadedUrl);
    } catch (err) {
      setError((err as Error).message || "Upload failed. Please try again.");
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onUploaded("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (aspectRatio === "square") {
    return (
      <div className="flex flex-col items-center sm:items-start gap-3">
        {label && <label className="text-sm font-semibold text-gray-800">{label}</label>}
        <div className="relative group">
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-gray-200/80 bg-gray-50 flex items-center justify-center cursor-pointer shadow-lg hover:border-[#5B46F6] transition-all relative"
          >
            {preview ? (
              <Image
                src={preview}
                alt="Profile photo"
                fill
                sizes="128px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <Camera className="w-8 h-8 mb-1" />
                <span className="text-xs font-medium">Add Photo</span>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Camera className="w-6 h-6" />
            </div>

            {uploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-[#5B46F6] animate-spin" />
              </div>
            )}
          </div>

          {preview && !uploading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute -top-1 -right-1 p-1 bg-white border border-gray-200 rounded-full text-gray-500 hover:text-red-600 shadow-md transition-colors"
              title="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        <p className="text-xs text-gray-500">
          JPG, PNG or WebP. Max 5MB. Recommended: 400×400px.
        </p>

        {error && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  // Banner / Cover image uploader
  return (
    <div className="w-full space-y-2">
      {label && <label className="text-sm font-semibold text-gray-800">{label}</label>}
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className="relative w-full h-44 sm:h-52 rounded-2xl border-2 border-dashed border-gray-200/80 bg-gray-50/70 hover:bg-gray-50 hover:border-[#5B46F6] transition-all cursor-pointer overflow-hidden flex items-center justify-center shadow-lg group"
      >
        {preview ? (
          <Image
            src={preview}
            alt="Cover banner"
            fill
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#5B46F6] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-gray-700">Click to upload cover banner</p>
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 1200×350px. Max 8MB.
            </p>
          </div>
        )}

        {/* Hover overlay when image is present */}
        {preview && (
          <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-medium text-sm">
            <Camera className="w-5 h-5" />
            <span>Change Cover Image</span>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="flex items-center gap-2 text-sm font-medium text-[#5B46F6]">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Uploading banner...</span>
            </div>
          </div>
        )}

        {preview && !uploading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-3 right-3 p-1.5 bg-white/90 hover:bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-red-600 shadow-md transition-colors"
            title="Remove cover"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
