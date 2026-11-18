"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  CreditCard,
} from "lucide-react";
import type { EventRegistration } from "../../types/event";
import {
  RegistrationStatusBadge,
  PaymentStatusBadge,
  AttendanceStatusBadge,
} from "../common/event-status-badge";

interface RegistrationTableProps {
  registrations: EventRegistration[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onCancel: (id: string) => void;
}

export function RegistrationTable({
  registrations,
  onApprove,
  onReject,
  onCancel,
}: RegistrationTableProps) {
  if (registrations.length === 0) {
    return (
      <div className="p-12 text-center bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)]">
        <Users className="w-10 h-10 text-brand-muted/60 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-brand-navy">
          No Registrations Found
        </h3>
        <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
          No attendee registrations match your filter parameters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[1050px]">
          <thead className="bg-brand-surface/70 text-brand-muted uppercase text-[11px] font-semibold border-b border-brand-primary/10">
            <tr>
              <th className="py-3.5 px-4">Attendee / Member</th>
              <th className="py-3.5 px-4">Event</th>
              <th className="py-3.5 px-4">Ticket</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Payment</th>
              <th className="py-3.5 px-4">Attendance</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-primary/5">
            {registrations.map((reg) => (
              <tr
                key={reg.id}
                className="hover:bg-brand-surface/50 transition-colors"
              >
                {/* Attendee */}
                <td className="py-3.5 px-4">
                  <Link
                    href={`/admin/events/registrations/${reg.id}`}
                    className="font-semibold text-brand-navy hover:text-brand-primary text-sm line-clamp-1"
                  >
                    {reg.attendeeName}
                  </Link>
                  <p className="text-[11px] text-brand-muted">
                    {reg.attendeeEmail} • {reg.attendeePhone}
                  </p>
                </td>

                {/* Event */}
                <td className="py-3.5 px-4 max-w-xs">
                  <Link
                    href={`/admin/events/${reg.eventId}`}
                    className="font-medium text-brand-navy hover:text-brand-primary line-clamp-1"
                  >
                    {reg.eventTitle}
                  </Link>
                  <span className="text-[10px] text-brand-muted font-mono">
                    ID: {reg.eventId}
                  </span>
                </td>

                {/* Ticket & Fee */}
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-brand-navy">
                    {reg.ticketType}
                  </span>
                  <p className="text-[11px] text-brand-muted">
                    {reg.ticketPriceBDT === 0
                      ? "Free"
                      : `৳ ${reg.ticketPriceBDT}`}
                  </p>
                </td>

                {/* Registration Status */}
                <td className="py-3.5 px-4">
                  <RegistrationStatusBadge status={reg.registrationStatus} />
                </td>

                {/* Payment */}
                <td className="py-3.5 px-4">
                  <PaymentStatusBadge status={reg.paymentStatus} />
                  {reg.paymentReference && (
                    <p className="text-[10px] font-mono text-brand-muted mt-0.5 truncate max-w-[120px]">
                      {reg.paymentReference}
                    </p>
                  )}
                </td>

                {/* Attendance */}
                <td className="py-3.5 px-4">
                  <AttendanceStatusBadge status={reg.attendanceStatus} />
                </td>

                {/* Registration Date */}
                <td className="py-3.5 px-4 text-brand-muted">
                  {reg.registrationDate.slice(0, 10)}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {reg.registrationStatus === "PENDING" && (
                      <>
                        <button
                          onClick={() => onApprove(reg.id)}
                          className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                          title="Simulate Approval"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onReject(reg.id)}
                          className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition"
                          title="Simulate Reject"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {reg.registrationStatus === "APPROVED" && (
                      <button
                        onClick={() => onCancel(reg.id)}
                        className="px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition"
                      >
                        Cancel
                      </button>
                    )}
                    <Link
                      href={`/admin/events/registrations/${reg.id}`}
                      className="p-1.5 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition"
                      title="Inspect Registration Record"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-brand-primary/10 p-4 space-y-4">
        {registrations.map((reg) => (
          <div key={reg.id} className="pt-4 first:pt-0 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link
                  href={`/admin/events/registrations/${reg.id}`}
                  className="font-semibold text-brand-navy hover:text-brand-primary text-sm block"
                >
                  {reg.attendeeName}
                </Link>
                <p className="text-[11px] text-brand-muted">{reg.attendeeEmail}</p>
                <p className="text-xs font-medium text-brand-primary mt-0.5">
                  {reg.eventTitle}
                </p>
              </div>
              <RegistrationStatusBadge status={reg.registrationStatus} />
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs pt-1 border-t border-brand-primary/5">
              <span className="font-semibold text-brand-navy">
                {reg.ticketType} • {reg.ticketPriceBDT === 0 ? "Free" : `৳ ${reg.ticketPriceBDT}`}
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/events/registrations/${reg.id}`}
                  className="text-xs font-semibold text-brand-primary"
                >
                  Details →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
