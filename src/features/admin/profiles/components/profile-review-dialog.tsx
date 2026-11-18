"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  Info,
  Clock,
} from "lucide-react";
import type { AdminProfileItem, ProfileApprovalStatus } from "../types/admin-profile";

export type ReviewDialogAction =
  | "APPROVE"
  | "REJECT"
  | "REQUEST_CHANGES"
  | "SUSPEND"
  | "RESTORE"
  | "TOGGLE_FEATURED";

interface ProfileReviewDialogProps {
  isOpen: boolean;
  action: ReviewDialogAction | null;
  profile: AdminProfileItem | null;
  onClose: () => void;
  onConfirm: (
    action: ReviewDialogAction,
    payload: {
      reason?: string;
      internalNote?: string;
      changesRequested?: string;
    }
  ) => void;
}

export function ProfileReviewDialog({
  isOpen,
  action,
  profile,
  onClose,
  onConfirm,
}: ProfileReviewDialogProps) {
  const [reason, setReason] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [changesRequested, setChangesRequested] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !action || !profile) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (action === "REJECT" && !reason.trim()) {
      setError("A specific rejection reason is mandatory to guide the sister.");
      return;
    }

    if (action === "REQUEST_CHANGES" && !changesRequested.trim()) {
      setError("Please outline the specific changes or documents requested.");
      return;
    }

    if (action === "SUSPEND" && !reason.trim()) {
      setError("Please state the administrative suspension reason.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onConfirm(action, {
        reason: reason.trim(),
        internalNote: internalNote.trim(),
        changesRequested: changesRequested.trim(),
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const getActionDetails = () => {
    switch (action) {
      case "APPROVE":
        return {
          title: "Approve Member Profile",
          subtitle: `Publish ${profile.fullName}'s profile to the public and member directories.`,
          icon: CheckCircle2,
          iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40",
          submitText: "Approve & Publish Profile",
          submitVariant: "bg-emerald-600 hover:bg-emerald-700 text-white",
        };
      case "REJECT":
        return {
          title: "Reject Profile Submission",
          subtitle: `Reject ${profile.fullName}'s profile. The member will receive guidelines feedback.`,
          icon: XCircle,
          iconBg: "bg-rose-50 text-rose-600 dark:bg-rose-950/40",
          submitText: "Reject Profile Submission",
          submitVariant: "bg-rose-600 hover:bg-rose-700 text-white",
        };
      case "REQUEST_CHANGES":
        return {
          title: "Request Profile Adjustments",
          subtitle: `Notify ${profile.fullName} regarding required modifications before public approval.`,
          icon: AlertCircle,
          iconBg: "bg-orange-50 text-orange-600 dark:bg-orange-950/40",
          submitText: "Send Action Required Request",
          submitVariant: "bg-orange-600 hover:bg-orange-700 text-white",
        };
      case "SUSPEND":
        return {
          title: "Suspend Member Profile",
          subtitle: `Temporarily remove ${profile.fullName}'s profile from all public listings and search index.`,
          icon: ShieldAlert,
          iconBg: "bg-red-50 text-red-600 dark:bg-red-950/40",
          submitText: "Suspend Profile Listing",
          submitVariant: "bg-red-600 hover:bg-red-700 text-white",
        };
      case "RESTORE":
        return {
          title: "Restore Suspended Profile",
          subtitle: `Restore ${profile.fullName}'s profile to active published standing.`,
          icon: RotateCcw,
          iconBg: "bg-indigo-50 text-[#5B46F6] dark:bg-indigo-950/40",
          submitText: "Restore Active Profile",
          submitVariant: "bg-[#5B46F6] hover:bg-indigo-700 text-white",
        };
      case "TOGGLE_FEATURED":
        return {
          title: profile.isFeatured ? "Remove From Featured Spotlight" : "Feature Profile on Homepage",
          subtitle: profile.isFeatured
            ? `Remove ${profile.fullName} from the curated community homepage spotlights.`
            : `Feature ${profile.fullName} as an inspiring artisan/professional spotlight sister.`,
          icon: Sparkles,
          iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-950/40",
          submitText: profile.isFeatured ? "Remove Spotlight" : "Feature on Homepage",
          submitVariant: "bg-amber-600 hover:bg-amber-700 text-white",
        };
    }
  };

  const details = getActionDetails();
  const Icon = details.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl shadow-purple-950/20 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-2xl ${details.iconBg} flex items-center justify-center shrink-0 shadow-sm`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {details.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {details.subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Member Card Snapshot */}
          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{profile.fullName}</p>
              <p className="text-gray-500 dark:text-gray-400">{profile.headline || profile.profession}</p>
            </div>
            <span className="font-mono text-[11px] font-semibold text-gray-400 bg-white dark:bg-gray-900 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-800">
              {profile.memberId}
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action specific inputs */}
          {action === "REJECT" && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Rejection Reason (Visible to Sister) <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain clearly which community guidelines or representation criteria were violated..."
                className="w-full p-3 text-xs rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:border-rose-500"
              />
            </div>
          )}

          {action === "REQUEST_CHANGES" && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Requested Adjustments & Guidance <span className="text-orange-500">*</span>
              </label>
              <textarea
                rows={3}
                value={changesRequested}
                onChange={(e) => setChangesRequested(e.target.value)}
                placeholder="Specify the needed changes (e.g., please add an about me summary of at least 30 words, or clarify your business role)..."
                className="w-full p-3 text-xs rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:border-orange-500"
              />
            </div>
          )}

          {action === "SUSPEND" && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Suspension Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Record the formal compliance violation or investigation ground..."
                className="w-full p-3 text-xs rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:border-red-500"
              />
            </div>
          )}

          {/* Internal Review Note (Common for all moderation actions) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Internal Staff Note <span className="text-gray-400 font-normal">(Staff-only audit trail)</span>
            </label>
            <textarea
              rows={2}
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="Internal administrative note (not visible to the member)..."
              className="w-full p-3 text-xs rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:border-[#5B46F6]"
            />
          </div>

          {/* Disclaimer pill */}
          <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-2.5 text-xs text-indigo-800 dark:text-indigo-300">
            <Info className="w-4 h-4 text-[#5B46F6] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <span className="font-semibold">Frontend Demonstration: </span>
              Action updates local client state. In production, this triggers email notification and audit logging.
            </p>
          </div>

          {/* Footer Controls */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all shadow-xs ${details.submitVariant} disabled:opacity-50 flex items-center gap-1.5`}
            >
              {isSubmitting && <Clock className="w-3.5 h-3.5 animate-spin" />}
              <span>{details.submitText}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
