"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MessageSquare, RefreshCw, FolderOpen } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface ForumCategory {
    _id?: string;
    name: string;
    slug?: string;
    description?: string;
    postCount?: number;
}

const DEFAULT_CATEGORIES: ForumCategory[] = [
    { name: "Faith & Personal Growth", description: "Spiritual reflections, Islamic habits, and sisterhood reminders." },
    { name: "Family & Parenting", description: "Motherhood, tarbiyah, and homeschooling dialogues (CoP)." },
    { name: "Sisters in Business", description: "Halal entrepreneurship, marketing, and e-commerce advice." },
    { name: "Health & Wellness", description: "Mental, physical, and holistic wellbeing for women." },
    { name: "Skills Exchange (Ask & Offer)", description: "Peer-to-peer skill sharing, collaborations, and project help." },
];

export function AdminForumCategoriesView() {
    const [categories, setCategories] = useState<ForumCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get<{ data?: ForumCategory[] }>(
                API_ENDPOINTS.forum.categories
            );
            const raw = res as unknown as { data?: ForumCategory[] } | ForumCategory[];
            const list = Array.isArray(raw) ? raw : raw.data || [];
            setCategories(list.length > 0 ? list : DEFAULT_CATEGORIES);
        } catch {
            setCategories(DEFAULT_CATEGORIES);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/45 via-white to-[#5B9891]/10 p-6 shadow-xs">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            Forum Categories
                        </h1>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-3 py-0.5 text-xs font-bold text-[#D98408]">
                            <MessageSquare className="h-3.5 w-3.5" />
                            Connect & Converse
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                        Official discussion spaces across Faith, Parenting, Business, Wellness, and Skill Exchange.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchCategories}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#5B9891]/30 bg-white px-4 py-2 text-xs font-bold text-[#5B9891] hover:bg-[#5B9891] hover:text-white transition"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat, idx) => (
                    <div
                        key={cat._id || idx}
                        className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs flex items-start gap-3.5"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5B9891]/12 text-[#5B9891]">
                            <FolderOpen className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">{cat.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">
                                {cat.description || "Moderated community discussion space."}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}