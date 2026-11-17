import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, CheckCircle2, Clock, FileText, AlertCircle } from "lucide-react";
import { requireServerSession } from "@/lib/auth/session";
import { getProfileByUserId } from "@/lib/services/profile-service";

export const metadata: Metadata = {
  title: "Sisterhood Verification | BDSisters",
  description: "Verify your Bangladeshi identity and unlock exclusive verified sister trust badges.",
};

export default async function VerificationPage() {
  const session = await requireServerSession("/member/profile/verification");
  const profile = await getProfileByUserId(session.user.id);
  const isVerified = Boolean(profile.isVerified || session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN");

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      {/* Top Header */}
      <div className="flex items-center gap-3 bg-white p-5 rounded-3xl shadow-xl border border-gray-200/80">
        <Link
          href="/member/profile"
          className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          title="Back to profile"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Sisterhood Identity Verification</h1>
          <p className="text-xs text-gray-500">
            Build trust within the women&apos;s network with authenticated identity verification.
          </p>
        </div>
      </div>

      {/* Current Status Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/80">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
              isVerified
                ? "bg-emerald-100 text-emerald-700"
                : "bg-purple-100 text-[#5B46F6]"
            }`}
          >
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-lg font-bold text-gray-900">
                {isVerified ? "Verified Sister Status Active" : "Verification Pending / Not Submitted"}
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  isVerified
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {isVerified ? "VERIFIED" : "UNVERIFIED"}
              </span>
            </div>
            <p className="text-xs text-gray-600 max-w-xl">
              {isVerified
                ? "Your account holds an authenticated BDSisters badge. You enjoy top placement in member searches, priority marketplace listings, and verified peer status."
                : "Complete verification to unlock verified badges across your shop, peer discussions, and mentorship applications."}
            </p>
          </div>
        </div>
      </div>

      {/* Verification Steps Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-200/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5B46F6] flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">1. National ID / Passport</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Upload a clear scan of your Bangladeshi National ID (NID), Passport, or academic institution ID card.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-200/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5B46F6] flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">2. Sisterhood Review</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Our specialized female moderation team reviews your application securely within 24 to 48 business hours.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-200/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5B46F6] flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">3. Verified Shield Badge</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Once approved, the green Verified Shield badge automatically reflects on your public and community profiles.
          </p>
        </div>
      </div>

      {/* Security note */}
      <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200/80 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#5B46F6] shrink-0 mt-0.5" />
        <p className="text-xs text-gray-600 leading-relaxed">
          <strong>Privacy Promise:</strong> Identity verification documents are strictly used for safety verification and fraud prevention. Documents are never made public and are encrypted with industry-standard protocols.
        </p>
      </div>
    </div>
  );
}
