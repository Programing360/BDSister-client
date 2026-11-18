"use client";

import React from "react";
import Link from "next/link";
import {
  X,
  MessagesSquare,
  ThumbsUp,
  ShieldCheck,
  CheckCircle,
  XCircle,
  EyeOff,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { CommunityComment } from "../../types/community";
import { CommentStatusBadge } from "../common/community-status-badge";

interface CommentDetailDrawerProps {
  comment: CommunityComment | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onToggleHide: (id: string) => void;
  onRemove: (id: string) => void;
}

export function CommentDetailDrawer({
  comment,
  onClose,
  onApprove,
  onReject,
  onToggleHide,
  onRemove,
}: CommentDetailDrawerProps) {
  if (!comment) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <MessagesSquare className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Comment Details
              </h3>
              <span className="text-xs font-mono text-gray-400">{comment.id}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status & Context */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Moderation Status:</span>
            <CommentStatusBadge status={comment.status} />
          </div>

          <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/70 text-xs space-y-1">
            <span className="text-gray-400 block uppercase font-bold text-[10px]">
              Discussion Context
            </span>
            <p className="font-semibold text-gray-900 line-clamp-1">
              {comment.postTitle}
            </p>
            <Link
              href={`/admin/community/discussions/${comment.discussionId}`}
              className="text-purple-600 hover:underline flex items-center gap-1 font-medium pt-1"
            >
              Open Original Thread
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {comment.parentId && (
            <div className="p-3 rounded-xl border border-purple-100 bg-purple-50/30 text-xs">
              <span className="text-purple-700 font-semibold">
                Replying to: {comment.parentAuthorName || "Previous Sister"}
              </span>
            </div>
          )}
        </div>

        {/* Author Card */}
        <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
              {comment.author.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-gray-900">
                  {comment.author.name}
                </span>
                {comment.author.isVerified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                )}
              </div>
              <span className="text-[11px] text-gray-400">@{comment.author.username}</span>
            </div>
          </div>
          <span className="text-[11px] text-gray-500">
            {new Date(comment.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Content Body */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Full Comment Body
          </label>
          <div className="p-4 rounded-xl border border-gray-200 text-xs font-medium text-gray-800 leading-relaxed bg-white">
            {comment.content}
          </div>
        </div>

        {/* Engagement */}
        <div className="p-3 rounded-xl border border-gray-100 bg-pink-50/20 flex items-center gap-2 text-xs font-semibold text-gray-700">
          <ThumbsUp className="w-4 h-4 text-pink-600" />
          <span>{comment.reactionsCount} member likes</span>
        </div>

        {/* Admin Notes */}
        {comment.adminNotes && (
          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 text-xs space-y-1">
            <span className="font-bold text-amber-900 block">System / Mod Note:</span>
            <p className="text-amber-800">{comment.adminNotes}</p>
          </div>
        )}

        {/* Moderation History */}
        {comment.moderationHistory && comment.moderationHistory.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Audit Timeline
            </label>
            <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 text-xs">
              {comment.moderationHistory.map((h, i) => (
                <div key={i} className="p-3">
                  <span className="font-bold text-gray-900">{h.action}</span>
                  <span className="text-gray-400 mx-1">•</span>
                  <span className="text-gray-600">{h.actor}</span>
                  <p className="text-gray-500 mt-0.5">{h.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="pt-4 border-t border-gray-100 space-y-2">
          {comment.status === "PENDING_REVIEW" && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onApprove(comment.id);
                  onClose();
                }}
                className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
              <button
                type="button"
                onClick={() => {
                  onReject(comment.id);
                  onClose();
                }}
                className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onToggleHide(comment.id);
                onClose();
              }}
              className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-colors"
            >
              <EyeOff className="w-4 h-4" />
              {comment.status === "HIDDEN" ? "Unhide" : "Hide Comment"}
            </button>
            <button
              type="button"
              onClick={() => {
                onRemove(comment.id);
                onClose();
              }}
              className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
