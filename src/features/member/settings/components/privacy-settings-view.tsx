"use client";

import React, { useState, useEffect } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Download,
  AlertTriangle,
  CheckCircle2,
  Save,
  Loader2,
  Users,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { settingsService } from "@/lib/services/settings-service";
import type { PrivacySettingsData } from "../types";
import { cn } from "@/lib/utils/cn";

export function PrivacySettingsView() {
  const [privacy, setPrivacy] = useState<PrivacySettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    settingsService.getPrivacySettings().then((data) => {
      if (isMounted) {
        setPrivacy(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggle = (key: keyof PrivacySettingsData) => {
    if (!privacy) return;
    setPrivacy({
      ...privacy,
      [key]: !privacy[key],
    });
  };

  const handleVisibilityChange = (mode: PrivacySettingsData["profileVisibility"]) => {
    if (!privacy) return;
    setPrivacy({ ...privacy, profileVisibility: mode });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacy) return;

    setIsSaving(true);
    try {
      const updated = await settingsService.updatePrivacySettings(privacy);
      setPrivacy(updated);
      toast.success("Privacy preferences saved successfully!");
    } catch {
      toast.error("Failed to save privacy settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const blob = await settingsService.exportAccountData();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bdsisters-data-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Account data archive downloaded successfully!");
    } catch {
      toast.error("Failed to export account archive.");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading || !privacy) {
    return (
      <div className="rounded-3xl border border-gray-200/80 bg-white p-12 text-center text-gray-500">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#5B46F6] mb-2" />
        <p className="text-xs font-semibold">Loading privacy controls...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-200">
      {/* Profile Visibility Selector */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B46F6]">
            <Eye className="h-3.5 w-3.5" />
            <span>Profile Visibility</span>
          </div>
          <h3 className="text-base font-bold text-gray-900 mt-1">Directory Audience</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Choose who can find and view your sisterhood profile in searches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Public */}
          <div
            onClick={() => handleVisibilityChange("PUBLIC")}
            className={cn(
              "relative rounded-2xl border p-4 sm:p-5 cursor-pointer transition-all duration-200 space-y-2",
              privacy.profileVisibility === "PUBLIC"
                ? "border-[#5B46F6] bg-purple-50/40 shadow-xs ring-1 ring-[#5B46F6]"
                : "border-gray-200/80 bg-white hover:border-gray-300"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-[#5B46F6]">
                <Globe className="h-5 w-5" />
              </div>
              <input
                type="radio"
                name="profileVisibility"
                checked={privacy.profileVisibility === "PUBLIC"}
                onChange={() => handleVisibilityChange("PUBLIC")}
                className="text-[#5B46F6] focus:ring-[#5B46F6]"
              />
            </div>
            <p className="text-sm font-bold text-gray-900">Public (Recommended)</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Visible to all visitors, search engines, and potential clients to maximize business visibility.
            </p>
          </div>

          {/* Members Only */}
          <div
            onClick={() => handleVisibilityChange("MEMBERS_ONLY")}
            className={cn(
              "relative rounded-2xl border p-4 sm:p-5 cursor-pointer transition-all duration-200 space-y-2",
              privacy.profileVisibility === "MEMBERS_ONLY"
                ? "border-[#5B46F6] bg-purple-50/40 shadow-xs ring-1 ring-[#5B46F6]"
                : "border-gray-200/80 bg-white hover:border-gray-300"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-[#5B46F6]">
                <Users className="h-5 w-5" />
              </div>
              <input
                type="radio"
                name="profileVisibility"
                checked={privacy.profileVisibility === "MEMBERS_ONLY"}
                onChange={() => handleVisibilityChange("MEMBERS_ONLY")}
                className="text-[#5B46F6] focus:ring-[#5B46F6]"
              />
            </div>
            <p className="text-sm font-bold text-gray-900">Sisterhood Members Only</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Only logged-in and registered sisters can view your profile and services.
            </p>
          </div>

          {/* Private */}
          <div
            onClick={() => handleVisibilityChange("PRIVATE")}
            className={cn(
              "relative rounded-2xl border p-4 sm:p-5 cursor-pointer transition-all duration-200 space-y-2",
              privacy.profileVisibility === "PRIVATE"
                ? "border-[#5B46F6] bg-purple-50/40 shadow-xs ring-1 ring-[#5B46F6]"
                : "border-gray-200/80 bg-white hover:border-gray-300"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-[#5B46F6]">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="radio"
                name="profileVisibility"
                checked={privacy.profileVisibility === "PRIVATE"}
                onChange={() => handleVisibilityChange("PRIVATE")}
                className="text-[#5B46F6] focus:ring-[#5B46F6]"
              />
            </div>
            <p className="text-sm font-bold text-gray-900">Strictly Private</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Completely hidden from directories. Only shared with administrators and direct order counterparts.
            </p>
          </div>
        </div>
      </div>

      {/* Field Masking Controls */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B46F6]">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Field Masking Safeguards</span>
          </div>
          <h3 className="text-base font-bold text-gray-900 mt-1">Contact &amp; Personal Masking</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            By default, your personal email and phone number are hidden to protect against spam and unwanted contact.
          </p>
        </div>

        <div className="divide-y divide-gray-100 space-y-1">
          {/* Email */}
          <div className="flex items-center justify-between gap-4 py-3.5 first:pt-0">
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900">Show Email Address</p>
              <p className="text-[11px] text-gray-500">Allow other visitors to view your email address on your profile page.</p>
            </div>
            <input
              type="checkbox"
              checked={privacy.showEmail}
              onChange={() => handleToggle("showEmail")}
              className="h-4 w-4 rounded border-gray-300 text-[#5B46F6] focus:ring-[#5B46F6]"
            />
          </div>

          {/* Phone */}
          <div className="flex items-center justify-between gap-4 py-3.5">
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900">Show Phone Number</p>
              <p className="text-[11px] text-gray-500">Display your mobile number for WhatsApp or direct calls.</p>
            </div>
            <input
              type="checkbox"
              checked={privacy.showPhone}
              onChange={() => handleToggle("showPhone")}
              className="h-4 w-4 rounded border-gray-300 text-[#5B46F6] focus:ring-[#5B46F6]"
            />
          </div>

          {/* Location */}
          <div className="flex items-center justify-between gap-4 py-3.5">
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900">Show Division &amp; District</p>
              <p className="text-[11px] text-gray-500">Allows sisters in your local district to discover and hire your services.</p>
            </div>
            <input
              type="checkbox"
              checked={privacy.showLocation}
              onChange={() => handleToggle("showLocation")}
              className="h-4 w-4 rounded border-gray-300 text-[#5B46F6] focus:ring-[#5B46F6]"
            />
          </div>

          {/* Skills */}
          <div className="flex items-center justify-between gap-4 py-3.5">
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900">Show Skills &amp; Languages</p>
              <p className="text-[11px] text-gray-500">Highlight your specialized artisanal, commercial, or creative abilities.</p>
            </div>
            <input
              type="checkbox"
              checked={privacy.showSkills}
              onChange={() => handleToggle("showSkills")}
              className="h-4 w-4 rounded border-gray-300 text-[#5B46F6] focus:ring-[#5B46F6]"
            />
          </div>

          {/* Education */}
          <div className="flex items-center justify-between gap-4 py-3.5">
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900">Show Education Background</p>
              <p className="text-[11px] text-gray-500">Display degrees, madrasa certifications, and diplomas.</p>
            </div>
            <input
              type="checkbox"
              checked={privacy.showEducation}
              onChange={() => handleToggle("showEducation")}
              className="h-4 w-4 rounded border-gray-300 text-[#5B46F6] focus:ring-[#5B46F6]"
            />
          </div>
        </div>
      </div>

      {/* Data Protection & Export */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900">Data Portability &amp; Archive</h3>
            <p className="text-xs text-gray-500 max-w-xl leading-relaxed">
              In accordance with our Member Data Protection Charter, you have the right to download a complete digital copy of your profile, orders, goals, and security logs at any time.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportData}
            isLoading={isExporting}
            className="self-start sm:self-center gap-1.5 text-xs font-bold border-gray-200 hover:border-[#5B46F6]/40 hover:text-[#5B46F6]"
          >
            <Download className="h-4 w-4" />
            <span>Download Archive (JSON)</span>
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSaving}
          className="gap-2 shadow-button hover:shadow-card-hover font-bold px-6"
        >
          <Save className="h-4 w-4" />
          <span>Save Privacy Controls</span>
        </Button>
      </div>
    </form>
  );
}
