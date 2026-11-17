"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, ZoomIn, ShieldCheck } from "lucide-react";

interface ProductGalleryProps {
  name: string;
  images: string[];
  category: string;
}

export function ProductGallery({ name, images, category }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const galleryImages = images && images.length > 0 ? images : ["/images/placeholders/prod-1.jpg"];
  const currentImage: string = galleryImages[selectedIndex] || galleryImages[0] || "/images/placeholders/prod-1.jpg";

  return (
    <div className="space-y-4">
      {/* Primary Display */}
      <div className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-card transition-all duration-300 hover:shadow-card-hover">
        <Image
          src={currentImage}
          alt={name}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-cover transition-transform duration-700 ease-out ${
            isZoomed ? "scale-125 cursor-zoom-out" : "group-hover:scale-105 cursor-zoom-in"
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
          priority
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/placeholders/prod-1.jpg";
          }}
        />

        {/* Overlay Badges */}
        <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-primary shadow-sm backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-primary" />
            <span>{category}</span>
          </span>
        </div>

        <div className="pointer-events-none absolute right-4 top-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-text-primary/80 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Artisan Certified</span>
          </span>
        </div>

        {/* Zoom Hint */}
        <div className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-text-secondary shadow-sm backdrop-blur-sm opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <ZoomIn className="h-3 w-3 text-primary" />
          <span>Click to {isZoomed ? "reset" : "zoom"}</span>
        </div>
      </div>

      {/* Thumbnails list */}
      {galleryImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 pt-1">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSelectedIndex(idx);
                setIsZoomed(false);
              }}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-200 ${
                selectedIndex === idx
                  ? "border-primary shadow-md ring-2 ring-primary/20 scale-105"
                  : "border-border bg-white hover:border-primary/50 opacity-75 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/placeholders/prod-1.jpg";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
