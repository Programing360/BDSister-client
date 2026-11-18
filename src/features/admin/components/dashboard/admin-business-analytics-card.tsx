"use client";

import React from "react";
import Link from "next/link";
import {
  Briefcase,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import {
  DEMO_BUSINESS_CATEGORIES,
  DEMO_RECENT_BUSINESS_SUBMISSIONS,
  DEMO_BUSINESS_VERIFICATION_SUMMARY,
} from "../../data/admin-analytics-data";

export function AdminBusinessAnalyticsCard() {
  return (
    <div className="rounded-2xl border-gray-200/80 bg-white p-6  space-y-6">
      {/* 1. Header with View All Navigation */}
      <div className="gap-2  border-b border-gray-100 pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-[#5B46F6]">
              <Briefcase className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-[#111827]">
              Business Ecosystem & Enterprise Analytics
            </h3>
          </div>
          <Link
            href="/admin/businesses"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B46F6] hover:text-[#7366F7] transition"
          >
            <span>View All Businesses</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <p className="text-xs text-[#4B5563] mt-1">
          Artisan business onboarding, category footprint across Bangladesh, and compliance audit rates.
        </p>


      </div>

      {/* 2. Business Status Metric Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5">
          <span className="text-[11px] font-semibold text-gray-500">Total Profiles</span>
          <p className="mt-1 text-xl font-black text-gray-900">1,248</p>
          <span className="text-[10px] text-gray-400">All registered</span>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3.5">
          <span className="text-[11px] font-semibold text-emerald-800">Published & Live</span>
          <p className="mt-1 text-xl font-black text-emerald-700">982</p>
          <span className="text-[10px] text-emerald-600 font-bold">78.7% publication rate</span>
        </div>

        <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3.5">
          <span className="text-[11px] font-semibold text-amber-800">Pending Review</span>
          <p className="mt-1 text-xl font-black text-amber-700">14</p>
          <span className="text-[10px] text-amber-600 font-bold">Active audit queue</span>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5">
          <span className="text-[11px] font-semibold text-gray-500">Suspended / Draft</span>
          <p className="mt-1 text-xl font-black text-gray-700">252</p>
          <span className="text-[10px] text-gray-400">Incomplete setup</span>
        </div>
      </div>

      {/* 3. Business Category Distribution */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Category Sector Distribution
          </h4>
          <span className="text-xs text-gray-400">Across 6 primary sectors</span>
        </div>

        <div className="space-y-2.5">
          {DEMO_BUSINESS_CATEGORIES.map((cat) => (
            <div key={cat.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-gray-700 font-semibold">{cat.categoryName}</span>
                <span className="text-gray-500">
                  {cat.count} enterprises ({cat.percentage}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.color,
                  }}
                  className="h-full rounded-full transition-all duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Verification Compliance Summary */}
      <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#5B46F6]" />
          <h4 className="text-xs font-bold text-gray-900">
            Enterprise Verification & Compliance Health
          </h4>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-center">
          <div className="rounded-lg bg-white p-2.5 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-500">Trade License</span>
            <p className="text-base font-black text-emerald-700 mt-0.5">
              {DEMO_BUSINESS_VERIFICATION_SUMMARY.tradeLicenseVerifiedRate}%
            </p>
            <span className="text-[9px] text-gray-400">Verified</span>
          </div>

          <div className="rounded-lg bg-white p-2.5 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-500">e-TIN Tax Cert</span>
            <p className="text-base font-black text-emerald-700 mt-0.5">
              {DEMO_BUSINESS_VERIFICATION_SUMMARY.tinVerifiedRate}%
            </p>
            <span className="text-[9px] text-gray-400">Verified</span>
          </div>

          <div className="rounded-lg bg-white p-2.5 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-500">NID Smart Identity</span>
            <p className="text-base font-black text-emerald-700 mt-0.5">
              {DEMO_BUSINESS_VERIFICATION_SUMMARY.nidVerifiedRate}%
            </p>
            <span className="text-[9px] text-gray-400">Verified</span>
          </div>

          <div className="rounded-lg bg-white p-2.5 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-500">Avg Audit Time</span>
            <p className="text-base font-black text-[#5B46F6] mt-0.5">
              {DEMO_BUSINESS_VERIFICATION_SUMMARY.averageReviewTimeHours}h
            </p>
            <span className="text-[9px] text-gray-400">SLA met</span>
          </div>
        </div>
      </div>

      {/* 5. Recently Submitted Businesses List */}
      <div className="space-y-3 border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Recently Submitted Enterprises
          </h4>
          <Link
            href="/admin/businesses/pending"
            className="text-[11px] font-bold text-[#5B46F6] hover:underline"
          >
            Review Pending Queue (14)
          </Link>
        </div>

        <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden">
          {DEMO_RECENT_BUSINESS_SUBMISSIONS.map((biz) => (
            <div
              key={biz.id}
              className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3.5 hover:bg-gray-50/80 transition"
            >
              <div>
                <p className="text-xs font-bold text-gray-900">{biz.businessName}</p>
                <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                  <span>Founder: {biz.ownerName}</span>
                  <span>•</span>
                  <span>{biz.category}</span>
                  <span>•</span>
                  <span>{biz.submittedAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${biz.status === "APPROVED"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : biz.status === "PENDING_VERIFICATION"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-purple-50 text-[#5B46F6] border border-purple-200"
                    }`}
                >
                  {biz.status === "APPROVED"
                    ? "Approved"
                    : biz.status === "PENDING_VERIFICATION"
                      ? "Pending Verification"
                      : "Under Review"}
                </span>

                <Link
                  href="/admin/businesses/pending"
                  className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-bold text-gray-700 hover:border-[#5B46F6] hover:text-[#5B46F6] transition shadow-2xs"
                >
                  Review Docs
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
