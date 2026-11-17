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
import { MOCK_TESTIMONIALS, MOCK_COURSES } from "@/features/public/data/mock-data";

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
      <section className="relative overflow-hidden hero-mesh-bg pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36 border-b border-border/80">
        {/* Soft Background Radial Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[550px] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-heading-accent/15 blur-[120px] pointer-events-none" />

        <Container size="lg" className="relative z-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Eyebrow Badge */}
              <div
                data-aos="fade-down"
                className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white/80 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary backdrop-blur-md shadow-xs mb-6"
              >
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span>The Premier Network for Bangladeshi Women Worldwide</span>
              </div>

              {/* Main Headline */}
              <h1
                data-aos="fade-up"
                data-aos-delay="100"
                className="text-4xl font-black tracking-tight text-text-primary sm:text-6xl lg:text-7xl leading-[1.08]"
              >
                Where Bangladeshi Women Lead,{" "}
                <span className="text-gradient-primary">Build &amp; Flourish</span>{" "}
                Together.
              </h1>

              {/* Supporting Editorial Description */}
              <p
                data-aos="fade-up"
                data-aos-delay="200"
                className="mt-6 text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl font-normal"
              >
                An elevated digital sanctuary uniting ambitious female entrepreneurs,
                creatives, professionals, and artisans. Access verified business
                networking, ethical commerce, masterclasses, and lifelong sisterhood.
              </p>

              {/* Dual Action CTAs */}
              <div
                data-aos="fade-up"
                data-aos-delay="300"
                className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto"
              >
                <Link href="/register" className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto shadow-button text-base px-7 py-3.5 hover:shadow-card-hover hover:scale-[1.02] transition-all"
                  >
                    <span>Join the Sisterhood Free</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>

                <Link href="/about" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-border bg-white/80 text-text-primary backdrop-blur-md hover:bg-white text-base px-6 py-3.5"
                  >
                    <span>Discover Our Mission</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators Pill */}
              <div
                data-aos="fade-up"
                data-aos-delay="400"
                className="mt-10 flex flex-wrap items-center gap-6 pt-6 border-t border-border/80 w-full text-xs text-text-secondary"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="font-medium text-text-primary">100% Free Membership</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span className="font-medium text-text-primary">Strictly Moderated &amp; Safe</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe2 className="h-4 w-4 text-heading-accent" />
                  <span className="font-medium text-text-primary">Dhaka to Global Diaspora</span>
                </div>
              </div>
            </div>

            {/* Right Column: Layered Visual Composition & Floating Cards */}
            <div
              data-aos="fade-left"
              data-aos-delay="200"
              className="lg:col-span-5 relative flex items-center justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-md sm:max-w-lg">
                {/* Main Hero Portrait/Action Image */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] border-4 border-white/90 shadow-premium">
                  <Image
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80"
                    alt="Bangladeshi woman entrepreneur smiling in collaborative office"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Caption Overlay */}
                  <div className="absolute bottom-5 inset-x-5 z-10 text-white">
                    <span className="inline-block rounded-full bg-primary/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-xs backdrop-blur-xs mb-1">
                      Sisterhood In Action
                    </span>
                    <p className="text-sm font-semibold text-white/90">
                      Collaborative growth, verified mentorship, and economic dignity.
                    </p>
                  </div>
                </div>

                {/* Overlapping Secondary Image */}
                <div className="absolute -bottom-6 -left-6 sm:-left-10 h-36 w-36 sm:h-44 sm:w-44 overflow-hidden rounded-3xl border-4 border-white shadow-card-hover z-20 hidden xs:block">
                  <Image
                    src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80"
                    alt="Artisan Jamdani textile craftsmanship"
                    fill
                    sizes="180px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
                </div>

                {/* Floating Milestone Card 1 (Top Right) */}
                <div className="absolute -top-6 -right-4 sm:-right-8 z-30 flex items-center gap-3 rounded-2xl border border-white/90 bg-white/95 px-4 py-3 shadow-floating backdrop-blur-md animate-float">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white font-bold">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                      Community Commerce
                    </span>
                    <p className="text-base font-extrabold text-text-primary">
                      ৳4.5M+ <span className="text-xs font-semibold text-success">Generated</span>
                    </p>
                  </div>
                </div>

                {/* Floating Member Avatar Stack (Bottom Right) */}
                <div className="absolute -bottom-8 right-2 sm:right-6 z-30 flex items-center gap-3 rounded-2xl border border-white/90 bg-white/95 px-4 py-3 shadow-card-hover backdrop-blur-md animate-float-delayed">
                  <div className="flex -space-x-2">
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-xs font-bold">
                      TR
                    </div>
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-heading-accent text-white flex items-center justify-center text-xs font-bold">
                      SN
                    </div>
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-success text-white flex items-center justify-center text-xs font-bold">
                      AZ
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-xs font-bold text-text-primary">5.0 Community</span>
                    </div>
                    <span className="text-[11px] font-medium text-text-secondary">
                      5,000+ Sisters Connected
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Stats Bar */}
          <div
            data-aos="fade-up"
            data-aos-delay="400"
            className="mt-16 sm:mt-24 grid grid-cols-2 gap-4 rounded-3xl border border-white/90 bg-white/80 p-6 shadow-premium backdrop-blur-xl sm:grid-cols-4 sm:p-8"
          >
            <div className="flex flex-col items-center text-center">
              <span className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
                5,000+
              </span>
              <span className="mt-1.5 text-xs sm:text-sm font-semibold text-text-secondary">
                Registered Sisters
              </span>
              <span className="text-[11px] text-neutral mt-0.5">Across 8 Divisions &amp; Abroad</span>
            </div>

            <div className="flex flex-col items-center text-center border-l-0 sm:border-l border-border/80">
              <span className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
                250+
              </span>
              <span className="mt-1.5 text-xs sm:text-sm font-semibold text-text-secondary">
                Verified Enterprises
              </span>
              <span className="text-[11px] text-neutral mt-0.5">Ethical Women-Led Brands</span>
            </div>

            <div className="flex flex-col items-center text-center border-t sm:border-t-0 sm:border-l border-border/80 pt-4 sm:pt-0">
              <span className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
                120+
              </span>
              <span className="mt-1.5 text-xs sm:text-sm font-semibold text-text-secondary">
                Workshops &amp; Circles
              </span>
              <span className="text-[11px] text-neutral mt-0.5">Practical Masterclasses</span>
            </div>

            <div className="flex flex-col items-center text-center border-t sm:border-t-0 sm:border-l border-border/80 pt-4 sm:pt-0">
              <span className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
                ৳4.5M+
              </span>
              <span className="mt-1.5 text-xs sm:text-sm font-semibold text-text-secondary">
                Community Commerce
              </span>
              <span className="text-[11px] text-neutral mt-0.5">100% Commission-Free</span>
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
                  Engage in candid professional dialogues, seeking mentorship, asking
                  unfiltered questions, and sharing victories in a sanctuary free from
                  harassment, spam, and algorithmic distractions.
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
                  Gain institutional credibility with the BDSisters Verification Seal.
                  Connect directly with domestic clients and overseas diaspora buyers.
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
                  Buy Jamdani, organic skincare, Nakshi Kantha, and heritage foods
                  directly from the women who make them.
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
                  Bite-sized, jargon-free courses in trade licenses, tax compliance,
                  export logistics, and digital branding.
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
                  Operated with strict non-profit governance, ensuring revenues are
                  reinvested into micro-grants and community training.
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
                  <span className="text-5xl font-black text-primary/20">01</span>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    Free Step
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-extrabold text-text-primary">
                  Create Your Sister Profile
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Sign up in two minutes. Specify your professional industry, business
                  interests, or craft preferences to be matched into relevant circles.
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
                  <span className="text-5xl font-black text-primary/20">02</span>
                  <span className="rounded-full bg-heading-accent/10 px-3 py-1 text-xs font-bold text-heading-accent">
                    Showcase
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-extrabold text-text-primary">
                  Verify &amp; Showcase
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  List your registered enterprise in our verified directory or launch your
                  artisan product catalog with zero commission deductions.
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
                  <span className="text-5xl font-black text-primary/20">03</span>
                  <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success">
                    Thrive
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-extrabold text-text-primary">
                  Flourish &amp; Pay It Forward
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Attend exclusive workshops, expand your customer revenues, find peer
                  collaborators, and mentor the next generation of emerging sisters.
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
                Discover authentic brands created by visionary female founders across Bangladesh.
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
                Support Bangladeshi craftswomen directly. Jamdani sarees, herbal skincare, and gourmet culinary treats.
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
                Action-oriented courses led by successful female founders and certified experts.
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
                Join our live masterminds, regional city mixers, and online skill clinics.
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
                    <p className="text-xs font-semibold text-primary mt-0.5">{t.role}</p>
                    <p className="text-[11px] text-neutral">{t.district}, Bangladesh</p>
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
                  Access discussion forums, networking directory, public events, and resource guides at no cost.
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
                  Careful moderation maintains a professional, encouraging, and spam-free environment for women.
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
                  Female artisans and makers keep 100% of their earnings with direct buyer-to-seller interactions.
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
                  Connect with overseas Bangladeshi professionals across North America, Europe, Australia, and the Middle East.
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
