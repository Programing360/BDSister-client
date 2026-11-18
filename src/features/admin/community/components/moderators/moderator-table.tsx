"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  Eye,
  Edit,
  Power,
  Shield,
  Trash2,
} from "lucide-react";
import { CommunityModerator } from "../../types/community";
import { ModeratorStatusBadge } from "../common/community-status-badge";

interface ModeratorTableProps {
  moderators: CommunityModerator[];
  onEdit: (mod: CommunityModerator) => void;
  onToggleStatus: (id: string) => void;
  onRemove: (id: string) => void;
}

export function ModeratorTable({
  moderators,
  onEdit,
  onToggleStatus,
  onRemove,
}: ModeratorTableProps) {
  if (moderators.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-md">
        <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-gray-800">No community moderators found</h3>
        <p className="text-xs text-gray-500 mt-1">Assign verified community members to start moderating discussions.</p>
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
              <th className="py-3.5 px-4 min-w-[220px]">Moderator Profile</th>
              <th className="py-3.5 px-4 min-w-[240px]">Assigned Categories</th>
              <th className="py-3.5 px-4 text-center">30d Actions</th>
              <th className="py-3.5 px-4 text-center">Pending Queue Load</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4">Assigned On</th>
              <th className="py-3.5 px-4 text-right min-w-[160px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {moderators.map((m) => (
              <tr key={m.id} className="hover:bg-purple-50/20 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    {m.member.avatarUrl ? (
                      <img
                        src={m.member.avatarUrl}
                        alt={m.member.name}
                        className="w-8 h-8 rounded-full object-cover border border-purple-200 shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {m.member.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <Link
                        href={`/admin/community/moderators/${m.id}`}
                        className="font-bold text-gray-900 hover:text-purple-600 block truncate transition-colors"
                      >
                        {m.member.name}
                      </Link>
                      <span className="text-[11px] text-gray-400">@{m.member.username}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {m.assignedCategoryNames.map((name, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-100"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center font-bold text-gray-900">
                  {m.actionsCountLast30Days}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                      m.pendingQueueLoad > 0
                        ? "bg-amber-100 text-amber-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {m.pendingQueueLoad} items
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <ModeratorStatusBadge status={m.moderatorStatus} />
                </td>
                <td className="py-3.5 px-4 text-gray-500">
                  {new Date(m.assignedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/admin/community/moderators/${m.id}`}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all"
                      title="Inspect Activity"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onEdit(m)}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all"
                      title="Edit Assignment"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleStatus(m.id)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        m.moderatorStatus === "ACTIVE"
                          ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                          : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      }`}
                      title={m.moderatorStatus === "ACTIVE" ? "Pause Duty" : "Activate"}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(m.id)}
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-all"
                      title="Remove Assignment"
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
        {moderators.map((m) => (
          <div
            key={m.id}
            className="p-4 rounded-xl border border-gray-100 bg-white shadow-md space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                  {m.member.name.charAt(0)}
                </div>
                <div>
                  <Link
                    href={`/admin/community/moderators/${m.id}`}
                    className="font-bold text-sm text-gray-900 block"
                  >
                    {m.member.name}
                  </Link>
                  <span className="text-xs text-gray-400">@{m.member.username}</span>
                </div>
              </div>
              <ModeratorStatusBadge status={m.moderatorStatus} />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {m.assignedCategoryNames.map((name, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700"
                >
                  {name}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
              <span>{m.actionsCountLast30Days} actions (30d)</span>
              <button
                type="button"
                onClick={() => onEdit(m)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-gray-200 text-gray-700"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
