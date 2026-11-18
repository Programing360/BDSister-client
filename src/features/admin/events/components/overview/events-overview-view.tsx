"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Plus,
  Sparkles,
  Ticket,
  FolderTree,
  Info,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { EventKpiCards } from "./event-kpi-cards";
import { EventAnalyticsCharts } from "./event-analytics-charts";
import { UpcomingEventsCard } from "./upcoming-events-card";
import { RecentRegistrationsCard } from "./recent-registrations-card";

export function EventsOverviewView() {
  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Actions */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-purple-500/5"
        data-aos="fade-down"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Calendar className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Events & Workshops Management
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Orchestrate conferences, physical artisan workshops, online webinars, tickets, and verified attendee rosters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/events/create"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </Link>
          <Link
            href="/admin/events/workshops/create"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            New Workshop
          </Link>
          <Link
            href="/admin/events/registrations"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
          >
            <Ticket className="w-4 h-4 text-pink-600" />
            Registrations
          </Link>
        </div>
      </div>

      {/* Demo Warning Banner */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs font-medium">
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <p>
          <strong className="font-semibold">DEMO DATA — Not connected to live event services.</strong> All event creations, schedule changes, attendee check-ins, and ticket price configurations update local client state only and will not alter live production registrations or gateway ledger records.
        </p>
      </div>

      {/* 2. KPI Cards */}
      <EventKpiCards />

      {/* 3. Analytics Growth & Category Distribution */}
      <EventAnalyticsCharts />

      {/* 4. Two-Column Lower Grid: Active Events & Recent Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-aos="fade-up">
        <UpcomingEventsCard />
        <RecentRegistrationsCard />
      </div>

      {/* 5. Quick Administrative Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" data-aos="fade-up">
        <Link
          href="/admin/events/categories"
          className="p-5 rounded-2xl border border-gray-100 bg-white hover:border-purple-200 hover:shadow-lg transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 group-hover:bg-purple-100 transition-colors">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Event Categories</h4>
              <p className="text-xs text-gray-500">Curate vertical topics & tracks</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
        </Link>

        <Link
          href="/admin/events/attendees"
          className="p-5 rounded-2xl border border-gray-100 bg-white hover:border-purple-200 hover:shadow-lg transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100 transition-colors">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Attendee Check-In</h4>
              <p className="text-xs text-gray-500">Manage turn-out & attendance</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
        </Link>

        <Link
          href="/admin/events/payments"
          className="p-5 rounded-2xl border border-gray-100 bg-white hover:border-purple-200 hover:shadow-lg transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-100 transition-colors">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">ZiniPay Event Ledger</h4>
              <p className="text-xs text-gray-500">Read-only ticket payment audit</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </Link>
      </div>
    </div>
  );
}
