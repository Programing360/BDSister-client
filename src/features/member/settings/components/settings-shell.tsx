"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Sliders, ShieldCheck, Lock, Sparkles } from "lucide-react";

interface SettingsShellProps {
  children: React.ReactNode;
}

const SETTINGS_TABS = [
  {
    label: "Account & Preferences",
    href: "/member/settings",
    description: "Personal identity, phone, language & notification alerts",
    icon: Sliders,
    exact: true,
  },
  {
    label: "Security & Logins",
    href: "/member/settings/security",
    description: "Password credentials, two-factor auth & active devices",
    icon: ShieldCheck,
    exact: false,
  },
  {
    label: "Privacy & Visibility",
    href: "/member/settings/privacy",
    description: "Directory discovery, contact masking & data retention",
    icon: Lock,
    exact: false,
  },
];

export function SettingsShell({ children }: SettingsShellProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Editorial Header */}
      <div className="border-b border-gray-200/80 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#5B46F6] uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Member Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
              Account &amp; Privacy Settings
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
              Configure your verified identity, credentials, multi-device sessions, notification alerts, and female-only privacy safeguards.
            </p>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="mt-6 flex flex-wrap gap-2 sm:gap-3 border-b border-gray-100 pb-px">
          {SETTINGS_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.exact
              ? pathname === tab.href
              : pathname.startsWith(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "group relative inline-flex items-center gap-2.5 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold transition-all duration-200",
                  isActive
                    ? "bg-[#5B46F6] text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-white" : "text-[#5B46F6]/80 group-hover:text-[#5B46F6]"
                  )}
                />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content View */}
      <div>{children}</div>
    </div>
  );
}
