import React, { Suspense } from "react";
import type { Metadata } from "next";
import { PublicResourcesView } from "@/features/public/resources/components/public-resources-view";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Resource Library & Toolkits | BDSisters",
  description:
    "Download curated guides, business templates, and personal development toolkits for Bangladeshi Muslim women.",
};

export default function ResourcesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#5B9891]" />
        </div>
      }
    >
      <PublicResourcesView />
    </Suspense>
  );
}