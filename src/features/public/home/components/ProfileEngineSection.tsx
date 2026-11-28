"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
    UserCheck,
    Lock,
    Unlock,
    Download,
    ShieldCheck,
    CheckCircle2,
    Briefcase,
    ExternalLink,
    SlidersHorizontal,
    Compass,
    Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { SECTION_EXPLAINERS } from "@/data/mockData";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/common/MotionComponents";
import { SectionHoverInfo } from "@/components/common/SectionHoverInfo";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface DemoSkill {
    name: string;
    level: string;
    percent: string;
    category: "vocational" | "digital" | "islamic";
}

export function ProfileEngineSection() {
    const { isAuthenticated } = useAuth();
    const [showPhone, setShowPhone] = useState(false);
    const [showWhatsApp, setShowWhatsApp] = useState(false);
    const [activeTab, setActiveTab] = useState<"overview" | "skills" | "frameworks">(
        "overview"
    );
    const [selectedSkillDomain, setSelectedSkillDomain] = useState<string>("all");

    const [profileExplainer, setProfileExplainer] = useState(SECTION_EXPLAINERS.profileEngine);
    const [demoSister, setDemoSister] = useState<{
        fullName: string;
        initials: string;
        roles: string;
        locationText: string;
        quote: string;
        skills: DemoSkill[];
        brandName: string;
        brandRole: string;
    }>({
        fullName: "Rayhana Al-Muhsina",
        initials: "R.A.",
        roles: "Instructional Designer • Artisan Perfumer • Homeschool Educator",
        locationText: "Chittagong, Bangladesh",
        quote: "Dedicated to facilitating wholesome halal living and Islamic holistic development for children and young sisters.",
        skills: [
            {
                name: "Handmade Soap & Cold-Process Formulation",
                level: "Expert (95%)",
                percent: "95%",
                category: "vocational",
            },
            {
                name: "Artisan Perfumery & Natural Attar Blending",
                level: "Advanced (90%)",
                percent: "90%",
                category: "vocational",
            },
            {
                name: "Figma & UI Layout Design",
                level: "Intermediate (70%)",
                percent: "70%",
                category: "digital",
            },
            {
                name: "Instructional Curriculum Architecture",
                level: "Advanced (85%)",
                percent: "85%",
                category: "digital",
            },
            {
                name: "Arabic Grammar & Classical Translation",
                level: "Advanced (85%)",
                percent: "85%",
                category: "islamic",
            },
            {
                name: "Tajweed & Quranic Phonetics",
                level: "Advanced (90%)",
                percent: "90%",
                category: "islamic",
            },
        ],
        brandName: "Ittar & Essence Atelier",
        brandRole: "Founder & Master Blender (Custom Role)",
    });

    useEffect(() => {
        async function fetchProfileEngineData() {
            try {
                const res = await apiClient.get<any>(API_ENDPOINTS.cms.blocks);
                const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
                const explainerBlock = list.find(
                    (b: any) => b.sectionKey === "sectionExplainers" && (b.title === "profileEngine" || b.title === "profiles")
                );
                if (explainerBlock) {
                    setProfileExplainer({
                        title: explainerBlock.subtitle || "Sister Profile Builder & Development Wheel",
                        description: explainerBlock.content || "",
                        howItWorks: explainerBlock.metadata?.howItWorks || SECTION_EXPLAINERS.profileEngine.howItWorks,
                    });
                }
            } catch (err) {
                // Keep default explainer
            }
        }

        async function fetchSisterData() {
            try {
                const res = await apiClient.get<any>(API_ENDPOINTS.users.list);
                const users = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
                if (users.length > 0) {
                    const sister = users.find((u: any) => u.fullName && u.status === "Active") || users[0];
                    if (sister) {
                        const nameParts = (sister.fullName || "Sister").trim().split(" ");
                        const initials = nameParts.length >= 2
                            ? `${nameParts[0][0]}.${nameParts[nameParts.length - 1][0]}.`
                            : `${nameParts[0][0]}.`;
                        const district = sister.location?.district || "Dhaka";
                        const country = sister.location?.country || "Bangladesh";

                        if (Array.isArray(sister.vocationalSkills) && sister.vocationalSkills.length > 0) {
                            const dynamicSkills: DemoSkill[] = sister.vocationalSkills.slice(0, 6).map((s: any, idx: number) => {
                                const level = s.level || "Proficient";
                                const percent = level === "Expert" ? "95%" : level === "Advanced" ? "85%" : "70%";
                                const cat: "vocational" | "digital" | "islamic" =
                                    idx % 3 === 0 ? "vocational" : idx % 3 === 1 ? "digital" : "islamic";
                                return {
                                    name: s.skill || `Core Competency ${idx + 1}`,
                                    level: `${level} (${percent})`,
                                    percent,
                                    category: cat,
                                };
                            });

                            setDemoSister((prev) => ({
                                ...prev,
                                fullName: sister.fullName,
                                initials: initials.toUpperCase(),
                                roles: sister.bio || prev.roles,
                                locationText: `${district}, ${country}`,
                                quote: sister.bio || prev.quote,
                                skills: dynamicSkills,
                            }));
                        } else {
                            setDemoSister((prev) => ({
                                ...prev,
                                fullName: sister.fullName,
                                initials: initials.toUpperCase(),
                                roles: sister.bio || prev.roles,
                                locationText: `${district}, ${country}`,
                                quote: sister.bio || prev.quote,
                            }));
                        }
                    }
                }
            } catch (err) {
                // Fall back gracefully to demo defaults
            }
        }

        fetchProfileEngineData();
        fetchSisterData();
    }, []);

    // Filter skill bars by selected category dropdown
    const displayedSkills = useMemo(() => {
        if (selectedSkillDomain === "all") return demoSister.skills;
        return demoSister.skills.filter((s) => s.category === selectedSkillDomain);
    }, [demoSister.skills, selectedSkillDomain]);

    // Handle clean client-side print & PDF export of profile summary
    const handleDownloadPdf = () => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) {
            window.print();
            return;
        }

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="utf-8" />
                <title>BDSisters Member Portfolio — ${demoSister.fullName}</title>
                <style>
                  @page { size: A4; margin: 18mm; }
                  body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    color: #111E28;
                    line-height: 1.5;
                    margin: 0;
                    padding: 0;
                  }
                  .container { max-width: 800px; margin: 0 auto; }
                  .header {
                    border-bottom: 2px solid #5B9891;
                    padding-bottom: 16px;
                    margin-bottom: 22px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                  }
                  .initials-box {
                    width: 56px;
                    height: 56px;
                    border-radius: 12px;
                    background: #5B9891;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    font-weight: bold;
                    margin-right: 16px;
                  }
                  .header-left { display: flex; align-items: center; }
                  .badge {
                    display: inline-block;
                    background: #F7DFC7;
                    color: #111E28;
                    padding: 4px 12px;
                    border-radius: 9999px;
                    font-size: 11px;
                    font-weight: bold;
                  }
                  h1 { margin: 0 0 4px 0; font-size: 22px; color: #111E28; }
                  .roles { color: #555; font-size: 13px; margin-bottom: 4px; font-weight: 500; }
                  .location { color: #5B9891; font-size: 12px; font-weight: 600; }
                  .section { margin-bottom: 20px; }
                  .section-title {
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    color: #5B9891;
                    font-weight: bold;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 6px;
                    margin-bottom: 10px;
                  }
                  .quote-box {
                    background: #FAF8F5;
                    border-left: 3px solid #5B9891;
                    padding: 10px 14px;
                    font-style: italic;
                    font-size: 12px;
                    color: #333;
                    border-radius: 0 8px 8px 0;
                  }
                  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12px; }
                  .contact-card {
                    background: #f9f9f9;
                    border: 1px solid #eaeaea;
                    padding: 10px 12px;
                    border-radius: 8px;
                  }
                  .skill-item { margin-bottom: 8px; }
                  .skill-header { display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; margin-bottom: 3px; }
                  .skill-bar { height: 7px; background: #eee; border-radius: 4px; overflow: hidden; }
                  .skill-fill { height: 100%; background: #5B9891; border-radius: 4px; }
                  .brand-card {
                    background: #FAF8F5;
                    border: 1px solid #F7DFC7;
                    padding: 12px 14px;
                    border-radius: 8px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  }
                  .footer {
                    margin-top: 26px;
                    padding-top: 14px;
                    border-top: 1px dashed #ccc;
                    font-size: 10px;
                    color: #777;
                    display: flex;
                    justify-content: space-between;
                  }
                  @media print {
                    button { display: none; }
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <div class="header-left">
                      <div class="initials-box">${demoSister.initials}</div>
                      <div>
                        <h1>${demoSister.fullName}</h1>
                        <div class="roles">${demoSister.roles}</div>
                        <div class="location">📍 ${demoSister.locationText}</div>
                      </div>
                    </div>
                    <div>
                      <span class="badge">Verified Sister Member</span>
                    </div>
                  </div>

                  <div class="section">
                    <div class="section-title">Sisterhood Statement & Focus</div>
                    <div class="quote-box">&ldquo;${demoSister.quote}&rdquo;</div>
                  </div>

                  <div class="section">
                    <div class="section-title">Contact & Privacy Protection (Field-Level Privacy Sovereignty)</div>
                    <div class="contact-grid">
                      <div class="contact-card">
                        <strong>Phone Number:</strong><br />
                        <span>${showPhone ? "+880 1711-XXXXXX (Public Display Enabled)" : "•••••••••••• (Protected • Field-Level Privacy)"}</span>
                      </div>
                      <div class="contact-card">
                        <strong>WhatsApp:</strong><br />
                        <span>${showWhatsApp ? "+880 1819-XXXXXX (Public Display Enabled)" : "•••••••••••• (Protected • Field-Level Privacy)"}</span>
                      </div>
                    </div>
                  </div>

                  <div class="section">
                    <div class="section-title">Vocational & Technical Competencies</div>
                    ${demoSister.skills.map((s) => `
                      <div class="skill-item">
                        <div class="skill-header">
                          <span>${s.name}</span>
                          <span style="color: #5B9891;">${s.level}</span>
                        </div>
                        <div class="skill-bar">
                          <div class="skill-fill" style="width: ${s.percent};"></div>
                        </div>
                      </div>
                    `).join("")}
                  </div>

                  <div class="section">
                    <div class="section-title">Registered Brand & Sisterhood Enterprise</div>
                    <div class="brand-card">
                      <div>
                        <strong style="font-size: 13px;">${demoSister.brandName}</strong>
                        <div style="font-size: 12px; color: #555; margin-top: 2px;">Role: ${demoSister.brandRole}</div>
                      </div>
                      <span class="badge" style="background: #e6f3f1; color: #5B9891;">Linked with BDSisters Shop</span>
                    </div>
                  </div>

                  <div class="footer">
                    <span>BDSisters.org Profile Engine • Sovereign Islamic Sisterhood Directory</span>
                    <span>Government NID/Passports strictly protected in female admin vault</span>
                  </div>
                </div>
                <script>
                  window.onload = function() {
                    setTimeout(function() {
                      window.print();
                    }, 300);
                  };
                </script>
              </body>
            </html>
        `;
        printWindow.document.write(htmlContent);
        printWindow.document.close();
    };

    return (
        <section
            id="profiles"
            aria-labelledby="profiles-heading"
            className="py-16 bg-white border-b border-[#F7DFC7] overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <ScrollReveal direction="up">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#F7DFC7]/60">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="p-1.5 rounded-lg bg-[#F7DFC7] text-[#111E28] border border-[#F7DFC7]">
                                    <UserCheck className="w-4 h-4 text-[#5B9891]" />
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wider text-[#111E28]">
                                    Identity & Self Discovery
                                </span>
                            </div>
                            <h2
                                id="profiles-heading"
                                className="font-serif text-2xl sm:text-3xl font-bold text-[#111E28] tracking-tight"
                            >
                                Discover Yourself: The Sister Profile Engine
                            </h2>
                            <p className="mt-2 text-sm sm:text-base text-stone-700 max-w-2xl">
                                Build your verified portfolio, vocational skill bars, and spiritual development roadmap
                                with full field-level privacy sovereignty.
                            </p>
                        </div>

                        <div className="flex-shrink-0">
                            <SectionHoverInfo
                                explainer={profileExplainer}
                                sectionName="Profile Engine"
                            />
                        </div>
                    </div>
                </ScrollReveal>

                {/* NID / Identity Security Disclaimer */}
                <ScrollReveal direction="up" delay={0.1}>
                    <div className="mb-8 p-4 rounded-2xl bg-[#F7DFC7] border border-[#F7DFC7] flex items-start gap-3 text-xs text-[#111E28] shadow-xs">
                        <ShieldCheck className="w-5 h-5 text-[#5B9891] flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <span className="font-bold uppercase tracking-wide text-[#111E28]">
                                Mandatory KYC & Identity Privacy Disclaimer:
                            </span>
                            <p className="text-stone-700 leading-relaxed">
                                Registration requires uploading your NID and/or Passport for safe community verification.
                                <strong> Disclaimer:</strong> Only vetted female system administrators have access to your
                                identity documents. No other member or guest can ever view your government IDs.
                            </p>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Interactive Profile Architecture Demonstration */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Interactive Simulation Card */}
                    <div className="lg:col-span-7">
                        <ScrollReveal direction="right" delay={0.15}>
                            <div className="bg-[#FAF8F5] rounded-2xl border-2 border-[#F7DFC7] p-6 sm:p-8 shadow-md space-y-6">
                                {/* Top Bar with Status and PDF Download */}
                                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#F7DFC7]">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-[#5B9891] animate-pulse" />
                                        <span className="text-xs font-bold text-[#111E28] uppercase tracking-wide">
                                            Interactive Profile Builder Demo
                                        </span>
                                    </div>

                                    {/* Profile Download (PDF) Feature */}
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        type="button"
                                        onClick={handleDownloadPdf}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#5B9891] text-white hover:bg-[#477C76] text-xs font-bold transition-colors shadow-2xs border border-[#F2B55D] cursor-pointer"
                                        title="Print or export formatted PDF of this profile"
                                    >
                                        <Download className="w-3.5 h-3.5 text-[#F7DFC7]" />
                                        <span>Download Profile (PDF)</span>
                                    </motion.button>
                                </div>

                                {/* Core Member Profile Elements Showcase */}
                                <div className="flex flex-col sm:flex-row items-start gap-5">
                                    {/* Big Square Profile Picture */}
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-[#5B9891] text-[#F7DFC7] font-serif text-3xl font-bold flex flex-col items-center justify-center flex-shrink-0 shadow-md border-2 border-[#D98408] relative cursor-pointer"
                                    >
                                        <span>{demoSister.initials}</span>
                                        <span className="text-[10px] uppercase font-sans tracking-widest text-[#F7DFC7]/80 mt-1">
                                            Big Square
                                        </span>
                                        <span className="absolute -bottom-2 -right-2 p-1.5 bg-[#5B9891] rounded-full text-white ring-2 ring-white">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                        </span>
                                    </motion.div>

                                    {/* Basic Bio & Location */}
                                    <div className="space-y-2 flex-grow">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-serif text-xl font-bold text-[#111E28]">
                                                {demoSister.fullName}
                                            </h3>
                                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F7DFC7] text-[#111E28] border border-[#F7DFC7]">
                                                Referred & Approved
                                            </span>
                                        </div>
                                        <p className="text-xs text-stone-600 font-medium">
                                            {demoSister.roles}
                                        </p>
                                        <p className="text-xs text-[#5B9891] font-semibold">
                                            📍 {demoSister.locationText}{" "}
                                            <span className="text-stone-500 font-normal">
                                                (District & Country Only • No Exact Address)
                                            </span>
                                        </p>
                                        <p className="text-xs text-stone-700 leading-relaxed pt-1">
                                            &ldquo;{demoSister.quote}&rdquo;
                                        </p>
                                    </div>
                                </div>

                                {/* Field-Level Privacy Simulation (Default Private) with Smooth Toggles */}
                                <div className="p-4 rounded-xl bg-white border border-[#F7DFC7] space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-[#111E28] uppercase tracking-wide">
                                            Contact Information (Field-Level Privacy)
                                        </span>
                                        <span className="text-[11px] text-stone-500 italic">
                                            *Default setting is always private unless checked
                                        </span>
                                    </div>

                                    {/* Phone Toggle */}
                                    <div
                                        onClick={() => setShowPhone(!showPhone)}
                                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] border border-[#F7DFC7] text-xs cursor-pointer hover:border-[#5B9891] transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {showPhone ? (
                                                <Unlock className="w-4 h-4 text-[#5B9891]" />
                                            ) : (
                                                <Lock className="w-4 h-4 text-stone-400" />
                                            )}
                                            <span className="font-bold text-[#111E28]">Phone Number:</span>
                                            <span className="font-mono text-stone-700 font-medium">
                                                {showPhone ? "+880 1711-XXXXXX" : "•••••••••••• (Hidden)"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                id="phone-privacy-toggle"
                                                checked={showPhone}
                                                onChange={(e) => setShowPhone(e.target.checked)}
                                                className="rounded text-[#5B9891] focus:ring-[#5B9891] w-4 h-4 accent-[#5B9891] cursor-pointer"
                                            />
                                            <label
                                                htmlFor="phone-privacy-toggle"
                                                className={`text-[11px] font-bold cursor-pointer ${
                                                    showPhone ? "text-[#5B9891]" : "text-[#111E28]"
                                                }`}
                                            >
                                                {showPhone ? "Public" : "Make Public"}
                                            </label>
                                        </div>
                                    </div>

                                    {/* WhatsApp Toggle */}
                                    <div
                                        onClick={() => setShowWhatsApp(!showWhatsApp)}
                                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] border border-[#F7DFC7] text-xs cursor-pointer hover:border-[#5B9891] transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {showWhatsApp ? (
                                                <Unlock className="w-4 h-4 text-[#5B9891]" />
                                            ) : (
                                                <Lock className="w-4 h-4 text-stone-400" />
                                            )}
                                            <span className="font-bold text-[#111E28]">WhatsApp:</span>
                                            <span className="font-mono text-stone-700 font-medium">
                                                {showWhatsApp ? "+880 1819-XXXXXX" : "•••••••••••• (Hidden)"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                id="whatsapp-privacy-toggle"
                                                checked={showWhatsApp}
                                                onChange={(e) => setShowWhatsApp(e.target.checked)}
                                                className="rounded text-[#5B9891] focus:ring-[#5B9891] w-4 h-4 accent-[#5B9891] cursor-pointer"
                                            />
                                            <label
                                                htmlFor="whatsapp-privacy-toggle"
                                                className={`text-[11px] font-bold cursor-pointer ${
                                                    showWhatsApp ? "text-[#5B9891]" : "text-[#111E28]"
                                                }`}
                                            >
                                                {showWhatsApp ? "Public" : "Make Public"}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabbed Profile Sections with Animated Content */}
                                <div className="space-y-4">
                                    <div className="flex border-b border-[#F7DFC7] text-xs font-bold overflow-x-auto">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab("overview")}
                                            className={`py-2 px-4 border-b-2 transition-all whitespace-nowrap ${
                                                activeTab === "overview"
                                                    ? "border-[#5B9891] text-[#111E28]"
                                                    : "border-transparent text-stone-500 hover:text-[#111E28]"
                                            }`}
                                        >
                                            My Business Brands & Shop
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab("skills")}
                                            className={`py-2 px-4 border-b-2 transition-all whitespace-nowrap ${
                                                activeTab === "skills"
                                                    ? "border-[#5B9891] text-[#111E28]"
                                                    : "border-transparent text-stone-500 hover:text-[#111E28]"
                                            }`}
                                        >
                                            Skill Bars & Dropdowns
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab("frameworks")}
                                            className={`py-2 px-4 border-b-2 transition-all whitespace-nowrap ${
                                                activeTab === "frameworks"
                                                    ? "border-[#5B9891] text-[#111E28]"
                                                    : "border-transparent text-stone-500 hover:text-[#111E28]"
                                            }`}
                                        >
                                            Private Growth Frameworks
                                        </button>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {/* Tab 1: Business Brands */}
                                        {activeTab === "overview" && (
                                            <motion.div
                                                key="overview"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.25 }}
                                                className="p-4 rounded-xl bg-white border border-[#F7DFC7] space-y-3"
                                            >
                                                <div className="flex items-center justify-between text-xs font-bold text-[#111E28]">
                                                    <span className="flex items-center gap-1.5">
                                                        <Briefcase className="w-4 h-4 text-[#5B9891]" />
                                                        <span>Sister&apos;s Registered Brands (Auto-synced)</span>
                                                    </span>
                                                    <Link
                                                        href="/businesses"
                                                        className="text-[#5B9891] hover:underline font-bold inline-flex items-center gap-1"
                                                    >
                                                        <span>Explore Directory</span>
                                                        <ExternalLink className="w-3 h-3" />
                                                    </Link>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#F7DFC7] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                                                        <div>
                                                            <span className="font-bold text-[#111E28] block text-sm">
                                                                {demoSister.brandName}
                                                            </span>
                                                            <span className="text-stone-600">
                                                                Role: {demoSister.brandRole}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-2.5 py-0.5 rounded-full bg-[#F7DFC7] text-[#111E28] text-[10px] font-bold border border-[#F7DFC7]">
                                                                Published (Verified)
                                                            </span>
                                                            <Link
                                                                href="/shops"
                                                                className="px-2.5 py-1 rounded-full bg-[#5B9891] text-white text-[10px] font-bold hover:bg-[#477C76] transition-colors"
                                                            >
                                                                View Products ↗
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Tab 2: Skill Bars with Dropdown Selector */}
                                        {activeTab === "skills" && (
                                            <motion.div
                                                key="skills"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.25 }}
                                                className="p-4 rounded-xl bg-white border border-[#F7DFC7] space-y-3"
                                            >
                                                {/* Category Dropdown Filter */}
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-[#F7DFC7]/60">
                                                    <span className="text-xs font-bold text-[#111E28] flex items-center gap-1.5">
                                                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#5B9891]" />
                                                        <span>Vocational & Technical Skill Bars</span>
                                                    </span>
                                                    <div className="flex items-center gap-1.5">
                                                        <label htmlFor="skill-domain-filter" className="text-[11px] text-stone-500 font-medium">
                                                            Filter Domain:
                                                        </label>
                                                        <select
                                                            id="skill-domain-filter"
                                                            value={selectedSkillDomain}
                                                            onChange={(e) => setSelectedSkillDomain(e.target.value)}
                                                            className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-[#F7DFC7] bg-[#FAF8F5] text-[#111E28] focus:outline-none focus:ring-1 focus:ring-[#5B9891] cursor-pointer"
                                                        >
                                                            <option value="all">All Domains ({demoSister.skills.length} Competencies)</option>
                                                            <option value="vocational">Vocational & Artisan</option>
                                                            <option value="digital">Digital & Instructional Design</option>
                                                            <option value="islamic">Islamic Sciences & Language</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Animated Bars */}
                                                <div className="space-y-3 text-xs pt-1">
                                                    {displayedSkills.map((skill, sIdx) => (
                                                        <div key={sIdx}>
                                                            <div className="flex justify-between mb-1 font-semibold">
                                                                <span className="text-[#111E28]">
                                                                    {skill.name}
                                                                </span>
                                                                <span className="text-[#5B9891] font-bold">{skill.level}</span>
                                                            </div>
                                                            <div className="w-full h-2 rounded-full bg-[#FAF8F5] border border-[#F7DFC7] overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: skill.percent }}
                                                                    transition={{ duration: 0.8, delay: sIdx * 0.08, ease: "easeOut" }}
                                                                    className={`h-full rounded-full ${
                                                                        skill.category === "vocational"
                                                                            ? "bg-[#5B9891]"
                                                                            : skill.category === "digital"
                                                                            ? "bg-[#D98408]"
                                                                            : "bg-[#2A6B62]"
                                                                    }`}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Tab 3: Always Private Frameworks */}
                                        {activeTab === "frameworks" && (
                                            <motion.div
                                                key="frameworks"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.25 }}
                                                className="p-5 rounded-2xl bg-[#5B9891] text-white space-y-3 border-2 border-[#477C76] shadow-xl"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                                                        <Lock className="w-3.5 h-3.5 text-[#F2B55D]" />
                                                        <span>Private-Always Frameworks</span>
                                                    </span>
                                                    <span className="px-3 py-1 rounded-full bg-[#F2B55D] text-[#111E28] text-[10px] font-bold">
                                                        100% Locked from Public
                                                    </span>
                                                </div>
                                                <p className="text-xs text-[#F7DFC7] leading-relaxed">
                                                    Neither guests nor other members can ever view these personal self-development tools:
                                                </p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                                                    <div className="p-3.5 rounded-xl bg-white/15 border border-white/25 space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-bold text-white block">3. My 80/20 Chart</span>
                                                            <span className="text-[10px] text-[#F2B55D] font-bold">Active</span>
                                                        </div>
                                                        <p className="text-[11px] text-[#F7DFC7] leading-relaxed">
                                                            Deep work, high-impact tasks, and spiritual efficiency prioritization tracker.
                                                        </p>
                                                    </div>
                                                    <div className="p-3.5 rounded-xl bg-white/15 border border-white/25 space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-bold text-white block">4. Islamized Wheel</span>
                                                            <span className="text-[10px] text-[#F2B55D] font-bold">8 Facets</span>
                                                        </div>
                                                        <p className="text-[11px] text-[#F7DFC7] leading-relaxed">
                                                            Holistic balance across Ibadah, Family, Health, Finance, and Vocational impact.
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Right Column: Platform Rules & Profile Indexing Flow */}
                    <div className="lg:col-span-5 space-y-5">
                        <ScrollReveal direction="left" delay={0.25}>
                            <div className="p-6 rounded-2xl bg-[#FAF8F5] border-2 border-[#F7DFC7] space-y-4 shadow-sm">
                                <h3 className="font-serif text-lg font-bold text-[#111E28]">
                                    How Profile Review & Publishing Works
                                </h3>
                                <p className="text-xs text-stone-700 leading-relaxed">
                                    Profiles are not automatically made public. Every sister is protected through our
                                    multi-step review workflow:
                                </p>

                                <StaggerContainer staggerDelay={0.08} className="space-y-3 text-xs">
                                    <StaggerItem>
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-[#5B9891] text-white border border-[#F2B55D] flex items-center justify-center font-bold flex-shrink-0 text-xs">
                                                1
                                            </div>
                                            <div>
                                                <strong className="text-[#111E28] block">Personal Profile (Always Free)</strong>
                                                <span className="text-stone-700">
                                                    Draft your profile, customize visibility, and submit for manual admin review.
                                                </span>
                                            </div>
                                        </div>
                                    </StaggerItem>

                                    <StaggerItem>
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-[#5B9891] text-white border border-[#F2B55D] flex items-center justify-center font-bold flex-shrink-0 text-xs">
                                                2
                                            </div>
                                            <div>
                                                <strong className="text-[#111E28] block">Referee Verification</strong>
                                                <span className="text-stone-700">
                                                    Your designated referrer confirms in-person familiarity.
                                                </span>
                                            </div>
                                        </div>
                                    </StaggerItem>

                                    <StaggerItem>
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-[#5B9891] text-white border border-[#F2B55D] flex items-center justify-center font-bold flex-shrink-0 text-xs">
                                                3
                                            </div>
                                            <div>
                                                <strong className="text-[#111E28] block">Business Profile Subscription</strong>
                                                <span className="text-stone-700">
                                                    Building business profiles is free, but publishing them requires a verified
                                                    ZiniPay subscription.
                                                </span>
                                            </div>
                                        </div>
                                    </StaggerItem>

                                    <StaggerItem>
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-[#5B9891] text-white border border-[#F2B55D] flex items-center justify-center font-bold flex-shrink-0 text-xs">
                                                4
                                            </div>
                                            <div>
                                                <strong className="text-[#111E28] block">Chronological Indexing</strong>
                                                <span className="text-stone-700">
                                                    Public directory sorts by Name (default), Date Created, or Date Modified.
                                                </span>
                                            </div>
                                        </div>
                                    </StaggerItem>
                                </StaggerContainer>

                                {/* Wired Action Button */}
                                <div className="pt-2 border-t border-[#F7DFC7]">
                                    <Link
                                        href={isAuthenticated ? "/member/profile" : "/register"}
                                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#D98408] hover:bg-[#B86E04] text-white text-xs font-bold shadow-md transition-all border border-[#F2B55D]"
                                    >
                                        <UserCheck className="w-4 h-4 text-white" />
                                        <span>Start Your Personal Profile Today</span>
                                    </Link>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
