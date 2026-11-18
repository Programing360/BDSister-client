"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Mail,
  Printer,
  Sparkles,
  Info,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import type { EventRegistration, RegistrationStatus, AttendanceStatus } from "../../types/event";
import {
  RegistrationStatusBadge,
  PaymentStatusBadge,
  AttendanceStatusBadge,
} from "../common/event-status-badge";

interface RegistrationDetailViewProps {
  registration: EventRegistration;
}

export function RegistrationDetailView({
  registration: initialReg,
}: RegistrationDetailViewProps) {
  const [reg, setReg] = useState<EventRegistration>(initialReg);
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setSimulationToast(message);
    setTimeout(() => {
      setSimulationToast(null);
    }, 4500);
  };

  const handleUpdateStatus = (newStatus: RegistrationStatus) => {
    setReg((prev) => ({
      ...prev,
      registrationStatus: newStatus,
      timeline: [
        ...prev.timeline,
        {
          status: newStatus,
          timestamp: new Date().toISOString(),
          note: `Registration manually updated to ${newStatus} in admin session.`,
        },
      ],
    }));
    showToast(
      `[DEMO] Registration status updated to "${newStatus}". Changes are simulated locally.`
    );
  };

  const handleToggleAttendance = () => {
    const nextAttendance: AttendanceStatus =
      reg.attendanceStatus === "CHECKED_IN" ? "NOT_CHECKED_IN" : "CHECKED_IN";
    setReg((prev) => ({
      ...prev,
      attendanceStatus: nextAttendance,
      timeline: [
        ...prev.timeline,
        {
          status: nextAttendance,
          timestamp: new Date().toISOString(),
          note: `Gate check-in status simulated as ${nextAttendance}.`,
        },
      ],
    }));
    showToast(
      `[DEMO] Attendance toggled to "${nextAttendance}". QR gate simulation complete.`
    );
  };

  const handleResendConfirmation = () => {
    showToast(
      `[DEMO] Confirmation email and digital ticket dispatch simulated to ${reg.attendeeEmail}.`
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

      {/* Top Header */}
      <div
        data-aos="fade-up"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <Link
          href="/admin/events/registrations"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted hover:text-brand-primary transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Registrations
        </Link>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleResendConfirmation}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-brand-primary/20 text-brand-navy bg-white hover:bg-brand-primary/5 text-xs font-semibold shadow-sm transition"
          >
            <Mail className="w-3.5 h-3.5 text-brand-primary" />
            Resend Ticket Email
          </button>
          <button
            onClick={handleToggleAttendance}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-semibold shadow-[0_6px_20px_rgb(91,70,246,0.25)] transition"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {reg.attendanceStatus === "CHECKED_IN"
              ? "Revert Check-In"
              : "Simulate Gate Check-In"}
          </button>
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
          <span className="font-semibold">DEMO DATA NOTICE:</span> Registration approvals and simulated check-ins do not trigger live email or SMS notifications.
        </p>
      </div>

      {/* Two Column Layout (Summary Card on Left, Details & Timeline on Right) */}
      <div
        data-aos="fade-up"
        data-aos-delay="150"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* Left Column: Attendee Card & Status Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 p-6 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-brand-primary font-semibold">
                Attendee Profile
              </span>
              <RegistrationStatusBadge status={reg.registrationStatus} />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="w-12 h-12 rounded-full bg-brand-primary/15 text-brand-primary flex items-center justify-center font-bold text-base shrink-0">
                {reg.attendeeName.charAt(0)}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-brand-navy truncate">
                  {reg.attendeeName}
                </h2>
                <p className="text-xs text-brand-muted truncate">
                  {reg.attendeeEmail}
                </p>
                <p className="text-xs font-mono text-brand-muted">
                  Phone: {reg.attendeePhone}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-brand-surface/70 border border-brand-primary/10 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-brand-muted">Member ID:</span>
                <span className="font-mono font-semibold text-brand-navy">
                  {reg.memberId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Registered On:</span>
                <span className="font-semibold text-brand-navy">
                  {reg.registrationDate.slice(0, 10)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Gate Attendance:</span>
                <AttendanceStatusBadge status={reg.attendanceStatus} />
              </div>
            </div>

            {/* Status Change Buttons */}
            <div className="pt-2 space-y-2">
              <p className="text-xs font-semibold text-brand-navy">
                Simulate Status Action
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleUpdateStatus("APPROVED")}
                  disabled={reg.registrationStatus === "APPROVED"}
                  className="py-1.5 px-2 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 disabled:opacity-50 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus("WAITLISTED")}
                  disabled={reg.registrationStatus === "WAITLISTED"}
                  className="py-1.5 px-2 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 disabled:opacity-50 transition"
                >
                  Waitlist
                </button>
                <button
                  onClick={() => handleUpdateStatus("CANCELLED")}
                  disabled={reg.registrationStatus === "CANCELLED"}
                  className="py-1.5 px-2 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 disabled:opacity-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Payment Card (ZiniPay) */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 p-6 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-brand-primary font-semibold flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                Payment Record
              </span>
              <PaymentStatusBadge status={reg.paymentStatus} />
            </div>

            <div className="p-3.5 rounded-xl bg-brand-surface/70 border border-brand-primary/10 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-brand-muted">Amount Due:</span>
                <span className="font-semibold text-brand-navy">
                  {reg.ticketPriceBDT === 0
                    ? "Free (৳ 0)"
                    : `৳ ${reg.ticketPriceBDT.toLocaleString()} BDT`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Gateway:</span>
                <span className="font-semibold text-brand-navy">
                  ZiniPay Official
                </span>
              </div>
              {reg.paymentReference && (
                <div className="flex justify-between">
                  <span className="text-brand-muted">Transaction Ref:</span>
                  <span className="font-mono font-semibold text-brand-primary">
                    {reg.paymentReference}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Event Details & Action Timeline */}
        <div className="lg:col-span-7 space-y-6">
          {/* Linked Event Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 p-6 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-3">
            <span className="text-xs uppercase tracking-wider text-brand-primary font-semibold">
              Associated Event
            </span>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-brand-navy">
                  {reg.eventTitle}
                </h3>
                <p className="text-xs text-brand-muted font-mono mt-0.5">
                  Event Reference: {reg.eventId}
                </p>
              </div>
              <Link
                href={`/admin/events/${reg.eventId}`}
                className="text-xs font-semibold text-brand-primary hover:underline shrink-0"
              >
                View Event →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-brand-surface/60 border border-brand-primary/10">
                <p className="text-brand-muted">Pass Type</p>
                <p className="font-semibold text-brand-navy">{reg.ticketType}</p>
              </div>
              <div className="p-3 rounded-xl bg-brand-surface/60 border border-brand-primary/10">
                <p className="text-brand-muted">Pass Fare</p>
                <p className="font-semibold text-brand-navy">
                  {reg.ticketPriceBDT === 0
                    ? "Free Pass"
                    : `৳ ${reg.ticketPriceBDT} BDT`}
                </p>
              </div>
            </div>
          </div>

          {/* Registration History & Timeline */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 p-6 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-4">
            <h3 className="text-base font-semibold text-brand-navy flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-primary" />
              Audit Timeline
            </h3>

            <div className="space-y-4 border-l-2 border-brand-primary/20 ml-3 pl-4">
              {reg.timeline && reg.timeline.length > 0 ? (
                reg.timeline.map((step, idx) => (
                  <div key={idx} className="relative space-y-1 text-xs">
                    <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-brand-primary border-2 border-white"></div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-brand-navy">
                        {step.status}
                      </span>
                      <span className="text-[11px] text-brand-muted">
                        {step.timestamp.slice(0, 16).replace("T", " ")}
                      </span>
                    </div>
                    <p className="text-brand-muted">{step.note}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-brand-muted italic">
                  Initial registration captured on {reg.registrationDate}.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
