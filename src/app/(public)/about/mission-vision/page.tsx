import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Compass,
  Eye,
  Heart,
  Target,
  Sparkles,
  Shield,
  Flame,
  CheckCircle2,
  TrendingUp,
  Globe2,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Mission & Vision | BDSisters.org",
  description:
    "Explore the guiding mission, long-term vision, and core operating values of BDSisters.org.",
};

export default function MissionVisionPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Mission & Vision" },
  ];

  return (
    <div className="flex flex-col">
      {/* Top Breadcrumb Bar */}
      <div className="bg-surface/70 border-b border-border/80 py-3.5">
        <Container size="lg">
          <Breadcrumb items={breadcrumbItems} />
        </Container>
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden hero-mesh-bg pt-16 pb-20 sm:pt-20 sm:pb-24 border-b border-border/80 text-center">
        <Container size="md" className="relative z-10">
          <div
            data-aos="fade-down"
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary backdrop-blur-md shadow-xs mb-6"
          >
            <Compass className="h-4 w-4 text-primary" />
            <span>Guiding Principles &amp; Roadmap</span>
          </div>

          <h1
            data-aos="fade-up"
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text-primary leading-[1.1]"
          >
            Our Mission &amp; <span className="text-gradient-primary">Vision</span>
          </h1>

          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="mt-6 text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto font-normal"
          >
            A clear, unwavering mandate to equip, connect, and elevate Bangladeshi
            women in entrepreneurship, leadership, and community dignity.
          </p>
        </Container>
      </section>

      {/* 2. MISSION VS VISION DUAL SHOWCASE */}
      <Section spacing="lg" className="bg-white">
        <Container size="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div
              data-aos="fade-up"
              className="flex flex-col justify-between rounded-3xl border border-white/90 bg-surface/70 p-8 sm:p-12 shadow-card"
            >
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-md mb-6">
                  <Target className="h-7 w-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  The Purpose We Serve Today
                </span>
                <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                  To Equip, Connect, and Champion Bangladeshi Women Everywhere
                </h2>
                <p className="mt-4 text-sm sm:text-base text-text-secondary leading-relaxed">
                  We exist to eliminate the isolation and structural hurdles faced by female
                  founders and professionals in Bangladesh and the global diaspora. We provide
                  equal, safe access to institutional verification, business directory discovery,
                  zero-commission artisan commerce, and uplifting peer circles.
                </p>
              </div>

              <div className="mt-8 border-t border-border/80 pt-6">
                <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">
                  Our Uncompromising Promise:
                </span>
                <p className="text-sm font-medium text-text-primary italic">
                  &ldquo;A sanctuary where no sister walks alone, and no vision is deemed too small or too ambitious.&rdquo;
                </p>
              </div>
            </div>

            {/* Vision 2030 Card */}
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="flex flex-col justify-between rounded-3xl border border-white/90 bg-surface/70 p-8 sm:p-12 shadow-card"
            >
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-heading-accent text-white shadow-md mb-6">
                  <Eye className="h-7 w-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-heading-accent">
                  The Destination for 2030
                </span>
                <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                  A Resilient, Self-Sustaining Economy of Women Leaders
                </h2>
                <p className="mt-4 text-sm sm:text-base text-text-secondary leading-relaxed">
                  We envision a thriving ecosystem where women-led enterprises account for
                  a defining share of Bangladesh&apos;s digital commerce and export presence.
                  We envision an unbroken chain of intergenerational mentorship where established
                  CEOs actively pave the path for young rural makers.
                </p>
              </div>

              <div className="mt-8 border-t border-border/80 pt-6">
                <span className="text-xs font-bold uppercase tracking-wider text-heading-accent block mb-2">
                  Target Benchmark:
                </span>
                <p className="text-sm font-medium text-text-primary">
                  100,000 active women entrepreneurs and creators across all 64 districts of Bangladesh and 25+ diaspora global hubs.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. OPERATING VALUES BENTO GRID */}
      <Section spacing="lg" className="bg-surface/50 border-t border-border/80">
        <Container size="lg">
          <SectionHeading
            badge="Ethical Charter"
            title="Six Core Values That Guide Every Decision"
            description="Our operating philosophy is anchored in cultural respect, commercial fairness, and unyielding sisterhood."
          />

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            <div
              data-aos="fade-up"
              className="rounded-3xl border border-white/90 bg-white/90 p-8 shadow-card card-hover-effect"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Sisterhood over Competition</h3>
              <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                We reject zero-sum mentalities. When one sister rises, she extends her hand to illuminate the path for others.
              </p>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="rounded-3xl border border-white/90 bg-white/90 p-8 shadow-card card-hover-effect"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-heading-accent/10 text-heading-accent mb-5">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Integrity &amp; Ihsan</h3>
              <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                Striving for excellence in craftsmanship, ethical pricing, and absolute honesty in every commercial transaction.
              </p>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="150"
              className="rounded-3xl border border-white/90 bg-white/90 p-8 shadow-card card-hover-effect"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success mb-5">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Economic Sovereignty</h3>
              <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                True freedom begins with financial autonomy. We champion women as breadwinners, investors, and business owners.
              </p>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="rounded-3xl border border-white/90 bg-white/90 p-8 shadow-card card-hover-effect"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-5">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Privacy &amp; Safety First</h3>
              <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                Protecting our sisters&apos; personal contact data, family privacy, and digital security with state-of-the-art protections.
              </p>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="250"
              className="rounded-3xl border border-white/90 bg-white/90 p-8 shadow-card card-hover-effect"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5">
                <Globe2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Global Diaspora Bridge</h3>
              <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                Uniting nonresident Bangladeshi professionals abroad with grassroots innovators inside Bangladesh for mutual strength.
              </p>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="300"
              className="rounded-3xl border border-white/90 bg-white/90 p-8 shadow-card card-hover-effect"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 mb-5">
                <Flame className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Cultural Heritage Preservation</h3>
              <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                Honoring millennia of Bengal textile traditions, Nakshi Kantha, and indigenous crafts by connecting them to modern buyers.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. FINAL CTA */}
      <CTASection
        badge="Walk With Us"
        title="Be Part of Our 2030 Vision for Bangladeshi Women"
        description="Whether you have an idea for a business, want to learn, or wish to mentor, join our movement today."
        primaryAction={{
          label: "Create Free Account",
          href: "/register",
        }}
        secondaryAction={{
          label: "Meet Our Team",
          href: "/about/our-team",
        }}
      />
    </div>
  );
}
