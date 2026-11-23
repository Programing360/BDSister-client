import React from "react";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { isAdminRole } from "@/lib/permissions/roles";
import { AdminLayoutShell } from "@/features/admin/components";

export const metadata: Metadata = {
  title: {
    template: "%s | BDSisters Administration",
    default: "Admin Console | BDSisters.org",
  },
  description: "Executive control panel and platform administration for BDSisters.org.",
};

function decodeJwtPayload(token: string): {
  role?: string;
  user?: { role?: string };
  exp?: number;
} | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3 || !parts[1]) return null;
    // base64url ব্যবহার করা বাধ্যতামূলক, নাহলে '-' বা '_' থাকলে JSON.parse ক্র্যাশ করে
    const decoded = Buffer.from(parts[1], "base64url").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const currentPath =
    headersList.get("x-pathname") ||
    headersList.get("next-url") ||
    headersList.get("referer") ||
    "/admin";
  const isLoginPage = currentPath.includes("/admin/login");

  if (!isLoginPage) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value ?? cookieStore.get("auth_token")?.value;

    if (!token) {
      redirect(`/login?callbackUrl=${encodeURIComponent(currentPath)}&error=admin_unauthorized`);
    }

    // সরাসরি JWT পেলোড থেকে রোল ও মেয়াদ চেক করা (যাতে /api/auth/me-তে 429 Rate Limit না খায়)
    const payload = decodeJwtPayload(token);

    if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
      redirect(`/login?callbackUrl=${encodeURIComponent(currentPath)}&error=admin_unauthorized`);
    }

    const userRole = payload.role ?? payload.user?.role ?? null;

    if (!userRole) {
      redirect(`/login?callbackUrl=${encodeURIComponent(currentPath)}&error=admin_unauthorized`);
    }

    if (!isAdminRole(userRole)) {
      redirect("/member");
    }
  }

  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}