"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  UserPlus,
  UserCheck,
  ShieldAlert,
  Store,
  Package,
  ShoppingBag,
  CreditCard,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";
import {
  AdminActivityCategory,
  AdminActivityType,
} from "../../types/admin-analytics";
import { DEMO_DETAILED_ACTIVITIES } from "../../data/admin-analytics-data";

export function AdminRecentActivitiesCard() {
  const [activeCategory, setActiveCategory] = useState<AdminActivityCategory>("ALL");

  const filteredActivities =
    activeCategory === "ALL"
      ? DEMO_DETAILED_ACTIVITIES
      : DEMO_DETAILED_ACTIVITIES.filter((act) => act.category === activeCategory);

  const getActivityIcon = (type: AdminActivityType) => {
    switch (type) {
      case "MEMBER_REGISTERED":
        return <UserPlus className="h-4 w-4 text-[#5B46F6]" />;
      case "PROFILE_SUBMITTED":
        return <UserCheck className="h-4 w-4 text-sky-600" />;
      case "VERIFICATION_SUBMITTED":
        return <ShieldAlert className="h-4 w-4 text-amber-600" />;
      case "BUSINESS_CREATED":
        return <Store className="h-4 w-4 text-indigo-600" />;
      case "BUSINESS_APPROVED":
        return <Store className="h-4 w-4 text-emerald-600" />;
      case "PRODUCT_SUBMITTED":
        return <Package className="h-4 w-4 text-purple-600" />;
      case "ORDER_PLACED":
        return <ShoppingBag className="h-4 w-4 text-amber-600" />;
      case "PAYMENT_RECEIVED":
        return <CreditCard className="h-4 w-4 text-emerald-600" />;
      case "SUPPORT_TICKET":
        return <MessageSquare className="h-4 w-4 text-rose-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadgeClass = (variant?: string) => {
    switch (variant) {
      case "success":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "warning":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "danger":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "info":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "primary":
      default:
        return "bg-purple-50 text-[#5B46F6] border-purple-200";
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-5">
      {/* 1. Header with View All Navigation */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-[#5B46F6]">
              <Activity className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-[#111827]">
              Platform Activity Stream
            </h3>
          </div>
          <p className="text-xs text-[#4B5563] mt-1 max-w-[400px]">
            Real-time audit log of member registrations, business workflows, e-commerce orders, and support tickets.
          </p>
        </div>

        <Link
          href="/admin/system/audit-logs"
          className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#5B46F6] hover:text-[#7366F7] transition"
        >
          <span>View All Logs</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-100 pb-3">
        {(
          [
            { id: "ALL", label: "All Activities" },
            { id: "MEMBERS", label: "Members" },
            { id: "COMMERCE", label: "Commerce" },
            { id: "VERIFICATION", label: "Verification" },
            { id: "SUPPORT", label: "Support" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveCategory(tab.id)}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${activeCategory === tab.id
              ? "bg-[#5B46F6] text-white shadow-xs"
              : "text-gray-600 hover:text-gray-900 bg-gray-50 border border-gray-200/60"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Activity List Stream */}
      <div className="divide-y divide-gray-100 max-h-[380px] overflow-y-auto pr-1">
        {filteredActivities.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500">
            No activity records in this category.
          </div>
        ) : (
          filteredActivities.map((act) => (
            <div
              key={act.id}
              className="flex items-start justify-between gap-3 py-3 hover:bg-gray-50/60 px-2 rounded-xl transition"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 shadow-2xs mt-0.5">
                  {getActivityIcon(act.type)}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-bold text-gray-900">{act.title}</p>
                    {act.statusBadge && (
                      <span
                        className={`rounded-md border px-1.5 py-0.2 text-[9px] font-bold ${getStatusBadgeClass(
                          act.statusBadge.variant
                        )}`}
                      >
                        {act.statusBadge.text}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-600 mt-0.5">{act.description}</p>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-gray-400">
                    <span className="font-semibold text-gray-500">
                      {act.actor.name} ({act.actor.role})
                    </span>
                    <span>•</span>
                    <span>{act.timestamp}</span>
                  </div>
                </div>
              </div>

              {act.relatedEntity.href && (
                <Link
                  href={act.relatedEntity.href}
                  className="shrink-0 text-[11px] font-bold text-[#5B46F6] hover:underline"
                >
                  {act.relatedEntity.label}
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
