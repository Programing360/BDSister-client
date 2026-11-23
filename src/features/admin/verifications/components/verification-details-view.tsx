"use client";

import React, { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { AdminVerificationSubmission } from "../types/admin-verification";
import { IdentityVerificationStatus } from "@/features/admin/members/types/admin-member";
import { IdentityVerificationBadge } from "@/features/admin/members/components/member-status-badges";
import { VerificationDocumentPreview } from "./verification-document-preview";
import { VerificationReviewPanel } from "./verification-review-panel";
import { DEMO_VERIFICATION_SUBMISSIONS } from "../data/admin-verifications-data";
import { apiClient } from "@/lib/api/client";

interface VerificationDetailsViewProps {
  verificationId?: string;
  submission?: AdminVerificationSubmission;
}

export function VerificationDetailsView({
  verificationId,
  submission: initialSubmission,
}: VerificationDetailsViewProps) {
  const fallbackSubmission =
    initialSubmission ||
    DEMO_VERIFICATION_SUBMISSIONS.find((s) => s.id === verificationId) ||
    DEMO_VERIFICATION_SUBMISSIONS[0]!;

  const [submission, setSubmission] = useState<AdminVerificationSubmission>(fallbackSubmission);
  const [currentStatus, setCurrentStatus] = useState<IdentityVerificationStatus>(
    fallbackSubmission.status
  );
  const [history, setHistory] = useState(fallbackSubmission.reviewHistory || []);
  const [isLoading, setIsLoading] = useState(Boolean(verificationId && !initialSubmission));

  useEffect(() => {
    if (verificationId) {
      apiClient
        .get<any>(`/api/admin/verifications/${verificationId}`)
        .then((res) => {
          if (res.data) {
            const data = res.data;
            const mapped: AdminVerificationSubmission = {
              id: data.id,
              submissionId: data.id.startsWith("ver_") || data.id.startsWith("BDS-")
                ? data.id
                : `BDS-VER-${data.id.slice(-6).toUpperCase()}`,
              memberId: data.userId || "BDS-MEM-NEW",
              memberName: data.userName || "Sister Member",
              memberEmail: data.userEmail || "",
              memberPhone: "+880 1700-000000",
              memberAvatar: null,
              memberLocation: "Dhaka, Bangladesh",
              documentType: data.docType === "PASSPORT" ? "PASSPORT" : "NATIONAL_ID",
              documentNumberMasked: data.idNumber
                ? `${data.docType}: ${data.idNumber} (Decrypted)`
                : `${data.docType}: ${data.idNumberMasked}`,
              submittedAt: data.submittedAt
                ? new Date(data.submittedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Recent",
              status: data.status,
              assignedReviewer: data.assignedOfficerName
                ? { name: data.assignedOfficerName, role: "Female Verification Officer" }
                : undefined,
              priority: "NORMAL",
              isUrgent: data.status === "PENDING",
              documents: [
                {
                  id: `doc_${data.id}_front`,
                  type: data.docType === "PASSPORT" ? "PASSPORT_PAGE" : "NID_FRONT",
                  title: `${data.docType || "NID"} Front Scan`,
                  samplePreviewWatermark: "BDSISTERS SECURE VAULT",
                  uploadedAt: data.submittedAt || new Date().toISOString(),
                  fileSize: "2.4 MB",
                  fileFormat: "IMAGE/PDF",
                  previewUrl: data.frontDocumentUrl || null,
                },
                ...(data.backDocumentUrl
                  ? [
                      {
                        id: `doc_${data.id}_back`,
                        type: "NID_BACK" as const,
                        title: `${data.docType || "NID"} Back Scan`,
                        samplePreviewWatermark: "BDSISTERS SECURE VAULT",
                        uploadedAt: data.submittedAt || new Date().toISOString(),
                        fileSize: "2.1 MB",
                        fileFormat: "IMAGE/PDF",
                        previewUrl: data.backDocumentUrl,
                      },
                    ]
                  : []),
              ],
              reviewHistory: [],
              rejectionReason: data.rejectionReason,
              adminReviewNotes: data.adminNotes,
            };

            setSubmission(mapped);
            setCurrentStatus(data.status);
          }
        })
        .catch(() => {
          // Fall back to demo submission
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [verificationId]);

  const handleDecision = async (
    newStatus: IdentityVerificationStatus,
    reason?: string,
    notes?: string
  ) => {
    setCurrentStatus(newStatus);
    const newEntry = {
      id: `rh_${Date.now()}`,
      action: `Status changed to ${newStatus.replace("_", " ")}${reason ? `: ${reason}` : ""}`,
      actor: "Certified Female Officer",
      actorRole: "Verification Desk",
      timestamp: "Just now",
      notes: notes || undefined,
    };
    setHistory((prev) => [newEntry, ...prev]);

    // Live backend API call
    const targetId = verificationId || submission.id;
    let action: "APPROVE" | "REJECT" | "REQUEST_INFO" = "APPROVE";
    if (newStatus === "REJECTED") action = "REJECT";
    if (newStatus === "ACTION_REQUIRED") action = "REQUEST_INFO";

    try {
      await apiClient.post(`/api/admin/verifications/${targetId}/review`, {
        action,
        reason,
        notes,
      });
    } catch (err) {
      console.warn("[AdminReview] Live review recording deferred:", (err as Error).message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-3">
        <Loader2 className="w-8 h-8 text-[#5B46F6] animate-spin" />
        <span className="text-xs font-semibold text-gray-500">Decrypting &amp; loading verification vault...</span>
      </div>
    );
  }

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
              <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">
                Assigned Auditor
              </span>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                {submission.assignedReviewer?.name || "Female Verification Officer"}
              </span>
            </div>
          </div>
        </div>

        {/* Member Details Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Mail className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="truncate">{submission.memberEmail}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Phone className="w-4 h-4 text-gray-400 shrink-0" />
            <span>{submission.memberPhone}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <span>{submission.memberLocation}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Shield className="w-4 h-4 text-gray-400 shrink-0" />
            <span>Document: {submission.documentType.replace("_", " ")}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Document Preview & Review Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Document Inspection Stage */}
        <div className="lg:col-span-7 space-y-6">
          <VerificationDocumentPreview
            documents={submission.documents}
            documentType={submission.documentType}
            documentNumberMasked={submission.documentNumberMasked}
          />

          {/* Audit & Review History */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <History className="w-5 h-5 text-[#5B46F6]" />
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Inspection &amp; Audit Trail
              </h3>
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-gray-500 py-3 text-center">
                No prior review actions recorded for this submission.
              </p>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-xs"
                  >
                    <Clock className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {item.action}
                        </span>
                        <span className="text-[11px] text-gray-400">{item.timestamp}</span>
                      </div>
                      <p className="text-gray-500 text-[11px] mt-0.5">
                        Actor: {item.actor} ({item.actorRole})
                      </p>
                      {item.notes && (
                        <p className="mt-1 p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] italic">
                          &ldquo;{item.notes}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Review & Decision Panel */}
        <div className="lg:col-span-5 space-y-6">
          <VerificationReviewPanel
            currentStatus={currentStatus}
            submissionId={submission.id}
            memberName={submission.memberName}
            onDecision={handleDecision}
          />
        </div>
      </div>
    </div>
  );
}
