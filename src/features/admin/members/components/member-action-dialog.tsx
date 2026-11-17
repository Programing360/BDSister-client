"use client";

import React, { useState } from "react";
import { AlertTriangle, ShieldAlert, CheckCircle2, X } from "lucide-react";
import { AdminAccountStatus } from "../types/admin-member";

export type AdminActionType = "SUSPEND" | "REACTIVATE" | "BAN" | "CHANGE_MEMBERSHIP";

interface MemberActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: AdminActionType;
  memberId: string;
  memberName: string;
  memberEmail: string;
  currentStatus: AdminAccountStatus;
  currentMembership?: "FREE" | "PAID";
  onSuccess?: (action: AdminActionType, newStatus: string, reason?: string) => void;
}

export function MemberActionDialog({
  isOpen,
  onClose,
  actionType,
  memberId,
  memberName,
  memberEmail,
  currentStatus: _currentStatus,
  currentMembership: _currentMembership,
  onSuccess,
}: MemberActionDialogProps) {
  const [reason, setReason] = useState("");
  const [selectedTier, setSelectedTier] = useState<"FREE" | "PAID">("PAID");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const actionConfig = {
    SUSPEND: {
      title: "Suspend Member Account",
      description: "Suspending this account will temporarily revoke access to the member dashboard, community forums, and seller center.",
      confirmButtonText: "Confirm Suspension",
      confirmButtonClass: "bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500",
      icon: AlertTriangle,
      iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
      targetStatus: "SUSPENDED",
      requireReason: true,
    },
    REACTIVATE: {
      title: "Reactivate Member Account",
      description: "Reactivating this member will immediately restore full access to their dashboard, active businesses, and network features.",
      confirmButtonText: "Confirm Reactivation",
      confirmButtonClass: "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500",
      icon: CheckCircle2,
      iconBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
      targetStatus: "ACTIVE",
      requireReason: false,
    },
    BAN: {
      title: "Permanently Ban Member",
      description: "Banning this member is a severe moderation action. They will be immediately disconnected, their shops suspended, and future sign-in blocked.",
      confirmButtonText: "Permanently Ban Account",
      confirmButtonClass: "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500",
      icon: ShieldAlert,
      iconBg: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
      targetStatus: "BANNED",
      requireReason: true,
    },
    CHANGE_MEMBERSHIP: {
      title: "Adjust Membership Tier",
      description: "Upgrade or downgrade this member's tier directly. Changing to Paid grants instant access to business tools and premium workshops.",
      confirmButtonText: "Update Membership Tier",
      confirmButtonClass: "bg-[#5B46F6] hover:bg-[#4a36e2] text-white focus:ring-[#5B46F6]",
      icon: AlertTriangle,
      iconBg: "bg-indigo-100 text-[#5B46F6] dark:bg-indigo-950/40 dark:text-indigo-400",
      targetStatus: selectedTier,
      requireReason: false,
    },
  }[actionType];

  const Icon = actionConfig.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (actionConfig.requireReason && !reason.trim()) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(`Action simulated successfully: Member ${memberName} updated to ${actionConfig.targetStatus}.`);
      if (onSuccess) {
        onSuccess(actionType, actionConfig.targetStatus, reason);
      }
      setTimeout(() => {
        setSuccessMessage(null);
        setReason("");
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
            <div className={`p-2.5 rounded-xl ${actionConfig.iconBg}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 id="dialog-title" className="text-lg font-bold text-gray-900 dark:text-white">
                {actionConfig.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Target: <span className="font-semibold text-gray-700 dark:text-gray-300">{memberName}</span> ({memberId})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {successMessage ? (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <p className="text-sm font-medium">{successMessage}</p>
            </div>
          ) : (
            <>
              {/* Member details card */}
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 text-xs text-gray-600 dark:text-gray-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-mono text-gray-800 dark:text-gray-200">{memberEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Member ID:</span>
                  <span className="font-mono font-medium text-[#5B46F6]">{memberId}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {actionConfig.description}
              </p>

              {/* Membership selector if changing membership */}
              {actionType === "CHANGE_MEMBERSHIP" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                    Select New Tier
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedTier("FREE")}
                      className={`p-3 rounded-xl border text-sm font-semibold transition text-left ${
                        selectedTier === "FREE"
                          ? "border-[#5B46F6] bg-indigo-50/50 dark:bg-indigo-950/20 text-[#5B46F6]"
                          : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-bold">Free Community</div>
                      <div className="text-xs font-normal text-gray-500 mt-0.5">Basic networking</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTier("PAID")}
                      className={`p-3 rounded-xl border text-sm font-semibold transition text-left ${
                        selectedTier === "PAID"
                          ? "border-[#5B46F6] bg-indigo-50/50 dark:bg-indigo-950/20 text-[#5B46F6]"
                          : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-bold">Paid Entrepreneur</div>
                      <div className="text-xs font-normal text-gray-500 mt-0.5">Full business features</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Reason textarea */}
              {actionConfig.requireReason && (
                <div>
                  <label htmlFor="action-reason" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Administrative Reason <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="action-reason"
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Provide detailed justification for internal audit logs (e.g. Terms violation, spam report #421)..."
                    className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 text-gray-900 dark:text-white placeholder-gray-400 focus:border-[#5B46F6] focus:ring-1 focus:ring-[#5B46F6] outline-hidden"
                    required
                  />
                </div>
              )}

              {/* Frontend demo notice */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                <span className="font-bold">Frontend Demonstration:</span> This action updates the local component preview state. Persistent audit records and backend workflows will be connected in the subsequent backend phase.
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || (actionConfig.requireReason && !reason.trim())}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-xs focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${actionConfig.confirmButtonClass}`}
                >
                  {isSubmitting ? "Processing..." : actionConfig.confirmButtonText}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
