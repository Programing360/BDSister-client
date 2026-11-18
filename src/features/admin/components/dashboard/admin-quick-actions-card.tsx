"use client";

import React from "react";
import Link from "next/link";
import {
  Zap,
  UserPlus,
  ShieldCheck,
  Store,
  Package,
  ShoppingBag,
  Calendar,
  Megaphone,
  FileText,
  ArrowRight,
} from "lucide-react";
import { DEMO_QUICK_ACTIONS_STEP2 } from "../../data/admin-analytics-data";

export function AdminQuickActionsCard() {
  const getActionIcon = (iconName: string) => {
    switch (iconName) {
      case "userPlus":
        return <UserPlus className="h-4 w-4 text-[#5B46F6]" />;
      case "shieldCheck":
        return <ShieldCheck className="h-4 w-4 text-emerald-600" />;
      case "store":
        return <Store className="h-4 w-4 text-amber-600" />;
      case "package":
        return <Package className="h-4 w-4 text-sky-600" />;
      case "shoppingBag":
        return <ShoppingBag className="h-4 w-4 text-purple-600" />;
      case "calendar":
        return <Calendar className="h-4 w-4 text-indigo-600" />;
      case "megaphone":
        return <Megaphone className="h-4 w-4 text-rose-600" />;
      case "fileText":
        return <FileText className="h-4 w-4 text-gray-700" />;
      default:
        return <Zap className="h-4 w-4 text-[#5B46F6]" />;
    }
  };

  return (
    <div className="rounded-2xl border-gray-200/80 bg-white p-6 space-y-5">
      {/* 1. Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-[#5B46F6]">
              <Zap className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-[#111827]">
              Administrative Operations & Quick Workflows
            </h3>
          </div>
          <p className="text-xs text-[#4B5563] mt-1">
            Frequently accessed administrative task shortcuts and module creators.
          </p>
        </div>

        <span className="text-xs font-bold text-gray-400">8 Workflows</span>
      </div>

      {/* 2. 8 Action Cards Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_QUICK_ACTIONS_STEP2.map((action) => (
          <Link
            key={action.id}
            href={action.href}
            className="group flex flex-col justify-between rounded-xl shadow-lg border-gray-100 bg-gray-50/50 p-4 transition hover:bg-white hover:border-[#5B46F6]/30 hover:shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-gray-200 shadow-2xs group-hover:border-[#5B46F6] transition">
                  {getActionIcon(action.iconName)}
                </div>

                {action.badge && (
                  <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-[#5B46F6]">
                    {action.badge}
                  </span>
                )}
              </div>

              <h4 className="mt-3 text-xs font-bold text-gray-900 group-hover:text-[#5B46F6] transition">
                {action.label}
              </h4>
              <p className="mt-1 text-[11px] text-gray-500 leading-snug">
                {action.description}
              </p>
            </div>

            <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[#5B46F6] opacity-80 group-hover:opacity-100 transition">
              <span>Open Module</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
