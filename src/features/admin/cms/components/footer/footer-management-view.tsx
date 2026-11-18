"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  Monitor,
  Smartphone,
  Globe,
  Mail,
  Phone,
  MapPin,
  Share2,
} from "lucide-react";
import { DEMO_NAVIGATION_ITEMS } from "../../data/mock-cms";
import type { CMSNavigationItem } from "../../types/cms";

export function FooterManagementView() {
  const [copyrightText, setCopyrightText] = useState("© 2026 BDSisters.org. All rights reserved. Registered Not-for-Profit Entity.");
  const [tagline, setTagline] = useState("Empowering Bangladeshi Women Entrepreneurs with Digital Market Access, Mentorship & Micro-Grants.");
  const [supportEmail, setSupportEmail] = useState("support@bdsisters.org");
  const [helplinePhone, setHelplinePhone] = useState("+880 1700-000000 (Mon–Fri 9am–6pm)");
  const [address, setAddress] = useState("Level 5, Plot 14, Gulshan-2, Dhaka 1212, Bangladesh");
  
  const [socialLinks, setSocialLinks] = useState({
    facebook: "https://facebook.com/bdsisters",
    instagram: "https://instagram.com/bdsisters",
    linkedin: "https://linkedin.com/company/bdsisters",
    youtube: "https://youtube.com/@bdsisters",
  });

  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [footerLinks, setFooterLinks] = useState<CMSNavigationItem[]>(
    DEMO_NAVIGATION_ITEMS.filter((item) => item.location === "FOOTER")
  );

  const [newGroup, setNewGroup] = useState<string>("Platform");
  const [newLabel, setNewLabel] = useState("");
  const [newPath, setNewPath] = useState("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newPath) return;
    const newItem: CMSNavigationItem = {
      id: `footer-nav-${Date.now()}`,
      label: newLabel,
      url: newPath,
      location: "FOOTER",
      groupName: newGroup,
      displayOrder: footerLinks.length + 1,
      openInNewTab: false,
      isVisible: true,
    };
    setFooterLinks([...footerLinks, newItem]);
    setNewLabel("");
    setNewPath("");
    triggerToast(`Added link "${newLabel}" under ${newGroup}`);
  };

  const handleDeleteLink = (id: string, label: string) => {
    setFooterLinks((prev) => prev.filter((item) => item.id !== id));
    triggerToast(`Removed link "${label}"`);
  };

  const groupedLinks = {
    platform: footerLinks.filter((l) => l.groupName?.toLowerCase() === "platform"),
    resources: footerLinks.filter((l) => l.groupName?.toLowerCase() === "resources"),
    legal: footerLinks.filter((l) => l.groupName?.toLowerCase() === "legal"),
    company: footerLinks.filter((l) => l.groupName?.toLowerCase() === "company" || !l.groupName),
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl shadow-slate-900/20 transition-all">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl shadow-indigo-950/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/admin/cms"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to CMS Overview
              </Link>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                Site Navigation & Identity
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Footer & Legal Navigation
            </h1>
            <p className="text-sm text-slate-300">
              Manage multi-column footer navigation groups, social channels, sister helpline contact info, and copyright compliance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => triggerToast("Footer configuration saved successfully (Demo UI).")}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95"
            >
              <Save className="h-4 w-4" />
              Save Footer Changes
            </button>
          </div>
        </div>

        {/* Demo Data Disclaimer */}
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2.5 text-xs font-medium text-amber-200">
          <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
          <span>DEMO DATA — Live changes are simulated locally in client state. No backend mutations occur.</span>
        </div>
      </div>

      {/* Live Footer Preview */}
      <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Live Footer Preview</h2>
            <p className="text-xs text-slate-500">
              Matches public portal theme with dark slate-950 backdrop and typography.
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setPreviewDevice("desktop")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                previewDevice === "desktop"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              Desktop View
            </button>
            <button
              onClick={() => setPreviewDevice("mobile")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                previewDevice === "mobile"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              Mobile (390px)
            </button>
          </div>
        </div>

        <div className="flex justify-center rounded-xl bg-slate-900/5 p-4 sm:p-8">
          <div
            className={`w-full overflow-hidden rounded-xl bg-slate-950 text-white shadow-2xl transition-all duration-300 ${
              previewDevice === "mobile" ? "max-w-[390px] p-6" : "max-w-5xl p-8 sm:p-12"
            }`}
          >
            {/* Top Footer Section */}
            <div className={`grid gap-8 ${previewDevice === "mobile" ? "grid-cols-1" : "grid-cols-5"}`}>
              {/* Brand Column */}
              <div className={previewDevice === "mobile" ? "col-span-1" : "col-span-2"}>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-md">
                    BD
                  </div>
                  <span className="text-lg font-bold tracking-tight text-white">BDSisters.org</span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-400 max-w-sm">
                  {tagline}
                </p>

                {/* Social icons */}
                <div className="mt-5 flex items-center gap-3 text-slate-400">
                  <span className="text-xs font-semibold text-slate-500">Official Socials:</span>
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-slate-900 px-2 py-1 text-[11px] font-bold text-slate-300 hover:text-white cursor-pointer">FB</span>
                    <span className="rounded-lg bg-slate-900 px-2 py-1 text-[11px] font-bold text-slate-300 hover:text-white cursor-pointer">IG</span>
                    <span className="rounded-lg bg-slate-900 px-2 py-1 text-[11px] font-bold text-slate-300 hover:text-white cursor-pointer">LI</span>
                    <span className="rounded-lg bg-slate-900 px-2 py-1 text-[11px] font-bold text-slate-300 hover:text-white cursor-pointer">YT</span>
                  </div>
                </div>
              </div>

              {/* Navigation Columns */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Platform</h4>
                <ul className="mt-3 space-y-2">
                  {groupedLinks.platform.map((link) => (
                    <li key={link.id} className="text-xs text-slate-400 hover:text-white cursor-pointer">
                      {link.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Resources</h4>
                <ul className="mt-3 space-y-2">
                  {groupedLinks.resources.map((link) => (
                    <li key={link.id} className="text-xs text-slate-400 hover:text-white cursor-pointer">
                      {link.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Legal & Trust</h4>
                <ul className="mt-3 space-y-2">
                  {groupedLinks.legal.map((link) => (
                    <li key={link.id} className="text-xs text-slate-400 hover:text-white cursor-pointer">
                      {link.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Helpline bar */}
            <div className="mt-8 rounded-xl bg-slate-900/80 p-4 text-xs text-slate-400 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>Helpline: {helplinePhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>{supportEmail}</span>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-6 border-t border-slate-900 pt-6 text-center text-[11px] text-slate-500">
              {copyrightText}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Contact info & socials */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50">
            <h3 className="text-base font-bold text-slate-900 mb-1">Company & Helpline Information</h3>
            <p className="text-xs text-slate-500 mb-4">
              Displayed in the footer branding section and support contact strip.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mission Tagline</label>
                <textarea
                  rows={2}
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Support Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Helpline Phone & Hours</label>
                <input
                  type="text"
                  value={helplinePhone}
                  onChange={(e) => setHelplinePhone(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Copyright Notice</label>
                <input
                  type="text"
                  value={copyrightText}
                  onChange={(e) => setCopyrightText(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Social Channels */}
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50">
            <h3 className="text-base font-bold text-slate-900 mb-1">Social Media Channels</h3>
            <p className="text-xs text-slate-500 mb-4">Official public profiles linked in footer icons.</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Facebook URL</label>
                <input
                  type="url"
                  value={socialLinks.facebook}
                  onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Instagram URL</label>
                <input
                  type="url"
                  value={socialLinks.instagram}
                  onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={socialLinks.linkedin}
                  onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">YouTube Channel URL</label>
                <input
                  type="url"
                  value={socialLinks.youtube}
                  onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns Management */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50">
            <h3 className="text-base font-bold text-slate-900 mb-1">Footer Navigation Groups</h3>
            <p className="text-xs text-slate-500 mb-4">
              Total {footerLinks.length} links organized across columns.
            </p>

            {/* List by group */}
            {(["Platform", "Resources", "Legal"] as const).map((groupName) => {
              const key = groupName.toLowerCase() as keyof typeof groupedLinks;
              const itemsInGroup = groupedLinks[key] || [];
              return (
                <div key={groupName} className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                      {groupName} Group
                    </h4>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {itemsInGroup.length} links
                    </span>
                  </div>

                  <div className="space-y-2">
                    {itemsInGroup.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 shadow-sm"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-900">{link.label}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{link.url}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteLink(link.id, link.label)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Add new footer link */}
            <form onSubmit={handleAddLink} className="rounded-xl bg-slate-50/80 p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-800">Add Link to Footer Group</h4>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Target Group</label>
                <select
                  value={newGroup}
                  onChange={(e) => setNewGroup(e.target.value)}
                  className="w-full rounded-xl bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                >
                  <option value="Platform">Platform</option>
                  <option value="Resources">Resources</option>
                  <option value="Legal">Legal & Trust</option>
                  <option value="Company">Company</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Label (e.g. Terms)"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="rounded-xl bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                />
                <input
                  type="text"
                  placeholder="URL Path (/terms)"
                  value={newPath}
                  onChange={(e) => setNewPath(e.target.value)}
                  className="rounded-xl bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Link to Footer
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
