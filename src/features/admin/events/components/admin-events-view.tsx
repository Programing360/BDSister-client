"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    Calendar,
    Archive,
    RefreshCw,
    MapPin,
    Users,
    Plus,
    X,
    CheckCircle2,
    Clock,
    User,
    Tag,
    Ticket,
    Video,
    FileText,
    FileSpreadsheet,
    Edit,
    Trash2,
    Eye,
    ExternalLink,
    AlertCircle,
    Search,
    BookOpen,
    Layers,
    Share2,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface RegisteredUser {
    _id?: string;
    fullName?: string;
    email?: string;
    profilePicture?: string;
    location?: { district?: string; city?: string; country?: string };
    referralCode?: string;
}

export interface AdminEventItem {
    _id: string;
    title: string;
    description: string;
    organizerId?: { fullName?: string; email?: string; profilePicture?: string };
    wing?: string;
    eventType?: string;
    speaker?: string;
    date: string;
    time: string;
    locationType: "Online" | "Offline";
    locationDetails: string;
    bannerUrl?: string;
    ticketPrice?: number;
    isFree?: boolean;
    maxAttendees?: number;
    isPast?: boolean;
    isCancelled?: boolean;
    recordingUrl?: string;
    slidesUrl?: string;
    summaryNotes?: string;
    archiveMedia?: Array<{ type: "video" | "image" | "writeup"; url: string; caption?: string }>;
    registeredAttendees?: RegisteredUser[];
    createdAt?: string;
}

const WING_OPTIONS = ["BDSisters", "MIDJ", "CoP", "TSPP", "The Hut Network"];
const EVENT_TYPE_OPTIONS = ["Workshop", "Halaqah", "Masterclass", "Webinar", "Networking Circle"];

