import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CTASection } from "@/components/shared/cta-section";
import { LearningView } from "@/features/public/learning/components/learning-view";
import { publicService } from "@/features/public/services/public-service";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  Users,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Learning & Academy | BDSisters.org",
  description:
    "Master in-demand skills with practical courses in business finance, digital marketing, freelancing, and leadership curated for Bangladeshi women.",
};

export default async function LearningPage() {
  const courses = await publicService.getCourses();
  const categories = await publicService.getCourseCategories();

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
              <span>BDSisters Professional &amp; Skill Academy</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
              Real-World Skills Taught by <br className="hidden sm:inline" />
              <span className="text-gradient-primary">Top Bangladeshi Women Leaders</span>
            </h1>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl">
              Practical, cohort-based and self-paced masterclasses designed specifically for our local economy — from trade license compliance and export logistics to digital brand marketing.
            </p>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 w-full max-w-2xl">
              <div className="rounded-2xl border border-border/70 bg-surface/60 p-3.5 backdrop-blur-sm">
                <span className="text-2xl font-extrabold text-primary block">2,400+</span>
                <span className="text-[11px] font-semibold text-text-secondary">Enrolled Sisters</span>
              </div>
              <div className="rounded-2xl border border-border/70 bg-surface/60 p-3.5 backdrop-blur-sm">
                <span className="text-2xl font-extrabold text-text-primary block">100%</span>
                <span className="text-[11px] font-semibold text-text-secondary">Free Access</span>
              </div>
              <div className="rounded-2xl border border-border/70 bg-surface/60 p-3.5 backdrop-blur-sm">
                <span className="text-2xl font-extrabold text-primary block">4.9 / 5.0</span>
                <span className="text-[11px] font-semibold text-text-secondary">Average Rating</span>
              </div>
              <div className="rounded-2xl border border-border/70 bg-surface/60 p-3.5 backdrop-blur-sm">
                <span className="text-2xl font-extrabold text-text-primary block">Verified</span>
                <span className="text-[11px] font-semibold text-text-secondary">Certificates</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Course Directory */}
      <Section spacing="lg" className="bg-background">
        <Container size="lg">
          <LearningView
            initialCourses={courses}
            categories={categories}
          />
        </Container>
      </Section>

      {/* Instructor CTA */}
      <CTASection
        badge="Join Our Faculty"
        title="Share Your Domain Mastery with Sister Learners"
        description="Are you a lawyer, chartered accountant, software engineer, or brand strategist? Help elevate our sisters by publishing or co-hosting a masterclass module."
        primaryAction={{
          label: "Apply as an Instructor",
          href: "/contact?subject=Teaching%20Inquiry",
        }}
        secondaryAction={{
          label: "Explore Community Circles",
          href: "/community",
        }}
      />
    </div>
  );
}
