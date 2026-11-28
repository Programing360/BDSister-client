"use client";

import React, { useState, useEffect } from "react";
import {
    ShieldCheck,
    ShoppingBag,
    Users,
    Sparkles,
    ArrowRight,
    Lock,
    FileCheck,
    CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

import { SECTION_EXPLAINERS } from "@/data/mockData";

import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ScrollReveal } from "@/components/common/MotionComponents";
import { SectionHoverInfo } from "@/components/common/SectionHoverInfo";
import Link from "next/link";

export function HeroSection() {
    const [heroData, setHeroData] = useState<{
        title?: string;
        subtitle?: string;
        content?: string;
        ctaText?: string;
        ctaLink?: string;
    } | null>(null);

    const [heroExplainer, setHeroExplainer] = useState(SECTION_EXPLAINERS.hero);
    const [showcaseSister, setShowcaseSister] = useState<{
        name: string;
        initials: string;
        bio: string;
        location: string;
        skills: string;
        brands: string[];
    }>({
        name: "Dr. Samira Ahmed",
        initials: "S.A.",
        bio: "Physician • Natural Wellness Artisan • CoP Member",
        location: "Dhaka, Bangladesh",
        skills: "Herbal Formulation & Naturopathy",
        brands: ["🌿 PureTadabbur Botanicals", "📖 Fitrah Wellness Consulting"],
    });

    useEffect(() => {
        async function fetchHero() {
            try {
                const res = await apiClient.get<any>(API_ENDPOINTS.cms.blocks);
                const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
                const hero = list.find((b: any) => b.sectionKey === "hero" || b.blockType === "hero");
                if (hero) {
                    setHeroData({
                        title: hero.title,
                        subtitle: hero.subtitle,
                        content: hero.content,
                        ctaText: hero.ctaText,
                        ctaLink: hero.ctaLink,
                    });
                }

                const explainerBlock = list.find(
                    (b: any) => b.sectionKey === "sectionExplainers" && (b.title === "hero" || b.blockType === "explainer")
                );
                if (explainerBlock) {
                    setHeroExplainer({
                        title: explainerBlock.subtitle || "About BDSisters.org Platform",
                        description: explainerBlock.content || hero?.content || "",
                        howItWorks: explainerBlock.metadata?.howItWorks || SECTION_EXPLAINERS.hero.howItWorks,
                        islamicOrSisterhoodNote: explainerBlock.metadata?.islamicOrSisterhoodNote || SECTION_EXPLAINERS.hero.islamicOrSisterhoodNote,
                    });
                }
            } catch (err) {
                // Fall back gracefully to static defaults
            }
        }

        async function fetchSisterShowcase() {
            try {
                const res = await apiClient.get<any>(API_ENDPOINTS.users.list);
                const users = Array.isArray(res?.data)
                    ? res.data
                    : Array.isArray(res)
                        ? res
                        : [];
                if (users.length > 0) {
                    const firstUser = users.find((u: any) => u.fullName) || users[0];
                    if (firstUser) {
                        const nameParts = (firstUser.fullName || "Sister Member").trim().split(" ");
                        const initials = nameParts.length >= 2
                            ? `${nameParts[0][0]}.${nameParts[nameParts.length - 1][0]}.`
                            : `${nameParts[0][0]}.`;
                        const district = firstUser.location?.district || "Dhaka";
                        const country = firstUser.location?.country || "Bangladesh";
                        const topSkill = firstUser.vocationalSkills?.[0]?.skill || "Islamic Humanities & Mentorship";

                        setShowcaseSister({
                            name: firstUser.fullName || "Sister Member",
                            initials: initials.toUpperCase(),
                            bio: firstUser.bio || "Verified Sisterhood Member • Muhsina Organization",
                            location: `${district}, ${country}`,
                            skills: topSkill,
                            brands: ["🌿 BDSisters Verified Member", "📖 Halal Sisterhood Network"],
                        });
                    }
                }
            } catch (err) {
                // Keep default verified preview
            }
        }

        fetchHero();
        fetchSisterShowcase();
    }, []);
    return (
        <section
            id="hero"
            aria-labelledby="hero-title"
            className="relative overflow-hidden bg-gradient-to-r from-[#356a66] via-[#669995] to-[#be6913] pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#F7DFC7]"
        >
            {/* Decorative Background Glows with gentle breathing animation */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.12, 0.2, 0.12],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#D98408]/20 blur-3xl pointer-events-none"
            />


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section Hover Explainer Button */}
                <ScrollReveal direction="down" duration={0.5}>
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7DFC7] text-[#111E28] text-xs font-bold tracking-wide border border-[#F7DFC7] shadow-2xs">
                            <Sparkles className="w-3.5 h-3.5 text-[#5B9891]" />
                            <span>Unified Database of Muhsina Organization</span>
                        </div>

                        <SectionHoverInfo
                            explainer={heroExplainer}
                            sectionName="Hero Section"
                        />
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Column: Heading, Subhead, Highlights, CTAs */}
                    <div className="lg:col-span-7 space-y-6">
                        <ScrollReveal direction="up" delay={0.1}>
                            <div className="space-y-3">
                                <span className="text-xs font-bold uppercase tracking-widest text-[#111E28] bg-[#F7DFC7] px-3.5 py-1.5 rounded-full border border-[#F7DFC7] inline-block shadow-2xs">
                                    A Collaborative Sisterhood Ecosystem
                                </span>
                                <h1
                                    id="hero-title"
                                    className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111E28] leading-[1.18] tracking-tight"
                                >
                                    {heroData?.title ? (
                                        <span>{heroData.title}</span>
                                    ) : (
                                        <>
                                            Commerce + Community <br />
                                            <span className="text-[#5B9891]">
                                                Exclusively for Sisters
                                            </span>
                                        </>
                                    )}
                                </h1>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="up" delay={0.2}>
                            <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl font-normal">
                                {heroData?.content ||
                                    heroData?.subtitle ||
                                    "A dignified, member-based online haven connecting verified personal profiles, women-owned halal businesses, safe discussion forums, and skill exchange—anchored under the unified umbrella of Muhsina Organization."}
                            </p>
                        </ScrollReveal>

                        {/* Core Verification Badges (Referral + NID Vetting) */}
                        <ScrollReveal direction="up" delay={0.3}>
                            <div className="p-5 rounded-2xl bg-white border-2 border-[#F7DFC7] shadow-sm space-y-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-[#111E28] uppercase tracking-wider">
                                    <ShieldCheck className="w-4 h-4 text-[#5B9891]" />
                                    <span>Our Sacred Trust & Vetting Guarantee</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-stone-700">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#5B9891] flex-shrink-0 mt-0.5" />
                                        <span>
                                            <strong className="text-[#111E28]">Referral Mandatory:</strong> Existing member must know you in person.
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#5B9891] flex-shrink-0 mt-0.5" />
                                        <span>
                                            <strong className="text-[#111E28]">NID/Passport Verified:</strong> Reviewed privately by female admins only.
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#5B9891] flex-shrink-0 mt-0.5" />
                                        <span>
                                            <strong className="text-[#111E28]">Free Personal Profile:</strong> Create & publish your profile for free.
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#5B9891] flex-shrink-0 mt-0.5" />
                                        <span>
                                            <strong className="text-[#111E28]">Field-Level Privacy:</strong> Phone & WhatsApp hidden by default.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Call to Actions */}
                        <ScrollReveal direction="up" delay={0.4}>
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <Link href={'/register'}>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}

                                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#D98408] hover:bg-[#B86E04] text-white font-bold text-sm shadow-md shadow-gray-600 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#5B9891] border border-[#F2B55D]"
                                    >
                                        <span>{heroData?.ctaText || "Join as a Sister (Referral Required)"}</span>
                                        <ArrowRight className="w-4 h-4 text-[#D98408]" />
                                    </motion.button>
                                </Link>

                                <Link href={'/shops'}>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}

                                        className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#5B9891] hover:bg-[#477C76] text-white font-bold text-sm shadow-md shadow-gray-600 border border-[#5B9891] transition-all focus:outline-none focus:ring-2 focus:ring-[#5B9891]"
                                    >
                                        <ShoppingBag className="w-4 h-4 text-[#F7DFC7]" />
                                        <span>Shop Halal Goods & Services</span>
                                    </motion.button>
                                </Link>

                                {/* <a
                                    href="#forums"
                                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-full text-[#111E28] hover:text-[#030706] font-bold text-xs transition-colors"
                                >
                                    <Users className="w-4 h-4 text-[#5B9891]" />
                                    <span>Preview Forums</span>
                                </a> */}
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Right Column: Visual Showcase Card */}
                    <div className="lg:col-span-5">
                        <ScrollReveal direction="left" delay={0.25} distance={40}>
                            <motion.div
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.3 }}
                                className="relative mx-auto max-w-md rounded-2xl bg-white p-6 shadow-xl border-2 border-[#F7DFC7]"
                            >
                                {/* Top Card Badge */}
                                <div className="flex items-center justify-between pb-4 border-b border-[#F7DFC7]">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-[#5B9891] animate-pulse" />
                                        <span className="text-xs font-bold text-[#111E28]">
                                            Unified Profile Preview
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F7DFC7] text-[#111E28] border border-[#F7DFC7]">
                                        Status: Approved & Verified
                                    </span>
                                </div>

                                {/* Sample Sister Profile Card */}
                                <div className="mt-5 space-y-4">
                                    <div className="flex items-start gap-4">
                                        {/* Square Profile Picture */}
                                        <div className="w-20 h-20 rounded-2xl bg-[#5B9891] text-[#F7DFC7] border-2 border-[#D98408] flex items-center justify-center flex-shrink-0 shadow-inner font-serif text-2xl font-bold">
                                            {showcaseSister.initials}
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-base font-bold text-[#111E28] leading-tight">
                                                {showcaseSister.name}
                                            </h3>
                                            <p className="text-xs text-stone-600 font-medium line-clamp-1">
                                                {showcaseSister.bio}
                                            </p>
                                            <p className="text-xs text-[#5B9891] font-bold">
                                                📍 {showcaseSister.location} (District Level Only)
                                            </p>
                                        </div>
                                    </div>

                                    {/* Privacy Indicators */}
                                    <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#F7DFC7] space-y-2 text-xs">
                                        <div className="flex items-center justify-between text-stone-700">
                                            <span className="flex items-center gap-1.5 font-medium">
                                                <Lock className="w-3.5 h-3.5 text-stone-400" />
                                                <span>Phone & WhatsApp</span>
                                            </span>
                                            <span className="text-[11px] font-bold text-stone-700 bg-white px-2.5 py-0.5 rounded border border-[#F7DFC7]">
                                                Private (Protected)
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-stone-700">
                                            <span className="flex items-center gap-1.5 font-medium">
                                                <FileCheck className="w-3.5 h-3.5 text-[#5B9891]" />
                                                <span>ID Verification (NID)</span>
                                            </span>
                                            <span className="text-[11px] font-bold text-[#111E28] bg-[#F7DFC7] px-2.5 py-0.5 rounded border border-[#F7DFC7]">
                                                Admin Verified
                                            </span>
                                        </div>
                                    </div>

                                    {/* Connected Brands */}
                                    <div className="pt-1">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#111E28] block mb-1.5">
                                            Registered Sister Brands ({showcaseSister.brands.length})
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {showcaseSister.brands.map((b, i) => (
                                                <span key={i} className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#F7DFC7] text-xs font-bold text-[#111E28]">
                                                    {b}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sample Vocational Skill Bar */}
                                    <div className="space-y-1.5 pt-1">
                                        <div className="flex justify-between text-xs font-semibold text-[#111E28]">
                                            <span>{showcaseSister.skills}</span>
                                            <span className="text-[#5B9891] font-bold">Level 5 / Master</span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-[#FAF8F5] border border-[#F7DFC7] overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: "90%" }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                                                className="h-full bg-[#5B9891] rounded-full"
                                            />
                                        </div>
                                    </div>

                                    {/* Unified Wings Cross-link pill */}
                                    <div className="pt-2 text-center">
                                        <span className="text-[11px] text-[#5B9891] font-medium italic">
                                            🔗 Unified with CoP & The Hut Network Profiles
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </section>
    );
}