import React from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { isAdminRole } from "@/lib/permissions/roles";
import { AdminLayoutShell } from "@/features/admin/components";

export const metadata: Metadata = {
  title: {
    template: "%s | BDSisters Administration",
    default: "Admin Console | BDSisters.org",
  },
  description: "Executive control panel and platform administration for BDSisters.org.",
};

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const currentPath =
    headersList.get("x-pathname") ||
    headersList.get("next-url") ||
    headersList.get("referer") ||
    "";
  const isLoginPage = currentPath.includes("/admin/login");

  if (!isLoginPage) {
    const session = await getServerSession();

    if (!session?.user) {
      redirect(`/login?callbackUrl=${encodeURIComponent("/admin")}&error=admin_unauthorized`);
    }

    if (!isAdminRole(session.user.role)) {
      redirect("/member");
    }
  }

  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
