"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import AOS from "aos";
import {
  CreditCard,
  ChevronRight,
  Info,
  CheckCircle2,
  Download,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { TransactionTableToolbar } from "./transaction-table-toolbar";
import { TransactionTable } from "./transaction-table";
import { TransactionDetailDrawer } from "./transaction-detail-drawer";
import { TransactionExportModal } from "./transaction-export-modal";
import {
  DEMO_PAYMENT_TRANSACTIONS,
  DEMO_PAYMENT_DISCLAIMER,
  formatBDT,
} from "../../data/mock-payments";
import type {
  PaymentTransaction,
  PaymentFilterState,
} from "../../types/payment";

export function TransactionsListView() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(DEMO_PAYMENT_TRANSACTIONS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [drawerTarget, setDrawerTarget] = useState<PaymentTransaction | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const [filters, setFilters] = useState<PaymentFilterState>({
    query: "",
    status: "ALL",
    paymentType: "ALL",
    paymentMethod: "ALL",
    dateRange: "all",
    sortBy: "date",
    sortDirection: "desc",
    page: 1,
    pageSize: 8,
  });

  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: true,
      offset: 35,
    });
    AOS.refresh();
  }, [filters]);

  const handleFilterChange = (updates: Partial<PaymentFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      query: "",
      status: "ALL",
      paymentType: "ALL",
      paymentMethod: "ALL",
      dateRange: "all",
      sortBy: "date",
      sortDirection: "desc",
      page: 1,
      pageSize: 8,
    });
  };

  // Filter and Sort Logic
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        if (filters.query.trim()) {
          const q = filters.query.toLowerCase();
          const matchTx = t.transactionId.toLowerCase().includes(q);
          const matchZnp = t.gatewayTrxId.toLowerCase().includes(q);
          const matchName = t.memberName.toLowerCase().includes(q);
          const matchEmail = t.memberEmail.toLowerCase().includes(q);
          const matchPhone = t.memberPhone.toLowerCase().includes(q);
          const matchMem = t.memberId.toLowerCase().includes(q);
          if (!matchTx && !matchZnp && !matchName && !matchEmail && !matchPhone && !matchMem) {
            return false;
          }
        }

        if (filters.status !== "ALL" && t.status !== filters.status) {
          return false;
        }

        if (filters.paymentType !== "ALL" && t.paymentType !== filters.paymentType) {
          return false;
        }

        if (filters.paymentMethod !== "ALL" && t.paymentMethod !== filters.paymentMethod) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "amount") {
          return b.amountBDT - a.amountBDT;
        }
        if (filters.sortBy === "member") {
          return a.memberName.localeCompare(b.memberName);
        }
        return b.initiatedAt.localeCompare(a.initiatedAt);
      });
  }, [transactions, filters]);

  // Paginated Slice
  const paginatedTransactions = useMemo(() => {
    const start = (filters.page - 1) * filters.pageSize;
    return filteredTransactions.slice(start, start + filters.pageSize);
  }, [filteredTransactions, filters.page, filters.pageSize]);

  // Selection Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedTransactions.map((t) => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExport = (format: "csv" | "excel", selectedFields: string[]) => {
    setFeedbackToast(`Exported ${filteredTransactions.length} transaction records as ${format.toUpperCase()} (Demo).`);
    setTimeout(() => setFeedbackToast(null), 3500);
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
        <span className="font-semibold text-gray-900 dark:text-white">Transactions</span>
      </nav>

      {/* Header Banner */}
      <div
        data-aos="fade-down"
        data-aos-delay="50"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/60 dark:to-purple-950/40 text-[#5B46F6] dark:text-indigo-300 flex items-center justify-center border border-indigo-100/80 dark:border-indigo-900 shadow-lg shadow-[#5B46F6]/10">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                Payment Transactions
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Inspect, audit, filter, and reconcile all incoming settlements through ZiniPay
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/payments/gateway"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 rounded-xl transition-all border border-indigo-200 dark:border-indigo-800 shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ZiniPay Gateway</span>
          </Link>

          <Link
            href="/admin/payments/refunds"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 rounded-xl transition-all border border-purple-200 dark:border-purple-800 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refunds</span>
          </Link>
        </div>
      </div>

      {/* Demo Notice */}
      <div
        data-aos="fade-up"
        className="bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-amber-50/90 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl p-4 flex items-start gap-3 shadow-md shadow-amber-500/5"
      >
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <span className="font-semibold">Simulated Transaction Log: </span>
          {DEMO_PAYMENT_DISCLAIMER}
        </div>
      </div>

      {/* Toolbar */}
      <TransactionTableToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onOpenExport={() => setIsExportOpen(true)}
        totalFiltered={filteredTransactions.length}
      />

      {/* Table */}
      <TransactionTable
        transactions={paginatedTransactions}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        onOpenDrawer={(tx) => setDrawerTarget(tx)}
        page={filters.page}
        pageSize={filters.pageSize}
        totalItems={filteredTransactions.length}
        onPageChange={(p) => handleFilterChange({ page: p })}
      />

      {/* Quick View Drawer */}
      <TransactionDetailDrawer
        isOpen={drawerTarget !== null}
        onClose={() => setDrawerTarget(null)}
        transaction={drawerTarget}
      />

      {/* Export Modal */}
      <TransactionExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={handleExport}
        totalRecords={filteredTransactions.length}
      />
    </div>
  );
}
