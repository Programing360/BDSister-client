import React from "react";
import Link from "next/link";
import {
  Eye,
  ShieldCheck,
  UserCog,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { BackendMember } from "./members-list-view";
import { MemberActionType } from "./member-action-dialog";

interface MemberTableProps {
  members: BackendMember[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  totalMembersCount: number;
  isLoading?: boolean;
  onOpenAction: (member: BackendMember, type: MemberActionType) => void;
}

export function MemberTable({
  members,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  totalMembersCount,
  isLoading = false,
  onOpenAction,
}: MemberTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-[#5B9891]/15 text-[#467A74] border-[#5B9891]/30";
      case "Pending":
        return "bg-[#F2B55D]/25 text-[#D98408] border-[#F2B55D]/50";
      case "Rejected":
      case "Suspended":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === "SuperAdmin" || role === "Admin") {
      return "bg-gray-900 text-white border-gray-900";
    }
    if (role === "PaidMember") {
      return "bg-[#F7DFC7] text-[#D98408] border-[#D98408]/30";
    }
    return "bg-[#FAF8F5] text-gray-700 border-gray-200";
  };

  return (
    <div className="rounded-2xl shadow-sm shadow-gray-400 transition-all duration-200 border-gray-200/80 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0e1f21] text-[11px] font-bold uppercase tracking-wider text-white border-b border-gray-100">
            <tr>
              <th className="py-3.5 px-4">Sister Profile</th>
              <th className="py-3.5 px-4">Referrer</th>
              <th className="py-3.5 px-4 text-center">Assigned Role</th>
              <th className="py-3.5 px-4 text-center">Account Status</th>
              <th className="py-3.5 px-4">Joined Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-xs text-gray-400 animate-pulse">
                  Loading live member records...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-xs text-gray-500">
                  No members found matching your search or filter criteria.
                </td>
              </tr>
            ) : (
              members.map((member) => {
                const initials = (member.fullName || "BD")
                  .split(" ")
                  .map((n) => n[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                const referrerName =
                  typeof member.referredBy === "object" && member.referredBy !== null
                    ? member.referredBy.fullName || member.referredBy.email
                    : member.referredBy || "Direct / Unspecified";

                return (
                  <tr key={member._id} className="hover:bg-[#F7DFC7]/20 transition">
                    {/* Member Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5B9891]/15 font-bold text-[#467A74] text-xs">
                          {initials}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{member.fullName}</p>
                          <p className="text-[11px] text-gray-500">{member.email}</p>
                          {(member.district || member.country) && (
                            <p className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                              <MapPin className="h-2.5 w-2.5 text-[#5B9891]" />
                              {[member.district, member.country].filter(Boolean).join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Referrer */}
                    <td className="py-3.5 px-4 text-gray-600 text-[11px]">
                      {referrerName}
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getRoleBadge(
                          member.role
                        )}`}
                      >
                        {member.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getStatusBadge(
                          member.status
                        )}`}
                      >
                        {member.status}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                      {new Date(member.createdAt).toLocaleDateString("en-BD", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/members/${member._id}`}
                          title="Inspect profile & NID/Passport"
                          className="inline-flex items-center gap-1 rounded-lg border border-[#5B9891]/30 bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#467A74] hover:bg-[#5B9891] hover:text-white transition"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Inspect ID</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => onOpenAction(member, "UPDATE_STATUS")}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#D98408]/30 bg-[#F7DFC7]/50 px-2.5 py-1.5 text-[11px] font-bold text-[#D98408] hover:bg-[#D98408] hover:text-white transition"
                        >
                          <ShieldCheck className="h-3 w-3" />
                          <span>Status</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenAction(member, "UPDATE_ROLE")}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-gray-700 hover:border-gray-900 transition"
                        >
                          <UserCog className="h-3 w-3" />
                          <span>Role</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 p-4 bg-[#FAF8F5] text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span>Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-700"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>•</span>
          <span>
            Total: <strong>{totalMembersCount}</strong> members
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="mr-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-[#5B9891] hover:text-[#5B9891] disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-[#5B9891] hover:text-[#5B9891] disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}