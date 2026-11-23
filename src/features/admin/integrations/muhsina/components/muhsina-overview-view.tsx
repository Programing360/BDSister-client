"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DEMO_MUHSINA_KPIS,
  DEMO_MUHSINA_WINGS,
  DEMO_SYNC_LOGS,
  DEMO_MAPPING_CONFLICTS,
  type MuhsinaWing,
} from "../data/mock-muhsina";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Users,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Activity,
  ArrowRight,
  Settings,
  Sparkles,
  Search,
} from "lucide-react";

export function MuhsinaOverviewView() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Demo Watermark Banner */}
      <div className="flex items-center justify-between rounded-2xl bg-amber-500/10 px-4 py-2.5 text-xs text-amber-800 border border-amber-500/20">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-600" />
          <span className="font-bold">DEMO ONLY — SIMULATED MUHSINA CLOUD INTEGRATION:</span>
          <span>All member sync operations and cross-wing data mappings are safely simulated for frontend preview.</span>
        </div>
        <span className="font-mono text-[10px] uppercase font-bold bg-amber-200/60 px-2 py-0.5 rounded-sm">
          Step 14 Frontend
        </span>
      </div>

      {/* Top Header & Sync Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border/80 bg-white p-6 shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Layers className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Official Partner Integration
            </span>
          </div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">
            Muhsina Organization Unified Platform
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Centralized member database sync, organizational wings management, and cross-platform role mappings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/admin/integrations/muhsina/settings">
            <Button variant="outline" size="sm" className="rounded-2xl gap-1.5 text-xs font-bold">
              <Settings className="h-3.5 w-3.5" />
              <span>Config</span>
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="rounded-2xl gap-2 shadow-button"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Synchronizing..." : "Trigger Global Sync"}</span>
          </Button>
        </div>
      </div>

      {syncSuccess && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-success/10 p-4 text-xs text-success border border-success/20 animate-in fade-in duration-200 font-medium">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
          <span>Global sync completed successfully. 4,820 member records checked; all 5 wing schemas verified.</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>Synced Members</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <h3 className="mt-2 text-2xl font-black text-text-primary">
            {DEMO_MUHSINA_KPIS.totalSyncedMembers.toLocaleString()}
          </h3>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            {DEMO_MUHSINA_KPIS.syncHealthRate}% Match Integrity
          </span>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>Connected Wings</span>
            <Layers className="h-4 w-4 text-primary" />
          </div>
          <h3 className="mt-2 text-2xl font-black text-text-primary">
            {DEMO_MUHSINA_KPIS.connectedWings} Wings Active
          </h3>
          <span className="text-[11px] text-text-secondary mt-1 inline-block">
            CoP, TSPP, IMBD, MCPO, SWSA
          </span>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>Pending Conflicts</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <h3 className="mt-2 text-2xl font-black text-text-primary">
            {DEMO_MUHSINA_KPIS.pendingConflicts} Review Items
          </h3>
          <Link
            href="/admin/integrations/muhsina/conflicts"
            className="text-[11px] text-primary hover:underline font-bold mt-1 inline-block"
          >
            Review Discrepancies →
          </Link>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>Sync Engine</span>
            <Activity className="h-4 w-4 text-emerald-600" />
          </div>
          <h3 className="mt-2 text-2xl font-black text-emerald-600">
            {DEMO_MUHSINA_KPIS.syncEngineStatus}
          </h3>
          <span className="text-[11px] text-text-secondary mt-1 inline-block">
            Webhook: {DEMO_MUHSINA_KPIS.webhookStatus}
          </span>
        </div>
      </div>

      {/* Connected Organizational Wings Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <span>Connected Organizational Wings</span>
          </h2>
          <Link
            href="/admin/integrations/muhsina/wings"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All Wings</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEMO_MUHSINA_WINGS.map((wing) => (
            <div
              key={wing.id}
              className="flex flex-col justify-between rounded-3xl border border-border/80 bg-white p-6 shadow-card hover:border-primary/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-mono font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-lg text-xs">
                    {wing.code}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{wing.syncStatus}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-text-primary leading-snug">
                  {wing.name}
                </h3>
                <p className="mt-2 text-xs text-text-secondary line-clamp-2 leading-relaxed">
                  {wing.description}
                </p>

                <div className="mt-4 rounded-2xl bg-surface/60 p-3.5 border border-border/70 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Lead:</span>
                    <strong className="text-text-primary">{wing.leadName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Affiliated Members:</span>
                    <strong className="text-text-primary">{wing.membersCount.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Active Projects:</span>
                    <strong className="text-text-primary">{wing.activeProjectsCount}</strong>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {wing.focusAreas.slice(0, 3).map((area) => (
                    <span
                      key={area}
                      className="rounded-md bg-surface px-2 py-0.5 text-[10px] text-text-secondary border border-border/60"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-border/70 flex items-center justify-between text-xs">
                <Link
                  href={`/admin/integrations/muhsina/wings`}
                  className="font-bold text-primary hover:underline"
                >
                  Manage Wing Schema →
                </Link>
                <span className="text-text-secondary text-[11px]">
                  Est. {wing.establishedDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Recent Sync Stream & Pending Discrepancies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Sync History */}
        <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span>Recent Synchronization Logs</span>
            </h3>
            <Link
              href="/admin/integrations/muhsina/synchronization"
              className="text-xs font-bold text-primary hover:underline"
            >
              Full Log History
            </Link>
          </div>

          <div className="space-y-3">
            {DEMO_SYNC_LOGS.map((log) => (
              <div
                key={log.id}
                className="rounded-2xl border border-border/70 bg-surface/40 p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-text-primary">
                    {log.syncType}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.status === "SUCCESS"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {log.status} ({log.durationMs}ms)
                  </span>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  {log.notes}
                </p>
                <div className="flex items-center justify-between text-[11px] text-text-secondary pt-1 border-t border-border/50">
                  <span>Processed: {log.recordsProcessed} | Updated: {log.recordsUpdated}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Conflict Review Snippet */}
        <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>Mapping Discrepancies ({DEMO_MAPPING_CONFLICTS.length})</span>
            </h3>
            <Link
              href="/admin/integrations/muhsina/conflicts"
              className="text-xs font-bold text-primary hover:underline"
            >
              Conflict Review Hub
            </Link>
          </div>

          <div className="space-y-3">
            {DEMO_MAPPING_CONFLICTS.slice(0, 3).map((conf) => (
              <div
                key={conf.id}
                className="rounded-2xl border border-border/70 bg-surface/40 p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary">
                    {conf.memberName} ({conf.memberId})
                  </span>
                  <span className="rounded-md bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-[10px] font-bold">
                    {conf.severity} Severity
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-xl border border-border/60">
                  <div>
                    <span className="text-text-secondary block">BDSisters Value:</span>
                    <strong className="text-text-primary">{conf.bdsistersValue}</strong>
                  </div>
                  <div>
                    <span className="text-text-secondary block">Muhsina Value:</span>
                    <strong className="text-primary">{conf.muhsinaValue}</strong>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-text-secondary">
                  <span>Field: {conf.fieldName}</span>
                  <Link
                    href="/admin/integrations/muhsina/conflicts"
                    className="font-bold text-primary hover:underline"
                  >
                    Resolve →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
