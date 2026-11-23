import React from "react";
import type { Metadata } from "next";
import { MemberResourcesView } from "@/features/member/components/member-resources-view";

export const metadata: Metadata = {
    title: "Resource Library | BDSisters",
    description: "Explore curated articles, video talks, and downloadable toolkits on BDSisters.",
    robots: { index: false, follow: false },
};

export default function MemberResourcesPage() {
    return <MemberResourcesView />;
}