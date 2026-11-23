import React from "react";
import type { Metadata } from "next";
import { MemberReferralsView } from "@/features/member/components/member-referrals-view";

export const metadata: Metadata = {
    title: "Refer a Sister | BDSisters",
    description: "Invite trusted sisters to join BDSisters with your personal referral code.",
    robots: { index: false, follow: false },
};

export default function MemberReferralsPage() {
    return <MemberReferralsView />;
}