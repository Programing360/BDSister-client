"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    Calendar,
    MapPin,
    Ticket,
    CheckCircle2,
    RefreshCw,
    AlertCircle,
    Loader2,
    Clock,
    User,
    Check,
    X,
    Sparkles,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { SectionHelpTooltip } from "@/components/shared/section-help-tooltip";
import { useAuth } from "@/hooks/use-auth";

interface RegisteredAttendee {
    _id?: string;
    fullName?: string;
    email?: string;
}

interface EventItem {
    _id: string;
    title: string;
    description?: string;
    date?: string;
    time?: string;
    location?: string;
    locationType?: "Online" | "Offline";
    locationDetails?: string;
    wing?: string;
    speaker?: string;
    ticketPrice?: number;
    isFree?: boolean;
    isArchived?: boolean;
    isPast?: boolean;
    ticketCode?: string;
    registeredAttendees?: Array<string | RegisteredAttendee>;
}

export function MemberEventsView() {
    const { user } = useAuth();
    const [events, setEvents] = useState<EventItem[]>([]);
    const [myRegisteredEventIds, setMyRegisteredEventIds] = useState<Set<string>>(new Set());
    const [savedPassCodes, setSavedPassCodes] = useState<Record<string, string>>({});
    const [tab, setTab] = useState<"UPCOMING" | "ARCHIVED">("UPCOMING");
    const [isLoading, setIsLoading] = useState(true);
    const [registeringId, setRegisteringId] = useState<string | null>(null);
    const [activeTicket, setActiveTicket] = useState<{
        eventId: string;
        eventTitle: string;
        ticketCode: string;
        date?: string;
        time?: string;
        speaker?: string;
        location?: string;
    } | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const currentUserId = user?.id || (user as unknown as { _id?: string })?._id || "";

    const computePassCode = useCallback((eventId: string, userId?: string) => {
        const uId = userId || currentUserId || "SISTER";
        return `BDS-PASS-${eventId.slice(-4).toUpperCase()}-${uId.slice(-4).toUpperCase()}`;
    }, [currentUserId]);

    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch all events
            const res = await apiClient.get<{ data?: EventItem[] }>(API_ENDPOINTS.events.list);
            const raw = res as unknown as { data?: EventItem[] } | EventItem[];
            const eventList = Array.isArray(raw) ? raw : raw.data || [];
            setEvents(eventList);

            // Fetch user's registrations if available
            try {
                const regRes = await apiClient.get<{ data?: EventItem[] }>(API_ENDPOINTS.events.myRegistrations);
                const rawReg = regRes as unknown as { data?: EventItem[] } | EventItem[];
                const regList = Array.isArray(rawReg) ? rawReg : rawReg.data || [];

                const regIdSet = new Set<string>();
                const passMap: Record<string, string> = {};

                regList.forEach((ev) => {
                    regIdSet.add(ev._id);
                    if (ev.ticketCode) {
                        passMap[ev._id] = ev.ticketCode;
                    }
                });

                // Also check registeredAttendees in the main list
                if (currentUserId) {
                    eventList.forEach((ev) => {
                        const isMatch = (ev.registeredAttendees || []).some((att) => {
                            if (typeof att === "string") return att === currentUserId;
                            return att._id === currentUserId;
                        });
                        if (isMatch) {
                            regIdSet.add(ev._id);
                            if (!passMap[ev._id]) {
                                passMap[ev._id] = ev.ticketCode || computePassCode(ev._id, currentUserId);
                            }
                        }
                    });
                }

                setMyRegisteredEventIds(regIdSet);
                setSavedPassCodes((prev) => ({ ...prev, ...passMap }));
            } catch {
                // If myRegistrations fails, inspect registeredAttendees in eventList
                if (currentUserId) {
                    const fallbackSet = new Set<string>();
                    const fallbackMap: Record<string, string> = {};
                    eventList.forEach((ev) => {
                        const isMatch = (ev.registeredAttendees || []).some((att) => {
                            if (typeof att === "string") return att === currentUserId;
                            return att._id === currentUserId;
                        });
                        if (isMatch) {
                            fallbackSet.add(ev._id);
                            fallbackMap[ev._id] = computePassCode(ev._id, currentUserId);
                        }
                    });
                    setMyRegisteredEventIds(fallbackSet);
                    setSavedPassCodes((prev) => ({ ...prev, ...fallbackMap }));
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load events.");
        } finally {
            setIsLoading(false);
        }
    }, [currentUserId, computePassCode]);

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
                alreadyRegistered?: boolean;
                data?: { ticketCode?: string; isUserRegistered?: boolean };
            }>(API_ENDPOINTS.events.register(ev._id));

            const raw = res as unknown as {
                ticketCode?: string;
                alreadyRegistered?: boolean;
                data?: { ticketCode?: string; isUserRegistered?: boolean };
            };

            const code =
                raw.ticketCode ||
                raw.data?.ticketCode ||
                computePassCode(ev._id, currentUserId);

            // Mark as registered in local state
            setMyRegisteredEventIds((prev) => new Set(prev).add(ev._id));
            setSavedPassCodes((prev) => ({ ...prev, [ev._id]: code }));

            setActiveTicket({
                eventId: ev._id,
                eventTitle: ev.title,
                ticketCode: code,
                date: ev.date,
                time: ev.time,
                speaker: ev.speaker,
                location: ev.locationDetails || ev.location,
            });

            setToast(
                raw.alreadyRegistered
                    ? `Pass loaded for "${ev.title}".`
                    : `Registration confirmed for "${ev.title}"!`
            );
            setTimeout(() => setToast(null), 3500);
            await fetchEvents();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not complete registration.");
        } finally {
            setRegisteringId(null);
        }
    };

    const handleViewPass = (ev: EventItem) => {
        const passCode =
            savedPassCodes[ev._id] ||
            ev.ticketCode ||
            computePassCode(ev._id, currentUserId);

        setActiveTicket({
            eventId: ev._id,
            eventTitle: ev.title,
            ticketCode: passCode,
            date: ev.date,
            time: ev.time,
            speaker: ev.speaker,
            location: ev.locationDetails || ev.location,
        });

        // Ensure state remembers it
        setMyRegisteredEventIds((prev) => new Set(prev).add(ev._id));
        setSavedPassCodes((prev) => ({ ...prev, [ev._id]: passCode }));
    };

    const filteredEvents = useMemo(() => {
        return events.filter((ev) =>
            tab === "ARCHIVED" ? Boolean(ev.isArchived || ev.isPast) : !ev.isArchived && !ev.isPast
        );
    }, [events, tab]);

    return (
        <div className="space-y-6 pb-14">
            {toast && (
                <div className="flex items-center gap-2 rounded-2xl border border-[#5B9891]/30 bg-[#5B9891]/10 p-3.5 text-xs font-bold text-[#467A74] animate-in fade-in">
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
                <div className="rounded-3xl border-2 border-dashed border-[#D98408] bg-gradient-to-r from-[#F7DFC7]/80 via-white to-[#FAF8F5] p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5 animate-in fade-in zoom-in-95">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#D98408] text-white px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
                                <Sparkles className="w-3 h-3" /> Confirmed Sisterhood Event Pass
                            </span>
                        </div>
                        <h3 className="text-lg font-extrabold text-[#111E28]">
                            {activeTicket.eventTitle}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 pt-0.5">
                            {activeTicket.date && (
                                <span className="inline-flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-[#5B9891]" />
                                    {new Date(activeTicket.date).toLocaleDateString("en-US", {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </span>
                            )}
                            {activeTicket.time && (
                                <span className="inline-flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-[#D98408]" />
                                    {activeTicket.time}
                                </span>
                            )}
                            {activeTicket.location && (
                                <span className="inline-flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                    {activeTicket.location}
                                </span>
                            )}
                        </div>
                        <div className="pt-2">
                            <span className="font-mono text-xs font-black text-[#5B9891] bg-white px-3 py-1.5 rounded-xl border border-[#5B9891]/30 shadow-2xs inline-block">
                                PASS CODE: {activeTicket.ticketCode}
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setActiveTicket(null)}
                        className="rounded-xl bg-white border border-stone-200 px-4 py-2 text-xs font-bold text-stone-700 hover:bg-[#FAF8F5] self-start sm:self-auto shadow-2xs transition-colors"
                    >
                        Close Pass
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/55 via-white to-[#5B9891]/12 p-6 shadow-xs">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-[#111E28] sm:text-3xl">
                            Events, Workshops & Tickets
                        </h1>
                        <SectionHelpTooltip
                            title="Sisterhood Gatherings & Learning"
                            explanation="Register for upcoming workshops, halaqahs, and networking meetups across BDSisters wings and view your entry tickets."
                        />
                    </div>
                    <p className="mt-1 text-xs text-stone-600">
                        Reserve your spot and access your digital entry passes.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchEvents}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#5B9891]/30 bg-white px-4 py-2 text-xs font-bold text-[#5B9891] hover:bg-[#FAF8F5] transition-colors"
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
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                        tab === "UPCOMING"
                            ? "bg-[#5B9891] text-white shadow-xs"
                            : "bg-white border border-stone-200 text-stone-600 hover:bg-[#FAF8F5]"
                    }`}
                >
                    Upcoming Events
                </button>
                <button
                    type="button"
                    onClick={() => setTab("ARCHIVED")}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                        tab === "ARCHIVED"
                            ? "bg-[#D98408] text-white shadow-xs"
                            : "bg-white border border-stone-200 text-stone-600 hover:bg-[#FAF8F5]"
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
                <div className="rounded-3xl border border-stone-200/80 bg-white p-12 text-center text-xs text-stone-400 shadow-2xs">
                    No {tab === "ARCHIVED" ? "archived" : "upcoming"} events found right now.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredEvents.map((ev) => {
                        const isRegistered = myRegisteredEventIds.has(ev._id);
                        const isFreeEvent = ev.isFree ?? (ev.ticketPrice === 0 || !ev.ticketPrice);

                        return (
                            <div
                                key={ev._id}
                                className="rounded-3xl border border-stone-200/90 bg-white p-6 shadow-2xs hover:border-[#5B9891]/40 transition-all flex flex-col justify-between space-y-4"
                            >
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="rounded-full bg-[#F7DFC7] px-2.5 py-0.5 text-[10px] font-bold text-[#D98408]">
                                            {ev.wing || "BDSisters Official"}
                                        </span>
                                        <span className="text-xs font-black text-[#5B9891]">
                                            {isFreeEvent
                                                ? "Free Entry"
                                                : `৳${ev.ticketPrice} BDT`}
                                        </span>
                                    </div>

                                    <h3 className="text-base font-bold text-[#111E28]">{ev.title}</h3>
                                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                                        {ev.description}
                                    </p>

                                    <div className="flex flex-wrap gap-3 pt-1 text-[11px] text-stone-500 font-medium">
                                        <span className="inline-flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5 text-[#5B9891]" />
                                            {ev.date
                                                ? new Date(ev.date).toLocaleDateString("en-US", {
                                                      weekday: "short",
                                                      month: "short",
                                                      day: "numeric",
                                                  })
                                                : "Upcoming"}
                                        </span>
                                        {ev.time && (
                                            <span className="inline-flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5 text-[#D98408]" />
                                                {ev.time}
                                            </span>
                                        )}
                                        {ev.speaker && (
                                            <span className="inline-flex items-center gap-1">
                                                <User className="h-3.5 w-3.5 text-[#5B9891]" />
                                                {ev.speaker}
                                            </span>
                                        )}
                                        <span className="inline-flex items-center gap-1">
                                            <MapPin className="h-3.5 w-3.5 text-rose-500" />
                                            {ev.locationDetails || ev.location || "Online / Zoom"}
                                        </span>
                                    </div>
                                </div>

                                {!ev.isArchived && !ev.isPast && (
                                    <div className="flex items-center justify-between border-t border-stone-100 pt-3.5">
                                        {/* Register Button vs Registered Badge */}
                                        {isRegistered ? (
                                            <button
                                                type="button"
                                                disabled
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-700 cursor-default shadow-2xs"
                                            >
                                                <Check className="h-3.5 w-3.5 stroke-[3]" />
                                                <span>Registered ✓</span>
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleRegister(ev)}
                                                disabled={registeringId === ev._id}
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B9891] px-4 py-2 text-xs font-bold text-white hover:bg-[#467A74] transition disabled:opacity-50 shadow-2xs"
                                            >
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                <span>
                                                    {registeringId === ev._id ? "Confirming..." : "Register / Join"}
                                                </span>
                                            </button>
                                        )}

                                        {/* View Pass Button */}
                                        <button
                                            type="button"
                                            onClick={() => handleViewPass(ev)}
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#D98408]/35 bg-[#F7DFC7]/60 px-3.5 py-2 text-xs font-bold text-[#D98408] hover:bg-[#F2B55D]/40 transition shadow-2xs"
                                        >
                                            <Ticket className="h-3.5 w-3.5" />
                                            <span>View Pass</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
