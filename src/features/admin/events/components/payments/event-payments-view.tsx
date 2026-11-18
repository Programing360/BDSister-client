"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  CreditCard,
  Search,
  Download,
  Copy,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import type { EventPaymentRecord } from "../../types/event";
import { DEMO_EVENT_PAYMENTS } from "../../data/mock-events";

export function EventPaymentsView() {
  const [payments] = useState<EventPaymentRecord[]>(DEMO_EVENT_PAYMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setSimulationToast(message);
    setTimeout(() => {
      setSimulationToast(null);
    }, 4500);
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesSearch =
        p.transactionReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.attendeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || p.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, searchQuery, statusFilter]);

  const totalCollectedBDT = useMemo(() => {
    return payments
      .filter((p) => p.status === "SUCCESSFUL")
      .reduce((sum, p) => sum + p.amountBDT, 0);
  }, [payments]);

  const handleCopyRef = (ref: string) => {
    navigator.clipboard?.writeText(ref);
    showToast(`[DEMO] Copied ZiniPay reference "${ref}" to clipboard.`);
  };

  const handleExportLedger = () => {
    showToast(
      `[DEMO] ZiniPay event financial reconciliation export initiated (CSV).`
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {simulationToast && (
        <div
          data-aos="fade-down"
          className="fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-brand-navy/95 text-white rounded-xl shadow-[0_12px_36px_rgba(91,70,246,0.3)] border border-brand-primary/40 backdrop-blur-md text-sm font-medium animate-in fade-in slide-in-from-top-4"
        >
          <Sparkles className="w-4 h-4 text-brand-primary shrink-0 animate-pulse" />
          <span>{simulationToast}</span>
          <button
            onClick={() => setSimulationToast(null)}
            className="ml-2 text-white/60 hover:text-white"
          >
            &times;
          </button>
        </div>
      )}

      {/* Header */}
      <div
        data-aos="fade-up"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)]"
      >
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold uppercase tracking-wider">
            <CreditCard className="w-3.5 h-3.5" />
            Financial Audit Ledger
          </div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-brand-navy tracking-tight">
            Event Payments & Ledger
          </h1>
          <p className="text-sm font-normal text-brand-muted">
            Read-only financial audit records from the official ZiniPay gateway.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportLedger}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-primary/20 text-brand-navy bg-white hover:bg-brand-primary/5 text-sm font-semibold transition shadow-sm"
          >
            <Download className="w-4 h-4 text-brand-primary" />
            Export Ledger
          </button>
          <Link
            href="/admin/events/registrations"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-semibold shadow-[0_6px_20px_rgb(91,70,246,0.25)] transition"
          >
            Registrations
          </Link>
        </div>
      </div>

      {/* Demo Warning Banner */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-sm"
      >
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="font-medium">
          <span className="font-semibold">DEMO DATA NOTICE:</span> All payment logs and transaction hashes are simulated. ZiniPay is the platform&apos;s sole configured payment provider.
        </p>
      </div>

      {/* KPI Cards */}
      <div
        data-aos="fade-up"
        data-aos-delay="120"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="p-5 rounded-2xl bg-white/95 border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-1">
          <span className="text-xs uppercase tracking-wider text-brand-muted font-semibold">
            Total Event Revenue
          </span>
          <p className="text-2xl font-bold text-brand-navy">
            ৳ {totalCollectedBDT.toLocaleString()} BDT
          </p>
          <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Reconciled via ZiniPay
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/95 border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-1">
          <span className="text-xs uppercase tracking-wider text-brand-muted font-semibold">
            Successful Transactions
          </span>
          <p className="text-2xl font-bold text-brand-navy">
            {payments.filter((p) => p.status === "SUCCESSFUL").length} records
          </p>
          <p className="text-xs text-brand-muted font-normal">
            Direct bKash, Nagad, and Card payments
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white/95 border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-1">
          <span className="text-xs uppercase tracking-wider text-brand-muted font-semibold">
            Configured Gateway
          </span>
          <p className="text-xl font-bold text-brand-primary">
            ZiniPay Payment Services
          </p>
          <p className="text-xs text-brand-muted font-normal">
            Automated IPN verification active
          </p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div
        data-aos="fade-up"
        data-aos-delay="150"
        className="p-5 bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search transaction ref, attendee, event, method..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy placeholder:text-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter payment status"
              className="w-full px-3 py-2 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="SUCCESSFUL">Successful</option>
              <option value="PENDING">Pending</option>
              <option value="REFUNDED">Refunded</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-brand-muted pt-2 border-t border-brand-primary/10">
          <div>
            Showing <span className="font-semibold text-brand-navy">{filteredPayments.length}</span> of{" "}
            <span className="font-semibold text-brand-navy">{payments.length}</span> transaction logs
          </div>
          <div className="text-[11px] font-mono text-brand-primary">
            Gateway: ZiniPay (Bangladesh)
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div
        data-aos="fade-up"
        data-aos-delay="200"
        className="bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[950px]">
            <thead className="bg-brand-surface/70 text-brand-muted uppercase text-[11px] font-semibold border-b border-brand-primary/10">
              <tr>
                <th className="py-3.5 px-4">Transaction Ref</th>
                <th className="py-3.5 px-4">Attendee / Buyer</th>
                <th className="py-3.5 px-4">Event</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-primary/5">
              {filteredPayments.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-brand-surface/50 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-brand-navy">
                      <span>{p.transactionReference}</span>
                      <button
                        onClick={() => handleCopyRef(p.transactionReference)}
                        className="p-1 rounded text-brand-muted hover:text-brand-primary"
                        title="Copy reference"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[10px] text-brand-muted">
                      ID: {p.id}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-brand-navy">
                      {p.attendeeName}
                    </p>
                    <span className="text-[10px] text-brand-muted font-mono">
                      Reg: {p.registrationId}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <Link
                      href={`/admin/events/${p.eventId}`}
                      className="font-medium text-brand-navy hover:text-brand-primary line-clamp-1"
                    >
                      {p.eventTitle}
                    </Link>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-brand-navy text-sm">
                    ৳ {p.amountBDT.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 text-brand-navy font-medium">
                    {p.paymentMethod}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        p.status === "SUCCESSFUL"
                          ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
                          : p.status === "REFUNDED"
                          ? "bg-purple-500/10 text-purple-700 border border-purple-500/20"
                          : p.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-700 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-700 border border-rose-500/20"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-brand-muted">
                    {p.transactionDate.slice(0, 10)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/events/registrations/${p.registrationId}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary hover:underline"
                    >
                      Registration →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
