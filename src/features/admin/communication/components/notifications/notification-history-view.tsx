"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  History,
  ArrowLeft,
  Search,
  CheckCircle2,
  Calendar,
  Bell,
  Eye,
  Filter
} from "lucide-react";
import {
  DEMO_NOTIFICATION_HISTORY,
  formatDate
} from "../../data/mock-communication";
import type { NotificationHistoryItem } from "../../types/communication";

export function NotificationHistoryView() {
  const [history, setHistory] = useState<NotificationHistoryItem[]>(
    DEMO_NOTIFICATION_HISTORY
  );
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState<"all" | "read" | "unread">("all");

  const filtered = history.filter((item) => {
    const isRead = item.isRead !== undefined ? item.isRead : item.readStatus === "READ";
    const recipient = item.recipientName || item.recipient || "";
    const body = item.body || "";
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      recipient.toLowerCase().includes(search.toLowerCase()) ||
      item.recipientEmail.toLowerCase().includes(search.toLowerCase()) ||
      body.toLowerCase().includes(search.toLowerCase());
    const matchesRead =
      readFilter === "all" ||
      (readFilter === "read" && isRead) ||
      (readFilter === "unread" && !isRead);
    return matchesSearch && matchesRead;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl shadow-slate-900/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/admin/communication/notifications"
                className="text-indigo-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-200">
                <History className="h-3.5 w-3.5" />
                <span>Audit & Delivery Trail</span>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Notification Dispatch History
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Log of user notifications, delivery channels, and read receipt confirmations.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl bg-white p-4 md:p-6 shadow-xl shadow-slate-200/50 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, recipient, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            {(["all", "read", "unread"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setReadFilter(r)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold capitalize transition-all ${
                  readFilter === r
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Recipient</th>
                <th className="px-6 py-4">Notification Content</th>
                <th className="px-6 py-4">Channel</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Sent At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const isRead = item.isRead !== undefined ? item.isRead : item.readStatus === "READ";
                const recipient = item.recipientName || item.recipient || "Member";
                const channel = item.channel || "in_app";
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{recipient}</div>
                      <div className="text-xs text-slate-500">{item.recipientEmail}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{item.title}</div>
                      <p className="mt-0.5 text-xs text-slate-500 line-clamp-1 max-w-md">
                        {item.body || item.title}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-xs font-medium text-slate-700 capitalize">
                      {channel.replace("_", " ")}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          isRead
                            ? "bg-slate-100 text-slate-600"
                            : "bg-indigo-50 text-indigo-700"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isRead ? "bg-slate-400" : "bg-indigo-600"
                          }`}
                        />
                        {isRead ? "Read" : "Unread"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {formatDate(item.sentAt || item.createdDate)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
