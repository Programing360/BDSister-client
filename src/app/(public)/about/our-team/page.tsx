import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { TeamMemberCard } from "@/features/public/about/components/team-member-card";
import { publicService } from "@/features/public/services/public-service";
import { Users, Sparkles, HeartHandshake, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Our Team | BDSisters.org",
  description:
    "Meet the visionary founders, directors, and advisory council guiding BDSisters.org and Muhsina Organization.",
};

export default async function OurTeamPage() {
  const teamMembers = await publicService.getTeamMembers();

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Our Team" },
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
            <Users className="h-4 w-4 text-primary" />
            <span>Executive Leadership &amp; Board</span>
          </div>

          <h1
            data-aos="fade-up"
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text-primary leading-[1.1]"
          >
            Meet the <span className="text-gradient-primary">Visionaries</span> Guiding BDSisters
          </h1>

          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="mt-6 text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto font-normal"
          >
            Our leadership brings together experienced educators, corporate lawyers,
            seasoned technologists, and social innovators dedicated to transparent
            governance and member prosperity.
          </p>
        </Container>
      </section>

      {/* 2. TEAM DIRECTORY GRID */}
      <Section spacing="lg" className="bg-white">
        <Container size="lg">
          <SectionHeading
            badge="Executive Council"
            title="Guiding Our Community with Purpose and Diligence"
            description="Dedicated women and leaders committed to transparent stewardship and member success."
          />

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. ADVISORY & VOLUNTEER INVITATION CARD */}
      <Section spacing="md" className="bg-surface/60 border-t border-border/80">
        <Container size="md" className="text-center">
          <div className="rounded-3xl border border-white/90 bg-white/90 p-8 sm:p-10 shadow-card">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-4">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-text-primary">
              Interested in Joining Our Advisory Board or Volunteer Circle?
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed max-w-xl mx-auto">
              We frequently invite guest mentors, industry specialists, legal advisors, and
              youth ambassadors to lead community workshops and contribute to our curriculum.
            </p>
            <div className="mt-6">
              <Link href="/contact">
                <Button variant="primary" size="md" className="shadow-button">
                  <span>Reach Out to Our Leadership</span>
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. FINAL CTA */}
      <CTASection
        badge="Connect Today"
        title="Experience the Power of Our Sisterhood"
        description="Join thousands of women who are learning, growing, and thriving together every day."
        primaryAction={{
          label: "Register for Free",
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
