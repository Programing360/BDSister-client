"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DEMO_SYNC_LOGS, type MuhsinaSyncLog } from "../data/mock-muhsina";
import { Button } from "@/components/ui/button";
import {
  Activity,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
} from "lucide-react";

export function SyncHistoryView() {
  const [logs, setLogs] = useState<MuhsinaSyncLog[]>(DEMO_SYNC_LOGS);
  const [filter, setFilter] = useState("all");

  const filtered = logs.filter((l) => {
    if (filter === "all") return true;
    return l.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border/80 bg-white p-6 shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin/integrations/muhsina"
              className="text-xs font-bold text-primary hover:underline"
            >
              ← Muhsina Overview
            </Link>
          </div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">
            Synchronization Logs &amp; Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Complete history of automated cron syncs, webhook dispatches, and manual triggers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/integrations/muhsina/conflicts">
            <Button variant="outline" size="sm" className="rounded-2xl text-xs font-bold">
              Conflict Review
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-text-secondary">Status Filter:</span>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-2xl border border-border bg-white px-3 py-2 text-xs font-medium text-text-primary focus:border-primary focus:outline-hidden"
        >
          <option value="all">All Logs</option>
          <option value="SUCCESS">Success Only</option>
          <option value="WARNING">Warnings / Conflicts</option>
          <option value="FAILED">Failures</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="rounded-3xl border border-border/80 bg-white overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-surface/60 text-text-secondary">
                <th className="py-3.5 px-6 font-bold">Execution Type</th>
                <th className="py-3.5 px-6 font-bold">Initiated By</th>
                <th className="py-3.5 px-6 font-bold">Processed / Updated</th>
                <th className="py-3.5 px-6 font-bold">Conflicts Found</th>
                <th className="py-3.5 px-6 font-bold">Status</th>
                <th className="py-3.5 px-6 font-bold">Duration</th>
                <th className="py-3.5 px-6 font-bold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-surface/40 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-text-primary">
                    {log.syncType}
                  </td>
                  <td className="py-4 px-6 text-text-secondary">
                    {log.initiatedBy}
                  </td>
                  <td className="py-4 px-6 font-bold text-text-primary">
                    {log.recordsProcessed.toLocaleString()} / {log.recordsUpdated}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`font-bold ${
                        log.conflictsFound > 0 ? "text-amber-600" : "text-text-secondary"
                      }`}
                    >
                      {log.conflictsFound}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        log.status === "SUCCESS"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono text-text-secondary">
                    {log.durationMs}ms
                  </td>
                  <td className="py-4 px-6 text-right text-text-secondary font-mono text-[11px]">
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
