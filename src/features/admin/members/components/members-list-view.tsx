"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { MemberPageHeader } from "./member-page-header";
import { MemberKpiCards } from "./member-kpi-cards";
import { MemberTableToolbar } from "./member-table-toolbar";
import { MemberTable } from "./member-table";
import { MemberActionDialog, MemberActionType } from "./member-action-dialog";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export interface BackendMember {
  _id: string;
  fullName: string;
  email: string;
  role: "Guest" | "Member" | "PaidMember" | "Admin" | "SuperAdmin";
  status: "Active" | "Pending" | "Rejected" | "Suspended";
  profileStatus?: string;
  district?: string;
  state?: string;
  country?: string;
  phone?: string;
  referredBy?: { fullName?: string; email?: string } | string;
  identityVerification?: {
    verificationStatus?: string;
    documentType?: string;
  };
  createdAt: string;
}

export interface MemberFilters {
  query: string;
  status: string;
  role: string;
  sortBy: "createdAt" | "fullName";
  sortOrder: "asc" | "desc";
  page: number;
  pageSize: number;
}

export function MembersListView() {
  const [members, setMembers] = useState<BackendMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [actionTarget, setActionTarget] = useState<{
    member: BackendMember;
    type: MemberActionType;
  } | null>(null);

  const [filters, setFilters] = useState<MemberFilters>({
    query: "",
    status: "ALL",
    role: "ALL",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    pageSize: 10,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // ব্যাকএন্ডের GET /api/users এবং GET /api/admin/users/pending থেকে ডেটা আনা হচ্ছে
      const [allRes, pendingRes] = await Promise.allSettled([
        apiClient.get<{ data?: BackendMember[] }>(API_ENDPOINTS.users.list),
        apiClient.get<{ data?: BackendMember[] }>(API_ENDPOINTS.admin.pendingUsers),
      ]);

      const memberMap = new Map<string, BackendMember>();

      if (allRes.status === "fulfilled") {
        const rawAll = allRes.value as unknown as { data?: BackendMember[] } | BackendMember[];
        const list = Array.isArray(rawAll) ? rawAll : rawAll.data || [];
        list.forEach((m) => memberMap.set(m._id, m));
      }

      if (pendingRes.status === "fulfilled") {
        const rawPending = pendingRes.value as unknown as { data?: BackendMember[] } | BackendMember[];
        const pList = Array.isArray(rawPending) ? rawPending : rawPending.data || [];
        pList.forEach((m) => memberMap.set(m._id, m));
      }

      if (memberMap.size === 0 && allRes.status === "rejected" && pendingRes.status === "rejected") {
        throw new Error("Unable to load members from the server.");
      }

      setMembers(Array.from(memberMap.values()));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load member directory.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleFilterChange = (updates: Partial<MemberFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      query: "",
      status: "ALL",
      role: "ALL",
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
      pageSize: 10,
    });
  };

  // লাইভ ডেটা থেকে KPI ক্যালকুলেশন
  const kpis = useMemo(() => {
    return {
      total: members.length,
      active: members.filter((m) => m.status === "Active").length,
      pending: members.filter((m) => m.status === "Pending" || m.profileStatus === "PendingReview").length,
      paid: members.filter((m) => m.role === "PaidMember").length,
      suspended: members.filter((m) => m.status === "Suspended" || m.status === "Rejected").length,
    };
  }, [members]);

  // ফিল্টার এবং সর্টিং
  const filteredMembers = useMemo(() => {
    return members
      .filter((m) => {
        if (filters.query.trim()) {
          const q = filters.query.toLowerCase();
          const matchName = (m.fullName || "").toLowerCase().includes(q);
          const matchEmail = (m.email || "").toLowerCase().includes(q);
          const matchId = m._id.toLowerCase().includes(q);
          if (!matchName && !matchEmail && !matchId) return false;
        }
        if (filters.status !== "ALL" && m.status !== filters.status) return false;
        if (filters.role !== "ALL" && m.role !== filters.role) return false;
        return true;
      })
      .sort((a, b) => {
        const order = filters.sortOrder === "asc" ? 1 : -1;
        if (filters.sortBy === "fullName") {
          return (a.fullName || "").localeCompare(b.fullName || "") * order;
        }
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * order;
      });
  }, [members, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / filters.pageSize));
  const paginatedMembers = useMemo(() => {
    const start = (filters.page - 1) * filters.pageSize;
    return filteredMembers.slice(start, start + filters.pageSize);
  }, [filteredMembers, filters.page, filters.pageSize]);

  return (
    <div className="space-y-6 pb-10">
      {/* Feedback Toast */}
      {toastMessage && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-[#5B9891]/30 bg-[#5B9891]/10 p-3.5 text-xs font-bold text-[#467A74]">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#5B9891]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Header */}
      <MemberPageHeader onRefresh={fetchMembers} isRefreshing={isLoading} />

      {/* Live KPI Cards */}
      <MemberKpiCards kpis={kpis} isLoading={isLoading} />

      {/* Filter Toolbar */}
      <MemberTableToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        totalFiltered={filteredMembers.length}
      />

      {/* Members Data Table */}
      <MemberTable
        members={paginatedMembers}
        currentPage={filters.page}
        totalPages={totalPages}
        pageSize={filters.pageSize}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        onPageSizeChange={(size) => setFilters((prev) => ({ ...prev, pageSize: size, page: 1 }))}
        totalMembersCount={filteredMembers.length}
        isLoading={isLoading}
        onOpenAction={(member, type) => setActionTarget({ member, type })}
      />

      {/* Status & Role Update Dialog */}
      {actionTarget && (
        <MemberActionDialog
          isOpen={true}
          onClose={() => setActionTarget(null)}
          member={actionTarget.member}
          actionType={actionTarget.type}
          onSuccess={async (message) => {
            showToast(message);
            await fetchMembers();
          }}
        />
      )}
    </div>
  );
}