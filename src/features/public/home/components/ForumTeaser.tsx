"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
    MessageSquare,
    Lock,
    Unlock,
    ShieldCheck,
    ArrowRight,
    Tag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { FORUM_PREVIEWS, SECTION_EXPLAINERS } from "@/data/mockData";
import { ForumTopicPreview } from "@/types";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/common/MotionComponents";
import { SectionHoverInfo } from "@/components/common/SectionHoverInfo";

const DEFAULT_CATEGORIES = [
    { name: "Faith & Personal Growth", key: "faith" },
    { name: "Family & Parenting", key: "family" },
    { name: "Sisters in Business", key: "business" },
    { name: "Health & Wellness", key: "health" },
    { name: "Skills Exchange (Ask & Offer)", key: "skills" },
];

function normalizeCategoryName(catOrWing?: string): string {
    if (!catOrWing) return "Faith & Personal Growth";
    const c = catOrWing.toLowerCase();
    if (c.includes("faith") || c.includes("growth")) return "Faith & Personal Growth";
    if (c.includes("fam") || c.includes("parent")) return "Family & Parenting";
    if (c.includes("busi") || c.includes("entre")) return "Sisters in Business";
    if (c.includes("health") || c.includes("well")) return "Health & Wellness";
    if (c.includes("skill") || c.includes("task") || c.includes("offer") || c.includes("exchange"))
        return "Skills Exchange (Ask & Offer)";
    return catOrWing;
}

