"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DEMO_SERVICE_HEALTH, type ServiceHealthItem } from "@/features/admin/security/data/mock-security";
import { Button } from "@/components/ui/button";
import {
  Server,
  Activity,
  CheckCircle2,
  RefreshCw,
  Cpu,
  HardDrive,
  Wifi,
  Sparkles,
} from "lucide-react";

export function SystemHealthView() {
  const [services, setServices] = useState<ServiceHealthItem[]>(DEMO_SERVICE_HEALTH);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border/80 bg-white p-6 shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Server className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Infrastructure Operations
            </span>
          </div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">
            System Health &amp; Runtime Operations
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Real-time heartbeat monitoring across backend application containers, databases, payment gateways, and edge CDNs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="rounded-2xl gap-2 text-xs font-bold"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh Diagnostics</span>
          </Button>
        </div>
      </div>

      {/* Resource Utilization Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>CPU Cluster Load</span>
            <Cpu className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-2xl font-black text-text-primary">18.4%</h3>
          <div className="h-2 w-full rounded-full bg-surface overflow-hidden">
            <div className="h-full bg-primary rounded-full w-[18%]" />
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block">
            Optimal • 4 Cores Available
          </span>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>RAM Allocation</span>
            <HardDrive className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-2xl font-black text-text-primary">3.2 GB / 8 GB</h3>
          <div className="h-2 w-full rounded-full bg-surface overflow-hidden">
            <div className="h-full bg-heading-accent rounded-full w-[40%]" />
          </div>
          <span className="text-[11px] text-text-secondary block">
            40% Used • Node.js Memory Pool Normal
          </span>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>Global Uptime</span>
            <Activity className="h-4 w-4 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-black text-emerald-600">99.98%</h3>
          <div className="h-2 w-full rounded-full bg-surface overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-[99%]" />
          </div>
          <span className="text-[11px] text-text-secondary block">
            Past 90 Days SLA Maintained
          </span>
        </div>
      </div>

      {/* Services Table */}
      <div className="rounded-3xl border border-border/80 bg-white overflow-hidden shadow-card">
        <div className="p-6 border-b border-border/80 flex items-center justify-between">
          <h3 className="text-base font-bold text-text-primary">
            Monitored Microservices &amp; Integrations
          </h3>
          <span className="text-xs text-emerald-600 font-bold">
            All 5 Services Operational
          </span>
        </div>

        <div className="divide-y divide-border/60">
          {services.map((srv) => (
            <div
              key={srv.name}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface/40 transition-colors text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Server className="h-5 w-5" />
                </div>
                <div>
                  <strong className="text-sm font-bold text-text-primary block">
                    {srv.name}
                  </strong>
                  <span className="text-text-secondary text-[11px]">
                    Category: {srv.category} • Checked {srv.lastChecked}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-[11px] text-text-secondary block">Latency</span>
                  <strong className="font-mono text-text-primary">{srv.latency}</strong>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-text-secondary block">SLA</span>
                  <strong className="font-mono text-text-primary">{srv.uptime}</strong>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{srv.status}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
