"use client";

import React, { useState } from "react";
import { X, Download, FileSpreadsheet, FileText, CheckCircle2 } from "lucide-react";

interface MemberExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalMembersCount: number;
}

export function MemberExportModal({
  isOpen,
  onClose,
  totalMembersCount,
}: MemberExportModalProps) {
  const [format, setFormat] = useState<"csv" | "xlsx">("csv");
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>({
    memberId: true,
    name: true,
    email: true,
    phone: true,
    membershipType: true,
    accountStatus: true,
    verificationStatus: true,
    joinedDate: true,
    location: false,
    profileCompletion: false,
  });
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleField = (field: string) => {
    setSelectedFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleExport = () => {
    setExportNotice(
      `Export Job Queued: Dataset containing ${totalMembersCount} members (${format.toUpperCase()}) will be compiled by backend export worker.`
    );
    setTimeout(() => {
      setExportNotice(null);
      onClose();
    }, 2000);
  };

  const fields = [
    { id: "memberId", label: "Member ID (BDS-MEM-xxxx)" },
    { id: "name", label: "Full Name" },
    { id: "email", label: "Email Address" },
    { id: "phone", label: "Phone Number" },
    { id: "membershipType", label: "Membership Tier" },
    { id: "accountStatus", label: "Account Status" },
    { id: "verificationStatus", label: "Identity Verification Status" },
    { id: "joinedDate", label: "Registration Date" },
    { id: "location", label: "District / City Location" },
    { id: "profileCompletion", label: "Profile Completion %" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-xs p-4"
    >
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-[#5B46F6]" />
            <h3 className="text-sm font-bold text-gray-900">
              Export Member Directory
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-gray-500">
          Choose export format and selected columns. Sensitive identity documents are excluded for privacy protection.
        </p>

        {/* Format Selection */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-700">File Format</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormat("csv")}
              className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition ${
                format === "csv"
                  ? "border-[#5B46F6] bg-purple-50 text-[#5B46F6]"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>CSV Spreadsheet</span>
            </button>

            <button
              type="button"
              onClick={() => setFormat("xlsx")}
              className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition ${
                format === "xlsx"
                  ? "border-[#5B46F6] bg-purple-50 text-[#5B46F6]"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              <span>Excel Workbook</span>
            </button>
          </div>
        </div>

        {/* Fields Selection */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-gray-700">Columns to Export</label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
            {fields.map((f) => (
              <label
                key={f.id}
                className="flex items-center gap-2 text-xs text-gray-700 font-medium cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={Boolean(selectedFields[f.id])}
                  onChange={() => toggleField(f.id)}
                  className="rounded border-gray-300 text-[#5B46F6] focus:ring-[#5B46F6]"
                />
                <span className="truncate">{f.label}</span>
              </label>
            ))}
          </div>
        </div>

        {exportNotice && (
          <div className="flex items-start gap-2 rounded-xl bg-purple-50 p-2.5 text-[11px] font-bold text-[#5B46F6] border border-purple-200 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{exportNotice}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B46F6] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#4a36e0]"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Generate Export</span>
          </button>
        </div>
      </div>
    </div>
  );
}
