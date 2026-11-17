"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Eye,
  Send,
  AlertTriangle,
  X,
  FileCheck2,
} from "lucide-react";
import { IdentityVerificationStatus } from "@/features/admin/members/types/admin-member";

interface VerificationReviewPanelProps {
  currentStatus: IdentityVerificationStatus;
  submissionId: string;
  memberName: string;
  onDecision: (
    newStatus: IdentityVerificationStatus,
    reason?: string,
    notes?: string
  ) => void;
}

export function VerificationReviewPanel({
  currentStatus: initialStatus,
  submissionId,
  memberName,
  onDecision,
}: VerificationReviewPanelProps) {
  const [status, setStatus] = useState<IdentityVerificationStatus>(initialStatus);
  const [internalNotes, setInternalNotes] = useState("");
  const [activeModalAction, setActiveModalAction] = useState<
    "APPROVE" | "REJECT" | "REQUEST_INFO" | null
  >(null);
  const [modalReason, setModalReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleQuickStatusChange = (newStatus: IdentityVerificationStatus) => {
    setStatus(newStatus);
    onDecision(newStatus, undefined, internalNotes);
    setFeedbackMessage(`Status updated to ${newStatus.replace("_", " ")} (Simulated).`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleModalConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalAction) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      let targetStatus: IdentityVerificationStatus = "UNDER_REVIEW";

      if (activeModalAction === "APPROVE") {
        targetStatus = "VERIFIED";
      } else if (activeModalAction === "REJECT") {
        targetStatus = "REJECTED";
      } else if (activeModalAction === "REQUEST_INFO") {
        targetStatus = "ACTION_REQUIRED";
      }

      setStatus(targetStatus);
      onDecision(targetStatus, modalReason, internalNotes);
      setFeedbackMessage(`Decision recorded: ${targetStatus.replace("_", " ")}.`);
      setActiveModalAction(null);
      setModalReason("");
      setTimeout(() => setFeedbackMessage(null), 3500);
    }, 600);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-[#5B46F6]" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Auditor Review & Decision
          </h3>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-indigo-50 dark:bg-indigo-950/40 text-[#5B46F6]">
          Current: {status.replace("_", " ")}
        </span>
      </div>

      {/* Feedback banner */}
      {feedbackMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
          {feedbackMessage}
        </div>
      )}

      {/* Internal Notes textarea */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
          Auditor Notes (Internal Inspection Log)
        </label>
        <textarea
          rows={3}
          value={internalNotes}
          onChange={(e) => setInternalNotes(e.target.value)}
          placeholder="Record notes on document validity, photo resolution, DOB match, or reason for scrutiny..."
          className="w-full text-xs rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden focus:border-[#5B46F6] placeholder-gray-400"
        />
      </div>

      {/* Decision Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {/* Approve */}
        <button
          type="button"
          onClick={() => setActiveModalAction("APPROVE")}
          className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
        >
          <CheckCircle2 className="w-4 h-4" />
          Approve Verification
        </button>

        {/* Reject */}
        <button
          type="button"
          onClick={() => setActiveModalAction("REJECT")}
          className="flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs"
        >
          <XCircle className="w-4 h-4" />
          Reject Submission
        </button>

        {/* Request Information */}
        <button
          type="button"
          onClick={() => setActiveModalAction("REQUEST_INFO")}
          className="flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs"
        >
          <HelpCircle className="w-4 h-4" />
          Request Info / Retake
        </button>

        {/* Mark Under Review */}
        <button
          type="button"
          onClick={() => handleQuickStatusChange("UNDER_REVIEW")}
          className="flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
        >
          <Eye className="w-4 h-4" />
          Mark Under Review
        </button>
      </div>

      {/* Action Decision Modal */}
      {activeModalAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <h4 className="text-base font-bold text-gray-900 dark:text-white">
                {activeModalAction === "APPROVE"
                  ? "Confirm Identity Approval"
                  : activeModalAction === "REJECT"
                  ? "Confirm Identity Rejection"
                  : "Request Clearer Documentation"}
              </h4>
              <button
                type="button"
                onClick={() => setActiveModalAction(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalConfirm} className="p-5 space-y-4">
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                You are about to submit an administrative decision for{" "}
                <strong className="text-gray-900 dark:text-white font-semibold">{memberName}</strong> ({submissionId}).
              </p>

              {activeModalAction !== "APPROVE" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    {activeModalAction === "REJECT" ? "Rejection Reason" : "Requested Information"} <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={modalReason}
                    onChange={(e) => setModalReason(e.target.value)}
                    placeholder={
                      activeModalAction === "REJECT"
                        ? "e.g. Blurry photo, mismatched birth year, expired document..."
                        : "e.g. Please upload a clear photo of the backside of your Smart NID card..."
                    }
                    className="w-full text-xs rounded-xl border border-gray-200 dark:border-gray-700 p-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden focus:border-[#5B46F6]"
                  />
                </div>
              )}

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>
                  <strong>Frontend Demo Mode:</strong> Updates the UI review state and generates simulated audit trails.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalAction(null)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#5B46F6] text-white hover:bg-[#4a36e2] disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? "Submitting..." : "Confirm Decision"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
