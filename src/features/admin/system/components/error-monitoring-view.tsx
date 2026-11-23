"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  XCircle,
  Clock,
  Sparkles,
} from "lucide-react";

interface ErrorIncident {
  id: string;
  exception: string;
  message: string;
  route: string;
  occurrences: number;
  lastSeen: string;
  status: "INVESTIGATING" | "RESOLVED" | "IGNORED";
  severity: "CRITICAL" | "HIGH" | "LOW";
}

const DEMO_ERRORS: ErrorIncident[] = [
  {
    id: "err-101",
    exception: "ZiniPayGatewayTimeoutException",
    message: "Upstream gateway socket timeout after 15000ms while negotiating invoice session",
    route: "POST /api/payment/zinipay/init",
    occurrences: 3,
    lastSeen: "2 hours ago",
    status: "INVESTIGATING",
    severity: "HIGH",
  },
  {
    id: "err-102",
    exception: "SmtpConnectionRefusedException",
    message: "Temporary socket refusal on port 587 during bulk newsletter dispatch",
    route: "POST /api/newsletter/dispatch",
    occurrences: 1,
    lastSeen: "Yesterday",
    status: "RESOLVED",
    severity: "LOW",
  },
];

export function ErrorMonitoringView() {
  const [errors, setErrors] = useState<ErrorIncident[]>(DEMO_ERRORS);

  const handleResolve = (id: string) => {
    setErrors((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "RESOLVED" } : e))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border/80 bg-white p-6 shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <AlertTriangle className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Incident &amp; Exception Tracking
            </span>
          </div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">
            Error &amp; Crash Analytics
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Real-time backend exception telemetry, stack traces, and resolution workflows.
          </p>
        </div>
      </div>

      {/* Errors list */}
      <div className="space-y-4">
        {errors.map((err) => (
          <div
            key={err.id}
            className="rounded-3xl border border-border/80 bg-white p-6 shadow-card space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/70 pb-3">
              <div>
                <span className="font-mono font-bold text-sm text-rose-600 block">
                  {err.exception}
                </span>
                <span className="font-mono text-xs text-text-secondary">
                  Route: {err.route}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                  {err.severity}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    err.status === "RESOLVED"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {err.status}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-text-primary font-mono bg-surface/60 p-3 rounded-2xl border border-border/60">
              {err.message}
            </p>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-text-secondary">
                {err.occurrences} occurrences • Last seen {err.lastSeen}
              </span>

              {err.status !== "RESOLVED" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResolve(err.id)}
                  className="rounded-2xl text-xs font-bold text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                >
                  Mark as Resolved
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
