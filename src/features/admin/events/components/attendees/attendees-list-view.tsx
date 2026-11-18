"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  QrCode,
  Sparkles,
  Info,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import type { EventAttendee } from "../../types/event";
import { DEMO_ATTENDEES } from "../../data/mock-events";
import { AttendeeTable } from "./attendee-table";

export function AttendeesListView() {
  const [attendees, setAttendees] = useState<EventAttendee[]>(DEMO_ATTENDEES);
  const [searchQuery, setSearchQuery] = useState("");
  const [gateFilter, setGateFilter] = useState<string>("ALL");
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setSimulationToast(message);
    setTimeout(() => {
      setSimulationToast(null);
    }, 4500);
  };

  const filteredAttendees = useMemo(() => {
    return attendees.filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.ticketType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGate =
        gateFilter === "ALL" || a.checkInStatus === gateFilter;

      return matchesSearch && matchesGate;
    });
  }, [attendees, searchQuery, gateFilter]);

  const handleToggleCheckIn = (attendeeId: string) => {
    setAttendees((prev) =>
      prev.map((a) => {
        if (a.id === attendeeId) {
          const isCheckingIn = a.checkInStatus === "NOT_CHECKED_IN";
          const newStatus = isCheckingIn ? "CHECKED_IN" : "NOT_CHECKED_IN";
          const nowStr = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          showToast(
            `[DEMO] Gate check-in ${
              isCheckingIn ? "confirmed" : "reverted"
            } for ${a.name} (${a.ticketType}).`
          );

          return {
            ...a,
            checkInStatus: newStatus as "CHECKED_IN" | "NOT_CHECKED_IN",
            checkInTime: isCheckingIn ? `Today at ${nowStr}` : undefined,
          };
        }
        return a;
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
            <QrCode className="w-3.5 h-3.5" />
            Gate Management & Verification
          </div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-brand-navy tracking-tight">
            Attendee Management
          </h1>
          <p className="text-sm font-normal text-brand-muted">
            Track real-time venue arrivals, QR ticket scanning, badge check-ins, and participant headcounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/events/registrations"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-primary/20 text-brand-navy bg-white hover:bg-brand-primary/5 text-sm font-semibold transition shadow-sm"
          >
            Registrations Roster
          </Link>
          <Link
            href="/admin/events/tickets"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-semibold shadow-[0_6px_20px_rgb(91,70,246,0.25)] transition"
          >
            Ticket Tiers
          </Link>
        </div>
      </div>

      {/* Demo Notice Banner */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-sm"
      >
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="font-medium">
          <span className="font-semibold">DEMO DATA NOTICE:</span> Check-ins simulate barcode/QR scanning at event registration desks.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div
        data-aos="fade-up"
        data-aos-delay="150"
        className="p-5 bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search attendee name, email, event title, or pass type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy placeholder:text-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          <div>
            <select
              value={gateFilter}
              onChange={(e) => setGateFilter(e.target.value)}
              aria-label="Filter gate status"
              className="w-full px-3 py-2 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            >
              <option value="ALL">All Gate Statuses</option>
              <option value="CHECKED_IN">Checked In (At Venue)</option>
              <option value="NOT_CHECKED_IN">Awaiting Arrival</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-brand-muted pt-2 border-t border-brand-primary/10">
          <div>
            Showing <span className="font-semibold text-brand-navy">{filteredAttendees.length}</span> of{" "}
            <span className="font-semibold text-brand-navy">{attendees.length}</span> attendee passes
          </div>
          <div className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Fast gate verification enabled
          </div>
        </div>
      </div>

      {/* Attendee Table */}
      <div data-aos="fade-up" data-aos-delay="200">
        <AttendeeTable
          attendees={filteredAttendees}
          onToggleCheckIn={handleToggleCheckIn}
        />
      </div>
    </div>
  );
}
