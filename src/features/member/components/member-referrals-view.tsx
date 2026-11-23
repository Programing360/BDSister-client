"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    UserPlus,
    Copy,
    CheckCircle2,
    ShieldCheck,
    Share2,
    Loader2,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { SectionHelpTooltip } from "@/components/shared/section-help-tooltip";

interface ReferrerProfile {
    _id: string;
    fullName: string;
    referralCode?: string;
    status: string;
}

export function MemberReferralsView() {
    const [me, setMe] = useState<ReferrerProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    const loadMe = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get<{ data?: ReferrerProfile }>(API_ENDPOINTS.auth.me);
            const raw = res as unknown as { data?: ReferrerProfile };
            if (raw.data) setMe(raw.data);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMe();
    }, [loadMe]);

    const referralCode =
        me?.referralCode || (me?._id ? `BDS-${me._id.slice(-6).toUpperCase()}` : "BDS-SISTER");

    const inviteUrl =
        typeof window !== "undefined"
            ? `${window.location.origin}/register?ref=${encodeURIComponent(referralCode)}`
            : `https://bdsisters.org/register?ref=${referralCode}`;

    const copyText = (text: string, type: "code" | "link") => {
        navigator.clipboard.writeText(text);
        if (type === "code") {
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2500);
        } else {
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2500);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-7 w-7 text-[#5B9891] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-14">
            <div className="rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/55 via-white to-[#5B9891]/12 p-6 shadow-xs">
                <div className="flex items-center gap-2.5">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                        Refer & Vouch for a Sister
                    </h1>
                    <SectionHelpTooltip
                        title="Trusted Sisterhood Vouching"
                        explanation="To keep BDSisters safe and authentic, every new applicant must enter a valid referral code from an existing verified sister."
                    />
                </div>
                <p className="mt-1 text-xs text-gray-600">
                    Share your personal referral code or direct invitation link with sisters you trust.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Referral Code Card */}
                <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                        <UserPlus className="h-4 w-4 text-[#D98408]" />
                        <h2 className="text-sm font-bold text-gray-900">Your Personal Referral Code</h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-xl border border-[#D98408]/35 bg-[#F7DFC7]/55 px-4 py-3 font-mono text-base font-black tracking-wider text-[#D98408]">
                            {referralCode}
                        </div>
                        <button
                            type="button"
                            onClick={() => copyText(referralCode, "code")}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B9891] px-4 py-3 text-xs font-bold text-white hover:bg-[#467A74] transition"
                        >
                            {copiedCode ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
                        </button>
                    </div>

                    <div className="space-y-1.5 pt-2">
                        <label className="block text-[11px] font-bold uppercase text-gray-500">
                            Direct Invitation Link
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                readOnly
                                value={inviteUrl}
                                className="flex-1 rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2.5 font-mono text-xs text-gray-700"
                            />
                            <button
                                type="button"
                                onClick={() => copyText(inviteUrl, "link")}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-[#5B9891]/35 bg-white px-3.5 py-2.5 text-xs font-bold text-[#5B9891] hover:bg-[#5B9891] hover:text-white transition"
                            >
                                {copiedLink ? <CheckCircle2 className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                                <span>{copiedLink ? "Copied" : "Copy Link"}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sisterhood Responsibility Card */}
                <div className="rounded-2xl border border-[#5B9891]/25 bg-white p-6 shadow-2xs space-y-3">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                        <ShieldCheck className="h-4 w-4 text-[#5B9891]" />
                        <h2 className="text-sm font-bold text-gray-900">Sisterhood Trust Guidelines</h2>
                    </div>

                    <ul className="space-y-2.5 text-xs text-gray-600 leading-relaxed list-disc pl-4">
                        <li>
                            Only share your referral code with sisters whom you personally know and trust.
                        </li>
                        <li>
                            Every referred sister will still complete private NID/Passport verification before her profile is published.
                        </li>
                        <li>
                            You are listed as her referee on her profile to strengthen community accountability and trust.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}