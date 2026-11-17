"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  KeyRound,
} from "lucide-react";
import { PermissionItem, PermissionRiskLevel } from "@/features/admin/roles/types/admin-role";
import { PERMISSION_GROUPS } from "@/features/admin/roles/data/admin-permissions-data";
import { DEMO_ADMIN_ROLES } from "@/features/admin/roles/data/admin-roles-data";
import { PermissionRiskBadge } from "@/features/admin/roles/components/role-status-badge";

interface PermissionTableProps {
  permissions: PermissionItem[];
}

export function PermissionTable({ permissions }: PermissionTableProps) {
  const [query, setQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("ALL");
  const [selectedRisk, setSelectedRisk] = useState<"ALL" | PermissionRiskLevel>("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const filteredPermissions = useMemo(() => {
    return permissions.filter((perm) => {
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesName = perm.name.toLowerCase().includes(q);
        const matchesKey = perm.key.toLowerCase().includes(q);
        const matchesDesc = perm.description.toLowerCase().includes(q);
        const matchesGroup = perm.groupName.toLowerCase().includes(q);
        if (!matchesName && !matchesKey && !matchesDesc && !matchesGroup) return false;
      }

      if (selectedGroup !== "ALL" && perm.groupId !== selectedGroup) {
        return false;
      }

      if (selectedRisk !== "ALL" && perm.riskLevel !== selectedRisk) {
        return false;
      }

      return true;
    });
  }, [permissions, query, selectedGroup, selectedRisk]);

  const totalPages = Math.max(1, Math.ceil(filteredPermissions.length / pageSize));
  const paginatedList = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredPermissions.slice(start, start + pageSize);
  }, [filteredPermissions, page, pageSize]);

  const handleReset = () => {
    setQuery("");
    setSelectedGroup("ALL");
    setSelectedRisk("ALL");
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by permission name, key (e.g. members.view)..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 pl-10 pr-4 py-2 text-xs font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-[#5B46F6] focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden"
            />
          </div>

          {/* Quick links to Permission Groups view */}
          <div className="flex items-center gap-2">
            <Link
              href="/admin/permissions/groups"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Inspect 15 Domains</span>
            </Link>
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-wrap items-center gap-2">
            {/* Domain Group Filter */}
            <select
              value={selectedGroup}
              onChange={(e) => {
                setSelectedGroup(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 focus:border-[#5B46F6] focus:outline-hidden"
            >
              <option value="ALL">All 15 Domains</option>
              {PERMISSION_GROUPS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>

            {/* Risk Level Filter */}
            <select
              value={selectedRisk}
              onChange={(e) => {
                setSelectedRisk(e.target.value as "ALL" | PermissionRiskLevel);
                setPage(1);
              }}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 focus:border-[#5B46F6] focus:outline-hidden"
            >
              <option value="ALL">Risk: All Levels</option>
              <option value="STANDARD">Standard</option>
              <option value="SENSITIVE">Sensitive</option>
              <option value="CRITICAL">Critical</option>
            </select>

            {(query || selectedGroup !== "ALL" || selectedRisk !== "ALL") && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            )}
          </div>

          <span className="text-[11px] text-gray-500">
            Showing <strong className="text-gray-900 dark:text-white font-mono">{filteredPermissions.length}</strong> capabilities
          </span>
        </div>
      </div>

      {/* Permissions Table */}
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 dark:bg-gray-800/60 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="py-3 px-4">Capability Name & Scope</th>
                <th className="py-3 px-4">Permission Key</th>
                <th className="py-3 px-4">Functional Domain</th>
                <th className="py-3 px-4">Risk Severity</th>
                <th className="py-3 px-4">Assigned Roles (Demo)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80 text-gray-700 dark:text-gray-200">
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500">
                    <KeyRound className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                    No permissions match your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedList.map((perm) => {
                  const assignedRoles = DEMO_ADMIN_ROLES.filter((r) =>
                    r.permissionKeys.includes(perm.key)
                  );

                  return (
                    <tr
                      key={perm.id}
                      className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition group"
                    >
                      {/* Name & description */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-bold text-gray-900 dark:text-white block">
                            {perm.name}
                          </span>
                          <p className="text-[11px] text-gray-500 line-clamp-1 max-w-sm mt-0.5">
                            {perm.description}
                          </p>
                        </div>
                      </td>

                      {/* Key */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/60">
                          {perm.key}
                        </span>
                      </td>

                      {/* Group */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {perm.groupName}
                        </span>
                      </td>

                      {/* Risk */}
                      <td className="py-3.5 px-4">
                        <PermissionRiskBadge level={perm.riskLevel} />
                      </td>

                      {/* Assigned Roles */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap items-center gap-1 max-w-xs">
                          {assignedRoles.length === 0 ? (
                            <span className="text-[11px] text-gray-400 italic">Unassigned</span>
                          ) : (
                            assignedRoles.slice(0, 3).map((r) => (
                              <Link
                                key={r.slug}
                                href={`/admin/roles/${r.slug}`}
                                className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition"
                              >
                                {r.name}
                              </Link>
                            ))
                          )}
                          {assignedRoles.length > 3 && (
                            <span className="text-[10px] font-bold text-gray-400">
                              +{assignedRoles.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-200"
            >
              <option value={15}>15</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span>
              Page <strong className="text-gray-900 dark:text-white">{page}</strong> of{" "}
              <strong className="text-gray-900 dark:text-white">{totalPages}</strong>
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
