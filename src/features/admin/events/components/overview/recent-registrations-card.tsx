import React from "react";
import Link from "next/link";
import { Ticket, ArrowRight, UserCheck, Clock } from "lucide-react";
import { DEMO_REGISTRATIONS } from "../../data/mock-events";
import {
  RegistrationStatusBadge,
  PaymentStatusBadge,
} from "../common/event-status-badge";

export function RecentRegistrationsCard() {
  const latestRegs = DEMO_REGISTRATIONS.slice(0, 4);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-purple-500/5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-pink-50 text-pink-700">
            <Ticket className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Recent Registrations
            </h3>
            <p className="text-xs text-gray-500">
              Latest attendee sign-ups across events & workshops
            </p>
          </div>
        </div>
        <Link
          href="/admin/events/registrations"
          className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-colors"
        >
          View All ({DEMO_REGISTRATIONS.length})
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {latestRegs.map((reg) => (
          <div
            key={reg.id}
            className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/40 hover:bg-purple-50/20 transition-colors flex flex-col gap-2"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-gray-900">
                  {reg.attendeeName}
                </span>
                <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                  {reg.ticketType}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <RegistrationStatusBadge status={reg.registrationStatus} />
                <PaymentStatusBadge status={reg.paymentStatus} />
              </div>
            </div>

            <p className="text-xs text-gray-600 line-clamp-1">
              {reg.eventTitle}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
              <span className="text-gray-400 font-mono">{reg.id}</span>
              <span>
                {new Date(reg.registrationDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
