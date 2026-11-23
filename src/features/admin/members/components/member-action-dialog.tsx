"use client";

import React, { useState } from "react";
import { X, ShieldCheck, UserCog, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { BackendMember } from "./members-list-view";

export type MemberActionType = "UPDATE_STATUS" | "UPDATE_ROLE";

interface MemberActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member: BackendMember;
  actionType: MemberActionType;
  onSuccess: (message: string) => Promise<void>;
}

export function MemberActionDialog({
  isOpen,
  onClose,
  member,
  actionType,
  onSuccess,
}: MemberActionDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<BackendMember["status"]>(
    member.status
  );
  const [selectedRole, setSelectedRole] = useState<BackendMember["role"]>(
    member.role
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (actionType === "UPDATE_STATUS") {
        await apiClient.patch(API_ENDPOINTS.admin.updateUserStatus(member._id), {
          status: selectedStatus,
        });
        await onSuccess(
          `${member.fullName}'s account status updated to ${selectedStatus}.`
        );
      } else {
        await apiClient.patch(API_ENDPOINTS.admin.updateUserRole(member._id), {
          role: selectedRole,
        });
        await onSuccess(
          `${member.fullName}'s role updated to ${selectedRole}.`
        );
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl space-y-5"
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F7DFC7] text-[#D98408]">
              {actionType === "UPDATE_STATUS" ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <UserCog className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {actionType === "UPDATE_STATUS"
                  ? "Update Approval & Account Status"
                  : "Assign Member Role"}
              </h3>
              <p className="text-xs text-gray-500">{member.fullName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {actionType === "UPDATE_STATUS" ? (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Select Account & Publish Status
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {(["Active", "Pending", "Rejected", "Suspended"] as const).map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setSelectedStatus(status)}
                      className={`rounded-xl border p-3 text-left text-xs font-bold transition ${selectedStatus === status
                          ? "border-[#5B9891] bg-[#5B9891]/10 text-[#467A74]"
                          : "border-gray-200 text-gray-700 hover:bg-[#FAF8F5]"
                        }`}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Select Platform Role
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {(["Member", "PaidMember", "Admin", "SuperAdmin"] as const).map(
                  (role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`rounded-xl border p-3 text-left text-xs font-bold transition ${selectedRole === role
                          ? "border-[#D98408] bg-[#F7DFC7]/60 text-[#D98408]"
                          : "border-gray-200 text-gray-700 hover:bg-[#FAF8F5]"
                        }`}
                    >
                      {role}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#5B9891] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#467A74] disabled:opacity-50 transition"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}