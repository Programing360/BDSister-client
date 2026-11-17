"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Eye,
  Shield,
  Globe,
  Users,
  Lock,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
} from "lucide-react";
import type { MemberProfileDocument } from "@/types/profile";
import type { AuthUser } from "@/types/auth";
import { filterProfileByPrivacy } from "@/features/profile/utils/profile-utils";

interface ProfilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser;
  profile: MemberProfileDocument;
}

export function ProfilePreviewModal({
  isOpen,
  onClose,
  user,
  profile,
}: ProfilePreviewModalProps) {
  const [perspective, setPerspective] = useState<"owner" | "member" | "public">("public");

  if (!isOpen) return null;

  // Compute filtered view on the fly using our deterministic privacy service
  let previewData;
  if (perspective === "owner") {
    previewData = filterProfileByPrivacy(profile, {
      viewerUserId: user.id,
      isAuthenticated: true,
      viewerRole: user.role,
    });
  } else if (perspective === "member") {
    previewData = filterProfileByPrivacy(profile, {
      viewerUserId: "fellow-member-id",
      isAuthenticated: true,
      viewerRole: "MEMBER",
    });
  } else {
    // public
    previewData = filterProfileByPrivacy(profile, {
      viewerUserId: null,
      isAuthenticated: false,
      viewerRole: null,
    });
  }

  const locationText = [
    previewData.location?.city,
    previewData.location?.district,
    previewData.location?.country || "Bangladesh",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
        {/* Modal Header & Perspective Switcher */}
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50/60">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#5B46F6]" />
              <span>Real-Time Privacy Preview</span>
            </h2>
            <p className="text-xs text-gray-500">
              See exactly what different audiences can see based on your privacy settings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher Pills */}
            <div className="flex items-center p-1 bg-white rounded-xl border border-gray-200/80 shadow-xs">
              <button
                type="button"
                onClick={() => setPerspective("public")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  perspective === "public"
                    ? "bg-[#5B46F6] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Public Visitor</span>
              </button>
              <button
                type="button"
                onClick={() => setPerspective("member")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  perspective === "member"
                    ? "bg-[#5B46F6] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Fellow Sister</span>
              </button>
              <button
                type="button"
                onClick={() => setPerspective("owner")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  perspective === "owner"
                    ? "bg-[#5B46F6] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Owner View</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {previewData.isRestricted ? (
            <div className="p-12 text-center rounded-3xl bg-gray-50 border border-gray-200/80">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-[#5B46F6] flex items-center justify-center mx-auto mb-3">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {previewData.restrictedReason === "PRIVATE_PROFILE"
                  ? "This profile is private"
                  : "Members Only Profile"}
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                {previewData.restrictedReason === "PRIVATE_PROFILE"
                  ? "You have set your profile visibility to Private. Only you and platform administrators can view your details."
                  : "You have set your profile visibility to Members Only. Unauthenticated visitors are prompted to sign in or create an account to view your full profile."}
              </p>
            </div>
          ) : (
            <>
              {/* Preview Header Banner */}
              <div className="rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm">
                <div className="h-32 sm:h-40 w-full bg-gradient-to-r from-[#5B46F6] to-[#7366F7] relative">
                  {previewData.coverImage && (
                    <Image
                      src={previewData.coverImage}
                      alt="Cover"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>

                <div className="px-6 pb-6 pt-0 relative bg-white">
                  <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12 mb-4">
                    <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden relative shrink-0">
                      {previewData.avatar ? (
                        <Image
                          src={previewData.avatar}
                          alt={previewData.displayName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-[#EAE6F7] text-[#5B46F6] flex items-center justify-center text-2xl font-bold">
                          {previewData.displayName.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="text-center sm:text-left">
                      <h3 className="text-xl font-bold text-gray-900">
                        {previewData.displayName}
                      </h3>
                      <p className="text-xs font-medium text-gray-600">
                        {previewData.headline || "BDSisters Community Member"}
                      </p>
                      {locationText && (
                        <p className="text-[11px] text-gray-400 mt-0.5 flex items-center justify-center sm:justify-start gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{locationText}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {previewData.bio && (
                    <p className="text-xs text-gray-700 leading-relaxed border-t border-gray-100 pt-3">
                      {previewData.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Work & Education Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Experience */}
                <div className="p-5 rounded-2xl border border-gray-200/80 bg-white">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#5B46F6]" />
                    <span>Experience</span>
                  </h4>
                  {previewData.experience && previewData.experience.length > 0 ? (
                    <div className="space-y-3">
                      {previewData.experience.map((exp, idx) => (
                        <div key={idx} className="text-xs">
                          <p className="font-bold text-gray-900">{exp.role}</p>
                          <p className="text-gray-600">{exp.company}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No experience displayed (or hidden by privacy).</p>
                  )}
                </div>

                {/* Education */}
                <div className="p-5 rounded-2xl border border-gray-200/80 bg-white">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#5B46F6]" />
                    <span>Education</span>
                  </h4>
                  {previewData.education && previewData.education.length > 0 ? (
                    <div className="space-y-3">
                      {previewData.education.map((edu, idx) => (
                        <div key={idx} className="text-xs">
                          <p className="font-bold text-gray-900">{edu.institution}</p>
                          <p className="text-gray-600">{edu.degree}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No education displayed (or hidden by privacy).</p>
                  )}
                </div>
              </div>

              {/* Skills Preview */}
              <div className="p-5 rounded-2xl border border-gray-200/80 bg-white">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#5B46F6]" />
                  <span>Skills</span>
                </h4>
                {previewData.skills && previewData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {previewData.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-purple-50 text-[#5B46F6] text-xs font-semibold"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No skills displayed (or hidden by privacy).</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            Privacy controls can be adjusted anytime under Profile &gt; Privacy Settings.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
