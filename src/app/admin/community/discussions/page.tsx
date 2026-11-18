import React from "react";
import { Metadata } from "next";
import { DiscussionsListView } from "@/features/admin/community/components/discussions/discussions-list-view";

export const metadata: Metadata = {
  title: "Discussions Management | BDSisters Admin",
  description: "Browse, moderate, pin, and lock community discussion threads.",
};

export default function DiscussionsPage() {
  return <DiscussionsListView />;
}
