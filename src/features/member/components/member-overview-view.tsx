"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    UserCircle,
    Compass,
    Building2,
    ShieldCheck,
    Clock,
    ArrowUpRight,
    Sparkles,
    CheckCircle2,
    UserPlus,
    Bell,
    Calendar,
    BookOpen,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { SectionHelpTooltip } from "@/components/shared/section-help-tooltip";

interface MemberMeData {
    _id: string;
    fullName: string;
    email: string;
    role: "Guest" | "Member" | "PaidMember" | "Admin" | "SuperAdmin";
    status: "Active" | "Pending" | "Rejected" | "Suspended";
    profileStatus?: string;
    bio?: string;
    district?: string;
    phone?: string;
    skills?: unknown[];
    identityVerification?: {
        verificationStatus?: string;
        nidOrPassportUrl?: string;
    };
}

interface GoalSummaryItem {
    _id: string;
    title: string;
    category?: string;
    progress?: number;
    isCompleted?: boolean;
}

export function MemberOverviewView() {
    const [profile, setProfile] = useState<MemberMeData | null>(null);
    const [goals, setGoals] = useState<GoalSummaryItem[]>([]);
    const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOverviewData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [meRes, goalsRes, notifRes] = await Promise.allSettled([
                apiClient.get<{ data?: MemberMeData }>(API_ENDPOINTS.auth.me),
                apiClient.get<{ data?: GoalSummaryItem[] }>(API_ENDPOINTS.goals.list),
                apiClient.get<{ unreadCount?: number; data?: { unreadCount?: number } }>(
                    API_ENDPOINTS.notifications.unreadCount
                ),
            ]);

            if (meRes.status === "fulfilled") {
                const raw = meRes.value as unknown as { data?: MemberMeData };
                if (raw.data) setProfile(raw.data);
            }

            if (goalsRes.status === "fulfilled") {
                const rawGoals = goalsRes.value as unknown as
                    | { data?: GoalSummaryItem[] }
                    | GoalSummaryItem[];
                setGoals(Array.isArray(rawGoals) ? rawGoals : rawGoals.data || []);
            }

            if (notifRes.status === "fulfilled") {
                const rawNotif = notifRes.value as unknown as {
                    unreadCount?: number;
                    data?: { unreadCount?: number };
                };
                setUnreadNotifications(
                    rawNotif.unreadCount ?? rawNotif.data?.unreadCount ?? 0
                );
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOverviewData();
    }, [fetchOverviewData]);

    const calculateCompletion = (p: MemberMeData | null): number => {
        if (!p) return 0;
        let score = 20;
        if (p.bio) score += 20;
        if (p.phone) score += 15;
        if (p.district) score += 15;
        if (p.skills && p.skills.length > 0) score += 15;
        if (p.identityVerification?.nidOrPassportUrl) score += 15;
        return Math.min(score, 100);
    };

    const completionPct = calculateCompletion(profile);
    const isPaid = profile?.role === "PaidMember";
    const isVerified = profile?.status === "Active";

    const todayFormatted = new Intl.DateTimeFormat("en-BD", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Dhaka",
    }).format(new Date());

    return (
        <div className="space-y-7 pb-12">
            {/* 1. Welcome Hero Banner */}
            <div className="rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/55 via-white to-[#5B9891]/12 p-6 sm:p-7 shadow-xs">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                Assalamu Alaikum, {profile?.fullName || "Sister"}!
                            </h1>
                            <span
                                className={`rounded-full border px-3 py-0.5 text-xs font-bold ${isPaid
                                        ? "bg-[#F7DFC7] border-[#D98408]/35 text-[#D98408]"
                                        : "bg-[#5B9891]/15 border-[#5B9891]/30 text-[#467A74]"
                                    }`}
                            >
                                {isPaid ? "Paid Sisterhood Member" : "Community Member"}
                            </span>
                        </div>
                        <p className="mt-1.5 text-xs text-gray-600 font-medium">
                            {todayFormatted} • Welcome to your personal growth, business, and sisterhood workspace.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <Link
                            href="/member/profile"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B9891] px-4 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#467A74] transition"
                        >
                            <UserCircle className="h-4 w-4" />
                            <span>Edit My Profile</span>
                        </Link>
                        <Link
                            href="/member/referrals"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#D98408]/35 bg-[#F7DFC7]/70 px-4 py-2.5 text-xs font-bold text-[#D98408] hover:bg-[#F2B55D]/40 transition"
                        >
                            <UserPlus className="h-4 w-4" />
                            <span>Invite a Sister</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. Verification & Profile Health Alert */}
            {!isLoading && (!isVerified || completionPct < 100) && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#F2B55D]/60 bg-[#F7DFC7]/45 p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F2B55D]/35 text-[#D98408]">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-900">
                                {!isVerified
                                    ? "Account Verification & Profile Review Pending"
                                    : `Your Sister Profile is ${completionPct}% Complete`}
                            </p>
                            <p className="text-[11px] text-gray-600 mt-0.5">
                                Complete your bio, skills, and upload your NID/Passport so administrators can approve and publish your profile.
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/member/profile"
                        className="inline-flex items-center gap-1 self-start sm:self-auto rounded-xl bg-[#D98408] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#b86f06] transition shrink-0"
                    >
                        <span>Complete Setup</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            )}

            {/* 3. Core Status KPI Cards */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-gray-600">Profile Health</span>
                            <SectionHelpTooltip
                                title="Sister Profile Health"
                                explanation="Shows how much of your personal, academic, vocational, and verification profile is completed."
                            />
                        </div>
                        <UserCircle className="h-5 w-5 text-[#5B9891]" />
                    </div>
                    <p className="text-2xl font-black text-gray-900">
                        {isLoading ? "..." : `${completionPct}%`}
                    </p>
                    <div className="h-2 w-full rounded-full bg-[#F7DFC7]/60 overflow-hidden">
                        <div
                            style={{ width: `${completionPct}%` }}
                            className="h-full rounded-full bg-[#5B9891] transition-all"
                        />
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-gray-600">ID Verification</span>
                            <SectionHelpTooltip
                                title="Confidential Identity Check"
                                explanation="Your NID or Passport is strictly private and only inspected by authorized female administrators."
                            />
                        </div>
                        <ShieldCheck className="h-5 w-5 text-[#D98408]" />
                    </div>
                    <p className="text-xl font-black text-gray-900">
                        {isLoading ? "..." : profile?.status || "Pending"}
                    </p>
                    <p className="text-[11px] text-gray-500">
                        {isVerified ? "Approved & visible in directory" : "Awaiting admin verification"}
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-gray-600">Active Goals</span>
                            <SectionHelpTooltip
                                title="Discover Yourself & 80/20 Goals"
                                explanation="Track your spiritual, family, career, and wellness goals using the Islamized Holistic Wheel."
                            />
                        </div>
                        <Compass className="h-5 w-5 text-[#5B9891]" />
                    </div>
                    <p className="text-2xl font-black text-gray-900">
                        {isLoading ? "..." : goals.length}
                    </p>
                    <Link
                        href="/member/discover"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5B9891] hover:underline"
                    >
                        <span>Open Holistic Wheel</span>
                        <ArrowUpRight className="h-3 w-3" />
                    </Link>
                </div>

                <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-600">Notifications</span>
                        <Bell className="h-5 w-5 text-[#D98408]" />
                    </div>
                    <p className="text-2xl font-black text-gray-900">
                        {isLoading ? "..." : unreadNotifications}
                    </p>
                    <p className="text-[11px] text-gray-500">Unread sisterhood alerts</p>
                </div>
            </section>

            {/* 4. Quick Workspace Modules */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-7 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
                        <div className="flex items-center gap-2">
                            <Compass className="h-5 w-5 text-[#5B9891]" />
                            <h2 className="text-base font-bold text-gray-900">
                                My Holistic Development Goals
                            </h2>
                            <SectionHelpTooltip
                                title="Islamized Holistic Wheel"
                                explanation="Balance your Deen, family responsibilities, entrepreneurship, and personal wellbeing."
                            />
                        </div>
                        <Link
                            href="/member/discover"
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#5B9891] hover:underline"
                        >
                            <span>Manage Goals</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    {goals.length > 0 ? (
                        <div className="space-y-3">
                            {goals.slice(0, 4).map((goal) => (
                                <div
                                    key={goal._id}
                                    className="flex items-center justify-between rounded-xl border border-[#F7DFC7] bg-[#FAF8F5] px-4 py-3 text-xs"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <CheckCircle2
                                            className={`h-4 w-4 ${goal.isCompleted ? "text-[#5B9891]" : "text-gray-300"
                                                }`}
                                        />
                                        <span className="font-bold text-gray-900">{goal.title}</span>
                                    </div>
                                    <span className="rounded-full bg-[#F7DFC7] px-2.5 py-0.5 text-[10px] font-bold text-[#D98408]">
                                        {goal.category || "Holistic"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-10 text-center space-y-2">
                            <p className="text-xs text-gray-500">
                                You haven&apos;t added any personal development goals yet.
                            </p>
                            <Link
                                href="/member/discover"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B9891]/12 px-4 py-2 text-xs font-bold text-[#467A74] hover:bg-[#5B9891] hover:text-white transition"
                            >
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>Start Your Holistic Wheel</span>
                            </Link>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-5 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-3">
                    <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3.5">
                        Sisterhood Shortcuts
                    </h2>

                    <Link
                        href="/member/business"
                        className="flex items-center justify-between rounded-xl border border-gray-200/80 p-3.5 hover:border-[#5B9891] hover:bg-[#F7DFC7]/25 transition"
                    >
                        <div className="flex items-center gap-3">
                            <Building2 className="h-5 w-5 text-[#D98408]" />
                            <div>
                                <p className="text-xs font-bold text-gray-900">Manage My Business & Brands</p>
                                <p className="text-[11px] text-gray-500">Showcase brands & track affiliate links</p>
                            </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-gray-400" />
                    </Link>

                    <Link
                        href="/member/events"
                        className="flex items-center justify-between rounded-xl border border-gray-200/80 p-3.5 hover:border-[#5B9891] hover:bg-[#F7DFC7]/25 transition"
                    >
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-[#5B9891]" />
                            <div>
                                <p className="text-xs font-bold text-gray-900">Workshops & Events</p>
                                <p className="text-[11px] text-gray-500">RSVP & view your entry passes</p>
                            </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-gray-400" />
                    </Link>

                    <Link
                        href="/member/resources"
                        className="flex items-center justify-between rounded-xl border border-gray-200/80 p-3.5 hover:border-[#5B9891] hover:bg-[#F7DFC7]/25 transition"
                    >
                        <div className="flex items-center gap-3">
                            <BookOpen className="h-5 w-5 text-[#D98408]" />
                            <div>
                                <p className="text-xs font-bold text-gray-900">Resource Library</p>
                                <p className="text-[11px] text-gray-500">Download guides, articles & TSPP books</p>
                            </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-gray-400" />
                    </Link>
                </div>
            </section>
        </div>
    );
}