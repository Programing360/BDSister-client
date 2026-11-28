"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Download,
  Share2,
  ExternalLink,
  QrCode,
  Sparkles,
  Ticket,
  PlayCircle,
  FileText,
} from "lucide-react";

interface RegisteredPass {
  id: string;
  ticketNumber: string;
  eventTitle: string;
  date: string;
  time: string;
  type: "online" | "in-person";
  location: string;
  meetingLink?: string;
  seatType: string;
  organizer: string;
  qrCodeUrl: string;
}

interface ArchivedEvent {
  id: string;
  title: string;
  date: string;
  category: string;
  recordingUrl?: string;
  slidesUrl?: string;
  summary: string;
}

const MOCK_REGISTERED_PASSES: RegisteredPass[] = [
  {
    id: "pass-1",
    ticketNumber: "BDS-EVT-8821",
    eventTitle: "Halal Financing, Islamic Banking & Venture Grants for Women Founders",
    date: "December 12, 2026",
    time: "4:00 PM – 6:30 PM (BST)",
    type: "online",
    location: "Zoom Virtual Hall (Verified Link Unlocked)",
    meetingLink: "https://zoom.us/j/9876543210?pwd=bdsistersverified",
    seatType: "Verified Member Pass",
    organizer: "Business Leadership Wing",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BDS-EVT-8821-NUSRAT",
  },
  {
    id: "pass-2",
    ticketNumber: "BDS-EVT-9043",
    eventTitle: "Hands-on UI/UX Design Sprint & Figma Portfolio Tear-Down",
    date: "December 18, 2026",
    time: "7:00 PM – 9:00 PM (BST)",
    type: "online",
    location: "Google Meet Interactive Session",
    meetingLink: "https://meet.google.com/xyz-bds-sisters",
    seatType: "General Admission",
    organizer: "Engineering & IT Wing",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BDS-EVT-9043-FARHANA",
  },
];

const MOCK_ARCHIVED_EVENTS: ArchivedEvent[] = [
  {
    id: "arch-1",
    title: "Navigating Bangladesh Labor Act 2006 & Maternity Protection for Startups",
    date: "November 5, 2026",
    category: "Legal & Regulatory",
    recordingUrl: "https://vimeo.com/bdsisters/archive-nov-legal",
    slidesUrl: "/downloads/slides-labor-act-2026.pdf",
    summary:
      "A comprehensive review with Barrister Afsana Rahman on statutory employee policies, workplace sexual harassment prevention committees, and provident fund guidelines.",
  },
  {
    id: "arch-2",
    title: "Old Dhaka Sourcing Masterclass: Leather, Packaging & Paper Wholesale",
    date: "October 22, 2026",
    category: "Supply Chain",
    slidesUrl: "/downloads/old-dhaka-supplier-directory.pdf",
    summary:
      "Direct vendor contact lists and price negotiation strategies for Chawkbazar, Bangshal, and Hazaribagh wholesale markets.",
  },
];

