"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Eye,
  Edit,
  Power,
  XCircle,
  Archive,
  Users,
  MapPin,
  Globe,
} from "lucide-react";
import { EventItem } from "../../types/event";
import {
  EventStatusBadge,
  EventFormatBadge,
} from "../common/event-status-badge";

interface EventTableProps {
  events: EventItem[];
  onTogglePublish: (id: string) => void;
  onCancelEvent: (id: string) => void;
  onArchiveEvent?: (id: string) => void;
}

export function EventTable({
  events,
  onTogglePublish,
  onCancelEvent,
  onArchiveEvent,
}: EventTableProps) {
  if (events.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-md">
        <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-gray-800">No events found</h3>
        <p className="text-xs text-gray-500 mt-1">Try modifying your search or filter selections.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-xl shadow-purple-500/5">
        <table className="w-full text-left text-xs min-w-[1100px]">
          <thead className="bg-gray-50/75 border-b border-gray-100 uppercase tracking-wider text-gray-500 font-semibold">
            <tr>
              <th className="py-3.5 px-4 min-w-[320px]">Event & Category</th>
              <th className="py-3.5 px-4 min-w-[140px]">Format</th>
              <th className="py-3.5 px-4 min-w-[180px]">Schedule & Venue</th>
              <th className="py-3.5 px-4 min-w-[150px]">Registrations</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right min-w-[170px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {events.map((evt) => {
              const filledPercent = Math.round((evt.registrationCount / evt.capacity) * 100);
              return (
                <tr key={evt.id} className="hover:bg-purple-50/20 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={evt.coverImageUrl}
                        alt={evt.title}
                        className="w-14 h-12 rounded-xl object-cover shrink-0 border border-gray-100 shadow-xs"
                      />
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-mono text-gray-400">{evt.id}</span>
                          <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.2 rounded">
                            {evt.categoryName}
                          </span>
                        </div>
                        <Link
                          href={`/admin/events/${evt.id}`}
                          className="font-bold text-gray-900 hover:text-purple-600 block line-clamp-1 transition-colors text-sm"
                        >
                          {evt.title}
                        </Link>
                        <p className="text-[11px] text-gray-400">
                          Organizer: <span className="text-gray-600 font-medium">{evt.organizer.name}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <EventFormatBadge format={evt.format} />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-gray-900">
                        {new Date(evt.startDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <span className="text-[11px] text-gray-500 block">
                        {evt.startTime} - {evt.endTime}
                      </span>
                      <span className="text-[11px] text-gray-400 block truncate max-w-[170px]">
                        {evt.venue ? evt.venue.city : "Online Stream"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-1 max-w-[140px]">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-gray-800">{evt.registrationCount} / {evt.capacity}</span>
                        <span className="text-purple-700">{filledPercent}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-purple-600 h-1.5 rounded-full"
                          style={{ width: `${filledPercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-medium text-gray-500">
                        {evt.ticketPriceBDT === 0 ? "Free Entry" : `৳ ${evt.ticketPriceBDT.toLocaleString()} BDT`}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <EventStatusBadge status={evt.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/events/${evt.id}`}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/events/${evt.id}/edit`}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all"
                        title="Edit Event"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => onTogglePublish(evt.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          evt.status === "PUBLISHED" || evt.status === "UPCOMING"
                            ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                            : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        }`}
                        title={
                          evt.status === "PUBLISHED" || evt.status === "UPCOMING"
                            ? "Unpublish to Draft"
                            : "Publish Event"
                        }
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onCancelEvent(evt.id)}
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-all"
                        title="Cancel Event (Demo)"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Fallback */}
      <div className="md:hidden space-y-3">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="p-4 rounded-xl border border-gray-100 bg-white shadow-md space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <EventStatusBadge status={evt.status} />
                  <EventFormatBadge format={evt.format} />
                </div>
                <Link
                  href={`/admin/events/${evt.id}`}
                  className="font-bold text-sm text-gray-900 block"
                >
                  {evt.title}
                </Link>
              </div>
              <span className="text-[10px] font-mono text-gray-400">{evt.id}</span>
            </div>

            <p className="text-xs text-gray-500 line-clamp-2">
              {evt.shortDescription}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
              <span>📅 {evt.startDate}</span>
              <span>{evt.registrationCount} / {evt.capacity} registered</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Link
                href={`/admin/events/${evt.id}`}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-gray-200 text-gray-700"
              >
                Inspect
              </Link>
              <Link
                href={`/admin/events/${evt.id}/edit`}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-50 text-purple-700 border border-purple-200"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => onTogglePublish(evt.id)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600"
              >
                Toggle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
