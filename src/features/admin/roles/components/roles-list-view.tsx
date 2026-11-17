"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  KeyRound,
  RefreshCw,
  Sparkles,
  Plus,
} from "lucide-react";
import { RoleKpiCards } from "./role-kpi-cards";
import { RoleTableToolbar } from "./role-table-toolbar";
import { RoleTable } from "./role-table";
import { RoleDeleteDialog } from "./role-delete-dialog";
import { RoleDuplicateDialog } from "./role-duplicate-dialog";
import {
  DEMO_ADMIN_ROLES,
  DEMO_ROLE_KPIS,
  DEMO_ROLE_DISCLAIMER,
} from "../data/admin-roles-data";
import {
  AdminRoleDetail,
  RoleFilterState,
  RoleType,
} from "../types/admin-role";

export function RolesListView() {
  const [roles, setRoles] = useState<AdminRoleDetail[]>(DEMO_ADMIN_ROLES);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Modal targets
  const [deleteTarget, setDeleteTarget] = useState<AdminRoleDetail | null>(null);
  const [duplicateTarget, setDuplicateTarget] = useState<AdminRoleDetail | null>(null);

  // Filters
  const [filters, setFilters] = useState<RoleFilterState>({
    query: "",
    typeFilter: "ALL",
    statusFilter: "ALL",
    categoryFilter: "ALL",
    sortBy: "name",
    sortOrder: "asc",
    page: 1,
    pageSize: 10,
  });

  const handleFilterChange = (updates: Partial<RoleFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      query: "",
      typeFilter: "ALL",
      statusFilter: "ALL",
      categoryFilter: "ALL",
      sortBy: "name",
      sortOrder: "asc",
      page: 1,
      pageSize: 10,
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setFeedbackToast("Role profiles refreshed from simulated catalog.");
      setTimeout(() => setFeedbackToast(null), 3000);
    }, 500);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter and sort roles
  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      if (filters.query.trim()) {
        const q = filters.query.toLowerCase();
        const matchesName = role.name.toLowerCase().includes(q);
        const matchesSlug = role.slug.toLowerCase().includes(q);
        const matchesDesc = role.description.toLowerCase().includes(q);
        if (!matchesName && !matchesSlug && !matchesDesc) return false;
      }

      if (filters.typeFilter !== "ALL" && role.type !== filters.typeFilter) {
        return false;
      }

      if (filters.statusFilter !== "ALL" && role.status !== filters.statusFilter) {
        return false;
      }

      if (filters.categoryFilter !== "ALL" && role.category !== filters.categoryFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const order = filters.sortOrder === "asc" ? 1 : -1;
      if (filters.sortBy === "name") {
        return a.name.localeCompare(b.name) * order;
      }
      if (filters.sortBy === "assignedMembersCount") {
        return (a.assignedMembersCount - b.assignedMembersCount) * order;
      }
      if (filters.sortBy === "permissionsCount") {
        return (a.permissionsCount - b.permissionsCount) * order;
      }
      if (filters.sortBy === "updatedAt") {
        return a.updatedAt.localeCompare(b.updatedAt) * order;
      }
      return 0;
    });
  }, [roles, filters]);

  // Paginated slice
  const totalPages = Math.max(1, Math.ceil(filteredRoles.length / filters.pageSize));
  const paginatedRoles = useMemo(() => {
    const start = (filters.page - 1) * filters.pageSize;
    return filteredRoles.slice(start, start + filters.pageSize);
  }, [filteredRoles, filters.page, filters.pageSize]);

  const handleToggleSelectAll = () => {
    const pageIds = paginatedRoles.map((r) => r.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  // Confirm delete custom role
  const handleConfirmDelete = (roleId: string) => {
    const target = roles.find((r) => r.id === roleId);
    if (!target) return;
    setRoles((prev) => prev.filter((r) => r.id !== roleId));
    setFeedbackToast(`Custom role "${target.name}" deleted from local demo state.`);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  // Confirm duplicate role
  const handleConfirmDuplicate = (cloned: {
    name: string;
    slug: string;
    description: string;
    permissionKeys: string[];
  }) => {
    const newRole: AdminRoleDetail = {
      id: `role_custom_${Date.now()}`,
      name: cloned.name,
      slug: cloned.slug,
      description: cloned.description,
      type: "CUSTOM",
      isProtected: false,
      status: "ACTIVE",
      category: "CUSTOM",
      assignedMembersCount: 0,
      permissionsCount: cloned.permissionKeys.length,
      permissionKeys: cloned.permissionKeys,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      createdBy: "Admin User (You)",
    };

    setRoles((prev) => [newRole, ...prev]);
    setFeedbackToast(`Role "${newRole.name}" created from template.`);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {feedbackToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 animate-in fade-in">
          {feedbackToast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200/80 dark:border-gray-800 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-[#111827] dark:text-white sm:text-3xl">
              Role & Access Governance
            </h1>
            <span className="rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900/60 px-3 py-0.5 text-xs font-bold text-[#5B46F6]">
              RBAC Matrix
            </span>
          </div>
          <p className="mt-1 text-xs text-[#4B5563] dark:text-gray-400">
            Define administrative capabilities, inspect built-in system safeguards, and oversee staff access roles.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/roles/create"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#5B46F6] text-white hover:bg-[#4a36e2] transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Custom Role</span>
          </Link>

          <button
            type="button"
            onClick={handleRefresh}
            title="Refresh roles registry"
            disabled={isRefreshing}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200/80 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 shadow-2xs hover:border-[#5B46F6]/40 hover:text-[#5B46F6] transition disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin text-[#5B46F6]" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Demonstration Disclaimer Banner */}
      <div className="rounded-2xl border border-purple-200/70 bg-purple-50/60 dark:bg-purple-950/20 dark:border-purple-900/40 p-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#5B46F6] text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#5B46F6] uppercase tracking-wider">
                Frontend Role Management Mode
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#4B5563] dark:text-gray-300">
              {DEMO_ROLE_DISCLAIMER}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <RoleKpiCards
        kpis={DEMO_ROLE_KPIS}
        activeFilter={filters.typeFilter}
        onFilterClick={(type: "ALL" | RoleType) =>
          setFilters((prev) => ({ ...prev, typeFilter: type, page: 1 }))
        }
      />

      {/* Filters Toolbar */}
      <RoleTableToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        totalFiltered={filteredRoles.length}
        totalRoles={roles.length}
      />

      {/* Roles Data Table */}
      <RoleTable
        roles={paginatedRoles}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        currentPage={filters.page}
        totalPages={totalPages}
        pageSize={filters.pageSize}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        onPageSizeChange={(size) => setFilters((prev) => ({ ...prev, pageSize: size, page: 1 }))}
        totalRolesCount={filteredRoles.length}
        onDuplicateClick={(r) => setDuplicateTarget(r)}
        onDeleteClick={(r) => setDeleteTarget(r)}
      />

      {/* Delete Dialog */}
      {deleteTarget && (
        <RoleDeleteDialog
          isOpen={true}
          onClose={() => setDeleteTarget(null)}
          role={deleteTarget}
          onConfirmDelete={handleConfirmDelete}
        />
      )}

      {/* Duplicate Dialog */}
      {duplicateTarget && (
        <RoleDuplicateDialog
          isOpen={true}
          onClose={() => setDuplicateTarget(null)}
          sourceRole={duplicateTarget}
          onConfirmDuplicate={handleConfirmDuplicate}
        />
      )}
    </div>
  );
}
