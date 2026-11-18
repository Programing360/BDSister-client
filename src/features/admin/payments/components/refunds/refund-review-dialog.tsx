"use client";

import React, { useState } from "react";
import {
  X,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import type { RefundItem } from "../../types/payment";
import { formatBDT } from "../../data/mock-payments";

interface RefundReviewDialogProps {
  isOpen: boolean;
  action: "APPROVE" | "REJECT" | "VIEW" | null;
  refund: RefundItem | null;
  onClose: () => void;
  onConfirm: (refundId: string, action: "APPROVE" | "REJECT", payload: { note?: string; rejectionReason?: string }) => void;
}

export function RefundReviewDialog({
  isOpen,
  action,
  refund,
  onClose,
  onConfirm,
}: RefundReviewDialogProps) {
  const [note, setNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !action || !refund) return null;

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (action === "REJECT" && !rejectionReason.trim()) {
      setError("A specific rejection reason is mandatory to document the decision.");
      return;
    }

    if (action === "APPROVE" || action === "REJECT") {
      onConfirm(refund.id, action, {
        note: note.trim(),
        rejectionReason: rejectionReason.trim(),
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl shadow-purple-950/20 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                action === "APPROVE"
                  ? "bg-emerald-50 text-emerald-600"
                  : action === "REJECT"
                  ? "bg-rose-50 text-rose-600"
                  : "bg-indigo-50 text-[#5B46F6]"
              }`}
            >
              {action === "APPROVE" ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : action === "REJECT" ? (
                <XCircle className="w-5 h-5" />
              ) : (
                <RotateCcw className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                {action === "APPROVE"
                  ? "Approve Refund Settlement"
                  : action === "REJECT"
                  ? "Reject Refund Claim"
                  : "Inspect Refund Record"}
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                {refund.refundCode} • {refund.originalTrxCode}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleAction} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Refund Details Summary */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Claimant Member:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{refund.memberName} ({refund.memberId})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Requested Amount:</span>
              <span className="font-semibold text-sm text-[#5B46F6]">{formatBDT(refund.requestedAmountBDT)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Target Order/Plan:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{refund.relatedEntity.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Request Date:</span>
              <span>{refund.requestDate}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Customer Refund Statement / Reason:
            </label>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 leading-relaxed">
              {refund.refundReason}
            </div>
          </div>

          {action === "REJECT" && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Rejection Rationale (Required) *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={2}
                placeholder="Explain why this refund claim cannot be settled (e.g. verified product delivery, past refund window)..."
                className="w-full p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-hidden focus:border-rose-500"
              />
            </div>
          )}

          {action !== "VIEW" && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Internal Administrative Note
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Optional internal record note for BDSisters financial records..."
                className="w-full p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-hidden focus:border-[#5B46F6]"
              />
            </div>
          )}

          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              Simulation Notice: No real currency will be moved. Modifies client demonstration state only.
            </span>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            {action === "APPROVE" && (
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm Approve (Demo)</span>
              </button>
            )}
            {action === "REJECT" && (
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-md shadow-rose-500/20 cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Confirm Rejection (Demo)</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
