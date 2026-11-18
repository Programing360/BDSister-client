"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  UserCheck,
  Award,
  Store,
  Package,
  Flag,
  ArrowUpRight,
} from "lucide-react";
import { PendingApprovalCategoryItem } from "../../types/admin-analytics";
import { DEMO_PENDING_APPROVAL_CATEGORIES } from "../../data/admin-analytics-data";

export function AdminPendingApprovalsCard() {
  const getCategoryIcon = (iconName: PendingApprovalCategoryItem["iconName"]) => {
    switch (iconName) {
      case "userCheck":
        return <UserCheck className="h-4 w-4 text-[#5B46F6]" />;
      case "badgeAlert":
        return <Award className="h-4 w-4 text-amber-600" />;
      case "store":
        return <Store className="h-4 w-4 text-emerald-600" />;
      case "package":
        return <Package className="h-4 w-4 text-sky-600" />;
      case "flag":
        return <Flag className="h-4 w-4 text-rose-600" />;
      default:
        return <ShieldAlert className="h-4 w-4 text-purple-600" />;
    }
  };

  const totalPending = DEMO_PENDING_APPROVAL_CATEGORIES.reduce(
    (acc, curr) => acc + curr.pendingCount,
    0
  );

  return (
    <div className="rounded-2xl border-gray-200/80 bg-white p-6 space-y-5">
      {/* 1. Header with Cumulative Count */}
      <div className=" border-b border-gray-100 pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">
              Pending Approval Queues
            </h3>
          </div>
          <span className="rounded-full bg-amber-100/80 border border-amber-200 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
            {totalPending} Total Queued
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1 font-normal">
          Verification and compliance queues requiring staff evaluation.
        </p>

      </div>

      {/* 2. 5 Queue Category Cards */}
      <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden">
        {DEMO_PENDING_APPROVAL_CATEGORIES.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3.5 hover:bg-gray-50/70 transition"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 shadow-2xs mt-0.5">
                {getCategoryIcon(item.iconName)}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-gray-900">{item.title}</p>
                  {item.priority === "HIGH" && (
                    <span className="rounded-md bg-rose-50 border border-rose-200 px-1.5 py-0.2 text-[9px] font-semibold text-rose-700">
                      High Priority
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5 font-normal">{item.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900">
                  {item.pendingCount}
                </span>
                <p className="text-[9px] text-amber-600 font-medium">
                  {item.urgentCount} urgent
                </p>
              </div>

              <Link
                href={item.href}
                className="inline-flex items-center gap-1 rounded-xl bg-purple-50 hover:bg-[#5B46F6] text-[#5B46F6] hover:text-white px-3 py-1.5 text-xs font-semibold transition shadow-xs"
              >
                <span>Audit</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
