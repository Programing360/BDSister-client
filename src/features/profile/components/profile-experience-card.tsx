"use client";

import React from "react";
import Link from "next/link";
import { Briefcase, Plus, Calendar, MapPin, Edit3 } from "lucide-react";
import type { ExperienceItem } from "@/types/profile";

interface ProfileExperienceCardProps {
  experience?: ExperienceItem[];
}

export function ProfileExperienceCard({ experience = [] }: ProfileExperienceCardProps) {
  const hasItems = experience.length > 0;

  return (
    <div className="rounded-3xl bg-white shadow-xl border border-gray-200/80 p-6 sm:p-7">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5B46F6] flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Experience & Entrepreneurship</h2>
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
              <span>Add Experience</span>
            </>
          )}
        </Link>
      </div>

      {hasItems ? (
        <div className="space-y-6">
          {experience.map((item, index) => {
            const isLast = index === experience.length - 1;
            return (
              <div key={item.id || index} className="relative flex items-start gap-4">
                {/* Timeline line */}
                {!isLast && (
                  <div className="absolute top-8 left-4 -bottom-6 w-0.5 bg-gray-100" />
                )}

                <div className="w-8 h-8 rounded-xl bg-purple-100/60 text-[#5B46F6] flex items-center justify-center shrink-0 mt-0.5 border border-purple-200/60 z-10">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1">
                    <h3 className="text-sm font-bold text-gray-900">{item.role}</h3>
                    {item.current && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Present
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-medium text-gray-700 mb-1.5">{item.company}</p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 mb-2">
                    {(item.startDate || item.endDate) && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {item.startDate || "Started"} — {item.current ? "Present" : item.endDate || "Ended"}
                        </span>
                      </div>
                    )}
                    {item.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
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
            No professional experience or business roles added yet.
          </p>
          <Link
            href="/member/profile/edit"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B46F6] hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add your first role</span>
          </Link>
        </div>
      )}
    </div>
  );
}
