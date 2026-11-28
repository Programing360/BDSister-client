"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  History,
  ArrowLeft,
  Search,
  CheckCircle2,
  Calendar,
  Bell,
  Eye,
  Filter,
  RefreshCw,
  Trash2,
  ChevronLeft,
  ChevronRight,
  User,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { formatDate } from "../../data/mock-communication";

interface NotificationRecipient {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface LiveNotification {
  _id: string;
  id?: string;
  recipientId?: NotificationRecipient | string;
  senderId?: NotificationRecipient | string;
  type?: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt?: string;
}

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function NotificationHistoryView() {
  const [notifications, setNotifications] = useState<LiveNotification[]>([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [readFilter, setReadFilter] = useState<"all" | "read" | "unread">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Pagination
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  });

  // Action state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch notifications
  const fetchNotifications = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        queryParams.set("page", String(pagination.page));
        queryParams.set("limit", String(pagination.limit));

        if (readFilter !== "all") {
          queryParams.set("status", readFilter);
        }

        if (typeFilter !== "all") {
          queryParams.set("type", typeFilter);
        }

        if (debouncedSearch.trim()) {
          queryParams.set("search", debouncedSearch.trim());
        }

        const endpoint = `${API_ENDPOINTS.notifications.adminHistory}?${queryParams.toString()}`;
        const res = await apiClient.get<any>(endpoint);

        if (res.data?.success) {
          setNotifications(res.data.data || []);
          if (res.data.pagination) {
            setPagination((prev) => ({
              ...prev,
              total: res.data.pagination.total,
              totalPages: res.data.pagination.totalPages || 1,
            }));
          }
          if (typeof res.data.totalUnread === "number") {
            setTotalUnread(res.data.totalUnread);
          }
        } else {
          setError(res.data?.message || "Failed to load notification history.");
        }
      } catch (err: any) {
        console.error("Error fetching notification history:", err);
        setError(err.response?.data?.message || err.message || "Failed to fetch notification history.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [pagination.page, pagination.limit, readFilter, typeFilter, debouncedSearch]
  );

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Handle delete notification
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this notification record from the audit log?")) {
      return;
    }

    setDeletingId(id);
    setActionMessage(null);

    try {
      const endpoint = API_ENDPOINTS.notifications.adminDelete(id);
      const res = await apiClient.delete<any>(endpoint);

      if (res.data?.success) {
        setActionMessage({ type: "success", text: "Notification successfully removed." });
        setNotifications((prev) => prev.filter((item) => (item._id || item.id) !== id));
        setPagination((prev) => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
        }));
      } else {
        setActionMessage({ type: "error", text: res.data?.message || "Failed to delete notification." });
      }
    } catch (err: any) {
      setActionMessage({
        type: "error",
        text: err.response?.data?.message || err.message || "Failed to delete notification.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages || newPage === pagination.page) return;
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-[#0e1f21] p-6 md:p-8 text-white shadow-xl shadow-slate-900/10 border border-[#5B9891]/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/admin/communication/notifications"
                className="text-[#5B9891] hover:text-[#F7DFC7] transition-colors"
                title="Back to Notifications Overview"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[#F7DFC7]">
                <History className="h-3.5 w-3.5 text-[#D98408]" />
                <span>Audit & Delivery Trail</span>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#FAF8F5]">
              Notification Dispatch History
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Live audit log of sisterhood notifications, system alerts, delivery status, and recipient receipts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchNotifications(true)}
              disabled={refreshing || loading}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2.5 text-sm font-medium text-[#FAF8F5] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
            <Link
              href="/admin/communication/notifications/templates"
              className="inline-flex items-center gap-2 rounded-xl bg-[#5B9891] hover:bg-[#487a74] px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-[#5B9891]/25 transition-colors"
            >
              <Bell className="h-4 w-4" />
              Templates
            </Link>
          </div>
        </div>
      </div>

      {/* Action feedback */}
      {actionMessage && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between transition-all ${
            actionMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <span>{actionMessage.text}</span>
          <button
            onClick={() => setActionMessage(null)}
            className="text-xs font-semibold underline ml-4 hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="rounded-2xl bg-white p-4 md:p-6 shadow-xl shadow-slate-200/50 space-y-4 border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, message, or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B9891] shadow-sm border border-slate-200"
            />
          </div>

          {/* Type Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Type:
            </span>
            {["all", "System", "Profile", "Business", "Order", "Forum"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setTypeFilter(type);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                  typeFilter === type
                    ? "bg-[#5B9891] text-white shadow-md shadow-[#5B9891]/20"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Read status filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
            {(["all", "read", "unread"] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setReadFilter(r);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                  readFilter === r
                    ? "bg-white text-[#111E28] shadow-sm font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100">
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="h-8 w-8 text-[#5B9891] animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">Loading notification history...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center px-4">
            <ShieldAlert className="h-10 w-10 text-red-500 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-800 mb-1">Failed to load data</p>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">{error}</p>
            <button
              onClick={() => fetchNotifications(true)}
              className="px-4 py-2 bg-[#5B9891] text-white rounded-xl text-xs font-medium hover:bg-[#487a74] transition"
            >
              Try Again
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-20 text-center px-4">
            <Bell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-800">No notifications found</p>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
              {debouncedSearch || readFilter !== "all" || typeFilter !== "all"
                ? "Try adjusting your search query or status filter."
                : "No notifications have been dispatched yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF8F5] text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-4">Recipient</th>
                  <th className="px-6 py-4">Notification Content</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Sent At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {notifications.map((item) => {
                  const id = item._id || item.id || "";
                  const isRead = !!item.isRead;

                  // Recipient info
                  const recipient = typeof item.recipientId === "object" && item.recipientId !== null ? item.recipientId : null;
                  const recipientName = recipient?.name || "Community Member";
                  const recipientEmail = recipient?.email || "No email on record";
                  const recipientRole = recipient?.role;

                  // Type
                  const notifType = item.type || "System";

                  return (
                    <tr key={id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-[#F7DFC7] text-[#D98408] flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                            {recipientName.charAt(0) || "U"}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <span>{recipientName}</span>
                              {recipientRole && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-normal">
                                  {recipientRole}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500">{recipientEmail}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 flex items-center gap-2">
                          <span>{item.title}</span>
                          {item.link && (
                            <Link
                              href={item.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-[#5B9891]"
                              title="Open link"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500 line-clamp-2 max-w-md">
                          {item.message}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#5B9891]/10 text-[#5B9891]">
                          {notifType}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            isRead
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${isRead ? "bg-emerald-600" : "bg-amber-500"}`}
                          />
                          {isRead ? "Read" : "Unread"}
                        </span>
                        {item.readAt && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {formatDate(item.readAt)}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {formatDate(item.createdAt)}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(id)}
                          disabled={deletingId === id}
                          className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                          title="Delete notification"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination footer */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50/70 border-t border-slate-200 text-xs text-slate-600">
            <div>
              Showing <span className="font-semibold">{notifications.length}</span> of{" "}
              <span className="font-semibold">{pagination.total}</span> records
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium hover:bg-slate-100 disabled:opacity-40 transition"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </button>

              <span className="px-2 font-medium">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium hover:bg-slate-100 disabled:opacity-40 transition"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
