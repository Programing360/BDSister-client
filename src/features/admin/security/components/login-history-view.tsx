"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DEMO_LOGIN_HISTORY, type LoginHistoryRecord } from "../data/mock-security";
import { Button } from "@/components/ui/button";
import {
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Laptop,
} from "lucide-react";

export function LoginHistoryView() {
  const [records, setRecords] = useState<LoginHistoryRecord[]>(DEMO_LOGIN_HISTORY);
  const [search, setSearch] = useState("");

  const filtered = records.filter(
    (r) =>
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.ipAddress.includes(search) ||
      r.location.toLowerCase().includes(search.toLowerCase())
  );

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
            Authentication &amp; Login History
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Track authorized staff and member logins, geo-locations, browser client fingerprints, and blocked intrusion attempts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/security/sessions">
            <Button variant="outline" size="sm" className="rounded-2xl text-xs font-bold">
              Active Sessions
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-text-secondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email, IP address, location..."
            className="w-full rounded-2xl border border-border bg-white pl-10 pr-4 py-2 text-xs sm:text-sm text-text-primary focus:border-primary focus:outline-hidden"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-border/80 bg-white overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-surface/60 text-text-secondary">
                <th className="py-3.5 px-6 font-bold">User Identity</th>
                <th className="py-3.5 px-6 font-bold">Account Role</th>
                <th className="py-3.5 px-6 font-bold">Device &amp; User Agent</th>
                <th className="py-3.5 px-6 font-bold">IP &amp; Geographic Location</th>
                <th className="py-3.5 px-6 font-bold">Auth Outcome</th>
                <th className="py-3.5 px-6 font-bold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((rec) => (
                <tr key={rec.id} className="hover:bg-surface/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-text-primary">
                    {rec.email}
                  </td>
                  <td className="py-4 px-6 font-mono text-[11px] text-text-secondary">
                    {rec.role}
                  </td>
                  <td className="py-4 px-6">
                    <span className="flex items-center gap-1.5 text-text-primary font-medium">
                      <Laptop className="h-3.5 w-3.5 text-text-secondary shrink-0" />
                      <span>{rec.device}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-text-primary block">
                      {rec.ipAddress}
                    </span>
                    <span className="text-[11px] text-text-secondary">
                      {rec.location}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        rec.status === "SUCCESS"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {rec.status === "SUCCESS" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <ShieldAlert className="h-3 w-3" />
                      )}
                      <span>{rec.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-text-secondary text-[11px]">
                    {new Date(rec.timestamp).toLocaleString()}
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
