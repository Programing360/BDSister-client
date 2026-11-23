import React from "react";
import Link from "next/link";
import {
  User,
  Briefcase,
  ShoppingBag,
  Package,
  Users,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    title: "My Profile",
    description: "Manage your professional biography, public showcase, and interests.",
    href: "/member/profile",
    icon: User,
    color: "bg-[#5B46F6]/10 text-[#5B46F6]",
  },
  {
    title: "My Business",
    description: "Manage your registered business, shop storefront, and product listings.",
    href: "/member/business",
    icon: Briefcase,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Sister Marketplace",
    description: "Discover curated products created by women entrepreneurs in Bangladesh.",
    href: "/marketplace",
    icon: ShoppingBag,
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "My Orders",
    description: "Track your marketplace purchases, order receipts, and delivery status.",
    href: "/member/orders",
    icon: Package,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Community Feed",
    description: "Join discussions, seek mentorship, share advice, and celebrate sisterhood.",
    href: "/member/community",
    icon: Users,
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Learning Hub",
    description: "Access curated workshops, business masterclasses, and skill certifications.",
    href: "/member/learning",
    icon: GraduationCap,
    color: "bg-rose-50 text-rose-600",
  },
];

export function QuickAccessGrid() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black tracking-tight text-gray-900 sm:text-xl">
            Quick Actions
          </h2>
          <p className="text-xs text-gray-500">
            Direct navigation to your most frequented member portals
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className="group relative flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-5 shadow-lg shadow-[#5B46F6]/5 transition-all duration-300 hover:-translate-y-1 hover:border-[#5B46F6]/40 hover:shadow-xl hover:shadow-[#5B46F6]/10 active:scale-98"
            >
              <div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-110 ${action.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-4 text-sm font-extrabold text-gray-900 transition-colors group-hover:text-[#5B46F6] sm:text-base">
                  {action.title}
                </h3>

                <p className="mt-1 text-xs leading-relaxed text-gray-500">{action.description}</p>
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#5B46F6]">
                <span>Open module</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
