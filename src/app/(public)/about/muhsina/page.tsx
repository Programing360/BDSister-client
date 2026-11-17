import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Building2,
  ShieldCheck,
  Award,
  HandHeart,
  CheckCircle2,
  Scale,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Muhsina Organization | BDSisters.org",
  description:
    "Discover Muhsina Organization, our non-profit parent initiative dedicated to ethical welfare, education, and economic empowerment for Bangladeshi women.",
};

export default function MuhsinaPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Muhsina Organization" },
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
      <section className="relative overflow-hidden hero-mesh-bg pt-16 pb-20 sm:pt-20 sm:pb-24 border-b border-border/80">
        <Container size="md" className="text-center relative z-10">
          <div
            data-aos="fade-down"
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary backdrop-blur-md shadow-xs mb-6"
          >
            <Building2 className="h-4 w-4 text-primary" />
            <span>Philanthropic Non-Profit Foundation</span>
          </div>

          <h1
            data-aos="fade-up"
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text-primary leading-[1.1]"
          >
            Muhsina <span className="text-gradient-primary">Organization</span>
          </h1>

          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="mt-6 text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto font-normal"
          >
            A dedicated non-profit charitable trust established in Bangladesh,
            anchored in the ideals of excellence (Ihsan), moral dignity, and
            sustainable socioeconomic independence for women.
          </p>
        </Container>
      </section>

      {/* 2. RELATIONSHIP WITH BDSISTERS */}
      <Section spacing="lg" className="bg-white">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Institutional Sponsorship
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight leading-tight">
                Why Muhsina Created and Backs BDSisters.org
              </h2>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                Muhsina recognized that traditional charitable handouts, while compassionate,
                cannot solve systemic inequality or build intergenerational wealth for women.
                Women require autonomous digital spaces to showcase their crafts, learn modern
                business skills, and negotiate on equal footing in the digital economy.
              </p>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                To realize this vision, Muhsina endowed and launched <strong>BDSisters.org</strong>.
                Muhsina provides ethical auditing, non-profit governance, and foundational grant
                funding, ensuring the platform remains 100% free from exploitative commercial
                pressures.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3.5">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    <strong className="text-text-primary">100% Free Core Access:</strong> Muhsina&apos;s philanthropic backing guarantees that sisters never pay fees to connect, learn, or browse.
                  </p>
                </div>
                <div className="flex items-start gap-3.5">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    <strong className="text-text-primary">Ethical &amp; Safe Standards:</strong> Rigorous moderation prevents toxic behavior, scams, and deceptive financial schemes.
                  </p>
                </div>
                <div className="flex items-start gap-3.5">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    <strong className="text-text-primary">Reinvestment into Grants:</strong> All surplus proceeds from corporate partnerships are channeled directly into artisan micro-grants.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Glass Charter Box */}
            <div
              data-aos="fade-left"
              className="lg:col-span-6 rounded-3xl border border-white/90 bg-surface/70 p-8 sm:p-10 shadow-card"
            >
              <div className="flex items-center gap-3.5 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white font-black text-2xl shadow-md">
                  M
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-text-primary">The Muhsina Charter</h3>
                  <span className="text-xs font-semibold text-primary">Registered Non-Governmental Welfare Trust</span>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
                <p>
                  &ldquo;Muhsina&rdquo; is rooted in the classical principle of <em>Ihsan</em> — the conscious pursuit of moral beauty, exceptional craftsmanship, and altruistic service to community.
                </p>
                <p>
                  Our charter mandates that every digital tool, directory listing, and training curriculum deployed under BDSisters must protect the privacy, dignity, and economic rights of Bangladeshi women above all else.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border/80 pt-6">
                <div>
                  <span className="text-2xl font-black text-primary">100%</span>
                  <span className="block text-xs font-semibold text-text-secondary mt-0.5">Non-Profit Backed</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-primary">৳0</span>
                  <span className="block text-xs font-semibold text-text-secondary mt-0.5">Hidden Membership Fees</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. KEY FOUNDATION INITIATIVES */}
      <Section spacing="lg" className="bg-surface/50 border-t border-border/80">
        <Container size="lg">
          <SectionHeading
            badge="Philanthropic Wings"
            title="Active Muhsina Initiatives"
            description="Beyond platform operations, Muhsina funds direct field interventions across Bangladesh."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              data-aos="fade-up"
              className="flex flex-col justify-between rounded-3xl border border-white/90 bg-white/90 p-8 shadow-card card-hover-effect"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5">
                  <HandHeart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-text-primary">Artisan Micro-Seed Fund</h3>
                <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Non-repayable seed equipment grants enabling rural weavers, potters, and culinary makers to purchase raw materials and sewing tools.
                </p>
              </div>
              <span className="mt-6 text-xs font-bold text-primary">Over 180 craftswomen funded</span>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="flex flex-col justify-between rounded-3xl border border-white/90 bg-white/90 p-8 shadow-card card-hover-effect"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-heading-accent/10 text-heading-accent mb-5">
                  <Scale className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-text-primary">Pro Bono Legal Desk</h3>
                <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Volunteer female advocates providing confidential legal counsel on inheritance rights, trade licensing, trademark registration, and family law.
                </p>
              </div>
              <span className="mt-6 text-xs font-bold text-heading-accent">Confidential weekly clinics</span>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="flex flex-col justify-between rounded-3xl border border-white/90 bg-white/90 p-8 shadow-card card-hover-effect"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success mb-5">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-text-primary">Digital Literacy Labs</h3>
                <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  In-person mobile workshops across peri-urban districts teaching women how to safely use bKash, secure social media stores, and access e-commerce.
                </p>
              </div>
              <span className="mt-6 text-xs font-bold text-success">Active in 8 divisions</span>
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. FINAL CTA */}
      <CTASection
        badge="Community Solidarity"
        title="Experience the Difference of a Values-First Sisterhood"
        description="Join thousands of Bangladeshi women who learn, trade, and thrive together in a safe environment backed by Muhsina."
        primaryAction={{
          label: "Join BDSisters Free",
          href: "/register",
        }}
        secondaryAction={{
          label: "Explore Mission & Vision",
          href: "/about/mission-vision",
        }}
      />
    </div>
  );
}
