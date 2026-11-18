"use client";

import React, { useState } from "react";
import {
  X,
  UserCheck,
  Shield,
  Save,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { CommunityModerator } from "../../types/community";
import { DEMO_COMMUNITY_CATEGORIES } from "../../data/mock-community";

interface ModeratorAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (data: Partial<CommunityModerator>) => void;
  editingModerator?: CommunityModerator | null;
}

export function ModeratorAssignModal({
  isOpen,
  onClose,
  onAssign,
  editingModerator,
}: ModeratorAssignModalProps) {
  const [name, setName] = useState(editingModerator?.member.name || "");
  const [email, setEmail] = useState(editingModerator?.member.email || "");
  const [username, setUsername] = useState(editingModerator?.member.username || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    editingModerator?.assignedCategoryIds || (DEMO_COMMUNITY_CATEGORIES[0]?.id ? [DEMO_COMMUNITY_CATEGORIES[0].id] : [])
  );
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE" | "SUSPENDED">(
    editingModerator?.moderatorStatus || "ACTIVE"
  );

  if (!isOpen) return null;

  const handleCategoryToggle = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || selectedCategories.length === 0) return;

    const categoryNames = selectedCategories
      .map((id) => DEMO_COMMUNITY_CATEGORIES.find((c) => c.id === id)?.name || "")
      .filter(Boolean);

    onAssign({
      id: editingModerator?.id || `mod-usr-${Date.now()}`,
      member: {
        id: editingModerator?.member.id || `usr-${Date.now()}`,
        name,
        email: email || `${username}@bdsisters.org`,
        username: username || name.toLowerCase().replace(/\s+/g, "_"),
        memberRole: editingModerator?.member.memberRole || "SISTER_ENTREPRENEUR",
        joinDate: editingModerator?.member.joinDate || "2025-01-01",
      },
      assignedCategoryIds: selectedCategories,
      assignedCategoryNames: categoryNames,
      moderatorStatus: status,
      assignedAt: editingModerator?.assignedAt || new Date().toISOString(),
      assignedBy: "Admin Superuser",
      actionsCountLast30Days: editingModerator?.actionsCountLast30Days || 0,
      pendingQueueLoad: editingModerator?.pendingQueueLoad || 0,
      recentActivity: editingModerator?.recentActivity || [
        {
          action: "ASSIGNED_AS_MODERATOR",
          target: "Community categories",
          timestamp: new Date().toISOString(),
        },
      ],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {editingModerator ? "Edit Moderator Assignment" : "Assign Community Moderator"}
              </h3>
              <p className="text-xs text-gray-500">
                Delegate discussion & comment review capabilities over specific categories.
              </p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* RBAC Boundary Note */}
          <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/60 text-xs text-purple-950 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Strict Role Separation:</strong> Community moderator assignment grants forum queue review permissions only. It does NOT alter Better Auth user privileges or Step 4 System Admin Roles.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Member Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Nusrat Jahan"
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. nusrat_lead"
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-purple-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. nusrat@bdsisters.org"
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-purple-500 outline-none"
            />
          </div>

          {/* Category Assignment Checklist */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Assigned Community Categories <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto p-1">
              {DEMO_COMMUNITY_CATEGORIES.map((cat) => {
                const checked = selectedCategories.includes(cat.id);
                return (
                  <label
                    key={cat.id}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      checked
                        ? "border-purple-500 bg-purple-50/70 text-purple-900 font-semibold"
                        : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCategoryToggle(cat.id)}
                      className="rounded text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
                    />
                    <span className="truncate">{cat.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Moderator Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "ACTIVE" | "INACTIVE" | "SUSPENDED")}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:border-purple-500 outline-none"
            >
              <option value="ACTIVE">Active Duty</option>
              <option value="INACTIVE">Inactive / On Leave</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] text-gray-400">
              Simulation only • Updates local client state.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-500/20"
              >
                <Save className="w-3.5 h-3.5" />
                {editingModerator ? "Save Assignment" : "Assign Moderator"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