export function MemberEventsView() {
  const [tab, setTab] = useState<"upcoming" | "archive">("upcoming");
  const [passes, setPasses] = useState<RegisteredPass[]>(MOCK_REGISTERED_PASSES);
  const [archive, setArchive] = useState<ArchivedEvent[]>(MOCK_ARCHIVED_EVENTS);
  const [loadingArchive, setLoadingArchive] = useState(false);

  useEffect(() => {
    if (tab === "archive") {
      setLoadingArchive(true);
      apiClient
        .get<ArchivedEvent[]>(API_ENDPOINTS.events.archiveList)
        .then((res) => {
          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            setArchive(res.data);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingArchive(false));
    }
  }, [tab]);

  const handleDownloadICS = (pass: RegisteredPass) => {
    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//BDSisters//Events//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${pass.eventTitle}`,
      `DESCRIPTION:Verified BDSisters Member Pass: ${pass.ticketNumber}. Meeting Link: ${pass.meetingLink || pass.location}`,
      `LOCATION:${pass.location}`,
      `STATUS:CONFIRMED`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${pass.ticketNumber}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border/80 bg-white p-6 shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Ticket className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              My Event Hub
            </span>
          </div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">
            Registered Passes &amp; Learning Archives
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Access your verified QR admission passes, calendar invites, and past masterclass recordings.
          </p>
        </div>

        <Link href="/events">
          <Button variant="outline" size="sm" className="rounded-2xl text-xs font-bold gap-1.5">
            <span>Explore All Events</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-3">
        <button
          onClick={() => setTab("upcoming")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
            tab === "upcoming"
              ? "bg-primary text-white shadow-xs"
              : "border border-border bg-white text-text-secondary hover:bg-surface hover:text-text-primary"
          }`}
        >
          <Ticket className="h-4 w-4" />
          <span>Active Passes ({passes.length})</span>
        </button>

        <button
          onClick={() => setTab("archive")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all ${
            tab === "archive"
              ? "bg-primary text-white shadow-xs"
              : "border border-border bg-white text-text-secondary hover:bg-surface hover:text-text-primary"
          }`}
        >
          <PlayCircle className="h-4 w-4" />
          <span>Past Masterclass Recordings</span>
        </button>
      </div>

      {/* Tab 1: Active Passes */}
      {tab === "upcoming" && (
        <div className="space-y-6">
          {passes.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-white p-12 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Ticket className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-text-primary">
                No Active Event Passes
              </h3>
              <p className="text-xs text-text-secondary max-w-sm mx-auto">
                You haven&apos;t registered for any upcoming events yet. Discover our latest founder meetups and workshops.
              </p>
              <Link href="/events">
                <Button variant="primary" size="sm" className="rounded-2xl">
                  Browse Upcoming Events
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {passes.map((pass) => (
                <div
                  key={pass.id}
                  className="relative flex flex-col justify-between rounded-3xl border border-border/90 bg-white p-6 shadow-card overflow-hidden"
                >
                  {/* Decorative Ticket Notch */}
                  <div className="absolute top-1/2 -left-3.5 h-7 w-7 rounded-full bg-surface border border-border/80" />
                  <div className="absolute top-1/2 -right-3.5 h-7 w-7 rounded-full bg-surface border border-border/80" />

                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between text-xs border-b border-border/70 pb-3">
                      <span className="font-mono font-bold text-primary">
                        {pass.ticketNumber}
                      </span>
                      <span className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-0.5 text-[11px] font-bold border border-emerald-200">
                        {pass.seatType}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-text-primary mt-3 leading-snug">
                      {pass.eventTitle}
                    </h3>
                    <p className="text-xs text-text-secondary mt-1">
                      Organized by {pass.organizer}
                    </p>

                    {/* Details row with QR mockup */}
                    <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface/60 rounded-2xl p-4 border border-border/70">
                      <div className="space-y-2 text-xs text-text-secondary">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary shrink-0" />
                          <span className="font-semibold text-text-primary">{pass.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary shrink-0" />
                          <span>{pass.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {pass.type === "online" ? (
                            <Video className="h-4 w-4 text-primary shrink-0" />
                          ) : (
                            <MapPin className="h-4 w-4 text-primary shrink-0" />
                          )}
                          <span className="line-clamp-1">{pass.location}</span>
                        </div>
                      </div>

                      {/* QR Pass */}
                      <div className="flex flex-col items-center bg-white p-2 rounded-xl border border-border shrink-0 self-center sm:self-auto shadow-xs">
                        <img
                          src={pass.qrCodeUrl}
                          alt="Ticket QR"
                          className="h-20 w-20 object-contain"
                        />
                        <span className="text-[9px] text-text-secondary mt-1 font-mono">
                          Scan at Entry
                        </span>
                      </div>
                    </div>

                    {/* Virtual Hall Link */}
                    {pass.meetingLink && (
                      <div className="mt-4 rounded-xl bg-primary/5 p-3 border border-primary/20 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-primary" />
                          <span className="font-bold text-text-primary">
                            Virtual Link Active:
                          </span>
                        </div>
                        <a
                          href={pass.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-primary hover:underline flex items-center gap-1"
                        >
                          <span>Join Room</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions footer */}
                  <div className="mt-5 pt-4 border-t border-border/70 flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadICS(pass)}
                      className="rounded-2xl text-xs font-bold gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Add to Calendar (.ics)</span>
                    </Button>
                    <a
                      href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                        pass.eventTitle
                      )}&details=${encodeURIComponent(
                        `BDSisters Pass: ${pass.ticketNumber}\nLink: ${pass.meetingLink || ""}`
                      )}&location=${encodeURIComponent(pass.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-2xl text-xs font-bold text-primary hover:bg-primary/10 gap-1"
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Google Cal</span>
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Archived Masterclasses */}
      {tab === "archive" && (
        <div className="space-y-4">
          {loadingArchive ? (
            <div className="py-12 text-center text-xs text-text-secondary">
              Loading past masterclass archive...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {archive.map((evt) => (
                <div
                  key={evt.id}
                  className="flex flex-col justify-between rounded-3xl border border-border/80 bg-white p-6 shadow-card"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="rounded-full bg-surface px-3 py-1 font-bold text-text-secondary text-[11px] border border-border/70">
                        {evt.category}
                      </span>
                      <span className="text-[11px] text-text-secondary font-medium">
                        {evt.date}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-text-primary leading-snug">
                      {evt.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                      {evt.summary}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-border/70 flex items-center justify-between gap-3">
                    {evt.recordingUrl ? (
                      <a
                        href={evt.recordingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                      >
                        <PlayCircle className="h-4 w-4" />
                        <span>Watch Replay</span>
                      </a>
                    ) : (
                      <span className="text-xs text-text-secondary">Recording processing</span>
                    )}

                    {evt.slidesUrl && (
                      <a
                        href={evt.slidesUrl}
                        download
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-text-primary hover:text-primary transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Slide Deck (PDF)</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
