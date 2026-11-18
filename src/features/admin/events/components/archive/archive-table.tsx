"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Archive,
  Calendar,
  Users,
  Video,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import type { EventItem } from "../../types/event";
import { EventStatusBadge, EventFormatBadge } from "../common/event-status-badge";

interface ArchiveTableProps {
  events: EventItem[];
  onRestore: (eventId: string) => void;
}

export function ArchiveTable({ events, onRestore }: ArchiveTableProps) {
  if (events.length === 0) {
    return (
      <div className="p-12 text-center bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)]">
        <Archive className="w-10 h-10 text-brand-muted/60 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-brand-navy">
          No Archived Events Found
        </h3>
        <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
          No completed or historical summits match your search query.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[950px]">
          <thead className="bg-brand-surface/70 text-brand-muted uppercase text-[11px] font-semibold border-b border-brand-primary/10">
            <tr>
              <th className="py-3.5 px-4">Archived Event</th>
              <th className="py-3.5 px-4">Event Date</th>
              <th className="py-3.5 px-4">Format</th>
              <th className="py-3.5 px-4">Final Turnout</th>
              <th className="py-3.5 px-4">Recordings & Media</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-primary/5">
            {events.map((evt) => (
              <tr
                key={evt.id}
                className="hover:bg-brand-surface/50 transition-colors"
              >
                {/* Event Title & Cover */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-brand-surface border border-brand-primary/15 shrink-0">
                      <Image
                        src={evt.coverImageUrl}
                        alt={evt.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/admin/events/${evt.id}`}
                        className="font-semibold text-brand-navy hover:text-brand-primary text-sm line-clamp-1"
                      >
                        {evt.title}
                      </Link>
                      <p className="text-[11px] text-brand-muted line-clamp-1">
                        {evt.categoryName} • {evt.venue?.city || "Virtual"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Event Date */}
                <td className="py-3.5 px-4 font-medium text-brand-navy">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                    <span>{evt.startDate}</span>
                  </div>
                </td>

                {/* Format */}
                <td className="py-3.5 px-4">
                  <EventFormatBadge format={evt.format} />
                </td>

                {/* Turnout */}
                <td className="py-3.5 px-4 font-semibold text-brand-navy">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-brand-primary" />
                    {evt.registrationCount} attendees
                  </span>
                </td>

                {/* Recordings & Media */}
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-brand-primary/10 text-brand-primary">
                    <Video className="w-3 h-3" />
                    Session Archived
                  </span>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <EventStatusBadge status={evt.status} />
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onRestore(evt.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-brand-primary/20 text-brand-navy hover:bg-brand-primary/10 transition"
                      title="Simulate Restore Event"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-brand-primary" />
                      Restore
                    </button>
                    <Link
                      href={`/admin/events/${evt.id}`}
                      className="p-1.5 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition"
                      title="View Event Archive"
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
    </div>
  );
}
