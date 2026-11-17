"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Search,
  CheckSquare,
  Square,
  Layers,
  Sparkles,
  Info,
  Lock,
  Save,
} from "lucide-react";
import { AdminRoleDetail, RoleCategory, RoleStatus } from "../types/admin-role";
import {
  PERMISSION_GROUPS,
  PERMISSION_ITEMS,
} from "../data/admin-permissions-data";
import { PermissionRiskBadge, RoleTypeBadge } from "./role-status-badge";

interface RoleEditFormProps {
  role: AdminRoleDetail;
}

export function RoleEditForm({ role }: RoleEditFormProps) {
  const router = useRouter();

  const isProtected = role.isProtected || role.type === "BUILT_IN";

  // Editable fields for custom roles
  const [name, setName] = useState(role.name);
  const [category, setCategory] = useState<RoleCategory>(role.category);
  const [status, setStatus] = useState<RoleStatus>(role.status);
  const [description, setDescription] = useState(role.description);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(role.permissionKeys || []);

  const [permSearch, setPermSearch] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Toggle single permission key
  const handleToggleKey = (key: string) => {
    if (isProtected) return;
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Select all in group
  const handleSelectAllInGroup = (groupId: string) => {
    if (isProtected) return;
    const groupKeys = PERMISSION_ITEMS.filter((p) => p.groupId === groupId).map((p) => p.key);
    setSelectedKeys((prev) => Array.from(new Set([...prev, ...groupKeys])));
  };

  // Clear all in group
  const handleClearAllInGroup = (groupId: string) => {
    if (isProtected) return;
    const groupKeys = PERMISSION_ITEMS.filter((p) => p.groupId === groupId).map((p) => p.key);
    setSelectedKeys((prev) => prev.filter((k) => !groupKeys.includes(k)));
  };

  // Toggle group accordion
  const toggleGroupCollapse = (groupId: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Filter permissions based on search
  const filteredGroupsWithItems = useMemo(() => {
    const q = permSearch.toLowerCase().trim();
    return PERMISSION_GROUPS.map((group) => {
      const items = PERMISSION_ITEMS.filter((item) => {
        if (item.groupId !== group.id) return false;
        if (!q) return true;
        return (
          item.name.toLowerCase().includes(q) ||
          item.key.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
        );
      });
      return { group, items };
    }).filter(({ items }) => items.length > 0);
  }, [permSearch]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = "Role name is required.";
    }
    if (!description.trim()) {
      newErrors.description = "Role description is required.";
    }
    if (selectedKeys.length === 0) {
      newErrors.permissions = "At least one permission must be assigned to this role.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProtected) return;
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(
        `Role "${name}" updated with ${selectedKeys.length} permissions (Frontend Simulation).`
      );
      setTimeout(() => {
        router.push(`/admin/roles/${role.slug || role.id}`);
      }, 1500);
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={`/admin/roles/${role.slug || role.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Role Details
        </Link>
        <div className="flex items-center gap-2">
          <RoleTypeBadge type={role.type} />
          <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 font-mono text-gray-600 dark:text-gray-300">
            {role.slug}
          </span>
        </div>
      </div>

      {/* Header card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-[#5B46F6]">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Role: {role.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {isProtected
                ? "This is a built-in platform role. Definitions are protected by system security rules."
                : "Modify permissions matrix and descriptive metadata for this custom administrative profile."}
            </p>
          </div>
        </div>

        {/* Protected Notice if Built-in */}
        {isProtected ? (
          <div className="mt-5 p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 text-xs text-purple-900 dark:text-purple-300 flex items-start gap-3">
            <Lock className="w-5 h-5 shrink-0 text-[#5B46F6] mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-sm">Protected System Role Definition</p>
              <p className="leading-relaxed">
                The capabilities for <strong className="font-semibold">&ldquo;{role.name}&rdquo;</strong> are hardcoded system boundaries within BDSisters.org security contracts. Form modifications are disabled. To grant different privileges, clone this role or create a custom role profile.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-3">
            <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <p className="font-semibold">Frontend Simulation Mode</p>
              <p className="mt-0.5 text-amber-800/90 dark:text-amber-400/90">
                Changes saved here will update the local demonstration view. In the backend phase, permission modifications will update relational access control tables.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <p className="text-sm font-medium">{successMessage}</p>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#5B46F6]" />
            Role Metadata
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Role Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Role Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={isProtected}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full text-sm rounded-xl border p-3 outline-hidden transition ${
                  isProtected
                    ? "bg-gray-50 dark:bg-gray-800/50 text-gray-500 cursor-not-allowed border-gray-200 dark:border-gray-700"
                    : errors.name
                    ? "border-rose-500 bg-white dark:bg-gray-800"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#5B46F6]"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                </p>
              )}
            </div>

            {/* Role Slug (Immutable) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Role Slug / System ID (Immutable)
              </label>
              <input
                type="text"
                disabled
                value={role.slug}
                className="w-full font-mono text-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Role Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Role Category
              </label>
              <select
                disabled={isProtected}
                value={category}
                onChange={(e) => setCategory(e.target.value as RoleCategory)}
                className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden focus:border-[#5B46F6] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                <option value="PLATFORM">Platform Operations</option>
                <option value="COMMUNITY">Community & Moderation</option>
                <option value="COMMERCE">Commerce & Products</option>
                <option value="FINANCE">Financial Governance</option>
                <option value="SYSTEM">System & Security</option>
                <option value="CUSTOM">Custom Slices</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                disabled={isProtected}
                value={status}
                onChange={(e) => setStatus(e.target.value as RoleStatus)}
                className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden focus:border-[#5B46F6] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                <option value="ACTIVE">Active (Available for Assignment)</option>
                <option value="INACTIVE">Inactive (Suspended)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Description & Purpose <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              disabled={isProtected}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full text-sm rounded-xl border p-3 outline-hidden transition ${
                isProtected
                  ? "bg-gray-50 dark:bg-gray-800/50 text-gray-500 cursor-not-allowed border-gray-200 dark:border-gray-700"
                  : errors.description
                  ? "border-rose-500 bg-white dark:bg-gray-800"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#5B46F6]"
              }`}
            />
          </div>
        </div>

        {/* Section 2: Permission Assignment Matrix */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#5B46F6]" />
                Assigned Permissions
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {isProtected
                  ? "Read-only view of capabilities bundled into this built-in role."
                  : "Toggle specific capabilities to grant or revoke operational privileges."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-[#5B46F6] border border-indigo-100 dark:border-indigo-900/60 font-mono">
                {selectedKeys.length} of {PERMISSION_ITEMS.length} Enabled
              </span>
            </div>
          </div>

          {/* Quick search input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={permSearch}
              onChange={(e) => setPermSearch(e.target.value)}
              placeholder="Search assigned permissions..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 pl-10 pr-4 py-2.5 text-xs font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-[#5B46F6] focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden"
            />
          </div>

          {/* Groups List */}
          <div className="space-y-4 pt-2">
            {filteredGroupsWithItems.map(({ group, items }) => {
              const groupSelectedCount = items.filter((item) =>
                selectedKeys.includes(item.key)
              ).length;
              const isCollapsed = collapsedGroups[group.id] ?? false;

              return (
                <div
                  key={group.id}
                  className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/30 overflow-hidden"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gray-50/70 dark:bg-gray-800/60 border-b border-gray-200/60 dark:border-gray-700/60">
                    <div
                      onClick={() => toggleGroupCollapse(group.id)}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <span className="font-bold text-xs text-gray-900 dark:text-white">
                        {group.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">
                        {groupSelectedCount} / {items.length} enabled
                      </span>
                    </div>

                    {!isProtected && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectAllInGroup(group.id)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#5B46F6] hover:bg-indigo-50 transition"
                        >
                          Select All
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          type="button"
                          onClick={() => handleClearAllInGroup(group.id)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  {!isCollapsed && (
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {items.map((perm) => {
                        const isChecked = selectedKeys.includes(perm.key);
                        return (
                          <div
                            key={perm.key}
                            onClick={() => handleToggleKey(perm.key)}
                            className={`p-3 rounded-xl border transition flex items-start gap-3 ${
                              isProtected
                                ? isChecked
                                  ? "bg-purple-50/40 border-purple-200 dark:bg-purple-950/20"
                                  : "bg-gray-50/50 border-gray-200/50 opacity-60"
                                : isChecked
                                ? "bg-indigo-50/40 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900/60 cursor-pointer"
                                : "bg-white dark:bg-gray-900 border-gray-200/70 dark:border-gray-800 hover:border-gray-300 cursor-pointer"
                            }`}
                          >
                            <div className="pt-0.5 text-[#5B46F6]">
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4" />
                              ) : (
                                <Square className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-xs text-gray-900 dark:text-white">
                                  {perm.name}
                                </span>
                                <PermissionRiskBadge level={perm.riskLevel} />
                              </div>
                              <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 block">
                                {perm.key}
                              </span>
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                                {perm.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href={`/admin/roles/${role.slug || role.id}`}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            {isProtected ? "Return to Details" : "Cancel"}
          </Link>
          {!isProtected && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#5B46F6] text-white hover:bg-[#4a36e2] transition shadow-xs focus:ring-2 focus:ring-[#5B46F6] focus:ring-offset-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Saving..." : "Save Role Changes"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
