"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Globe,
  Users,
  Shield,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Eye,
  ShieldCheck,
} from "lucide-react";
import type { PrivacySettings, ProfileVisibility } from "@/types/profile";
import { defaultPrivacySettings } from "@/lib/validations/profile";

interface PrivacySettingsFormProps {
  initialSettings?: PrivacySettings;
}

export function PrivacySettingsForm({ initialSettings }: PrivacySettingsFormProps) {
  const router = useRouter();
  const settings = {
    ...defaultPrivacySettings,
    ...(initialSettings || {}),
  };

  const [visibility, setVisibility] = useState<ProfileVisibility>(settings.profileVisibility);
  const [showEmail, setShowEmail] = useState<boolean>(settings.showEmail);
  const [showPhone, setShowPhone] = useState<boolean>(settings.showPhone);
  const [showLocation, setShowLocation] = useState<boolean>(settings.showLocation);
  const [showEducation, setShowEducation] = useState<boolean>(settings.showEducation);
  const [showExperience, setShowExperience] = useState<boolean>(settings.showExperience);
  const [showSkills, setShowSkills] = useState<boolean>(settings.showSkills);
  const [showSocialLinks, setShowSocialLinks] = useState<boolean>(settings.showSocialLinks);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const privacySettings: PrivacySettings = {
      profileVisibility: visibility,
      showEmail,
      showPhone,
      showLocation,
      showEducation,
      showExperience,
      showSkills,
      showSocialLinks,
    };

    try {
      const res = await fetch("/api/member/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ privacySettings }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to update privacy settings.");
      }

      setSuccessMsg("Privacy preferences updated successfully.");
      router.refresh();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      setErrorMsg((err as Error).message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-3xl shadow-xl border border-gray-200/80">
        <div className="flex items-center gap-3">
          <Link
            href="/member/profile"
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            title="Back to profile"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Privacy & Visibility Settings</h1>
            <p className="text-xs text-gray-500">
              Control exactly who can view your profile and contact attributes across BDSisters.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <Link
            href="/member/profile"
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs sm:text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#5B46F6] hover:bg-[#4C38E0] disabled:opacity-70 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-[#5B46F6]/25 flex items-center gap-2 transition-all active:scale-[0.98]"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Privacy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* 1. PRIMARY PROFILE VISIBILITY CARDS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/80 space-y-5">
        <div>
          <h2 className="text-base font-bold text-gray-900">Profile Level Visibility</h2>
          <p className="text-xs text-gray-500">
            Choose the primary scope of your sisterhood account.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Option: PUBLIC */}
          <div
            onClick={() => setVisibility("PUBLIC")}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              visibility === "PUBLIC"
                ? "border-[#5B46F6] bg-purple-50/40 shadow-md"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#5B46F6] flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Public</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Visible to everyone on the web, search engines, and prospective clients or partners.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-2">
              <input
                type="radio"
                name="visibility"
                checked={visibility === "PUBLIC"}
                onChange={() => setVisibility("PUBLIC")}
                className="w-4 h-4 text-[#5B46F6]"
              />
              <span className="text-xs font-semibold text-gray-700">Recommended for businesses</span>
            </div>
          </div>

          {/* Option: MEMBERS_ONLY */}
          <div
            onClick={() => setVisibility("MEMBERS_ONLY")}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              visibility === "MEMBERS_ONLY"
                ? "border-[#5B46F6] bg-purple-50/40 shadow-md"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Members Only</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Only authenticated BDSisters registered members can see your profile details.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-2">
              <input
                type="radio"
                name="visibility"
                checked={visibility === "MEMBERS_ONLY"}
                onChange={() => setVisibility("MEMBERS_ONLY")}
                className="w-4 h-4 text-[#5B46F6]"
              />
              <span className="text-xs font-semibold text-gray-700">Safe Community Circle</span>
            </div>
          </div>

          {/* Option: PRIVATE */}
          <div
            onClick={() => setVisibility("PRIVATE")}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              visibility === "PRIVATE"
                ? "border-[#5B46F6] bg-purple-50/40 shadow-md"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Private</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Completely hidden from directories and searches. Only you and moderators see your account.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-2">
              <input
                type="radio"
                name="visibility"
                checked={visibility === "PRIVATE"}
                onChange={() => setVisibility("PRIVATE")}
                className="w-4 h-4 text-[#5B46F6]"
              />
              <span className="text-xs font-semibold text-gray-700">Highest Privacy</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. GRANULAR FIELD VISIBILITY TOGGLES */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/80 space-y-6">
        <div>
          <h2 className="text-base font-bold text-gray-900">Granular Field Privacy</h2>
          <p className="text-xs text-gray-500">
            Control the visibility of specific attributes on your profile.
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {/* Show Email */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-gray-900">Show Email Address</p>
              <p className="text-xs text-gray-500">
                Display your email address to visitors. Recommended: Keep OFF to prevent spam.
              </p>
            </div>
            <input
              type="checkbox"
              checked={showEmail}
              onChange={(e) => setShowEmail(e.target.checked)}
              className="w-5 h-5 text-[#5B46F6] rounded focus:ring-[#5B46F6] cursor-pointer"
            />
          </div>

          {/* Show Phone */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-gray-900">Show Phone / WhatsApp Number</p>
              <p className="text-xs text-gray-500">
                Enable direct phone inquiries from visitors and potential buyers.
              </p>
            </div>
            <input
              type="checkbox"
              checked={showPhone}
              onChange={(e) => setShowPhone(e.target.checked)}
              className="w-5 h-5 text-[#5B46F6] rounded focus:ring-[#5B46F6] cursor-pointer"
            />
          </div>

          {/* Show Location */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-gray-900">Show City & District</p>
              <p className="text-xs text-gray-500">
                Helps local sisters in your district discover your regional presence.
              </p>
            </div>
            <input
              type="checkbox"
              checked={showLocation}
              onChange={(e) => setShowLocation(e.target.checked)}
              className="w-5 h-5 text-[#5B46F6] rounded focus:ring-[#5B46F6] cursor-pointer"
            />
          </div>

          {/* Show Education */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-gray-900">Show Education History</p>
              <p className="text-xs text-gray-500">
                Display your universities, degrees, and academic credentials.
              </p>
            </div>
            <input
              type="checkbox"
              checked={showEducation}
              onChange={(e) => setShowEducation(e.target.checked)}
              className="w-5 h-5 text-[#5B46F6] rounded focus:ring-[#5B46F6] cursor-pointer"
            />
          </div>

          {/* Show Experience */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-gray-900">Show Experience & Roles</p>
              <p className="text-xs text-gray-500">
                Display your current and previous job positions and ventures.
              </p>
            </div>
            <input
              type="checkbox"
              checked={showExperience}
              onChange={(e) => setShowExperience(e.target.checked)}
              className="w-5 h-5 text-[#5B46F6] rounded focus:ring-[#5B46F6] cursor-pointer"
            />
          </div>

          {/* Show Skills */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-gray-900">Show Skills & Interests</p>
              <p className="text-xs text-gray-500">
                Display your tagged proficiencies and community interests.
              </p>
            </div>
            <input
              type="checkbox"
              checked={showSkills}
              onChange={(e) => setShowSkills(e.target.checked)}
              className="w-5 h-5 text-[#5B46F6] rounded focus:ring-[#5B46F6] cursor-pointer"
            />
          </div>

          {/* Show Social Links */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-gray-900">Show Social Media Links</p>
              <p className="text-xs text-gray-500">
                Display buttons linking to your LinkedIn, GitHub, Facebook, and Instagram.
              </p>
            </div>
            <input
              type="checkbox"
              checked={showSocialLinks}
              onChange={(e) => setShowSocialLinks(e.target.checked)}
              className="w-5 h-5 text-[#5B46F6] rounded focus:ring-[#5B46F6] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 3. SAFETY GUARANTEE CALLOUT */}
      <div className="p-6 rounded-3xl bg-purple-50/70 border border-purple-200/80 flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-[#5B46F6] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#5B46F6]/25">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-gray-900">Sisterhood Privacy Commitment</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            BDSisters is built specifically as a respectful, dignified, and secure space for Bangladeshi women.
            We never sell your contact information or personal data to third-party ad brokers.
            Any field you mark as hidden is filtered on our secure servers before reaching any browser.
          </p>
        </div>
      </div>
    </form>
  );
}
