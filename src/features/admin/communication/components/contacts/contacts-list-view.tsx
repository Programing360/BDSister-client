"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  Trash2,
  Archive,
  MailCheck,
  Eye,
  Sparkles,
  Inbox,
  Filter,
} from "lucide-react";
import { DEMO_CONTACT_SUBMISSIONS } from "../../data/mock-communication";
import {
  PriorityBadge,
  ContactStatusBadge,
} from "../common/communication-status-badges";
import type { ContactSubmission, ContactStatus, PriorityLevel } from "../../types/communication";

export function ContactsListView() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(DEMO_CONTACT_SUBMISSIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredSubmissions = submissions.filter((item) => {
    const matchesSearch =
      item.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    const matchesCategory = categoryFilter === "ALL" || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleToggleRead = (id: string, currentStatus: ContactStatus) => {
    const nextStatus: ContactStatus = currentStatus === "NEW" ? "READ" : "NEW";
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: nextStatus } : s))
    );
    triggerToast(`Message marked as ${nextStatus.toLowerCase()} (Demo UI)`);
  };

  const handleArchive = (id: string, name: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "ARCHIVED" as ContactStatus } : s))
    );
    triggerToast(`Archived message from ${name}`);
  };

  const handleDelete = (id: string, name: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    triggerToast(`Deleted submission from ${name}`);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl shadow-slate-900/20 transition-all">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl shadow-indigo-950/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/admin/communication"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Communication Hub
              </Link>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                Inquiries & Partnerships
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Contact Submissions Inbox
            </h1>
            <p className="text-sm text-slate-300">
              Review and manage incoming inquiries from universities, corporate CSR partners, press, and prospective artisans.
            </p>
          </div>
        </div>

        {/* Demo Data Disclaimer */}
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2.5 text-xs font-medium text-amber-200">
          <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
          <span>DEMO DATA — Live changes are simulated locally in client state. No backend mutations occur.</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search sender, email, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-white pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="READ">Read</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REPLIED">Replied</option>
            <option value="RESOLVED">Resolved</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
          >
            <option value="ALL">All Categories</option>
            <option value="PARTNERSHIP">Partnership</option>
            <option value="SPONSORSHIP">Sponsorship</option>
            <option value="PRESS">Press</option>
            <option value="COMPLIANCE">Compliance</option>
            <option value="GENERAL">General</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredSubmissions.length} of {submissions.length} messages
        </span>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Sender</th>
                <th className="px-6 py-3.5">Subject & Preview</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Priority</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubmissions.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50/50 transition-colors ${
                    item.status === "NEW" ? "bg-indigo-50/20 font-medium" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{item.senderName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{item.email}</div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <Link
                      href={`/admin/communication/contacts/${item.id}`}
                      className="font-bold text-slate-900 hover:text-indigo-600 line-clamp-1"
                    >
                      {item.subject}
                    </Link>
                    <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-1">
                      {item.message}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <PriorityBadge priority={item.priority} />
                  </td>
                  <td className="px-6 py-4">
                    <ContactStatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                    {item.submissionDate}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/communication/contacts/${item.id}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                        title="View Full Inquiry"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleToggleRead(item.id, item.status)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title={item.status === "NEW" ? "Mark as Read" : "Mark as New"}
                      >
                        <MailCheck className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleArchive(item.id, item.senderName)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Archive"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.senderName)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
