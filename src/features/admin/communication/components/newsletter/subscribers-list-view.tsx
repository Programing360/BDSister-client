"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Calendar,
  Tag,
  ArrowLeft,
  UserX,
  UserCheck
} from "lucide-react";
import {
  DEMO_NEWSLETTER_SUBSCRIBERS,
  formatDate
} from "../../data/mock-communication";
import type {
  NewsletterSubscriber,
  SubscriberStatus
} from "../../types/communication";

export function SubscribersListView() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(
    DEMO_NEWSLETTER_SUBSCRIBERS
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleStatus = (id: string) => {
    setSubscribers((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const isSub = s.status.toLowerCase() === "subscribed";
          const newStatus = isSub ? "unsubscribed" : "subscribed";
          return { ...s, status: newStatus };
        }
        return s;
      })
    );
    showToast("Subscriber status updated (Simulated client action)");
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Email,Name,Status,SubscribedAt,Source,Tags"].join(",") +
      "\n" +
      subscribers
        .map(
          (s) =>
            `"${s.email}","${s.name || ""}","${s.status}","${s.subscribedAt || s.subscriptionDate || ""}","${s.source}","${(s.tags || []).join(";")}"`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bdsisters_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported subscribers CSV");
  };

  const filtered = subscribers.filter((sub) => {
    const matchesSearch =
      sub.email.toLowerCase().includes(search.toLowerCase()) ||
      (sub.name && sub.name.toLowerCase().includes(search.toLowerCase())) ||
      (sub.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || sub.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-3 text-sm font-medium shadow-2xl shadow-indigo-500/20">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl shadow-slate-900/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/admin/communication/newsletter"
                className="text-indigo-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-200">
                <Users className="h-3.5 w-3.5" />
                <span>Audience Management</span>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Newsletter Subscribers
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Directory of members and public recipients opted into BDSisters.org email updates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2.5 text-sm font-medium text-white transition-colors"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
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
              placeholder="Search by name, email, or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            {(["all", "subscribed", "unsubscribed", "cleaned"] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold capitalize transition-all ${
                    statusFilter === status
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {status}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Subscriber</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Tags</th>
                <th className="px-6 py-4">Subscribed At</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((sub) => (
                <tr
                  key={sub.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{sub.email}</div>
                    {sub.name && (
                      <p className="text-xs text-slate-500">{sub.name}</p>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                        sub.status === "subscribed"
                          ? "bg-emerald-50 text-emerald-700"
                          : sub.status === "unsubscribed"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          sub.status === "subscribed"
                            ? "bg-emerald-500"
                            : sub.status === "unsubscribed"
                            ? "bg-amber-500"
                            : "bg-slate-400"
                        }`}
                      />
                      {sub.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-xs font-medium text-slate-600 capitalize">
                    {sub.source.replace("_", " ")}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {(sub.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {formatDate(sub.subscribedAt || sub.subscriptionDate)}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(sub.id)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                        sub.status === "subscribed"
                          ? "text-rose-600 hover:bg-rose-50"
                          : "text-emerald-600 hover:bg-emerald-50"
                      }`}
                    >
                      {sub.status === "subscribed" ? "Unsubscribe" : "Re-activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
