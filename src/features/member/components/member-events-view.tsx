"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Calendar,
    MapPin,
    Ticket,
    CheckCircle2,
    RefreshCw,
    AlertCircle,
    Loader2,
    Clock,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { SectionHelpTooltip } from "@/components/shared/section-help-tooltip";

interface EventItem {
    _id: string;
    title: string;
    description?: string;
    date?: string;
    time?: string;
    location?: string;
    wing?: string;
    ticketPrice?: number;
    isArchived?: boolean;
}

export function MemberEventsView() {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [tab, setTab] = useState<"UPCOMING" | "ARCHIVED">("UPCOMING");
    const [isLoading, setIsLoading] = useState(true);
    const [registeringId, setRegisteringId] = useState<string | null>(null);
    const [activeTicket, setActiveTicket] = useState<{
        eventTitle: string;
        ticketCode: string;
    } | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await apiClient.get<{ data?: EventItem[] }>(API_ENDPOINTS.events.list);
            const raw = res as unknown as { data?: EventItem[] } | EventItem[];
            setEvents(Array.isArray(raw) ? raw : raw.data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load events.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // Synchronized with POST /api/events/:id/register
    const handleRegister = async (ev: EventItem) => {
        setRegisteringId(ev._id);
        setError(null);
        try {
            const res = await apiClient.post<{
                ticketCode?: string;
                data?: { ticketCode?: string };
            }>(API_ENDPOINTS.events.register(ev._id));

            const raw = res as unknown as {
                ticketCode?: string;
                data?: { ticketCode?: string };
            };
            const code =
                raw.ticketCode ||
                raw.data?.ticketCode ||
                `BDS-PASS-${ev._id.slice(-6).toUpperCase()}`;

            setActiveTicket({ eventTitle: ev.title, ticketCode: code });
            setToast(`Registration confirmed for "${ev.title}"!`);
            setTimeout(() => setToast(null), 3500);
            await fetchEvents();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not complete registration.");
        } finally {
            setRegisteringId(null);
        }
    };

    const filteredEvents = events.filter((ev) =>
        tab === "ARCHIVED" ? Boolean(ev.isArchived) : !ev.isArchived
    );

    return (
        <div className="space-y-6 pb-14">
            {toast && (
                <div className="flex items-center gap-2 rounded-2xl border border-[#5B9891]/30 bg-[#5B9891]/10 p-3.5 text-xs font-bold text-[#467A74]">
                    <CheckCircle2 className="h-4 w-4 text-[#5B9891]" />
                    <span>{toast}</span>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
                    <AlertCircle className="h-4 w-4 text-rose-500" />
                    <span>{error}</span>
                </div>
            )}

            {/* Entry Ticket Banner */}
            {activeTicket && (
                <div className="rounded-2xl border-2 border-dashed border-[#D98408] bg-[#F7DFC7]/65 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D98408]">
                            Confirmed Sisterhood Event Pass
                        </span>
                        <h3 className="text-base font-bold text-gray-900 mt-0.5">
                            {activeTicket.eventTitle}
                        </h3>
                        <p className="font-mono text-xs font-black text-[#467A74] mt-1">
                            PASS CODE: {activeTicket.ticketCode}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setActiveTicket(null)}
                        className="rounded-xl bg-white border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700 self-start sm:self-auto"
                    >
                        Close Pass
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/55 via-white to-[#5B9891]/12 p-6 shadow-xs">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            Events, Workshops & Tickets
                        </h1>
                        <SectionHelpTooltip
                            title="Sisterhood Gatherings & Learning"
                            explanation="Register for upcoming workshops, halaqahs, and networking meetups across BDSisters wings and view your entry tickets."
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                        Reserve your spot and access your digital entry passes.
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

            {/* Upcoming / Archived Tabs */}
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setTab("UPCOMING")}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition ${tab === "UPCOMING"
                            ? "bg-[#5B9891] text-white"
                            : "bg-white border border-gray-200 text-gray-600"
                        }`}
                >
                    Upcoming Events
                </button>
                <button
                    type="button"
                    onClick={() => setTab("ARCHIVED")}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition ${tab === "ARCHIVED"
                            ? "bg-[#D98408] text-white"
                            : "bg-white border border-gray-200 text-gray-600"
                        }`}
                >
                    Past Event Archive
                </button>
            </div>

            {/* Events Grid */}
            {isLoading ? (
                <div className="flex justify-center py-16">
                    <Loader2 className="h-7 w-7 text-[#5B9891] animate-spin" />
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="rounded-2xl border border-gray-200/80 bg-white p-12 text-center text-xs text-gray-400">
                    No {tab === "ARCHIVED" ? "archived" : "upcoming"} events found right now.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredEvents.map((ev) => (
                        <div
                            key={ev._id}
                            className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs flex flex-col justify-between space-y-4"
                        >
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="rounded-full bg-[#F7DFC7] px-2.5 py-0.5 text-[10px] font-bold text-[#D98408]">
                                        {ev.wing || "BDSisters Official"}
                                    </span>
                                    <span className="text-xs font-black text-[#467A74]">
                                        {ev.ticketPrice && ev.ticketPrice > 0
                                            ? `৳${ev.ticketPrice}`
                                            : "Free Entry"}
                                    </span>
                                </div>

                                <h3 className="text-base font-bold text-gray-900">{ev.title}</h3>
                                <p className="text-xs text-gray-600 line-clamp-2">{ev.description}</p>

                                <div className="flex flex-wrap gap-3 pt-1 text-[11px] text-gray-500 font-medium">
                                    <span className="inline-flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5 text-[#5B9891]" />
                                        {ev.date ? new Date(ev.date).toLocaleDateString("en-BD") : "Upcoming"}
                                    </span>
                                    {ev.time && (
                                        <span className="inline-flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5 text-[#D98408]" />
                                            {ev.time}
                                        </span>
                                    )}
                                    <span className="inline-flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5 text-[#5B9891]" />
                                        {ev.location || "Online / Zoom"}
                                    </span>
                                </div>
                            </div>

                            {!ev.isArchived && (
                                <div className="flex items-center justify-between border-t border-gray-100 pt-3.5">
                                    <button
                                        type="button"
                                        onClick={() => handleRegister(ev)}
                                        disabled={registeringId === ev._id}
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B9891] px-4 py-2 text-xs font-bold text-white hover:bg-[#467A74] transition disabled:opacity-50"
                                    >
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        <span>
                                            {registeringId === ev._id ? "Confirming..." : "Register / Join"}
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActiveTicket({
                                                eventTitle: ev.title,
                                                ticketCode: `BDS-PASS-${ev._id.slice(-6).toUpperCase()}`,
                                            })
                                        }
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#D98408]/35 bg-[#F7DFC7]/60 px-3.5 py-2 text-xs font-bold text-[#D98408] hover:bg-[#F2B55D]/40 transition"
                                    >
                                        <Ticket className="h-3.5 w-3.5" />
                                        <span>View Pass</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}