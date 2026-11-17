"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  KeyRound,
  Shield,
  Lock,
  Edit2,
  Copy,
  Trash2,
  UserCheck,
  Users,
  Layers,
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  History,
  AlertTriangle,
} from "lucide-react";
import { AdminRoleDetail, MemberRoleAssignmentItem } from "../types/admin-role";
import {
  PERMISSION_GROUPS,
  PERMISSION_ITEMS,
} from "../data/admin-permissions-data";
import {
  DEMO_ROLE_ASSIGNMENT_MEMBERS,
  DEMO_ROLE_CHANGE_LOGS,
  DEMO_ADMIN_ROLES,
} from "../data/admin-roles-data";
import {
  RoleTypeBadge,
  RoleStatusBadge,
  RoleCategoryBadge,
  PermissionRiskBadge,
} from "./role-status-badge";
import { RoleDeleteDialog } from "./role-delete-dialog";
import { RoleDuplicateDialog } from "./role-duplicate-dialog";
import { RoleAssignmentDialog } from "./role-assignment-dialog";

interface RoleDetailsViewProps {
  role: AdminRoleDetail;
}

export function RoleDetailsView({ role }: RoleDetailsViewProps) {
  const [activeTab, setActiveTab] = useState<"permissions" | "members" | "history">("permissions");
  const [permSearch, setPermSearch] = useState("");
  const [memberSearch, setMemberSearch] = useState("");

  // Dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [assignmentTarget, setAssignmentTarget] = useState<MemberRoleAssignmentItem | null>(null);

  // Local state for demo interactive mutations
  const [assignedMembers, setAssignedMembers] = useState<MemberRoleAssignmentItem[]>(
    DEMO_ROLE_ASSIGNMENT_MEMBERS.filter((m) => m.currentRole === role.slug)
  );
  const [roleLogs, setRoleLogs] = useState(DEMO_ROLE_CHANGE_LOGS);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const isProtected = role.isProtected || role.type === "BUILT_IN";

  // Permissions breakdown calculation
  const activeKeysSet = new Set(role.permissionKeys || []);
  const criticalCount = PERMISSION_ITEMS.filter(
    (p) => activeKeysSet.has(p.key) && p.riskLevel === "CRITICAL"
  ).length;
  const sensitiveCount = PERMISSION_ITEMS.filter(
    (p) => activeKeysSet.has(p.key) && p.riskLevel === "SENSITIVE"
  ).length;
  const standardCount = PERMISSION_ITEMS.filter(
    (p) => activeKeysSet.has(p.key) && p.riskLevel === "STANDARD"
  ).length;

  const handleRoleAssigned = (memberId: string, newRoleSlug: string, reason: string) => {
    const memberObj = DEMO_ROLE_ASSIGNMENT_MEMBERS.find((m) => m.id === memberId);
    if (!memberObj) return;

    const newRole = DEMO_ADMIN_ROLES.find((r) => r.slug === newRoleSlug);

    setFeedbackToast(`Simulated: Member ${memberObj.name} updated to "${newRole?.name || newRoleSlug}".`);
    setTimeout(() => setFeedbackToast(null), 3500);

    // Update log
    const newLog = {
      id: `log_sim_${Date.now()}`,
      timestamp: "Just now",
      adminName: "Admin User (You)",
      adminRole: "Super Administrator",
      affectedMemberId: memberId,
      affectedMemberNumber: memberObj.memberId,
      affectedMemberName: memberObj.name,
      previousRole: memberObj.currentRoleName,
      newRole: newRole?.name || newRoleSlug,
      actionType: "ROLE_ASSIGNED" as const,
      status: "SUCCESS" as const,
      reason,
    };
    setRoleLogs((prev) => [newLog, ...prev]);

    // Update member list
    if (newRoleSlug === role.slug) {
      setAssignedMembers((prev) => [
        ...prev.filter((m) => m.id !== memberId),
        { ...memberObj, currentRole: role.slug, currentRoleName: role.name },
      ]);
    } else {
      setAssignedMembers((prev) => prev.filter((m) => m.id !== memberId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 animate-in fade-in">
          {feedbackToast}
        </div>
      )}

      {/* Top back navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/roles"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Roles
        </Link>
        <div className="flex items-center gap-2">
          <RoleTypeBadge type={role.type} />
          <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 font-mono text-gray-700 dark:text-gray-300">
            {role.slug}
          </span>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-[#5B46F6] shrink-0 mt-0.5">
              <KeyRound className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {role.name}
                </h1>
                <RoleStatusBadge status={role.status} />
                <RoleCategoryBadge category={role.category} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl leading-relaxed">
                {role.description}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {!isProtected ? (
              <Link
                href={`/admin/roles/${role.slug || role.id}/edit`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#5B46F6] text-white hover:bg-[#4a36e2] transition shadow-2xs"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Role
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-purple-50 dark:bg-purple-950/30 text-[#5B46F6] border border-purple-200/60 dark:border-purple-800/40">
                <Lock className="w-3.5 h-3.5" /> Built-in Protected
              </span>
            )}

            <button
              type="button"
              onClick={() => setIsDuplicateDialogOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <Copy className="w-3.5 h-3.5 text-gray-500" /> Clone
            </button>

            {!isProtected && (
              <button
                type="button"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1 text-xs">
          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-1">
            <span className="text-gray-500 block flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-500" /> Capabilities Bundle
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-gray-900 dark:text-white font-mono">
                {role.permissionsCount}
              </span>
              <span className="text-gray-400">/ 72</span>
            </div>
            <span className="text-[10px] text-gray-400 block">Active permissions</span>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-1">
            <span className="text-gray-500 block flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-blue-500" /> Assigned Members
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-gray-900 dark:text-white font-mono">
                {role.assignedMembersCount.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 block">Demonstration count</span>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-1">
            <span className="text-gray-500 block flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-amber-500" /> Risk Distribution
            </span>
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-rose-600 font-bold font-mono text-xs">{criticalCount} Crit</span>
              <span className="text-gray-300">•</span>
              <span className="text-amber-600 font-bold font-mono text-xs">{sensitiveCount} Sens</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500 font-mono text-xs">{standardCount} Std</span>
            </div>
            <span className="text-[10px] text-gray-400 block">Impact severity</span>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-1">
            <span className="text-gray-500 block flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" /> Lifecycle Audit
            </span>
            <div className="text-xs font-mono font-medium text-gray-800 dark:text-gray-200">
              Updated: {role.updatedAt}
            </div>
            <span className="text-[10px] text-gray-400 block font-mono">Created: {role.createdAt}</span>
          </div>
        </div>

        {/* System Scope Notes if present */}
        {role.notes && (
          <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#5B46F6] mt-0.5" />
            <p>
              <strong className="font-semibold">Governance Scope:</strong> {role.notes}
            </p>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab("permissions")}
          className={`pb-3 px-4 transition border-b-2 flex items-center gap-2 ${
            activeTab === "permissions"
              ? "border-[#5B46F6] text-[#5B46F6]"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Permissions Matrix ({role.permissionsCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("members")}
          className={`pb-3 px-4 transition border-b-2 flex items-center gap-2 ${
            activeTab === "members"
              ? "border-[#5B46F6] text-[#5B46F6]"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Assigned Members ({assignedMembers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`pb-3 px-4 transition border-b-2 flex items-center gap-2 ${
            activeTab === "history"
              ? "border-[#5B46F6] text-[#5B46F6]"
              : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Change History</span>
        </button>
      </div>

      {/* Tab 1: Permissions Matrix */}
      {activeTab === "permissions" && (
        <div className="space-y-4">
          {/* Permissions Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={permSearch}
              onChange={(e) => setPermSearch(e.target.value)}
              placeholder="Filter permissions within this role..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-10 pr-4 py-2 text-xs font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-[#5B46F6] focus:outline-hidden"
            />
          </div>

          <div className="space-y-4">
            {PERMISSION_GROUPS.map((group) => {
              const allGroupItems = PERMISSION_ITEMS.filter((p) => p.groupId === group.id);
              const matchingItems = allGroupItems.filter((p) => {
                if (!permSearch) return true;
                const q = permSearch.toLowerCase();
                return (
                  p.name.toLowerCase().includes(q) ||
                  p.key.toLowerCase().includes(q) ||
                  p.description.toLowerCase().includes(q)
                );
              });

              if (matchingItems.length === 0) return null;

              const activeInGroupCount = allGroupItems.filter((p) =>
                activeKeysSet.has(p.key)
              ).length;

              return (
                <div
                  key={group.id}
                  className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xs overflow-hidden"
                >
                  {/* Group header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gray-50/70 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-xs text-gray-900 dark:text-white">
                        {group.name}
                      </span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">
                        {group.description}
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                        activeInGroupCount > 0
                          ? "bg-indigo-50 border-indigo-200 text-[#5B46F6] dark:bg-indigo-950/40 dark:border-indigo-900/60"
                          : "bg-gray-100 border-gray-200 text-gray-400 dark:bg-gray-800"
                      }`}
                    >
                      {activeInGroupCount} of {allGroupItems.length} enabled
                    </span>
                  </div>

                  {/* Permissions grid */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {matchingItems.map((perm) => {
                      const isGranted = activeKeysSet.has(perm.key);
                      return (
                        <div
                          key={perm.key}
                          className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition ${
                            isGranted
                              ? "bg-indigo-50/20 border-indigo-200/80 dark:bg-indigo-950/10 dark:border-indigo-900/40"
                              : "bg-gray-50/40 border-gray-200/50 dark:bg-gray-800/20 dark:border-gray-800 opacity-60"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {isGranted ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : (
                                <XCircle className="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0" />
                              )}
                              <span
                                className={`font-bold ${
                                  isGranted
                                    ? "text-gray-900 dark:text-white"
                                    : "text-gray-500 line-through"
                                }`}
                              >
                                {perm.name}
                              </span>
                            </div>
                            <PermissionRiskBadge level={perm.riskLevel} />
                          </div>

                          <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 block pl-6">
                            {perm.key}
                          </span>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 pl-6 leading-snug">
                            {perm.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Assigned Members */}
      {activeTab === "members" && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Members Assigned to {role.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Staff and leaders actively operating under this administrative capability profile.
              </p>
            </div>

            {/* Member search */}
            <div className="relative max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Search assigned members..."
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 pl-9 pr-3 py-1.5 text-xs font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-[#5B46F6] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 dark:bg-gray-800/60 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Member ID</th>
                  <th className="py-3 px-4">Membership Entitlement</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Last Active</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80 text-gray-700 dark:text-gray-200">
                {assignedMembers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      No members are currently assigned to this role in this demo slice.
                    </td>
                  </tr>
                ) : (
                  assignedMembers
                    .filter((m) =>
                      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
                      m.memberId.toLowerCase().includes(memberSearch.toLowerCase())
                    )
                    .map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-linear-to-br from-[#5B46F6] to-[#7366F7] flex items-center justify-center text-white font-bold text-xs">
                              {m.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-gray-900 dark:text-white block">
                                {m.name}
                              </span>
                              <span className="text-[11px] text-gray-400 font-mono">{m.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                          {m.memberId}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {m.membershipType === "PAID" ? "Paid Entrepreneur" : "Free Community"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {m.accountStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500 font-mono text-[11px]">
                          {m.lastActive}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setAssignmentTarget(m)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#5B46F6] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
                          >
                            Reassign Role
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/40 text-xs text-purple-900 dark:text-purple-300 flex items-start gap-2">
            <UserCheck className="w-4 h-4 shrink-0 text-[#5B46F6] mt-0.5" />
            <p>
              <strong className="font-semibold">Demonstration Role Assignments:</strong> Member privileges shown above demonstrate how administrative roles overlay independently on top of personal membership tiers.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Change History */}
      {activeTab === "history" && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs p-6 space-y-4">
          <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-[#5B46F6]" />
              Role Audit Trail & Assignment History
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Chronological log of role elevations, capability adjustments, and revocations.
            </p>
          </div>

          <div className="space-y-3">
            {roleLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/60 text-xs space-y-1.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {log.adminName}
                    </span>
                    <span className="text-gray-400">({log.adminRole})</span>
                    <span className="px-1.5 py-0.2 rounded-sm text-[10px] font-bold bg-indigo-50 text-[#5B46F6] border border-indigo-200">
                      {log.actionType.replace("_", " ")}
                    </span>
                  </div>
                  <span className="font-mono text-gray-400 text-[11px]">{log.timestamp}</span>
                </div>

                <div className="text-gray-700 dark:text-gray-300">
                  Target: <strong className="font-semibold">{log.affectedMemberName}</strong> (
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{log.affectedMemberNumber}</span>
                  ) • From <span className="font-medium text-gray-500">{log.previousRole}</span> to{" "}
                  <span className="font-bold text-gray-900 dark:text-white">{log.newRole}</span>
                </div>

                <p className="text-gray-500 dark:text-gray-400 italic text-[11px]">
                  &ldquo;{log.reason}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {isDeleteDialogOpen && (
        <RoleDeleteDialog
          isOpen={true}
          onClose={() => setIsDeleteDialogOpen(false)}
          role={role}
          onConfirmDelete={(_id) => {
            setFeedbackToast(`Simulated: Role "${role.name}" removed from local state.`);
          }}
        />
      )}

      {/* Duplicate Dialog */}
      {isDuplicateDialogOpen && (
        <RoleDuplicateDialog
          isOpen={true}
          onClose={() => setIsDuplicateDialogOpen(false)}
          sourceRole={role}
          onConfirmDuplicate={(cloned) => {
            setFeedbackToast(`Simulated: New role "${cloned.name}" cloned.`);
          }}
        />
      )}

      {/* Role Assignment Dialog */}
      {assignmentTarget && (
        <RoleAssignmentDialog
          isOpen={true}
          onClose={() => setAssignmentTarget(null)}
          member={assignmentTarget}
          availableRoles={DEMO_ADMIN_ROLES}
          onConfirmAssignment={handleRoleAssigned}
        />
      )}
    </div>
  );
}
