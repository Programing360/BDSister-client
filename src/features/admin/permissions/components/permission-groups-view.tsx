"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Search,
  ChevronDown,
  ChevronUp,
  KeyRound,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Users,
} from "lucide-react";
import {
  PERMISSION_GROUPS,
  PERMISSION_ITEMS,
  DEMO_PERMISSIONS_DISCLAIMER,
} from "@/features/admin/roles/data/admin-permissions-data";
import { DEMO_ADMIN_ROLES } from "@/features/admin/roles/data/admin-roles-data";
import { PermissionRiskBadge, RoleCategoryBadge } from "@/features/admin/roles/components/role-status-badge";

export function PermissionGroupsView() {
  const [search, setSearch] = useState("");
  const [expandedGroupIds, setExpandedGroupIds] = useState<Record<string, boolean>>({
    dashboard: true,
    members: true,
  });

  const toggleGroup = (id: string) => {
    setExpandedGroupIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    PERMISSION_GROUPS.forEach((g) => (allExpanded[g.id] = true));
    setExpandedGroupIds(allExpanded);
  };

  const collapseAll = () => {
    setExpandedGroupIds({});
  };

  const filteredGroups = PERMISSION_GROUPS.filter((group) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const matchesGroupName = group.name.toLowerCase().includes(q);
    const matchesGroupDesc = group.description.toLowerCase().includes(q);
    const hasMatchingPermission = PERMISSION_ITEMS.some(
      (p) =>
        p.groupId === group.id &&
        (p.name.toLowerCase().includes(q) || p.key.toLowerCase().includes(q))
    );
    return matchesGroupName || matchesGroupDesc || hasMatchingPermission;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200/80 dark:border-gray-800 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-[#111827] dark:text-white sm:text-3xl">
              Permission Groups & Domains
            </h1>
            <span className="rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900/60 px-3 py-0.5 text-xs font-bold text-[#5B46F6]">
              15 System Domains
            </span>
          </div>
          <p className="mt-1 text-xs text-[#4B5563] dark:text-gray-400">
            Organized functional domains grouping 72 fine-grained security rights across BDSisters.org.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/permissions"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Flat Permissions Table</span>
          </Link>

          <Link
            href="/admin/roles/create"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#5B46F6] text-white hover:bg-[#4a36e2] transition shadow-xs"
          >
            <KeyRound className="w-4 h-4" />
            <span>Author Custom Role</span>
          </Link>
        </div>
      </div>

      {/* Demo Disclaimer Banner */}
      <div className="rounded-2xl border border-purple-200/70 bg-purple-50/60 dark:bg-purple-950/20 dark:border-purple-900/40 p-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#5B46F6] text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#5B46F6] uppercase tracking-wider">
                System Capability Boundaries
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#4B5563] dark:text-gray-300">
              {DEMO_PERMISSIONS_DISCLAIMER}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Expand/Collapse Toolbar */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search domains or capabilities (e.g. member, payout)..."
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 pl-10 pr-4 py-2 text-xs font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-[#5B46F6] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={expandAll}
            className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Groups Grid / Cards */}
      <div className="space-y-4">
        {filteredGroups.map((group) => {
          const groupPermissions = PERMISSION_ITEMS.filter((p) => p.groupId === group.id);
          const isExpanded = expandedGroupIds[group.id] ?? false;

          // Find roles utilizing at least one permission in this group
          const rolesUsingGroup = DEMO_ADMIN_ROLES.filter((r) =>
            r.permissionKeys.some((k) => groupPermissions.some((gp) => gp.key === k))
          );

          return (
            <div
              key={group.id}
              className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xs overflow-hidden transition"
            >
              {/* Group Header Card */}
              <div
                onClick={() => toggleGroup(group.id)}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 cursor-pointer hover:bg-gray-50/60 dark:hover:bg-gray-800/40 gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-[#5B46F6] shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-base font-bold text-gray-900 dark:text-white">
                        {group.name}
                      </h2>
                      <RoleCategoryBadge category={group.category} />
                      <span className="font-mono text-[10px] text-gray-400">({group.id})</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
                      {group.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-900 dark:text-white block font-mono">
                      {groupPermissions.length} Capabilities
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Used by {rolesUsingGroup.length} roles
                    </span>
                  </div>

                  <div className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Permissions Content */}
              {isExpanded && (
                <div className="border-t border-gray-100 dark:border-gray-800 p-5 bg-gray-50/40 dark:bg-gray-800/30 space-y-4">
                  {/* Roles using this group */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-gray-500 flex items-center gap-1 font-medium">
                      <Users className="w-3.5 h-3.5" /> Associated Roles:
                    </span>
                    {rolesUsingGroup.map((r) => (
                      <Link
                        key={r.slug}
                        href={`/admin/roles/${r.slug}`}
                        className="px-2 py-0.5 rounded-md font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-[#5B46F6] text-[11px] transition"
                      >
                        {r.name}
                      </Link>
                    ))}
                  </div>

                  {/* Individual permissions grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {groupPermissions.map((perm) => (
                      <div
                        key={perm.key}
                        className="p-3.5 rounded-xl border border-gray-200/80 dark:border-gray-700/60 bg-white dark:bg-gray-900 space-y-1.5"
                      >
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
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
