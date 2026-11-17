"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  History,
  AlertTriangle,
} from "lucide-react";
import { AdminVerificationSubmission } from "../types/admin-verification";
import { IdentityVerificationStatus } from "@/features/admin/members/types/admin-member";
import { IdentityVerificationBadge } from "@/features/admin/members/components/member-status-badges";
import { VerificationDocumentPreview } from "./verification-document-preview";
import { VerificationReviewPanel } from "./verification-review-panel";

interface VerificationDetailsViewProps {
  submission: AdminVerificationSubmission;
}

export function VerificationDetailsView({ submission }: VerificationDetailsViewProps) {
  const [currentStatus, setCurrentStatus] = useState<IdentityVerificationStatus>(
    submission.status
  );
  const [history, setHistory] = useState(submission.reviewHistory || []);

  const handleDecision = (
    newStatus: IdentityVerificationStatus,
    reason?: string,
    notes?: string
  ) => {
    setCurrentStatus(newStatus);
    const newEntry = {
      id: `rh_${Date.now()}`,
      action: `Status changed to ${newStatus.replace("_", " ")}${reason ? `: ${reason}` : ""}`,
      actor: "Admin Auditor (Demo)",
      actorRole: "Compliance Lead",
      timestamp: "Just now",
      notes: notes || undefined,
    };
    setHistory((prev) => [newEntry, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/verifications"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Verifications
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Submission ID:</span>
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-[#5B46F6] border border-indigo-100 dark:border-indigo-900/60">
            {submission.submissionId}
          </span>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#5B46F6] to-[#7366F7] flex items-center justify-center text-white text-xl font-bold">
              {submission.memberName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {submission.memberName}
                </h1>
                <IdentityVerificationBadge status={currentStatus} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Member ID:{" "}
                <Link
                  href={`/admin/members/${submission.memberId}`}
                  className="font-mono font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {submission.memberId}
                </Link>{" "}
                • Submitted {submission.submittedAt}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {submission.isUrgent && (
              <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-900/40">
                High Priority / Urgent
              </span>
            )}
            <div className="text-right">
              <span className="text-[11px] text-gray-400 block">Assigned Auditor</span>
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                {submission.assignedReviewer?.name || "Unassigned"}
              </span>
            </div>
          </div>
        </div>

        {/* Member contact strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="font-mono">{submission.memberEmail}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{submission.memberPhone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{submission.memberLocation}</span>
          </div>
        </div>
      </div>

      {/* Grid: Document Preview & Review Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Document Preview Stage */}
        <div className="lg:col-span-2 space-y-6">
          <VerificationDocumentPreview
            documents={submission.documents}
            documentType={submission.documentType}
            documentNumberMasked={submission.documentNumberMasked}
          />
        </div>

        {/* Right 1 Col: Decision Panel & Review History */}
        <div className="space-y-6">
          <VerificationReviewPanel
            currentStatus={currentStatus}
            submissionId={submission.submissionId}
            memberName={submission.memberName}
            onDecision={handleDecision}
          />

          {/* Audit History Log */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <History className="w-4 h-4 text-[#5B46F6]" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Audit Trail & History
              </h3>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {item.actor}
                    </span>
                    <span className="text-gray-400 font-mono">{item.timestamp}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    {item.action}
                  </p>
                  {item.notes && (
                    <p className="text-[11px] text-gray-500 italic mt-1">
                      Note: &ldquo;{item.notes}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
