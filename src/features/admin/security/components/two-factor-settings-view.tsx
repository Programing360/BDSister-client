"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Key,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Shield,
  Clock,
  Sparkles,
} from "lucide-react";

export function TwoFactorSettingsView() {
  const [adminEnforced, setAdminEnforced] = useState(true);
  const [memberOptional, setMemberOptional] = useState(true);
  const [totpEnabled, setTotpEnabled] = useState(true);
  const [smsOtpEnabled, setSmsOtpEnabled] = useState(true);
  const [passkeysEnabled, setPasskeysEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
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
              href="/admin/security"
              className="text-xs font-bold text-primary hover:underline"
            >
              ← Security Command Center
            </Link>
          </div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">
            Two-Factor Authentication &amp; Session Policies
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Enforce multi-factor verification standards across administrative roles and member accounts.
          </p>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-2xl bg-success/10 p-4 text-xs text-success border border-success/20 font-medium">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Security &amp; 2FA policies successfully applied (Demo Mode).</span>
        </div>
      )}

      <form onSubmit={handleSave} className="rounded-3xl border border-border/80 bg-white p-6 sm:p-8 shadow-card space-y-6">
        {/* Enforcement Tier */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Enforcement Requirements</span>
          </h3>

          <div className="rounded-2xl border border-border/80 bg-surface/40 p-4 flex items-center justify-between">
            <div>
              <strong className="text-xs font-bold text-text-primary block">
                Mandatory 2FA for All Staff &amp; Administrative Roles
              </strong>
              <span className="text-[11px] text-text-secondary">
                Enforces TOTP verification before any privileged dashboard access is granted.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={adminEnforced}
                onChange={(e) => setAdminEnforced(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="rounded-2xl border border-border/80 bg-surface/40 p-4 flex items-center justify-between">
            <div>
              <strong className="text-xs font-bold text-text-primary block">
                Enable Optional 2FA for Verified Members &amp; Sellers
              </strong>
              <span className="text-[11px] text-text-secondary">
                Permits sisters to secure their vendor payouts and order history via self-service TOTP.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={memberOptional}
                onChange={(e) => setMemberOptional(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* Allowed Verification Methods */}
        <div className="border-t border-border/80 pt-6 space-y-4">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Key className="h-4 w-4 text-primary" />
            <span>Supported Multi-Factor Authenticators</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-border/70 hover:bg-surface/50 cursor-pointer">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-primary" />
                <div>
                  <strong className="text-xs font-bold text-text-primary block">
                    Authenticator Apps (TOTP — Google Authenticator, Authy, 1Password)
                  </strong>
                  <span className="text-[11px] text-text-secondary">Recommended, zero telecom dependency.</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={totpEnabled}
                onChange={(e) => setTotpEnabled(e.target.checked)}
                className="h-4 w-4 rounded-sm border-border text-primary focus:ring-primary"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-border/70 hover:bg-surface/50 cursor-pointer">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <strong className="text-xs font-bold text-text-primary block">
                    FIDO2 Hardware Security Keys &amp; Biometric Passkeys (WebAuthn)
                  </strong>
                  <span className="text-[11px] text-text-secondary">Touch ID, Windows Hello, and YubiKey support.</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={passkeysEnabled}
                onChange={(e) => setPasskeysEnabled(e.target.checked)}
                className="h-4 w-4 rounded-sm border-border text-primary focus:ring-primary"
              />
            </label>
          </div>
        </div>

        {/* Inactivity & Session Timeout */}
        <div className="border-t border-border/80 pt-6 space-y-4">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>Administrative Session Timeout</span>
          </h3>

          <div className="max-w-md">
            <label className="block text-xs font-bold text-text-primary mb-1.5">
              Idle Inactivity Invalidation Window
            </label>
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="w-full rounded-2xl border border-border bg-surface/50 px-4 py-2.5 text-xs text-text-primary focus:border-primary focus:bg-white focus:outline-hidden"
            >
              <option value="15">15 Minutes (Strict Security Standard)</option>
              <option value="30">30 Minutes (Recommended)</option>
              <option value="60">60 Minutes</option>
              <option value="120">2 Hours</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/80">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="rounded-2xl shadow-button px-6"
          >
            Update Security Policies
          </Button>
        </div>
      </form>
    </div>
  );
}
