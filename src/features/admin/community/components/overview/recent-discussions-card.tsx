import React from "react";
import Link from "next/link";
import { MessageSquare, ArrowRight, Eye, ThumbsUp, Pin } from "lucide-react";
import { DEMO_DISCUSSIONS } from "../../data/mock-community";
import { DiscussionStatusBadge } from "../common/community-status-badge";

export function RecentDiscussionsCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-purple-500/5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-purple-50 text-purple-700">
            <MessageSquare className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Recent Discussions
            </h3>
            <p className="text-xs text-gray-500">
              Latest topics submitted by verified community members
            </p>
          </div>
        </div>
        <Link
          href="/admin/community/discussions"
          className="text-xs font-semibold text-[#5B46F6] hover:text-purple-800 flex items-center gap-1 transition-colors"
        >
          View All Discussions
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-gray-100">
        {DEMO_DISCUSSIONS.slice(0, 5).map((disc) => (
          <div
            key={disc.id}
            className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-purple-50/20 px-2 rounded-xl transition-colors"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {disc.isPinned && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-purple-100 px-2 py-0.5 rounded-md">
                    <Pin className="w-3 h-3 fill-current" /> Pinned
                  </span>
                )}
                <span className="text-xs font-semibold text-[#c76e2e] bg-purple-50 px-2 py-0.5 rounded">
                  {disc.categoryName}
                </span>
                <DiscussionStatusBadge status={disc.status} />
              </div>
              <Link
                href={`/admin/community/discussions/${disc.id}`}
                className="text-sm font-semibold text-gray-900 hover:text-blue-900 line-clamp-1 block transition-colors"
              >
                {disc.title}
              </Link>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>By <span className="font-medium text-gray-700">{disc.author.name}</span></span>
                <span>•</span>
                <span>{new Date(disc.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-gray-500 shrink-0 self-end sm:self-center">
              <span className="flex items-center gap-1" title="Replies">
                <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                {disc.postsCount}
              </span>
              <span className="flex items-center gap-1" title="Views">
                <Eye className="w-3.5 h-3.5 text-gray-400" />
                {disc.viewsCount}
              </span>
              <span className="flex items-center gap-1" title="Likes">
                <ThumbsUp className="w-3.5 h-3.5 text-gray-400" />
                {disc.likesCount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
