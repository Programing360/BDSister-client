"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
  Globe,
  Building2,
  ExternalLink,
  Lock,
  Layers,
  ChevronRight,
  ShieldCheck,
  Info,
} from "lucide-react";
import type { AdminProfileItem } from "../types/admin-profile";
import {
  ProfileApprovalStatusBadge,
  ProfileVisibilityBadge,
  ProfileVerificationBadgeTag,
  FeaturedBadge,
} from "./profile-status-badges";
import {
  ProfileReviewDialog,
  ReviewDialogAction,
} from "./profile-review-dialog";
import { ProfilePreviewDialog } from "./profile-preview-dialog";
import { calculateProfileCompletenessScore } from "../data/admin-profiles-data";

interface ProfileDetailsViewProps {
  initialProfile: AdminProfileItem;
}

export function ProfileDetailsView({ initialProfile }: ProfileDetailsViewProps) {
  const [profile, setProfile] = useState<AdminProfileItem>(initialProfile);
  const [activeReviewAction, setActiveReviewAction] = useState<ReviewDialogAction | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const completeness = calculateProfileCompletenessScore(profile);

  const handleConfirmReview = (
    action: ReviewDialogAction,
    payload: { reason?: string; internalNote?: string; changesRequested?: string }
  ) => {
    let updatedStatus = profile.approvalStatus;
    let isFeatured = profile.isFeatured;
    let toastMsg = "";

    switch (action) {
      case "APPROVE":
        updatedStatus = "PUBLISHED";
        toastMsg = `Profile for ${profile.fullName} has been approved and published!`;
        break;
      case "REJECT":
        updatedStatus = "REJECTED";
        toastMsg = `Profile has been rejected. Reason logged: ${payload.reason}`;
        break;
      case "REQUEST_CHANGES":
        updatedStatus = "CHANGES_REQUESTED";
        toastMsg = `Changes requested notification dispatched to ${profile.fullName}.`;
        break;
      case "SUSPEND":
        updatedStatus = "SUSPENDED";
        toastMsg = `Profile for ${profile.fullName} has been suspended.`;
        break;
      case "RESTORE":
        updatedStatus = "PUBLISHED";
        toastMsg = `Profile for ${profile.fullName} has been restored to active published status.`;
        break;
      case "TOGGLE_FEATURED":
        isFeatured = !profile.isFeatured;
        toastMsg = isFeatured
          ? `Profile marked as featured spotlight!`
          : `Profile removed from featured spotlight.`;
        break;
    }

    setProfile((prev) => ({
      ...prev,
      approvalStatus: updatedStatus,
      isFeatured,
      rejectionReason: payload.reason || prev.rejectionReason,
      changesRequestedNote: payload.changesRequested || prev.changesRequestedNote,
      internalNotes: payload.internalNote || prev.internalNotes,
      lastUpdated: new Date().toISOString().slice(0, 16).replace("T", " "),
    }));

    setFeedbackToast(toastMsg);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const locationText = [
    profile.location?.address,
    profile.location?.city,
    profile.location?.district,
    profile.location?.division,
    profile.location?.country || "Bangladesh",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-gray-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-3 border border-gray-700 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Link href="/admin" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Admin
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/admin/profiles" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Profile Hub
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-semibold text-gray-900 dark:text-white">
          {profile.fullName} ({profile.memberId})
        </span>
      </nav>

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/profiles"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile Directory</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors border border-gray-200 dark:border-gray-800 shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-[#5B46F6]" />
            <span>Visual Preview Mode</span>
          </button>

          <Link
            href={`/admin/profiles/${profile.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors border border-gray-200 dark:border-gray-800 shadow-xs"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </Link>

          {/* Quick Review Decisions */}
          {profile.approvalStatus === "PENDING_REVIEW" || profile.approvalStatus === "UNDER_REVIEW" ? (
            <>
              <button
                type="button"
                onClick={() => setActiveReviewAction("APPROVE")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve Profile</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveReviewAction("REQUEST_CHANGES")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-orange-700 bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:text-orange-300 rounded-xl transition-colors border border-orange-200 dark:border-orange-800"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Request Changes</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveReviewAction("REJECT")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 rounded-xl transition-colors border border-rose-200 dark:border-rose-800"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </>
          ) : profile.approvalStatus === "SUSPENDED" ? (
            <button
              type="button"
              onClick={() => setActiveReviewAction("RESTORE")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#5B46F6] hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Active Standing</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveReviewAction("SUSPEND")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 rounded-xl transition-colors border border-red-200 dark:border-red-800"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Suspend Profile</span>
            </button>
          )}

          {/* Toggle Featured */}
          <button
            type="button"
            onClick={() => setActiveReviewAction("TOGGLE_FEATURED")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors border shadow-xs ${
              profile.isFeatured
                ? "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700"
                : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-50"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{profile.isFeatured ? "Featured Spotlight" : "Feature Profile"}</span>
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-indigo-900 dark:text-indigo-200">
        <Info className="w-4 h-4 text-[#5B46F6] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-semibold">Profile Moderation Boundary: </span>
          Reviewing member biographies, skills, portfolios, and public visibility. Identity document inspections (Smart NID / Passport) are governed separately in the{" "}
          <Link href={`/admin/verifications`} className="underline font-semibold hover:text-[#5B46F6]">
            Identity Verification Module
          </Link>.
        </p>
      </div>

      {/* Profile Header Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 text-[#5B46F6] font-bold text-3xl flex items-center justify-center border-2 border-indigo-100 dark:border-indigo-900 shrink-0 shadow-sm">
            {profile.fullName.charAt(0)}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                {profile.fullName}
              </h1>
              {profile.isFeatured && <FeaturedBadge />}
              <ProfileApprovalStatusBadge status={profile.approvalStatus} />
              <ProfileVerificationBadgeTag status={profile.verificationStatus} />
              <ProfileVisibilityBadge visibility={profile.profileVisibility} />
            </div>

            <p className="text-sm font-semibold text-[#5B46F6] dark:text-indigo-400">
              {profile.headline || profile.profession}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-1">
              <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md font-semibold text-gray-700 dark:text-gray-300">
                {profile.memberId}
              </span>
              <span>Category: <strong>{profile.category}</strong></span>
              <span>Industry: <strong>{profile.industry}</strong></span>
              <span>Submitted: {profile.submittedAt}</span>
              <span>Updated: {profile.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Rejection / Changes Requested Alert if present */}
        {profile.approvalStatus === "REJECTED" && profile.rejectionReason && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Rejection Log:</span>
            </div>
            <p className="pl-6 text-rose-700 dark:text-rose-300">{profile.rejectionReason}</p>
          </div>
        )}

        {profile.approvalStatus === "CHANGES_REQUESTED" && profile.changesRequestedNote && (
          <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-xs text-orange-800 dark:text-orange-200 space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <span>Requested Changes Note:</span>
            </div>
            <p className="pl-6 text-orange-700 dark:text-orange-300">{profile.changesRequestedNote}</p>
          </div>
        )}

        {profile.approvalStatus === "SUSPENDED" && profile.suspendedReason && (
          <div className="p-4 rounded-2xl bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-xs text-red-900 dark:text-red-200 space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Administrative Suspension Ground:</span>
            </div>
            <p className="pl-6 text-red-800 dark:text-red-300">{profile.suspendedReason}</p>
          </div>
        )}
      </div>

      {/* Grid: Main Sections & Sidebar Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Personal, Professional, Skills, Business */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section B: Personal Information & Bio */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#5B46F6]" />
              <span>Personal Information & Contact</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block mb-0.5">Full Legal Name</span>
                <p className="font-semibold text-gray-900 dark:text-white">{profile.fullName}</p>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Professional Display Name</span>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {profile.professionalName || "Same as legal name"}
                </p>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Registered Email</span>
                <p className="font-semibold text-gray-900 dark:text-white">{profile.email}</p>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Direct Phone</span>
                <p className="font-semibold text-gray-900 dark:text-white">{profile.phone}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-400 block mb-0.5">Residential / Studio Location</span>
                <p className="font-semibold text-gray-900 dark:text-white">{locationText || "Bangladesh"}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
              <span className="text-gray-400 block text-xs mb-1">About Me Story (Public Biography)</span>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/60">
                {profile.bio || "No biography provided yet."}
              </p>
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <span className="text-gray-400 block text-xs mb-2">Connected Channels & Portfolios</span>
              <div className="flex flex-wrap gap-2 text-xs">
                {profile.socialLinks.website && (
                  <a
                    href={profile.socialLinks.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:text-[#5B46F6]"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Website</span>
                  </a>
                )}
                {profile.socialLinks.linkedin && (
                  <a
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:text-[#5B46F6]"
                  >
                    <span>LinkedIn</span>
                  </a>
                )}
                {profile.socialLinks.facebook && (
                  <a
                    href={profile.socialLinks.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:text-[#5B46F6]"
                  >
                    <span>Facebook</span>
                  </a>
                )}
                {profile.socialLinks.instagram && (
                  <a
                    href={profile.socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:text-[#5B46F6]"
                  >
                    <span>Instagram</span>
                  </a>
                )}
                {profile.socialLinks.github && (
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:text-[#5B46F6]"
                  >
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Section C: Professional Information & Career History */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#5B46F6]" />
              <span>Professional Credentials & Experience</span>
            </h3>

            {/* Experience list */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-gray-400 block">Career Milestones</span>
              {profile.experience.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No formal career positions listed.</p>
              ) : (
                profile.experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gray-900 dark:text-white">{exp.role}</p>
                      <span className="text-[11px] text-gray-400">
                        {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <p className="text-[#5B46F6] font-medium">{exp.company}</p>
                    {exp.description && <p className="text-gray-600 dark:text-gray-300 mt-1">{exp.description}</p>}
                  </div>
                ))
              )}
            </div>

            {/* Education list */}
            <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <span className="text-xs font-semibold text-gray-400 block">Education & Certifications</span>
              {profile.education.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No formal academic credentials listed.</p>
              ) : (
                profile.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gray-900 dark:text-white">{edu.degree}</p>
                      <span className="text-[11px] text-gray-400">
                        {edu.startDate} – {edu.endDate || "Present"}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{edu.institution}</p>
                    {edu.description && <p className="text-gray-500 mt-0.5">{edu.description}</p>}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section D: Skills & Expertise (Grouped by Category) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-[#5B46F6]" />
              <span>Skills, Endorsements & Expertise</span>
            </h3>

            {profile.skills.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No tagged skills recorded.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{skill.name}</p>
                      <span className="text-[10px] text-gray-400 uppercase font-medium">{skill.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {skill.level && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-[#5B46F6]">
                          {skill.level}
                        </span>
                      )}
                      {skill.endorsedCount !== undefined && (
                        <span className="font-mono text-[10px] text-gray-500 bg-white dark:bg-gray-900 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-800">
                          {skill.endorsedCount} endorsements
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section E: Business & Entrepreneurship Information */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#5B46F6]" />
              <span>Associated Sister Enterprise</span>
            </h3>

            {profile.business.hasBusiness ? (
              <div className="p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {profile.business.businessName}
                    </h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                      {profile.business.businessCategory}
                    </p>
                  </div>
                  {profile.business.tradeLicenseVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Trade License Verified</span>
                    </span>
                  )}
                </div>

                <div className="pt-2 flex items-center gap-3 text-xs">
                  {profile.business.shopUrl && (
                    <Link
                      href={profile.business.shopUrl}
                      className="font-semibold text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-1"
                    >
                      <span>Visit Public Marketplace Shop</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">
                This sister does not have an active registered business entity linked to her account.
              </p>
            )}
          </div>
        </div>

        {/* Right 1 Column: Completeness & Privacy Settings */}
        <div className="space-y-6">
          {/* Section F: Profile Completeness Score */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Completeness
              </h3>
              <span className="text-base font-extrabold text-[#5B46F6]">
                {completeness.percentage}%
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#5B46F6] transition-all duration-300"
                style={{ width: `${completeness.percentage}%` }}
              />
            </div>

            <div className="space-y-2.5 pt-2 text-xs">
              {completeness.breakdown.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-700 shrink-0" />
                    )}
                    <span
                      className={
                        item.completed
                          ? "text-gray-700 dark:text-gray-300 font-medium"
                          : "text-gray-400"
                      }
                    >
                      {item.label}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-gray-400">
                    +{item.weight}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section G: Profile Privacy Settings */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#5B46F6]" />
              <span>Privacy & Visibility Controls</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                <span>Directory Scope</span>
                <ProfileVisibilityBadge visibility={profile.privacySettings.profileVisibility} />
              </div>

              <div className="space-y-2 pt-1 text-gray-600 dark:text-gray-400">
                <div className="flex items-center justify-between">
                  <span>Show Email Address</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {profile.privacySettings.showEmail ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Show Phone Number</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {profile.privacySettings.showPhone ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Show Location / District</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {profile.privacySettings.showLocation ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Show Career & Education</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {profile.privacySettings.showEducation ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Show Social & Portfolios</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {profile.privacySettings.showSocialLinks ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Internal Staff Notes */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Internal Audit Notes
            </h3>
            <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/60 leading-relaxed">
              {profile.internalNotes || "No staff review notes recorded for this profile."}
            </p>
          </div>
        </div>
      </div>

      {/* Review Dialog */}
      <ProfileReviewDialog
        isOpen={activeReviewAction !== null}
        action={activeReviewAction}
        profile={profile}
        onClose={() => setActiveReviewAction(null)}
        onConfirm={handleConfirmReview}
      />

      {/* Visual Preview Modal */}
      <ProfilePreviewDialog
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        profile={profile}
      />
    </div>
  );
}
