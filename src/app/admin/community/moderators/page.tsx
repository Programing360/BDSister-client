import React from "react";
import { Metadata } from "next";
import { ModeratorsListView } from "@/features/admin/community/components/moderators/moderators-list-view";

export const metadata: Metadata = {
  title: "Community Moderators | BDSisters Admin",
  description: "Manage community category moderators, assignments, and workload distribution.",
};

export default function ModeratorsPage() {
  return <ModeratorsListView />;
}
