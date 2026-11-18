"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  Users,
  Clock,
  Star,
  Edit,
  ExternalLink,
  Power,
  Layers,
} from "lucide-react";
import type { CourseItem, CourseStatus } from "../../types/resource";
import {
  CourseLevelBadge,
  CourseStatusBadge,
} from "../common/resource-status-badge";

interface CourseTableProps {
  courses: CourseItem[];
  onTogglePublish: (id: string) => void;
  onToggleFeatured: (id: string) => void;
}

export function CourseTable({
  courses,
  onTogglePublish,
  onToggleFeatured,
}: CourseTableProps) {
  if (courses.length === 0) {
    return (
      <div className="p-12 text-center bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)]">
        <GraduationCap className="w-10 h-10 text-brand-muted/60 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-brand-navy">
          No Courses Found
        </h3>
        <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
          No structured curricula match your filter parameters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] overflow-hidden">
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[1050px]">
          <thead className="bg-brand-surface/70 text-brand-muted uppercase text-[11px] font-semibold border-b border-brand-primary/10">
            <tr>
              <th className="py-3.5 px-4">Course</th>
              <th className="py-3.5 px-4">Instructor</th>
              <th className="py-3.5 px-4">Level</th>
              <th className="py-3.5 px-4">Curriculum</th>
              <th className="py-3.5 px-4">Learners & Rate</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-primary/5">
            {courses.map((crs) => (
              <tr
                key={crs.id}
                className="hover:bg-brand-surface/50 transition-colors"
              >
                {/* Course Title & Cover */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-brand-surface border border-brand-primary/15 shrink-0">
                      <Image
                        src={crs.coverImageUrl}
                        alt={crs.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                      {crs.isFeatured && (
                        <div className="absolute top-1 right-1 p-0.5 rounded-full bg-amber-400 text-brand-navy shadow-sm">
                          <Star className="w-2.5 h-2.5 fill-current" />
                        </div>
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/admin/resources/courses/${crs.id}`}
                        className="font-semibold text-brand-navy hover:text-brand-primary text-sm line-clamp-1"
                      >
                        {crs.title}
                      </Link>
                      <span className="text-[11px] text-brand-primary font-medium">
                        {crs.categoryName} • {crs.duration}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Instructor */}
                <td className="py-3.5 px-4">
                  <p className="font-semibold text-brand-navy">
                    {crs.instructor.name}
                  </p>
                  <p className="text-[10px] text-brand-muted">
                    {crs.instructor.organization}
                  </p>
                </td>

                {/* Level */}
                <td className="py-3.5 px-4">
                  <CourseLevelBadge level={crs.level} />
                </td>

                {/* Curriculum Modules & Lessons */}
                <td className="py-3.5 px-4 font-medium text-brand-navy">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-brand-primary" />
                    {crs.modulesCount} modules ({crs.lessonsCount} lessons)
                  </span>
                </td>

                {/* Learners & Rate */}
                <td className="py-3.5 px-4">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-brand-navy flex items-center gap-1">
                      <Users className="w-3 h-3 text-brand-primary" />
                      {crs.enrolledLearnersCount.toLocaleString()} enrolled
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-brand-muted">
                      <span>{crs.completionRatePct}% completion</span>
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td className="py-3.5 px-4 font-semibold text-brand-navy text-sm">
                  {crs.priceBDT === 0
                    ? "Free"
                    : `৳ ${crs.priceBDT.toLocaleString()}`}
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <CourseStatusBadge status={crs.status} />
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onToggleFeatured(crs.id)}
                      className={`p-1.5 rounded-lg border transition ${
                        crs.isFeatured
                          ? "border-amber-300 text-amber-500 bg-amber-50 hover:bg-amber-100"
                          : "border-brand-primary/20 text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10"
                      }`}
                      title={crs.isFeatured ? "Unfeature" : "Feature on LMS Carousel"}
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onTogglePublish(crs.id)}
                      className="p-1.5 rounded-lg border border-brand-primary/20 text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition"
                      title={crs.status === "PUBLISHED" ? "Unpublish" : "Publish Course"}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      href={`/admin/resources/courses/${crs.id}/edit`}
                      className="p-1.5 rounded-lg border border-brand-primary/20 text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition"
                      title="Edit Course & Curriculum Builder"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/admin/resources/courses/${crs.id}`}
                      className="p-1.5 rounded-lg border border-brand-primary/20 text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition"
                      title="Inspect Course Structure"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="lg:hidden divide-y divide-brand-primary/10 p-4 space-y-4">
        {courses.map((crs) => (
          <div key={crs.id} className="pt-4 first:pt-0 space-y-3">
            <div className="flex items-start gap-3">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-brand-surface border border-brand-primary/15 shrink-0">
                <Image
                  src={crs.coverImageUrl}
                  alt={crs.title}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/admin/resources/courses/${crs.id}`}
                  className="font-semibold text-brand-navy hover:text-brand-primary text-sm line-clamp-1"
                >
                  {crs.title}
                </Link>
                <p className="text-[11px] text-brand-primary font-medium">
                  {crs.categoryName} • By {crs.instructor.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <CourseStatusBadge status={crs.status} />
                  <span className="text-[11px] text-brand-muted">
                    {crs.enrolledLearnersCount} enrolled
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-brand-primary/5">
              <span className="font-semibold text-brand-navy">
                {crs.priceBDT === 0 ? "Free" : `৳ ${crs.priceBDT}`}
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/resources/courses/${crs.id}/edit`}
                  className="text-xs font-semibold text-brand-primary"
                >
                  Edit / Builder
                </Link>
                <Link
                  href={`/admin/resources/courses/${crs.id}`}
                  className="text-xs font-semibold text-brand-primary"
                >
                  View →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
