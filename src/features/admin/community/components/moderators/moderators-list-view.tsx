"use client";

import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  CheckCircle,
  Shield,
  Info,
} from "lucide-react";
import { DEMO_COMMUNITY_MODERATORS } from "../../data/mock-community";
import { CommunityModerator } from "../../types/community";
import { ModeratorTable } from "./moderator-table";
import { ModeratorAssignModal } from "./moderator-assign-modal";

export function ModeratorsListView() {
  const [moderators, setModerators] = useState<CommunityModerator[]>(
    DEMO_COMMUNITY_MODERATORS
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMod, setEditingMod] = useState<CommunityModerator | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAssignOrUpdate = (data: Partial<CommunityModerator>) => {
    if (editingMod) {
      setModerators((prev) =>
        prev.map((m) => (m.id === editingMod.id ? ({ ...m, ...data } as CommunityModerator) : m))
      );
      showToast(`Moderator assignment for "${data.member?.name}" updated (DEMO ONLY).`);
    } else {
      setModerators((prev) => [data as CommunityModerator, ...prev]);
      showToast(`"${data.member?.name}" assigned as Community Moderator (DEMO ONLY).`);
    }
    setEditingMod(null);
  };

  const handleToggleStatus = (id: string) => {
    setModerators((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const next = m.moderatorStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
          showToast(`Moderator status changed to ${next} (DEMO ONLY).`);
          return { ...m, moderatorStatus: next };
        }
        return m;
      })
    );
  };

  const handleRemove = (id: string) => {
    setModerators((prev) => prev.filter((m) => m.id !== id));
    showToast(`Moderator assignment revoked (DEMO ONLY).`);
  };

  const filtered = moderators.filter((m) => {
    const matchesSearch =
      m.member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || m.moderatorStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-purple-500/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-gray-900">
              Community Moderator Management
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Delegate forum category jurisdictions, review queue workloads, and monitor moderator conduct.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingMod(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-500/20 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Assign Moderator
        </button>
      </div>

      {/* RBAC Clarification Banner */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-medium">
        <Shield className="w-4 h-4 text-purple-600 shrink-0" />
        <p>
          <strong className="font-semibold">ROLE ISOLATION GUARANTEE</strong> — Community moderator designations do not alter underlying Better Auth user account roles or administrative platform permissions from Step 4.
        </p>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search moderators by name or email..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white font-medium text-gray-700 focus:border-purple-500 outline-none"
        >
          <option value="ALL">All Statuses ({moderators.length})</option>
          <option value="ACTIVE">Active Duty</option>
          <option value="INACTIVE">Inactive / On Leave</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {/* Table */}
      <ModeratorTable
        moderators={filtered}
        onEdit={(m) => {
          setEditingMod(m);
          setModalOpen(true);
        }}
        onToggleStatus={handleToggleStatus}
        onRemove={handleRemove}
      />

      {/* Assign / Edit Modal */}
      <ModeratorAssignModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAssign={handleAssignOrUpdate}
        editingModerator={editingMod}
      />
    </div>
  );
}
