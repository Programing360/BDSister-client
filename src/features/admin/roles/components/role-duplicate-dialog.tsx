"use client";

import React, { useState } from "react";
import { Copy, X, Sparkles } from "lucide-react";
import { AdminRoleDetail } from "../types/admin-role";

interface RoleDuplicateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sourceRole: AdminRoleDetail;
  onConfirmDuplicate: (newRole: {
    name: string;
    slug: string;
    description: string;
    permissionKeys: string[];
  }) => void;
}

export function RoleDuplicateDialog({
  isOpen,
  onClose,
  sourceRole,
  onConfirmDuplicate,
}: RoleDuplicateDialogProps) {
  const [name, setName] = useState(`Copy of ${sourceRole.name}`);
  const [slug, setSlug] = useState(`${sourceRole.slug}-copy`);
  const [description, setDescription] = useState(
    `Custom role cloned from ${sourceRole.name}. ${sourceRole.description}`
  );
  const [isCloning, setIsCloning] = useState(false);

  if (!isOpen) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    setSlug(generatedSlug);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    setIsCloning(true);
    setTimeout(() => {
      setIsCloning(false);
      onConfirmDuplicate({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        permissionKeys: [...sourceRole.permissionKeys],
      });
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-100 text-[#5B46F6] dark:bg-indigo-950/40 dark:text-indigo-300">
              <Copy className="w-5 h-5" />
            </div>
            <div>
              <h3 id="dialog-title" className="text-lg font-bold text-gray-900 dark:text-white">
                Duplicate Role Definition
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Cloning template: <span className="font-semibold text-gray-800 dark:text-gray-200">{sourceRole.name}</span> ({sourceRole.permissionsCount} permissions)
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              New Role Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={handleNameChange}
              className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden focus:border-[#5B46F6]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              New Role Slug <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              className="w-full font-mono text-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden focus:border-[#5B46F6]"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Used in system identifier checks. Alphanumeric lowercase with hyphens.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-hidden focus:border-[#5B46F6]"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 text-xs text-purple-900 dark:text-purple-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 shrink-0 text-[#5B46F6] mt-0.5" />
            <p className="leading-relaxed">
              The cloned role will inherit all <strong className="font-semibold">{sourceRole.permissionKeys.length} permissions</strong> from {sourceRole.name}. You will be able to edit and customize individual capabilities after creation.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isCloning}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCloning || !name.trim() || !slug.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#5B46F6] hover:bg-[#4a36e2] text-white transition shadow-xs disabled:opacity-50"
            >
              {isCloning ? "Cloning..." : "Clone Custom Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
