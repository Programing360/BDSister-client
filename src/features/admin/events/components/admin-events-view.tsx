"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Calendar, Archive, RefreshCw, MapPin, Users } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface EventItem {
    _id: string;
    title: string;
    description?: string;
    date?: string;
    location?: string;
    wing?: string;
    ticketPrice?: number;
    attendeesCount?: number;
    isArchived?: boolean;
}

export function AdminEventsView({ mode }: { mode: "upcoming" | "archive" }) {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        try {
            const endpoint =
                mode === "archive" ? API_ENDPOINTS.events.archive : API_ENDPOINTS.events.list;
            const res = await apiClient.get<{ data?: EventItem[] }>(endpoint);
            const raw = res as unknown as { data?: EventItem[] } | EventItem[];
            setEvents(Array.isArray(raw) ? raw : raw.data || []);
        } catch {
            setEvents([]);
        } finally {
            setIsLoading(false);
        }
    }, [mode]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/45 via-white to-[#5B9891]/10 p-6 shadow-xs">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            {mode === "upcoming" ? "Upcoming Events & Workshops" : "Past Event Archive"}
                        </h1>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-3 py-0.5 text-xs font-bold text-[#D98408]">
                            {mode === "upcoming" ? (
                                <>
                                    <Calendar className="h-3.5 w-3.5" /> Registration & Ticketing
                                </>
                            ) : (
                                <>
                                    <Archive className="h-3.5 w-3.5" /> Videos & Galleries
                                </>
                            )}
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                        {mode === "upcoming"
                            ? "Manage upcoming workshops, sessions across wings, and attendee registrations."
                            : "Browse recorded event sessions, write-ups, and photo galleries."}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchEvents}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#5B9891]/30 bg-white px-4 py-2 text-xs font-bold text-[#5B9891]"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoading ? (
                    <p className="col-span-2 py-12 text-center text-xs text-gray-400 animate-pulse">
                        Loading events...
                    </p>
                ) : events.length === 0 ? (
                    <p className="col-span-2 py-12 text-center text-xs text-gray-400 rounded-2xl border border-gray-200/80 bg-white">
                        No {mode === "upcoming" ? "upcoming events" : "archived events"} found.
                    </p>
                ) : (
                    events.map((ev) => (
                        <div
                            key={ev._id}
                            className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs space-y-3"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="text-sm font-bold text-gray-900">{ev.title}</h3>
                                {ev.wing && (
                                    <span className="rounded-full bg-[#F7DFC7] px-2.5 py-0.5 text-[10px] font-bold text-[#D98408]">
                                        {ev.wing}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2">{ev.description}</p>
                            <div className="flex flex-wrap items-center justify-between border-t border-gray-100 pt-3 text-[11px] text-gray-600">
                                <span className="inline-flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5 text-[#5B9891]" />
                                    {ev.location || "Online / Zoom"}
                                </span>
                                <span className="inline-flex items-center gap-1 font-bold text-[#467A74]">
                                    <Users className="h-3.5 w-3.5" />
                                    {ev.attendeesCount ?? 0} Registered
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}