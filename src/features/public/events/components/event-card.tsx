"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, MapPin, Users, ArrowUpRight } from "lucide-react";
import type { Event } from "@/types/public";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const isOnline = event.type === "online" || event.isOnline;
  const price = event.price ?? 0;
  const attendees = event.attendeesCount ?? event.registeredCount ?? 0;
  const capacity = event.maxCapacity ?? event.capacity ?? 100;
  const [imgSrc, setImgSrc] = useState(
    event.coverImage || "/images/placeholders/event-1.jpg"
  );

  // Extract a date representation (e.g. "15" and "MAR")
  const dateParts = (event.date || "25 March 2026").split(" ");
  const day = dateParts[0] || "25";
  const month = dateParts[1] ? dateParts[1].slice(0, 3).toUpperCase() : "MAR";

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white/90 shadow-xl card-hover-effect">
      {/* Event Cover Image */}
      <div className="relative h-48 w-full overflow-hidden bg-surface">
        <Image
          src={imgSrc}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={() => setImgSrc("/images/placeholders/event-1.jpg")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Date Squircle Badge */}
        <div className="absolute top-3.5 left-3.5 z-10 flex flex-col items-center justify-center rounded-2xl border border-white/80 bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-md">
          <span className="text-lg font-black leading-tight text-primary">
            {day}
          </span>
          <span className="text-[10px] font-bold tracking-wider text-text-secondary">
            {month}
          </span>
        </div>

        {/* Access Type & Fee Badge */}
        <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5">
          <Badge
            variant={isOnline ? "subtle" : "neutral"}
            size="sm"
            className="border border-white/40 bg-white/90 font-medium backdrop-blur-md shadow-xs"
          >
            {isOnline ? "Virtual Circle" : "In-Person"}
          </Badge>
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow-xs">
            {price === 0 ? "Free Access" : `৳${price.toLocaleString("en-BD")}`}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <h3 className="text-lg font-bold text-text-primary transition-colors duration-200 group-hover:text-primary line-clamp-2">
            <Link href={`/events/${event.slug}`}>
              {event.title}
            </Link>
          </h3>

          <p className="mt-2.5 text-xs sm:text-sm text-text-secondary line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Meta Info */}
          <div className="mt-4 space-y-2 border-t border-border/80 pt-3.5 text-xs text-text-secondary">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>
        </div>

        {/* Footer Meta & RSVP Action */}
        <div className="mt-5 flex items-center justify-between border-t border-border/80 pt-4 text-xs">
          <div className="flex items-center gap-1.5 text-text-secondary font-medium">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span>
              <strong className="text-text-primary">{attendees}</strong> / {capacity} registered
            </span>
          </div>

          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center gap-1 rounded-xl bg-primary px-3.5 py-1.5 font-semibold text-white shadow-xs transition-all duration-200 hover:bg-primary-hover hover:shadow-button"
          >
            <span>RSVP Details</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
