import React from "react";
import { Metadata } from "next";
import { DiscussionForm } from "@/features/admin/community/components/discussions/discussion-form";

export const metadata: Metadata = {
  title: "Create Discussion | BDSisters Admin",
  description: "Publish an administrative or featured community discussion thread.",
};

export default function CreateDiscussionPage() {
  return <DiscussionForm />;
}
