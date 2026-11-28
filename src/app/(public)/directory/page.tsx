import React from "react";
import type { Metadata } from "next";
import { PublicDirectoryView } from "@/features/public/directory/components/public-directory-view";

export const metadata: Metadata = {
    title: "Sisterhood Directory | BDSisters",
    description:
        "Discover and connect with verified Bangladeshi Muslim women across academic, vocational, and entrepreneurial fields.",
};

export default function DirectoryPage() {
    return <PublicDirectoryView />;
}