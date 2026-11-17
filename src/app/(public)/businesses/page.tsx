import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CTASection } from "@/components/shared/cta-section";
import { BusinessDirectoryView } from "@/features/public/businesses/components/business-directory-view";
import { publicService } from "@/features/public/services/public-service";
import { Briefcase, Sparkles, ShieldCheck, Award } from "lucide-react";

export const metadata = {
  title: "Women-Led Business Directory | BDSisters.org",
  description:
    "Explore, discover, and support verified businesses founded, owned, and operated by Bangladeshi women across diverse sectors.",
};

export default async function BusinessesPage() {
  const businesses = await publicService.getBusinesses();
  const categories = await publicService.getBusinessCategories();
  const locations = await publicService.getBusinessLocations();

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden hero-mesh-bg pt-16 pb-20 sm:pt-20 sm:pb-24 border-b border-border/80 text-center">
        <Container size="md" className="relative z-10">
          <div
            data-aos="fade-down"
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary backdrop-blur-md shadow-xs mb-6"
          >
            <Briefcase className="h-4 w-4 text-primary" />
            <span>Institutional Accreditation &amp; Directory</span>
          </div>

          <h1
            data-aos="fade-up"
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text-primary leading-[1.1]"
          >
            Discover Verified <span className="text-gradient-primary">Women Entrepreneurs</span>
          </h1>

          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="mt-6 text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto font-normal"
          >
            Connect directly with verified artisan studios, legal consultancies,
            skincare labs, and tech agencies owned and operated by visionary
            Bangladeshi women.
          </p>

          {/* Quick Metrics Strip */}
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="mt-8 inline-flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-white/80 bg-white/70 px-6 py-2.5 text-xs font-semibold text-text-secondary shadow-xs backdrop-blur-md"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>100% Identity Verified</span>
            </span>
            <span className="text-border">•</span>
            <span className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-heading-accent" />
              <span>{businesses.length}+ Registered Brands</span>
            </span>
            <span className="text-border">•</span>
            <span>8 Divisions &amp; Global Hubs</span>
          </div>
        </Container>
      </section>

      {/* 2. DIRECTORY CONTENT & INTERACTIVE FILTERS */}
      <Section spacing="lg" className="bg-white">
        <Container size="lg">
          <BusinessDirectoryView
            initialBusinesses={businesses}
            categories={categories}
            locations={locations}
          />
        </Container>
      </Section>

      {/* 3. BUSINESS ONBOARDING CTA */}
      <CTASection
        badge="Are You a Female Founder?"
        title="List Your Business on the BDSisters Directory"
        description="Join our curated registry to receive verified accreditation, increase client discovery across Bangladesh and the diaspora, and access member trade networks."
        primaryAction={{
          label: "Submit Your Business",
          href: "/register",
        }}
        secondaryAction={{
          label: "Learn About Verification",
          href: "/about",
        }}
      />
    </div>
  );
}
