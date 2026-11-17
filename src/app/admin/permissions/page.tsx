import { Metadata } from "next";
import Link from "next/link";
import {
  KeyRound,
  Layers,
  Shield,
  Info,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import {
  PERMISSION_GROUPS,
  PERMISSION_ITEMS,
  DEMO_PERMISSIONS_DISCLAIMER,
} from "@/features/admin/roles/data/admin-permissions-data";
import { PermissionKpiCards } from "@/features/admin/permissions/components/permission-kpi-cards";
import { PermissionTable } from "@/features/admin/permissions/components/permission-table";

export const metadata: Metadata = {
  title: "Permissions Matrix | BDSisters Admin",
  description: "Enterprise capability matrix detailing 72 granular permissions across 15 functional operational domains.",
};

export default function AdminPermissionsPage() {
  const totalGroups = PERMISSION_GROUPS.length;
  const totalPermissions = PERMISSION_ITEMS.length;
  const assignedCount = PERMISSION_ITEMS.filter((p) => (p.assignedRolesCount ?? 0) > 0).length;
  const criticalCount = PERMISSION_ITEMS.filter((p) => p.riskLevel === "CRITICAL").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumb & Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Link href="/admin" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Admin
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/admin/roles" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Roles & Permissions
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-semibold text-gray-900 dark:text-white">Capabilities Matrix</span>
      </nav>

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-[#5B46F6] flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Granular Capabilities Matrix
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Comprehensive security dictionary of 72 granular permissions across 15 operational systems
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/permissions/groups"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#5B46F6] bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-xl transition-colors border border-indigo-200 dark:border-indigo-800"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Functional Domains (15 Groups)</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </Link>

          <Link
            href="/admin/roles"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors border border-gray-200 dark:border-gray-800"
          >
            <Shield className="w-3.5 h-3.5 text-gray-400" />
            <span>View Roles</span>
          </Link>
        </div>
      </div>

      {/* Frontend Demo Notice */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3.5 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="text-xs text-amber-800 dark:text-amber-300">
          <span className="font-semibold">Access Dictionary Architecture: </span>
          {DEMO_PERMISSIONS_DISCLAIMER}
        </div>
      </div>

      {/* KPI Stats */}
      <PermissionKpiCards
        totalGroups={totalGroups}
        totalPermissions={totalPermissions}
        assignedCount={assignedCount}
        criticalCount={criticalCount}
      />

      {/* Main Matrix Table */}
      <PermissionTable permissions={PERMISSION_ITEMS} />
    </div>
  );
}
