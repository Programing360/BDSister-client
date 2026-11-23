"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DEMO_AUDIT_LOGS, type AdminAuditLog } from "../data/mock-security";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Search,
  Filter,
  CheckCircle2,
  ShieldAlert,
  Calendar,
  ChevronRight,
  Download,
} from "lucide-react";

export function AuditLogsView() {
  const [logs, setLogs] = useState<AdminAuditLog[]>(DEMO_AUDIT_LOGS);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const filtered = logs.filter((l) => {
    const matchSearch =
      l.adminName.toLowerCase().includes(search.toLowerCase()) ||
      l.adminEmail.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.targetResource.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === "all" || l.action === actionFilter;
    return matchSearch && matchAction;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border/80 bg-white p-6 shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin/security"
              className="text-xs font-bold text-primary hover:underline"
            >
              ← Security Command Center
            </Link>
          </div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">
            Administrative Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Tamper-evident trail of all privileged administrator modifications, verifications, and system operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-2xl text-xs font-bold gap-1.5">
            <Download className="h-3.5 w-3.5" />
            <span>Export Audit Trail (CSV)</span>
          </Button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-text-secondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by administrator, action, target resource..."
            className="w-full rounded-2xl border border-border bg-white pl-10 pr-4 py-2 text-xs sm:text-sm text-text-primary focus:border-primary focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-text-secondary">Action Type:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="rounded-2xl border border-border bg-white px-3 py-2 text-xs font-medium text-text-primary focus:border-primary focus:outline-hidden"
          >
            <option value="all">All Actions</option>
            <option value="ROLE_PERMISSION_UPDATE">Role &amp; Permissions</option>
            <option value="MEMBER_VERIFICATION_APPROVAL">Verification Approval</option>
            <option value="SUSPICIOUS_IP_BLOCK">IP Block Action</option>
            <option value="MANUAL_BACKUP_TRIGGER">Backup Trigger</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-3xl border border-border/80 bg-white overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-surface/60 text-text-secondary">
                <th className="py-3.5 px-6 font-bold">Admin User</th>
                <th className="py-3.5 px-6 font-bold">Action Executed</th>
                <th className="py-3.5 px-6 font-bold">Target Resource &amp; Details</th>
                <th className="py-3.5 px-6 font-bold">IP &amp; Location</th>
                <th className="py-3.5 px-6 font-bold">Status</th>
                <th className="py-3.5 px-6 font-bold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-surface/40 transition-colors">
                  <td className="py-4 px-6">
                    <strong className="text-text-primary block font-bold text-sm">
                      {log.adminName}
                    </strong>
                    <span className="text-[11px] text-text-secondary font-mono">
                      {log.adminEmail}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-sm text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-4 px-6 max-w-xs">
                    <strong className="text-text-primary block font-semibold">
                      {log.targetResource}
                    </strong>
                    <p className="text-[11px] text-text-secondary line-clamp-1 mt-0.5">
                      {log.details}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-text-primary block">
                      {log.ipAddress}
                    </span>
                    <span className="text-[11px] text-text-secondary">
                      {log.location}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{log.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-text-secondary text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
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
