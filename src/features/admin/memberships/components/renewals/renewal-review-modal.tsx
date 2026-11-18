"use client";

import React, { useState } from "react";
import {
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Mail,
  Info,
} from "lucide-react";
import type { RenewalReviewItem } from "../../types/membership";
import { formatBDT } from "../../../payments/data/mock-payments";

interface RenewalReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: RenewalReviewItem | null;
  onConfirmRenewal: (renewalId: string, action: "APPROVE_MANUAL" | "SEND_REMINDER") => void;
}

export function RenewalReviewModal({
  isOpen,
  onClose,
  item,
  onConfirmRenewal,
}: RenewalReviewModalProps) {
  const [internalNote, setInternalNote] = useState("");

  if (!isOpen || !item) return null;

  const handleAction = (action: "APPROVE_MANUAL" | "SEND_REMINDER") => {
    onConfirmRenewal(item.id, action);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl shadow-purple-950/20 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Manual Renewal Verification
              </h3>
              <p className="text-xs text-gray-500 font-mono">
                {item.subscriptionCode} • {item.memberName}
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
        <div className="p-6 space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Sister Member:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{item.memberName} ({item.memberId})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phone & Contact:</span>
              <span>{item.memberPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tier Plan:</span>
              <span className="font-semibold text-purple-700 dark:text-purple-300">{item.planName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Current Expiry:</span>
              <span className="font-medium text-gray-900 dark:text-white">{item.currentExpiryDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Renewal Amount Dues:</span>
              <span className="font-semibold text-sm text-[#5B46F6]">{formatBDT(item.amountBDT)}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Admin Verification Notes
            </label>
            <textarea
              rows={2}
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="Record verification notes or customer outreach confirmation..."
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-hidden focus:border-[#5B46F6]"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              Simulation Notice: Manual renewal confirmation is demonstration only and will not activate real membership or debit funds.
            </span>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => handleAction("SEND_REMINDER")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Simulate Renewal Notice (SMS/Email)</span>
            </button>

            <button
              type="button"
              onClick={() => handleAction("APPROVE_MANUAL")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm Renewal (Demo)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
