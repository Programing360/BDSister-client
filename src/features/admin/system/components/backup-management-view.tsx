"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DEMO_BACKUPS, type DatabaseBackup } from "@/features/admin/security/data/mock-security";
import { Button } from "@/components/ui/button";
import {
  Database,
  Download,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  ShieldCheck,
  Server,
  Sparkles,
} from "lucide-react";

export function BackupManagementView() {
  const [backups, setBackups] = useState<DatabaseBackup[]>(DEMO_BACKUPS);
  const [creating, setCreating] = useState(false);
  const [createdMessage, setCreatedMessage] = useState<string | null>(null);

  const handleCreateSnapshot = () => {
    setCreating(true);
    setTimeout(() => {
      const newBackup: DatabaseBackup = {
        id: `bk-${Date.now()}`,
        filename: `bdsisters_manual_snap_${new Date().toISOString().slice(0, 10)}.tar.gz`,
        size: "431 MB",
        type: "MANUAL_SNAPSHOT",
        storageLocation: "Google Cloud Storage (Coldline - Singapore)",
        status: "VERIFIED_INTEGRAL",
        createdAt: new Date().toISOString(),
        checksum: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      };
      setBackups((prev) => [newBackup, ...prev]);
      setCreating(false);
      setCreatedMessage("Manual snapshot captured and cryptographically verified.");
      setTimeout(() => setCreatedMessage(null), 3500);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border/80 bg-white p-6 shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Database className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Disaster Recovery &amp; Snapshots
            </span>
          </div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">
            Database Backup Management
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Automated midnight coldline archives, cryptographic integrity checksums, and rapid point-in-time recovery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreateSnapshot}
            disabled={creating}
            className="rounded-2xl gap-2 shadow-button"
          >
            <Plus className={`h-4 w-4 ${creating ? "animate-spin" : ""}`} />
            <span>{creating ? "Capturing Snapshot..." : "Create Manual Snapshot"}</span>
          </Button>
        </div>
      </div>

      {createdMessage && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-success/10 p-4 text-xs text-success border border-success/20 font-medium animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{createdMessage}</span>
        </div>
      )}

      {/* Snapshot List Table */}
      <div className="rounded-3xl border border-border/80 bg-white overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-surface/60 text-text-secondary">
                <th className="py-3.5 px-6 font-bold">Archive Filename</th>
                <th className="py-3.5 px-6 font-bold">Type</th>
                <th className="py-3.5 px-6 font-bold">Archive Size</th>
                <th className="py-3.5 px-6 font-bold">Storage Target</th>
                <th className="py-3.5 px-6 font-bold">Integrity Status</th>
                <th className="py-3.5 px-6 font-bold text-right">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {backups.map((bk) => (
                <tr key={bk.id} className="hover:bg-surface/40 transition-colors">
                  <td className="py-4 px-6">
                    <strong className="text-text-primary font-mono block text-sm">
                      {bk.filename}
                    </strong>
                    <span className="font-mono text-[10px] text-text-secondary line-clamp-1">
                      {bk.checksum}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-bold">
                      {bk.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-text-primary">
                    {bk.size}
                  </td>
                  <td className="py-4 px-6 text-text-secondary font-medium">
                    {bk.storageLocation}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{bk.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-text-secondary text-[11px]">
                    {new Date(bk.createdAt).toLocaleString()}
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
