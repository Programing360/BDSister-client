"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  EyeOff,
  ThumbsUp,
  MessageSquare,
  Paperclip,
} from "lucide-react";
import { CommunityPost } from "../../types/community";
import { PostStatusBadge } from "../common/community-status-badge";

interface PostTableProps {
  posts: CommunityPost[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onToggleHide: (id: string) => void;
}

export function PostTable({
  posts,
  onApprove,
  onReject,
  onToggleHide,
}: PostTableProps) {
  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-md">
        <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-gray-800">No posts found</h3>
        <p className="text-xs text-gray-500 mt-1">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-xl shadow-purple-500/5">
        <table className="w-full text-left text-xs min-w-[1050px]">
          <thead className="bg-gray-50/75 border-b border-gray-100 uppercase tracking-wider text-gray-500 font-semibold">
            <tr>
              <th className="py-3.5 px-4 min-w-[300px]">Post & Content Preview</th>
              <th className="py-3.5 px-4 min-w-[180px]">Discussion / Category</th>
              <th className="py-3.5 px-4 min-w-[160px]">Author</th>
              <th className="py-3.5 px-4 text-center">Engagement</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4">Submitted</th>
              <th className="py-3.5 px-4 text-right min-w-[170px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-purple-50/20 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-gray-400">{p.id}</span>
                      {p.mediaAttachments && p.mediaAttachments.length > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                          <Paperclip className="w-2.5 h-2.5" /> {p.mediaAttachments.length}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/admin/community/posts/${p.id}`}
                      className="font-bold text-gray-900 hover:text-purple-600 block line-clamp-1 transition-colors text-sm"
                    >
                      {p.title || p.content}
                    </Link>
                    <p className="text-xs text-gray-500 line-clamp-1">{p.content}</p>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-gray-900 line-clamp-1">
                      {p.discussionTitle}
                    </p>
                    <span className="text-[11px] font-medium text-purple-600">
                      {p.categoryName}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {p.author.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{p.author.name}</p>
                      <span className="text-[11px] text-gray-400">@{p.author.username}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-3 text-gray-500 font-medium">
                    <span className="flex items-center gap-1" title="Reactions">
                      <ThumbsUp className="w-3.5 h-3.5 text-gray-400" />
                      {p.reactionsCount}
                    </span>
                    <span className="flex items-center gap-1" title="Comments">
                      <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                      {p.commentsCount}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <PostStatusBadge status={p.status} />
                </td>
                <td className="py-3.5 px-4 text-gray-500">
                  {new Date(p.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {p.status === "PENDING_REVIEW" && (
                      <>
                        <button
                          type="button"
                          onClick={() => onApprove(p.id)}
                          className="p-1.5 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors"
                          title="Approve Post (Demo)"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onReject(p.id)}
                          className="p-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 transition-colors"
                          title="Reject Post (Demo)"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => onToggleHide(p.id)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        p.status === "HIDDEN"
                          ? "border-purple-300 bg-purple-50 text-purple-700"
                          : "border-gray-200 text-gray-500 hover:text-purple-600 hover:bg-gray-50"
                      }`}
                      title={p.status === "HIDDEN" ? "Unhide Post (Demo)" : "Hide Post (Demo)"}
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      href={`/admin/community/posts/${p.id}`}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all"
                      title="Inspect Post"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/admin/community/posts/${p.id}/edit`}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all"
                      title="Edit Post"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Fallback */}
      <div className="md:hidden space-y-3">
        {posts.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-xl border border-gray-100 bg-white shadow-md space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-gray-400">{p.id}</span>
                <Link
                  href={`/admin/community/posts/${p.id}`}
                  className="font-bold text-sm text-gray-900 block"
                >
                  {p.title || p.content.slice(0, 50)}...
                </Link>
              </div>
              <PostStatusBadge status={p.status} />
            </div>

            <p className="text-xs text-gray-600 line-clamp-2">{p.content}</p>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
              <span>By {p.author.name}</span>
              <span>{p.reactionsCount} reactions</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Link
                href={`/admin/community/posts/${p.id}`}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-gray-200 text-gray-700"
              >
                Inspect
              </Link>
              <button
                type="button"
                onClick={() => onToggleHide(p.id)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600"
              >
                {p.status === "HIDDEN" ? "Unhide" : "Hide"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
