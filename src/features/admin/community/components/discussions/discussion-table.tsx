"use client";

import React from "react";
import Link from "next/link";
import {
  Pin,
  Lock,
  Unlock,
  Archive,
  Eye,
  Edit,
  MessageSquare,
  ThumbsUp,
  Eye as EyeIcon,
} from "lucide-react";
import { Discussion } from "../../types/community";
import { DiscussionStatusBadge } from "../common/community-status-badge";

interface DiscussionTableProps {
  discussions: Discussion[];
  onTogglePin: (id: string) => void;
  onToggleLock: (id: string) => void;
  onArchive: (id: string) => void;
}

export function DiscussionTable({
  discussions,
  onTogglePin,
  onToggleLock,
  onArchive,
}: DiscussionTableProps) {
  if (discussions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-md">
        <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-gray-800">No discussions found</h3>
        <p className="text-xs text-gray-500 mt-1">Try adjusting your search query or filters.</p>
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
              <th className="py-3.5 px-4 min-w-[320px]">Discussion Title</th>
              <th className="py-3.5 px-4 min-w-[180px]">Category</th>
              <th className="py-3.5 px-4 min-w-[180px]">Author</th>
              <th className="py-3.5 px-4 text-center">Engagement</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4">Created</th>
              <th className="py-3.5 px-4 text-right min-w-[170px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {discussions.map((d) => (
              <tr key={d.id} className="hover:bg-purple-50/20 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {d.isPinned && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                          <Pin className="w-2.5 h-2.5 fill-current" /> Pinned
                        </span>
                      )}
                      {d.isLocked && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                          <Lock className="w-2.5 h-2.5" /> Locked
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-gray-400">{d.id}</span>
                    </div>
                    <Link
                      href={`/admin/community/discussions/${d.id}`}
                      className="font-bold text-gray-900 hover:text-purple-600 block line-clamp-1 transition-colors text-sm"
                    >
                      {d.title}
                    </Link>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-800">
                    {d.categoryName}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    {d.author.avatarUrl ? (
                      <img
                        src={d.author.avatarUrl}
                        alt={d.author.name}
                        className="w-7 h-7 rounded-full object-cover border border-purple-200 shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {d.author.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{d.author.name}</p>
                      <span className="text-[11px] text-gray-400">@{d.author.username}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-3 text-gray-500 font-medium">
                    <span className="flex items-center gap-1" title="Posts/Replies">
                      <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                      {d.postsCount}
                    </span>
                    <span className="flex items-center gap-1" title="Views">
                      <EyeIcon className="w-3.5 h-3.5 text-gray-400" />
                      {d.viewsCount}
                    </span>
                    <span className="flex items-center gap-1" title="Likes">
                      <ThumbsUp className="w-3.5 h-3.5 text-gray-400" />
                      {d.likesCount}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <DiscussionStatusBadge status={d.status} />
                </td>
                <td className="py-3.5 px-4 text-gray-500">
                  {new Date(d.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onTogglePin(d.id)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        d.isPinned
                          ? "border-purple-300 bg-purple-50 text-purple-700"
                          : "border-gray-200 text-gray-500 hover:text-purple-600 hover:bg-gray-50"
                      }`}
                      title={d.isPinned ? "Unpin (Demo)" : "Pin to Top (Demo)"}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleLock(d.id)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        d.isLocked
                          ? "border-amber-300 bg-amber-50 text-amber-700"
                          : "border-gray-200 text-gray-500 hover:text-amber-600 hover:bg-gray-50"
                      }`}
                      title={d.isLocked ? "Unlock Discussion (Demo)" : "Lock Discussion (Demo)"}
                    >
                      {d.isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    </button>
                    <Link
                      href={`/admin/community/discussions/${d.id}`}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/admin/community/discussions/${d.id}/edit`}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all"
                      title="Edit"
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

      {/* Mobile Card Fallback */}
      <div className="md:hidden space-y-3">
        {discussions.map((d) => (
          <div
            key={d.id}
            className="p-4 rounded-xl border border-gray-100 bg-white shadow-md space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {d.isPinned && (
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                      Pinned
                    </span>
                  )}
                  {d.isLocked && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      Locked
                    </span>
                  )}
                  <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {d.categoryName}
                  </span>
                </div>
                <Link
                  href={`/admin/community/discussions/${d.id}`}
                  className="font-bold text-sm text-gray-900 block"
                >
                  {d.title}
                </Link>
              </div>
              <DiscussionStatusBadge status={d.status} />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
              <span>By {d.author.name}</span>
              <div className="flex items-center gap-3">
                <span>{d.postsCount} replies</span>
                <span>{d.viewsCount} views</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Link
                href={`/admin/community/discussions/${d.id}`}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-gray-200 text-gray-700"
              >
                Inspect
              </Link>
              <button
                type="button"
                onClick={() => onTogglePin(d.id)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600"
              >
                {d.isPinned ? "Unpin" : "Pin"}
              </button>
              <button
                type="button"
                onClick={() => onToggleLock(d.id)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600"
              >
                {d.isLocked ? "Unlock" : "Lock"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
