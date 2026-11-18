"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Archive,
  Search,
  Sparkles,
  Info,
  Calendar,
  Film,
} from "lucide-react";
import type { EventItem, EventStatus } from "../../types/event";
import { DEMO_EVENTS } from "../../data/mock-events";
import { ArchiveTable } from "./archive-table";

export function ArchiveListView() {
  const [events, setEvents] = useState<EventItem[]>(
    DEMO_EVENTS.filter((e) => e.status === "COMPLETED" || e.status === "ARCHIVED" || e.status === "CANCELLED")
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setSimulationToast(message);
    setTimeout(() => {
      setSimulationToast(null);
    }, 4500);
  };

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      return (
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.venue?.city && e.venue.city.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [events, searchQuery]);

  const handleRestore = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          showToast(
            `[DEMO] Restored event "${e.title}" back to DRAFT catalog status.`
          );
          return { ...e, status: "DRAFT" as EventStatus };
        }
        return e;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {simulationToast && (
        <div
          data-aos="fade-down"
          className="fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-brand-navy/95 text-white rounded-xl shadow-[0_12px_36px_rgba(91,70,246,0.3)] border border-brand-primary/40 backdrop-blur-md text-sm font-medium animate-in fade-in slide-in-from-top-4"
        >
          <Sparkles className="w-4 h-4 text-brand-primary shrink-0 animate-pulse" />
          <span>{simulationToast}</span>
          <button
            onClick={() => setSimulationToast(null)}
            className="ml-2 text-white/60 hover:text-white"
          >
            &times;
          </button>
        </div>
      )}

      {/* Header */}
      <div
        data-aos="fade-up"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)]"
      >
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold uppercase tracking-wider">
            <Archive className="w-3.5 h-3.5" />
            Historical Recaps & Footage
          </div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-brand-navy tracking-tight">
            Event Media & Archive
          </h1>
          <p className="text-sm font-normal text-brand-muted">
            Preserve past conference recordings, attendee photo galleries, and historic symposium records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/events/all"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-primary/20 text-brand-navy bg-white hover:bg-brand-primary/5 text-sm font-semibold transition shadow-sm"
          >
            <Calendar className="w-4 h-4 text-brand-primary" />
            Active Events
          </Link>
        </div>
      </div>

      {/* Demo Warning Banner */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-sm"
      >
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="font-medium">
          <span className="font-semibold">DEMO DATA NOTICE:</span> Past event recap files and restoration toggles operate purely on frontend mock data.
        </p>
      </div>

      {/* Search Toolbar */}
      <div
        data-aos="fade-up"
        data-aos-delay="150"
        className="p-5 bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-4"
      >
        <div className="relative">
          <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search past summits by title, category, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy placeholder:text-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-brand-muted pt-2 border-t border-brand-primary/10">
          <div>
            Showing <span className="font-semibold text-brand-navy">{filteredEvents.length}</span> past events
          </div>
          <div className="text-[11px] font-medium text-brand-primary flex items-center gap-1">
            <Film className="w-3.5 h-3.5" /> High-res photo & video assets retained
          </div>
        </div>
      </div>

      {/* Archive Table */}
      <div data-aos="fade-up" data-aos-delay="200">
        <ArchiveTable
          events={filteredEvents}
          onRestore={handleRestore}
        />
      </div>
    </div>
  );
}
