import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { Button } from "@/components/ui/button";
import {
  Users,
  ShieldCheck,
  Heart,
  Lightbulb,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Globe2,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";

export const metadata = {
  title: "Community Circles | BDSisters.org",
  description:
    "Explore BDSisters community circles, sisterhood values, safe space commitments, and guidelines for meaningful peer networking.",
};

export default function CommunityPage() {
  const circles = [
    {
      title: "Entrepreneurs & Founders Circle",
      desc: "For women launching and scaling enterprises. Discuss cashflow, supply chains, trade licensing, digital marketing, and founder mental health.",
      members: "1,200+ sisters",
      category: "Business & Commerce",
      gradient: "from-primary/10 to-transparent",
    },
    {
      title: "Tech, Software & Freelancing Hub",
      desc: "Software engineers, UI/UX designers, data analysts, and remote contractors sharing tips, portfolio reviews, and client acquisition hacks.",
      members: "950+ sisters",
      category: "Engineering & IT",
      gradient: "from-heading-accent/10 to-transparent",
    },
    {
      title: "Creative Artisans & Modest Fashion",
      desc: "Weavers, ceramicists, clothing designers, and boutique owners sharing textile sourcing, ethical production, and styling insights.",
      members: "820+ sisters",
      category: "Artisan & Craft",
      gradient: "from-success/10 to-transparent",
    },
    {
      title: "Corporate Ascent & Executive Women",
      desc: "Corporate leaders, bank managers, legal researchers, and early-career grads navigating interviews, promotions, and workplace balance.",
      members: "1,400+ sisters",
      category: "Career & Leadership",
      gradient: "from-amber-500/10 to-transparent",
    },
    {
      title: "Global Diaspora Sisters",
      desc: "Bangladeshi women living in the UK, USA, Canada, Australia, and GCC connecting over shared heritage, cross-border business, and relocation tips.",
      members: "650+ sisters",
      category: "Global Chapters",
      gradient: "from-primary/10 to-transparent",
    },
    {
      title: "Personal Well-being & Care Collective",
      desc: "Safe discussions on mothering, work-life harmony, health, mindfulness, and spiritual rejuvenation in a judgment-free circle.",
      members: "1,100+ sisters",
      category: "Wellness & Life",
      gradient: "from-purple-500/10 to-transparent",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden hero-mesh-bg pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-border/80">
        <Container size="lg" className="relative z-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div
                data-aos="fade-down"
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary backdrop-blur-md shadow-xs mb-6"
              >
                <Users className="h-4 w-4 text-primary" />
                <span>Protected, Moderated &amp; Verified Network</span>
              </div>

              <h1
                data-aos="fade-up"
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text-primary leading-[1.1]"
              >
                A Safe, Inspiring Haven for{" "}
                <span className="text-gradient-primary">Every Sister.</span>
              </h1>

              <p
                data-aos="fade-up"
                data-aos-delay="100"
                className="mt-6 text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl font-normal"
              >
                Discover an ad-free, respectful sanctuary where ambitious Bangladeshi
                women share vulnerable questions, celebrate wins, exchange referrals,
                and forge genuine lifelong bonds.
              </p>

              <div
                data-aos="fade-up"
                data-aos-delay="200"
                className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto"
              >
                <Link href="/register" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="shadow-button w-full sm:w-auto">
                    <span>Join Community Circles Free</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
                <Link href="/about" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="border-border bg-white/80 w-full sm:w-auto">
                    <span>Community Values</span>
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
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                  alt="Young Bangladeshi women gathered around a discussion table"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 inset-x-5 text-white">
                  <span className="inline-block rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white mb-1">
                    Safe Discussion Space
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-white/95">
                    Peer encouragement, confidential masterminds, and zero spam.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. SPECIALIZED CIRCLES GRID */}
      <Section spacing="lg" className="bg-white">
        <Container size="lg">
          <SectionHeading
            badge="Dedicated Neighborhoods"
            title="Specialized Circles for Every Industry &amp; Passion"
            description="Our structured circles ensure you connect with like-minded peers without the chaotic noise of public social media."
          />

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {circles.map((c, idx) => (
              <div
                key={c.title}
                data-aos="fade-up"
                data-aos-delay={idx * 50}
                className="group relative flex flex-col justify-between rounded-3xl border border-white/90 bg-surface/60 p-8 shadow-card card-hover-effect"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-4">
                    <span className="rounded-full bg-primary/10 px-3 py-1 font-bold text-primary">
                      {c.category}
                    </span>
                    <span className="flex items-center gap-1 text-neutral text-[11px]">
                      <Lock className="h-3 w-3" /> Member Safe Space
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                    {c.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {c.desc}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-border/80 pt-4">
                  <span className="text-xs font-bold text-text-primary">
                    {c.members}
                  </span>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:underline"
                  >
                    <span>Request to Join</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. SAFETY COMMITMENTS & CODE OF CONDUCT */}
      <Section spacing="lg" className="bg-surface/50 border-t border-border/80">
        <Container size="lg">
          <SectionHeading
            badge="Protected Space"
            title="Our Four Pillars of Community Safety"
            description="We prioritize the emotional, digital, and professional well-being of every sister above all else."
          />

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-3xl border border-white/90 bg-white/90 p-7 shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-text-primary">Identity Protection</h3>
              <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                Personal phone numbers, physical home addresses, and private NID records are strictly shielded from public view.
              </p>
            </div>

            <div className="rounded-3xl border border-white/90 bg-white/90 p-7 shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger mb-4">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-text-primary">Zero Tolerance for Harassment</h3>
              <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                Instant permanent banning for abusive behavior, bullying, misogynistic remarks, or unwanted private solicitations.
              </p>
            </div>

            <div className="rounded-3xl border border-white/90 bg-white/90 p-7 shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-heading-accent/10 text-heading-accent mb-4">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-text-primary">No Data Brokering</h3>
              <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                We never sell, rent, or harvest our community data for third-party advertisers or commercial predatory brokers.
              </p>
            </div>

            <div className="rounded-3xl border border-white/90 bg-white/90 p-7 shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success mb-4">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-text-primary">Respectful Moderation</h3>
              <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                Trained community ambassadors ensure conversations remain constructive, positive, and deeply encouraging.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. FINAL CTA */}
      <CTASection
        badge="Your Seat Is Reserved"
        title="Ready to Find Your People in BDSisters?"
        description="Join thousands of women who support each other's dreams every day. 100% free core membership."
        primaryAction={{
          label: "Join the Sisterhood Free",
          href: "/register",
        }}
        secondaryAction={{
          label: "Explore Business Directory",
          href: "/businesses",
        }}
      />
    </div>
  );
}
