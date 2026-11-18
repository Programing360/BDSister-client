"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, MapPin, Briefcase, ArrowRight, User } from "lucide-react";
import type { PublicMemberProfile } from "@/types/profile";

interface MemberCardProps {
  member: PublicMemberProfile;
}

export function MemberCard({ member }: MemberCardProps) {
  const skills = member.skills || [];
  const topSkills = skills.slice(0, 3);
  const remainingCount = skills.length - topSkills.length;

  const locationString = [
    member.location?.district || member.location?.city,
    member.location?.division,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
      <div className="space-y-4">
        {/* Top Header: Avatar + Verified Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="relative">
            {member.avatar ? (
              <img
                src={member.avatar}
                alt={member.displayName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-100 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-[#5B46F6] border-2 border-purple-100 flex items-center justify-center font-bold text-xl shadow-sm">
                {member.displayName?.charAt(0)?.toUpperCase() || <User className="w-8 h-8" />}
              </div>
            )}
            {member.isVerified && (
              <div
                className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-md"
                title="Verified Sister"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          {member.membershipTier && member.membershipTier !== "FREE" && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-[#5B46F6] border border-purple-200">
              {member.membershipTier}
            </span>
          )}
        </div>

        {/* Name and Headline */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-gray-900 group-hover:text-[#5B46F6] transition-colors line-clamp-1 text-base">
              {member.displayName}
            </h3>
            {member.isVerified && (
              <span className="inline-flex items-center text-emerald-600 shrink-0" title="Verified Sister">
                <ShieldCheck className="w-4 h-4 fill-emerald-100" />
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 line-clamp-2 min-h-[32px]">
            {member.headline || "BDSisters Community Member"}
          </p>
        </div>

        {/* Location */}
        {locationString && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="w-3.5 h-3.5 text-[#5B46F6] shrink-0" />
            <span className="line-clamp-1">{locationString}</span>
          </div>
        )}

        {/* Skills list */}
        {topSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {topSkills.map((sk) => (
              <span
                key={sk.id || sk.name}
                className="px-2 py-0.5 rounded-lg bg-gray-50 border border-gray-100 text-[11px] font-medium text-gray-600"
              >
                {sk.name}
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="px-2 py-0.5 rounded-lg bg-purple-50 text-[11px] font-semibold text-[#5B46F6]">
                +{remainingCount}
              </span>
            )}
          </div>
        )}
      </div>

      {/* View Profile Action */}
      <div className="pt-5 mt-4 border-t border-gray-100">
        <Link
          href={`/members/${member.userId}`}
          className="w-full py-2.5 px-4 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-[#5B46F6] hover:text-white text-[#5B46F6] text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <span>View Sister Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
