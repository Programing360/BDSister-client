import React from "react";
import { AdminCmsPagesView } from "@/features/admin/content/components/admin-cms-pages-view";

export const metadata = {
    title: "Pages & Blocks CMS | BDSisters Admin",
    description: "Manage homepage sections, sister wings, key areas, explainers, and dynamic website pages.",
};

export default function AdminContentPagesRoute() {
    return <AdminCmsPagesView />;
}
