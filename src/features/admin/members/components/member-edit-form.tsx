"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
} from "lucide-react";
import { AdminMemberDetail, AdminAccountStatus, MembershipType } from "../types/admin-member";
import { BD_DISTRICTS } from "../data/bangladesh-locations";

interface MemberEditFormProps {
  member: AdminMemberDetail;
}

export function MemberEditForm({ member }: MemberEditFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: member.name,
    phone: member.phone,
    membershipType: member.membershipType,
    membershipPlan: member.membershipPlan,
    accountStatus: member.accountStatus,
    city: member.location?.city || "Dhaka",
    district: member.location?.district || "Dhaka",
    headline: member.headline || "",
    bio: member.bio || "",
    adminNote: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(`Member "${formData.name}" information updated successfully (Frontend Simulation).`);
      setTimeout(() => {
        router.push(`/admin/members/${member.memberId || member.id}`);
      }, 1500);
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/admin/members/${member.memberId || member.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Member Details
        </Link>
        <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-[#5B46F6] font-medium border border-indigo-100 dark:border-indigo-900/60 font-mono">
          {member.memberId}
        </span>
      </div>

      {/* Header card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Member Profile
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Modify account status, tier privileges, and contact records for {member.name}.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-gray-400 block">Member Since</span>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 font-mono">
              {member.joinedDate}
            </span>
          </div>
        </div>

        {/* Frontend Demo Banner */}
        <div className="mt-5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-3">
          <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <p className="font-semibold">Frontend Simulation Mode</p>
            <p className="mt-0.5 text-amber-800/90 dark:text-amber-400/90">
              Changes submitted here are validated and demonstrated in the client-side state. Real backend synchronization will occur in the database integration phase.
            </p>
          </div>
        </div>
      </div>

      {/* Success banner */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <p className="text-sm font-medium">{successMessage}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Member Details */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
            Core Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden focus:border-[#5B46F6]"
                required
              />
            </div>

            {/* Email (Read only for security) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Email Address (Immutable)
              </label>
              <input
                type="email"
                disabled
                value={member.email}
                className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50 text-gray-500 cursor-not-allowed font-mono"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Email changes require formal identity re-verification request.
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden focus:border-[#5B46F6]"
                required
              />
            </div>

            {/* Professional Headline */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Professional Headline
              </label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                placeholder="e.g. Founder & Creative Director, Nilambari Craft"
                className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden focus:border-[#5B46F6]"
              />
            </div>
          </div>
        </div>

        {/* Administration & Privilege Controls */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-[#5B46F6]" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Status & Membership Privileges
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Account Status */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Account Status
              </label>
              <select
                value={formData.accountStatus}
                onChange={(e) => setFormData({ ...formData, accountStatus: e.target.value as AdminAccountStatus })}
                className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden focus:border-[#5B46F6]"
              >
                <option value="ACTIVE">Active (Normal Access)</option>
                <option value="PENDING">Pending (Awaiting Email Confirmation)</option>
                <option value="SUSPENDED">Suspended (Temporary Revocation)</option>
                <option value="BANNED">Banned (Permanent Lockout)</option>
              </select>

              {(formData.accountStatus === "SUSPENDED" || formData.accountStatus === "BANNED") && (
                <div className="mt-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    Warning: Changing to {formData.accountStatus} will immediately block the user from logging in and accessing their stores.
                  </span>
                </div>
              )}
            </div>

            {/* Membership Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Membership Tier
              </label>
              <select
                value={formData.membershipType}
                onChange={(e) => {
                  const newType = e.target.value as MembershipType;
                  setFormData({
                    ...formData,
                    membershipType: newType,
                    membershipPlan: newType === "PAID" ? "Pro Entrepreneur" : "Free Community",
                  });
                }}
                className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden focus:border-[#5B46F6]"
              >
                <option value="FREE">Free Community</option>
                <option value="PAID">Paid Entrepreneur Tier</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location Controls */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
            Location Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                City / Area
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden focus:border-[#5B46F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                District
              </label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden focus:border-[#5B46F6]"
              >
                {BD_DISTRICTS.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Internal Admin Note */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
            Internal Audit Log Note
          </h2>
          <textarea
            rows={3}
            value={formData.adminNote}
            onChange={(e) => setFormData({ ...formData, adminNote: e.target.value })}
            placeholder="Record the reason for this manual administrative modification..."
            className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden focus:border-[#5B46F6] placeholder-gray-400"
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href={`/admin/members/${member.memberId || member.id}`}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#5B46F6] text-white hover:bg-[#4a36e2] transition shadow-xs focus:ring-2 focus:ring-[#5B46F6] focus:ring-offset-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Saving..." : "Save Member Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
