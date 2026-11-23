"use client";

import React, { useState, useEffect } from "react";
import {
  KeyRound,
  Smartphone,
  Laptop,

  Trash2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { settingsService } from "@/lib/services/settings-service";
import type { SecuritySettingsData } from "../types";

export function SecuritySettingsView() {
  const [securityData, setSecurityData] = useState<SecuritySettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 2FA state
  const [isUpdating2FA, setIsUpdating2FA] = useState(false);

  useEffect(() => {
    let isMounted = true;
    settingsService.getSecuritySettings().then((data) => {
      if (isMounted) {
        setSecurityData(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await settingsService.changePassword({
        currentPassword,
        newPassword,
      });
      toast.success(res.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error((err as Error).message || "Failed to update password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleToggle2FA = async () => {
    if (!securityData) return;
    const nextState = !securityData.twoFactorEnabled;
    setIsUpdating2FA(true);
    try {
      await settingsService.toggle2FA(nextState, securityData.twoFactorMethod);
      setSecurityData({
        ...securityData,
        twoFactorEnabled: nextState,
      });
      toast.success(
        nextState
          ? "Two-Factor Authentication has been enabled."
          : "Two-Factor Authentication has been disabled."
      );
    } catch {
      toast.error("Could not update 2FA status.");
    } finally {
      setIsUpdating2FA(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await settingsService.revokeSession(sessionId);
      if (securityData) {
        setSecurityData({
          ...securityData,
          activeSessions: securityData.activeSessions.filter((s) => s.id !== sessionId),
        });
      }
      toast.success("Device session revoked.");
    } catch {
      toast.error("Failed to revoke session.");
    }
  };

  const handleRevokeAllOther = async () => {
    try {
      const res = await settingsService.revokeAllOtherSessions();
      if (securityData) {
        setSecurityData({
          ...securityData,
          activeSessions: securityData.activeSessions.filter((s) => s.isCurrent),
        });
      }
      toast.success(`Revoked ${res.revokedCount} other active sessions.`);
    } catch {
      toast.error("Failed to revoke sessions.");
    }
  };

  if (isLoading || !securityData) {
    return (
      <div className="rounded-3xl border border-gray-200/80 bg-white p-12 text-center text-gray-500">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#5B46F6] mb-2" />
        <p className="text-xs font-semibold">Loading security credentials...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Change Password Card */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B46F6]">
            <KeyRound className="h-3.5 w-3.5" />
            <span>Authentication</span>
          </div>
          <h3 className="text-base font-bold text-gray-900 mt-1">Change Account Password</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Use a strong, unique password with at least 8 characters including letters, numbers, and symbols.
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700">Current Password</label>
            <Input
              type={showPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              leftIcon={<Lock className="h-4 w-4" />}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700">New Password</label>
              <Input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                leftIcon={<Lock className="h-4 w-4" />}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700">Confirm New Password</label>
              <Input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                leftIcon={<Lock className="h-4 w-4" />}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium"
            >
              {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{showPassword ? "Hide passwords" : "Show passwords"}</span>
            </button>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isChangingPassword}
              className="font-bold px-5"
            >
              Update Password
            </Button>
          </div>
        </form>
      </div>

      {/* Two-Factor Authentication Card */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900">Two-Factor Authentication (2FA)</h3>
              {securityData.twoFactorEnabled ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                  <AlertTriangle className="h-3 w-3" />
                  Inactive
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 max-w-xl leading-relaxed">
              Add an additional layer of security to prevent unauthorized access. When enabled, signing in requires a verification code sent to your phone or authenticator app.
            </p>
          </div>

          <Button
            type="button"
            variant={securityData.twoFactorEnabled ? "outline" : "primary"}
            size="sm"
            onClick={handleToggle2FA}
            isLoading={isUpdating2FA}
            className="self-start sm:self-center font-bold text-xs"
          >
            {securityData.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA Protection"}
          </Button>
        </div>
      </div>

      {/* Active Sessions & Devices */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B46F6]">
              <Laptop className="h-3.5 w-3.5" />
              <span>Device Security</span>
            </div>
            <h3 className="text-base font-bold text-gray-900 mt-1">Active Login Sessions</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Devices currently signed in to your sister member account.
            </p>
          </div>

          {securityData.activeSessions.filter((s) => !s.isCurrent).length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRevokeAllOther}
              className="text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              Sign out other devices
            </Button>
          )}
        </div>

        <div className="divide-y divide-gray-100 space-y-1">
          {securityData.activeSessions.map((session) => (
            <div
              key={session.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-[#5B46F6] border border-purple-100">
                  {session.device.includes("Mobile") ? (
                    <Smartphone className="h-5 w-5" />
                  ) : (
                    <Laptop className="h-5 w-5" />
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="text-xs sm:text-sm font-bold text-gray-900">{session.device}</p>
                    {session.isCurrent && (
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                        This Device
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {session.browser} • {session.ipAddress} • {session.location}
                  </p>
                  <p className="text-[10px] text-gray-400">{session.lastActive}</p>
                </div>
              </div>

              {!session.isCurrent && (
                <button
                  type="button"
                  onClick={() => handleRevokeSession(session.id)}
                  title="Revoke session"
                  className="self-end sm:self-center flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-700 hover:underline"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Revoke</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
