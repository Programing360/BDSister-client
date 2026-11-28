import React from "react";
import { AdminSectionHelpView } from "@/features/admin/content/components/admin-section-help-view";

export const metadata = {
    title: "Section Hover Help (Tooltips) | BDSisters CMS",
    description: "Manage hovering section explainers and tooltip explanations across BDSisters.org.",
};

export default function AdminContentHoverHelpRoute() {
    return <AdminSectionHelpView />;
}
