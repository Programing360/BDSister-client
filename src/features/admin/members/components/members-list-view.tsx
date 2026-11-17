"use client";

import React, { useState, useMemo } from "react";
import { MemberPageHeader } from "./member-page-header";
import { MemberKpiCards } from "./member-kpi-cards";
import { MemberTableToolbar } from "./member-table-toolbar";
import { MemberBulkToolbar } from "./member-bulk-toolbar";
import { MemberTable } from "./member-table";
import { MemberExportModal } from "./member-export-modal";
import { MemberActionDialog, AdminActionType } from "./member-action-dialog";
import {
  DEMO_ADMIN_MEMBERS,
  DEMO_MEMBER_KPIS,
} from "../data/admin-members-data";
import {
  AdminMemberDetail,
  MemberFilterState,
} from "../types/admin-member";

export function MembersListView() {
  const [members, setMembers] = useState<AdminMemberDetail[]>(DEMO_ADMIN_MEMBERS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Single action dialog state
  const [actionDialogTarget, setActionDialogTarget] = useState<{
    member: AdminMemberDetail;
    action: AdminActionType;
  } | null>(null);

  // Filter state
  const [filters, setFilters] = useState<MemberFilterState>({
    query: "",
    accountStatus: "ALL",
    membershipType: "ALL",
    verificationStatus: "ALL",
    sortBy: "joinedDate",
    sortOrder: "desc",
    page: 1,
    pageSize: 10,
  });

  const handleFilterChange = (updates: Partial<MemberFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      query: "",
      accountStatus: "ALL",
      membershipType: "ALL",
      verificationStatus: "ALL",
      sortBy: "joinedDate",
      sortOrder: "desc",
      page: 1,
      pageSize: 10,
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setFeedbackToast("Member records updated from simulated source.");
      setTimeout(() => setFeedbackToast(null), 3000);
    }, 600);
  };

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      // Query filter
      if (filters.query.trim()) {
        const q = filters.query.toLowerCase();
        const matchesName = member.name.toLowerCase().includes(q);
        const matchesEmail = member.email.toLowerCase().includes(q);
        const matchesMemberId = member.memberId.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesMemberId) return false;
      }

      // Status
      if (filters.accountStatus !== "ALL" && member.accountStatus !== filters.accountStatus) {
        return false;
      }

      // Membership
      if (filters.membershipType !== "ALL" && member.membershipType !== filters.membershipType) {
        return false;
      }

      // Verification
      if (
        filters.verificationStatus !== "ALL" &&
        member.verificationStatus !== filters.verificationStatus
      ) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "joinedDate") {
        const order = filters.sortOrder === "asc" ? 1 : -1;
        return a.joinedDate.localeCompare(b.joinedDate) * order;
      }
      if (filters.sortBy === "name") {
        const order = filters.sortOrder === "asc" ? 1 : -1;
        return a.name.localeCompare(b.name) * order;
      }
      if (filters.sortBy === "profileCompletion") {
        const order = filters.sortOrder === "asc" ? 1 : -1;
        return (a.profileCompletion - b.profileCompletion) * order;
      }
      return 0;
    });
  }, [members, filters]);

  // Paginated slice
  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / filters.pageSize));
  const paginatedMembers = useMemo(() => {
    const start = (filters.page - 1) * filters.pageSize;
    return filteredMembers.slice(start, start + filters.pageSize);
  }, [filteredMembers, filters.page, filters.pageSize]);

  const handleToggleSelectAll = () => {
    const pageIds = paginatedMembers.map((m) => m.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  // Bulk actions simulation
  const handleBulkAction = (action: string) => {
    setBulkProcessing(true);
    setTimeout(() => {
      setBulkProcessing(false);
      if (action === "SUSPEND") {
        setMembers((prev) =>
          prev.map((m) =>
            selectedIds.includes(m.id) ? { ...m, accountStatus: "SUSPENDED" } : m
          )
        );
        setFeedbackToast(`Simulated: ${selectedIds.length} members suspended.`);
      } else if (action === "REACTIVATE") {
        setMembers((prev) =>
          prev.map((m) =>
            selectedIds.includes(m.id) ? { ...m, accountStatus: "ACTIVE" } : m
          )
        );
        setFeedbackToast(`Simulated: ${selectedIds.length} members reactivated.`);
      } else if (action === "EXPORT") {
        setIsExportOpen(true);
      }
      setSelectedIds([]);
      setTimeout(() => setFeedbackToast(null), 3500);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 animate-in fade-in">
          {feedbackToast}
        </div>
      )}

      {/* Header */}
      <MemberPageHeader
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* KPI Cards */}
      <MemberKpiCards kpis={DEMO_MEMBER_KPIS} />

      {/* Filters Toolbar */}
      <MemberTableToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        totalFiltered={filteredMembers.length}
      />

      {/* Bulk Action Toolbar */}
      <MemberBulkToolbar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onBulkExport={() => setIsExportOpen(true)}
        onBulkSuspend={() => handleBulkAction("SUSPEND")}
        onBulkMembership={() => handleBulkAction("CHANGE_MEMBERSHIP")}
      />

      {/* Data Table */}
      <MemberTable
        members={paginatedMembers}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        currentPage={filters.page}
        totalPages={totalPages}
        pageSize={filters.pageSize}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        onPageSizeChange={(size) => setFilters((prev) => ({ ...prev, pageSize: size, page: 1 }))}
        totalMembersCount={filteredMembers.length}
        isLoading={isRefreshing}
      />

      {/* Export Modal */}
      <MemberExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        totalMembersCount={selectedIds.length > 0 ? selectedIds.length : filteredMembers.length}
      />

      {/* Action Dialog if activated */}
      {actionDialogTarget && (
        <MemberActionDialog
          isOpen={true}
          onClose={() => setActionDialogTarget(null)}
          actionType={actionDialogTarget.action}
          memberId={actionDialogTarget.member.memberId}
          memberName={actionDialogTarget.member.name}
          memberEmail={actionDialogTarget.member.email}
          currentStatus={actionDialogTarget.member.accountStatus}
          currentMembership={actionDialogTarget.member.membershipType}
          onSuccess={(_action, newStatus) => {
            setMembers((prev) =>
              prev.map((m) =>
                m.id === actionDialogTarget.member.id
                  ? { ...m, accountStatus: newStatus as AdminMemberDetail["accountStatus"] }
                  : m
              )
            );
          }}
        />
      )}
    </div>
  );
}
