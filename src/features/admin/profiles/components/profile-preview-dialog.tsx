"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Globe,
  Users,
  Lock,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  ShieldCheck,
  Building2,
  ExternalLink,
  Eye,
} from "lucide-react";
import type { AdminProfileItem } from "../types/admin-profile";
import {
  ProfileVisibilityBadge,
  ProfileVerificationBadgeTag,
  FeaturedBadge,
} from "./profile-status-badges";

interface ProfilePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AdminProfileItem | null;
}

export function ProfilePreviewDialog({
  isOpen,
  onClose,
  profile,
}: ProfilePreviewDialogProps) {
  const [perspective, setPerspective] = useState<"public" | "member">("public");

  if (!isOpen || !profile) return null;

  const isPublicVisitor = perspective === "public";
  const visibility = profile.privacySettings.profileVisibility;

  // Determine restricted access state
  const isRestricted =
    visibility === "PRIVATE" || (visibility === "MEMBERS_ONLY" && isPublicVisitor);

  const locationText = [
    profile.location?.city,
    profile.location?.district,
    profile.location?.country || "Bangladesh",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Perspective Switcher Banner */}
        <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#5B46F6]" />
            <span className="text-xs font-bold text-gray-900 dark:text-white">
              Visual Profile Preview:
            </span>
            <div className="flex items-center gap-1 bg-white dark:bg-gray-900 p-0.5 rounded-xl border border-indigo-200 dark:border-indigo-800">
              <button
                type="button"
                onClick={() => setPerspective("public")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  isPublicVisitor
                    ? "bg-[#5B46F6] text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                }`}
              >
                Public Visitor View
              </button>
              <button
                type="button"
                onClick={() => setPerspective("member")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  !isPublicVisitor
                    ? "bg-[#5B46F6] text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                }`}
              >
                Logged-in Sister View
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Preview Canvas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Restricted Notice if Applicable */}
          {isRestricted ? (
            <div className="p-8 text-center rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white">
                {visibility === "PRIVATE"
                  ? "This Sister's Profile is Private"
                  : "Members Only Profile"}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
                {visibility === "PRIVATE"
                  ? "The member has chosen to keep their biography and contact details private from platform directories."
                  : "This profile is restricted to authenticated BDSisters members. Public search visitors only see this placeholder notice."}
              </p>
            </div>
          ) : (
            <>
              {/* Profile Card Header */}
              <div className="relative p-6 rounded-3xl bg-linear-to-br from-indigo-50/50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/20 border border-gray-200/80 dark:border-gray-800 shadow-xs">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-[#5B46F6]/10 text-[#5B46F6] font-bold text-2xl flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-md shrink-0">
                    {profile.fullName.charAt(0)}
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-1.5">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {profile.fullName}
                      </h3>
                      {profile.isFeatured && <FeaturedBadge />}
                      <ProfileVerificationBadgeTag status={profile.verificationStatus} />
                    </div>

                    <p className="text-xs font-semibold text-[#5B46F6] dark:text-indigo-400">
                      {profile.headline || profile.profession}
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-500 dark:text-gray-400 pt-1">
                      {profile.privacySettings.showLocation && locationText && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>{locationText}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                        <span>{profile.category}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>{profile.bio}</p>
                  </div>
                )}
              </div>

              {/* Skills Tags */}
              {profile.privacySettings.showSkills && profile.skills.length > 0 && (
                <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 space-y-3">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#5B46F6]" />
                    <span>Skills & Endorsements</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-2.5 py-1 rounded-xl text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                      >
                        {skill.name}
                        {skill.endorsedCount ? ` (${skill.endorsedCount})` : ""}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Business Badge if Applicable */}
              {profile.business.hasBusiness && (
                <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                        {profile.business.businessName}
                      </h4>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                        {profile.business.businessCategory || "Registered Sister Enterprise"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-white dark:bg-gray-900 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 shrink-0">
                    <span>Verified Shop</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              )}

              {/* Contact Information (Filtered based on settings) */}
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 space-y-3">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Contact & Connections
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>
                      {profile.privacySettings.showEmail
                        ? profile.email
                        : "Hidden by member"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>
                      {profile.privacySettings.showPhone
                        ? profile.phone
                        : "Hidden by member"}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 shrink-0">
          <span>Active Privacy Setting: <strong>{profile.privacySettings.profileVisibility}</strong></span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
