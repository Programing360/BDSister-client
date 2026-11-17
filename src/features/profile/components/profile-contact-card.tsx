"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Mail, Phone, Lock, Edit3 } from "lucide-react";
import type { LocationData, PrivacySettings } from "@/types/profile";

interface ProfileContactCardProps {
  email?: string | null;
  phone?: string | null;
  location?: LocationData;
  privacySettings?: PrivacySettings;
}

export function ProfileContactCard({
  email,
  phone,
  location,
  privacySettings,
}: ProfileContactCardProps) {
  const fullAddress = [
    location?.address,
    location?.city,
    location?.district,
    location?.division,
    location?.country || "Bangladesh",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="rounded-3xl bg-white shadow-xl border border-gray-200/80 p-6 sm:p-7">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">Contact & Location</h2>
        <Link
          href="/member/profile/edit"
          className="text-xs font-semibold text-[#5B46F6] hover:text-[#4C38E0] flex items-center gap-1"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </Link>
      </div>

      <div className="space-y-3.5">
        {/* Email */}
        <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50/70 border border-gray-100">
          <div className="w-7 h-7 rounded-lg bg-white text-gray-500 flex items-center justify-center shrink-0 border border-gray-200/60 shadow-xs">
            <Mail className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Email Address
              </p>
              {!privacySettings?.showEmail && (
                <span className="text-[10px] text-gray-400 flex items-center gap-1" title="Hidden from public">
                  <Lock className="w-2.5 h-2.5" />
                  Hidden
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-gray-900 truncate">
              {email || "Not specified"}
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50/70 border border-gray-100">
          <div className="w-7 h-7 rounded-lg bg-white text-gray-500 flex items-center justify-center shrink-0 border border-gray-200/60 shadow-xs">
            <Phone className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Phone Number
              </p>
              {!privacySettings?.showPhone && (
                <span className="text-[10px] text-gray-400 flex items-center gap-1" title="Hidden from public">
                  <Lock className="w-2.5 h-2.5" />
                  Hidden
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-gray-900">
              {phone || "Not specified"}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50/70 border border-gray-100">
          <div className="w-7 h-7 rounded-lg bg-white text-gray-500 flex items-center justify-center shrink-0 border border-gray-200/60 shadow-xs">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Primary Location
            </p>
            <p className="text-xs font-medium text-gray-900">
              {fullAddress || "Bangladesh"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
