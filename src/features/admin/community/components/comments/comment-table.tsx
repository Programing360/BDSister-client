"use client";

import React from "react";
import {
  MessagesSquare,
  Eye,
  CheckCircle,
  XCircle,
  EyeOff,
  Trash2,
  ThumbsUp,
} from "lucide-react";
import { CommunityComment } from "../../types/community";
import { CommentStatusBadge } from "../common/community-status-badge";

interface CommentTableProps {
  comments: CommunityComment[];
  onInspect: (comment: CommunityComment) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onToggleHide: (id: string) => void;
  onRemove: (id: string) => void;
}

export function CommentTable({
  comments,
  onInspect,
  onApprove,
  onReject,
  onToggleHide,
  onRemove,
}: CommentTableProps) {
  if (comments.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-md">
        <MessagesSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-gray-800">No comments found</h3>
        <p className="text-xs text-gray-500 mt-1">Try modifying your search or status filters.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-xl shadow-purple-500/5">
        <table className="w-full text-left text-xs min-w-[1000px]">
          <thead className="bg-gray-50/75 border-b border-gray-100 uppercase tracking-wider text-gray-500 font-semibold">
            <tr>
              <th className="py-3.5 px-4 min-w-[320px]">Comment Content</th>
              <th className="py-3.5 px-4 min-w-[180px]">Discussion / Post Context</th>
              <th className="py-3.5 px-4 min-w-[150px]">Author</th>
              <th className="py-3.5 px-4 text-center">Reactions</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right min-w-[160px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {comments.map((c) => (
              <tr key={c.id} className="hover:bg-purple-50/20 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-gray-400">{c.id}</span>
                    <button
                      type="button"
                      onClick={() => onInspect(c)}
                      className="font-semibold text-gray-900 hover:text-purple-600 block line-clamp-2 text-left transition-colors"
                    >
                      {c.content}
                    </button>
                    {c.parentId && (
                      <span className="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded font-medium">
                        Replying to sister
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <p className="font-semibold text-gray-900 line-clamp-2 max-w-xs">
                    {c.postTitle}
                  </p>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {c.author.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{c.author.name}</p>
                      <span className="text-[10px] text-gray-400">@{c.author.username}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center gap-1 font-semibold text-gray-600">
                    <ThumbsUp className="w-3.5 h-3.5 text-gray-400" />
                    {c.reactionsCount}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <CommentStatusBadge status={c.status} />
                </td>
                <td className="py-3.5 px-4 text-gray-500">
                  {new Date(c.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {c.status === "PENDING_REVIEW" && (
                      <>
                        <button
                          type="button"
                          onClick={() => onApprove(c.id)}
                          className="p-1.5 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors"
                          title="Approve Comment"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onReject(c.id)}
                          className="p-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 transition-colors"
                          title="Reject Comment"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => onToggleHide(c.id)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        c.status === "HIDDEN"
                          ? "border-purple-300 bg-purple-50 text-purple-700"
                          : "border-gray-200 text-gray-500 hover:text-purple-600 hover:bg-gray-50"
                      }`}
                      title={c.status === "HIDDEN" ? "Unhide" : "Hide"}
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onInspect(c)}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all"
                      title="Inspect Full Comment"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(c.id)}
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-all"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Fallback */}
      <div className="md:hidden space-y-3">
        {comments.map((c) => (
          <div
            key={c.id}
            className="p-4 rounded-xl border border-gray-100 bg-white shadow-md space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[10px] font-mono text-gray-400">{c.id}</span>
              <CommentStatusBadge status={c.status} />
            </div>

            <p className="text-xs text-gray-800 line-clamp-3">{c.content}</p>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
              <span>By {c.author.name}</span>
              <span>{c.reactionsCount} likes</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => onInspect(c)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-gray-200 text-gray-700"
              >
                Inspect
              </button>
              <button
                type="button"
                onClick={() => onToggleHide(c.id)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600"
              >
                {c.status === "HIDDEN" ? "Unhide" : "Hide"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
