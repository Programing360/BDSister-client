"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Globe,
  Radio,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";

interface EndpointMetric {
  path: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  p95Latency: string;
  requests24h: string;
  successRate: string;
  status: "OPTIMAL" | "ATTENTION";
}

const DEMO_ENDPOINTS: EndpointMetric[] = [
  {
    path: "/api/auth/me",
    method: "GET",
    p95Latency: "14ms",
    requests24h: "42,810",
    successRate: "99.98%",
    status: "OPTIMAL",
  },
  {
    path: "/api/ecommerce/products",
    method: "GET",
    p95Latency: "28ms",
    requests24h: "28,450",
    successRate: "99.95%",
    status: "OPTIMAL",
  },
  {
    path: "/api/forum/posts",
    method: "GET",
    p95Latency: "35ms",
    requests24h: "18,220",
    successRate: "99.92%",
    status: "OPTIMAL",
  },
  {
    path: "/api/payment/zinipay/init",
    method: "POST",
    p95Latency: "120ms",
    requests24h: "1,420",
    successRate: "99.85%",
    status: "OPTIMAL",
  },
  {
    path: "/api/payment/zinipay/webhook",
    method: "POST",
    p95Latency: "45ms",
    requests24h: "1,390",
    successRate: "100.0%",
    status: "OPTIMAL",
  },
];

export function ApiMonitoringView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border/80 bg-white p-6 shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Radio className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              REST &amp; Webhook Analytics
            </span>
          </div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">
            API &amp; Webhook Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Track latency distributions, hourly traffic volumes, and third-party webhook delivery guarantees.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-card">
          <span className="text-xs text-text-secondary">Total Invocations (24h)</span>
          <h3 className="text-2xl font-black text-text-primary mt-1">92,290</h3>
          <span className="text-[11px] text-emerald-600 font-semibold">99.96% Global Success Rate</span>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-card">
          <span className="text-xs text-text-secondary">Average P95 Latency</span>
          <h3 className="text-2xl font-black text-text-primary mt-1">32ms</h3>
          <span className="text-[11px] text-text-secondary">Edge-cached via Cloudflare</span>
        </div>

        <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-card">
          <span className="text-xs text-text-secondary">Webhook Ingestion Health</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">100.0%</h3>
          <span className="text-[11px] text-text-secondary">ZiniPay &amp; Muhsina webhooks active</span>
        </div>
      </div>

      {/* Endpoints Table */}
      <div className="rounded-3xl border border-border/80 bg-white overflow-hidden shadow-card">
        <div className="p-6 border-b border-border/80">
          <h3 className="text-base font-bold text-text-primary">
            Key REST Endpoints Performance
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-surface/60 text-text-secondary">
                <th className="py-3.5 px-6 font-bold">Method &amp; Path</th>
                <th className="py-3.5 px-6 font-bold">P95 Latency</th>
                <th className="py-3.5 px-6 font-bold">24h Requests</th>
                <th className="py-3.5 px-6 font-bold">Success Rate</th>
                <th className="py-3.5 px-6 font-bold text-right">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {DEMO_ENDPOINTS.map((ep) => (
                <tr key={ep.path} className="hover:bg-surface/40 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-text-primary">
                    <span
                      className={`inline-block mr-2 px-1.5 py-0.5 rounded-sm text-[10px] font-bold ${
                        ep.method === "GET"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {ep.method}
                    </span>
                    {ep.path}
                  </td>
                  <td className="py-4 px-6 font-mono text-text-primary">
                    {ep.p95Latency}
                  </td>
                  <td className="py-4 px-6 font-bold text-text-primary">
                    {ep.requests24h}
                  </td>
                  <td className="py-4 px-6 font-mono text-emerald-600 font-bold">
                    {ep.successRate}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{ep.status}</span>
                    </span>
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
