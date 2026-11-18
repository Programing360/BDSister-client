"use client";

import React, { useState } from "react";
import {
  Flag,
  Search,
  Filter,
  CheckCircle,
} from "lucide-react";
import { DEMO_COMMUNITY_REPORTS } from "../../data/mock-community";
import { CommunityReport, ReportStatus, ReportCategory } from "../../types/community";
import { ReportTable } from "./report-table";

export function ReportsListView() {
  const [reports, setReports] = useState<CommunityReport[]>(DEMO_COMMUNITY_REPORTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResolve = (id: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          showToast(`Report ${r.reportId} marked as RESOLVED (DEMO ONLY).`);
          return { ...r, status: "RESOLVED" };
        }
        return r;
      })
    );
  };

  const handleDismiss = (id: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          showToast(`Report ${r.reportId} dismissed (DEMO ONLY).`);
          return { ...r, status: "DISMISSED" };
        }
        return r;
      })
    );
  };

  const handleEscalate = (id: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          showToast(`Report ${r.reportId} escalated to Lead Moderator (DEMO ONLY).`);
          return { ...r, status: "ESCALATED" };
        }
        return r;
      })
    );
  };

  const filtered = reports.filter((r) => {
    const matchesSearch =
      r.reportId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reporter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reportedMember.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "ALL" || r.category === categoryFilter;
    const matchesStatus =
      statusFilter === "ALL" || r.status === statusFilter;
    const matchesPriority =
      priorityFilter === "ALL" || r.priority === priorityFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-purple-500/5">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
            <Flag className="w-5 h-5" />
          </span>
          <h1 className="text-xl font-bold text-gray-900">
            Community Content Reports & Grievances
          </h1>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Investigate member-flagged spam, harassment, counterfeit disputes, and inappropriate conduct.
        </p>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reports by ID, party or keyword..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white font-medium text-gray-700 focus:border-purple-500 outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="SPAM">Spam</option>
            <option value="HARASSMENT">Harassment</option>
            <option value="BULLYING">Bullying</option>
            <option value="HATE_SPEECH">Hate Speech</option>
            <option value="MISINFORMATION">Misinformation</option>
            <option value="INAPPROPRIATE">Inappropriate</option>
            <option value="COPYRIGHT">Copyright Concern</option>
            <option value="FAKE_ACCOUNT">Fake Account</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white font-medium text-gray-700 focus:border-purple-500 outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent ⚡</option>
            <option value="HIGH">High</option>
            <option value="NORMAL">Normal</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white font-medium text-gray-700 focus:border-purple-500 outline-none"
          >
            <option value="ALL">All Report Statuses</option>
            <option value="NEW">New Only</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="RESOLVED">Resolved</option>
            <option value="DISMISSED">Dismissed</option>
            <option value="ESCALATED">Escalated</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <ReportTable
        reports={filtered}
        onResolve={handleResolve}
        onDismiss={handleDismiss}
        onEscalate={handleEscalate}
      />
    </div>
  );
}
