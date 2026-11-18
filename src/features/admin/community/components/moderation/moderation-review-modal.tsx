"use client";

import React, { useState } from "react";
import {
  X,
  ShieldAlert,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Send,
} from "lucide-react";
import { ModerationQueueItem } from "../../types/community";
import {
  ModerationPriorityBadge,
  ModerationReviewStatusBadge,
} from "../common/community-status-badge";

interface ModerationReviewModalProps {
  item: ModerationQueueItem | null;
  onClose: () => void;
  onDecision: (
    id: string,
    action: "APPROVED" | "REJECTED" | "NEEDS_CHANGES",
    note: string,
  ) => void;
}

export function ModerationReviewModal({
  item,
  onClose,
  onDecision,
}: ModerationReviewModalProps) {
  const [internalNote, setInternalNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!item) return null;

  const handleAction = (
    decision: "APPROVED" | "REJECTED" | "NEEDS_CHANGES",
  ) => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onDecision(
        item.id,
        decision,
        internalNote || `Action executed: ${decision}`,
      );
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Moderation Review: {item.contentType}
              </h3>
              <span className="text-xs font-mono text-gray-400">
                ID: {item.id}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-800 uppercase">
                {item.contentType}
              </span>
              <ModerationPriorityBadge priority={item.priority} />
              <ModerationReviewStatusBadge status={item.reviewStatus} />
            </div>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {new Date(item.submittedAt).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Trigger Reason */}
          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Interception Reason:</strong>{" "}
              {item.reason}
            </div>
          </div>

          {/* Author Details */}
          <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/60 flex items-center justify-between text-xs">
            <div>
              <span className="text-gray-400 uppercase font-semibold text-[10px]">
                Submitted by
              </span>
              <p className="font-bold text-gray-900">{item.author.name}</p>
              <span className="text-gray-500">@{item.author.username}</span>
            </div>
            {item.assignedModerator && (
              <div className="text-right">
                <span className="text-gray-400 uppercase font-semibold text-[10px]">
                  Assigned Moderator
                </span>
                <p className="font-semibold text-purple-700">
                  {item.assignedModerator}
                </p>
              </div>
            )}
          </div>

          {/* Content Preview */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Flagged Content Preview
            </label>
            <div className="p-4 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-800 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
              {item.title && (
                <div className="font-bold text-sm text-gray-900 mb-2 border-b border-gray-100 pb-1">
                  {item.title}
                </div>
              )}
              {item.contentPreview}
            </div>
          </div>

          {/* Notes input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Review Note / Feedback (Optional)
            </label>
            <textarea
              rows={2}
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="Provide reason for approval, rejection, or instructions for required edits..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-100 bg-gray-50/70 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleAction("NEEDS_CHANGES")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 text-xs font-semibold transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              Request Changes
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleAction("REJECTED")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-all disabled:opacity-50"
            >
              <XCircle className="w-3.5 h-3.5" />
              Reject & Quarantine
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleAction("APPROVED")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0d2a22] hover:bg-emerald-700 text-[#d2f33c] text-xs font-semibold shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Approve Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
