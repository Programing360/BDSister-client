"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { X, ShieldAlert, Loader2 } from "lucide-react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { useSession } from "@/lib/auth/auth-client";
import { isAdminRole } from "@/lib/permissions/roles";
import type { UserRole } from "@/types/auth";

interface AdminLayoutShellProps {
  children: React.ReactNode;
}

export function AdminLayoutShell({ children }: AdminLayoutShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileDrawerOpen]);

  // Close mobile drawer on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && mobileDrawerOpen) {
        setMobileDrawerOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileDrawerOpen]);

  // Client-side session and role protection
  useEffect(() => {
    if (pathname === "/admin/login") return;

    if (!isPending) {
      const userRole = (session?.user as { role?: string } | undefined)?.role as UserRole | undefined;
      if (!session?.user) {
        router.replace(
          `/login?callbackUrl=${encodeURIComponent(pathname)}&error=admin_unauthorized`
        );
      } else if (!isAdminRole(userRole as UserRole)) {
        router.replace("/member");
      }
    }
  }, [session, isPending, pathname, router]);

  // If user is on /admin/login, bypass dashboard layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // If loading session during client navigation, show clean indicator
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EAE6F7]/60">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
          <Loader2 className="h-8 w-8 animate-spin text-[#5B46F6]" />
          <p className="text-xs font-semibold text-gray-600">Verifying administrator authorization...</p>
        </div>
      </div>
    );
  }

  const currentUserRole = (session?.user as { role?: string } | undefined)?.role as UserRole | undefined;

  // If authenticated but unauthorized role (e.g. standard member)
  if (session?.user && !isAdminRole(currentUserRole as UserRole)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EAE6F7]/60 p-4">
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-white p-8 max-w-md text-center shadow-xl border border-red-100">
          <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Access Restricted</h2>
            <p className="text-xs text-gray-500 mt-1">
              Your account does not possess administrator credentials. Redirecting to the member portal...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#EAE6F7]/60 text-[#111827] antialiased">
      {/* 1. Desktop Persistent Sidebar */}
      <div
        className={`hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:flex-col transition-all duration-300 ${
          isCollapsed ? "lg:w-[76px]" : "lg:w-[272px]"
        }`}
      >
        <AdminSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* 2. Mobile Drawer & Backdrop */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 left-0 z-50 flex w-full max-w-xs flex-col bg-white shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="absolute right-3 top-4 z-10">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Close menu"
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:bg-gray-100 hover:text-gray-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <AdminSidebar
              isCollapsed={false}
              onToggleCollapse={() => {}}
              onNavigate={() => setMobileDrawerOpen(false)}
              isMobileDrawer={true}
            />
          </div>
        </div>
      )}

      {/* 3. Main Dashboard Body Area */}
      <div
        className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${
          isCollapsed ? "lg:pl-[76px]" : "lg:pl-[272px]"
        }`}
      >
        {/* Top Header */}
        <AdminHeader
          onOpenMobileDrawer={() => setMobileDrawerOpen(true)}
          isSidebarCollapsed={isCollapsed}
          onToggleSidebarCollapse={() => setIsCollapsed(!isCollapsed)}
        />

        {/* Page Content Container */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
