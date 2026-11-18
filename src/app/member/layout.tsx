import React from "react";
import type { Metadata } from "next";
import { requireServerSession } from "@/lib/auth/session";
import { MemberLayoutShell } from "@/features/member/components";

export const metadata: Metadata = {
  title: {
    template: "%s | BDSisters Member Portal",
    default: "Member Dashboard | BDSisters.org",
  },
  description:
    "Exclusive member portal for Bangladeshi women entrepreneurs, professionals, and learners.",
};

export default async function MemberRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireServerSession("/member");

  return <MemberLayoutShell user={session.user}>{children}</MemberLayoutShell>;
}
