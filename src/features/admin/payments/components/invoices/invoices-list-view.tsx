"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import AOS from "aos";
import {
  FileText,
  Search,
  ChevronRight,
  Info,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { InvoiceTable } from "./invoice-table";
import { InvoicePreviewModal } from "./invoice-preview-modal";
import {
  DEMO_INVOICES,
  DEMO_PAYMENT_DISCLAIMER,
} from "../../data/mock-payments";
import type { InvoiceItem, InvoiceStatus } from "../../types/payment";

export function InvoicesListView() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>(DEMO_INVOICES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | InvoiceStatus>("ALL");
  const [previewTarget, setPreviewTarget] = useState<InvoiceItem | null>(null);

  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: true,
      offset: 35,
    });
    AOS.refresh();
  }, [search, statusFilter]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchNum = inv.invoiceNumber.toLowerCase().includes(q);
        const matchName = inv.memberName.toLowerCase().includes(q);
        const matchEntity = inv.relatedEntity.name.toLowerCase().includes(q);
        if (!matchNum && !matchName && !matchEntity) return false;
      }

      if (statusFilter !== "ALL" && inv.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [invoices, search, statusFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
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
        <span className="font-semibold text-gray-900 dark:text-white">Invoices & Receipts</span>
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
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                Billing Invoices & Electronic Receipts
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Generate, inspect, and print official membership and marketplace transaction receipts
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin/payments"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all border border-gray-200 dark:border-gray-800 shadow-md shadow-gray-200/50 dark:shadow-none hover:shadow-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Payment Overview</span>
        </Link>
      </div>

      {/* Demo Notice */}
      <div
        data-aos="fade-up"
        className="bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-amber-50/90 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl p-4 flex items-start gap-3 shadow-md shadow-amber-500/5"
      >
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <span className="font-semibold">Simulated Invoice Records: </span>
          {DEMO_PAYMENT_DISCLAIMER}
        </div>
      </div>

      {/* Search & Status Tabs */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoices by invoice number, sister name, or item..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#5B46F6]/20 focus:border-[#5B46F6] transition-all shadow-md shadow-indigo-500/5"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-gray-100/80 dark:bg-gray-800 p-1 rounded-2xl text-xs font-semibold">
          {(
            [
              { id: "ALL", label: "All Invoices" },
              { id: "PAID", label: "Paid" },
              { id: "ISSUED", label: "Issued" },
              { id: "OVERDUE", label: "Overdue" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-white dark:bg-gray-900 text-[#5B46F6] shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <InvoiceTable
        invoices={filteredInvoices}
        onOpenPreview={(inv) => setPreviewTarget(inv)}
      />

      {/* Preview Sheet Modal */}
      <InvoicePreviewModal
        isOpen={previewTarget !== null}
        onClose={() => setPreviewTarget(null)}
        invoice={previewTarget}
      />
    </div>
  );
}
