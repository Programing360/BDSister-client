"use client";

import React from "react";
import Link from "next/link";
import {
  DEMO_SECURITY_KPIS,
  DEMO_AUDIT_LOGS,
  DEMO_SECURITY_EVENTS,
  DEMO_SERVICE_HEALTH,
} from "../data/mock-security";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Key,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Globe,
  ArrowRight,
  Server,
  Sparkles,
} from "lucide-react";

export function SecurityDashboardView() {
  return (
    <div className="space-y-6">
      {/* Demo Watermark Banner */}
      <div className="flex items-center justify-between rounded-2xl bg-amber-500/10 px-4 py-2.5 text-xs text-amber-800 border border-amber-500/20">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-600" />
          <span className="font-bold">DEMO ONLY — SIMULATED SECURITY COMMAND CENTER:</span>
          <span>Security metrics, audit logs, threat monitoring, and session management are simulated for frontend preview.</span>
        </div>
        <span className="font-mono text-[10px] uppercase font-bold bg-amber-200/60 px-2 py-0.5 rounded-sm">
          Step 14 Frontend
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border/80 bg-white p-6 shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Lock className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Defense &amp; Compliance Center
            </span>
          </div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">
            System Security &amp; Access Controls
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Real-time threat monitoring, privileged admin sessions, 2FA compliance, and cryptographic audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/admin/security/audit-logs">
            <Button variant="outline" size="sm" className="rounded-2xl text-xs font-bold gap-1.5">
              <Activity className="h-3.5 w-3.5" />
              <span>Audit Logs</span>
            </Button>
          </Link>
          <Link href="/admin/security/two-factor">
            <Button variant="primary" size="sm" className="rounded-2xl text-xs font-bold shadow-button gap-1.5">
              <Key className="h-3.5 w-3.5" />
              <span>2FA Policies</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>Security Posture Score</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-black text-text-primary">
              {DEMO_SECURITY_KPIS.securityScore}
            </h3>
            <span className="text-xs text-text-secondary">/ 100</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            Optimal Hardening Status
          </span>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>2FA Adoption Rate</span>
            <Key className="h-4 w-4 text-primary" />
          </div>
          <h3 className="mt-2 text-3xl font-black text-text-primary">
            {DEMO_SECURITY_KPIS.twoFactorAdoptionRate}%
          </h3>
          <span className="text-[11px] text-text-secondary mt-1 inline-block">
            Mandatory for all staff roles
          </span>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>Blocked Threats (24h)</span>
            <ShieldAlert className="h-4 w-4 text-rose-500" />
          </div>
          <h3 className="mt-2 text-3xl font-black text-text-primary">
            {DEMO_SECURITY_KPIS.blockedThreats24h}
          </h3>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            100% Mitigated by Cloudflare WAF
          </span>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>Active Admin Sessions</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <h3 className="mt-2 text-3xl font-black text-text-primary">
            {DEMO_SECURITY_KPIS.activeAdminSessions}
          </h3>
          <Link
            href="/admin/security/sessions"
            className="text-[11px] text-primary hover:underline font-bold mt-1 inline-block"
          >
            Inspect Sessions →
          </Link>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Link
          href="/admin/security/audit-logs"
          className="rounded-2xl border border-border/80 bg-white p-4 text-center hover:border-primary/40 hover:bg-surface/50 transition-all flex flex-col items-center justify-center space-y-1.5"
        >
          <Activity className="h-5 w-5 text-primary" />
          <span className="text-xs font-bold text-text-primary">Audit Logs</span>
        </Link>
        <Link
          href="/admin/security/login-history"
          className="rounded-2xl border border-border/80 bg-white p-4 text-center hover:border-primary/40 hover:bg-surface/50 transition-all flex flex-col items-center justify-center space-y-1.5"
        >
          <Users className="h-5 w-5 text-primary" />
          <span className="text-xs font-bold text-text-primary">Login History</span>
        </Link>
        <Link
          href="/admin/security/sessions"
          className="rounded-2xl border border-border/80 bg-white p-4 text-center hover:border-primary/40 hover:bg-surface/50 transition-all flex flex-col items-center justify-center space-y-1.5"
        >
          <Lock className="h-5 w-5 text-primary" />
          <span className="text-xs font-bold text-text-primary">Sessions</span>
        </Link>
        <Link
          href="/admin/security/two-factor"
          className="rounded-2xl border border-border/80 bg-white p-4 text-center hover:border-primary/40 hover:bg-surface/50 transition-all flex flex-col items-center justify-center space-y-1.5"
        >
          <Key className="h-5 w-5 text-primary" />
          <span className="text-xs font-bold text-text-primary">2FA Settings</span>
        </Link>
        <Link
          href="/admin/security/events"
          className="rounded-2xl border border-border/80 bg-white p-4 text-center hover:border-primary/40 hover:bg-surface/50 transition-all flex flex-col items-center justify-center space-y-1.5"
        >
          <ShieldAlert className="h-5 w-5 text-rose-500" />
          <span className="text-xs font-bold text-text-primary">Security Events</span>
        </Link>
        <Link
          href="/admin/security/privacy"
          className="rounded-2xl border border-border/80 bg-white p-4 text-center hover:border-primary/40 hover:bg-surface/50 transition-all flex flex-col items-center justify-center space-y-1.5"
        >
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <span className="text-xs font-bold text-text-primary">Privacy &amp; Data</span>
        </Link>
      </div>

      {/* Two Column Section: Recent Security Events & System Services Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Security Events */}
        <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-500" />
              <span>Security Events &amp; Threats</span>
            </h3>
            <Link
              href="/admin/security/events"
              className="text-xs font-bold text-primary hover:underline"
            >
              All Events
            </Link>
          </div>

          <div className="space-y-3">
            {DEMO_SECURITY_EVENTS.map((evt) => (
              <div
                key={evt.id}
                className="rounded-2xl border border-border/70 bg-surface/40 p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-text-primary text-sm font-bold">
                    {evt.title}
                  </strong>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      evt.severity === "HIGH"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {evt.severity}
                  </span>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  {evt.description}
                </p>
                <div className="rounded-xl bg-white p-2.5 border border-border/60 text-[11px] text-text-secondary">
                  <strong className="text-emerald-700">Mitigation:</strong> {evt.mitigationAction}
                </div>
                <div className="flex items-center justify-between text-[11px] text-text-secondary pt-1">
                  <span>Source: {evt.sourceIp}</span>
                  <span>{new Date(evt.detectedAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Core Services Health */}
        <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              <span>Infrastructure &amp; Service Health</span>
            </h3>
            <Link
              href="/admin/system/health"
              className="text-xs font-bold text-primary hover:underline"
            >
              System Operations Hub
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {DEMO_SERVICE_HEALTH.map((srv) => (
              <div key={srv.name} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-text-primary block font-semibold">
                    {srv.name}
                  </strong>
                  <span className="text-[11px] text-text-secondary">
                    {srv.category} • Checked {srv.lastChecked}
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{srv.status}</span>
                  </span>
                  <span className="text-[11px] text-text-secondary block font-mono mt-0.5">
                    {srv.latency} ({srv.uptime})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
