"use client";

import React from "react";
import Link from "next/link";
import {
  Ticket,
  Edit,
  ExternalLink,
  DollarSign,
  Calendar,
  Sparkles,
} from "lucide-react";
import type { EventTicket } from "../../types/event";
import { TicketStatusBadge } from "../common/event-status-badge";

interface TicketTableProps {
  tickets: EventTicket[];
  onToggleStatus: (ticketId: string) => void;
}

export function TicketTable({ tickets, onToggleStatus }: TicketTableProps) {
  if (tickets.length === 0) {
    return (
      <div className="p-12 text-center bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)]">
        <Ticket className="w-10 h-10 text-brand-muted/60 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-brand-navy">
          No Ticket Tiers Found
        </h3>
        <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
          No tickets match your search parameters. Try adjusting filters or create a new pass type.
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
              <th className="py-3.5 px-4">Ticket Name & Tier</th>
              <th className="py-3.5 px-4">Event</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Quota Sold</th>
              <th className="py-3.5 px-4">Sales Window</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-primary/5">
            {tickets.map((t) => {
              const quotaPct = Math.min(
                100,
                Math.round((t.soldQuantity / t.totalQuantity) * 100)
              );

              return (
                <tr
                  key={t.id}
                  className="hover:bg-brand-surface/50 transition-colors"
                >
                  {/* Ticket Name */}
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/admin/events/tickets/${t.id}`}
                      className="font-semibold text-brand-navy hover:text-brand-primary text-sm line-clamp-1"
                    >
                      {t.name}
                    </Link>
                    <p className="text-[11px] text-brand-muted line-clamp-1">
                      {t.description}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary">
                      {t.type}
                    </span>
                  </td>

                  {/* Associated Event */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <Link
                      href={`/admin/events/${t.eventId}`}
                      className="font-medium text-brand-navy hover:text-brand-primary line-clamp-1"
                    >
                      {t.eventTitle}
                    </Link>
                    <span className="text-[10px] text-brand-muted font-mono">
                      Event ID: {t.eventId}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 font-semibold text-brand-navy text-sm">
                    {t.priceBDT === 0 ? "Free" : `৳ ${t.priceBDT.toLocaleString()}`}
                  </td>

                  {/* Quota Sold */}
                  <td className="py-3.5 px-4 min-w-[130px]">
                    <div className="flex justify-between text-[11px] font-semibold text-brand-navy mb-1">
                      <span>{t.soldQuantity}</span>
                      <span className="text-brand-muted">/ {t.totalQuantity}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-brand-primary/15 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          quotaPct >= 90 ? "bg-amber-500" : "bg-brand-primary"
                        }`}
                        style={{ width: `${quotaPct}%` }}
                      ></div>
                    </div>
                  </td>

                  {/* Sales Window */}
                  <td className="py-3.5 px-4 text-brand-muted">
                    <p className="font-medium text-brand-navy">
                      {t.salesStartDate}
                    </p>
                    <p className="text-[11px]">Until {t.salesEndDate}</p>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <TicketStatusBadge status={t.status} />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onToggleStatus(t.id)}
                        className="px-2 py-1 rounded-lg text-[11px] font-semibold border border-brand-primary/20 text-brand-navy hover:bg-brand-primary/10 transition"
                      >
                        {t.status === "ACTIVE" ? "Disable" : "Enable"}
                      </button>
                      <Link
                        href={`/admin/events/tickets/${t.id}/edit`}
                        className="p-1.5 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition"
                        title="Edit Ticket"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/events/tickets/${t.id}`}
                        className="p-1.5 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition"
                        title="View Ticket Details"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-brand-primary/10 p-4 space-y-3">
        {tickets.map((t) => (
          <div key={t.id} className="pt-3 first:pt-0 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <Link
                  href={`/admin/events/tickets/${t.id}`}
                  className="font-semibold text-brand-navy hover:text-brand-primary text-sm block"
                >
                  {t.name}
                </Link>
                <p className="text-xs text-brand-muted line-clamp-1">{t.eventTitle}</p>
              </div>
              <TicketStatusBadge status={t.status} />
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-brand-primary/5">
              <span className="font-semibold text-brand-navy">
                {t.priceBDT === 0 ? "Free" : `৳ ${t.priceBDT}`} ({t.soldQuantity}/{t.totalQuantity} sold)
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/events/tickets/${t.id}/edit`}
                  className="text-xs font-semibold text-brand-primary"
                >
                  Edit
                </Link>
                <Link
                  href={`/admin/events/tickets/${t.id}`}
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
