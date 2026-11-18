"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Ticket,
  Plus,
  Search,
  Sparkles,
  Info,
  Calendar,
} from "lucide-react";
import type { EventTicket, TicketStatus } from "../../types/event";
import { DEMO_TICKETS } from "../../data/mock-events";
import { TicketTable } from "./ticket-table";

export function TicketsListView() {
  const [tickets, setTickets] = useState<EventTicket[]>(DEMO_TICKETS);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setSimulationToast(message);
    setTimeout(() => {
      setSimulationToast(null);
    }, 4500);
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === "ALL" || t.type === typeFilter;
      const matchesStatus =
        statusFilter === "ALL" || t.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [tickets, searchQuery, typeFilter, statusFilter]);

  const handleToggleStatus = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const nextStatus: TicketStatus =
            t.status === "ACTIVE" ? "DISABLED" : "ACTIVE";
          showToast(
            `[DEMO] Ticket "${t.name}" status changed to ${nextStatus}. Changes are local.`
          );
          return { ...t, status: nextStatus };
        }
        return t;
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
            <Ticket className="w-3.5 h-3.5" />
            Passes & Pricing Tiers
          </div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-brand-navy tracking-tight">
            Tickets & Pricing
          </h1>
          <p className="text-sm font-normal text-brand-muted">
            Configure free admission, VIP passes, student discounts, and early-bird windows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/events/all"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-primary/20 text-brand-navy bg-white hover:bg-brand-primary/5 text-sm font-semibold transition shadow-sm"
          >
            <Calendar className="w-4 h-4 text-brand-primary" />
            All Events
          </Link>
          <Link
            href="/admin/events/tickets/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-semibold shadow-[0_6px_20px_rgb(91,70,246,0.25)] transition"
          >
            <Plus className="w-4 h-4" />
            New Ticket Tier
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
          <span className="font-semibold">DEMO DATA NOTICE:</span> All ticket sales velocity and inventory counts are simulated local records.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div
        data-aos="fade-up"
        data-aos-delay="150"
        className="p-5 bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ticket tier, event title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy placeholder:text-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter ticket type"
              className="w-full px-3 py-2 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            >
              <option value="ALL">All Ticket Types</option>
              <option value="FREE">Free Pass</option>
              <option value="PAID">Standard Paid</option>
              <option value="VIP">VIP Tier</option>
              <option value="EARLY_BIRD">Early Bird</option>
              <option value="STUDENT">Student Discount</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter ticket status"
              className="w-full px-3 py-2 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active (On Sale)</option>
              <option value="SOLD_OUT">Sold Out</option>
              <option value="DISABLED">Disabled</option>
              <option value="UPCOMING">Upcoming</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-brand-muted pt-2 border-t border-brand-primary/10">
          <div>
            Showing <span className="font-semibold text-brand-navy">{filteredTickets.length}</span> of{" "}
            <span className="font-semibold text-brand-navy">{tickets.length}</span> ticket tiers
          </div>
          <div className="text-[11px] font-medium text-brand-primary">
            Passes processed through the ZiniPay payment gateway
          </div>
        </div>
      </div>

      {/* Ticket Table */}
      <div data-aos="fade-up" data-aos-delay="200">
        <TicketTable
          tickets={filteredTickets}
          onToggleStatus={handleToggleStatus}
        />
      </div>
    </div>
  );
}
