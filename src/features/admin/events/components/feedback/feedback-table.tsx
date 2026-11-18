"use client";

import React from "react";
import Link from "next/link";
import {
  Star,
  MessageSquare,
  Eye,
  EyeOff,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import type { EventFeedback, FeedbackReviewStatus } from "../../types/event";

interface FeedbackTableProps {
  feedbackList: EventFeedback[];
  onToggleStatus: (feedbackId: string) => void;
}

export function FeedbackTable({
  feedbackList,
  onToggleStatus,
}: FeedbackTableProps) {
  if (feedbackList.length === 0) {
    return (
      <div className="p-12 text-center bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)]">
        <MessageSquare className="w-10 h-10 text-brand-muted/60 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-brand-navy">
          No Reviews Found
        </h3>
        <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
          No attendee feedback matching your filter selection.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[850px]">
          <thead className="bg-brand-surface/70 text-brand-muted uppercase text-[11px] font-semibold border-b border-brand-primary/10">
            <tr>
              <th className="py-3.5 px-4">Attendee</th>
              <th className="py-3.5 px-4">Event</th>
              <th className="py-3.5 px-4">Rating</th>
              <th className="py-3.5 px-4">Testimonial Comment</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Submitted</th>
              <th className="py-3.5 px-4 text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-primary/5">
            {feedbackList.map((fb) => (
              <tr
                key={fb.id}
                className="hover:bg-brand-surface/50 transition-colors"
              >
                {/* Attendee */}
                <td className="py-3.5 px-4 font-semibold text-brand-navy">
                  {fb.attendeeName}
                  <span className="block text-[10px] text-brand-muted font-mono font-normal">
                    {fb.id}
                  </span>
                </td>

                {/* Event */}
                <td className="py-3.5 px-4 max-w-xs">
                  <Link
                    href={`/admin/events/${fb.eventId}`}
                    className="font-medium text-brand-navy hover:text-brand-primary line-clamp-1"
                  >
                    {fb.eventTitle}
                  </Link>
                </td>

                {/* Star Rating */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= fb.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                    <span className="text-xs font-semibold text-brand-navy ml-1">
                      {fb.rating}.0
                    </span>
                  </div>
                </td>

                {/* Comment */}
                <td className="py-3.5 px-4 max-w-sm">
                  <p className="text-brand-navy/90 font-normal line-clamp-2">
                    &ldquo;{fb.comment}&rdquo;
                  </p>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      fb.status === "PUBLISHED"
                        ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
                        : fb.status === "HIDDEN"
                        ? "bg-slate-500/10 text-slate-700 border border-slate-500/20"
                        : "bg-amber-500/10 text-amber-700 border border-amber-500/20"
                    }`}
                  >
                    {fb.status}
                  </span>
                </td>

                {/* Submitted Date */}
                <td className="py-3.5 px-4 text-brand-muted">
                  {fb.submittedDate.slice(0, 10)}
                </td>

                {/* Moderation Action */}
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onToggleStatus(fb.id)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-brand-primary/20 text-brand-navy hover:bg-brand-primary/10 transition"
                  >
                    {fb.status === "PUBLISHED" ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        Publish
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
