"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Clock, Star, Users, GraduationCap, ArrowRight } from "lucide-react";
import type { Course } from "@/types/public";
import { Badge } from "@/components/ui/badge";

interface LearningCardProps {
  course: Course;
}

export function LearningCard({ course }: LearningCardProps) {
  const [imgSrc, setImgSrc] = useState(
    course.coverImage || "/images/placeholders/course-1.jpg"
  );
  const enrolled = course.enrolledCount ?? course.enrollmentsCount ?? 140;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/90 bg-white/90 shadow-card card-hover-effect">
      {/* Course Thumbnail */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface">
        <Image
          src={imgSrc}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={() => setImgSrc("/images/placeholders/course-1.jpg")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2">
          <Badge
            variant="neutral"
            size="sm"
            className="border border-white/40 bg-white/90 text-xs font-medium text-text-primary backdrop-blur-md shadow-xs"
          >
            {course.category}
          </Badge>
          <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-xs">
            {course.level}
          </span>
        </div>

        {/* Star Rating Overlay */}
        <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-text-primary backdrop-blur-md shadow-xs">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>{(course.rating ?? 4.9).toFixed(1)}</span>
        </div>

        {/* Floating Instructor Pill */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-text-primary backdrop-blur-md shadow-xs">
          <GraduationCap className="h-3.5 w-3.5 text-primary" />
          <span>Led by {course.instructor}</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <h3 className="text-lg font-bold text-text-primary transition-colors duration-200 group-hover:text-primary line-clamp-2">
            <Link href={`/learning/${course.slug}`}>
              {course.title}
            </Link>
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-text-secondary line-clamp-2 leading-relaxed">
            {course.description}
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-surface/80 p-3 text-center text-xs text-text-secondary border border-border/60">
            <div className="flex flex-col items-center">
              <Clock className="h-3.5 w-3.5 text-primary mb-1" />
              <span className="font-semibold text-text-primary">{course.duration}</span>
            </div>
            <div className="flex flex-col items-center border-x border-border/80">
              <BookOpen className="h-3.5 w-3.5 text-primary mb-1" />
              <span className="font-semibold text-text-primary">{course.lessonsCount} Modules</span>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-3.5 w-3.5 text-primary mb-1" />
              <span className="font-semibold text-text-primary">{enrolled} Sisters</span>
            </div>
          </div>
        </div>

        {/* Price & Start CTA */}
        <div className="mt-5 flex items-center justify-between border-t border-border/80 pt-4">
          <div>
            <span className="text-[11px] font-medium text-text-secondary block">
              Enrollment
            </span>
            <span className="text-base font-extrabold text-primary">
              {!course.price ? "Free Academy Access" : `৳${course.price.toLocaleString("en-BD")}`}
            </span>
          </div>

          <Link
            href={`/learning/${course.slug}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-button transition-all duration-200 hover:bg-primary-hover hover:shadow-card-hover"
          >
            <span>Start Course</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
