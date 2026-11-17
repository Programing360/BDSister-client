import React from "react";
import Link from "next/link";
import {
  Eye,
  Edit2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Check,
} from "lucide-react";
import { AdminMemberDetail } from "../types/admin-member";
import {
  AccountStatusBadge,
  MembershipBadge,
  IdentityVerificationBadge,
} from "./member-status-badges";

interface MemberTableProps {
  members: AdminMemberDetail[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  totalMembersCount: number;
  isLoading?: boolean;
}

export function MemberTable({
  members,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  totalMembersCount,
  isLoading = false,
}: MemberTableProps) {
  const isAllSelected =
    members.length > 0 && members.every((m) => selectedIds.includes(m.id));

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white shadow-2xs overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
            <tr>
              <th className="py-3 px-3.5 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  aria-label="Select all visible members"
                  className="rounded border-gray-300 text-[#5B46F6] focus:ring-[#5B46F6]"
                />
              </th>
              <th className="py-3 px-3.5">Member</th>
              <th className="py-3 px-3.5">Member ID</th>
              <th className="py-3 px-3.5">Phone Number</th>
              <th className="py-3 px-3.5 text-center">Membership</th>
              <th className="py-3 px-3.5 text-center">Account Status</th>
              <th className="py-3 px-3.5 text-center">Identity Verification</th>
              <th className="py-3 px-3.5">Joined Date</th>
              <th className="py-3 px-3.5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-xs text-gray-400 animate-pulse">
                  Loading member directory...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-xs text-gray-500">
                  No members found matching your search and filter criteria.
                </td>
              </tr>
            ) : (
              members.map((member) => {
                const isSelected = selectedIds.includes(member.id);
                const initials = member.name
                  .split(" ")
                  .map((n) => n[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <tr
                    key={member.id}
                    className={`transition ${
                      isSelected
                        ? "bg-purple-50/40"
                        : "hover:bg-purple-50/20"
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(member.id)}
                        aria-label={`Select ${member.name}`}
                        className="rounded border-gray-300 text-[#5B46F6] focus:ring-[#5B46F6]"
                      />
                    </td>

                    {/* Member Cell */}
                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 font-bold text-[#5B46F6] text-xs">
                          {initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-900">{member.name}</span>
                            {member.verificationStatus === "VERIFIED" && (
                              <ShieldCheck className="h-3.5 w-3.5 text-[#5B46F6]" />
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500">{member.email}</p>
                          {member.location?.city && (
                            <p className="flex items-center gap-0.5 text-[10px] text-gray-400 mt-0.5">
                              <MapPin className="h-2.5 w-2.5" />
                              {member.location.city}, {member.location.district}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Member ID */}
                    <td className="py-3 px-3.5 font-mono text-gray-700 font-bold">
                      {member.memberId}
                    </td>

                    {/* Phone */}
                    <td className="py-3 px-3.5 text-gray-600 font-mono text-[11px]">
                      {member.phone}
                    </td>

                    {/* Membership Type */}
                    <td className="py-3 px-3.5 text-center">
                      <MembershipBadge
                        type={member.membershipType}
                        plan={member.membershipPlan}
                      />
                    </td>

                    {/* Account Status */}
                    <td className="py-3 px-3.5 text-center">
                      <AccountStatusBadge status={member.accountStatus} />
                    </td>

                    {/* Identity Verification Status */}
                    <td className="py-3 px-3.5 text-center">
                      <IdentityVerificationBadge status={member.verificationStatus} />
                    </td>

                    {/* Joined Date */}
                    <td className="py-3 px-3.5 text-gray-500 text-[11px]">
                      {member.joinedDate}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link
                          href={`/admin/members/${member.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-[11px] font-bold text-gray-700 hover:border-[#5B46F6] hover:text-[#5B46F6] transition shadow-2xs"
                        >
                          <Eye className="h-3 w-3" />
                          <span>View</span>
                        </Link>
                        <Link
                          href={`/admin/members/${member.id}/edit`}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-[11px] font-bold text-gray-700 hover:border-[#5B46F6] hover:text-[#5B46F6] transition shadow-2xs"
                        >
                          <Edit2 className="h-3 w-3" />
                          <span>Edit</span>
                        </Link>
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 p-4 bg-gray-50/50 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-700 focus:outline-hidden"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-gray-400">•</span>
          <span>
            Total: <strong>{totalMembersCount}</strong> registered sisters
          </span>
        </div>

        {/* Page Switcher */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-600 mr-2">
            Page {currentPage} of {Math.max(totalPages, 1)}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-[#5B46F6] hover:text-[#5B46F6] disabled:opacity-40 transition shadow-2xs"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-[#5B46F6] hover:text-[#5B46F6] disabled:opacity-40 transition shadow-2xs"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
