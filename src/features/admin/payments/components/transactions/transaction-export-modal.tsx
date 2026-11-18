"use client";

import React, { useState } from "react";
import { X, Download, FileSpreadsheet, Check, Info } from "lucide-react";

interface TransactionExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: "csv" | "excel", selectedFields: string[]) => void;
  totalRecords: number;
}

export function TransactionExportModal({
  isOpen,
  onClose,
  onExport,
  totalRecords,
}: TransactionExportModalProps) {
  const [format, setFormat] = useState<"csv" | "excel">("csv");
  const [fields, setFields] = useState<Record<string, boolean>>({
    transactionId: true,
    gatewayTrxId: true,
    memberName: true,
    memberEmail: true,
    amountBDT: true,
    feeBDT: true,
    netAmountBDT: true,
    paymentMethod: true,
    paymentType: true,
    status: true,
    initiatedAt: true,
  });

  if (!isOpen) return null;

  const toggleField = (key: string) => {
    setFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConfirm = () => {
    const selected = Object.keys(fields).filter((k) => fields[k]);
    onExport(format, selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl shadow-purple-950/20 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-[#5B46F6] flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Export Transaction Records
              </h3>
              <p className="text-xs text-gray-500">
                Customizable CSV / Excel report generation ({totalRecords} items)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Format Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Export File Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat("csv")}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  format === "csv"
                    ? "border-[#5B46F6] bg-indigo-50/50 dark:bg-indigo-950/30 text-[#5B46F6]"
                    : "border-gray-200 dark:border-gray-800 hover:border-gray-300"
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center font-bold text-xs shadow-xs">
                  CSV
                </div>
                <div>
                  <p className="font-semibold text-xs text-gray-900 dark:text-white">Standard CSV</p>
                  <p className="text-[10px] text-gray-500">Universal spreadsheet format</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat("excel")}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  format === "excel"
                    ? "border-[#5B46F6] bg-indigo-50/50 dark:bg-indigo-950/30 text-[#5B46F6]"
                    : "border-gray-200 dark:border-gray-800 hover:border-gray-300"
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-xs text-gray-900 dark:text-white">Excel Report</p>
                  <p className="text-[10px] text-gray-500">Formatted workbook (demo)</p>
                </div>
              </button>
            </div>
          </div>

          {/* Fields Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Included Columns & Data Fields
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: "transactionId", label: "Transaction Code" },
                { id: "gatewayTrxId", label: "ZiniPay Gateway Trx ID" },
                { id: "memberName", label: "Member Full Name" },
                { id: "memberEmail", label: "Member Email" },
                { id: "amountBDT", label: "Gross Amount (BDT)" },
                { id: "feeBDT", label: "ZiniPay Fee" },
                { id: "netAmountBDT", label: "Net Settlement" },
                { id: "paymentMethod", label: "Channel Method" },
                { id: "paymentType", label: "Payment Type" },
                { id: "status", label: "Settlement Status" },
                { id: "initiatedAt", label: "Initiation Timestamp" },
              ].map((f) => (
                <label
                  key={f.id}
                  className="flex items-center gap-2 p-2 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer text-gray-700 dark:text-gray-300"
                >
                  <input
                    type="checkbox"
                    checked={fields[f.id] ?? false}
                    onChange={() => toggleField(f.id)}
                    className="w-4 h-4 rounded text-[#5B46F6] focus:ring-[#5B46F6] dark:bg-gray-800 dark:border-gray-700 cursor-pointer"
                  />
                  <span className="font-medium text-[11px] truncate">{f.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Demonstration Notice */}
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              Simulation Notice: Generates demo CSV client-side download without contacting backend APIs.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#5B46F6] hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate & Download</span>
          </button>
        </div>
      </div>
    </div>
  );
}
