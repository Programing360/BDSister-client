import React from "react";
import { Users, UserCheck, Clock, Crown, UserX } from "lucide-react";

interface MemberKpiCardsProps {
  kpis: {
    total: number;
    active: number;
    pending: number;
    paid: number;
    suspended: number;
  };
  isLoading?: boolean;
}

export function MemberKpiCards({ kpis, isLoading = false }: MemberKpiCardsProps) {
  const cards = [
    {
      id: "total",
      label: "Total Members",
      value: kpis.total.toLocaleString(),
      subtext: "All registered sisters",
      icon: Users,
      color: "bg-[#5B9891]/12 text-[#5B9891] border-[#5B9891]/25",
    },
    {
      id: "active",
      label: "Active & Published",
      value: kpis.active.toLocaleString(),
      subtext: "Verified & approved",
      icon: UserCheck,
      color: "bg-[#5B9891]/15 text-[#467A74] border-[#5B9891]/30",
    },
    {
      id: "pending",
      label: "Pending Approval",
      value: kpis.pending.toLocaleString(),
      subtext: "Awaiting manual review",
      icon: Clock,
      color: "bg-[#F2B55D]/25 text-[#D98408] border-[#F2B55D]/40",
    },
    {
      id: "paid",
      label: "Paid Members",
      value: kpis.paid.toLocaleString(),
      subtext: "Entrepreneur & forum access",
      icon: Crown,
      color: "bg-[#F7DFC7]/70 text-[#D98408] border-[#D98408]/30",
    },
    {
      id: "suspended",
      label: "Suspended / Rejected",
      value: kpis.suspended.toLocaleString(),
      subtext: "Restricted accounts",
      icon: UserX,
      color: "bg-rose-50 text-rose-700 border-rose-200",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            className="flex flex-col justify-between rounded-2xl shadow-sm shadow-gray-400 hover:bg-[#fcf1e6] transition-all duration-200 bg-white p-4 "
          >
            {isLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 w-16 bg-gray-200 rounded" />
                <div className="h-6 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-24 bg-gray-100 rounded" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-500 truncate">
                    {c.label}
                  </span>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl border ${c.color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-2xl font-black text-gray-900">{c.value}</p>
                  <p className="mt-0.5 text-[11px] text-gray-400 truncate">{c.subtext}</p>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}