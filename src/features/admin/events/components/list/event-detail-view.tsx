"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  Globe,
  Users,
  Ticket,
  DollarSign,
  ArrowLeft,
  Edit,
  Share2,
  Download,
  Mail,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Info,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import type { EventItem, EventStatus } from "../../types/event";
import {
  EventStatusBadge,
  EventFormatBadge,
  EventTypeBadge,
  RegistrationStatusBadge,
  PaymentStatusBadge,
} from "../common/event-status-badge";
import { DEMO_REGISTRATIONS, DEMO_TICKETS } from "../../data/mock-events";

interface EventDetailViewProps {
  event: EventItem;
}

export function EventDetailView({ event: initialEvent }: EventDetailViewProps) {
  const [event, setEvent] = useState<EventItem>(initialEvent);
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setSimulationToast(message);
    setTimeout(() => {
      setSimulationToast(null);
    }, 4500);
  };

  const handleTogglePublish = () => {
    const nextStatus: EventStatus =
      event.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setEvent((prev) => ({ ...prev, status: nextStatus }));
    showToast(
      `[DEMO] Event status updated to "${nextStatus}". Changes are simulated locally.`
    );
  };

  const handleCancelEvent = () => {
    setEvent((prev) => ({ ...prev, status: "CANCELLED" }));
    showToast(
      `[DEMO] Event marked as CANCELLED. Attendee refund sequence simulated.`
    );
  };

  const handleSimulateExport = () => {
    showToast(
      `[DEMO] Attendee roster export for "${event.title}" generated (CSV format).`
    );
  };

  const handleSimulateEmail = () => {
    showToast(
      `[DEMO] Announcement broadcast simulated to ${event.registrationCount} registered attendees.`
    );
  };

  const capacityPct = Math.min(
    100,
    Math.round((event.registrationCount / event.capacity) * 100)
  );

  const eventRegistrations = DEMO_REGISTRATIONS.filter(
    (reg) => reg.eventId === event.id
  );
  const eventTickets = DEMO_TICKETS.filter(
    (t) => t.eventId === event.id
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

      {/* Top Navigation & Back Action */}
      <div
        data-aos="fade-up"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <Link
          href="/admin/events/all"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted hover:text-brand-primary transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events Catalogue
        </Link>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSimulateExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-brand-primary/20 text-brand-navy bg-white hover:bg-brand-primary/5 text-xs font-semibold shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5 text-brand-primary" />
            Export Attendees
          </button>
          <button
            onClick={handleSimulateEmail}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-brand-primary/20 text-brand-navy bg-white hover:bg-brand-primary/5 text-xs font-semibold shadow-sm transition"
          >
            <Mail className="w-3.5 h-3.5 text-brand-primary" />
            Broadcast Notice
          </button>
          <Link
            href={`/admin/events/${event.id}/edit`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-semibold shadow-[0_6px_20px_rgb(91,70,246,0.25)] transition"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit Event
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
          <span className="font-semibold">DEMO DATA NOTICE:</span> You are viewing an isolated fictional event record. Administrative actions mutate local session state only.
        </p>
      </div>

      {/* Main Two-Column Showcase Section (Cover on Left, Rich Details on Right) */}
      <div
        data-aos="fade-up"
        data-aos-delay="150"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 p-6 lg:p-8 shadow-[0_12px_40px_rgb(91,70,246,0.08)]"
      >
        {/* Left Column: Cover Image & Quick Metrics */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-brand-primary/15 shadow-[0_8px_24px_rgba(91,70,246,0.12)] group">
            <Image
              src={event.coverImageUrl}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent"></div>
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <EventStatusBadge status={event.status} />
              <EventFormatBadge format={event.format} />
            </div>
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-xs uppercase tracking-wider text-brand-primary font-semibold">
                {event.categoryName}
              </span>
              <p className="text-sm font-semibold truncate">{event.venue?.city || "Virtual Event"}</p>
            </div>
          </div>

          {/* Registration Capacity Progress Bar */}
          <div className="p-4 rounded-xl bg-brand-surface/70 border border-brand-primary/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-brand-navy">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brand-primary" />
                Registrations
              </span>
              <span>
                {event.registrationCount} / {event.capacity} seats ({capacityPct}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-brand-primary/15 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  capacityPct >= 90 ? "bg-amber-500" : "bg-brand-primary"
                }`}
                style={{ width: `${capacityPct}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-brand-muted">
              <span>{event.capacity - event.registrationCount} seats remaining</span>
              <span>{event.allowWaitlist ? "Waitlist Enabled" : "No Waitlist"}</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={handleTogglePublish}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                event.status === "PUBLISHED"
                  ? "border-amber-400/40 text-amber-800 bg-amber-50/70 hover:bg-amber-100"
                  : "border-emerald-400/40 text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100"
              }`}
            >
              {event.status === "PUBLISHED" ? "Unpublish to Draft" : "Publish Event"}
            </button>
            <button
              onClick={handleCancelEvent}
              disabled={event.status === "CANCELLED"}
              className="py-2 px-3 rounded-xl text-xs font-semibold border border-rose-300 text-rose-700 bg-rose-50/70 hover:bg-rose-100 disabled:opacity-50 transition"
            >
              Cancel Event
            </button>
          </div>
        </div>

        {/* Right Column: Event Information, Date, Location, Organizer */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <EventTypeBadge type={event.eventType} />
              <span className="text-xs text-brand-muted font-medium">
                ID: {event.id}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-brand-navy tracking-tight leading-snug">
              {event.title}
            </h1>
            <p className="text-sm font-medium text-brand-muted leading-relaxed">
              {event.shortDescription}
            </p>
          </div>

          {/* Timing & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-xl bg-brand-surface/60 border border-brand-primary/10 text-xs text-brand-navy">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-brand-muted font-medium">Dates & Schedule</p>
                <p className="font-semibold text-brand-navy">
                  {event.startDate} – {event.endDate}
                </p>
                <p className="text-brand-muted">
                  {event.startTime} - {event.endTime} ({event.timezone})
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-brand-muted font-medium">Location / Venue</p>
                {event.venue ? (
                  <>
                    <p className="font-semibold text-brand-navy">{event.venue.name}</p>
                    <p className="text-brand-muted">{event.venue.address}, {event.venue.city}</p>
                  </>
                ) : (
                  <p className="font-semibold text-brand-navy">
                    Virtual Online Stream
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary shrink-0">
                <Ticket className="w-4 h-4" />
              </div>
              <div>
                <p className="text-brand-muted font-medium">Ticket Price</p>
                <p className="font-semibold text-brand-navy text-sm">
                  {event.ticketPriceBDT === 0 ? "Free Access" : `৳ ${event.ticketPriceBDT.toLocaleString()} BDT`}
                </p>
                <p className="text-brand-muted">Via ZiniPay Gateway</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-brand-muted font-medium">Registration Window</p>
                <p className="font-semibold text-brand-navy">
                  Until {event.registrationClosingDate}
                </p>
                <p className="text-brand-muted">
                  {event.isRegistrationOpen ? "Open for booking" : "Registration Closed"}
                </p>
              </div>
            </div>
          </div>

          {/* Full Description */}
          <div className="space-y-2 text-sm text-brand-navy/90">
            <h3 className="font-semibold text-brand-navy text-base">About this Event</h3>
            <p className="leading-relaxed whitespace-pre-line font-normal text-brand-navy/80">
              {event.fullDescription}
            </p>
          </div>

          {/* Organizer Info Card */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-brand-primary/15 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-brand-primary/15 text-brand-primary flex items-center justify-center font-semibold text-base shrink-0">
              {event.organizer.name.charAt(0)}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wide text-brand-primary font-semibold">
                  Lead Organizer
                </span>
                <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                  <ShieldCheck className="w-3 h-3 mr-0.5" /> Verified
                </span>
              </div>
              <h4 className="text-sm font-semibold text-brand-navy">
                {event.organizer.name}
              </h4>
              <p className="text-xs text-brand-muted">
                {event.organizer.role} • {event.organizer.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Types for this Event */}
      <div
        data-aos="fade-up"
        data-aos-delay="200"
        className="bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 p-6 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-brand-navy">Ticket Options</h3>
            <p className="text-xs text-brand-muted font-normal">
              Available passes and pricing tiers configured for this event.
            </p>
          </div>
          <Link
            href="/admin/events/tickets/create"
            className="text-xs font-semibold text-brand-primary hover:underline"
          >
            + Add Ticket Tier
          </Link>
        </div>

        {eventTickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 rounded-xl border border-brand-primary/15 bg-brand-surface/40 space-y-2 hover:border-brand-primary/40 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-navy">
                    {ticket.name}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-brand-primary/10 text-brand-primary">
                    {ticket.type}
                  </span>
                </div>
                <p className="text-xs text-brand-muted line-clamp-2">
                  {ticket.description}
                </p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-brand-primary/10">
                  <span className="font-semibold text-brand-navy">
                    {ticket.priceBDT === 0 ? "Free" : `৳ ${ticket.priceBDT.toLocaleString()}`}
                  </span>
                  <span className="text-brand-muted">
                    {ticket.soldQuantity} / {ticket.totalQuantity} sold
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-brand-muted italic py-3">
            General registration active at ৳ {event.ticketPriceBDT} BDT.
          </p>
        )}
      </div>

      {/* Registrations Roster Preview */}
      <div
        data-aos="fade-up"
        data-aos-delay="250"
        className="bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 p-6 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-brand-navy">
              Registered Attendees ({eventRegistrations.length})
            </h3>
            <p className="text-xs text-brand-muted font-normal">
              List of sister members registered for this event.
            </p>
          </div>
          <Link
            href="/admin/events/registrations"
            className="text-xs font-semibold text-brand-primary hover:underline"
          >
            View All Registrations →
          </Link>
        </div>

        {eventRegistrations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-surface/70 text-brand-muted uppercase text-[11px] font-semibold border-b border-brand-primary/10">
                <tr>
                  <th className="py-2.5 px-3">Attendee</th>
                  <th className="py-2.5 px-3">Ticket Type</th>
                  <th className="py-2.5 px-3">Reg. Status</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-primary/5">
                {eventRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-brand-surface/40">
                    <td className="py-2.5 px-3">
                      <p className="font-semibold text-brand-navy">{reg.attendeeName}</p>
                      <p className="text-[11px] text-brand-muted">{reg.attendeeEmail}</p>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-brand-navy">{reg.ticketType}</td>
                    <td className="py-2.5 px-3">
                      <RegistrationStatusBadge status={reg.registrationStatus} />
                    </td>
                    <td className="py-2.5 px-3">
                      <PaymentStatusBadge status={reg.paymentStatus} />
                    </td>
                    <td className="py-2.5 px-3 text-brand-muted">{reg.registrationDate.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-brand-muted italic py-3">
            No attendees currently registered for this session in the demo dataset.
          </p>
        )}
      </div>
    </div>
  );
}
