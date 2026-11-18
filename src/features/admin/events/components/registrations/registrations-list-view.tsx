"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Download,
  Sparkles,
  Info,
  Calendar,
  CreditCard,
} from "lucide-react";
import type { EventRegistration, RegistrationStatus } from "../../types/event";
import { DEMO_REGISTRATIONS } from "../../data/mock-events";
import { RegistrationTable } from "./registration-table";

export function RegistrationsListView() {
  const [registrations, setRegistrations] =
    useState<EventRegistration[]>(DEMO_REGISTRATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setSimulationToast(message);
    setTimeout(() => {
      setSimulationToast(null);
    }, 4500);
  };

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const matchesSearch =
        reg.attendeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.attendeeEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (reg.paymentReference &&
          reg.paymentReference.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "ALL" || reg.registrationStatus === statusFilter;

      const matchesPayment =
        paymentFilter === "ALL" || reg.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [registrations, searchQuery, statusFilter, paymentFilter]);

  const handleApprove = (id: string) => {
    setRegistrations((prev) =>
      prev.map((reg) => {
        if (reg.id === id) {
          showToast(
            `[DEMO] Registration for ${reg.attendeeName} approved. Confirmation email dispatch simulated.`
          );
          return {
            ...reg,
            registrationStatus: "APPROVED" as RegistrationStatus,
          };
        }
        return reg;
      })
    );
  };

  const handleReject = (id: string) => {
    setRegistrations((prev) =>
      prev.map((reg) => {
        if (reg.id === id) {
          showToast(`[DEMO] Registration for ${reg.attendeeName} rejected.`);
          return {
            ...reg,
            registrationStatus: "REJECTED" as RegistrationStatus,
          };
        }
        return reg;
      })
    );
  };

  const handleCancel = (id: string) => {
    setRegistrations((prev) =>
      prev.map((reg) => {
        if (reg.id === id) {
          showToast(`[DEMO] Registration for ${reg.attendeeName} cancelled.`);
          return {
            ...reg,
            registrationStatus: "CANCELLED" as RegistrationStatus,
          };
        }
        return reg;
      })
    );
  };

  const handleExportCSV = () => {
    showToast(
      `[DEMO] Generated registration roster CSV for ${filteredRegistrations.length} attendees.`
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
            <Users className="w-3.5 h-3.5" />
            Sign-up Administration
          </div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-brand-navy tracking-tight">
            Event Registrations
          </h1>
          <p className="text-sm font-normal text-brand-muted">
            Review, approve, waitlist, or cancel attendee enrollments across all summits and workshops.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-primary/20 text-brand-navy bg-white hover:bg-brand-primary/5 text-sm font-semibold shadow-sm transition"
          >
            <Download className="w-4 h-4 text-brand-primary" />
            Export CSV
          </button>
          <Link
            href="/admin/events/attendees"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-semibold shadow-[0_6px_20px_rgb(91,70,246,0.25)] transition"
          >
            Gate Attendees View
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
          <span className="font-semibold">DEMO DATA NOTICE:</span> Registration approvals and ticket validation run entirely on local UI state.
        </p>
      </div>

      {/* Filters Toolbar */}
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
              placeholder="Search attendee, email, event, or ref..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy placeholder:text-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter registration status"
              className="w-full px-3 py-2 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Review</option>
              <option value="APPROVED">Approved</option>
              <option value="WAITLISTED">Waitlisted</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              aria-label="Filter payment status"
              className="w-full px-3 py-2 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="SUCCESSFUL">Paid (Successful)</option>
              <option value="NOT_REQUIRED">Free (Not Required)</option>
              <option value="PENDING">Payment Pending</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-brand-muted pt-2 border-t border-brand-primary/10">
          <div>
            Showing <span className="font-semibold text-brand-navy">{filteredRegistrations.length}</span> of{" "}
            <span className="font-semibold text-brand-navy">{registrations.length}</span> registrations
          </div>
          <div className="text-[11px] font-medium text-brand-primary">
            Integrated with ZiniPay transaction references
          </div>
        </div>
      </div>

      {/* Table */}
      <div data-aos="fade-up" data-aos-delay="200">
        <RegistrationTable
          registrations={filteredRegistrations}
          onApprove={handleApprove}
          onReject={handleReject}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
