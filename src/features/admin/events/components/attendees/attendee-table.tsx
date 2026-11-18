"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  QrCode,
  Sparkles,
} from "lucide-react";
import type { EventAttendee } from "../../types/event";
import { AttendanceStatusBadge } from "../common/event-status-badge";

interface AttendeeTableProps {
  attendees: EventAttendee[];
  onToggleCheckIn: (attendeeId: string) => void;
}

export function AttendeeTable({
  attendees,
  onToggleCheckIn,
}: AttendeeTableProps) {
  if (attendees.length === 0) {
    return (
      <div className="p-12 text-center bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)]">
        <Users className="w-10 h-10 text-brand-muted/60 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-brand-navy">
          No Attendees Found
        </h3>
        <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
          No attendees match your search or filter options.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[950px]">
          <thead className="bg-brand-surface/70 text-brand-muted uppercase text-[11px] font-semibold border-b border-brand-primary/10">
            <tr>
              <th className="py-3.5 px-4">Attendee Name</th>
              <th className="py-3.5 px-4">Event</th>
              <th className="py-3.5 px-4">Ticket Type</th>
              <th className="py-3.5 px-4">Gate Status</th>
              <th className="py-3.5 px-4">Check-In Timestamp</th>
              <th className="py-3.5 px-4 text-right">Gate Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-primary/5">
            {attendees.map((attendee) => (
              <tr
                key={attendee.id}
                className="hover:bg-brand-surface/50 transition-colors"
              >
                {/* Attendee Name & Contact */}
                <td className="py-3.5 px-4">
                  <p className="font-semibold text-brand-navy text-sm">
                    {attendee.name}
                  </p>
                  <p className="text-[11px] text-brand-muted">
                    {attendee.email} • {attendee.phone}
                  </p>
                </td>

                {/* Event */}
                <td className="py-3.5 px-4 max-w-xs">
                  <Link
                    href={`/admin/events/${attendee.eventId}`}
                    className="font-medium text-brand-navy hover:text-brand-primary line-clamp-1"
                  >
                    {attendee.eventTitle}
                  </Link>
                  <span className="text-[10px] text-brand-muted font-mono">
                    Reg: {attendee.registrationId}
                  </span>
                </td>

                {/* Ticket Type */}
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-brand-primary/10 text-brand-primary">
                    {attendee.ticketType}
                  </span>
                </td>

                {/* Gate Status */}
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      attendee.checkInStatus === "CHECKED_IN"
                        ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-700 border border-amber-500/20"
                    }`}
                  >
                    {attendee.checkInStatus === "CHECKED_IN" ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Checked In
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 text-amber-600" />
                        Awaiting Arrival
                      </>
                    )}
                  </span>
                </td>

                {/* Check-In Timestamp */}
                <td className="py-3.5 px-4 font-mono text-[11px] text-brand-muted">
                  {attendee.checkInTime ? attendee.checkInTime : "—"}
                </td>

                {/* Gate Actions */}
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onToggleCheckIn(attendee.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      attendee.checkInStatus === "CHECKED_IN"
                        ? "border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100"
                        : "border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    {attendee.checkInStatus === "CHECKED_IN"
                      ? "Undo Check-In"
                      : "Scan QR Check-In"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-brand-primary/10 p-4 space-y-3">
        {attendees.map((attendee) => (
          <div key={attendee.id} className="pt-3 first:pt-0 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-brand-navy text-sm">
                  {attendee.name}
                </p>
                <p className="text-[11px] text-brand-muted">{attendee.email}</p>
                <p className="text-xs text-brand-primary mt-0.5">
                  {attendee.eventTitle}
                </p>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  attendee.checkInStatus === "CHECKED_IN"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {attendee.checkInStatus}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-brand-primary/5">
              <span className="text-brand-muted">Pass: {attendee.ticketType}</span>
              <button
                onClick={() => onToggleCheckIn(attendee.id)}
                className="text-xs font-semibold text-brand-primary hover:underline"
              >
                {attendee.checkInStatus === "CHECKED_IN" ? "Undo" : "Check In"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
