import React from "react";
import type { Metadata } from "next";
import { requireServerSession } from "@/lib/auth/session";
import { BusinessRegistrationWizard } from "@/features/business/components";

export const metadata: Metadata = {
  title: "Register Business | BDSisters Member",
  description: "Register your women-led business profile to receive verified vendor status and marketplace access.",
};

export default async function RegisterBusinessPage() {
  await requireServerSession("/member/business/create");
  return <BusinessRegistrationWizard />;
}
