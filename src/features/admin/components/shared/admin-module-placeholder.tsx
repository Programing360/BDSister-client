import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Layers } from "lucide-react";
import { AdminPageHeader } from "./admin-page-header";

interface AdminModulePlaceholderProps {
  title: string;
  category: string;
  description: string;
  plannedStep: string;
}

export function AdminModulePlaceholder({
  title,
  category,
  description,
  plannedStep,
}: AdminModulePlaceholderProps) {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={title}
        description={description}
        badge={category}
        actionSlot={
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200/80 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 shadow-2xs hover:bg-gray-50 hover:text-[#5B46F6] transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Dashboard</span>
          </Link>
        }
      />

      <div className="rounded-3xl border border-gray-200/80 bg-white p-8 sm:p-12 text-center shadow-xs">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-[#5B46F6] shadow-sm">
          <Layers className="h-8 w-8" />
        </div>

        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-[#5B46F6] border border-purple-200/70">
          <Clock className="h-3.5 w-3.5" /> Frontend Architecture Ready
        </span>

        <h2 className="mt-3 text-xl font-bold text-gray-900">
          {title} Module
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-gray-500 max-w-lg mx-auto">
          {description}. This dedicated module is part of the BDSisters administration suite and will be populated in {plannedStep}.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/admin"
            className="rounded-xl bg-[#5B46F6] px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-[#4a36e2] transition"
          >
            Go to Executive Overview
          </Link>
          <Link
            href="/admin/settings"
            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-2xs"
          >
            Manage System Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
