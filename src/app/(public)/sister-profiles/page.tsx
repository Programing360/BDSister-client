import React from "react";
import type { Metadata } from "next";
import { PublicDirectoryView } from "@/features/public/directory/components/public-directory-view";

export const metadata: Metadata = {
    title: "Sister Profiles | BDSisters",
    description:
        "Verified Bangladeshi Muslim women profiles with vocational capabilities and privacy protections.",
};

export default function SisterProfilesPage() {
    return <PublicDirectoryView />;
}
