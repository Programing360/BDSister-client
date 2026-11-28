"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
    Calendar,
    MapPin,
    Clock,
    Ticket,
    Search,
    Sparkles,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Video,
    Users,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface PublicEventItem {
    _id: string;
    title: string;
    description?: string;
    eventType?: "Online" | "In-Person" | "Hybrid" | string;
    date: string;
    time?: string;
    location?: string;
    meetingLink?: string;
    bannerImage?: string;
    isFree?: boolean;
    ticketPrice?: number;
    capacity?: number;
    registeredUsers?: string[];
    status?: string;
}

export function PublicEventsView() {
    const searchParams = useSearchParams();
    const initialQuery =
        searchParams.get("search") ||
        searchParams.get("category") ||
        searchParams.get("wing") ||
        "";

    const [events, setEvents] = useState<PublicEventItem[]>([]);
    const [filterTab, setFilterTab] = useState<"upcoming" | "past">("upcoming");
    const [searchQuery, setSearchQuery] = useState(initialQuery);

    const [isLoading, setIsLoading] = useState(true);
    const [registeringId, setRegisteringId] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 4000);
    };

    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const baseUrl =
                filterTab === "past"
                    ? API_ENDPOINTS.events.archiveList
                    : API_ENDPOINTS.events.list;

            const separator = baseUrl.includes("?") ? "&" : "?";
            const url = searchQuery.trim()
                ? `${baseUrl}${separator}search=${encodeURIComponent(searchQuery.trim())}`
                : baseUrl;

            const res = await apiClient.get<any>(url);
            const raw = res as any;
            const list: PublicEventItem[] = Array.isArray(raw)
                ? raw
                : Array.isArray(raw?.data)
                ? raw.data
                : Array.isArray(raw?.data?.events)
                ? raw.data.events
                : Array.isArray(raw?.events)
                ? raw.events
                : [];
            setEvents(list);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to load sisterhood events."
            );
            setEvents([]);
        } finally {
            setIsLoading(false);
        }
    }, [filterTab, searchQuery]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchEvents();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchEvents]);

    const handleRegisterOrBuyTicket = async (event: PublicEventItem) => {
        setRegisteringId(event._id);
        setError(null);
        try {
            const res = await apiClient.post<{
                message?: string;
                data?: { paymentUrl?: string; payment_url?: string };
            }>(API_ENDPOINTS.events.ticket(event._id));

            const raw = res as unknown as {
                message?: string;
                data?: { paymentUrl?: string; payment_url?: string };
            };
            const redirectUrl = raw.data?.paymentUrl || raw.data?.payment_url;

            if (redirectUrl) {
                window.location.href = redirectUrl;
                return;
            }

            showToast(
                raw.message ||
                "RSVP confirmed! View your ticket and link in My Events & Tickets."
            );
            await fetchEvents();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Please sign in as a member to register for this event."
            );
        } finally {
            setRegisteringId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {toast && (
                    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-[#5B9891]/40 bg-white px-4 py-3 text-xs font-bold text-[#467A74] shadow-lg">
                        <CheckCircle2 className="h-4 w-4 text-[#5B9891]" />
                        <span>{toast}</span>
                    </div>
                )}

                {/* Header */}
                <div className="rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/60 via-white to-[#5B9891]/15 p-8 shadow-xs">
                    <div className="max-w-3xl space-y-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5B9891]/15 px-3 py-1 text-xs font-bold text-[#467A74]">
                            <Calendar className="h-3.5 w-3.5" /> Workshops, Webinars & Meetups
                        </span>
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            BDSisters Events & Gatherings
                        </h1>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Join skill-building workshops, Islamic personal development circles, and women-only
                            networking sessions across Bangladesh and online.
                        </p>
                    </div>

                    {/* Search & Upcoming/Past Switcher */}
                    <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        <div className="relative flex-1 max-w-md">
                            <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-3" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search workshops or topics..."
                                className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2 text-xs font-medium text-gray-900 focus:border-[#5B9891] focus:outline-hidden"
                            />
                        </div>

                        <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 self-start">
                            <button
                                type="button"
                                onClick={() => setFilterTab("upcoming")}
                                className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${filterTab === "upcoming"
                                        ? "bg-[#5B9891] text-white"
                                        : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                Upcoming Events
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilterTab("past")}
                                className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${filterTab === "past"
                                        ? "bg-[#D98408] text-white"
                                        : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                Past Archive
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
                        <AlertCircle className="h-4 w-4 text-rose-500" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Events Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-3">
                        <Loader2 className="h-8 w-8 text-[#5B9891] animate-spin" />
                        <p className="text-xs font-semibold text-gray-500">
                            Loading sisterhood events...
                        </p>
                    </div>
                ) : !Array.isArray(events) || events.length === 0 ? (
                    <div className="rounded-3xl border border-gray-200/80 bg-white p-14 text-center space-y-3">
                        <Sparkles className="h-9 w-9 text-[#D98408] mx-auto" />
                        <h3 className="text-base font-bold text-gray-900">
                            No {filterTab === "upcoming" ? "Upcoming" : "Archived"} Events Found
                        </h3>
                        <p className="text-xs text-gray-500 max-w-md mx-auto">
                            New workshops and sisterhood sessions are scheduled regularly. Check back soon!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(Array.isArray(events) ? events : []).map((ev) => {
                            const isFree = ev.isFree || !ev.ticketPrice || ev.ticketPrice === 0;
                            const regCount = ev.registeredUsers?.length || 0;

                            return (
                                <div
                                    key={ev._id}
                                    className="flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white overflow-hidden shadow-2xs hover:border-[#5B9891]/50 transition"
                                >
                                    <div>
                                        <div className="relative h-44 w-full bg-gradient-to-br from-[#5B9891]/20 to-[#F7DFC7]/60 flex items-center justify-center overflow-hidden">
                                            {ev.bannerImage ? (
                                                <img
                                                    src={ev.bannerImage}
                                                    alt={ev.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <Calendar className="h-10 w-10 text-[#5B9891]" />
                                            )}

                                            <span
                                                className={`absolute top-3 right-3 rounded-full px-3 py-1 text-[11px] font-extrabold ${isFree
                                                        ? "bg-[#5B9891] text-white"
                                                        : "bg-[#D98408] text-white"
                                                    }`}
                                            >
                                                {isFree ? "FREE RSVP" : `৳${ev.ticketPrice}`}
                                            </span>
                                        </div>

                                        <div className="p-6 space-y-3">
                                            <div className="flex items-center gap-2 text-[11px] font-bold text-[#467A74]">
                                                {ev.eventType === "Online" ? (
                                                    <Video className="h-3.5 w-3.5" />
                                                ) : (
                                                    <MapPin className="h-3.5 w-3.5" />
                                                )}
                                                <span>{ev.eventType || "Sisterhood Session"}</span>
                                            </div>

                                            <h2 className="text-base font-bold text-gray-900 line-clamp-2">
                                                {ev.title}
                                            </h2>

                                            {ev.description && (
                                                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                                                    {ev.description}
                                                </p>
                                            )}

                                            <div className="pt-2 space-y-1.5 text-xs text-gray-600">
                                                <p className="flex items-center gap-2">
                                                    <Clock className="h-3.5 w-3.5 text-[#D98408]" />
                                                    <span>
                                                        {new Date(ev.date).toLocaleDateString("en-BD", {
                                                            weekday: "short",
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}
                                                        {ev.time ? ` • ${ev.time}` : ""}
                                                    </span>
                                                </p>

                                                {ev.location && (
                                                    <p className="flex items-center gap-2">
                                                        <MapPin className="h-3.5 w-3.5 text-[#5B9891]" />
                                                        <span className="truncate">{ev.location}</span>
                                                    </p>
                                                )}

                                                {ev.capacity && (
                                                    <p className="flex items-center gap-2 text-[11px] text-gray-500">
                                                        <Users className="h-3.5 w-3.5 text-gray-400" />
                                                        <span>
                                                            {regCount} / {ev.capacity} Sisters Registered
                                                        </span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {filterTab === "upcoming" && (
                                        <div className="p-5 pt-0">
                                            <button
                                                type="button"
                                                disabled={registeringId === ev._id}
                                                onClick={() => handleRegisterOrBuyTicket(ev)}
                                                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#5B9891] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#467A74] transition disabled:opacity-50"
                                            >
                                                <Ticket className="h-4 w-4" />
                                                <span>
                                                    {registeringId === ev._id
                                                        ? "Processing..."
                                                        : isFree
                                                            ? "Reserve Free Seat"
                                                            : `Book Ticket (৳${ev.ticketPrice})`}
                                                </span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}