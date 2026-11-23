"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Lock,
  UploadCloud,
  FileCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  X,
  FileText,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";

export type VerificationUIStatus =
  | "NOT_SUBMITTED"
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "ACTION_REQUIRED"
  | "PENDING_REVIEW"
  | "VERIFIED";

interface VerificationUploadFormProps {
  initialStatus?: VerificationUIStatus;
  isVerified?: boolean;
  idNumberMasked?: string | null;
  rejectionReason?: string | null;
  adminNotes?: string | null;
  submittedAt?: string | null;
  docType?: string | null;
}

export function VerificationUploadForm({
  initialStatus = "NOT_SUBMITTED",
  isVerified = false,
  idNumberMasked: propMaskedId,
  rejectionReason: propReason,
  adminNotes: propNotes,
  submittedAt: propSubmittedAt,
  docType: propDocType,
}: VerificationUploadFormProps) {
  const [docType, setDocType] = useState<"NID" | "PASSPORT" | "ACADEMIC">(
    (propDocType as any) || "NID"
  );
  const [idNumber, setIdNumber] = useState("");
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);

  const [status, setStatus] = useState<string>(
    isVerified ? "APPROVED" : initialStatus
  );
  const [maskedId, setMaskedId] = useState<string | null>(propMaskedId || null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(propReason || null);
  const [adminNotes, setAdminNotes] = useState<string | null>(propNotes || null);

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync client state with real API if initialStatus was default
  useEffect(() => {
    if (initialStatus === "NOT_SUBMITTED" && !isVerified) {
      apiClient
        .get<{
          status?: string;
          idNumberMasked?: string;
          rejectionReason?: string;
          adminNotes?: string;
        }>("/api/member/verification")
        .then((res) => {
          if (res.data && res.data.status && res.data.status !== "UNVERIFIED") {
            setStatus(res.data.status);
            if (res.data.idNumberMasked) setMaskedId(res.data.idNumberMasked);
            if (res.data.rejectionReason) setRejectionReason(res.data.rejectionReason);
            if (res.data.adminNotes) setAdminNotes(res.data.adminNotes);
          }
        })
        .catch(() => {
          // Ignore offline errors during background sync
        });
    }
  }, [initialStatus, isVerified]);

  const handleFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFrontFile(file);
      setFrontPreview(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
    }
  };

  const handleBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBackFile(file);
      setBackPreview(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
    }
  };

  const handleRemoveFront = () => {
    setFrontFile(null);
    setFrontPreview(null);
  };

  const handleRemoveBack = () => {
    setBackFile(null);
    setBackPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idNumber.trim()) {
      setErrorMsg("Please enter your official identification document number.");
      return;
    }
    if (!frontFile && !frontPreview) {
      setErrorMsg("Please upload the front scan/photo of your identity document.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append("docType", docType);
      formData.append("idNumber", idNumber.trim());
      if (frontFile) formData.append("frontImage", frontFile);
      if (backFile) formData.append("backImage", backFile);

      const res = await apiClient.post<{
        id?: string;
        status?: string;
        idNumberMasked?: string;
      }>("/api/member/verification", formData);

      if (res.error) {
        throw new Error(res.error.message || "Failed to submit verification request.");
      }

      setStatus("PENDING");
      if (res.data?.idNumberMasked) {
        setMaskedId(res.data.idNumberMasked);
      }
      setSuccessMsg(
        res.message ||
          "Verification submitted successfully! Our certified female moderation officers will review your documents within 24–48 business hours."
      );
    } catch (err) {
      setErrorMsg((err as Error).message || "Failed to submit verification request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // 1. APPROVED / VERIFIED STATE
  if (status === "APPROVED" || status === "VERIFIED") {
    return (
      <div className="bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 rounded-3xl p-8 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <ShieldCheck className="w-9 h-9" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-emerald-950 dark:text-emerald-200">
            Identity Verified &amp; Authenticated
          </h3>
          <p className="text-xs text-emerald-800 dark:text-emerald-300/80 max-w-md mx-auto">
            Your Sisterhood Trust Badge is active. You enjoy verified sister status, priority directory listing, and full access to marketplace commerce.
          </p>
        </div>
        {maskedId && (
          <p className="font-mono text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
            Registered Document ID: {maskedId}
          </p>
        )}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>Status: Authenticated Sister (AES-256 Vault Protected)</span>
        </div>
      </div>
    );
  }

  // 2. PENDING / UNDER REVIEW STATE
  if (status === "PENDING" || status === "UNDER_REVIEW" || status === "PENDING_REVIEW") {
    return (
      <div className="bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800 rounded-3xl p-8 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/60 text-[#5B46F6] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <FileCheck className="w-9 h-9" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Verification Under Review</h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
            Your identity documents have been encrypted and submitted to our specialized female moderation desk. Expected review turnaround: 24–48 business hours.
          </p>
        </div>
        {maskedId && (
          <p className="font-mono text-xs text-purple-700 dark:text-purple-300 font-semibold">
            Submitted ID: {maskedId}
          </p>
        )}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-[#5B46F6] text-xs font-semibold">
          <Lock className="w-3.5 h-3.5" />
          <span>Pending Auditor Inspection</span>
        </div>
      </div>
    );
  }

  // 3. REJECTED / ACTION REQUIRED ALERT CARD & RESUBMISSION
  const isRejected = status === "REJECTED" || status === "ACTION_REQUIRED";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Prominent Rejection / Action Required Alert Card */}
      {isRejected && (
        <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/80 shadow-xs space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-rose-950 dark:text-rose-200">
                  {status === "ACTION_REQUIRED"
                    ? "Additional Information Required for Verification"
                    : "Identity Verification Submission Declined"}
                </h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-200/60 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                  {status === "ACTION_REQUIRED" ? "Action Required" : "Declined"}
                </span>
              </div>
              <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
                Feedback from Certified Female Verification Officer:
              </p>
              <div className="mt-1.5 p-3 rounded-xl bg-white/80 dark:bg-gray-900/80 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-900 dark:text-rose-200">
                &ldquo;{rejectionReason || "Document photo is unclear or identification numbers do not match. Please upload a clear photo of your Smart NID or Passport."}&rdquo;
              </div>
              {adminNotes && (
                <p className="text-[11px] text-rose-700/80 dark:text-rose-400 mt-1 italic">
                  Internal note: {adminNotes}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-end pt-1">
            <button
              type="button"
              onClick={() => {
                setStatus("NOT_SUBMITTED");
                setFrontFile(null);
                setBackFile(null);
                setFrontPreview(null);
                setBackPreview(null);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Re-submit Corrected Documents</span>
            </button>
          </div>
        </div>
      )}

      {/* Safe Space Disclaimer */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-purple-50 via-white to-purple-50/50 dark:from-purple-950/20 dark:via-gray-900 dark:to-purple-950/10 border border-purple-200/80 dark:border-purple-900/60 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5 text-[#5B46F6]">
          <Lock className="w-5 h-5 shrink-0" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
            Safe Sisterhood Identity Guarantee
          </h3>
        </div>
        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
          <strong>Confidentiality Commitment:</strong> All identity documents are encrypted end-to-end with <strong>AES-256 encryption</strong>. Your identity verification is handled <em>exclusively by our certified female verification officers</em>. Your official documents are strictly kept in cold storage and are <strong>never shown to the public or other members</strong>.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-medium text-gray-600 dark:text-gray-400">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 border border-purple-100 dark:border-purple-900 text-purple-900 dark:text-purple-300">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5B46F6]" /> AES-256 Vault
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 border border-purple-100 dark:border-purple-900 text-purple-900 dark:text-purple-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Female Officers Only
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 border border-purple-100 dark:border-purple-900 text-purple-900 dark:text-purple-300">
            <Lock className="w-3.5 h-3.5 text-purple-600" /> Never Made Public
          </span>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center gap-3 text-rose-700 dark:text-rose-300 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Document Selection & Details */}
      <div className="bg-white dark:bg-gray-900 p-6 sm:p-7 rounded-3xl shadow-xl border border-gray-200/80 dark:border-gray-800 space-y-5">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#5B46F6]" />
          <span>Document Type &amp; Identification</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setDocType("NID")}
            className={`p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all ${
              docType === "NID"
                ? "border-[#5B46F6] bg-purple-50 dark:bg-purple-950/50 text-[#5B46F6] ring-2 ring-[#5B46F6]/20"
                : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            National ID (Smart NID)
          </button>
          <button
            type="button"
            onClick={() => setDocType("PASSPORT")}
            className={`p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all ${
              docType === "PASSPORT"
                ? "border-[#5B46F6] bg-purple-50 dark:bg-purple-950/50 text-[#5B46F6] ring-2 ring-[#5B46F6]/20"
                : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            International Passport
          </button>
          <button
            type="button"
            onClick={() => setDocType("ACADEMIC")}
            className={`p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all ${
              docType === "ACADEMIC"
                ? "border-[#5B46F6] bg-purple-50 dark:bg-purple-950/50 text-[#5B46F6] ring-2 ring-[#5B46F6]/20"
                : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            Academic / Student ID
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
            Document / Identification Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            placeholder={
              docType === "NID"
                ? "e.g. 1982736452 (10 or 17 digit Smart NID)"
                : docType === "PASSPORT"
                ? "e.g. A01234567"
                : "e.g. STU-2023-908"
            }
            className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#5B46F6] focus:ring-2 focus:ring-[#5B46F6]/20 outline-none text-sm transition-all"
          />
        </div>

        {/* Upload Dropzones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Front of Document */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Front Side of Document <span className="text-rose-500">*</span>
            </label>
            {frontPreview ? (
              <div className="relative rounded-2xl border border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-950/20 p-2 overflow-hidden group">
                <img
                  src={frontPreview}
                  alt="Front Document Preview"
                  className="w-full h-40 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={handleRemoveFront}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-colors"
                  title="Remove front image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : frontFile ? (
              <div className="relative rounded-2xl border border-purple-200 dark:border-purple-800 bg-purple-50/30 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-[#5B46F6]" />
                  <span className="text-xs font-mono font-semibold">{frontFile.name}</span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFront}
                  className="p-1 rounded-full bg-rose-600 text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-40 px-4 py-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-[#5B46F6] bg-gray-50 dark:bg-gray-800/50 hover:bg-purple-50/20 cursor-pointer transition-colors text-center">
                <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-[#5B46F6] mb-2" />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Upload Front Scan / Photo</span>
                <span className="text-[11px] text-gray-400 mt-1">PNG, JPG, or PDF up to 10MB</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,application/pdf"
                  onChange={handleFrontChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Back of Document */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Back Side of Document {docType === "PASSPORT" ? "(Optional)" : <span className="text-rose-500">*</span>}
            </label>
            {backPreview ? (
              <div className="relative rounded-2xl border border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-950/20 p-2 overflow-hidden group">
                <img
                  src={backPreview}
                  alt="Back Document Preview"
                  className="w-full h-40 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={handleRemoveBack}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-colors"
                  title="Remove back image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : backFile ? (
              <div className="relative rounded-2xl border border-purple-200 dark:border-purple-800 bg-purple-50/30 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-[#5B46F6]" />
                  <span className="text-xs font-mono font-semibold">{backFile.name}</span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveBack}
                  className="p-1 rounded-full bg-rose-600 text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-40 px-4 py-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-[#5B46F6] bg-gray-50 dark:bg-gray-800/50 hover:bg-purple-50/20 cursor-pointer transition-colors text-center">
                <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-[#5B46F6] mb-2" />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Upload Back Scan / Photo</span>
                <span className="text-[11px] text-gray-400 mt-1">PNG, JPG, or PDF up to 10MB</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,application/pdf"
                  onChange={handleBackChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Submit Action */}
      <div className="flex items-center justify-end pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-7 py-3 rounded-xl bg-[#5B46F6] hover:bg-[#4C38E0] disabled:opacity-70 text-white text-sm font-semibold shadow-lg shadow-[#5B46F6]/25 flex items-center gap-2 transition-all active:scale-[0.98]"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Encrypting &amp; Submitting to Vault...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Submit for Sisterhood Verification</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
