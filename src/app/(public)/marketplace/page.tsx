import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CTASection } from "@/components/shared/cta-section";
import { MarketplaceView } from "@/features/public/marketplace/components/marketplace-view";
import { publicService } from "@/features/public/services/public-service";
import { ShoppingBag, ShieldCheck, HeartHandshake, Sparkles } from "lucide-react";

export const metadata = {
  title: "Artisan Marketplace | BDSisters.org",
  description:
    "Shop handcrafted creations, modest fashion, organic foods, and curated lifestyle items directly from Bangladeshi women artisans.",
};

export default async function MarketplacePage() {
  const products = await publicService.getProducts();
  const categories = await publicService.getProductCategories();

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden hero-mesh-bg pt-16 pb-20 sm:pt-20 sm:pb-24 border-b border-border/80 text-center">
        <Container size="md" className="relative z-10">
          <div
            data-aos="fade-down"
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary backdrop-blur-md shadow-xs mb-6"
          >
            <ShoppingBag className="h-4 w-4 text-primary" />
            <span>0% Commission • 100% Direct Artisan Support</span>
          </div>

          <h1
            data-aos="fade-up"
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text-primary leading-[1.1]"
          >
            Curated Creations by <span className="text-gradient-primary">Bangladeshi Women</span>
          </h1>

          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="mt-6 text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto font-normal"
          >
            Buy authentic Jamdani sarees, handcrafted pottery, organic wellness elixirs,
            and heritage delicacies directly from female artisans with zero middleman markups.
          </p>

          {/* Ethical Commerce Trust Banner */}
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="mt-8 inline-flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-white/80 bg-white/70 px-6 py-2.5 text-xs font-semibold text-text-secondary shadow-xs backdrop-blur-md"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Artisan Identity Verified</span>
            </span>
            <span className="text-border">•</span>
            <span className="flex items-center gap-1.5">
              <HeartHandshake className="h-4 w-4 text-success" />
              <span>Fair Living Wages Guaranteed</span>
            </span>
            <span className="text-border">•</span>
            <span>Direct Maker Contact</span>
          </div>
        </Container>
      </section>

      {/* 2. MARKETPLACE CATALOG VIEW */}
      <Section spacing="lg" className="bg-white">
        <Container size="lg">
          <MarketplaceView
            initialProducts={products}
            categories={categories}
          />
        </Container>
      </Section>

      {/* 3. SELLER ONBOARDING CTA */}
      <CTASection
        badge="Are You an Artisan or Maker?"
        title="Showcase Your Handcrafted Creations on BDSisters"
        description="Join our curated guild to reach thousands of conscious buyers in Bangladesh and across the global diaspora. 100% of purchase proceeds go directly to you."
        primaryAction={{
          label: "Apply as a Sister Seller",
          href: "/register",
        }}
        secondaryAction={{
          label: "View Marketplace Guidelines",
          href: "/community",
        }}
      />
    </div>
  );
}
