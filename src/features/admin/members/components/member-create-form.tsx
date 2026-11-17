"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Upload,
  Info,
} from "lucide-react";
import { MembershipType } from "../types/admin-member";
import { BD_DISTRICTS } from "../data/bangladesh-locations";

export function MemberCreateForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "+880 1",
    membershipType: "FREE" as MembershipType,
    city: "Dhaka",
    district: "Dhaka",
    country: "Bangladesh",
    accountStatus: "ACTIVE",
    adminNote: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdMemberId, setCreatedMemberId] = useState("");

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      newErrors.phone = "Valid Bangladeshi phone number is required.";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const newId = `BDS-MEM-${Math.floor(10000 + Math.random() * 90000)}`;
      setCreatedMemberId(newId);
      setIsSuccess(true);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/members"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Members List
        </Link>
        <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-[#5B46F6] font-medium border border-indigo-100 dark:border-indigo-900/60">
          Admin Direct Provisioning
        </span>
      </div>

      {/* Title & description */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-[#5B46F6]">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Add New Member
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Provision a member profile directly from the administrative portal.
            </p>
          </div>
        </div>

        {/* Frontend Demo Banner */}
        <div className="mt-5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-3">
          <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <p className="font-semibold">Frontend Simulation Mode</p>
            <p className="mt-0.5 text-amber-800/90 dark:text-amber-400/90">
              In this frontend development phase, submitting this form validates inputs, generates a synthetic member identifier, and provides user feedback without persistent database modifications.
            </p>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {isSuccess ? (
        <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-800 shadow-sm text-center space-y-4">
          <div className="inline-flex p-3 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Member Provisioned Successfully!
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-md mx-auto">
              Member <span className="font-semibold text-gray-900 dark:text-white">{formData.firstName} {formData.lastName}</span> has been simulated with identifier:
            </p>
            <div className="mt-2 inline-block px-3.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 font-mono text-sm font-bold text-[#5B46F6]">
              {createdMemberId}
            </div>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setIsSuccess(false);
                setFormData({
                  firstName: "",
                  lastName: "",
                  email: "",
                  phone: "+880 1",
                  membershipType: "FREE",
                  city: "Dhaka",
                  district: "Dhaka",
                  country: "Bangladesh",
                  accountStatus: "ACTIVE",
                  adminNote: "",
                });
                setAvatarPreview(null);
              }}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Add Another Member
            </button>
            <button
              onClick={() => router.push("/admin/members")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#5B46F6] text-white hover:bg-[#4a36e2] transition shadow-xs"
            >
              Return to Members List
            </button>
          </div>
        </div>
      ) : (
        /* Form Content */
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
              Personal Information
            </h2>

            {/* Avatar upload preview */}
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 overflow-hidden flex items-center justify-center relative group">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="w-6 h-6 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition" />
                )}
              </div>
              <div>
                <label
                  htmlFor="avatar-upload"
                  className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload Avatar (Optional)
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  JPG, PNG or WebP up to 3MB. Standard 1:1 ratio recommended.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* First Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="e.g. Farhana"
                  className={`w-full text-sm rounded-xl border p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden transition ${
                    errors.firstName ? "border-rose-500 focus:ring-1 focus:ring-rose-500" : "border-gray-200 dark:border-gray-700 focus:border-[#5B46F6]"
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="e.g. Yeasmin"
                  className={`w-full text-sm rounded-xl border p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden transition ${
                    errors.lastName ? "border-rose-500 focus:ring-1 focus:ring-rose-500" : "border-gray-200 dark:border-gray-700 focus:border-[#5B46F6]"
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.lastName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. farhana.yeasmin@example.com"
                  className={`w-full text-sm rounded-xl border p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden transition ${
                    errors.email ? "border-rose-500 focus:ring-1 focus:ring-rose-500" : "border-gray-200 dark:border-gray-700 focus:border-[#5B46F6]"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                  </p>
                )}
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
                  placeholder="+880 1712-345678"
                  className={`w-full text-sm rounded-xl border p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden transition ${
                    errors.phone ? "border-rose-500 focus:ring-1 focus:ring-rose-500" : "border-gray-200 dark:border-gray-700 focus:border-[#5B46F6]"
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Membership & Status */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
              Membership & Status
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Membership Tier */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Membership Tier
                </label>
                <select
                  value={formData.membershipType}
                  onChange={(e) => setFormData({ ...formData, membershipType: e.target.value as MembershipType })}
                  className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden focus:border-[#5B46F6]"
                >
                  <option value="FREE">Free Community Member</option>
                  <option value="PAID">Paid Entrepreneur Member</option>
                </select>
                <p className="text-[11px] text-gray-500 mt-1">
                  Paid tier unlocks multi-shop setup, direct inventory, and verified badge eligibility.
                </p>
              </div>

              {/* Initial Account Status */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Account Status
                </label>
                <select
                  value={formData.accountStatus}
                  onChange={(e) => setFormData({ ...formData, accountStatus: e.target.value })}
                  className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden focus:border-[#5B46F6]"
                >
                  <option value="ACTIVE">Active (Immediate Access)</option>
                  <option value="PENDING">Pending (Email Verification Required)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location & District */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
              Location Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* City */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  City / Area <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Dhanmondi, Dhaka"
                  className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden focus:border-[#5B46F6]"
                />
              </div>

              {/* District */}
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

              {/* Country */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.country}
                  className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Internal Administration Note */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
              Internal Administration Note (Optional)
            </h2>
            <textarea
              rows={3}
              value={formData.adminNote}
              onChange={(e) => setFormData({ ...formData, adminNote: e.target.value })}
              placeholder="Add internal notes regarding this member's onboarding source, sponsor, or fast-track approval rationale..."
              className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden focus:border-[#5B46F6] placeholder-gray-400"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/admin/members"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#5B46F6] text-white hover:bg-[#4a36e2] transition shadow-xs focus:ring-2 focus:ring-[#5B46F6] focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? "Provisioning..." : "Provision Member"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
