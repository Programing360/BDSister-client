"use client";

import React from "react";
import Link from "next/link";
import { Activity, ShieldCheck, ShoppingBag, Store, Lock, ChevronRight } from "lucide-react";
import { DEMO_RECENT_ACTIVITIES } from "../../data/admin-mock-data";

export function AdminActivityStreamCard() {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white shadow-xs transition hover:shadow-md p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Platform Audit Trail</h3>
            <p className="text-xs text-gray-500">Real-time system events & staff actions</p>
          </div>
        </div>

        <Link
          href="/admin/activity-logs"
          className="text-xs font-bold text-[#5B46F6] hover:underline flex items-center gap-1"
        >
          <span>All Logs</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Stream list */}
      <div className="mt-4 space-y-3">
        {DEMO_RECENT_ACTIVITIES.map((act) => (
          <div key={act.id} className="flex items-start gap-3 text-xs">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 mt-0.5">
              {act.type === "SECURITY" ? (
                <Lock className="h-3.5 w-3.5 text-rose-600" />
              ) : act.type === "COMMERCE" ? (
                <ShoppingBag className="h-3.5 w-3.5 text-[#5B46F6]" />
              ) : act.type === "VERIFICATION" ? (
                <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
              ) : (
                <Store className="h-3.5 w-3.5 text-emerald-600" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-gray-800">
                <span className="font-bold text-gray-900">{act.actorName}</span>{" "}
                <span className="text-gray-500">({act.actorRole})</span>: {act.action}{" "}
                <strong className="text-gray-900 font-semibold">{act.target}</strong>
              </p>
              <span className="text-[10px] text-gray-400">{act.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
