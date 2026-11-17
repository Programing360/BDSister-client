"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  FileCheck,
} from "lucide-react";
import type { BusinessDocument } from "@/types/business";

interface BusinessVerificationViewProps {
  business: BusinessDocument;
}

export function BusinessVerificationView({ business }: BusinessVerificationViewProps) {
  const router = useRouter();
  const isVerified = business.verificationStatus === "VERIFIED";
  const isPending = business.verificationStatus === "PENDING" || business.verificationStatus === "UNDER_REVIEW";

  const [docType, setDocType] = useState<"TRADE_LICENSE" | "TIN_CERTIFICATE" | "NATIONAL_ID" | "UTILITY_BILL" | "OTHER">("TRADE_LICENSE");
  const [docTitle, setDocTitle] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docUrl.trim()) {
      setErrorMsg("Please provide both a document title and file URL / upload.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`/api/member/business/${business.id}/verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentType: docType,
          documentTitle: docTitle.trim(),
          documentUrl: docUrl.trim(),
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to submit verification document.");
      }

      setSuccessMsg("Verification document submitted successfully for admin review!");
      setDocTitle("");
      setDocUrl("");
      setNotes("");
      router.refresh();
    } catch (err) {
      setErrorMsg((err as Error).message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "avatar");

      const res = await fetch("/api/member/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to upload document file.");
      }

      setDocUrl(data.data.url);
      if (!docTitle) {
        setDocTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    } catch (err) {
      setErrorMsg((err as Error).message || "Upload failed.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="flex items-center gap-3 bg-white p-5 rounded-3xl shadow-xl border border-gray-200/80">
        <Link
          href={`/member/business/${business.id}`}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          title="Back to business overview"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Trade Verification for {business.name}</h1>
          <p className="text-xs text-gray-500">
            Submit formal trade credentials to earn the verified business badge.
          </p>
        </div>
      </div>

      {/* Verification Status Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/80">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              isVerified
                ? "bg-emerald-100 text-emerald-700"
                : isPending
                ? "bg-amber-100 text-amber-700"
                : "bg-purple-100 text-[#5B46F6]"
            }`}
          >
            <ShieldCheck className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-lg font-bold text-gray-900">
                {isVerified
                  ? "Business Accredited & Verified"
                  : isPending
                  ? "Verification Under Review"
                  : "Trade Verification Pending Submission"}
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isVerified
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : isPending
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200"
                }`}
              >
                {business.verificationStatus}
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed max-w-xl">
              {isVerified
                ? "This enterprise has been certified by the BDSisters accreditation board. The verified badge is displayed on your public business page, store listings, and search results."
                : isPending
                ? "Your submitted documents are currently being evaluated by our compliance board. Review usually takes 24 to 48 hours."
                : "Upload your municipal trade license, certificate of incorporation, or tax identification (TIN) certificate to complete trade verification."}
            </p>
          </div>
        </div>
      </div>

      {/* Upload New Document Form */}
      {!isVerified && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/80 space-y-5">
          <div>
            <h3 className="text-base font-bold text-gray-900">Submit Verification Document</h3>
            <p className="text-xs text-gray-500">
              Provide government or institutional registration records for {business.name}.
            </p>
          </div>

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Document Type *
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none bg-white focus:border-[#5B46F6]"
              >
                <option value="TRADE_LICENSE">Trade License (City Corporation / Union)</option>
                <option value="TIN_CERTIFICATE">TIN / E-TIN Certificate</option>
                <option value="NATIONAL_ID">Owner National ID (NID)</option>
                <option value="UTILITY_BILL">Utility Bill / Lease Agreement</option>
                <option value="OTHER">Other Institutional Registration</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Document Label / Title *
              </label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="e.g. Dhaka North Trade License 2024-2025"
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Document Scan / File *
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={docUrl}
                  onChange={(e) => setDocUrl(e.target.value)}
                  placeholder="Paste secure file URL or upload below..."
                  required
                  className="flex-1 px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
                />
                <label className="cursor-pointer px-5 py-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#5B46F6] text-xs font-bold flex items-center justify-center gap-2 border border-purple-200 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Upload File</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Notes for Verification Reviewers (Optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional registration number, license expiry date, or clarification..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6] resize-y"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#5B46F6] hover:bg-[#4C38E0] disabled:opacity-70 text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#5B46F6]/25 flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" />
                  <span>Submit Document for Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Submitted Documents History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/80 space-y-4">
        <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
          Submitted Verification Records
        </h3>

        {business.verificationDocuments && business.verificationDocuments.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {business.verificationDocuments.map((doc) => (
              <div key={doc.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#5B46F6] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-gray-900">{doc.title}</p>
                    <p className="text-[11px] text-gray-400">
                      Type: {doc.type} • Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-purple-50 text-[#5B46F6] text-xs font-semibold border border-gray-200/80 transition-colors"
                >
                  View File
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic py-4 text-center">
            No verification documents submitted yet.
          </p>
        )}
      </div>
    </div>
  );
}
