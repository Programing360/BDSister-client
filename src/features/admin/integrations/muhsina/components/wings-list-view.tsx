"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DEMO_MUHSINA_WINGS, type MuhsinaWing } from "../data/mock-muhsina";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Filter,
} from "lucide-react";

export function WingsListView() {
  const [wings, setWings] = useState<MuhsinaWing[]>(DEMO_MUHSINA_WINGS);
  const [search, setSearch] = useState("");

  const filtered = wings.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.code.toLowerCase().includes(search.toLowerCase()) ||
      w.leadName.toLowerCase().includes(search.toLowerCase())
  );

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
            Organizational Wings Management
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Manage synchronized departmental wings, affiliated member quotas, and departmental leads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/integrations/muhsina/members">
            <Button variant="outline" size="sm" className="rounded-2xl text-xs font-bold">
              View Mapped Members
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
            placeholder="Search wing by code, name, lead..."
            className="w-full rounded-2xl border border-border bg-white pl-10 pr-4 py-2 text-xs sm:text-sm text-text-primary focus:border-primary focus:outline-hidden"
          />
        </div>
      </div>

      {/* Wings Table */}
      <div className="rounded-3xl border border-border/80 bg-white overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-surface/60 text-text-secondary">
                <th className="py-3.5 px-6 font-bold">Wing Code &amp; Title</th>
                <th className="py-3.5 px-6 font-bold">Departmental Lead</th>
                <th className="py-3.5 px-6 font-bold">Members Count</th>
                <th className="py-3.5 px-6 font-bold">Projects</th>
                <th className="py-3.5 px-6 font-bold">Sync Health</th>
                <th className="py-3.5 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((w) => (
                <tr key={w.id} className="hover:bg-surface/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg text-xs">
                        {w.code}
                      </span>
                      <div>
                        <strong className="text-text-primary block font-bold text-sm">
                          {w.name}
                        </strong>
                        <span className="text-[11px] text-text-secondary">
                          Est. {w.establishedDate}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <strong className="text-text-primary block font-medium">
                      {w.leadName}
                    </strong>
                    <span className="text-[11px] text-text-secondary">
                      {w.leadRole}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-text-primary">
                    {w.membersCount.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 font-medium text-text-primary">
                    {w.activeProjectsCount} Active
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{w.syncStatus}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      href={`/admin/integrations/muhsina/members?wing=${w.code}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                    >
                      <span>Members</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
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
