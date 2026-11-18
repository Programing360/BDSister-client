"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  CreditCard,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Clock,
  User,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import type { PaymentTransaction } from "../../types/payment";
import { formatBDT } from "../../data/mock-payments";
import {
  PaymentStatusBadge,
  PaymentTypeBadge,
  PaymentMethodBadge,
} from "../common/payment-status-badge";

interface TransactionDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: PaymentTransaction | null;
}

export function TransactionDetailDrawer({
  isOpen,
  onClose,
  transaction,
}: TransactionDetailDrawerProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen || !transaction) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col border-l border-gray-200 dark:border-gray-800 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                {transaction.transactionId}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(transaction.transactionId, "tx")}
                className="text-gray-400 hover:text-gray-600 transition"
                title="Copy ID"
              >
                {copiedKey === "tx" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Settlement details via ZiniPay merchant bridge
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
          {/* Status & Amount Highlight Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-purple-50/40 dark:from-indigo-950/40 dark:to-purple-950/20 border border-indigo-100 dark:border-indigo-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-gray-500">Gross Collected Amount</span>
              <PaymentStatusBadge status={transaction.status} />
            </div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
              {formatBDT(transaction.amountBDT)}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-indigo-100 dark:border-indigo-900/60 text-[11px] text-gray-500">
              <span>ZiniPay Gateway Fee: {formatBDT(transaction.feeBDT)}</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                Net: {formatBDT(transaction.netAmountBDT)}
              </span>
            </div>
          </div>

          {/* Customer / Sister Details */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#5B46F6]" />
              <span>Customer Sister Information</span>
            </h4>
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Full Name</span>
                <span className="font-semibold text-gray-900 dark:text-white">{transaction.memberName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Member ID</span>
                <span className="font-mono text-gray-700 dark:text-gray-300">{transaction.memberId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="text-gray-700 dark:text-gray-300">{transaction.memberEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone</span>
                <span className="text-gray-700 dark:text-gray-300">{transaction.memberPhone}</span>
              </div>
            </div>
          </div>

          {/* Gateway & Channel Information */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>ZiniPay Gateway Attributes</span>
            </h4>
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Channel Method</span>
                <PaymentMethodBadge method={transaction.paymentMethod} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Gateway Trx ID</span>
                <span className="font-mono text-gray-700 dark:text-gray-300">{transaction.gatewayTrxId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Payment Reference</span>
                <span className="font-mono text-gray-700 dark:text-gray-300">{transaction.paymentReference}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Client IP</span>
                <span className="font-mono text-gray-700 dark:text-gray-300">{transaction.ipAddress || "103.205.71.18"}</span>
              </div>
            </div>
          </div>

          {/* Related Target Item */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-purple-600" />
              <span>Purchased Plan or Order</span>
            </h4>
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 space-y-1.5">
              <div className="font-semibold text-gray-900 dark:text-white">
                {transaction.relatedEntity.name}
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-[11px]">
                <PaymentTypeBadge type={transaction.paymentType} />
                <span className="font-mono">{transaction.relatedEntity.id}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Status Transition Timeline</span>
            </h4>
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 space-y-3">
              {transaction.timeline.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#5B46F6] mt-1.5 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white">{step.status}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{step.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">{step.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <Link
            href={`/admin/payments/transactions/${transaction.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#5B46F6] hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20"
          >
            <span>Open Full Transaction Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
