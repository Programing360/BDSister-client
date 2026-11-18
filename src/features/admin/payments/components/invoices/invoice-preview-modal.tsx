"use client";

import React from "react";
import { X, Printer, CheckCircle2, Building2, Info } from "lucide-react";
import type { InvoiceItem } from "../../types/payment";
import { formatBDT } from "../../data/mock-payments";

interface InvoicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceItem | null;
}

export function InvoicePreviewModal({
  isOpen,
  onClose,
  invoice,
}: InvoicePreviewModalProps) {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl shadow-purple-950/20 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Controls Bar (Hidden during print) */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs text-gray-900 dark:text-white">
              Official BDSisters Invoice Preview
            </span>
            <span className="font-mono text-xs text-gray-400">({invoice.invoiceNumber})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#5B46F6] hover:bg-indigo-700 transition shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 overflow-y-auto space-y-6 text-xs text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 print:p-0">
          {/* Sheet Header */}
          <div className="flex items-start justify-between border-b border-gray-200 dark:border-gray-800 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5B46F6] to-[#7366F7] text-white flex items-center justify-center font-bold text-xs shadow-md">
                  BD
                </div>
                <span className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
                  BDSisters.org
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Women Empowerment & Artisan Community Network
              </p>
              <p className="text-[10px] text-gray-400 font-mono">
                Dhaka, Bangladesh • billing@bdsisters.org
              </p>
            </div>

            <div className="text-right space-y-1">
              <span className="text-xl font-bold font-mono text-gray-900 dark:text-white">
                INVOICE
              </span>
              <p className="font-mono text-xs text-gray-600 dark:text-gray-300 font-semibold">
                {invoice.invoiceNumber}
              </p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                Status: {invoice.status}
              </span>
            </div>
          </div>

          {/* Billing Meta Grid */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div className="space-y-1">
              <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                Billed To:
              </span>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">{invoice.memberName}</p>
              <p className="text-gray-500 font-mono text-[11px]">Member ID: {invoice.memberId}</p>
              <p className="text-gray-500">{invoice.memberAddress}</p>
              <p className="text-gray-500">{invoice.memberEmail}</p>
            </div>

            <div className="space-y-1 text-right">
              <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                Payment Timeline:
              </span>
              <p className="text-gray-600 dark:text-gray-400">Issue Date: <strong className="text-gray-900 dark:text-white">{invoice.issueDate}</strong></p>
              <p className="text-gray-600 dark:text-gray-400">Due Date: <strong className="text-gray-900 dark:text-white">{invoice.dueDate}</strong></p>
              {invoice.paidDate && (
                <p className="text-emerald-600 font-medium">Cleared Date: {invoice.paidDate}</p>
              )}
              {invoice.transactionReference && (
                <p className="text-gray-400 font-mono text-[10px]">Gateway Trx: {invoice.transactionReference}</p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/60 font-semibold text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-center w-16">Qty</th>
                  <th className="p-3 text-right w-28">Unit Price</th>
                  <th className="p-3 text-right w-28">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                {invoice.items.map((line, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-medium">{line.description}</td>
                    <td className="p-3 text-center">{line.quantity}</td>
                    <td className="p-3 text-right font-mono">{formatBDT(line.unitPriceBDT)}</td>
                    <td className="p-3 text-right font-semibold font-mono">{formatBDT(line.totalBDT)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal:</span>
                <span className="font-mono">{formatBDT(invoice.subtotalBDT)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>VAT / Tax (0% Exempt):</span>
                <span className="font-mono">{formatBDT(invoice.taxBDT)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-800 font-bold text-sm text-gray-900 dark:text-white">
                <span>Total Amount:</span>
                <span className="font-mono text-[#5B46F6]">{formatBDT(invoice.totalAmountBDT)}</span>
              </div>
            </div>
          </div>

          {/* Footnote */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 space-y-1">
            <p className="font-semibold text-gray-600 dark:text-gray-300">Terms & Payment Verification:</p>
            <p>{invoice.notes || "This is an electronically generated receipt for BDSisters platform activities."}</p>
            <p className="text-amber-600 dark:text-amber-400 font-medium print:hidden">
              Simulation Notice: Demonstration invoice document preview for BDSisters administration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
