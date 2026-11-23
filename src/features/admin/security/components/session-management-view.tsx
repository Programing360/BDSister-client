"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DEMO_ACTIVE_SESSIONS, type ActiveSession } from "../data/mock-security";
import { Button } from "@/components/ui/button";
import {
  Lock,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldAlert,
} from "lucide-react";

export function SessionManagementView() {
  const [sessions, setSessions] = useState<ActiveSession[]>(DEMO_ACTIVE_SESSIONS);
  const [revokedMessage, setRevokedMessage] = useState<string | null>(null);

  const handleRevoke = (id: string, name: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setRevokedMessage(`Session for ${name} has been revoked successfully.`);
    setTimeout(() => setRevokedMessage(null), 3000);
  };

  const handleRevokeAllOthers = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrentSession));
    setRevokedMessage("All secondary administrative sessions terminated.");
    setTimeout(() => setRevokedMessage(null), 3000);
  };

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
            Active Administrative Sessions
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Real-time cryptographic session tokens, active devices, and remote termination controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRevokeAllOthers}
            className="rounded-2xl text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50"
          >
            Terminate All Other Sessions
          </Button>
        </div>
      </div>

      {revokedMessage && (
        <div className="flex items-center gap-2 rounded-2xl bg-success/10 p-4 text-xs text-success border border-success/20 font-medium animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{revokedMessage}</span>
        </div>
      )}

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sessions.map((sess) => (
          <div
            key={sess.id}
            className={`flex flex-col justify-between rounded-3xl border p-6 shadow-card transition-all ${
              sess.isCurrentSession
                ? "border-primary/40 bg-gradient-to-br from-primary/5 via-white to-surface"
                : "border-border/80 bg-white hover:border-border"
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-mono text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-bold">
                  {sess.role}
                </span>
                {sess.isCurrentSession ? (
                  <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold">
                    Current Active Session
                  </span>
                ) : (
                  <span className="text-text-secondary text-[11px]">
                    Active: {sess.lastActivityAt}
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-text-primary">
                {sess.userName}
              </h3>
              <span className="text-xs text-text-secondary block font-mono">
                {sess.userEmail}
              </span>

              <div className="mt-4 rounded-2xl bg-surface/60 p-3.5 border border-border/70 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-text-primary">
                  <Laptop className="h-3.5 w-3.5 text-text-secondary shrink-0" />
                  <span className="font-medium">{sess.device}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Location:</span>
                  <strong className="text-text-primary">{sess.location}</strong>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>IP Address:</span>
                  <strong className="text-text-primary font-mono">{sess.ipAddress}</strong>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Started:</span>
                  <strong className="text-text-primary font-mono text-[11px]">
                    {new Date(sess.startedAt).toLocaleTimeString()}
                  </strong>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border/70 flex items-center justify-end">
              {sess.isCurrentSession ? (
                <span className="text-xs text-text-secondary font-medium">
                  Protected (Local Session)
                </span>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRevoke(sess.id, sess.userName)}
                  className="rounded-2xl text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  Revoke Access
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
