import React from "react";
import Link from "next/link";
import { Calendar, ArrowRight, MapPin, Users, Radio } from "lucide-react";
import { DEMO_EVENTS } from "../../data/mock-events";
import { EventStatusBadge, EventFormatBadge } from "../common/event-status-badge";

export function UpcomingEventsCard() {
  const activeEvents = DEMO_EVENTS.filter(
    (e) => e.status === "UPCOMING" || e.status === "ONGOING"
  ).slice(0, 4);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-purple-500/5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-purple-50 text-purple-700">
            <Calendar className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Active & Upcoming Events
            </h3>
            <p className="text-xs text-gray-500">
              Gatherings with open attendee registrations
            </p>
          </div>
        </div>
        <Link
          href="/admin/events/all"
          className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-colors"
        >
          View All
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3.5">
        {activeEvents.map((evt) => {
          const filledPercent = Math.round((evt.registrationCount / evt.capacity) * 100);
          return (
            <div
              key={evt.id}
              className="p-4 rounded-xl border border-gray-100 hover:bg-purple-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1.5 flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <EventStatusBadge status={evt.status} />
                  <EventFormatBadge format={evt.format} />
                  <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    {evt.categoryName}
                  </span>
                </div>
                <Link
                  href={`/admin/events/${evt.id}`}
                  className="font-bold text-sm text-gray-900 hover:text-purple-600 block line-clamp-1 transition-colors"
                >
                  {evt.title}
                </Link>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>
                    📅 {new Date(evt.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} at {evt.startTime}
                  </span>
                  <span>•</span>
                  <span>
                    {evt.venue ? evt.venue.city : "Online"}
                  </span>
                </div>
              </div>

              <div className="shrink-0 w-full sm:w-36 space-y-1 self-end sm:self-center">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-600">{evt.registrationCount} / {evt.capacity}</span>
                  <span className="font-bold text-purple-700">{filledPercent}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${filledPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
