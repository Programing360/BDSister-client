import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/features/public/events/components/event-card";
import { publicService } from "@/features/public/services/public-service";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Ticket,
  Users,
  Video,
  Share2,
  Sparkles,
  ArrowRight,
  HeartHandshake,
  MessageCircle,
} from "lucide-react";

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await publicService.getEventBySlug(slug);

  if (!event) {
    return {
      title: "Event Not Found | BDSisters.org",
    };
  }

  return {
    title: `${event.title} | BDSisters Events`,
    description: event.description,
  };
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { slug } = await params;
  const event = await publicService.getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const allEvents = await publicService.getEvents();
  const relatedEvents = allEvents
    .filter((e) => e.slug !== event.slug)
    .slice(0, 3);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events" },
    { label: event.title },
  ];

  const maxCap = event.maxCapacity ?? event.capacity ?? 100;
  const registered = event.attendeesCount ?? event.registeredCount ?? 45;
  const spotsLeft = Math.max(0, maxCap - registered);
  const percentageFilled = Math.min(100, Math.round((registered / maxCap) * 100));

  return (
    <div className="flex flex-col bg-background min-h-screen">
      {/* Breadcrumb strip */}
      <div className="border-b border-border/80 bg-white/70 backdrop-blur-md py-3.5 sticky top-[72px] z-20">
        <Container size="lg">
          <Breadcrumb items={breadcrumbItems} />
        </Container>
      </div>

      <Section spacing="lg" className="pt-6 sm:pt-10">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left Column: Event Details & Visuals */}
            <div className="lg:col-span-8 space-y-8">
              {/* Event Cover Banner */}
              <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-card">
                <Image
                  src={event.coverImage || event.image || "/images/placeholders/event-1.jpg"}
                  alt={event.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                  priority
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholders/event-1.jpg";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-primary shadow-sm backdrop-blur-md">
                    {event.type === "online" || event.isOnline ? (
                      <>
                        <Video className="h-3.5 w-3.5 text-primary" />
                        <span>Virtual Masterclass</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        <span>In-Person Gathering</span>
                      </>
                    )}
                  </span>

                  <span className="inline-flex items-center rounded-full bg-text-primary/80 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-md">
                    {event.category}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-medium">
                  <span className="backdrop-blur-sm bg-black/40 px-3 py-1 rounded-full">
                    Organized by: <strong className="text-white">{event.organizer || "BDSisters Wing"}</strong>
                  </span>
                </div>
              </div>

              {/* Title & Key Info */}
              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-text-primary leading-tight tracking-tight">
                  {event.title}
                </h1>
              </div>

              {/* Event Metadata Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-border/80 bg-white p-4 shadow-soft flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral block">
                      Date
                    </span>
                    <span className="text-sm font-bold text-text-primary">{event.date}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-white p-4 shadow-soft flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral block">
                      Time
                    </span>
                    <span className="text-sm font-bold text-text-primary">{event.time}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-white p-4 shadow-soft flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral block">
                      Venue
                    </span>
                    <span className="text-sm font-bold text-text-primary truncate block">
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Description */}
              <div className="rounded-3xl border border-border/80 bg-white p-6 sm:p-8 shadow-card space-y-4">
                <h2 className="text-lg sm:text-xl font-bold text-text-primary">
                  About This Gathering
                </h2>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {/* Program Curriculum / Agenda Highlights */}
              <div className="rounded-3xl border border-border/80 bg-white p-6 sm:p-8 shadow-card space-y-6">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold text-text-primary">
                    What You Will Experience &amp; Gain
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3.5 rounded-2xl bg-surface/60 p-4 border border-border/60">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white font-bold text-xs shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-primary">
                        Direct Strategic Masterclass &amp; Keynote
                      </h4>
                      <p className="text-xs text-text-secondary mt-1">
                        High-impact, practical presentation with actionable templates tailored to Bangladeshi market dynamics and international standards.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 rounded-2xl bg-surface/60 p-4 border border-border/60">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white font-bold text-xs shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-primary">
                        Interactive Sister Q&amp;A &amp; Case Study Tear-Down
                      </h4>
                      <p className="text-xs text-text-secondary mt-1">
                        Bring your questions and business roadblocks. Receive tailored feedback from industry mentors in a supportive, constructive setting.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 rounded-2xl bg-surface/60 p-4 border border-border/60">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white font-bold text-xs shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-primary">
                        Sisterhood Networking &amp; Resource Kit
                      </h4>
                      <p className="text-xs text-text-secondary mt-1">
                        Connect with peers across Dhaka, Chattogram, and beyond. All registered attendees receive downloadable session slide decks and recording archives.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safe Space Policy Banner */}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 flex items-start gap-3.5 text-xs text-text-secondary">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-text-primary mb-1">
                    BDSisters Safe Gathering Commitment
                  </h4>
                  <p className="leading-relaxed">
                    All virtual links and physical event spaces are strictly reserved for verified female community members. Screen recording, unauthorized photography, and solicitations are strictly prohibited to ensure maximum comfort and mutual respect.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Sticky RSVP Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                <div className="rounded-3xl border border-border/80 bg-white p-6 sm:p-7 shadow-card space-y-6">
                  {/* Pricing Header */}
                  <div className="flex items-baseline justify-between border-b border-border/80 pb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                      Admission Fee
                    </span>
                    <span className="text-3xl font-extrabold text-text-primary">
                      {!event.price ? "Free RSVP" : `৳${event.price.toLocaleString("en-BD")}`}
                    </span>
                  </div>

                  {/* Seat Capacity Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-text-secondary">Registration Status:</span>
                      <span className="text-primary font-bold">{registered} / {maxCap} Seats</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface border border-border/60">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-heading-accent transition-all duration-500"
                        style={{ width: `${percentageFilled}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-neutral">
                      <span>{percentageFilled}% Booked</span>
                      {spotsLeft <= 25 ? (
                        <span className="font-bold text-amber-600">Only {spotsLeft} seats remaining!</span>
                      ) : (
                        <span>Open for registration</span>
                      )}
                    </div>
                  </div>

                  {/* Quick Summary Grid */}
                  <div className="space-y-2.5 text-xs border-y border-border/80 py-4 text-text-secondary">
                    <div className="flex items-center justify-between">
                      <span>Format</span>
                      <strong className="text-text-primary capitalize">{event.type || "Online Workshop"}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Organized by</span>
                      <strong className="text-text-primary">{event.organizer || "BDSisters Wing"}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Language</span>
                      <strong className="text-text-primary">Bangla &amp; English</strong>
                    </div>
                  </div>

                  {/* Primary CTA */}
                  <div className="space-y-3">
                    <Link
                      href={`/register?redirect=/events/${event.slug}`}
                      className="block w-full"
                    >
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full justify-center gap-2 font-bold text-base py-3.5 shadow-button hover:shadow-card-hover"
                      >
                        <Ticket className="h-5 w-5" />
                        <span>Confirm Your Free RSVP</span>
                      </Button>
                    </Link>
                    <p className="text-[11px] text-center text-text-secondary">
                      Requires free BDSisters membership to verify identity.
                    </p>
                  </div>

                  {/* Share buttons */}
                  <div className="pt-4 border-t border-border/80">
                    <span className="text-xs font-bold text-text-secondary block mb-2 text-center">
                      Invite a Sister to Join:
                    </span>
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface hover:bg-primary/10 hover:text-primary transition-colors text-text-secondary"
                        title="Share on WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface hover:bg-primary/10 hover:text-primary transition-colors text-text-secondary"
                        title="Share link"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Events Carousel / Grid */}
          {relatedEvents.length > 0 && (
            <div className="mt-20 border-t border-border pt-16">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    Expand Your Knowledge
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight mt-1">
                    Other Upcoming Workshops &amp; Meetups
                  </h3>
                </div>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-heading-accent transition-colors"
                >
                  <span>Browse all events</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedEvents.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
