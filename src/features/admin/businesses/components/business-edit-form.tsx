"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AdminBusinessItem, BusinessType, BusinessApprovalStatus, BusinessVerificationStatus } from "../types/admin-business.ts";
import { INITIAL_BUSINESS_CATEGORIES } from "../constants/business-categories.ts";
import { ArrowLeft, Save, Building2, CheckCircle2, AlertCircle } from "lucide-react";

interface BusinessEditFormProps {
  business: AdminBusinessItem;
}

export function BusinessEditForm({ business }: BusinessEditFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<AdminBusinessItem>({ ...business });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setToastMessage("Business information saved successfully (local state)!");
      setTimeout(() => {
        router.push(`/admin/businesses/${business.id}`);
      }, 1000);
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href={`/admin/businesses/${business.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Business Details</span>
        </Link>
        <div className="text-xs text-gray-400 font-mono">
          Editing: <span className="font-semibold text-gray-700">{business.businessCode}</span>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#EAE6F7] text-[#5B46F6]">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Admin Business Editor</h2>
            <p className="text-xs text-gray-500">Update business profile, classification, contacts, and moderation parameters.</p>
          </div>
        </div>

        <div className="p-6 space-y-6 text-xs">
          {/* Section 1: Core Identity */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">1. Identity & Classification</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Business Name (English) *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20 focus:border-[#5B46F6]"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Business Name (Bangla)</label>
                <input
                  type="text"
                  value={formData.nameBn || ""}
                  onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                  placeholder="e.g. নীলাম্বরী জামদানি"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20 focus:border-[#5B46F6]"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20 focus:border-[#5B46F6]"
                >
                  {INITIAL_BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Legal Business Type *</label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value as BusinessType })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20 focus:border-[#5B46F6]"
                >
                  <option value="Sole Proprietorship">Sole Proprietorship</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Private Limited Company">Private Limited Company</option>
                  <option value="Social Enterprise">Social Enterprise</option>
                  <option value="Cottage / Artisan Studio">Cottage / Artisan Studio</option>
                  <option value="Online Startup">Online Startup</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-gray-700 mb-1">Tagline / Motto</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20 focus:border-[#5B46F6]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-gray-700 mb-1">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20 focus:border-[#5B46F6]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-gray-700 mb-1">Full Description</label>
                <textarea
                  rows={4}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20 focus:border-[#5B46F6]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Administrative Moderation Status */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">2. Administrative & Moderation Controls</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Approval Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as BusinessApprovalStatus })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium"
                >
                  <option value="APPROVED">APPROVED</option>
                  <option value="PENDING_REVIEW">PENDING_REVIEW</option>
                  <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="DRAFT">DRAFT</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Verification Status</label>
                <select
                  value={formData.verificationStatus}
                  onChange={(e) => setFormData({ ...formData, verificationStatus: e.target.value as BusinessVerificationStatus })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium"
                >
                  <option value="VERIFIED">VERIFIED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="NOT_SUBMITTED">NOT_SUBMITTED</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Featured Spotlight</label>
                <select
                  value={formData.isFeatured ? "true" : "false"}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.value === "true" })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                >
                  <option value="true">Featured (Promoted Spotlight)</option>
                  <option value="false">Standard Listing</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block font-medium text-gray-700 mb-1">Admin Moderation Notes</label>
                <textarea
                  rows={2}
                  value={formData.moderationNotes || ""}
                  onChange={(e) => setFormData({ ...formData, moderationNotes: e.target.value })}
                  placeholder="Internal log of administrative checks, licenses, verification visits..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Contact & Location */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">3. Contact & Location</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={formData.contact.phone}
                  onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Division</label>
                <input
                  type="text"
                  value={formData.location.division}
                  onChange={(e) => setFormData({ ...formData, location: { ...formData.location, division: e.target.value } })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">City / Upazila</label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="p-6 bg-gray-50/75 border-t border-gray-100 flex items-center justify-end gap-3">
          <Link
            href={`/admin/businesses/${business.id}`}
            className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#5B46F6] hover:bg-[#4f3ad8] rounded-lg transition-colors shadow-xs disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Saving Changes..." : "Save Business Profile"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
