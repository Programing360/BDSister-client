import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowRight, Clock, AlertTriangle } from "lucide-react";
import { DEMO_MODERATION_QUEUE } from "../../data/mock-community";
import {
  ModerationPriorityBadge,
  ModerationReviewStatusBadge,
} from "../common/community-status-badge";

export function PendingModerationCard() {
  const pendingItems = DEMO_MODERATION_QUEUE.filter(
    (q) => q.reviewStatus === "PENDING" || q.reviewStatus === "UNDER_REVIEW"
  ).slice(0, 4);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-amber-500/5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-amber-50 text-amber-700">
            <ShieldAlert className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Pending Moderation Queue
            </h3>
            <p className="text-xs text-gray-500">
              Flagged content requiring administrator review
            </p>
          </div>
        </div>
        <Link
          href="/admin/community/moderation"
          className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 transition-colors"
        >
          Open Queue ({DEMO_MODERATION_QUEUE.length})
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {pendingItems.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-amber-50/20 transition-colors flex flex-col gap-2"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-800 uppercase">
                  {item.contentType}
                </span>
                <ModerationPriorityBadge priority={item.priority} />
                <ModerationReviewStatusBadge status={item.reviewStatus} />
              </div>
              <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(item.submittedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            <p className="text-xs font-semibold text-gray-900 line-clamp-1">
              {item.title || item.contentPreview}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
              <span className="flex items-center gap-1 text-amber-700 font-medium">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                {item.reason}
              </span>
              <span className="font-medium text-gray-700">By {item.author.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
