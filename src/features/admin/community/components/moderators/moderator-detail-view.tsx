"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  ArrowLeft,
  Shield,
  Power,
  Clock,
  CheckCircle,
  FolderTree,
  Activity,
  Award,
} from "lucide-react";
import { CommunityModerator } from "../../types/community";
import { ModeratorStatusBadge } from "../common/community-status-badge";

interface ModeratorDetailViewProps {
  moderator: CommunityModerator;
}

export function ModeratorDetailView({ moderator: initialData }: ModeratorDetailViewProps) {
  const [moderator, setModerator] = useState(initialData);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleStatus = () => {
    const next = moderator.moderatorStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setModerator({ ...moderator, moderatorStatus: next });
    showToast(`Moderator status is now ${next} (DEMO ONLY).`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/community/moderators"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Moderators
        </Link>

        <button
          type="button"
          onClick={handleToggleStatus}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
            moderator.moderatorStatus === "ACTIVE"
              ? "border-amber-200 text-amber-700 hover:bg-amber-50"
              : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          {moderator.moderatorStatus === "ACTIVE" ? "Pause Duty" : "Activate"}
        </button>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-xl shadow-purple-500/5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            {moderator.member.avatarUrl ? (
              <img
                src={moderator.member.avatarUrl}
                alt={moderator.member.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xl">
                {moderator.member.name.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">{moderator.member.name}</h1>
                <ModeratorStatusBadge status={moderator.moderatorStatus} />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                @{moderator.member.username} • {moderator.member.email}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                Moderator assigned on {new Date(moderator.assignedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} by {moderator.assignedBy}
              </p>
            </div>
          </div>
        </div>

        {/* 3-Tier Authority & RBAC Clarification Box */}
        <div className="p-5 rounded-2xl border border-purple-200 bg-purple-50/40 space-y-3">
          <div className="flex items-center gap-2 text-purple-900 font-bold text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4 text-purple-600" />
            BDSisters Multi-Tier Permission Hierarchy
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white border border-purple-100">
              <span className="text-gray-400 uppercase text-[10px] font-bold block">1. Member Role</span>
              <p className="font-bold text-gray-900 mt-1">{moderator.member.memberRole}</p>
              <span className="text-[11px] text-gray-500">Commercial profile membership tier</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-purple-100">
              <span className="text-gray-400 uppercase text-[10px] font-bold block">2. Admin RBAC Role</span>
              <p className="font-bold text-gray-900 mt-1">STANDARD_MEMBER</p>
              <span className="text-[11px] text-gray-500">No backend administrative access</span>
            </div>
            <div className="p-3 rounded-xl bg-purple-100/70 border border-purple-200">
              <span className="text-purple-700 uppercase text-[10px] font-bold block">3. Moderator Assignment</span>
              <p className="font-bold text-purple-950 mt-1">Community Category Custodian</p>
              <span className="text-[11px] text-purple-700">Scoped strictly to forum discussions</span>
            </div>
          </div>
        </div>

        {/* Workload Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-gray-100 bg-purple-50/30">
            <span className="text-xs font-semibold text-gray-500">30-Day Moderation Actions</span>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {moderator.actionsCountLast30Days}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-gray-100 bg-amber-50/30">
            <span className="text-xs font-semibold text-gray-500">Pending Review Load</span>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {moderator.pendingQueueLoad} items
            </p>
          </div>
          <div className="p-4 rounded-xl border border-gray-100 bg-emerald-50/30">
            <span className="text-xs font-semibold text-gray-500">Assigned Categories</span>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {moderator.assignedCategoryNames.length} tracks
            </p>
          </div>
        </div>

        {/* Assigned Tracks */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <FolderTree className="w-3.5 h-3.5" />
            Covered Category Jurisdictions
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {moderator.assignedCategoryNames.map((name, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-xl text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Recent Moderation Activity */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            Recent Action Audit Logs
          </h3>
          <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-gray-50/30">
            {moderator.recentActivity.map((act, idx) => (
              <div key={idx} className="p-3.5 text-xs flex items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-gray-900">{act.action}</span>
                  <p className="text-gray-600 mt-0.5">{act.target}</p>
                </div>
                <span className="text-[11px] text-gray-400 shrink-0">
                  {new Date(act.timestamp).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
