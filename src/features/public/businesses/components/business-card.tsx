"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, BadgeCheck, ArrowUpRight } from "lucide-react";
import type { Business } from "@/types/public";
import { Badge } from "@/components/ui/badge";

interface BusinessCardProps {
  business: Business;
}

export function BusinessCard({ business }: BusinessCardProps) {
  const isVerified = Boolean(business.verified ?? business.isVerified);
  const founderName = business.founder ?? business.ownerName ?? "Artisan Leader";
  const reviews = business.reviewCount ?? 18;
  const [imgSrc, setImgSrc] = useState(
    business.coverImage || "/images/placeholders/biz-cover-1.jpg"
  );

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/90 bg-white/90 shadow-card card-hover-effect">
      {/* Cover Image & Category Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-surface">
        <Image
          src={imgSrc}
          alt={business.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={() => setImgSrc("/images/placeholders/biz-cover-1.jpg")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <Badge
            variant="neutral"
            size="sm"
            className="border border-white/30 bg-white/90 font-medium text-text-primary backdrop-blur-md shadow-xs"
          >
            {business.category}
          </Badge>
        </div>

        {/* Rating Floating Tag */}
        <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-text-primary backdrop-blur-md shadow-xs">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>{business.rating.toFixed(1)}</span>
          <span className="text-[10px] font-normal text-text-secondary">
            ({reviews})
          </span>
        </div>

        {/* Floating Brand Logo / Monogram */}
        <div className="absolute -bottom-4 left-5 z-20 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-white bg-primary text-lg font-extrabold text-white shadow-md transition-transform duration-300 group-hover:scale-105">
          {business.name.slice(0, 2).toUpperCase()}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between p-5 pt-7">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-lg font-bold text-text-primary transition-colors duration-200 group-hover:text-primary line-clamp-1">
              <Link href={`/businesses/${business.slug}`}>
                {business.name}
              </Link>
            </h3>
            {isVerified && (
              <BadgeCheck
                className="h-4 w-4 shrink-0 text-primary"
                aria-label="Verified Business"
              />
            )}
          </div>

          <p className="mt-0.5 text-xs font-medium text-text-secondary">
            Founded by <span className="text-text-primary">{founderName}</span>
          </p>

          <p className="mt-3 text-xs sm:text-sm text-text-secondary line-clamp-2 leading-relaxed">
            {business.description}
          </p>

          {/* Tags */}
          <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
            {business.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-surface px-2.5 py-1 text-[11px] font-medium text-text-secondary transition-colors group-hover:bg-primary-soft group-hover:text-primary"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Meta & Action */}
        <div className="mt-5 flex items-center justify-between border-t border-border/80 pt-4 text-xs text-text-secondary">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span className="line-clamp-1">{business.location}</span>
          </div>

          <Link
            href={`/businesses/${business.slug}`}
            className="inline-flex items-center gap-1 rounded-xl bg-primary/10 px-3 py-1.5 font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white"
          >
            <span>View Profile</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
