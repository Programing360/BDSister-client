"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Bell,
  CheckCircle2,
  ShieldCheck,
  Save,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { settingsService } from "@/lib/services/settings-service";
import type { AccountGeneralSettings } from "../types";
import { cn } from "@/lib/utils/cn";

export function GeneralSettingsView() {
  const [settings, setSettings] = useState<AccountGeneralSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    settingsService.getGeneralSettings().then((data) => {
      if (isMounted) {
        setSettings(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleInputChange = (field: keyof AccountGeneralSettings, value: unknown) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const handleNotificationToggle = (key: keyof AccountGeneralSettings["notifications"]) => {
    if (!settings) return;
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    try {
      const updated = await settingsService.updateGeneralSettings(settings);
      setSettings(updated);
      toast.success("Account preferences updated successfully!");
    } catch {
      toast.error("Failed to update settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="rounded-3xl border border-gray-200/80 bg-white p-12 text-center text-gray-500">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#5B46F6] mb-2" />
        <p className="text-xs font-semibold">Loading account preferences...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-200">
      {/* Identity Card */}
      <div className="rounded-3xl border border-gray-200/80 bg-gradient-to-br from-white via-slate-50/50 to-purple-50/30 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5B46F6] to-purple-700 text-white font-black text-xl shadow-md">
              {settings.displayName
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase() || "BD"}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">{settings.displayName}</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Verified Sister</span>
                </span>
              </div>
              <p className="text-xs text-gray-500">{settings.email}</p>
              <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-0.5">
                <MapPin className="h-3 w-3 text-[#5B46F6]" />
                <span>{settings.district}, {settings.division}</span>
              </div>
            </div>
          </div>

          <Link href="/member/profile/edit">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-bold border-gray-200 hover:border-[#5B46F6]/40 hover:text-[#5B46F6]"
            >
              <span>Edit Full Profile</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Account Details Form */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h3 className="text-base font-bold text-gray-900">Personal Information</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Basic contact coordinates associated with your sister account.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Display Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700">Display Name</label>
            <Input
              value={settings.displayName}
              onChange={(e) => handleInputChange("displayName", e.target.value)}
              placeholder="e.g. Ayesha Siddiqua"
              leftIcon={<User className="h-4 w-4" />}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700">Primary Email</label>
              {settings.isEmailVerified && (
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </span>
              )}
            </div>
            <Input
              type="email"
              value={settings.email}
              readOnly
              className="bg-gray-50/70 text-gray-600 cursor-not-allowed"
              leftIcon={<Mail className="h-4 w-4" />}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700">Phone Number (Bangladesh)</label>
              {settings.isPhoneVerified && (
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </span>
              )}
            </div>
            <Input
              value={settings.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+880 1712-345678"
              leftIcon={<Phone className="h-4 w-4" />}
            />
          </div>

          {/* Language Preference */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700">Preferred Language</label>
            <div className="relative">
              <select
                value={settings.preferredLanguage}
                onChange={(e) => handleInputChange("preferredLanguage", e.target.value)}
                className="w-full rounded-2xl border border-gray-200/80 bg-white px-4 py-2.5 text-xs font-semibold text-gray-900 shadow-2xs transition-all hover:border-[#5B46F6]/40 focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
              >
                <option value="bn">বাংলা (Bengali)</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Discoverability Card */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900">Sisterhood Directory Discoverability</h3>
            <p className="text-xs text-gray-500 max-w-xl leading-relaxed">
              When enabled, your public profile and verified badge will be discoverable by other sisters in the nationwide Sisterhood Directory, allowing mutual networking and client connections.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
            <input
              type="checkbox"
              checked={settings.directoryDiscoverable}
              onChange={(e) => handleInputChange("directoryDiscoverable", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5B46F6]"></div>
          </label>
        </div>
      </div>

      {/* Notifications Channels & Alerts */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B46F6]">
            <Bell className="h-3.5 w-3.5" />
            <span>Alert Preferences</span>
          </div>
          <h3 className="text-base font-bold text-gray-900 mt-1">Notification Channels</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Choose which alerts and email dispatches you wish to receive from BDSisters.org.
          </p>
        </div>

        <div className="space-y-4 divide-y divide-gray-100">
          {/* Order Updates */}
          <div className="pt-3 first:pt-0 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900">Orders, Invoices &amp; Deliveries</p>
              <p className="text-[11px] text-gray-500">Real-time status updates when an order is placed, shipped, or delivered.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.orderUpdates}
              onChange={() => handleNotificationToggle("orderUpdates")}
              className="h-4 w-4 rounded border-gray-300 text-[#5B46F6] focus:ring-[#5B46F6]"
            />
          </div>

          {/* Community Replies */}
          <div className="pt-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900">Community Replies &amp; Mentions</p>
              <p className="text-[11px] text-gray-500">Notify me when a sister replies to my discussion thread or questions.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.communityReplies}
              onChange={() => handleNotificationToggle("communityReplies")}
              className="h-4 w-4 rounded border-gray-300 text-[#5B46F6] focus:ring-[#5B46F6]"
            />
          </div>

          {/* Weekly Newsletter */}
          <div className="pt-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900">Weekly Entrepreneur &amp; Grants Digest</p>
              <p className="text-[11px] text-gray-500">Curated stories, export grant alerts, and business tips every Thursday.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.weeklyNewsletter}
              onChange={() => handleNotificationToggle("weeklyNewsletter")}
              className="h-4 w-4 rounded border-gray-300 text-[#5B46F6] focus:ring-[#5B46F6]"
            />
          </div>

          {/* Event Reminders */}
          <div className="pt-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900">Masterclass &amp; Workshop Reminders</p>
              <p className="text-[11px] text-gray-500">Timely notifications 24 hours and 1 hour before scheduled events.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.eventReminders}
              onChange={() => handleNotificationToggle("eventReminders")}
              className="h-4 w-4 rounded border-gray-300 text-[#5B46F6] focus:ring-[#5B46F6]"
            />
          </div>
        </div>
      </div>

      {/* Save Action */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSaving}
          className="gap-2 shadow-button hover:shadow-card-hover font-bold px-6"
        >
          <Save className="h-4 w-4" />
          <span>Save Preferences</span>
        </Button>
      </div>
    </form>
  );
}
