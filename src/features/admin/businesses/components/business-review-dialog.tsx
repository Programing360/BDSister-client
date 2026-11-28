"use client";

import React, { useState } from "react";
import type { AdminBusinessItem, BusinessApprovalStatus } from "../types/admin-business.ts";
import { X, CheckCircle2, XCircle, AlertTriangle, MessageSquare, ShieldCheck, Building2 } from "lucide-react";
import { BusinessStatusBadge, BusinessVerificationBadge } from "./business-status-badges.tsx";

interface BusinessReviewDialogProps {
  business: AdminBusinessItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveAction: (
    businessId: string,
    action: BusinessApprovalStatus,
    notes: string,
    rejectionReason?: string
  ) => void;
}

export function BusinessReviewDialog({
  business,
  isOpen,
  onClose,
  onSaveAction,
}: BusinessReviewDialogProps) {
  if (!isOpen || !business) return null;

  const [selectedAction, setSelectedAction] = useState<BusinessApprovalStatus>("APPROVED");
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (selectedAction === "REJECTED" && !rejectionReason.trim()) {
      setFormError("Please provide a rejection reason so the sister entrepreneur receives actionable guidance.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSaveAction(business.id, selectedAction, adminNotes, rejectionReason);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#EAE6F7] text-[#5B46F6]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 leading-tight">{business.name}</h3>
              <p className="text-xs text-gray-500 font-mono mt-0.5">{business.businessCode} • {business.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm">
          {formError && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 animate-in fade-in">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          {/* Quick Info summary */}
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Current Status:</span>
              <BusinessStatusBadge status={business.status} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Verification:</span>
              <BusinessVerificationBadge status={business.verificationStatus} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Owner:</span>
              <span className="font-medium text-gray-800">{business.ownerName} ({business.ownerId})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Location:</span>
              <span className="text-gray-700">{business.location.city}, {business.location.district}</span>
            </div>
          </div>

          {/* Decision Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Review Decision</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedAction("APPROVED")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                  selectedAction === "APPROVED"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 mb-1 text-emerald-600" />
                <span>Approve</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAction("REJECTED")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                  selectedAction === "REJECTED"
                    ? "bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/20"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <XCircle className="w-4 h-4 mb-1 text-rose-600" />
                <span>Reject</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAction("SUSPENDED")}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                  selectedAction === "SUSPENDED"
                    ? "bg-purple-50 border-purple-500 text-purple-800 ring-2 ring-purple-500/20"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <AlertTriangle className="w-4 h-4 mb-1 text-purple-600" />
                <span>Suspend</span>
              </button>
            </div>
          </div>

          {/* Rejection / Suspension Grounds */}
          {(selectedAction === "REJECTED" || selectedAction === "SUSPENDED") && (
            <div>
              <label className="block text-xs font-semibold text-rose-700 mb-1">
                {selectedAction === "REJECTED" ? "Reason for Rejection *" : "Reason for Suspension *"}
              </label>
              <textarea
                rows={2}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="E.g., Ineligible commercial business type, unverified trade license, missing BSTI permit..."
                required
                className="w-full px-3 py-2 text-xs bg-rose-50/50 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-gray-900 placeholder:text-gray-400"
              />
            </div>
          )}

          {/* Admin Internal Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Internal Moderation Notes (Admin Only)
            </label>
            <textarea
              rows={2}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Internal log regarding documentation checks, verification calls, or history..."
              className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20 focus:border-[#5B46F6] text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-xs font-medium text-white rounded-lg transition-colors shadow-xs ${
                selectedAction === "APPROVED"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : selectedAction === "REJECTED"
                  ? "bg-rose-600 hover:bg-rose-700"
                  : "bg-purple-600 hover:bg-purple-700"
              } disabled:opacity-50`}
            >
              {isSubmitting ? "Processing..." : `Confirm ${selectedAction.toLowerCase()}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
