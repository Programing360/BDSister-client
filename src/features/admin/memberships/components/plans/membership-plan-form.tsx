"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AOS from "aos";
import {
  Sparkles,
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  ChevronRight,
  Info,
} from "lucide-react";
import type { MembershipPlan, PlanBillingDuration, PlanStatus } from "../../types/membership";
import { DEMO_MEMBERSHIP_PLANS } from "../../data/mock-memberships";

interface MembershipPlanFormProps {
  initialPlan?: MembershipPlan;
  isEdit?: boolean;
}

export function MembershipPlanForm({ initialPlan, isEdit = false }: MembershipPlanFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialPlan?.name || "");
  const [description, setDescription] = useState(initialPlan?.description || "");
  const [type, setType] = useState<"FREE" | "PAID">(initialPlan?.type || "PAID");
  const [priceBDT, setPriceBDT] = useState<number>(initialPlan?.priceBDT ?? 3500);
  const [billingDuration, setBillingDuration] = useState<PlanBillingDuration>(initialPlan?.billingDuration || "YEARLY");
  const [status, setStatus] = useState<PlanStatus>(initialPlan?.status || "ACTIVE");
  const [isFeatured, setIsFeatured] = useState<boolean>(initialPlan?.isFeatured ?? false);
  const [badgeText, setBadgeText] = useState(initialPlan?.badgeText || "");
  const [colorScheme, setColorScheme] = useState<"purple" | "emerald" | "amber" | "indigo" | "rose">(initialPlan?.colorScheme || "purple");

  const [benefits, setBenefits] = useState<string[]>(
    initialPlan?.benefits || [
      "Access to Artisan Marketplace Shopfront",
      "Verified Business Badge",
      "Up to 50 Product Listings",
      "ZiniPay Integrated Customer Checkout",
    ]
  );
  const [newBenefitText, setNewBenefitText] = useState("");
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: true,
      offset: 35,
    });
    AOS.refresh();
  }, []);

  const handleAddBenefit = () => {
    if (!newBenefitText.trim()) return;
    setBenefits((prev) => [...prev, newBenefitText.trim()]);
    setNewBenefitText("");
  };

  const handleRemoveBenefit = (idx: number) => {
    setBenefits((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackToast(
      isEdit
        ? `Membership plan "${name}" updated successfully (Client Simulation).`
        : `New membership tier "${name}" created (Client Simulation).`
    );
    setTimeout(() => {
      router.push("/admin/membership-plans");
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Toast */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-gray-900/95 backdrop-blur-md text-white text-xs font-semibold shadow-2xl shadow-purple-900/40 flex items-center gap-3 border border-gray-700 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Breadcrumb */}
      <nav
        data-aos="fade-down"
        className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
      >
        <Link href="/admin" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Admin
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/admin/membership-plans" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Membership Plans
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-semibold text-gray-900 dark:text-white">
          {isEdit ? "Edit Plan" : "Create Plan"}
        </span>
      </nav>

      {/* Header */}
      <div
        data-aos="fade-down"
        data-aos-delay="50"
        className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-[#5B46F6] flex items-center justify-center border border-indigo-100 dark:border-indigo-900 shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
              {isEdit ? `Edit Plan: ${name}` : "Configure New Membership Plan"}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Specify pricing, manual renewal schedules, and curated sister benefits
            </p>
          </div>
        </div>

        <Link
          href="/admin/membership-plans"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all border border-gray-200 dark:border-gray-800 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Cancel</span>
        </Link>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        data-aos="fade-up"
        data-aos-delay="100"
        className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-purple-500/5 space-y-6"
      >
        {/* Name & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Plan Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sister Entrepreneur Annual"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-hidden focus:border-[#5B46F6]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Membership Type *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setType("FREE");
                  setPriceBDT(0);
                }}
                className={`p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  type === "FREE"
                    ? "border-[#5B46F6] bg-indigo-50 dark:bg-indigo-950/40 text-[#5B46F6]"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Free Tier (৳0)
              </button>
              <button
                type="button"
                onClick={() => setType("PAID")}
                className={`p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  type === "PAID"
                    ? "border-[#5B46F6] bg-indigo-50 dark:bg-indigo-950/40 text-[#5B46F6]"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Paid Entrepreneur Tier
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Plan Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Outline who this membership tier is designed for and key value propositions..."
            className="w-full p-3 text-xs rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-hidden focus:border-[#5B46F6]"
          />
        </div>

        {/* Pricing & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Price in Bangladeshi Taka (BDT ৳) *
            </label>
            <input
              type="number"
              disabled={type === "FREE"}
              value={priceBDT}
              onChange={(e) => setPriceBDT(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-hidden focus:border-[#5B46F6] disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Billing Duration (Manual Renewal) *
            </label>
            <select
              value={billingDuration}
              onChange={(e) => setBillingDuration(e.target.value as PlanBillingDuration)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:outline-hidden focus:border-[#5B46F6]"
            >
              <option value="MONTHLY">Monthly (30 Days)</option>
              <option value="QUARTERLY">Quarterly (90 Days)</option>
              <option value="HALF_YEARLY">Half-Yearly (180 Days)</option>
              <option value="YEARLY">Yearly (365 Days)</option>
              <option value="LIFETIME">Lifetime Perpetual</option>
              <option value="CUSTOM">Custom Duration</option>
            </select>
          </div>
        </div>

        {/* Benefits Management */}
        <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
            Included Platform Benefits
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newBenefitText}
              onChange={(e) => setNewBenefitText(e.target.value)}
              placeholder="e.g. Free admission to Boishakhi Artisan Fair..."
              className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-hidden focus:border-[#5B46F6]"
            />
            <button
              type="button"
              onClick={handleAddBenefit}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-[#5B46F6] bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 border border-indigo-200 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-2">
            {benefits.map((b, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-xs"
              >
                <span className="font-medium text-gray-800 dark:text-gray-200">{b}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveBenefit(idx)}
                  className="text-gray-400 hover:text-rose-500 transition p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Status, Featured & Color Scheme */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Plan Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PlanStatus)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            >
              <option value="ACTIVE">Active (Enrollment Open)</option>
              <option value="INACTIVE">Inactive (Hidden)</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Badge Tag (Optional)
            </label>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              placeholder="e.g. Most Popular / VIP"
              className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Theme Accent
            </label>
            <select
              value={colorScheme}
              onChange={(e) => setColorScheme(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            >
              <option value="purple">Purple (Brand Primary)</option>
              <option value="amber">Amber (VIP Circle)</option>
              <option value="emerald">Emerald (Starter)</option>
              <option value="indigo">Indigo (Community)</option>
              <option value="rose">Rose (Festive)</option>
            </select>
          </div>
        </div>

        {/* Form Footer */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            Simulation Notice: Local state update. No backend database mutation.
          </span>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#5B46F6] hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isEdit ? "Save Plan Changes" : "Publish Membership Plan"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
