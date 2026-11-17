import React from "react";
import type { Metadata } from "next";
import { AdminLayoutShell } from "@/features/admin/components";

export const metadata: Metadata = {
  title: {
    template: "%s | BDSisters Administration",
    default: "Admin Console | BDSisters.org",
  },
  description: "Executive control panel and platform administration for BDSisters.org.",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
