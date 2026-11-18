"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Ticket,
  ArrowLeft,
  Save,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";
import type { EventTicket, TicketTypeCategory, TicketStatus } from "../../types/event";
import { DEMO_EVENTS } from "../../data/mock-events";

interface TicketFormProps {
  initialData?: EventTicket;
  isEdit?: boolean;
}

export function TicketForm({ initialData, isEdit = false }: TicketFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<EventTicket>>(
    initialData || {
      eventId: DEMO_EVENTS[0]?.id || "evt-101",
      eventTitle: DEMO_EVENTS[0]?.title || "Bangladesh Women Tech Leaders Summit 2025",
      name: "",
      type: "PAID",
      description: "",
      priceBDT: 500,
      totalQuantity: 100,
      soldQuantity: 0,
      salesStartDate: "2025-04-01",
      salesEndDate: "2025-05-14",
      status: "ACTIVE",
    }
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const eventId = e.target.value;
    const evt = DEMO_EVENTS.find((ev) => ev.id === eventId);
    setFormData((prev) => ({
      ...prev,
      eventId,
      eventTitle: evt?.title || "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setToastMessage(
        `[DEMO] Ticket "${formData.name}" ${
          isEdit ? "updated" : "created"
        } successfully. Changes are simulated locally.`
      );
      setTimeout(() => {
        router.push("/admin/events/tickets");
      }, 1500);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          data-aos="fade-down"
          className="fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-brand-navy/95 text-white rounded-xl shadow-[0_12px_36px_rgba(91,70,246,0.3)] border border-brand-primary/40 backdrop-blur-md text-sm font-medium animate-in fade-in slide-in-from-top-4"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold">
          <Ticket className="w-3.5 h-3.5" />
          {isEdit ? "Editing Ticket Tier" : "New Ticket Pass"}
        </div>
      </div>

      {/* Notice Banner */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-sm"
      >
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="font-medium">
          <span className="font-semibold">DEMO MODE:</span> Ticket pricing, inventory limits, and availability windows are local simulated parameters.
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        data-aos="fade-up"
        data-aos-delay="150"
        className="bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 p-6 lg:p-8 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-6"
      >
        <div className="border-b border-brand-primary/10 pb-3">
          <h2 className="text-lg font-semibold text-brand-navy">
            Ticket Specification
          </h2>
          <p className="text-xs text-brand-muted font-normal">
            Assign to an event, define pricing, and designate sales quotas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">
              Assigned Event *
            </label>
            <select
              value={formData.eventId}
              onChange={handleEventChange}
              className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            >
              {DEMO_EVENTS.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.title} ({evt.startDate})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">
              Ticket Tier Name *
            </label>
            <input
              type="text"
              required
              value={formData.name || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g. Early Bird All-Access Pass"
              className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">
              Pass Classification
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  type: e.target.value as TicketTypeCategory,
                }))
              }
              className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            >
              <option value="FREE">Free Pass</option>
              <option value="PAID">Standard Paid Pass</option>
              <option value="VIP">VIP Premium Access</option>
              <option value="EARLY_BIRD">Early Bird Discount</option>
              <option value="STUDENT">Student Discount Pass</option>
              <option value="CUSTOM">Custom Tier</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">
              Price (BDT) *
            </label>
            <input
              type="number"
              min={0}
              required
              value={formData.priceBDT ?? 0}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  priceBDT: Number(e.target.value),
                }))
              }
              placeholder="0 for Free"
              className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">
              Total Quota (Quantity Available) *
            </label>
            <input
              type="number"
              min={1}
              required
              value={formData.totalQuantity || 100}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  totalQuantity: Number(e.target.value),
                }))
              }
              className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">
              Sales Start Date
            </label>
            <input
              type="date"
              value={formData.salesStartDate || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  salesStartDate: e.target.value,
                }))
              }
              className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">
              Sales End Date
            </label>
            <input
              type="date"
              value={formData.salesEndDate || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  salesEndDate: e.target.value,
                }))
              }
              className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">
              Description & Inclusions
            </label>
            <textarea
              rows={3}
              value={formData.description || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="What does this pass include? (e.g. lunch, networking lounge, workshop materials)"
              className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as TicketStatus,
                }))
              }
              className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            >
              <option value="ACTIVE">Active (Available for booking)</option>
              <option value="SOLD_OUT">Sold Out</option>
              <option value="DISABLED">Disabled</option>
              <option value="UPCOMING">Upcoming</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-primary/10">
          <Link
            href="/admin/events/tickets"
            className="px-5 py-2.5 rounded-xl border border-brand-primary/20 text-brand-navy bg-white hover:bg-brand-primary/5 text-sm font-semibold transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-semibold shadow-[0_6px_20px_rgb(91,70,246,0.25)] transition disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {isSubmitting
              ? "Saving..."
              : isEdit
              ? "Update Ticket"
              : "Create Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
}
