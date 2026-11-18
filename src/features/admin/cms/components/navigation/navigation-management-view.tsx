"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit2,
  MoveUp,
  MoveDown,
  Sparkles,
  Save,
  Globe,
  Compass,
  Layers,
  Lock,
} from "lucide-react";
import { DEMO_NAVIGATION_ITEMS } from "../../data/mock-cms";
import type { CMSNavigationItem, NavigationLocation } from "../../types/cms";

export function NavigationManagementView() {
  const [navItems, setNavItems] = useState<CMSNavigationItem[]>(DEMO_NAVIGATION_ITEMS);
  const [activeTab, setActiveTab] = useState<NavigationLocation | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form state for creating a new navigation item
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    label: "",
    url: "",
    location: "PRIMARY" as NavigationLocation,
    groupName: "",
    openInNewTab: false,
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredItems = navItems.filter((item) => {
    const matchesTab = activeTab === "ALL" || item.location === activeTab;
    const matchesSearch =
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleToggleActive = (id: string) => {
    setNavItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isVisible: !item.isVisible } : item))
    );
  };

  const handleDelete = (id: string, label: string) => {
    setNavItems((prev) => prev.filter((item) => item.id !== id));
    triggerToast(`Deleted navigation item "${label}"`);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label || !formData.url) return;
    const newItem: CMSNavigationItem = {
      id: `nav-${Date.now()}`,
      label: formData.label,
      url: formData.url,
      location: formData.location,
      groupName: formData.groupName || undefined,
      displayOrder: navItems.length + 1,
      openInNewTab: formData.openInNewTab,
      isVisible: true,
    };
    setNavItems([...navItems, newItem]);
    setIsAdding(false);
    setFormData({
      label: "",
      url: "",
      location: "PRIMARY",
      groupName: "",
      openInNewTab: false,
    });
    triggerToast(`Successfully added "${newItem.label}"`);
  };

  const locations: { id: NavigationLocation | "ALL"; label: string; count: number }[] = [
    { id: "ALL", label: "All Items", count: navItems.length },
    { id: "PRIMARY", label: "Primary Header", count: navItems.filter((n) => n.location === "PRIMARY").length },
    { id: "FOOTER", label: "Footer Links", count: navItems.filter((n) => n.location === "FOOTER").length },
    { id: "MOBILE", label: "Mobile Drawer", count: navItems.filter((n) => n.location === "MOBILE").length },
    { id: "UTILITY", label: "Utility Bar", count: navItems.filter((n) => n.location === "UTILITY").length },
  ];

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
                Navigation Architecture
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Navigation Management
            </h1>
            <p className="text-sm text-slate-300">
              Manage centralized routing trees, header menus, footer groups, mobile drawers, and utility navigation links.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              {isAdding ? "Cancel" : "Add Navigation Link"}
            </button>
          </div>
        </div>

        {/* Demo Data Disclaimer */}
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2.5 text-xs font-medium text-amber-200">
          <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
          <span>DEMO DATA — Live changes are simulated locally in client state. No backend mutations occur.</span>
        </div>
      </div>

      {/* Add Item Form (Conditional) */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Add New Navigation Link</h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Dismiss
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Display Label</label>
              <input
                type="text"
                required
                placeholder="e.g. Micro-Grants"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Route / URL</label>
              <input
                type="text"
                required
                placeholder="e.g. /grants or https://..."
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location Tree</label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value as NavigationLocation })}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
              >
                <option value="PRIMARY">Primary Header</option>
                <option value="FOOTER">Footer Columns</option>
                <option value="MOBILE">Mobile Drawer</option>
                <option value="UTILITY">Utility Strip</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-center pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subgroup (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Platform, Resources, Legal"
                value={formData.groupName}
                onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                className="w-full rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="openTab"
                checked={formData.openInNewTab}
                onChange={(e) => setFormData({ ...formData, openInNewTab: e.target.checked })}
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="openTab" className="text-xs font-medium text-slate-700">
                Open in New Tab
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500"
            >
              <Save className="h-3.5 w-3.5" />
              Save Link
            </button>
          </div>
        </form>
      )}

      {/* Tabs and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Navigation Location Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl bg-slate-100 p-1">
          {locations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setActiveTab(loc.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === loc.id
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>{loc.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  activeTab === loc.id ? "bg-indigo-50 text-indigo-700" : "bg-slate-200 text-slate-600"
                }`}
              >
                {loc.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search navigation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-white pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
          />
        </div>
      </div>

      {/* Navigation Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Order</th>
                <th className="px-6 py-3.5">Label</th>
                <th className="px-6 py-3.5">Target URL</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Subgroup</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-slate-400">
                    #{item.displayOrder || index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900">{item.label}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded">
                      {item.url}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 capitalize">
                      {item.location.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-500 capitalize">
                      {item.groupName || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(item.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                        item.isVisible
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${item.isVisible ? "bg-emerald-500" : "bg-slate-400"}`} />
                      {item.isVisible ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleDelete(item.id, item.label)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Link"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
