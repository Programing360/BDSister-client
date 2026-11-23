"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DEMO_SECURITY_EVENTS, type SecurityEvent } from "../data/mock-security";
import { Button } from "@/components/ui/button";
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Filter,
} from "lucide-react";

export function SecurityEventsView() {
  const [events, setEvents] = useState<SecurityEvent[]>(DEMO_SECURITY_EVENTS);
  const [filter, setFilter] = useState("all");

  const filtered = events.filter((e) => {
    if (filter === "all") return true;
    return e.severity === filter;
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
            Security Events &amp; Threat Detection
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Real-time feed of intrusion attempts, edge firewall blocks, and anomalous administrative events.
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-text-secondary">Severity:</span>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-2xl border border-border bg-white px-3 py-2 text-xs font-medium text-text-primary focus:border-primary focus:outline-hidden"
        >
          <option value="all">All Severities</option>
          <option value="HIGH">High Severity</option>
          <option value="MEDIUM">Medium Severity</option>
          <option value="LOW">Low Severity</option>
        </select>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filtered.map((evt) => (
          <div
            key={evt.id}
            className="rounded-3xl border border-border/80 bg-white p-6 shadow-card space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/70 pb-3">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    evt.severity === "HIGH"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  <ShieldAlert className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-text-primary">
                    {evt.title}
                  </h3>
                  <span className="text-[11px] text-text-secondary">
                    Source: {evt.sourceIp} • Detected: {new Date(evt.detectedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    evt.severity === "HIGH"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {evt.severity}
                </span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                  {evt.status}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              {evt.description}
            </p>

            <div className="rounded-2xl bg-surface/60 p-3.5 border border-border/70 text-xs">
              <strong className="text-emerald-700 block mb-0.5">Automated Edge Action:</strong>
              <span className="text-text-primary">{evt.mitigationAction}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