export function ForumTeaser() {
    const { isAuthenticated } = useAuth();
    const [isGuestMode, setIsGuestMode] = useState(true);
    const [allTopics, setAllTopics] = useState<ForumTopicPreview[]>(FORUM_PREVIEWS);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedTopic, setSelectedTopic] = useState<ForumTopicPreview>(FORUM_PREVIEWS[0]!);
    const [forumExplainer, setForumExplainer] = useState(SECTION_EXPLAINERS.forums);

    // Fetch live posts and categories from backend
    useEffect(() => {
        async function fetchLivePosts() {
            try {
                const res = await apiClient.get<any>(API_ENDPOINTS.forum.posts, {
                    params: { limit: "100" },
                });
                const raw = res as any;
                const list = Array.isArray(raw)
                    ? raw
                    : Array.isArray(raw?.data)
                        ? raw.data
                        : [];
                if (list.length > 0) {
                    const formatted: ForumTopicPreview[] = list.map((p: any, idx: number) => {
                        const content = p.content || "";
                        const lines = content.split("\n").map((l: string) => l.trim()).filter(Boolean);
                        const firstLine = lines[0] || "Sisterhood Reflection";
                        const rawTitle = p.title?.trim() || firstLine;

                        // Ensure excerpt doesn't just duplicate the title
                        let cleanBody = content.trim();
                        if (cleanBody.toLowerCase().startsWith(rawTitle.toLowerCase())) {
                            cleanBody = cleanBody.slice(rawTitle.length).trim();
                        }
                        const excerpt = cleanBody.length > 150
                            ? `${cleanBody.slice(0, 150)}...`
                            : cleanBody || "Join this thoughtful discussion with sisters in our community.";

                        const category = normalizeCategoryName(p.category || p.wingName);
                        const tagPrefix = (category.split(" ")[0] ?? "").replace(/[^a-zA-Z]/g, "") || "Sisterhood";
                        const defaultTags = [
                            `#${tagPrefix}`,
                            "#BarakahLiving",
                        ];

                        return {
                            id: p._id || p.id || `forum-${idx}`,
                            category,
                            title: rawTitle,
                            authorSister: p.isAnonymous
                                ? "Anonymous Sister"
                                : (p.authorId && typeof p.authorId === "object" && p.authorId.fullName) || "Verified Sister",
                            isVerifiedMember: !p.isAnonymous,
                            postedAt: p.createdAt
                                ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                                : "Recently",
                            excerpt,
                            fullContentSample: content || excerpt,
                            replyCount: (p.comments && p.comments.length) || 0,
                            viewsCount: p.views ?? p.viewCount ?? p.viewsCount ?? (p.likes ? p.likes.length * 12 + 15 : 120),
                            isModerated: true,
                            tags: Array.isArray(p.tags) && p.tags.length > 0 ? p.tags : defaultTags,
                        };
                    });
                    setAllTopics(formatted);
                    if (formatted[0]) {
                        setSelectedTopic(formatted[0]);
                    }
                }
            } catch (err) {
                // Fall back gracefully to FORUM_PREVIEWS
            }
        }

        async function fetchForumExplainer() {
            try {
                const res = await apiClient.get<any>(API_ENDPOINTS.cms.blocks);
                const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
                const explainerBlock = list.find(
                    (b: any) => b.sectionKey === "sectionExplainers" && (b.title === "forums" || b.title === "community")
                );
                if (explainerBlock) {
                    setForumExplainer({
                        title: explainerBlock.subtitle || "Safe & Moderated Discussion Forums",
                        description: explainerBlock.content || "",
                        howItWorks: explainerBlock.metadata?.howItWorks || SECTION_EXPLAINERS.forums.howItWorks,
                    });
                }
            } catch (err) {
                // Keep default explainer
            }
        }

        fetchLivePosts();
        fetchForumExplainer();
    }, []);

    // Calculate real category counts derived from loaded MongoDB posts
    const categoryCounts = useMemo(() => {
        return DEFAULT_CATEGORIES.map((cat) => {
            const matchCount = allTopics.filter((t) => {
                const norm = normalizeCategoryName(t.category);
                return norm === cat.name;
            }).length;
            const countText = `${matchCount} ${matchCount === 1 ? "Topic" : "Topics"}`;
            return {
                name: cat.name,
                count: countText,
                rawCount: matchCount,
            };
        });
    }, [allTopics]);

    // Filter topics by selected category pill
    const displayedTopics = useMemo(() => {
        if (selectedCategory === "all") {
            return allTopics.slice(0, 4);
        }
        const filtered = allTopics.filter((t) => normalizeCategoryName(t.category) === selectedCategory);
        return filtered.length > 0 ? filtered.slice(0, 4) : allTopics.slice(0, 4);
    }, [allTopics, selectedCategory]);

    return (
        <section
            id="forums"
            aria-labelledby="forums-heading"
            className="py-16 bg-[#FAF8F5] border-b border-[#F7DFC7] overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <ScrollReveal direction="up">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#F7DFC7]/60">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="p-1.5 rounded-lg bg-[#F7DFC7] text-[#111E28] border border-[#F7DFC7]">
                                    <MessageSquare className="w-4 h-4 text-[#5B9891]" />
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wider text-[#111E28]">
                                    Constructive Sisterhood Circles
                                </span>
                            </div>
                            <h2
                                id="forums-heading"
                                className="font-serif text-2xl sm:text-3xl font-bold text-[#111E28] tracking-tight"
                            >
                                Forums: Connect & Converse
                            </h2>
                            <p className="mt-2 text-sm sm:text-base text-stone-700 max-w-2xl">
                                Safe, moderated spaces for uplifting dialogues on spirituality, family, business,
                                and vocational exchange—free from public toxicity.
                            </p>
                        </div>

                        <div className="flex-shrink-0">
                            <SectionHoverInfo
                                explainer={forumExplainer}
                                sectionName="Discussion Forums"
                            />
                        </div>
                    </div>
                </ScrollReveal>

                {/* View Mode Switcher Simulator */}
                <ScrollReveal direction="up" delay={0.1}>
                    <div className="mb-8 p-3 rounded-2xl bg-white border border-[#F7DFC7] shadow-xs flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#111E28]">
                            <span>Experience Forum View as:</span>
                            <div className="inline-flex rounded-full p-1 bg-[#FAF8F5] border border-[#F7DFC7]">
                                <button
                                    type="button"
                                    onClick={() => setIsGuestMode(true)}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${isGuestMode
                                        ? "bg-[#5B9891] text-white shadow-xs border border-[#5B9891]"
                                        : "text-stone-600 hover:text-[#111E28]"
                                        }`}
                                >
                                    Guest View (Gated)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsGuestMode(false)}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${!isGuestMode
                                        ? "bg-[#5B9891] text-white shadow-xs"
                                        : "text-stone-600 hover:text-[#111E28]"
                                        }`}
                                >
                                    Member View (Full Access)
                                </button>
                            </div>
                        </div>

                        <div className="text-xs text-stone-700 font-semibold flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-[#5B9891]" />
                            <span>Moderated Safe Sanctuary</span>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Real Topics Count Categories Bar with Filter Capability */}
                <ScrollReveal direction="up" delay={0.15}>
                    <div className="flex flex-wrap items-center gap-2 mb-8">
                        <button
                            type="button"
                            onClick={() => setSelectedCategory("all")}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shadow-2xs ${selectedCategory === "all"
                                ? "bg-[#5B9891] text-white border-[#5B9891] shadow-xs"
                                : "bg-white border-[#F7DFC7] text-[#111E28] hover:border-[#5B9891]"
                                }`}
                        >
                            All Categories
                        </button>
                        {categoryCounts.map((cat, idx) => {
                            const isCatActive = selectedCategory === cat.name;
                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setSelectedCategory(isCatActive ? "all" : cat.name)}
                                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all shadow-2xs ${isCatActive
                                        ? "bg-[#5B9891] text-white border-[#5B9891] shadow-xs"
                                        : "bg-white border-[#F7DFC7] text-[#111E28] hover:border-[#5B9891]"
                                        }`}
                                >
                                    <span>{cat.name}</span>
                                    <span
                                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${isCatActive
                                            ? "bg-white/20 text-white border-white/30"
                                            : "bg-[#F7DFC7] text-[#111E28] border-[#F7DFC7]"
                                            }`}
                                    >
                                        {cat.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </ScrollReveal>

                {/* Forums Showcase Grid: Balanced 50/50 Equal Width & Equal Height Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    {/* Topics List with Excerpt, Tags, and Read Discussion ↗ */}
                    <div className="h-full flex flex-col justify-between gap-4">
                        <StaggerContainer
                            staggerDelay={0.08}
                            className="flex flex-col gap-3.5 flex-grow"
                        >
                            {displayedTopics.map((topic) => {
                                const isSelected = selectedTopic.id === topic.id;
                                return (
                                    <StaggerItem key={topic.id} className="flex flex-col">
                                        <motion.div
                                            whileHover={{ y: -2, transition: { duration: 0.2 } }}
                                            onClick={() => setSelectedTopic(topic)}
                                            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${isSelected
                                                ? "bg-white border-[#5B9891] ring-2 ring-[#5B9891]/25 shadow-md"
                                                : "bg-white border-[#F7DFC7] hover:border-[#5B9891] hover:shadow-xs"
                                                }`}
                                        >
                                            <div>
                                                <div className="flex items-center justify-between text-[11px] mb-2">
                                                    <span className="font-bold text-[#111E28] uppercase tracking-wide bg-[#F7DFC7] px-2.5 py-0.5 rounded-full border border-[#F7DFC7]">
                                                        {topic.category}
                                                    </span>
                                                    <span className="text-stone-500 font-medium">{topic.postedAt}</span>
                                                </div>

                                                {/* Post Title */}
                                                <h3 className="text-sm sm:text-base font-bold text-[#111E28] leading-snug hover:text-[#5B9891] transition-colors mb-1.5">
                                                    {topic.title}
                                                </h3>

                                                {/* Distinct Post Content Excerpt */}
                                                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-2.5">
                                                    {topic.excerpt}
                                                </p>

                                                {/* Tags */}
                                                {topic.tags && topic.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                                                        {topic.tags.slice(0, 3).map((tag, tIdx) => (
                                                            <span
                                                                key={tIdx}
                                                                className="text-[10px] font-semibold text-[#5B9891] bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#F7DFC7]"
                                                            >
                                                                {tag.startsWith("#") ? tag : `#${tag}`}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Meta & Direct Read Link */}
                                            <div className="flex items-center justify-between gap-2 text-xs text-stone-600 pt-2.5 border-t border-[#F7DFC7]/40">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-[#5B9891]">
                                                        By {topic.authorSister}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{topic.replyCount} Replies</span>
                                                </div>
                                                <Link
                                                    href={`/forums/${topic.id}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="font-bold text-[#5B9891] hover:text-[#477C76] inline-flex items-center gap-1 hover:underline text-xs"
                                                >
                                                    <span>Read Discussion</span>
                                                    <span>↗</span>
                                                </Link>
                                            </div>
                                        </motion.div>
                                    </StaggerItem>
                                );
                            })}
                        </StaggerContainer>

                        {/* Explore All Forums Link */}
                        <div className="p-4 rounded-xl bg-white border border-[#F7DFC7] flex items-center justify-between shadow-2xs">
                            <Link
                                href="/forums"
                                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#5B9891] hover:text-[#477C76] transition-colors group"
                            >
                                <span>Explore All Forums & Discussions</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <span className="text-[11px] text-stone-500 font-medium hidden sm:inline">
                                5 Core Moderated Categories
                            </span>
                        </div>
                    </div>

                    {/* Active Post Preview: Equal Height Container */}
                    <div className="h-full">
                        <ScrollReveal direction="left" delay={0.2} className="h-full">
                            <div className="h-full bg-white rounded-2xl border-2 border-[#F7DFC7] p-6 sm:p-7 shadow-md relative flex flex-col justify-between">
                                {/* Top Section: Meta + Title + Excerpt */}
                                <div>
                                    <div className="border-b border-[#F7DFC7] pb-3 mb-4 flex items-center justify-between">
                                        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                                            {isGuestMode ? "Guest Perspective Preview" : "Verified Member Reader"}
                                        </span>
                                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F7DFC7] text-[#111E28] font-bold border border-[#F7DFC7]">
                                            {selectedTopic.category}
                                        </span>
                                    </div>

                                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#111E28] mb-2 leading-snug">
                                        {selectedTopic.title}
                                    </h3>

                                    <div className="text-xs text-stone-600 mb-3 flex items-center gap-2">
                                        <span className="font-bold text-[#5B9891]">
                                            {selectedTopic.authorSister}
                                        </span>
                                        <span>•</span>
                                        <span>{selectedTopic.postedAt}</span>
                                    </div>

                                    {/* Distinct Excerpt */}
                                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
                                        {selectedTopic.excerpt}
                                    </p>

                                    {/* Preview Tags */}
                                    {selectedTopic.tags && selectedTopic.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {selectedTopic.tags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-[11px] font-semibold text-[#5B9891] bg-[#FAF8F5] px-2.5 py-0.5 rounded-full border border-[#F7DFC7]"
                                                >
                                                    {tag.startsWith("#") ? tag : `#${tag}`}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Middle Section: GUEST VIEW GATE vs MEMBER FULL VIEW with AnimatePresence */}
                                <div className="my-auto py-2">
                                    <AnimatePresence mode="wait">
                                        {isGuestMode ? (
                                            <motion.div
                                                key="guest"
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -12 }}
                                                transition={{ duration: 0.3 }}
                                                className="relative pt-4 pb-2 text-center border-t border-dashed border-[#F7DFC7]"
                                            >
                                                <div className="p-5 rounded-2xl bg-[#F7DFC7] border border-[#F7DFC7] text-[#111E28] space-y-3">
                                                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#111E28]">
                                                        <Lock className="w-4 h-4 text-[#5B9891]" />
                                                        <span>Member Only Discussion</span>
                                                    </div>
                                                    <p className="text-xs text-stone-700 leading-relaxed">
                                                        Guests can only read a brief introduction. To access the complete conversation,
                                                        participate, or reply, create your free sisterhood account.
                                                    </p>

                                                    {/* REQUIRED BUTTON: Links to /register or directly to the post if authenticated */}
                                                    <Link
                                                        href={isAuthenticated ? `/forums/${selectedTopic.id}` : "/register"}
                                                        className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-full bg-[#5B9891] hover:bg-[#477C76] text-white text-xs font-bold shadow-md transition-all border border-[#5B9891]"
                                                    >
                                                        <span>Be a member to read the post. It&apos;s Free</span>
                                                        <ArrowRight className="w-3.5 h-3.5 text-[#F7DFC7]" />
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="member"
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -12 }}
                                                transition={{ duration: 0.3 }}
                                                className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#F7DFC7] space-y-3 text-xs text-stone-700"
                                            >
                                                <div className="flex items-center gap-1.5 text-[#111E28] font-bold">
                                                    <Unlock className="w-4 h-4 text-[#5B9891]" />
                                                    <span>Full Community Thread Unlocked</span>
                                                </div>
                                                <p className="leading-relaxed">{selectedTopic.fullContentSample}</p>
                                                <div className="pt-2 border-t border-[#F7DFC7] flex items-center justify-between">
                                                    <Link
                                                        href={`/forums/${selectedTopic.id}`}
                                                        className="px-4 py-2 rounded-full bg-[#5B9891] hover:bg-[#477C76] text-white shadow-xs font-bold text-xs transition-colors inline-flex items-center gap-1.5"
                                                    >
                                                        <span>Read Full Discussion & Reply</span>
                                                        <span>↗</span>
                                                    </Link>
                                                    <span className="text-[11px] text-stone-500 font-medium">
                                                        Safe Community Discussion
                                                    </span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Bottom Section: Membership Tier Breakdown Notice */}
                                <div className="pt-4 border-t border-[#F7DFC7] grid grid-cols-2 gap-2 text-[11px]">
                                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#F7DFC7]">
                                        <span className="font-bold text-[#111E28] block">Free Member</span>
                                        <span className="text-stone-600">Read all posts, participate in free events.</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#F7DFC7]">
                                        <span className="font-bold text-[#111E28] block">Paid Member</span>
                                        <span className="text-stone-600">Create new topics, ask questions, post comments.</span>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
