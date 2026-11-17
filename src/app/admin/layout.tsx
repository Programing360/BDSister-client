import { adminNavGroups } from "@/config/admin-navigation";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <DashboardSidebar
        navGroups={adminNavGroups}
        headerSlot={
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center shadow-subtle">
              <span className="text-white font-bold text-sm">AD</span>
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-foreground block">
                BDSisters
              </span>
              <span className="text-xs text-text-muted block">Admin Console</span>
            </div>
          </Link>
        }
        footerSlot={
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>Admin v1.0</span>
            <Badge variant="soft" size="sm">Active</Badge>
          </div>
        }
        className="hidden md:flex shrink-0"
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardTopbar
          leftSlot={
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-primary-soft text-primary">
                Management Portal
              </span>
            </div>
          }
          rightSlot={
            <div className="flex items-center gap-3">
              <div
                className="h-8 w-8 rounded-xl bg-primary-soft text-primary font-bold text-xs flex items-center justify-center border border-border"
                aria-label="Admin avatar placeholder"
              >
                AD
              </div>
            </div>
          }
        />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-background/50">
          {children}
        </main>
      </div>
    </div>
  );
}
