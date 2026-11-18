"use client";

import React from "react";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Printer,
} from "lucide-react";
import type { InvoiceItem, InvoiceStatus } from "../../types/payment";
import { formatBDT } from "../../data/mock-payments";

interface InvoiceTableProps {
  invoices: InvoiceItem[];
  onOpenPreview: (invoice: InvoiceItem) => void;
}

export function InvoiceTable({ invoices, onOpenPreview }: InvoiceTableProps) {
  const getInvoiceStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Paid</span>
          </span>
        );
      case "ISSUED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Issued</span>
          </span>
        );
      case "OVERDUE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Overdue</span>
          </span>
        );
      case "CANCELLED":
      case "DRAFT":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div
      data-aos="fade-up"
      data-aos-delay="200"
      className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xs rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-xl shadow-purple-500/5 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 overflow-hidden"
    >
      <div className="hidden md:block overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
        <table className="w-full text-left text-xs min-w-[1000px]">
          <thead className="bg-gradient-to-r from-gray-50/90 via-indigo-50/20 to-gray-50/90 dark:from-gray-800/80 dark:via-indigo-950/20 dark:to-gray-800/80 text-gray-600 dark:text-gray-300 font-semibold border-b border-gray-200/80 dark:border-gray-800 text-[11px] tracking-wide">
            <tr>
              <th className="py-4 px-4 min-w-[160px]">Invoice Number</th>
              <th className="py-4 px-4 min-w-[180px]">Member / Sister</th>
              <th className="py-4 px-4 min-w-[180px]">Purchased Item</th>
              <th className="py-4 px-4 min-w-[120px]">Total (BDT)</th>
              <th className="py-4 px-4 min-w-[120px]">Issue Date</th>
              <th className="py-4 px-4 min-w-[120px]">Due Date</th>
              <th className="py-4 px-4 min-w-[120px]">Status</th>
              <th className="py-4 px-4 min-w-[120px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/90 dark:divide-gray-800/80 text-gray-700 dark:text-gray-300">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-gray-400">
                  No invoices found matching criteria.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-xs text-gray-900 dark:text-white">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-gray-900 dark:text-white">{inv.memberName}</div>
                    <span className="font-mono text-[10px] text-gray-400">{inv.memberId}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="max-w-[170px] truncate font-medium text-gray-800 dark:text-gray-200">
                      {inv.relatedEntity.name}
                    </div>
                    <span className="font-mono text-[10px] text-gray-400">{inv.relatedEntity.id}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-xs text-gray-900 dark:text-white">
                    {formatBDT(inv.totalAmountBDT)}
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 text-[11px] whitespace-nowrap">
                    {inv.issueDate}
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 text-[11px] whitespace-nowrap">
                    {inv.dueDate}
                  </td>
                  <td className="py-3.5 px-4">{getInvoiceStatusBadge(inv.status)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenPreview(inv)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-[#5B46F6] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors border border-indigo-200/60 shadow-xs cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Receipt</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile list */}
      <div className="block md:hidden divide-y divide-gray-100 dark:divide-gray-800">
        {invoices.map((inv) => (
          <div key={inv.id} className="p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-semibold text-gray-900 dark:text-white">{inv.invoiceNumber}</span>
                <p className="text-xs font-semibold text-gray-800">{inv.memberName}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-semibold text-sm">{formatBDT(inv.totalAmountBDT)}</span>
                {getInvoiceStatusBadge(inv.status)}
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => onOpenPreview(inv)}
                className="text-xs font-semibold text-[#5B46F6]"
              >
                Inspect Receipt →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
