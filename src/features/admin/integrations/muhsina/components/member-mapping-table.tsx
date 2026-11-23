"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DEMO_MUHSINA_MEMBERS, type MuhsinaMemberMapping } from "../data/mock-muhsina";
import { Button } from "@/components/ui/button";
import {
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Filter,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export function MemberMappingTable() {
  const [members, setMembers] = useState<MuhsinaMemberMapping[]>(DEMO_MUHSINA_MEMBERS);
  const [search, setSearch] = useState("");
  const [wingFilter, setWingFilter] = useState("all");
  const [syncingMemberId, setSyncingMemberId] = useState<string | null>(null);

  const filtered = members.filter((m) => {
    const matchQuery =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.bdsistersId.toLowerCase().includes(search.toLowerCase()) ||
      m.muhsinaId.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchWing = wingFilter === "all" || m.wingCode === wingFilter;
    return matchQuery && matchWing;
  });

  const handleManualSync = (id: string) => {
    setSyncingMemberId(id);
    setTimeout(() => {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, syncStatus: "SYNCHRONIZED", lastSyncedAt: new Date().toISOString() }
            : m
        )
      );
      setSyncingMemberId(null);
    }, 1200);
  };

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
            Cross-Platform Member Mapping
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Inspect dual BDSisters and Muhsina Organization membership IDs, wing affiliations, and sync integrity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/integrations/muhsina/conflicts">
            <Button variant="outline" size="sm" className="rounded-2xl text-xs font-bold text-amber-700 border-amber-300">
              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
              <span>Review Conflicts</span>
            </Button>
          </Link>
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
            placeholder="Search member by name, BDS-ID, Muhsina-ID, email..."
            className="w-full rounded-2xl border border-border bg-white pl-10 pr-4 py-2 text-xs sm:text-sm text-text-primary focus:border-primary focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-text-secondary">Wing Filter:</span>
          <select
            value={wingFilter}
            onChange={(e) => setWingFilter(e.target.value)}
            className="rounded-2xl border border-border bg-white px-3 py-2 text-xs font-medium text-text-primary focus:border-primary focus:outline-hidden"
          >
            <option value="all">All Wings</option>
            <option value="CoP">CoP (Professionals)</option>
            <option value="TSPP">TSPP (Tech)</option>
            <option value="IMBD">IMBD (Business)</option>
            <option value="MCPO">MCPO (Media)</option>
            <option value="SWSA">SWSA (Welfare)</option>
          </select>
        </div>
      </div>

      {/* Member Mapping Table */}
      <div className="rounded-3xl border border-border/80 bg-white overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-surface/60 text-text-secondary">
                <th className="py-3.5 px-6 font-bold">Member &amp; IDs</th>
                <th className="py-3.5 px-6 font-bold">Wing Affiliation</th>
                <th className="py-3.5 px-6 font-bold">Wing Role</th>
                <th className="py-3.5 px-6 font-bold">Location</th>
                <th className="py-3.5 px-6 font-bold">Sync Status</th>
                <th className="py-3.5 px-6 font-bold">Confidence</th>
                <th className="py-3.5 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-surface/40 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <strong className="text-text-primary block font-bold text-sm">
                        {m.name}
                      </strong>
                      <span className="text-[11px] text-text-secondary block">
                        {m.email}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm">
                          {m.bdsistersId}
                        </span>
                        <span className="text-text-secondary text-[10px]">↔</span>
                        <span className="font-mono text-[10px] bg-surface text-text-secondary px-1.5 py-0.5 rounded-sm border border-border">
                          {m.muhsinaId}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-text-primary block">
                      {m.wingName}
                    </span>
                    <span className="font-mono text-[11px] text-text-secondary">
                      ({m.wingCode})
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-[11px] font-bold text-text-primary">
                      {m.wingRole}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-text-secondary font-medium">
                    {m.district}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        m.syncStatus === "SYNCHRONIZED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : m.syncStatus === "CONFLICT"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {m.syncStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-text-primary">
                    {m.matchConfidence}%
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleManualSync(m.id)}
                      disabled={syncingMemberId === m.id}
                      className="text-xs font-bold text-primary hover:bg-primary/10 gap-1 rounded-xl"
                    >
                      <RefreshCw
                        className={`h-3 w-3 ${syncingMemberId === m.id ? "animate-spin" : ""}`}
                      />
                      <span>Sync</span>
                    </Button>
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
