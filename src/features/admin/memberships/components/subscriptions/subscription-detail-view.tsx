"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AOS from "aos";
import {
  Users,
  ArrowLeft,
  Clock,
  Sparkles,
  CreditCard,
  ShieldCheck,
  ChevronRight,
  Info,
  Calendar,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import type { MembershipSubscription } from "../../types/membership";
import { formatBDT } from "../../../payments/data/mock-payments";
import { SubscriptionStatusBadge } from "../common/subscription-status-badge";

interface SubscriptionDetailViewProps {
  subscription: MembershipSubscription;
}

export function SubscriptionDetailView({ subscription }: SubscriptionDetailViewProps) {
  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: true,
      offset: 35,
    });
    AOS.refresh();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Breadcrumb */}
      <nav
        data-aos="fade-down"
        className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
      >
        <Link href="/admin" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Admin
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/admin/subscriptions" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Subscriptions
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-mono font-semibold text-gray-900 dark:text-white">
          {subscription.subscriptionCode}
        </span>
      </nav>

      {/* Header */}
      <div
        data-aos="fade-down"
        data-aos-delay="50"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-[#5B46F6] flex items-center justify-center border border-indigo-100 dark:border-indigo-900 shadow-lg shadow-indigo-500/10">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl lg:text-2xl font-mono font-semibold text-gray-900 dark:text-white tracking-tight">
                  {subscription.subscriptionCode}
                </h1>
                <SubscriptionStatusBadge status={subscription.status} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {subscription.planName} • Member: {subscription.memberName} ({subscription.memberId})
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/subscriptions"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all border border-gray-200 dark:border-gray-800 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Subscriptions</span>
        </Link>
      </div>

      {/* Manual Renewal Notice */}
      <div
        data-aos="fade-up"
        className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300"
      >
        <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold">Manual Renewal Architecture: </span>
          BDSisters memberships never execute automatic credit/debit recurring charges. Members are notified 30 days prior to expiry to review and initiate manual checkout through ZiniPay.
        </div>
      </div>

      {/* Key Overview Cards */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-purple-500/5 space-y-2">
          <span className="text-xs font-semibold text-gray-500">Subscription Dues</span>
          <div className="text-2xl font-semibold text-gray-900 dark:text-white">
            {formatBDT(subscription.amountBDT)}
          </div>
          <p className="text-[11px] text-gray-400">Reference: {subscription.paymentReference}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-indigo-500/5 space-y-2">
          <span className="text-xs font-semibold text-gray-500">Subscription Timeline</span>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            {subscription.startDate} → {subscription.expiryDate}
          </div>
          <p className="text-[11px] text-gray-400">Next Notice: {subscription.nextRenewalNotice}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-emerald-500/5 space-y-2">
          <span className="text-xs font-semibold text-gray-500">Renewal Mode</span>
          <div className="text-base font-semibold text-emerald-600">
            Manual Review & Approval
          </div>
          <p className="text-[11px] text-gray-400">Auto-debit permanently disabled</p>
        </div>
      </div>

      {/* Payment History Table */}
      <div
        data-aos="fade-up"
        data-aos-delay="150"
        className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-purple-500/5 space-y-4"
      >
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
          <CreditCard className="w-4 h-4 text-[#5B46F6]" />
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
            Subscription Payment Settlements
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800/60 font-semibold text-gray-600 border-b border-gray-100">
              <tr>
                <th className="p-3">Transaction ID</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Settlement Date</th>
                <th className="p-3">Method</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
              {subscription.paymentHistory.map((rec, idx) => (
                <tr key={idx}>
                  <td className="p-3 font-mono font-semibold text-[#5B46F6]">{rec.trxId}</td>
                  <td className="p-3 font-mono font-semibold">{formatBDT(rec.amountBDT)}</td>
                  <td className="p-3">{rec.date}</td>
                  <td className="p-3">{rec.method}</td>
                  <td className="p-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lifecycle Timeline */}
      <div
        data-aos="fade-up"
        data-aos-delay="200"
        className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-purple-500/5 space-y-4"
      >
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
          <Clock className="w-4 h-4 text-amber-500" />
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
            Subscription Status Timeline
          </h3>
        </div>

        <div className="space-y-3">
          {subscription.timeline.map((entry, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#5B46F6] mt-1.5 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-gray-900 dark:text-white">{entry.status}</span>
                  <span className="font-mono text-[10px] text-gray-400">{entry.timestamp}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{entry.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
