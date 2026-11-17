"use client";

import React from "react";
import Link from "next/link";
import { User, Edit3, Plus } from "lucide-react";

interface ProfileAboutCardProps {
  bio?: string | null;
}

export function ProfileAboutCard({ bio }: ProfileAboutCardProps) {
  const hasBio = Boolean(bio && bio.trim().length > 0);

  return (
    <div className="rounded-3xl bg-white shadow-xl border border-gray-200/80 p-6 sm:p-7">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5B46F6] flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">About Me</h2>
        </div>

        <Link
          href="/member/profile/edit"
          className="text-xs font-semibold text-[#5B46F6] hover:text-[#4C38E0] flex items-center gap-1 transition-colors"
        >
          {hasBio ? (
            <>
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Add Story</span>
            </>
          )}
        </Link>
      </div>

      {hasBio ? (
        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {bio}
        </div>
      ) : (
        <div className="py-6 px-4 rounded-2xl bg-gray-50/70 border border-dashed border-gray-200 text-center">
          <p className="text-xs text-gray-500 mb-2">
            You haven&apos;t added an introduction or biography yet.
          </p>
          <Link
            href="/member/profile/edit"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B46F6] hover:underline"
          >
            <span>Write your introduction</span>
          </Link>
        </div>
      )}
    </div>
  );
}
