"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  ShieldCheck,
  Edit3,
  Eye,
  Lock,
  Globe,
  Share2,
  Download,
  Loader2,
} from "lucide-react";
import { FaLinkedin, FaGithub, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import type { MemberProfileDocument } from "@/types/profile";
import type { AuthUser } from "@/types/auth";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface ProfileHeaderProps {
  user: AuthUser;
  profile: MemberProfileDocument;
  onOpenPreview?: () => void;
}

export function ProfileHeader({ user, profile, onOpenPreview }: ProfileHeaderProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = () => {
    setIsExporting(true);
    try {
      const a = document.createElement("a");
      a.href = API_ENDPOINTS.auth.exportPdf;
      a.target = "_blank";
      a.download = `${(profile.displayName || user.name || "bdsisters-profile").toLowerCase().replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("PDF Export error:", err);
    } finally {
      setTimeout(() => setIsExporting(false), 1500);
    }
  };

  const avatarUrl = profile.avatar || user.image;
  const displayName = profile.displayName || user.name || "BDSisters Member";
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "Member";

  const locationText = [
    profile.location?.city,
    profile.location?.district,
    profile.location?.country || "Bangladesh",
  ]
    .filter(Boolean)
    .join(", ");

  const hasSocials =
    profile.socialLinks &&
    Object.values(profile.socialLinks).some((url) => Boolean(url && url.trim().length > 0));

  return (
    <div className="relative rounded-3xl bg-white shadow-xl border border-gray-200/80 overflow-hidden">
      {/* Cover Banner */}
      <div className="relative h-48 sm:h-64 w-full bg-gradient-to-r from-[#5B46F6] via-[#7366F7] to-[#8C80F8]">
        {profile.coverImage ? (
          <Image
            src={profile.coverImage}
            alt="Cover banner"
            fill
            sizes="100vw"
            priority
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        )}

        {/* Quick Edit Cover pill in top right */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Link
            href="/member/profile/edit"
            className="px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md text-xs font-medium flex items-center gap-1.5 transition-all shadow-md"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Customize Header</span>
          </Link>
        </div>
      </div>

      {/* Main Profile Info Section */}
      <div className="px-6 sm:px-8 pb-8 pt-0 relative">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
          {/* Avatar and Main Identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            <div className="relative group">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden relative">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    fill
                    sizes="144px"
                    priority
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-[#EAE6F7] flex items-center justify-center text-[#5B46F6] text-3xl font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Verified badge */}
              {(profile.isVerified || user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
                <div
                  className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-md"
                  title="Verified Sister"
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  {displayName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-[#5B46F6] border border-purple-200">
                  {profile.membershipTier || "Free Member"}
                </span>
              </div>

              {profile.headline ? (
                <p className="text-sm sm:text-base font-medium text-gray-700 max-w-xl">
                  {profile.headline}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  No professional headline added yet.
                </p>
              )}

              {/* Meta pills: Location, Join date */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-500 pt-1">
                {locationText && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{locationText}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>Joined {memberSince}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center sm:justify-end gap-3 flex-wrap">
            {onOpenPreview && (
              <button
                type="button"
                onClick={onOpenPreview}
                className="px-4 py-2.5 rounded-xl border border-gray-200/80 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold shadow-sm flex items-center gap-2 transition-all hover:border-[#5B46F6]"
              >
                <Eye className="w-4 h-4 text-[#5B46F6]" />
                <span>Live Preview</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExporting}
              className="px-4 py-2.5 rounded-xl border border-gray-200/80 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold shadow-sm flex items-center gap-2 transition-all hover:border-[#5B46F6] disabled:opacity-60"
              title="Download your profile in official PDF format"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#5B46F6]" />
              ) : (
                <Download className="w-4 h-4 text-[#5B46F6]" />
              )}
              <span>Export PDF</span>
            </button>

            <Link
              href="/member/profile/privacy"
              className="p-2.5 rounded-xl border border-gray-200/80 bg-white hover:bg-gray-50 text-gray-700 shadow-sm transition-all hover:border-[#5B46F6]"
              title="Privacy Settings"
            >
              <Lock className="w-4 h-4 text-gray-600" />
            </Link>

            <Link
              href="/member/profile/edit"
              className="px-5 py-2.5 rounded-xl bg-[#5B46F6] hover:bg-[#4C38E0] text-white text-sm font-semibold shadow-lg shadow-[#5B46F6]/25 flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>

        {/* Social Links Row if present */}
        {hasSocials && (
          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Connected Channels
            </span>
            <div className="flex items-center gap-3">
              {profile.socialLinks?.linkedin && (
                <a
                  href={profile.socialLinks.linkedin.startsWith("http") ? profile.socialLinks.linkedin : `https://${profile.socialLinks.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-[#0A66C2] flex items-center justify-center transition-colors shadow-sm"
                  title="LinkedIn Profile"
                >
                  <FaLinkedin className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github.startsWith("http") ? profile.socialLinks.github : `https://${profile.socialLinks.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-colors shadow-sm"
                  title="GitHub Profile"
                >
                  <FaGithub className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks?.facebook && (
                <a
                  href={profile.socialLinks.facebook.startsWith("http") ? profile.socialLinks.facebook : `https://${profile.socialLinks.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-[#1877F2] flex items-center justify-center transition-colors shadow-sm"
                  title="Facebook Page"
                >
                  <FaFacebook className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks?.instagram && (
                <a
                  href={profile.socialLinks.instagram.startsWith("http") ? profile.socialLinks.instagram : `https://${profile.socialLinks.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-50 hover:bg-pink-50 text-gray-600 hover:text-[#E4405F] flex items-center justify-center transition-colors shadow-sm"
                  title="Instagram"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks?.twitter && (
                <a
                  href={profile.socialLinks.twitter.startsWith("http") ? profile.socialLinks.twitter : `https://${profile.socialLinks.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-black flex items-center justify-center transition-colors shadow-sm"
                  title="X (Twitter)"
                >
                  <FaTwitter className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks?.website && (
                <a
                  href={profile.socialLinks.website.startsWith("http") ? profile.socialLinks.website : `https://${profile.socialLinks.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-50 hover:bg-purple-50 text-gray-600 hover:text-[#5B46F6] flex items-center justify-center transition-colors shadow-sm"
                  title="Personal Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
