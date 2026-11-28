import React from "react";
import type { Metadata } from "next";
import { HeroSection } from "@/features/public/home/components/HeroSection";
import { UnifiedWingsSection } from "@/features/public/home/components/UnifiedWingsSection";
import { KeyAreasGrid } from "@/features/public/home/components/KeyAreasGrid";
import { ShopShowcase } from "@/features/public/home/components/ShopShowcase";
import { ForumTeaser } from "@/features/public/home/components/ForumTeaser";
import { ProfileEngineSection } from "@/features/public/home/components/ProfileEngineSection";
import { EventsPreview } from "@/features/public/home/components/EventsPreview";
import { ResourceLibraryPreview } from "@/features/public/home/components/ResourceLibraryPreview";
import { AboutValuesSection } from "@/features/public/home/components/AboutValuesSection";
import { NewsletterSection } from "@/features/public/home/components/NewsletterSection";

export const metadata: Metadata = {
  title: "BDSisters.org — Verified Bangladeshi Muslim Sisterhood",
  description:
    "A verified, women-only sanctuary empowering Bangladeshi Muslim women through faith, skill-building, ethical business directories, and supportive community.",
};

export default function HomePage() {
  return <div className="flex flex-col">
    {/* 1. Hero Section */}
    <HeroSection />

    {/* 2. Importance of Unified Database & Sister Wings */}
    <UnifiedWingsSection />

    {/* 3. The 8 Key Areas of BDSisters */}
    <KeyAreasGrid />

    {/* 4. Halal E-Commerce (Shop with Us) */}
    <ShopShowcase />

    {/* 5. Safe Discussion Forums (Connect & Converse) */}
    <ForumTeaser />

    {/* 6. Discover Yourself: Sister Profile Engine & Growth Wheel */}
    <ProfileEngineSection />

    {/* 7. Events & Workshops Calendar */}
    <EventsPreview />

    {/* 8. Curated Resource Library */}
    <ResourceLibraryPreview />

    {/* 9. Who We Are: Mission & Sisterhood Principles */}
    <AboutValuesSection />

    {/* 10. Get in Touch & Sisterhood Channels */}
    <NewsletterSection />
  </div>
}