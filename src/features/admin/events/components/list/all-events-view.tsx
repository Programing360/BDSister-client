"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { EventItem, EventStatus, EventFormat, EventType } from "../../types/event";
import { DEMO_EVENTS, DEMO_EVENT_CATEGORIES } from "../../data/mock-events";
import { EventTable } from "./event-table";

export function AllEventsView() {
  const [events, setEvents] = useState<EventItem[]>(DEMO_EVENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedFormat, setSelectedFormat] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setSimulationToast(message);
    setTimeout(() => {
      setSimulationToast(null);
    }, 4500);
  };

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchesSearch =
        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.organizer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (evt.venue?.city && evt.venue.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        evt.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "ALL" || evt.categoryId === selectedCategory;

      const matchesStatus =
        selectedStatus === "ALL" || evt.status === selectedStatus;

      const matchesFormat =
        selectedFormat === "ALL" || evt.format === selectedFormat;

      const matchesType =
        selectedType === "ALL" || evt.eventType === selectedType;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesFormat &&
        matchesType
      );
    });
  }, [events, searchQuery, selectedCategory, selectedStatus, selectedFormat, selectedType]);

  const handleTogglePublish = (eventId: string) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === eventId) {
          const nextStatus: EventStatus =
            evt.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
          showToast(
            `[DEMO] Event status updated to "${nextStatus}". Changes are local to this session.`
          );
          return { ...evt, status: nextStatus };
        }
        return evt;
      })
    );
  };

  const handleCancelEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === eventId) {
          showToast(
            `[DEMO] Event "${evt.title}" marked as CANCELLED. Registered attendees simulated notification dispatched.`
          );
          return { ...evt, status: "CANCELLED" };
        }
        return evt;
      })
    );
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
    setSelectedStatus("ALL");
    setSelectedFormat("ALL");
    setSelectedType("ALL");
    showToast("[DEMO] All filters have been reset.");
  };

  return (
    <div className="space-y-6">
      {/* Simulation Feedback Toast */}
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

      {/* Header and Quick Actions */}
      <div
        data-aos="fade-up"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)]"
      >
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            Events Catalogue
          </div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-brand-navy tracking-tight">
            All Events & Summits
          </h1>
          <p className="text-sm font-normal text-brand-muted">
            Manage upcoming conferences, workshops, webinars, physical meetups, and schedules across Bangladesh.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/events/categories"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-primary/20 text-brand-navy bg-white hover:bg-brand-primary/5 text-sm font-medium transition shadow-sm"
          >
            Categories
          </Link>
          <Link
            href="/admin/events/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-semibold shadow-[0_6px_20px_rgb(91,70,246,0.25)] transition"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </Link>
        </div>
      </div>

      {/* Demo Banner */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-sm"
      >
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="font-medium">
          <span className="font-semibold">DEMO DATA NOTICE:</span> All events, ticket sales, registration stats, and organizer details shown here are isolated fictional frontend demonstrations. No live email notifications or actual database updates occur.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div
        data-aos="fade-up"
        data-aos-delay="150"
        className="p-5 bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, city, organizer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy placeholder:text-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by category"
              className="w-full px-3 py-2 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            >
              <option value="ALL">All Categories</option>
              {DEMO_EVENT_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter by status"
              className="w-full px-3 py-2 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Format Filter */}
          <div>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              aria-label="Filter by format"
              className="w-full px-3 py-2 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            >
              <option value="ALL">All Formats</option>
              <option value="PHYSICAL">In-Person (Physical)</option>
              <option value="ONLINE">Online Virtual</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>

          {/* Reset Action */}
          <div className="flex items-center justify-end">
            <button
              onClick={handleResetFilters}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-brand-muted hover:text-brand-navy bg-brand-surface hover:bg-brand-primary/10 rounded-xl border border-brand-primary/15 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          </div>
        </div>

        {/* Counter and quick badges */}
        <div className="flex flex-wrap items-center justify-between text-xs text-brand-muted pt-2 border-t border-brand-primary/10">
          <div>
            Showing <span className="font-semibold text-brand-navy">{filteredEvents.length}</span> of{" "}
            <span className="font-semibold text-brand-navy">{events.length}</span> events
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Real-time local state active</span>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div data-aos="fade-up" data-aos-delay="200">
        <EventTable
          events={filteredEvents}
          onTogglePublish={handleTogglePublish}
          onCancelEvent={handleCancelEvent}
        />
      </div>
    </div>
  );
}
