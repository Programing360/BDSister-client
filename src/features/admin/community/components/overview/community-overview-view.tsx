"use client";

import React from "react";
import Link from "next/link";
import {
  MessageSquare,
  Plus,
  ShieldAlert,
  Settings,
  FolderTree,
  Flag,
  Clock,
  Sparkles,
  Info,
} from "lucide-react";
import { CommunityKpiCards } from "./community-kpi-cards";
import { CommunityAnalyticsChart } from "./community-analytics-chart";
import { RecentDiscussionsCard } from "./recent-discussions-card";
import { PendingModerationCard } from "./pending-moderation-card";
import { TopContributorsCard } from "./top-contributors-card";
import { DEMO_COMMUNITY_ACTIVITY_TIMELINE } from "../../data/mock-community";

export function CommunityOverviewView() {
  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-purple-500/5" data-aos="fade-down">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <MessageSquare className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Community & Forum Management
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Centralized moderation, category curation, forum governance, and sisterhood engagement monitoring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/community/categories/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            New Category
          </Link>
          <Link
            href="/admin/community/moderation"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            Moderation Queue
          </Link>
          <Link
            href="/admin/community/settings"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20 transition-all"
          >
            <Settings className="w-4 h-4" />
            Community Settings
          </Link>
        </div>
      </div>

      {/* Demo Warning Banner */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs font-medium">
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <p>
          <strong className="font-semibold">DEMO DATA — Not connected to live community services.</strong> All moderation decisions, category reordering, thread locks, and settings adjustments update local UI state only and will not affect production members or live MongoDB records.
        </p>
      </div>

      {/* 2. KPI Cards */}
      <CommunityKpiCards />

      {/* 3. Analytics Growth & Distribution */}
      <CommunityAnalyticsChart />

      {/* 4. Two-Column Layout: Discussions & Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-aos="fade-up">
        <RecentDiscussionsCard />
        <PendingModerationCard />
      </div>

      {/* 5. Bottom Grid: Top Contributors & Real-Time Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-aos="fade-up">
        <div className="lg:col-span-1">
          <TopContributorsCard />
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-purple-500/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                <Clock className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Live Community Activity Stream
                </h3>
                <p className="text-xs text-gray-500">
                  Real-time events, member milestones, and auto-moderator actions
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              System Active
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {DEMO_COMMUNITY_ACTIVITY_TIMELINE.map((item) => (
              <div key={item.id} className="py-3.5 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#c76e2e] bg-purple-50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-semibold text-gray-900">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600">{item.description}</p>
                </div>
                <span className="text-[11px] font-medium text-gray-400 shrink-0">
                  {item.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
