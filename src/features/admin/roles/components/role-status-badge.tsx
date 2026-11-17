import React from "react";
import { Lock, Sparkles, Shield, AlertTriangle } from "lucide-react";
import {
  RoleType,
  RoleStatus,
  RoleCategory,
  PermissionRiskLevel,
} from "../types/admin-role";

export function RoleTypeBadge({ type }: { type: RoleType }) {
  if (type === "BUILT_IN") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-purple-200 bg-purple-50 dark:bg-purple-950/40 dark:border-purple-900/60 px-2 py-0.5 text-[11px] font-bold text-[#5B46F6] dark:text-purple-300">
        <Lock className="h-3 w-3 text-[#5B46F6] dark:text-purple-300" />
        <span>System Built-in</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 dark:bg-indigo-950/40 dark:border-indigo-900/60 px-2 py-0.5 text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
      <Sparkles className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
      <span>Custom Role</span>
    </span>
  );
}

export function RoleStatusBadge({ status }: { status: RoleStatus }) {
  if (status === "ACTIVE") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-900/60 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span>Active</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 px-2 py-0.5 text-[11px] font-bold text-gray-600 dark:text-gray-400">
      <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
      <span>Inactive</span>
    </span>
  );
}

export function RoleCategoryBadge({ category }: { category: RoleCategory }) {
  const styles: Record<RoleCategory, string> = {
    PLATFORM: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60",
    COMMUNITY: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900/60",
    COMMERCE: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60",
    FINANCE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60",
    SYSTEM: "bg-purple-50 text-[#5B46F6] border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/60",
    CUSTOM: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/60",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
        styles[category] || styles.CUSTOM
      }`}
    >
      {category}
    </span>
  );
}

export function PermissionRiskBadge({ level }: { level: PermissionRiskLevel }) {
  switch (level) {
    case "CRITICAL":
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-900/60 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-300">
          <AlertTriangle className="h-3 w-3 text-rose-600" />
          <span>Critical</span>
        </span>
      );
    case "SENSITIVE":
      return (
        <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-900/60 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300">
          <Shield className="h-3 w-3 text-amber-600" />
          <span>Sensitive</span>
        </span>
      );
    case "STANDARD":
    default:
      return (
        <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:text-gray-400">
          <span>Standard</span>
        </span>
      );
  }
}
