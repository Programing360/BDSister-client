"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Ticket,
  DollarSign,
  Calendar,
  Clock,
  ArrowLeft,
  Edit,
  Sparkles,
  Info,
  CheckCircle2,
  Users,
} from "lucide-react";
import type { EventTicket, TicketStatus } from "../../types/event";
import { TicketStatusBadge } from "../common/event-status-badge";

interface TicketDetailViewProps {
  ticket: EventTicket;
}

export function TicketDetailView({ ticket: initialTicket }: TicketDetailViewProps) {
  const [ticket, setTicket] = useState<EventTicket>(initialTicket);
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setSimulationToast(message);
    setTimeout(() => {
      setSimulationToast(null);
    }, 4500);
  };

  const handleToggleStatus = () => {
    const nextStatus: TicketStatus =
      ticket.status === "ACTIVE" ? "DISABLED" : "ACTIVE";
    setTicket((prev) => ({ ...prev, status: nextStatus }));
    showToast(
      `[DEMO] Ticket pass status changed to "${nextStatus}". Changes are simulated locally.`
    );
  };

  const soldPct = Math.min(
    100,
    Math.round((ticket.soldQuantity / ticket.totalQuantity) * 100)
  );

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

      {/* Top Header */}
      <div
        data-aos="fade-up"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <Link
          href="/admin/events/tickets"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted hover:text-brand-primary transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Ticket Tiers
        </Link>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleToggleStatus}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
              ticket.status === "ACTIVE"
                ? "border-amber-400 text-amber-800 bg-amber-50 hover:bg-amber-100"
                : "border-emerald-400 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
            }`}
          >
            {ticket.status === "ACTIVE" ? "Disable Sales" : "Enable Sales"}
          </button>
          <Link
            href={`/admin/events/tickets/${ticket.id}/edit`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-semibold shadow-[0_6px_20px_rgb(91,70,246,0.25)] transition"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit Tier
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
          <span className="font-semibold">DEMO DATA NOTICE:</span> Ticket pricing, sales velocity, and inventory quotas are simulated records.
        </p>
      </div>

      {/* Main Ticket Card */}
      <div
        data-aos="fade-up"
        data-aos-delay="150"
        className="bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 p-6 lg:p-8 shadow-[0_12px_40px_rgb(91,70,246,0.08)] space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-primary/10 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary">
                {ticket.type} Pass
              </span>
              <TicketStatusBadge status={ticket.status} />
            </div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-brand-navy tracking-tight">
              {ticket.name}
            </h1>
            <p className="text-sm text-brand-muted font-normal max-w-xl">
              {ticket.description}
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-brand-primary/10 sm:pl-6">
            <p className="text-xs uppercase tracking-wider text-brand-muted font-semibold">
              Price (BDT)
            </p>
            <p className="text-3xl font-bold text-brand-navy">
              {ticket.priceBDT === 0 ? "Free" : `৳ ${ticket.priceBDT.toLocaleString()}`}
            </p>
            <p className="text-[11px] text-brand-muted">ZiniPay Gateway</p>
          </div>
        </div>

        {/* Sales Quota & Progress */}
        <div className="p-5 rounded-xl bg-brand-surface/70 border border-brand-primary/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-brand-navy">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-brand-primary" />
              Inventory & Quota Sold
            </span>
            <span>
              {ticket.soldQuantity} / {ticket.totalQuantity} passes ({soldPct}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-brand-primary/15 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                soldPct >= 90 ? "bg-amber-500" : "bg-brand-primary"
              }`}
              style={{ width: `${soldPct}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-brand-muted">
            <span>{ticket.totalQuantity - ticket.soldQuantity} passes available</span>
            <span>
              Revenue Generated: ৳ {(ticket.soldQuantity * ticket.priceBDT).toLocaleString()} BDT
            </span>
          </div>
        </div>

        {/* Event Association */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white border border-brand-primary/15 space-y-1">
            <p className="text-brand-muted font-medium">Assigned Event</p>
            <p className="font-semibold text-brand-navy text-sm">
              {ticket.eventTitle}
            </p>
            <Link
              href={`/admin/events/${ticket.eventId}`}
              className="text-brand-primary font-semibold hover:underline inline-block mt-1"
            >
              Open Event Specification →
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-white border border-brand-primary/15 space-y-1">
            <p className="text-brand-muted font-medium">Sales Window</p>
            <p className="font-semibold text-brand-navy text-sm">
              {ticket.salesStartDate} to {ticket.salesEndDate}
            </p>
            <p className="text-brand-muted">
              Auto-disables after {ticket.salesEndDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
