"use client";

import React, { useState } from "react";
import { AlertTriangle, ShieldAlert, X } from "lucide-react";
import { AdminRoleDetail } from "../types/admin-role";

interface RoleDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  role: AdminRoleDetail;
  onConfirmDelete: (roleId: string) => void;
}

export function RoleDeleteDialog({
  isOpen,
  onClose,
  role,
  onConfirmDelete,
}: RoleDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const isProtected = role.isProtected || role.type === "BUILT_IN";

  const handleDelete = () => {
    if (isProtected) return;
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      onConfirmDelete(role.id);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl ${
                isProtected
                  ? "bg-purple-100 text-[#5B46F6] dark:bg-purple-950/40 dark:text-purple-300"
                  : "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
              }`}
            >
              {isProtected ? (
                <ShieldAlert className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 id="dialog-title" className="text-lg font-bold text-gray-900 dark:text-white">
                {isProtected ? "Protected System Role" : "Delete Custom Role"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Target: <span className="font-semibold text-gray-800 dark:text-gray-200">{role.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {isProtected ? (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 text-xs text-purple-900 dark:text-purple-300 leading-relaxed">
                <span className="font-bold">System Role Safeguard:</span> &ldquo;{role.name}&rdquo; is a built-in enterprise role essential for platform governance and core system operations. It cannot be deleted, renamed, or deprecated.
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                If you wish to configure alternative administrative privileges, you can author a custom role with a specific permission subset instead.
              </p>
            </div>
          ) : (
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <p className="leading-relaxed">
                Are you sure you want to delete the custom role <strong className="text-gray-900 dark:text-white">&ldquo;{role.name}&rdquo;</strong> (<span className="font-mono text-xs">{role.slug}</span>)?
              </p>

              {role.assignedMembersCount > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    Warning: There are currently <strong className="font-semibold">{role.assignedMembersCount} members</strong> assigned to this role. Deleting it will reassign their administrative profile to standard &ldquo;Platform Member&rdquo;.
                  </span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 text-[11px] text-gray-500 leading-relaxed">
                <span className="font-bold">Frontend Demonstration:</span> This deletion executes in the local UI state and does not alter backend database schemas.
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {isProtected ? "Close" : "Cancel"}
            </button>
            {!isProtected && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition shadow-xs disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
