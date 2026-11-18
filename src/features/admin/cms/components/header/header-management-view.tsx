"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Eye,
  Save,
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Smartphone,
  Monitor,
  Sparkles,
  Layers,
  Menu,
  Bell,
} from "lucide-react";
import { DEMO_NAVIGATION_ITEMS } from "../../data/mock-cms";
import type { CMSNavigationItem } from "../../types/cms";

export function HeaderManagementView() {
  const [logoText, setLogoText] = useState("BDSisters.org");
  const [logoSubtitle, setLogoSubtitle] = useState("Empowering Bangladeshi Women Entrepreneurs");
  const [logoImageUrl, setLogoImageUrl] = useState("");
  const [isSticky, setIsSticky] = useState(true);
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(true);
  const [announcementText, setAnnouncementText] = useState("✨ Dhaka Women Entrepreneur Summit 2026 — Early Bird Passes Open!");
  const [announcementLink, setAnnouncementLink] = useState("/events/summit-2026");
  const [ctaText, setCtaText] = useState("Join BDSisters");
  const [ctaLink, setCtaLink] = useState("/membership");
  const [ctaStyle, setCtaStyle] = useState<"primary" | "secondary" | "outline">("primary");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [navItems, setNavItems] = useState<CMSNavigationItem[]>(
    DEMO_NAVIGATION_ITEMS.filter((item) => item.location === "PRIMARY")
  );

  const [newLabel, setNewLabel] = useState("");
  const [newPath, setNewPath] = useState("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddNavItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newPath) return;
    const newItem: CMSNavigationItem = {
      id: `nav-${Date.now()}`,
      label: newLabel,
      url: newPath,
      location: "PRIMARY",
      displayOrder: navItems.length + 1,
      openInNewTab: false,
      isVisible: true,
    };
    setNavItems([...navItems, newItem]);
    setNewLabel("");
    setNewPath("");
    triggerToast(`Added navigation item "${newLabel}"`);
  };

  const handleToggleItemStatus = (id: string) => {
    setNavItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isVisible: !item.isVisible } : item
      )
    );
  };

  const handleDeleteItem = (id: string, label: string) => {
    setNavItems((prev) => prev.filter((item) => item.id !== id));
    triggerToast(`Removed "${label}" from primary header`);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= navItems.length) return;
    const updated = [...navItems];
    const [moved] = updated.splice(index, 1);
    if (moved) {
      updated.splice(targetIndex, 0, moved);
      setNavItems(updated.map((item, idx) => ({ ...item, displayOrder: idx + 1 })));
    }
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
              Header & Top Bar Management
            </h1>
            <p className="text-sm text-slate-300">
              Configure your public portal’s header branding, primary navigation links, promotional announcement strip, and call-to-action button.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => triggerToast("Header configuration saved successfully (Demo UI).")}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95"
            >
              <Save className="h-4 w-4" />
              Save Header Changes
            </button>
          </div>
        </div>

        {/* Demo Data Disclaimer */}
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2.5 text-xs font-medium text-amber-200">
          <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
          <span>DEMO DATA — Live changes are simulated locally in client state. No backend mutations occur.</span>
        </div>
      </div>

      {/* Live Preview Panel */}
      <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Live Header Preview</h2>
            <p className="text-xs text-slate-500">
              Interactive preview matching the public layout on desktop and mobile viewports.
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
              Desktop
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

        {/* Preview Frame */}
        <div className="flex justify-center rounded-xl bg-slate-900/5 p-4 sm:p-8">
          <div
            className={`w-full overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-300 ${
              previewDevice === "mobile" ? "max-w-[390px]" : "max-w-5xl"
            }`}
          >
            {/* Top Announcement Bar */}
            {showAnnouncementBar && (
              <div className="flex items-center justify-between bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 px-4 py-2 text-center text-xs font-medium text-white shadow-inner">
                <div className="flex-1 truncate text-center">
                  <span>{announcementText}</span>
                  {announcementLink && (
                    <span className="ml-2 font-bold underline cursor-pointer hover:text-indigo-100">
                      Learn More →
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Main Header Row */}
            <div className="flex items-center justify-between px-6 py-4">
              {/* Logo / Brand */}
              <div className="flex items-center gap-3">
                {logoImageUrl ? (
                  <div className="relative h-9 w-9 overflow-hidden rounded-lg">
                    <Image src={logoImageUrl} alt="Logo" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-black text-base shadow-md shadow-indigo-600/30">
                    BD
                  </div>
                )}
                <div>
                  <div className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                    {logoText}
                  </div>
                  {previewDevice === "desktop" && (
                    <div className="text-[10px] text-slate-500 font-medium">
                      {logoSubtitle}
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Items (Desktop) */}
              {previewDevice === "desktop" ? (
                <div className="flex items-center gap-6">
                  {navItems
                    .filter((item) => item.isVisible)
                    .map((item) => (
                      <span
                        key={item.id}
                        className="text-xs font-semibold text-slate-700 hover:text-indigo-600 cursor-pointer transition-colors"
                      >
                        {item.label}
                      </span>
                    ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-700">
                  <Menu className="h-5 w-5" />
                </div>
              )}

              {/* Header Action Button */}
              <div className="hidden sm:block">
                <button
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all shadow-md ${
                    ctaStyle === "primary"
                      ? "bg-indigo-600 text-white shadow-indigo-600/20 hover:bg-indigo-500"
                      : ctaStyle === "secondary"
                      ? "bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800"
                      : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  {ctaText}
                </button>
              </div>
            </div>

            {/* Mock Sub-page Body placeholder */}
            <div className="bg-slate-50 p-6 text-center text-xs text-slate-400 font-medium">
              Page content scrolls beneath this {isSticky ? "sticky" : "static"} header.
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Controls (2 Columns) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Brand & Behavior Configuration */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50">
            <h3 className="text-base font-bold text-slate-900 mb-1">Branding & Logo</h3>
            <p className="text-xs text-slate-500 mb-6">
              Configure the public brand title, subtitle, and optional logo image URL.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Brand Name / Logo Text
                </label>
                <input
                  type="text"
                  value={logoText}
                  onChange={(e) => setLogoText(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={logoSubtitle}
                  onChange={(e) => setLogoSubtitle(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Custom Logo URL (optional)
                </label>
                <input
                  type="url"
                  placeholder="https://... (Leave empty to use initials badge)"
                  value={logoImageUrl}
                  onChange={(e) => setLogoImageUrl(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-semibold text-slate-800">Sticky Navigation</span>
                  <span className="text-[11px] text-slate-500">Fix header to top of viewport while scrolling</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSticky(!isSticky)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isSticky ? "bg-indigo-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isSticky ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Announcement Bar Settings */}
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Announcement Strip</h3>
                <p className="text-xs text-slate-500">Global promotional or advisory banner at the very top.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAnnouncementBar(!showAnnouncementBar)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showAnnouncementBar ? "bg-indigo-600" : "bg-slate-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showAnnouncementBar ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Announcement Message
                </label>
                <input
                  type="text"
                  disabled={!showAnnouncementBar}
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 disabled:opacity-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Destination URL
                </label>
                <input
                  type="text"
                  disabled={!showAnnouncementBar}
                  value={announcementLink}
                  onChange={(e) => setAnnouncementLink(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 disabled:opacity-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50">
            <h3 className="text-base font-bold text-slate-900 mb-1">Primary Call-to-Action (CTA)</h3>
            <p className="text-xs text-slate-500 mb-6">Prominent button displayed on the right of the header.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Button Label</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Button Target Link</label>
                <input
                  type="text"
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-2">Button Style</label>
              <div className="grid grid-cols-3 gap-3">
                {(["primary", "secondary", "outline"] as const).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setCtaStyle(style)}
                    className={`rounded-xl py-2 px-3 text-xs font-semibold capitalize transition-all ${
                      ctaStyle === style
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Primary Menu Items Reordering & Add */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">Primary Navigation Menu</h3>
                <p className="text-xs text-slate-500">
                  {navItems.length} active links shown in public header. Reorder or toggle visibility.
                </p>
              </div>
            </div>

            {/* Nav list */}
            <div className="mt-4 space-y-2.5">
              {navItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between gap-3 rounded-xl p-3 transition-all ${
                    item.isVisible ? "bg-slate-50 shadow-sm" : "bg-slate-50/40 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 text-[11px] font-bold text-indigo-700">
                      {index + 1}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{item.label}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.url}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Move up/down */}
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, "up")}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30"
                    >
                      <MoveUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === navItems.length - 1}
                      onClick={() => handleMove(index, "down")}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30"
                    >
                      <MoveDown className="h-3.5 w-3.5" />
                    </button>

                    {/* Toggle Active */}
                    <button
                      type="button"
                      onClick={() => handleToggleItemStatus(item.id)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                        item.isVisible
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                      }`}
                    >
                      {item.isVisible ? "Visible" : "Hidden"}
                    </button>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id, item.label)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new nav item form */}
            <form onSubmit={handleAddNavItem} className="mt-6 rounded-xl bg-slate-50/80 p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-800">Add New Navigation Link</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Link Label (e.g. Academy)"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="rounded-xl bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
                />
                <input
                  type="text"
                  placeholder="URL (/academy)"
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
                Add Item to Header
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
