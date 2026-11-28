"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { BusinessVerificationRecord, BusinessVerificationStatus } from "../types/admin-business.ts";
import { BusinessVerificationBadge } from "./business-status-badges.tsx";
import {
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  Building2,
  User,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  Lock,
} from "lucide-react";

interface VerificationDetailsProps {
  verification: BusinessVerificationRecord;
}

export function BusinessVerificationDetailsView({ verification: initialRecord }: VerificationDetailsProps) {
  const [record, setRecord] = useState<BusinessVerificationRecord>(initialRecord);
  const [notes, setNotes] = useState(record.reviewerNotes || "");
  const [rejectionReason, setRejectionReason] = useState(record.rejectionReason || "");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleUpdateStatus = (newStatus: BusinessVerificationStatus) => {
    if (newStatus === "REJECTED" && !rejectionReason.trim()) {
      setToastMessage("Please provide a rejection reason.");
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }

    setRecord((prev) => ({
      ...prev,
      status: newStatus,
      reviewedAt: new Date().toISOString(),
      reviewedBy: "Admin Sadia Rahman",
      reviewerNotes: notes,
      rejectionReason: newStatus === "REJECTED" ? rejectionReason : undefined,
    }));

    setToastMessage(`Verification status successfully set to ${newStatus}.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-600 hover:text-emerald-800">
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/businesses/verifications"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Verification Queue</span>
        </Link>
        <div className="text-xs font-mono text-gray-400">
          Case ID: <span className="font-semibold text-gray-700">{record.id}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Synthetic Document Specimen Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-800">
                <FileText className="w-4 h-4 text-[#5B46F6]" />
                <span>Document Specimen Preview (Synthetic & Redacted)</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-50 border border-amber-200 text-amber-800">
                Safe Specimen
              </span>
            </div>

            {/* Simulated Watermarked Specimen Container */}
            <div className="p-6 relative bg-slate-50 border-b border-gray-200 min-h-[420px] flex flex-col justify-between overflow-hidden select-none">
              {/* Watermark Diagonal Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15 rotate-[-25deg]">
                <div className="text-center font-black tracking-widest text-gray-900 text-2xl uppercase border-4 border-gray-900 p-6 rounded-2xl">
                  BDSISTERS.ORG SPECIMEN<br />
                  SYNTHETIC VERIFICATION RECORD
                </div>
              </div>

              {/* Specimen Header */}
              <div className="relative z-10 border-b-2 border-slate-300 pb-4 flex justify-between items-start">
                <div>
                  <div className="text-[10px] tracking-wider text-slate-500 font-bold uppercase">
                    GOVERNMENT OF THE PEOPLE'S REPUBLIC OF BANGLADESH
                  </div>
                  <h2 className="text-lg font-black text-slate-800 mt-0.5">
                    {record.documentType.replace(/_/g, " ")} CERTIFICATE
                  </h2>
                  <div className="text-xs text-slate-600 font-medium">
                    Issuing Authority: {record.issuingAuthority || "Local Pourashava Authority"}
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-400 flex items-center justify-center text-center text-[9px] text-slate-500 font-bold">
                  OFFICIAL<br />SEAL
                </div>
              </div>

              {/* Specimen Fields */}
              <div className="relative z-10 grid grid-cols-2 gap-4 py-6 text-xs text-slate-700">
                <div className="bg-white/80 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">License Number</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{record.documentNumber}</span>
                </div>
                <div className="bg-white/80 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">Registered Entity</span>
                  <span className="font-bold text-slate-900 text-sm">{record.businessName}</span>
                </div>
                <div className="bg-white/80 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">Proprietor / Signatory</span>
                  <span className="font-semibold text-slate-800">{record.ownerName}</span>
                </div>
                <div className="bg-white/80 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">Issue & Expiry Dates</span>
                  <span className="font-semibold text-slate-800">{record.issueDate || "2023-01-01"} to {record.expiryDate || "2027-06-30"}</span>
                </div>
              </div>

              {/* Specimen Security Barcode & Footer */}
              <div className="relative z-10 border-t border-slate-300 pt-3 flex items-center justify-between text-[11px] text-slate-500">
                <div className="font-mono text-[10px] text-slate-400">
                  REF: {record.businessCode} // VER-SPECIMEN-HASH-81920
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-medium border border-emerald-200">
                  <Lock className="w-3 h-3" />
                  <span>Secure Storage Redacted</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50/50 text-[11px] text-gray-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#5B46F6] shrink-0" />
              <span>
                Under BDSisters Data Privacy Policy, sensitive identity proofs and commercial tax filings are synthetic specimens in administrative UI to protect women entrepreneurs from unauthorized exposure.
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Decision Panel & Associated Entity Links */}
        <div className="space-y-5">
          {/* Linked Business Card */}
          <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#5B46F6]" />
              <span>Associated Enterprise</span>
            </h3>

            <div>
              <Link
                href={`/admin/businesses/${record.businessId}`}
                className="font-bold text-gray-900 hover:text-[#5B46F6] text-sm block"
              >
                {record.businessName}
              </Link>
              <span className="font-mono text-gray-400 text-[11px]">{record.businessCode}</span>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center gap-2 text-gray-600">
              <User className="w-3.5 h-3.5 text-gray-400" />
              <span>{record.ownerName}</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-gray-400">Current Status:</span>
              <BusinessVerificationBadge status={record.status} size="sm" />
            </div>
          </div>

          {/* Decision & Moderation Controls */}
          <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-semibold text-gray-900">Verification Decision</h3>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleUpdateStatus("VERIFIED")}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verify Document</span>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateStatus("REJECTED")}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors shadow-xs"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </div>

            {/* Rejection Reason textarea */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Rejection Reason (If rejecting)
              </label>
              <textarea
                rows={2}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="E.g. License expired, name mismatch on deed..."
                className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Review Officer Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Internal notes regarding authority verification..."
                className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#5B46F6]"
              />
            </div>

            {record.reviewedAt && (
              <div className="text-[11px] text-gray-400 border-t border-gray-100 pt-2 space-y-0.5">
                <div>Reviewed by: <span className="text-gray-700 font-medium">{record.reviewedBy}</span></div>
                <div>Date: {new Date(record.reviewedAt).toLocaleString()}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
