"use client";

import React, { useState } from "react";
import { UserCheck, Shield, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { MemberRoleAssignmentItem, AdminRoleItem } from "../types/admin-role";

interface RoleAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member: MemberRoleAssignmentItem;
  availableRoles: AdminRoleItem[];
  onConfirmAssignment: (memberId: string, newRoleSlug: string, reason: string) => void;
}

export function RoleAssignmentDialog({
  isOpen,
  onClose,
  member,
  availableRoles,
  onConfirmAssignment,
}: RoleAssignmentDialogProps) {
  const [selectedRoleSlug, setSelectedRoleSlug] = useState(member.currentRole);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const targetRole = availableRoles.find((r) => r.slug === selectedRoleSlug);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFeedback(
        `Role assignment simulated: Member ${member.name} updated to "${targetRole?.name || selectedRoleSlug}".`
      );
      onConfirmAssignment(member.id, selectedRoleSlug, reason);
      setTimeout(() => {
        setFeedback(null);
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-100 text-[#5B46F6] dark:bg-purple-950/40 dark:text-purple-300">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 id="dialog-title" className="text-lg font-bold text-gray-900 dark:text-white">
                Assign Administrative Access Role
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Target: <span className="font-semibold text-gray-800 dark:text-gray-200">{member.name}</span> ({member.memberId})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {feedback ? (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <p className="text-sm font-medium">{feedback}</p>
            </div>
          ) : (
            <>
              {/* Member overview card with strict separation of Membership vs Role */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Email Address:</span>
                  <span className="font-mono text-gray-800 dark:text-gray-200">{member.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Membership Tier (Subscription):</span>
                  <span className="font-bold text-[#5B46F6]">
                    {member.membershipType === "PAID" ? "Paid Entrepreneur Tier" : "Free Community Tier"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Current Access Role:</span>
                  <span className="font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-700 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-600">
                    {member.currentRoleName}
                  </span>
                </div>
              </div>

              {/* Proposed Role Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Proposed Access Role <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedRoleSlug}
                  onChange={(e) => setSelectedRoleSlug(e.target.value)}
                  className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden focus:border-[#5B46F6]"
                >
                  {availableRoles
                    .filter((r) => r.slug !== "guest")
                    .map((r) => (
                      <option key={r.slug} value={r.slug}>
                        {r.name} ({r.type === "BUILT_IN" ? "Built-in" : "Custom"} • {r.permissionsCount} perms)
                      </option>
                    ))}
                </select>
                {targetRole && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {targetRole.description}
                  </p>
                )}
              </div>

              {/* Justification Reason */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Audit Justification Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Record formal administrative justification for this role assignment (e.g. Appointed as divisional coordinator, staff promotion)..."
                  className="w-full text-xs rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden focus:border-[#5B46F6] placeholder-gray-400"
                />
              </div>

              {/* Critical Frontend Demo Warning */}
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold">Frontend Demonstration Safeguard</p>
                  <p className="text-amber-800/90 dark:text-amber-400/90 leading-relaxed text-[11px]">
                    This modal updates client presentation models for UI demonstration. It does NOT alter Better Auth user records, database sessions, or grant actual permissions.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !reason.trim()}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#5B46F6] hover:bg-[#4a36e2] text-white transition shadow-xs disabled:opacity-50"
                >
                  <Shield className="w-3.5 h-3.5" />
                  {isSubmitting ? "Assigning..." : "Simulate Role Assignment"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
