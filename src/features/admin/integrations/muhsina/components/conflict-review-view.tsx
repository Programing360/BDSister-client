"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DEMO_MAPPING_CONFLICTS,
  type MuhsinaConflictItem,
} from "../data/mock-muhsina";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

export function ConflictReviewView() {
  const [conflicts, setConflicts] = useState<MuhsinaConflictItem[]>(DEMO_MAPPING_CONFLICTS);
  const [filter, setFilter] = useState<"ALL" | "PENDING_REVIEW" | "RESOLVED">("PENDING_REVIEW");

  const filtered = conflicts.filter((c) => {
    if (filter === "ALL") return true;
    if (filter === "PENDING_REVIEW") return c.status === "PENDING_REVIEW";
    return c.status !== "PENDING_REVIEW";
  });

  const handleResolve = (id: string, resolution: "RESOLVED_LOCAL" | "RESOLVED_REMOTE") => {
    setConflicts((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: resolution,
              resolutionNotes:
                resolution === "RESOLVED_LOCAL"
                  ? "Overridden with BDSisters local record by Admin."
                  : "Synchronized with Muhsina Organization master record.",
            }
          : c
      )
    );
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
            Data Mapping &amp; Conflict Review
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Resolve field-level discrepancies between local BDSisters user records and Muhsina Organization directory entries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/integrations/muhsina/members">
            <Button variant="outline" size="sm" className="rounded-2xl text-xs font-bold">
              View All Mappings
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-3">
        <button
          onClick={() => setFilter("PENDING_REVIEW")}
          className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
            filter === "PENDING_REVIEW"
              ? "bg-amber-600 text-white shadow-xs"
              : "border border-border bg-white text-text-secondary hover:bg-surface hover:text-text-primary"
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Pending Review ({conflicts.filter((c) => c.status === "PENDING_REVIEW").length})</span>
        </button>

        <button
          onClick={() => setFilter("RESOLVED")}
          className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
            filter === "RESOLVED"
              ? "bg-primary text-white shadow-xs"
              : "border border-border bg-white text-text-secondary hover:bg-surface hover:text-text-primary"
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Resolved Items ({conflicts.filter((c) => c.status !== "PENDING_REVIEW").length})</span>
        </button>

        <button
          onClick={() => setFilter("ALL")}
          className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
            filter === "ALL"
              ? "bg-primary text-white shadow-xs"
              : "border border-border bg-white text-text-secondary hover:bg-surface hover:text-text-primary"
          }`}
        >
          <span>All Discrepancies</span>
        </button>
      </div>

      {/* Conflict Items Grid */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-white p-12 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-text-primary">
              All Conflicts Resolved
            </h3>
            <p className="text-xs text-text-secondary max-w-sm mx-auto">
              No outstanding discrepancies between BDSisters and Muhsina directory. Both systems are fully synchronized.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-border/80 bg-white p-6 shadow-card space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/70 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-base text-text-primary">
                    {item.memberName}
                  </span>
                  <span className="font-mono text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md font-semibold">
                    {item.memberId}
                  </span>
                  <span className="text-xs text-text-secondary font-medium">
                    Discrepant Field: <strong className="text-text-primary">{item.fieldName}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      item.severity === "HIGH"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {item.severity} Severity
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      item.status === "PENDING_REVIEW"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Comparison Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border/80 bg-surface/50 p-4 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                    BDSisters Local Value
                  </span>
                  <p className="text-sm font-bold text-text-primary">
                    {item.bdsistersValue}
                  </p>
                  <span className="text-[11px] text-text-secondary block">
                    Recorded from member registration or verification profile
                  </span>
                </div>

                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    Muhsina Organization Remote Value
                  </span>
                  <p className="text-sm font-bold text-primary">
                    {item.muhsinaValue}
                  </p>
                  <span className="text-[11px] text-text-secondary block">
                    Inward sync from Muhsina Cloud Organization Directory
                  </span>
                </div>
              </div>

              {item.resolutionNotes && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
                  <strong>Resolution Log:</strong> {item.resolutionNotes}
                </div>
              )}

              {/* Action Buttons if Pending */}
              {item.status === "PENDING_REVIEW" && (
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResolve(item.id, "RESOLVED_LOCAL")}
                    className="rounded-2xl text-xs font-bold border-border hover:bg-surface w-full sm:w-auto"
                  >
                    Keep BDSisters Local Record
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleResolve(item.id, "RESOLVED_REMOTE")}
                    className="rounded-2xl text-xs font-bold shadow-button w-full sm:w-auto"
                  >
                    Accept Muhsina Remote Value
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
