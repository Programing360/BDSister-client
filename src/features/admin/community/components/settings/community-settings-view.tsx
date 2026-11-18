"use client";

import React, { useState } from "react";
import {
  Settings,
  Save,
  CheckCircle,
  AlertCircle,
  Shield,
  Eye,
  FileText,
  Lock,
  MessageSquare,
  Sparkles,
  Paperclip,
} from "lucide-react";
import { DEMO_COMMUNITY_SETTINGS } from "../../data/mock-community";
import { CommunitySettings } from "../../types/community";

export function CommunitySettingsView() {
  const [settings, setSettings] = useState<CommunitySettings>(DEMO_COMMUNITY_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setToastMessage(
        "Community forum governance settings updated successfully (DEMO ONLY — simulated local state)."
      );
      setTimeout(() => setToastMessage(null), 4000);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-purple-500/5">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
            <Settings className="w-5 h-5" />
          </span>
          <h1 className="text-xl font-bold text-gray-900">
            Community & Forum Settings
          </h1>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Configure global access permissions, publishing safeguards, attachment limits, and sisterhood guidelines.
        </p>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Global Forum Access & Visibility */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-purple-500/5 space-y-5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100">
            <Eye className="w-4 h-4 text-purple-600" />
            Global Visibility & Participation Policies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Default Discussion Visibility
              </label>
              <select
                value={settings.defaultDiscussionVisibility}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    defaultDiscussionVisibility: e.target.value as any,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-purple-500 outline-none bg-white"
              >
                <option value="PUBLIC">Public (Visible to Visitors & Search Engines)</option>
                <option value="MEMBERS_ONLY">Registered Members Only</option>
                <option value="VERIFIED_ONLY">Verified Sisters Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Who Can Create New Discussions
              </label>
              <select
                value={settings.whoCanCreateDiscussions}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    whoCanCreateDiscussions: e.target.value as any,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-purple-500 outline-none bg-white"
              >
                <option value="ALL_MEMBERS">All Registered Members</option>
                <option value="VERIFIED_MEMBERS">Verified Sisters Only (ID Checked)</option>
                <option value="SUBSCRIBED_MEMBERS">Active Paid Subscribers Only</option>
                <option value="ADMINS_ONLY">Administrators Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Who Can Reply to Discussions
              </label>
              <select
                value={settings.whoCanReply}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    whoCanReply: e.target.value as any,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-purple-500 outline-none bg-white"
              >
                <option value="ALL_MEMBERS">All Registered Members</option>
                <option value="VERIFIED_MEMBERS">Verified Sisters Only</option>
                <option value="SUBSCRIBED_MEMBERS">Active Paid Subscribers Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Max Attachment Size
              </label>
              <select
                value={settings.maxAttachmentSizeMB}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maxAttachmentSizeMB: parseInt(e.target.value) || 10,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-purple-500 outline-none bg-white"
              >
                <option value={5}>5 MB per file</option>
                <option value={10}>10 MB per file (Default)</option>
                <option value={25}>25 MB per file</option>
                <option value={50}>50 MB per file</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Moderation Safeguards & Gatekeeper Toggles */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-purple-500/5 space-y-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100">
            <Shield className="w-4 h-4 text-purple-600" />
            Moderation Gatekeepers & Anti-Abuse Controls
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-purple-50/20 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={settings.communityEnabled}
                onChange={(e) =>
                  setSettings({ ...settings, communityEnabled: e.target.checked })
                }
                className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
              />
              <div>
                <span className="text-xs font-bold text-gray-900 block">
                  Enable Community Forum Module
                </span>
                <span className="text-[11px] text-gray-500">
                  When toggled off, forum enters read-only maintenance mode.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-purple-50/20 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={settings.requirePostApproval}
                onChange={(e) =>
                  setSettings({ ...settings, requirePostApproval: e.target.checked })
                }
                className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
              />
              <div>
                <span className="text-xs font-bold text-gray-900 block">
                  Require Pre-Approval for All Posts
                </span>
                <span className="text-[11px] text-gray-500">
                  Posts must be approved by a moderator before becoming visible.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-purple-50/20 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={settings.requireCommentApproval}
                onChange={(e) =>
                  setSettings({ ...settings, requireCommentApproval: e.target.checked })
                }
                className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
              />
              <div>
                <span className="text-xs font-bold text-gray-900 block">
                  Hold Unverified Comments in Queue
                </span>
                <span className="text-[11px] text-gray-500">
                  Replies from unverified accounts require moderator clearance.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-purple-50/20 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={settings.allowAttachments}
                onChange={(e) =>
                  setSettings({ ...settings, allowAttachments: e.target.checked })
                }
                className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
              />
              <div>
                <span className="text-xs font-bold text-gray-900 block">
                  Allow Media & Document Uploads
                </span>
                <span className="text-[11px] text-gray-500">
                  Permit PDF guides and workshop images in forum posts.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* 3. Guidelines & Welcome Text */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-purple-500/5 space-y-5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100">
            <FileText className="w-4 h-4 text-purple-600" />
            Sisterhood Guidelines & Welcome Copy
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Community Welcome Greeting
            </label>
            <input
              type="text"
              value={settings.welcomeMessage}
              onChange={(e) =>
                setSettings({ ...settings, welcomeMessage: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Public Community Guidelines
            </label>
            <textarea
              rows={4}
              value={settings.communityGuidelines}
              onChange={(e) =>
                setSettings({ ...settings, communityGuidelines: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Automated Sentinel Moderation Rules
            </label>
            <textarea
              rows={3}
              value={settings.moderationRules}
              onChange={(e) =>
                setSettings({ ...settings, moderationRules: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-purple-500 outline-none"
            />
          </div>
        </div>

        {/* Action Save Bar */}
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xl shadow-purple-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-[11px] text-gray-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            Demo settings are stored in local component state and will reset on page reload.
          </span>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-500/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving Settings..." : "Save Community Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
