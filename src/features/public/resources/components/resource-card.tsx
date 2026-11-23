"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Download, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Resource } from "@/types/public";
import { Badge } from "@/components/ui/badge";

interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const format = resource.format ?? resource.type ?? "PDF Guide";
  const fileSize = resource.fileSize ?? "2.5 MB";
  const downloads = resource.downloadCount ?? 250;
  const [imgSrc, setImgSrc] = useState(
    resource.coverImage || "/images/placeholders/resource-1.jpg"
  );

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/90 bg-white/90 shadow-card card-hover-effect">
      {/* Cover / Graphic Preview */}
      <div className="relative h-44 w-full overflow-hidden bg-surface">
        <Image
          src={imgSrc}
          alt={resource.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={() => setImgSrc("/images/placeholders/resource-1.jpg")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Badges Overlay */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <Badge
            variant="neutral"
            size="sm"
            className="border border-white/40 bg-white/90 text-xs font-medium text-text-primary backdrop-blur-md shadow-xs"
          >
            {resource.category}
          </Badge>
        </div>

        <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-mono font-bold text-text-primary backdrop-blur-md shadow-xs">
          <span>{format}</span>
          <span className="text-neutral">•</span>
          <span>{fileSize}</span>
        </div>

        {/* Verified Toolkit Indicator */}
        <div className="absolute bottom-3 left-3.5 z-10 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-xs">
          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
          <span>Verified Template</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <h3 className="text-lg font-bold text-text-primary transition-colors duration-200 group-hover:text-primary line-clamp-2">
            <Link href={`/resources/${resource.slug}`}>
              {resource.title}
            </Link>
          </h3>

          <p className="mt-1 text-xs text-text-secondary">
            Curated by <span className="font-medium text-text-primary">{resource.author}</span>
          </p>

          <p className="mt-3 text-xs sm:text-sm text-text-secondary line-clamp-2 leading-relaxed">
            {resource.description}
          </p>

          <div className="mt-4 flex items-center gap-1.5 text-xs text-text-secondary border-t border-border/80 pt-3">
            <Download className="h-3.5 w-3.5 text-primary" />
            <span>
              <strong className="text-text-primary">{downloads.toLocaleString()}</strong> sisters downloaded this kit
            </span>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-5 border-t border-border/80 pt-4 flex items-center  text-xs ">
          {/* <span className="font-semibold text-primary">Free Community Resource</span> */}
          <Link
            href={`/resources/${resource.slug}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 font-semibold text-white shadow-xs transition-all duration-200 hover:bg-primary-hover hover:shadow-button"
          >
            <span>Access Guide</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
