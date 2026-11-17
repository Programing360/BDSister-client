"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  LayoutDashboard,
  Users,
  ShieldCheck,
  Building2,
  Package,
  ShoppingBag,
  CreditCard,
  Settings,
  ArrowRight,
  Command,
} from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  category: "Navigation" | "Action" | "Commerce";
  href: string;
  icon: React.ReactNode;
}

const SEARCH_REGISTRY: SearchResult[] = [
  { id: "1", title: "Admin Dashboard", category: "Navigation", href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "2", title: "Members Directory", category: "Navigation", href: "/admin/members", icon: <Users className="h-4 w-4" /> },
  { id: "3", title: "Add New Member", category: "Action", href: "/admin/members/create", icon: <Users className="h-4 w-4" /> },
  { id: "4", title: "Identity Verifications", category: "Navigation", href: "/admin/verifications", icon: <ShieldCheck className="h-4 w-4" /> },
  { id: "5", title: "Artisan Businesses", category: "Commerce", href: "/admin/businesses", icon: <Building2 className="h-4 w-4" /> },
  { id: "6", title: "Pending Business Approvals", category: "Commerce", href: "/admin/businesses/pending", icon: <Building2 className="h-4 w-4" /> },
  { id: "7", title: "Marketplace Products", category: "Commerce", href: "/admin/products", icon: <Package className="h-4 w-4" /> },
  { id: "8", title: "Customer Orders & Invoices", category: "Commerce", href: "/admin/orders", icon: <ShoppingBag className="h-4 w-4" /> },
  { id: "9", title: "ZiniPay Transactions", category: "Commerce", href: "/admin/payments", icon: <CreditCard className="h-4 w-4" /> },
  { id: "10", title: "Platform Settings", category: "Navigation", href: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
];

export function AdminSearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  // Global keydown handler for Cmd/Ctrl+K and Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) handleClose();
      } else if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? SEARCH_REGISTRY.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCH_REGISTRY.slice(0, 6);

  const handleSelect = (href: string) => {
    handleClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-2xl border border-gray-200/80 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 bg-slate-50/50">
          <Search className="h-5 w-5 text-[#5B46F6] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search admin pages, members, orders, verifications..."
            className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
          />
          <button
            type="button"
            onClick={handleClose}
            className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              No admin records matching &quot;{query}&quot;
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.href)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-xs transition hover:bg-purple-50 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-600 group-hover:bg-[#5B46F6] group-hover:text-white transition">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-[#5B46F6]">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-gray-400">{item.category}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-[#5B46F6] group-hover:translate-x-0.5 transition" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-[11px] text-gray-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-mono text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded shadow-2xs">
              <Command className="h-3 w-3" /> K
            </span>
            <span>to toggle search</span>
          </div>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
