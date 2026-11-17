"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, Plus, Calendar, Edit3 } from "lucide-react";
import type { EducationItem } from "@/types/profile";

interface ProfileEducationCardProps {
  education?: EducationItem[];
}

export function ProfileEducationCard({ education = [] }: ProfileEducationCardProps) {
  const hasItems = education.length > 0;

  return (
    <div className="rounded-3xl bg-white shadow-xl border border-gray-200/80 p-6 sm:p-7">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5B46F6] flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Education & Training</h2>
          </div>
        </div>

        <Link
          href="/member/profile/edit"
          className="text-xs font-semibold text-[#5B46F6] hover:text-[#4C38E0] flex items-center gap-1 transition-colors"
        >
          {hasItems ? (
            <>
              <Edit3 className="w-3.5 h-3.5" />
              <span>Manage</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Add Education</span>
            </>
          )}
        </Link>
      </div>

      {hasItems ? (
        <div className="space-y-5">
          {education.map((item, index) => {
            const isLast = index === education.length - 1;
            return (
              <div key={item.id || index} className="relative flex items-start gap-4">
                {!isLast && (
                  <div className="absolute top-8 left-4 -bottom-5 w-0.5 bg-gray-100" />
                )}

                <div className="w-8 h-8 rounded-xl bg-purple-100/60 text-[#5B46F6] flex items-center justify-center shrink-0 mt-0.5 border border-purple-200/60 z-10">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-1 mb-0.5">
                    <h3 className="text-sm font-bold text-gray-900">{item.institution}</h3>
                    {item.current && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        In Progress
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-gray-700">
                    {item.degree}
                    {item.fieldOfStudy ? ` • ${item.fieldOfStudy}` : ""}
                  </p>

                  {(item.startDate || item.endDate) && (
                    <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1 mb-1.5">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {item.startDate || "Enrolled"} — {item.current ? "Present" : item.endDate || "Graduated"}
                      </span>
                    </div>
                  )}

                  {item.description && (
                    <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-6 px-4 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center">
          <p className="text-xs text-gray-500 mb-2">
            No education or academic credentials added yet.
          </p>
          <Link
            href="/member/profile/edit"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B46F6] hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add education</span>
          </Link>
        </div>
      )}
    </div>
  );
}
