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
} from "lucide-react";
import { RoleCategory, RoleStatus } from "../types/admin-role";
import {
  PERMISSION_GROUPS,
  PERMISSION_ITEMS,
} from "../data/admin-permissions-data";
import { DEMO_ADMIN_ROLES } from "../data/admin-roles-data";
import { PermissionRiskBadge } from "./role-status-badge";

export function RoleCreateForm() {
  const router = useRouter();

  // Basic info state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<RoleCategory>("CUSTOM");
  const [status, setStatus] = useState<RoleStatus>("ACTIVE");
  const [description, setDescription] = useState("");

  // Permissions selection state
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [permSearch, setPermSearch] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // Form submission & validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    setSlug(autoSlug);
  };

  // Toggle single permission key
  const handleToggleKey = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Select all in group
  const handleSelectAllInGroup = (groupId: string) => {
    const groupKeys = PERMISSION_ITEMS.filter((p) => p.groupId === groupId).map((p) => p.key);
    setSelectedKeys((prev) => Array.from(new Set([...prev, ...groupKeys])));
  };

  // Clear all in group
  const handleClearAllInGroup = (groupId: string) => {
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
    if (!slug.trim()) {
      newErrors.slug = "Role slug identifier is required.";
    } else if (!/^[a-z0-9-]+$/.test(slug)) {
      newErrors.slug = "Slug must contain only lowercase alphanumeric characters and hyphens.";
    } else if (DEMO_ADMIN_ROLES.some((r) => r.slug.toLowerCase() === slug.toLowerCase())) {
      newErrors.slug = "A role with this slug identifier already exists in the registry.";
    }
    if (!description.trim()) {
      newErrors.description = "Role description is required.";
    }
    if (selectedKeys.length === 0) {
      newErrors.permissions = "At least one permission must be assigned to this custom role.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/roles"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Roles
        </Link>
        <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-[#5B46F6] font-medium border border-indigo-100 dark:border-indigo-900/60 font-mono">
          Custom Role Authoring
        </span>
      </div>

      {/* Title & description card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-[#5B46F6]">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create Custom Role
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Define a new administrative profile with tailored capabilities across BDSisters.org systems.
            </p>
          </div>
        </div>

        {/* Frontend Demo Banner */}
        <div className="mt-5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-3">
          <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <p className="font-semibold">Frontend Simulation Mode</p>
            <p className="mt-0.5 text-amber-800/90 dark:text-amber-400/90">
              Custom roles created here operate in the client-side state for interface validation. Server-side role persistence and authorization enforcement will be implemented in the backend phase.
            </p>
          </div>
        </div>
      </div>

      {/* Success View */}
      {isSuccess ? (
        <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-800 shadow-sm text-center space-y-4">
          <div className="inline-flex p-3 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Custom Role Created Successfully!
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-md mx-auto">
              Custom role <span className="font-semibold text-gray-900 dark:text-white">{name}</span> (<span className="font-mono text-xs">{slug}</span>) has been provisioned with{" "}
              <strong className="text-[#5B46F6]">{selectedKeys.length} active permissions</strong>.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setIsSuccess(false);
                setName("");
                setSlug("");
                setDescription("");
                setSelectedKeys([]);
              }}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Author Another Role
            </button>
            <button
              onClick={() => router.push("/admin/roles")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#5B46F6] text-white hover:bg-[#4a36e2] transition shadow-xs"
            >
              Return to Roles Directory
            </button>
          </div>
        </div>
      ) : (
        /* Form Content */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Information */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#5B46F6]" />
              Basic Role Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Role Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Role Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g. Regional Divisional Coordinator"
                  className={`w-full text-sm rounded-xl border p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden transition ${
                    errors.name ? "border-rose-500" : "border-gray-200 dark:border-gray-700 focus:border-[#5B46F6]"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Role Slug */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Role Slug / System ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="e.g. regional-divisional-coordinator"
                  className={`w-full font-mono text-sm rounded-xl border p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden transition ${
                    errors.slug ? "border-rose-500" : "border-gray-200 dark:border-gray-700 focus:border-[#5B46F6]"
                  }`}
                />
                {errors.slug && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.slug}
                  </p>
                )}
              </div>

              {/* Role Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Role Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as RoleCategory)}
                  className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden focus:border-[#5B46F6]"
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
                  Initial Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as RoleStatus)}
                  className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden focus:border-[#5B46F6]"
                >
                  <option value="ACTIVE">Active (Available for Assignment)</option>
                  <option value="INACTIVE">Inactive (Draft / Staged)</option>
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the functional remit, target staff personas, and operational boundaries of this custom role..."
                className={`w-full text-sm rounded-xl border p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden transition placeholder-gray-400 ${
                  errors.description ? "border-rose-500" : "border-gray-200 dark:border-gray-700 focus:border-[#5B46F6]"
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Section 2: Permission Assignment Matrix */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#5B46F6]" />
                  Permission Assignment Matrix
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Select granular operational capabilities to bundle into this role profile.
                </p>
              </div>

              {/* Selected Count Indicator */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-[#5B46F6] border border-indigo-100 dark:border-indigo-900/60 font-mono">
                  {selectedKeys.length} of {PERMISSION_ITEMS.length} Selected
                </span>
              </div>
            </div>

            {/* Error if no permissions selected */}
            {errors.permissions && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.permissions}</span>
              </div>
            )}

            {/* Quick search input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={permSearch}
                onChange={(e) => setPermSearch(e.target.value)}
                placeholder="Filter permissions by keyword (e.g. member, refund, approve)..."
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 pl-10 pr-4 py-2.5 text-xs font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-[#5B46F6] focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden"
              />
            </div>

            {/* Permission Groups Accordion / List */}
            <div className="space-y-4 pt-2">
              {filteredGroupsWithItems.map(({ group, items }) => {
                const groupSelectedCount = items.filter((item) =>
                  selectedKeys.includes(item.key)
                ).length;
                const isGroupFullySelected = groupSelectedCount === items.length && items.length > 0;
                const isCollapsed = collapsedGroups[group.id] ?? false;

                return (
                  <div
                    key={group.id}
                    className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/30 overflow-hidden"
                  >
                    {/* Group Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gray-50/70 dark:bg-gray-800/60 border-b border-gray-200/60 dark:border-gray-700/60">
                      <div
                        onClick={() => toggleGroupCollapse(group.id)}
                        className="flex items-center gap-3 cursor-pointer flex-1"
                      >
                        <span className="font-bold text-xs text-gray-900 dark:text-white">
                          {group.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">
                          {groupSelectedCount} / {items.length} active
                        </span>
                      </div>

                      {/* Group Quick Select / Clear Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectAllInGroup(group.id)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#5B46F6] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
                        >
                          Select All
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          type="button"
                          onClick={() => handleClearAllInGroup(group.id)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    {/* Group Permissions List */}
                    {!isCollapsed && (
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {items.map((perm) => {
                          const isChecked = selectedKeys.includes(perm.key);
                          return (
                            <div
                              key={perm.key}
                              onClick={() => handleToggleKey(perm.key)}
                              className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                                isChecked
                                  ? "bg-indigo-50/40 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900/60"
                                  : "bg-white dark:bg-gray-900 border-gray-200/70 dark:border-gray-800 hover:border-gray-300"
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
              href="/admin/roles"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#5B46F6] text-white hover:bg-[#4a36e2] transition shadow-xs focus:ring-2 focus:ring-[#5B46F6] focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? "Provisioning Role..." : "Create Custom Role"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
