import React from "react";
import Link from "next/link";
import { UserPlus, Download, RefreshCw, Sparkles } from "lucide-react";
import { DEMO_MEMBER_DISCLAIMER } from "../data/admin-members-data";

interface MemberPageHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenExport: () => void;
}

export function MemberPageHeader({
  onRefresh,
  isRefreshing,
  onOpenExport,
}: MemberPageHeaderProps) {
  return (
    <div className="space-y-4">
      {/* 1. Top row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200/80 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-[#111827] sm:text-3xl">
              Member Management
            </h1>
            <span className="rounded-full bg-purple-100 border border-purple-200 px-3 py-0.5 text-xs font-bold text-[#5B46F6]">
              Directory & Moderation
            </span>
          </div>
          <p className="mt-1 text-xs text-[#4B5563]">
            Manage registered women members, inspect profile completion, and audit account statuses.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onRefresh}
            title="Refresh member records"
            disabled={isRefreshing}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200/80 bg-white text-gray-500 shadow-2xs hover:border-[#5B46F6]/40 hover:text-[#5B46F6] transition disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin text-[#5B46F6]" : ""}`}
            />
          </button>

          <button
            type="button"
            onClick={onOpenExport}
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200/80 px-3.5 py-2 text-xs font-bold text-gray-700 shadow-2xs hover:bg-gray-50 hover:border-[#5B46F6]/40 hover:text-[#5B46F6] transition"
          >
            <Download className="h-4 w-4 text-gray-500" />
            <span>Export Data</span>
          </button>

          <Link
            href="/admin/members/create"
            className="inline-flex items-center gap-2 rounded-xl bg-[#5B46F6] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#4a36e0] transition"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add New Member</span>
          </Link>
        </div>
      </div>

      {/* 2. Notice banner */}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-purple-200/70 bg-gradient-to-r from-purple-50/80 via-white to-purple-50/40 p-3 sm:p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#5B46F6] text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">
              Admin Member Management Module Active
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {DEMO_MEMBER_DISCLAIMER}
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-block rounded-md bg-purple-100 border border-purple-200 px-2 py-0.5 text-[10px] font-bold text-[#5B46F6]">
          Frontend Simulation
        </span>
      </div>
    </div>
  );
}
