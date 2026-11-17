import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Target,
  Users,
  Sparkles,
  Shield,
  ArrowRight,
  Award,
  Globe2,
  TrendingUp,
  Compass,
} from "lucide-react";

export const metadata = {
  title: "About BDSisters.org | Empowering Bangladeshi Women",
  description:
    "Learn about BDSisters.org, our history, our partnership with Muhsina Organization, and how we empower Bangladeshi women in leadership, business, and community.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative overflow-hidden hero-mesh-bg pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-border/80">
        <Container size="lg" className="relative z-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div
                data-aos="fade-down"
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary backdrop-blur-md shadow-xs mb-6"
              >
                <Heart className="h-4 w-4 text-primary fill-primary/20" />
                <span>Our Heritage &amp; Mission</span>
              </div>

              <h1
                data-aos="fade-up"
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text-primary leading-[1.1]"
              >
                Building a Future Where Every Bangladeshi Woman{" "}
                <span className="text-gradient-primary">Flourishes.</span>
              </h1>

              <p
                data-aos="fade-up"
                data-aos-delay="100"
                className="mt-6 text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl font-normal"
              >
                BDSisters was born from a transformative realization: when Bangladeshi women
                unite with mutual dignity, mentorship, and commercial solidarity, institutional
                barriers crumble and generational prosperity takes root.
              </p>

              <div
                data-aos="fade-up"
                data-aos-delay="200"
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <Link href="/about/mission-vision">
                  <Button variant="primary" size="lg" className="shadow-button">
                    <span>Our Mission &amp; Vision</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
                <Link href="/about/our-team">
                  <Button variant="outline" size="lg" className="border-border bg-white/80">
                    <span>Meet Our Leadership</span>
                  </Button>
                </Link>
              </div>
            </div>

            <div
              data-aos="fade-left"
              data-aos-delay="150"
              className="lg:col-span-5 relative flex items-center justify-center"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] border-4 border-white shadow-premium">
                <Image
                  src="https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=1200&q=80"
                  alt="Bangladeshi women collaborating in a leadership workshop"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 inset-x-5 text-white">
                  <span className="inline-block rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white mb-1">
                    Authentic Sisterhood
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-white/95">
                    Connecting grassroots craftswomen with global tech leaders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. THE ORIGIN STORY & MILESTONES */}
      <Section spacing="lg" className="bg-white">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                The BDSisters Evolution
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight leading-tight">
                From a Humble Living Room Circle to a Global Ecosystem
              </h2>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                Founded under the visionary auspices of <strong>Muhsina Organization</strong>,
                BDSisters began as a series of intimate monthly coffee meetups in Dhaka. Female
                entrepreneurs, university students, and senior professionals gathered seeking
                honest guidance, transparent pricing advice, and psychological safety.
              </p>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                Today, BDSisters has expanded into Bangladesh&apos;s leading digital sisterhood:
                integrating an ethical zero-commission artisan marketplace, verified business
                registry, educational masterclasses, and an active peer network spanning all 8
                administrative divisions and the overseas diaspora.
              </p>

              <div className="pt-2">
                <Link href="/about/muhsina">
                  <Button variant="outline" size="sm" className="gap-2 border-border">
                    <span>Learn About Muhsina Organization</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Core Values Bento */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div
                data-aos="fade-up"
                className="rounded-3xl border border-white/90 bg-surface/70 p-6 shadow-card card-hover-effect"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-text-primary">Radical Inclusion</h3>
                <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Welcoming women from all educational, regional, and socioeconomic backgrounds.
                </p>
              </div>

              <div
                data-aos="fade-up"
                data-aos-delay="100"
                className="rounded-3xl border border-white/90 bg-surface/70 p-6 shadow-card card-hover-effect"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-heading-accent/10 text-heading-accent mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-text-primary">Protected Dignity</h3>
                <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Strict zero-tolerance for harassment, predatory data brokering, or spam.
                </p>
              </div>

              <div
                data-aos="fade-up"
                data-aos-delay="150"
                className="rounded-3xl border border-white/90 bg-surface/70 p-6 shadow-card card-hover-effect"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success mb-4">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-text-primary">Financial Sovereignty</h3>
                <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Equipping sisters with real business tools, market access, and verified financial independence.
                </p>
              </div>

              <div
                data-aos="fade-up"
                data-aos-delay="200"
                className="rounded-3xl border border-white/90 bg-surface/70 p-6 shadow-card card-hover-effect"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-4">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-text-primary">Heritage &amp; Modernity</h3>
                <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Celebrating Jamdani, Nakshi Kantha, and indigenous delta wisdom alongside modern AI and tech.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. DEEP DIVE HUBS NAVIGATION */}
      <Section spacing="lg" className="bg-surface/50 border-t border-border/80">
        <Container size="lg">
          <SectionHeading
            badge="Institutional Pillars"
            title="Explore Our Organization in Depth"
            description="Discover the foundations that govern our sisterhood, our non-profit parent body, and the women steering our vision."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              href="/about/muhsina"
              className="group flex flex-col justify-between rounded-3xl border border-white/90 bg-white/90 p-8 shadow-card card-hover-effect"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 transition-transform group-hover:scale-110">
                  <Award className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Non-Profit Parent
                </span>
                <h3 className="mt-2 text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                  Muhsina Organization
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Learn about Muhsina&apos;s charitable charter, ethical stewardship, and dedicated non-profit sponsorship of BDSisters.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:underline">
                <span>View Organization Profile</span>
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            <Link
              href="/about/mission-vision"
              className="group flex flex-col justify-between rounded-3xl border border-white/90 bg-white/90 p-8 shadow-card card-hover-effect"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-heading-accent/10 text-heading-accent mb-4 transition-transform group-hover:scale-110">
                  <Compass className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-heading-accent">
                  Strategic Roadmap
                </span>
                <h3 className="mt-2 text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                  Mission &amp; Vision
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Discover our 10-year vision to empower 100,000 Bangladeshi women with digital market access and leadership training.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:underline">
                <span>Read Charter &amp; Roadmap</span>
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            <Link
              href="/about/our-team"
              className="group flex flex-col justify-between rounded-3xl border border-white/90 bg-white/90 p-8 shadow-card card-hover-effect"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success mb-4 transition-transform group-hover:scale-110">
                  <Users className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-success">
                  Executive Board
                </span>
                <h3 className="mt-2 text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                  Our Leadership Team
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Meet the educators, corporate lawyers, technologists, and community advocates directing BDSisters programs.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:underline">
                <span>Meet the Directors</span>
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </Container>
      </Section>

      {/* 4. FINAL CTA */}
      <CTASection
        badge="Join Our Movement"
        title="Ready to Connect with 5,000+ Inspiring Sisters?"
        description="Whether you want to learn, sell your creations, or find lifelong mentors, your seat is reserved in our sisterhood."
        primaryAction={{
          label: "Create Free Account",
          href: "/register",
        }}
        secondaryAction={{
          label: "Explore Community Circles",
          href: "/community",
        }}
      />
    </div>
  );
}
