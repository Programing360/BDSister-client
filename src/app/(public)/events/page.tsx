import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CTASection } from "@/components/shared/cta-section";
import { EventsView } from "@/features/public/events/components/events-view";
import { publicService } from "@/features/public/services/public-service";
import {
  Calendar,
  Sparkles,
  Users,
  Video,
  MapPin,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Events & Workshops | BDSisters.org",
  description:
    "Join our curated webinars, hands-on masterclasses, city meetups, and leadership retreats designed for Bangladeshi women.",
};

export default async function EventsPage() {
  const events = await publicService.getEvents();

  return (
    <div className="flex flex-col bg-background min-h-screen">
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden border-b border-border/80 bg-white pt-14 pb-16 sm:pt-20 sm:pb-24">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -top-40 right-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-10 h-96 w-96 rounded-full bg-heading-accent/10 blur-3xl" />

        <Container size="lg">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary shadow-xs">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Conferences, Workshops &amp; City Chapters</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
              Empowering Gatherings, <br className="hidden sm:inline" />
              <span className="text-gradient-primary">Every Step of the Journey</span>
            </h1>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl">
              From virtual masterclasses with international export mentors to intimate city circles in Dhaka, Chattogram, and Sylhet. Connect, learn, and grow together in a vetted safe environment.
            </p>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 w-full max-w-2xl">
              <div className="rounded-2xl border border-border/70 bg-surface/60 p-3.5 backdrop-blur-sm">
                <span className="text-2xl font-extrabold text-primary block">4,800+</span>
                <span className="text-[11px] font-semibold text-text-secondary">Sister Participants</span>
              </div>
              <div className="rounded-2xl border border-border/70 bg-surface/60 p-3.5 backdrop-blur-sm">
                <span className="text-2xl font-extrabold text-text-primary block">52+</span>
                <span className="text-[11px] font-semibold text-text-secondary">Masterclasses Hosted</span>
              </div>
              <div className="rounded-2xl border border-border/70 bg-surface/60 p-3.5 backdrop-blur-sm">
                <span className="text-2xl font-extrabold text-primary block">100%</span>
                <span className="text-[11px] font-semibold text-text-secondary">Free RSVP Access</span>
              </div>
              <div className="rounded-2xl border border-border/70 bg-surface/60 p-3.5 backdrop-blur-sm">
                <span className="text-2xl font-extrabold text-text-primary block">8</span>
                <span className="text-[11px] font-semibold text-text-secondary">Divisions Reached</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Events Listing */}
      <Section spacing="lg" className="bg-background">
        <Container size="lg">
          <EventsView initialEvents={events} />
        </Container>
      </Section>

      {/* Workshop Proposal CTA */}
      <CTASection
        badge="Community Leadership"
        title="Want to Host or Speak at a Sister Workshop?"
        description="Are you a founder, educator, doctor, technologist, or artist? Share your knowledge with thousands of ambitious Bangladeshi sisters. We handle the production, moderation, and audience."
        primaryAction={{
          label: "Propose a Masterclass",
          href: "/contact?subject=Event%20Proposal",
        }}
        secondaryAction={{
          label: "Join Community Circle",
          href: "/register",
        }}
      />
    </div>
  );
}
