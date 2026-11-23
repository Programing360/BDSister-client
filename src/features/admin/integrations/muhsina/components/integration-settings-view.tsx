"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Settings,
  ShieldCheck,
  CheckCircle2,
  Key,
  Globe,
  Clock,
  Sparkles,
} from "lucide-react";

export function IntegrationSettingsView() {
  const [gatewayUrl, setGatewayUrl] = useState("https://api.muhsina.org/v2/federated-sync");
  const [apiKey, setApiKey] = useState("muh_live_89410931298410294819");
  const [interval, setInterval] = useState("HOURLY");
  const [twoWaySync, setTwoWaySync] = useState(true);
  const [conflictPolicy, setConflictPolicy] = useState("MANUAL_REVIEW");
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
            <Link
              href="/admin/integrations/muhsina"
              className="text-xs font-bold text-primary hover:underline"
            >
              ← Muhsina Overview
            </Link>
          </div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">
            Muhsina Gateway Configuration
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Configure cross-platform federation credentials, webhook secrets, and automated sync rules.
          </p>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-2xl bg-success/10 p-4 text-xs text-success border border-success/20 font-medium">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Integration settings safely updated in local state (Demo Mode).</span>
        </div>
      )}

      <form onSubmit={handleSave} className="rounded-3xl border border-border/80 bg-white p-6 sm:p-8 shadow-card space-y-6">
        <div className="space-y-4">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <span>Connection &amp; Endpoints</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              Muhsina Federated API Endpoint
            </label>
            <input
              type="url"
              value={gatewayUrl}
              onChange={(e) => setGatewayUrl(e.target.value)}
              className="w-full rounded-2xl border border-border bg-surface/50 px-4 py-2.5 text-xs text-text-primary focus:border-primary focus:bg-white focus:outline-hidden font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              API Authentication Key (Masked)
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-3 h-4 w-4 text-text-secondary" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full rounded-2xl border border-border bg-surface/50 pl-10 pr-4 py-2.5 text-xs text-text-primary focus:border-primary focus:bg-white focus:outline-hidden font-mono"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-border/80 pt-6 space-y-4">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>Automation &amp; Synchronization Cadence</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1.5">
                Automated Sync Frequency
              </label>
              <select
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                className="w-full rounded-2xl border border-border bg-surface/50 px-4 py-2.5 text-xs text-text-primary focus:border-primary focus:bg-white focus:outline-hidden"
              >
                <option value="HOURLY">Every 1 Hour (Recommended)</option>
                <option value="SIX_HOURS">Every 6 Hours</option>
                <option value="DAILY">Daily at Midnight (BST)</option>
                <option value="MANUAL_ONLY">Manual Trigger Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1.5">
                Conflict Resolution Strategy
              </label>
              <select
                value={conflictPolicy}
                onChange={(e) => setConflictPolicy(e.target.value)}
                className="w-full rounded-2xl border border-border bg-surface/50 px-4 py-2.5 text-xs text-text-primary focus:border-primary focus:bg-white focus:outline-hidden"
              >
                <option value="MANUAL_REVIEW">Queue for Manual Staff Review</option>
                <option value="BDSISTERS_AUTHORITATIVE">BDSisters Local Record Overwrites</option>
                <option value="MUHSINA_AUTHORITATIVE">Muhsina Master Record Overwrites</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-surface/40 p-4 flex items-center justify-between">
            <div>
              <strong className="text-xs font-bold text-text-primary block">
                Enable Real-time Webhook Push
              </strong>
              <span className="text-[11px] text-text-secondary">
                Instantly propagate verification status upgrades and wing affiliations.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={twoWaySync}
                onChange={(e) => setTwoWaySync(e.target.checked)}
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
            Save Gateway Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
