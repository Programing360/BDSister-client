"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Settings,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Sliders,
  Sparkles,
} from "lucide-react";

export function SystemSettingsView() {
  const [siteName, setSiteName] = useState("BDSisters.org");
  const [supportEmail, setSupportEmail] = useState("support@bdsisters.org");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState("OPEN");
  const [maxUploadSize, setMaxUploadSize] = useState("10");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border/80 bg-white p-6 shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Settings className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Global Platform Parameters
            </span>
          </div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">
            System &amp; Environmental Settings
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Configure global platform availability, onboarding switches, and system defaults.
          </p>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-2xl bg-success/10 p-4 text-xs text-success border border-success/20 font-medium">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>System parameters successfully updated (Demo Mode).</span>
        </div>
      )}

      <form onSubmit={handleSave} className="rounded-3xl border border-border/80 bg-white p-6 sm:p-8 shadow-card space-y-6">
        <div className="space-y-4">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <span>Site Identity &amp; Contact</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1.5">
                Platform Name
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full rounded-2xl border border-border bg-surface/50 px-4 py-2.5 text-xs text-text-primary focus:border-primary focus:bg-white focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1.5">
                Support Escalation Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full rounded-2xl border border-border bg-surface/50 px-4 py-2.5 text-xs text-text-primary focus:border-primary focus:bg-white focus:outline-hidden"
                required
              />
            </div>
          </div>
        </div>

        <div className="border-t border-border/80 pt-6 space-y-4">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Sliders className="h-4 w-4 text-primary" />
            <span>Platform Availability &amp; Onboarding</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1.5">
                New Sister Registration Mode
              </label>
              <select
                value={registrationStatus}
                onChange={(e) => setRegistrationStatus(e.target.value)}
                className="w-full rounded-2xl border border-border bg-surface/50 px-4 py-2.5 text-xs text-text-primary focus:border-primary focus:bg-white focus:outline-hidden"
              >
                <option value="OPEN">Open (Public Registration)</option>
                <option value="INVITE_ONLY">Invite Only / Referrer Code Required</option>
                <option value="PAUSED">Paused (Closed temporarily for audit)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1.5">
                Max Verification Document Size (MB)
              </label>
              <input
                type="number"
                value={maxUploadSize}
                onChange={(e) => setMaxUploadSize(e.target.value)}
                min="2"
                max="50"
                className="w-full rounded-2xl border border-border bg-surface/50 px-4 py-2.5 text-xs text-text-primary focus:border-primary focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-surface/40 p-4 flex items-center justify-between">
            <div>
              <strong className="text-xs font-bold text-text-primary block">
                Platform Maintenance Mode
              </strong>
              <span className="text-[11px] text-text-secondary">
                Displays a friendly maintenance banner to public visitors. Authenticated staff retain full access.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/80">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="rounded-2xl shadow-button px-6"
          >
            Save System Parameters
          </Button>
        </div>
      </form>
    </div>
  );
}
