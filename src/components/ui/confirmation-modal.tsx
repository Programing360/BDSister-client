"use client";

import React, { useEffect, useRef } from "react";
import { X, Loader2, AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "primary" | "danger" | "warning";
  isLoading?: boolean;
  icon?: React.ElementType;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Approve",
  cancelText = "Cancel",
  variant = "primary",
  isLoading = false,
  icon: CustomIcon,
}: ConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Icon and accent colors based on variant
  const DefaultIcon =
    variant === "danger"
      ? AlertCircle
      : variant === "warning"
      ? AlertTriangle
      : CheckCircle2;

  const IconComponent = CustomIcon || DefaultIcon;

  const iconStyles = {
    primary: "bg-[#5B9891]/15 text-[#5B9891] border-[#5B9891]/30",
    danger: "bg-rose-50 text-rose-600 border-rose-200",
    warning: "bg-amber-50 text-amber-600 border-amber-200",
  }[variant];

  const confirmBtnStyles = {
    primary: "bg-[#5B9891] hover:bg-[#467A74] text-white shadow-xs",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-xs",
    warning: "bg-[#D98408] hover:bg-[#b86f06] text-white shadow-xs",
  }[variant];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-2xl transition-all duration-200 animate-in zoom-in-95"
      >
        {/* Close Button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={onClose}
          className="absolute right-5 top-5 rounded-xl p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition disabled:opacity-40"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="flex items-start gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${iconStyles}`}
          >
            <IconComponent className="h-5 w-5" />
          </div>

          <div className="space-y-2 pr-6">
            <h3
              id="confirmation-modal-title"
              className="text-base sm:text-lg font-bold text-gray-900 leading-snug"
            >
              {title}
            </h3>
            <div className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {description}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-7 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs sm:text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => onConfirm()}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition disabled:opacity-50 ${confirmBtnStyles}`}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
