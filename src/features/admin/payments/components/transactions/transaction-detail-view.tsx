"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AOS from "aos";
import {
  CreditCard,
  ArrowLeft,
  Copy,
  Check,
  ShieldCheck,
  User,
  Clock,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle2,
  Save,
  RotateCcw,
  Smartphone,
  Building,
} from "lucide-react";
import type { PaymentTransaction } from "../../types/payment";
import { formatBDT } from "../../data/mock-payments";
import {
  PaymentStatusBadge,
  PaymentTypeBadge,
  PaymentMethodBadge,
} from "../common/payment-status-badge";

interface TransactionDetailViewProps {
  transaction: PaymentTransaction;
}

export function TransactionDetailView({ transaction: initialTransaction }: TransactionDetailViewProps) {
  const [transaction, setTransaction] = useState<PaymentTransaction>(initialTransaction);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [internalNote, setInternalNote] = useState(transaction.internalNotes || "");
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

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    setTransaction((prev) => ({ ...prev, internalNotes: internalNote.trim() }));
    setFeedbackToast("Internal administrative notes saved (Client State Simulation).");
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
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
        <Link href="/admin/payments" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Payments
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/admin/payments/transactions" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Transactions
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-mono font-semibold text-gray-900 dark:text-white">
          {transaction.transactionId}
        </span>
      </nav>

      {/* Header Banner */}
      <div
        data-aos="fade-down"
        data-aos-delay="50"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-[#5B46F6] flex items-center justify-center border border-indigo-100 dark:border-indigo-900 shadow-lg shadow-indigo-500/10">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl lg:text-2xl font-mono font-semibold text-gray-900 dark:text-white tracking-tight">
                  {transaction.transactionId}
                </h1>
                <PaymentStatusBadge status={transaction.status} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Processed via ZiniPay merchant gateway • Initiated on {transaction.initiatedAt}
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/payments/transactions"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all border border-gray-200 dark:border-gray-800 shadow-md shadow-gray-200/50 dark:shadow-none hover:shadow-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Transactions</span>
        </Link>
      </div>

      {/* 3-Column Financial Cards */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Card 1: Settlement Breakdown */}
        <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-purple-500/5 hover:shadow-2xl hover:shadow-purple-500/10 transition-all space-y-3">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Settlement Breakdown
          </span>
          <div className="text-2xl font-semibold text-gray-900 dark:text-white">
            {formatBDT(transaction.amountBDT)}
          </div>
          <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Gross Customer Paid:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{formatBDT(transaction.amountBDT)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>ZiniPay Processing Fee (1.5%):</span>
              <span className="font-medium text-rose-600">-{formatBDT(transaction.feeBDT)}</span>
            </div>
            <div className="flex justify-between text-gray-800 dark:text-gray-200 font-semibold pt-1 border-t border-gray-100 dark:border-gray-800">
              <span>Net Settled to BDSisters:</span>
              <span className="text-emerald-600">{formatBDT(transaction.netAmountBDT)}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Customer / Sister Profile */}
        <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-indigo-500/5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Member Profile
            </span>
            <Link
              href={`/admin/members`}
              className="text-xs font-semibold text-[#5B46F6] hover:underline inline-flex items-center gap-1"
            >
              <span>View Member</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <div className="font-semibold text-base text-gray-900 dark:text-white">
            {transaction.memberName}
          </div>
          <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Member ID:</span>
              <span className="font-mono font-semibold text-gray-900 dark:text-white">{transaction.memberId}</span>
            </div>
            <div className="flex justify-between">
              <span>Email:</span>
              <span>{transaction.memberEmail}</span>
            </div>
            <div className="flex justify-between">
              <span>Phone:</span>
              <span>{transaction.memberPhone}</span>
            </div>
          </div>
        </div>

        {/* Card 3: ZiniPay Gateway Verification */}
        <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-emerald-500/5 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all space-y-3">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Gateway Verification
          </span>
          <div className="flex items-center gap-2">
            <PaymentMethodBadge method={transaction.paymentMethod} />
          </div>
          <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex justify-between items-center">
              <span>Gateway Trx ID:</span>
              <div className="flex items-center gap-1 font-mono font-semibold text-gray-900 dark:text-white">
                <span>{transaction.gatewayTrxId}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(transaction.gatewayTrxId, "znp")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {copiedKey === "znp" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <span>Reference Code:</span>
              <span className="font-mono">{transaction.paymentReference}</span>
            </div>
            <div className="flex justify-between">
              <span>IP Address:</span>
              <span className="font-mono">{transaction.ipAddress || "103.205.71.18"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Related Entity & Status Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Associated Plan / Order Details */}
        <div
          data-aos="fade-up"
          data-aos-delay="150"
          className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-purple-500/5 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#5B46F6]" />
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Related Entity & Purpose
              </h3>
            </div>
            <PaymentTypeBadge type={transaction.paymentType} />
          </div>

          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-2">
            <div className="font-semibold text-sm text-gray-900 dark:text-white">
              {transaction.relatedEntity.name}
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>Target ID: <strong className="font-mono text-gray-800 dark:text-gray-200">{transaction.relatedEntity.id}</strong></span>
              <span>•</span>
              <span>Category: <strong>{transaction.paymentType.replace("_", " ")}</strong></span>
            </div>
          </div>

          {transaction.refundAmountBDT ? (
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-purple-900 dark:text-purple-300">
                <RotateCcw className="w-4 h-4" />
                <span>Refund Processed on this Transaction</span>
              </div>
              <p className="text-purple-700 dark:text-purple-400">
                A refund of {formatBDT(transaction.refundAmountBDT)} was settled back to customer&apos;s ZiniPay wallet.
              </p>
            </div>
          ) : null}
        </div>

        {/* Status Transition Timeline */}
        <div
          data-aos="fade-up"
          data-aos-delay="200"
          className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-purple-500/5 space-y-4"
        >
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
            <Clock className="w-4 h-4 text-amber-500" />
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
              Transaction Lifecycle Timeline
            </h3>
          </div>

          <div className="space-y-4">
            {transaction.timeline.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-[#5B46F6] flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-200 dark:border-indigo-800">
                  {idx + 1}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-gray-900 dark:text-white">
                      {item.status}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Internal Administration Notes Form */}
      <div
        data-aos="fade-up"
        data-aos-delay="250"
        className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-purple-500/5 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#5B46F6]" />
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
              Internal Administrative Notes
            </h3>
          </div>
          <span className="text-[11px] text-gray-400">
            Visible strictly to BDSisters staff and platform auditors
          </span>
        </div>

        <form onSubmit={handleSaveNotes} className="space-y-3">
          <textarea
            value={internalNote}
            onChange={(e) => setInternalNote(e.target.value)}
            rows={3}
            placeholder="Add internal notes regarding reconciliation, customer inquiry, or dispute follow-up..."
            className="w-full p-3.5 text-xs rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#5B46F6]/20 focus:border-[#5B46F6] transition-all"
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              Simulation Notice: Updates client-side presentation state only.
            </span>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#5B46F6] hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Internal Notes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