export function AdminEventsView({ mode }: { mode: "upcoming" | "archive" }) {
    const [events, setEvents] = useState<AdminEventItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedWing, setSelectedWing] = useState("ALL");
    const [toast, setToast] = useState<string | null>(null);

    // Modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<AdminEventItem | null>(null);
    const [attendeesEvent, setAttendeesEvent] = useState<AdminEventItem | null>(null);
    const [archiveModalEvent, setArchiveModalEvent] = useState<AdminEventItem | null>(null);

    // Form state for Create / Edit
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        wing: "BDSisters",
        eventType: "Workshop",
        speaker: "",
        date: "",
        time: "",
        locationType: "Online" as "Online" | "Offline",
        locationDetails: "",
        bannerUrl: "",
        isFree: true,
        ticketPrice: 0,
        maxAttendees: 50,
        recordingUrl: "",
        slidesUrl: "",
        summaryNotes: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3500);
    };

    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        try {
            const endpoint =
                mode === "archive" ? API_ENDPOINTS.events.archiveList : API_ENDPOINTS.events.list;
            const res = await apiClient.get<{ data?: AdminEventItem[] }>(endpoint);
            const raw = res as unknown as { data?: AdminEventItem[] } | AdminEventItem[];
            const list = Array.isArray(raw) ? raw : raw.data || [];
            setEvents(list);
        } catch {
            setEvents([]);
        } finally {
            setIsLoading(false);
        }
    }, [mode]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // Open create modal
    const handleOpenCreate = () => {
        const defaultDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] || "";
        setFormData({
            title: "",
            description: "",
            wing: "BDSisters",
            eventType: "Workshop",
            speaker: "",
            date: defaultDate,
            time: "7:00 PM - 8:30 PM (BST)",
            locationType: "Online",
            locationDetails: "Google Meet (Link will be sent to registered sisters)",
            bannerUrl: "",
            isFree: true,
            ticketPrice: 0,
            maxAttendees: 50,
            recordingUrl: "",
            slidesUrl: "",
            summaryNotes: "",
        });
        setIsCreateModalOpen(true);
    };

    // Open edit modal
    const handleOpenEdit = (event: AdminEventItem) => {
        setEditingEvent(event);
        const dateStr = event.date ? (new Date(event.date).toISOString().split("T")[0] || "") : "";
        setFormData({
            title: event.title || "",
            description: event.description || "",
            wing: event.wing || "BDSisters",
            eventType: event.eventType || "Workshop",
            speaker: event.speaker || "",
            date: dateStr,
            time: event.time || "",
            locationType: event.locationType || "Online",
            locationDetails: event.locationDetails || "",
            bannerUrl: event.bannerUrl || "",
            isFree: event.isFree !== undefined ? event.isFree : (event.ticketPrice || 0) === 0,
            ticketPrice: event.ticketPrice || 0,
            maxAttendees: event.maxAttendees || 50,
            recordingUrl: event.recordingUrl || "",
            slidesUrl: event.slidesUrl || "",
            summaryNotes: event.summaryNotes || "",
        });
    };

    // Submit Create or Edit
    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                ticketPrice: formData.isFree ? 0 : Number(formData.ticketPrice) || 0,
                maxAttendees: Number(formData.maxAttendees) || undefined,
            };

            if (editingEvent) {
                await apiClient.patch(API_ENDPOINTS.events.update(editingEvent._id), payload);
                showToast(`Event "${formData.title}" updated successfully.`);
                setEditingEvent(null);
            } else {
                await apiClient.post(API_ENDPOINTS.events.create, payload);
                showToast(`Event "${formData.title}" scheduled and published.`);
                setIsCreateModalOpen(false);
            }
            await fetchEvents();
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to save event.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Archive / Mark Past toggle
    const handleToggleArchive = async (event: AdminEventItem) => {
        const nextPast = !event.isPast;
        try {
            await apiClient.patch(API_ENDPOINTS.events.update(event._id), {
                isPast: nextPast,
            });
            showToast(
                nextPast
                    ? `Event "${event.title}" marked as Past and moved to Archive.`
                    : `Event "${event.title}" restored to Active Upcoming Events.`
            );
            await fetchEvents();
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to update archive status.");
        }
    };

    // Save Archive Materials (recording, slides, notes)
    const handleSaveArchiveMaterials = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!archiveModalEvent) return;
        setIsSubmitting(true);
        try {
            await apiClient.patch(API_ENDPOINTS.events.archive(archiveModalEvent._id), {
                recordingUrl: archiveModalEvent.recordingUrl || "",
                slidesUrl: archiveModalEvent.slidesUrl || "",
                summaryNotes: archiveModalEvent.summaryNotes || "",
                isPast: true,
            });
            showToast(`Archive materials updated for "${archiveModalEvent.title}".`);
            setArchiveModalEvent(null);
            await fetchEvents();
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to save archive materials.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete Event
    const handleDeleteEvent = async (event: AdminEventItem) => {
        if (!confirm(`Are you sure you want to permanently delete event "${event.title}"?`)) {
            return;
        }
        try {
            await apiClient.delete(`${API_ENDPOINTS.events.delete(event._id)}?permanent=true`);
            showToast(`Event "${event.title}" permanently removed.`);
            setEvents((prev) => prev.filter((e) => e._id !== event._id));
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to delete event.");
        }
    };

    // Filter events
    const filteredEvents = useMemo(() => {
        return events.filter((ev) => {
            if (selectedWing !== "ALL" && (ev.wing || "BDSisters") !== selectedWing) {
                return false;
            }
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const matchTitle = ev.title?.toLowerCase().includes(q);
                const matchSpeaker = ev.speaker?.toLowerCase().includes(q);
                const matchDesc = ev.description?.toLowerCase().includes(q);
                const matchLocation = ev.locationDetails?.toLowerCase().includes(q);
                if (!matchTitle && !matchSpeaker && !matchDesc && !matchLocation) {
                    return false;
                }
            }
            return true;
        });
    }, [events, selectedWing, searchQuery]);

    const totalRegistrations = useMemo(() => {
        return events.reduce((sum, e) => sum + (e.registeredAttendees?.length || 0), 0);
    }, [events]);

    return (
        <div className="space-y-6 pb-12">
            {toast && (
                <div className="flex items-center gap-2 rounded-2xl border border-[#5B9891]/30 bg-[#5B9891]/10 p-3.5 text-xs font-bold text-[#467A74] animate-in fade-in">
                    <CheckCircle2 className="h-4 w-4 text-[#5B9891]" />
                    <span>{toast}</span>
                </div>
            )}

            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/45 via-white to-[#5B9891]/10 p-6 shadow-xs">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-[#111E28]">
                            {mode === "upcoming" ? "Events & Workshops Manager" : "Past Event Archive & Recaps"}
                        </h1>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-3 py-0.5 text-xs font-bold text-[#D98408]">
                            {mode === "upcoming" ? (
                                <>
                                    <Calendar className="h-3.5 w-3.5" /> Live Workshops & Ticketing
                                </>
                            ) : (
                                <>
                                    <Archive className="h-3.5 w-3.5" /> Recordings & Slide Kits
                                </>
                            )}
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600 max-w-2xl">
                        {mode === "upcoming"
                            ? "Schedule summits, webinars, and masterclasses across sister wings, view registered sisters, and manage seat allocations."
                            : "Manage video recordings, presentation slides, key takeaways, and archive turns for past sister events."}
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={fetchEvents}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#5B9891]/30 bg-white px-4 py-2 text-xs font-bold text-[#5B9891] hover:bg-[#FAF8F5] transition-colors"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                        <span>Refresh</span>
                    </button>
                    {mode === "upcoming" && (
                        <button
                            type="button"
                            onClick={handleOpenCreate}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#5B9891] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#467A74] transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Create Event</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Counters Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-2xs">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                        {mode === "upcoming" ? "Upcoming Events" : "Archived Sessions"}
                    </div>
                    <div className="mt-1 text-2xl font-extrabold text-[#111E28]">
                        {events.length}
                    </div>
                    <p className="mt-0.5 text-[11px] text-stone-400">
                        {mode === "upcoming" ? "Active workshops & webinars" : "Preserved masterclasses"}
                    </p>
                </div>

                <div className="rounded-2xl border border-[#5B9891]/30 bg-[#5B9891]/5 p-4 shadow-2xs">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#5B9891]">
                        Total Sister RSVPs
                    </div>
                    <div className="mt-1 text-2xl font-extrabold text-[#5B9891]">
                        {totalRegistrations} Sisters
                    </div>
                    <p className="mt-0.5 text-[11px] text-stone-500">
                        Registered across all sessions
                    </p>
                </div>

                <div className="rounded-2xl border border-[#D98408]/30 bg-[#F7DFC7]/20 p-4 shadow-2xs">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#D98408]">
                        Sister Wings Represented
                    </div>
                    <div className="mt-1 text-2xl font-extrabold text-[#D98408]">
                        {new Set(events.map((e) => e.wing || "BDSisters")).size} Wings
                    </div>
                    <p className="mt-0.5 text-[11px] text-stone-500">
                        MIDJ, CoP, TSPP & The Hut
                    </p>
                </div>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    <button
                        type="button"
                        onClick={() => setSelectedWing("ALL")}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${selectedWing === "ALL"
                                ? "bg-[#5B9891] text-white shadow-xs"
                                : "bg-white text-stone-600 border border-stone-200 hover:bg-[#F7DFC7]/30"
                            }`}
                    >
                        All Wings ({events.length})
                    </button>
                    {WING_OPTIONS.map((w) => {
                        const count = events.filter((e) => (e.wing || "BDSisters") === w).length;
                        return (
                            <button
                                key={w}
                                type="button"
                                onClick={() => setSelectedWing(w)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${selectedWing === w
                                        ? "bg-[#D98408] text-white shadow-xs"
                                        : "bg-white text-stone-600 border border-stone-200 hover:bg-[#F7DFC7]/30"
                                    }`}
                            >
                                {w} ({count})
                            </button>
                        );
                    })}
                </div>

                <div className="relative min-w-[240px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                        type="search"
                        placeholder="Search event title, speaker, topic..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 bg-white pl-9 pr-3 py-1.5 text-xs text-stone-800 placeholder-stone-400 focus:border-[#5B9891] focus:outline-none"
                    />
                </div>
            </div>

            {/* Event Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {isLoading ? (
                    <div className="col-span-2 py-16 text-center text-xs text-stone-400 animate-pulse">
                        Loading events from MongoDB...
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="col-span-2 py-16 text-center text-xs text-stone-400 rounded-3xl border border-stone-200/80 bg-white shadow-2xs p-8">
                        No {mode === "upcoming" ? "upcoming events" : "archived events"} found matching your search.
                    </div>
                ) : (
                    filteredEvents.map((ev) => {
                        const dateFormatted = ev.date
                            ? new Date(ev.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })
                            : "Date TBD";
                        const attendeesList = ev.registeredAttendees || [];
                        const maxSeats = ev.maxAttendees || 100;
                        const isFreeEvent = ev.isFree ?? (ev.ticketPrice === 0 || !ev.ticketPrice);

                        return (
                            <div
                                key={ev._id}
                                className="rounded-3xl border border-stone-200/90 bg-white p-5 shadow-2xs hover:border-[#5B9891]/40 transition-all flex flex-col justify-between space-y-4"
                            >
                                <div className="space-y-3">
                                    {/* Top badges */}
                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                        <div className="flex items-center gap-1.5">
                                            <span className="rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#D98408]">
                                                {ev.wing || "BDSisters"}
                                            </span>
                                            <span className="rounded-full bg-[#5B9891]/15 border border-[#5B9891]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#5B9891]">
                                                {ev.eventType || "Workshop"}
                                            </span>
                                        </div>

                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${isFreeEvent
                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                    : "bg-[#D98408]/15 text-[#D98408] border border-[#D98408]/30"
                                                }`}
                                        >
                                            {isFreeEvent ? "Free Workshop" : `৳ ${ev.ticketPrice} BDT`}
                                        </span>
                                    </div>

                                    {/* Title & Description */}
                                    <div>
                                        <h3 className="text-base font-bold text-[#111E28] leading-snug">
                                            {ev.title}
                                        </h3>
                                        <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                                            {ev.description}
                                        </p>
                                    </div>

                                    {/* Meta pills */}
                                    <div className="grid grid-cols-2 gap-2 text-xs bg-[#FAF8F5] p-3 rounded-2xl border border-stone-100">
                                        <div className="flex items-center gap-1.5 text-stone-700">
                                            <Calendar className="w-3.5 h-3.5 text-[#5B9891] shrink-0" />
                                            <span className="truncate">{dateFormatted}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-stone-700">
                                            <Clock className="w-3.5 h-3.5 text-[#D98408] shrink-0" />
                                            <span className="truncate">{ev.time || "Time TBD"}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-stone-700">
                                            <User className="w-3.5 h-3.5 text-[#5B9891] shrink-0" />
                                            <span className="truncate">{ev.speaker || "BDSisters Mentor"}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-stone-700">
                                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                            <span className="truncate">{ev.locationDetails || ev.locationType}</span>
                                        </div>
                                    </div>

                                    {/* Attendees Progress Bar */}
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-[11px] font-bold">
                                            <span className="text-stone-600 flex items-center gap-1">
                                                <Users className="w-3 h-3 text-[#5B9891]" /> Registered Sisters
                                            </span>
                                            <span className="text-[#111E28]">
                                                {attendeesList.length} / {maxSeats} seats
                                            </span>
                                        </div>
                                        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-[#5B9891] h-full rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${Math.min(
                                                        100,
                                                        Math.round((attendeesList.length / maxSeats) * 100)
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Archive Assets indicators if mode === "archive" */}
                                    {mode === "archive" && (
                                        <div className="flex items-center gap-2 pt-1">
                                            {ev.recordingUrl ? (
                                                <a
                                                    href={ev.recordingUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-[10px] font-bold text-indigo-700 hover:bg-indigo-100"
                                                >
                                                    <Video className="w-3 h-3" /> Recording Available
                                                </a>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-lg bg-stone-50 border border-stone-200 px-2 py-0.5 text-[10px] text-stone-400">
                                                    No recording
                                                </span>
                                            )}

                                            {ev.slidesUrl ? (
                                                <a
                                                    href={ev.slidesUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-[10px] font-bold text-amber-700 hover:bg-amber-100"
                                                >
                                                    <FileSpreadsheet className="w-3 h-3" /> Slide Deck
                                                </a>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-lg bg-stone-50 border border-stone-200 px-2 py-0.5 text-[10px] text-stone-400">
                                                    No slides
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Management Actions Bar */}
                                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap">
                                    <button
                                        type="button"
                                        onClick={() => setAttendeesEvent(ev)}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-[#111E28] hover:bg-[#FAF8F5] transition-colors"
                                    >
                                        <Users className="w-3.5 h-3.5 text-[#5B9891]" />
                                        <span>View Attendees ({attendeesList.length})</span>
                                    </button>

                                    <div className="flex items-center gap-1.5">
                                        {/* Edit Button */}
                                        <button
                                            type="button"
                                            onClick={() => handleOpenEdit(ev)}
                                            title="Edit Event Details"
                                            className="p-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-[#FAF8F5] hover:text-[#5B9891] transition-colors"
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                        </button>

                                        {/* Attach Materials (Archive mode) */}
                                        {mode === "archive" ? (
                                            <button
                                                type="button"
                                                onClick={() => setArchiveModalEvent(ev)}
                                                title="Attach Recording & Notes"
                                                className="inline-flex items-center gap-1 rounded-xl bg-[#5B9891] text-white px-3 py-1.5 text-xs font-bold hover:bg-[#467A74] transition-colors"
                                            >
                                                <Video className="w-3.5 h-3.5" />
                                                <span>Attach Recaps</span>
                                            </button>
                                        ) : (
                                            /* Mark Past / Archive toggle */
                                            <button
                                                type="button"
                                                onClick={() => handleToggleArchive(ev)}
                                                title={ev.isPast ? "Restore to Upcoming" : "Mark as Past Event"}
                                                className="p-2 rounded-xl border border-amber-200 bg-amber-50/60 text-amber-700 hover:bg-amber-100 transition-colors"
                                            >
                                                <Archive className="w-3.5 h-3.5" />
                                            </button>
                                        )}

                                        {/* Delete Button */}
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteEvent(ev)}
                                            title="Delete Event"
                                            className="p-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modal: Create or Edit Event */}
            {(isCreateModalOpen || editingEvent) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
                    <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#5B9891]/30 shadow-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                            <div className="flex items-center gap-2">
                                <span className="p-1.5 rounded-xl bg-[#5B9891]/15 text-[#5B9891]">
                                    <Calendar className="w-5 h-5" />
                                </span>
                                <div>
                                    <h3 className="font-bold text-base text-[#111E28]">
                                        {editingEvent ? "Edit Event & Workshop" : "Schedule New Sister Event"}
                                    </h3>
                                    <p className="text-[11px] text-stone-500">
                                        Configure session date, tickets, sister wings, and venue/link.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCreateModalOpen(false);
                                    setEditingEvent(null);
                                }}
                                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitForm} className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Event Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Halal E-Commerce Masterclass"
                                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-none"
                                />
                            </div>

                            {/* Wing & Event Type */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 mb-1">
                                        Sister Wing / Initiative
                                    </label>
                                    <select
                                        value={formData.wing}
                                        onChange={(e) => setFormData({ ...formData, wing: e.target.value })}
                                        className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-none"
                                    >
                                        {WING_OPTIONS.map((w) => (
                                            <option key={w} value={w}>
                                                {w}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 mb-1">
                                        Event Type
                                    </label>
                                    <select
                                        value={formData.eventType}
                                        onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                                        className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-none"
                                    >
                                        {EVENT_TYPE_OPTIONS.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Speaker & Date */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 mb-1">
                                        Speaker / Ustadha
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.speaker}
                                        onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                                        placeholder="e.g., Ustadha Rubaba Khan"
                                        className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 mb-1">
                                        Event Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Time & Max Seats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 mb-1">
                                        Time Slot *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        placeholder="e.g., 7:00 PM - 8:30 PM (BST)"
                                        className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 mb-1">
                                        Max Capacity (Seats)
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={formData.maxAttendees}
                                        onChange={(e) => setFormData({ ...formData, maxAttendees: Number(e.target.value) })}
                                        className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Location Details */}
                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Location / Virtual Link *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.locationDetails}
                                    onChange={(e) => setFormData({ ...formData, locationDetails: e.target.value })}
                                    placeholder="e.g., Zoom Meeting / Google Meet Link or Physical Hall Address"
                                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-none"
                                />
                            </div>

                            {/* Ticketing: Free vs Paid */}
                            <div className="p-4 rounded-2xl border border-stone-200 bg-[#FAF8F5] space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-[#111E28]">
                                        Free Event for Sisters?
                                    </span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isFree}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    isFree: e.target.checked,
                                                    ticketPrice: e.target.checked ? 0 : formData.ticketPrice,
                                                })
                                            }
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5B9891]" />
                                    </label>
                                </div>

                                {!formData.isFree && (
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 mb-1">
                                            Ticket Price (BDT) *
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={formData.ticketPrice}
                                            onChange={(e) => setFormData({ ...formData, ticketPrice: Number(e.target.value) })}
                                            className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs text-[#111E28] focus:border-[#5B9891] focus:outline-none"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Event Description & Agenda *
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Comprehensive outline of topics covered, materials needed, and key learnings..."
                                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreateModalOpen(false);
                                        setEditingEvent(null);
                                    }}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#5B9891] text-white hover:bg-[#467A74] shadow-xs disabled:opacity-50 transition-colors"
                                >
                                    {isSubmitting ? "Saving Event..." : editingEvent ? "Update Event" : "Create & Publish"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: View Attendees */}
            {attendeesEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
                    <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#5B9891]/30 shadow-2xl p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                            <div className="flex items-center gap-2">
                                <span className="p-1.5 rounded-xl bg-[#5B9891]/15 text-[#5B9891]">
                                    <Users className="w-5 h-5" />
                                </span>
                                <div>
                                    <h3 className="font-bold text-base text-[#111E28]">
                                        Registered Sisters
                                    </h3>
                                    <p className="text-[11px] text-stone-500">
                                        {attendeesEvent.title} • {attendeesEvent.registeredAttendees?.length || 0} registered
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setAttendeesEvent(null)}
                                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {attendeesEvent.registeredAttendees && attendeesEvent.registeredAttendees.length > 0 ? (
                            <div className="rounded-2xl border border-stone-200 overflow-hidden">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[#FAF8F5] text-[11px] font-bold uppercase text-stone-500 border-b border-stone-100">
                                        <tr>
                                            <th className="py-3 px-4">Sister Name</th>
                                            <th className="py-3 px-4">Email</th>
                                            <th className="py-3 px-4">District / City</th>
                                            <th className="py-3 px-4 text-center">Ticket Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100">
                                        {attendeesEvent.registeredAttendees.map((att, i) => (
                                            <tr key={i} className="hover:bg-[#F7DFC7]/20">
                                                <td className="py-3 px-4 font-bold text-[#111E28]">
                                                    {att.fullName || "Sister Member"}
                                                </td>
                                                <td className="py-3 px-4 text-stone-600">
                                                    {att.email || "—"}
                                                </td>
                                                <td className="py-3 px-4 text-stone-600">
                                                    {att.location?.district || att.location?.city || "Bangladesh"}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                                        <CheckCircle2 className="w-3 h-3" /> Confirmed
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="py-12 text-center text-xs text-stone-400">
                                No sister attendees have registered for this event yet.
                            </p>
                        )}

                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                onClick={() => setAttendeesEvent(null)}
                                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#5B9891] text-white hover:bg-[#467A74] transition-colors"
                            >
                                Close List
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Attach Recaps & Archive Materials */}
            {archiveModalEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
                    <div className="w-full max-w-xl bg-white rounded-3xl border border-[#5B9891]/30 shadow-2xl p-6 sm:p-7 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                            <div className="flex items-center gap-2">
                                <span className="p-1.5 rounded-xl bg-[#5B9891]/15 text-[#5B9891]">
                                    <Archive className="w-5 h-5" />
                                </span>
                                <div>
                                    <h3 className="font-bold text-base text-[#111E28]">
                                        Attach Archive Materials
                                    </h3>
                                    <p className="text-[11px] text-stone-500">
                                        {archiveModalEvent.title}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setArchiveModalEvent(null)}
                                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveArchiveMaterials} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Video Recording URL (YouTube Unlisted / Vimeo / Drive)
                                </label>
                                <input
                                    type="url"
                                    value={archiveModalEvent.recordingUrl || ""}
                                    onChange={(e) =>
                                        setArchiveModalEvent({
                                            ...archiveModalEvent,
                                            recordingUrl: e.target.value,
                                        })
                                    }
                                    placeholder="https://youtu.be/... or https://drive.google.com/..."
                                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Slide Deck / Presentation PDF Link
                                </label>
                                <input
                                    type="url"
                                    value={archiveModalEvent.slidesUrl || ""}
                                    onChange={(e) =>
                                        setArchiveModalEvent({
                                            ...archiveModalEvent,
                                            slidesUrl: e.target.value,
                                        })
                                    }
                                    placeholder="https://docs.google.com/presentation/... or PDF URL"
                                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Key Takeaways & Summary Notes
                                </label>
                                <textarea
                                    rows={4}
                                    value={archiveModalEvent.summaryNotes || ""}
                                    onChange={(e) =>
                                        setArchiveModalEvent({
                                            ...archiveModalEvent,
                                            summaryNotes: e.target.value,
                                        })
                                    }
                                    placeholder="Summary of pivotal advice, questions answered, and sister feedback..."
                                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#111E28] focus:border-[#5B9891] focus:bg-white focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
                                <button
                                    type="button"
                                    onClick={() => setArchiveModalEvent(null)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#5B9891] text-white hover:bg-[#467A74] shadow-xs disabled:opacity-50 transition-colors"
                                >
                                    {isSubmitting ? "Saving Materials..." : "Save Archive Recaps"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
