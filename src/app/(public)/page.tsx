import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Briefcase,
  ShoppingBag,
  GraduationCap,
  Calendar,
  FileText,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Star,
  Globe2,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { CTASection } from "@/components/shared/cta-section";
import { BusinessCard } from "@/features/public/businesses/components/business-card";
import { ProductCard } from "@/features/public/marketplace/components/product-card";
import { EventCard } from "@/features/public/events/components/event-card";
import { LearningCard } from "@/features/public/learning/components/learning-card";
import { publicService } from "@/features/public/services/public-service";
import {
  MOCK_TESTIMONIALS,
  MOCK_COURSES,
} from "@/features/public/data/mock-data";

export default async function HomePage() {
  const featuredBusinesses = await publicService.getFeaturedBusinesses();
  const featuredProducts = await publicService.getFeaturedProducts();
  const upcomingEvents = await publicService.getUpcomingEvents();
  const topCourses = MOCK_COURSES.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* ============================================================
          1. HERO SECTION — EDITORIAL LAYERED COMPOSITION
          ============================================================ */}
      <section className="relative overflow-hidden bg-white pt-14 pb-20 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32 border-b border-border/60">
        <Container size="lg" className="relative z-10">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-12">
            {/* =========================================================
              LEFT COLUMN: Clean Editorial Hierarchy & Mini Metrics
             ========================================================= */}
            <div className="order-1 lg:col-span-6 flex flex-col items-start text-left">
              {/* Top Lead-in Eyebrow (Matches "We are") */}
              <span
                data-aos="fade-down"
                data-aos-duration="600"
                className="text-base sm:text-lg font-medium tracking-wide text-text-secondary mb-2"
              >
                The Premier Network for
              </span>

              {/* Main Bold Display Headline (Matches "Digital Agency") */}
              <h1
                data-aos="fade-up"
                data-aos-delay="100"
                data-aos-duration="700"
                className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.12]"
              >
                Bangladeshi{" "}
                <span className="text-primary block sm:inline">
                  Women Leaders
                </span>
              </h1>

              {/* Supporting Description */}
              <p
                data-aos="fade-up"
                data-aos-delay="200"
                data-aos-duration="700"
                className="mt-5 text-sm sm:text-base text-text-secondary leading-relaxed max-w-lg"
              >
                An elevated digital sanctuary uniting ambitious female
                entrepreneurs, creatives, and professionals. Access verified
                networking, ethical commerce, masterclasses, and lifelong
                sisterhood worldwide.
              </p>

              {/* Primary & Secondary Action Buttons */}
              <div
                data-aos="fade-up"
                data-aos-delay="300"
                data-aos-duration="700"
                className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto"
              >
                <Link href="/register" className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto rounded-lg px-7 py-3.5 text-sm sm:text-base font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <span>Join the Sisterhood</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/about" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto rounded-lg border-border px-6 py-3.5 text-sm sm:text-base font-semibold text-text-primary hover:bg-gray-50 transition-all duration-200"
                  >
                    <span>Our Mission</span>
                  </Button>
                </Link>
              </div>

              {/* 2-Column Mini Metrics Row (Matches "Upto 15% / Upto 50%" block) */}
              <div
                data-aos="fade-up"
                data-aos-delay="400"
                data-aos-duration="700"
                className="mt-12 grid grid-cols-2 gap-8 sm:gap-12 pt-2 w-full max-w-md"
              >
                {/* Metric 1 */}
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-primary">
                    Verified Network
                  </span>
                  <span className="mt-1 text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                    5,000+
                  </span>
                  <span className="mt-1 text-xs font-medium text-text-secondary">
                    Sisters Connected Globally
                  </span>
                </div>

                {/* Metric 2 */}
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-primary">
                    Zero Commission
                  </span>
                  <span className="mt-1 text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                    ৳4.5M+
                  </span>
                  <span className="mt-1 text-xs font-medium text-text-secondary">
                    Community Commerce
                  </span>
                </div>
              </div>
            </div>

            {/* =========================================================
              RIGHT COLUMN: Staggered 4-Pill Geometric Collage
              (Automatically sits at bottom on mobile/tablet via order-2)
             ========================================================= */}
            <div className="order-2 lg:col-span-6 flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-[360px] sm:max-w-[460px] lg:max-w-[500px] mx-auto lg:mr-0">
                {/* 2-Column Asymmetric Pill Grid */}
                <div className="grid grid-cols-2 gap-4 sm:gap-5 items-start">
                  {/* LEFT SUB-COLUMN: Top Horizontal Gold Pill + Bottom Tall Primary Pill */}
                  <div className="flex flex-col gap-4 sm:gap-5">
                    {/* 1. Top-Left Horizontal Accent Pill */}
                    <div
                      data-aos="fade-down-right"
                      data-aos-delay="150"
                      data-aos-duration="800"
                      className="h-24 sm:h-32 w-full rounded-full bg-amber-400 shadow-[0_18px_35px_-10px_rgba(251,191,36,0.45)]"
                      aria-hidden="true"
                    />

                    {/* 2. Bottom-Left Tall Primary Pill with Portrait */}
                    <div
                      data-aos="fade-up"
                      data-aos-delay="250"
                      data-aos-duration="800"
                      className="relative h-64 sm:h-80 w-full overflow-hidden rounded-full bg-primary shadow-[0_22px_45px_-12px_rgba(0,0,0,0.18)] group"
                    >
                      <Image
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85"
                        alt="Bangladeshi woman entrepreneur smiling confidently"
                        fill
                        priority
                        sizes="(max-width: 640px) 170px, 240px"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Subtle bottom vignette for depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>

                  {/* RIGHT SUB-COLUMN: Top Tall Gold Pill + Bottom Horizontal Primary Pill */}
                  <div className="flex flex-col gap-4 sm:gap-5 pt-4 sm:pt-6">
                    {/* 3. Top-Right Tall Gold Pill with Portrait */}
                    <div
                      data-aos="fade-down"
                      data-aos-delay="200"
                      data-aos-duration="800"
                      className="relative h-64 sm:h-80 w-full overflow-hidden rounded-full bg-amber-400 shadow-[0_22px_45px_-12px_rgba(0,0,0,0.18)] group"
                    >
                      <Image
                        src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=85"
                        alt="Creative female leader in studio"
                        fill
                        priority
                        sizes="(max-width: 640px) 170px, 240px"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-500/25 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* 4. Bottom-Right Horizontal Primary Pill */}
                    <div
                      data-aos="fade-up-left"
                      data-aos-delay="350"
                      data-aos-duration="800"
                      className="h-24 sm:h-32 w-full rounded-full bg-primary shadow-[0_18px_35px_-10px_rgba(79,70,229,0.35)]"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================================
          2. PLATFORM PILLARS — BENTO GRID VISUAL COMPOSITION
          ============================================================ */}
      <Section spacing="lg" className="bg-surface/60 relative">
        <Container size="lg">
          <SectionHeading
            badge="Platform Ecosystem"
            title="Four Pillars Designed for Your Holistic Growth"
            description="Unlike fragmented social media groups, BDSisters integrates business verification, safe community circles, continuous learning, and ethical marketplace discovery into one cohesive home."
          />

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-12">
            {/* Bento Card 1: Safe Community (Wide Spotlight) */}
            <div
              data-aos="fade-up"
              className="md:col-span-8 group relative overflow-hidden rounded-3xl border border-white/90 bg-white/90 p-8 sm:p-10 shadow-card card-hover-effect flex flex-col justify-between"
            >
              <div className="relative z-10 max-w-xl">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 y mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                  <Users className="h-7 w-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Safe &amp; Moderated
                </span>
                <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                  Protected Sisterhood Circles
                </h3>
                <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed">
                  Engage in candid professional dialogues, seeking mentorship,
                  asking unfiltered questions, and sharing victories in a
                  sanctuary free from harassment, spam, and algorithmic
                  distractions.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-xl bg-surface px-3 py-1.5 text-xs font-semibold text-text-primary">
                    Division Hubs
                  </span>
                  <span className="rounded-xl bg-surface px-3 py-1.5 text-xs font-semibold text-text-primary">
                    Founders Circle
                  </span>
                  <span className="rounded-xl bg-surface px-3 py-1.5 text-xs font-semibold text-text-primary">
                    Career Switchers
                  </span>
                  <span className="rounded-xl bg-surface px-3 py-1.5 text-xs font-semibold text-text-primary">
                    Moms in Tech
                  </span>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-border/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-text-secondary">
                  5,000+ active sisters
                </span>
                <Link
                  href="/community"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:underline"
                >
                  <span>Explore Circles</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Bento Card 2: Business Directory (Vertical Spotlight) */}
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="md:col-span-4 group relative overflow-hidden rounded-3xl border border-white/90 bg-white/90 p-8 shadow-card card-hover-effect flex flex-col justify-between"
            >
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-heading-accent/10  mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-heading-accent group-hover:text-white">
                  <Briefcase className="h-7 w-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-heading-accent">
                  Verified Trust
                </span>
                <h3 className="mt-2 text-xl font-bold text-text-primary">
                  Business Directory
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Gain institutional credibility with the BDSisters Verification
                  Seal. Connect directly with domestic clients and overseas
                  diaspora buyers.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-border/80">
                <Link
                  href="/businesses"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:underline"
                >
                  <span>Discover Businesses</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Bento Card 3: Artisan Marketplace */}
            <div
              data-aos="fade-up"
              data-aos-delay="150"
              className="md:col-span-4 group relative overflow-hidden rounded-3xl border border-white/90 bg-white/90 p-8 shadow-card card-hover-effect flex flex-col justify-between"
            >
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 text-success mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-success group-hover:text-white">
                  <ShoppingBag className="h-7 w-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-success">
                  0% Platform Fee
                </span>
                <h3 className="mt-2 text-xl font-bold text-text-primary">
                  Artisan Marketplace
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Buy Jamdani, organic skincare, Nakshi Kantha, and heritage
                  foods directly from the women who make them.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-border/80">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:underline"
                >
                  <span>Shop Artisans</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Bento Card 4: Academy & Masterclasses */}
            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="md:col-span-4 group relative overflow-hidden rounded-3xl border border-white/90 bg-white/90 p-8 shadow-card card-hover-effect flex flex-col justify-between"
            >
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                  Practical Skills
                </span>
                <h3 className="mt-2 text-xl font-bold text-text-primary">
                  Learning Academy
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Bite-sized, jargon-free courses in trade licenses, tax
                  compliance, export logistics, and digital branding.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-border/80">
                <Link
                  href="/learning"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:underline"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Bento Card 5: Non-Profit Foundation Backing */}
            <div
              data-aos="fade-up"
              data-aos-delay="250"
              className="md:col-span-4 group relative overflow-hidden rounded-3xl border border-white/90 bg-white/90 p-8 shadow-card card-hover-effect flex flex-col justify-between"
            >
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10  mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Muhsina Initiative
                </span>
                <h3 className="mt-2 text-xl font-bold text-text-primary">
                  Philanthropic Mission
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Operated with strict non-profit governance, ensuring revenues
                  are reinvested into micro-grants and community training.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-border/80">
                <Link
                  href="/about/muhsina"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:underline"
                >
                  <span>About Muhsina</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ============================================================
          3. HOW IT WORKS — STEPPED PROGRESSION
          ============================================================ */}
      <Section spacing="lg" className="bg-white">
        <Container size="lg">
          <SectionHeading
            badge="Simple Journey"
            title="How BDSisters Accelerates Your Path"
            description="Whether you are registering your first small venture or expanding across Bangladesh, our structured path gets you there."
          />

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div
              data-aos="fade-up"
              className="relative flex flex-col justify-between rounded-3xl border border-border/80 bg-surface/50 p-8 shadow-soft hover:shadow-card transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-5xl font-black text-primary/20">
                    01
                  </span>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    Free Step
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-extrabold text-text-primary">
                  Create Your Sister Profile
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Sign up in two minutes. Specify your professional industry,
                  business interests, or craft preferences to be matched into
                  relevant circles.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/60 text-xs font-semibold text-primary">
                Instant access to member discussions
              </div>
            </div>

            {/* Step 2 */}
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="relative flex flex-col justify-between rounded-3xl border border-border/80 bg-surface/50 p-8 shadow-soft hover:shadow-card transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-5xl font-black text-primary/20">
                    02
                  </span>
                  <span className="rounded-full bg-heading-accent/10 px-3 py-1 text-xs font-bold text-heading-accent">
                    Showcase
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-extrabold text-text-primary">
                  Verify &amp; Showcase
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  List your registered enterprise in our verified directory or
                  launch your artisan product catalog with zero commission
                  deductions.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/60 text-xs font-semibold text-heading-accent">
                Verification badge &amp; directory listing
              </div>
            </div>

            {/* Step 3 */}
            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="relative flex flex-col justify-between rounded-3xl border border-border/80 bg-surface/50 p-8 shadow-soft hover:shadow-card transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-5xl font-black text-primary/20">
                    03
                  </span>
                  <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success">
                    Thrive
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-extrabold text-text-primary">
                  Flourish &amp; Pay It Forward
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Attend exclusive workshops, expand your customer revenues,
                  find peer collaborators, and mentor the next generation of
                  emerging sisters.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/60 text-xs font-semibold text-success">
                Lifelong network &amp; sustainable revenue
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ============================================================
          4. FEATURED BUSINESSES SHOWCASE
          ============================================================ */}
      <Section spacing="lg" className="bg-surface/50">
        <Container size="lg">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3">
                <Award className="h-3.5 w-3.5" />
                <span>Verified Bangladeshi Enterprises</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
                Featured Women-Led Businesses
              </h2>
              <p className="mt-2 text-sm text-text-secondary max-w-xl">
                Discover authentic brands created by visionary female founders
                across Bangladesh.
              </p>
            </div>

            <Link
              href="/businesses"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-4 py-2 text-sm font-bold  shadow-xs transition-all hover:bg-primary hover:text-white"
            >
              <span>Explore All Businesses</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {featuredBusinesses.slice(0, 6).map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        </Container>
      </Section>

      {/* ============================================================
          5. ARTISAN MARKETPLACE SHOWCASE
          ============================================================ */}
      <Section spacing="lg" className="bg-white">
        <Container size="lg">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3.5 py-1 text-xs font-bold text-success mb-3">
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Ethical &amp; Handcrafted Creations</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
                Curated Artisan Marketplace
              </h2>
              <p className="mt-2 text-sm text-text-secondary max-w-xl">
                Support Bangladeshi craftswomen directly. Jamdani sarees, herbal
                skincare, and gourmet culinary treats.
              </p>
            </div>

            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-4 py-2 text-sm font-bold shadow-xs transition-all hover:bg-primary hover:text-white"
            >
              <span>Browse Full Catalog</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Container>
      </Section>

      {/* ============================================================
          6. LEARNING & MASTERCLASSES SHOWCASE
          ============================================================ */}
      <Section spacing="lg" className="bg-surface/50">
        <Container size="lg">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mb-3">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Practical Academy</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
                Upskill with Specialized Masterclasses
              </h2>
              <p className="mt-2 text-sm text-text-secondary max-w-xl">
                Action-oriented courses led by successful female founders and
                certified experts.
              </p>
            </div>

            <Link
              href="/learning"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-4 py-2 text-sm font-bold  shadow-xs transition-all hover:bg-primary hover:text-white"
            >
              <span>Explore All Courses</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {topCourses.map((c) => (
              <LearningCard key={c.id} course={c} />
            ))}
          </div>
        </Container>
      </Section>

      {/* ============================================================
          7. UPCOMING EVENTS & WORKSHOPS
          ============================================================ */}
      <Section spacing="lg" className="bg-white">
        <Container size="lg">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-heading-accent/10 px-3.5 py-1 text-xs font-bold text-heading-accent mb-3">
                <Calendar className="h-3.5 w-3.5" />
                <span>Live Gatherings</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
                Upcoming Summits &amp; Circles
              </h2>
              <p className="mt-2 text-sm text-text-secondary max-w-xl">
                Join our live masterminds, regional city mixers, and online
                skill clinics.
              </p>
            </div>

            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-4 py-2 text-sm font-bold shadow-xs transition-all hover:bg-primary hover:text-white"
            >
              <span>View Full Calendar</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </Container>
      </Section>

      {/* ============================================================
          8. TESTIMONIALS & VOICES FROM THE SISTERHOOD
          ============================================================ */}
      <Section spacing="lg" className="bg-surface/60">
        <Container size="lg">
          <SectionHeading
            badge="Sister Stories"
            title="Real Journeys. Real Sisterhood."
            description="Listen to the authentic experiences of female founders, freelancers, and professionals flourishing across BDSisters."
          />

          <div className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                data-aos="fade-up"
                className="flex flex-col justify-between rounded-3xl border border-white/90 bg-white/90 p-8 shadow-card card-hover-effect"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <p className="text-sm sm:text-base text-text-secondary leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-3.5 border-t border-border/80 pt-5">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 bg-primary/10">
                    <Image
                      src={t.avatar || "/images/placeholders/team-1.jpg"}
                      alt={t.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary text-base leading-tight">
                      {t.name}
                    </h4>
                    <p className="text-xs font-semibold text-primary mt-0.5">
                      {t.role}
                    </p>
                    <p className="text-[11px] text-neutral">
                      {t.district}, Bangladesh
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ============================================================
          9. MEMBERSHIP REASSURANCE & TRUST
          ============================================================ */}
      <Section spacing="lg" className="bg-white border-t border-border/80">
        <Container size="md" className="text-center">
          <SectionHeading
            badge="Sisterhood Commitments"
            title="Why Over 5,000 Sisters Call This Platform Home"
            description="Our community was founded on mutual respect, financial sovereignty, and authentic support."
          />

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 text-left">
            <div className="flex items-start gap-4 rounded-3xl border border-border/80 bg-surface/50 p-6 shadow-soft hover:shadow-card transition-all">
              <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-base text-text-primary">
                  100% Free Core Membership
                </h4>
                <p className="text-xs sm:text-sm text-text-secondary mt-1.5 leading-relaxed">
                  Access discussion forums, networking directory, public events,
                  and resource guides at no cost.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-3xl border border-border/80 bg-surface/50 p-6 shadow-soft hover:shadow-card transition-all">
              <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-base text-text-primary">
                  Strict Verification &amp; Safety
                </h4>
                <p className="text-xs sm:text-sm text-text-secondary mt-1.5 leading-relaxed">
                  Careful moderation maintains a professional, encouraging, and
                  spam-free environment for women.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-3xl border border-border/80 bg-surface/50 p-6 shadow-soft hover:shadow-card transition-all">
              <ShoppingBag className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-base text-text-primary">
                  Zero Commission Deductions
                </h4>
                <p className="text-xs sm:text-sm text-text-secondary mt-1.5 leading-relaxed">
                  Female artisans and makers keep 100% of their earnings with
                  direct buyer-to-seller interactions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-3xl border border-border/80 bg-surface/50 p-6 shadow-soft hover:shadow-card transition-all">
              <Globe2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-base text-text-primary">
                  Active Global Diaspora Network
                </h4>
                <p className="text-xs sm:text-sm text-text-secondary mt-1.5 leading-relaxed">
                  Connect with overseas Bangladeshi professionals across North
                  America, Europe, Australia, and the Middle East.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ============================================================
          10. FINAL HIGH-IMPACT CALL TO ACTION
          ============================================================ */}
      <CTASection
        badge="Ready to Step In?"
        title="Be Part of Bangladesh's Most Empowering Sisterhood"
        description="Join thousands of driven women who are learning, growing, and thriving together. Create your free account today."
        primaryAction={{
          label: "Join Free Today",
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
