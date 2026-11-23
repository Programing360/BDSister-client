import React from "react";
import type { Metadata } from "next";
import { MemberDiscoverView } from "@/features/member/components/member-discover-view";

export const metadata: Metadata = {
    title: "Discover Yourself — Holistic Wheel & 80/20 Focus | BDSisters",
    description:
        "Reflect on your Islamized Holistic Development Wheel across Deen, Family, Enterprise, Wellness, and Khidmah, and track your high-impact 80/20 goals.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function MemberDiscoverPage() {
    return <MemberDiscoverView />;
}