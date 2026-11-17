"use client";

import React from "react";
import Link from "next/link";
import { Award, Heart, Languages, Plus, Edit3 } from "lucide-react";
import type { SkillItem, LanguageItem } from "@/types/profile";

interface ProfileSkillsCardProps {
  skills?: SkillItem[];
  interests?: string[];
  languages?: LanguageItem[];
}

export function ProfileSkillsCard({
  skills = [],
  interests = [],
  languages = [],
}: ProfileSkillsCardProps) {
  const hasSkills = skills.length > 0;
  const hasInterests = interests.length > 0;
  const hasLanguages = languages.length > 0;

  return (
    <div className="rounded-3xl bg-white shadow-xl border border-gray-200/80 p-6 sm:p-7 space-y-6">
      {/* 1. Skills Section */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5B46F6] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Skills & Expertise
            </h2>
          </div>

          <Link
            href="/member/profile/skills"
            className="text-xs font-semibold text-[#5B46F6] hover:text-[#4C38E0] flex items-center gap-1 transition-colors"
          >
            {hasSkills ? (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Manage</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skills</span>
              </>
            )}
          </Link>
        </div>

        {hasSkills ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill.id || skill.name}
                className="px-3 py-1.5 rounded-xl bg-purple-50/70 border border-purple-200/70 text-xs font-semibold text-gray-800 flex items-center gap-2 shadow-sm"
              >
                <span>{skill.name}</span>
                {skill.level && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      skill.level === "EXPERT"
                        ? "bg-[#5B46F6] text-white"
                        : skill.level === "INTERMEDIATE"
                        ? "bg-purple-200/80 text-purple-900"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {skill.level.charAt(0) + skill.level.slice(1).toLowerCase()}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 px-3 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center">
            <p className="text-xs text-gray-500 mb-1.5">No professional skills listed.</p>
            <Link
              href="/member/profile/skills"
              className="text-xs font-semibold text-[#5B46F6] hover:underline"
            >
              Add skills
            </Link>
          </div>
        )}
      </div>

      {/* 2. Interests Section */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Community Interests</h3>
          </div>

          <Link
            href="/member/profile/skills"
            className="text-xs font-semibold text-[#5B46F6] hover:text-[#4C38E0]"
          >
            Edit
          </Link>
        </div>

        {hasInterests ? (
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-200 text-xs font-medium"
              >
                #{interest}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No community interests added yet.</p>
        )}
      </div>

      {/* 3. Languages Section */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Languages className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Languages</h3>
          </div>

          <Link
            href="/member/profile/skills"
            className="text-xs font-semibold text-[#5B46F6] hover:text-[#4C38E0]"
          >
            Edit
          </Link>
        </div>

        {hasLanguages ? (
          <div className="grid grid-cols-2 gap-2.5">
            {languages.map((lang, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-gray-50 border border-gray-200/70 flex items-center justify-between"
              >
                <span className="text-xs font-bold text-gray-900">{lang.language}</span>
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                  {lang.proficiency}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No languages specified.</p>
        )}
      </div>
    </div>
  );
}
