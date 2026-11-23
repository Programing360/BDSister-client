"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserX,
} from "lucide-react";

export function PrivacyDataAccessView() {
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
            Privacy &amp; Data Governance Controls
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Oversee member data protection standards, AES-256 document encryption, and female officer safe spaces.
          </p>
        </div>
      </div>

      {/* 4 Pillars of Data Governance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-card space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Lock className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-text-primary">
            AES-256 Storage Encryption
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            All submitted government National ID cards, birth certificates, and passport documents are encrypted using AES-256 GCM before persisting to disk. Encryption keys rotate automatically every 90 days.
          </p>
          <div className="rounded-xl bg-surface/60 p-2.5 text-[11px] text-text-secondary border border-border/60">
            Status: <strong className="text-emerald-700">100% Cryptographically Encrypted</strong>
          </div>
        </div>

        <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-card space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <EyeOff className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-text-primary">
            Strict Female Officer Verification Safe Space
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Unredacted NID documents and unmasked biometric photos are restricted strictly to verified female verification staff. Male staff accounts and external contractors have zero decryption capability.
          </p>
          <div className="rounded-xl bg-surface/60 p-2.5 text-[11px] text-text-secondary border border-border/60">
            Policy: <strong className="text-primary">Female Officer Ring-Fencing Active</strong>
          </div>
        </div>

        <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-card space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-text-primary">
            Zero Commercial Data Brokering
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            BDSisters maintains an ironclad policy against marketing pixel trackers, third-party advertising brokers, and external data harvesting. Sisterhood data is never monetized.
          </p>
          <div className="rounded-xl bg-surface/60 p-2.5 text-[11px] text-text-secondary border border-border/60">
            Audit: <strong className="text-emerald-700">Verified Zero Tracking Scripts</strong>
          </div>
        </div>

        <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-card space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserX className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-text-primary">
            Self-Service Data Portability &amp; Right to Erasure
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Sisters can request an encrypted ZIP archive of all their platform data or trigger an immutable account purge with 14-day cryptographic shredding of personal identifiers.
          </p>
          <div className="rounded-xl bg-surface/60 p-2.5 text-[11px] text-text-secondary border border-border/60">
            Erasure Queue: <strong className="text-text-primary">0 Pending Purges</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
