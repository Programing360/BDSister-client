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
  ChevronDown,
  Sparkles,
  HelpCircle,
  Eye,
} from "lucide-react";
import { DEMO_FAQS } from "../../data/mock-cms";
import type { FAQItem } from "../../types/cms";

export function FAQListView() {
  const [faqs, setFaqs] = useState<FAQItem[]>(DEMO_FAQS);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(DEMO_FAQS[0]?.id || null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || faq.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleTogglePublish = (id: string) => {
    setFaqs((prev) =>
      prev.map((faq) =>
        faq.id === id ? { ...faq, isVisible: !faq.isVisible } : faq
      )
    );
    triggerToast("FAQ visibility updated (Demo UI)");
  };

  const handleDelete = (id: string, question: string) => {
    setFaqs((prev) => prev.filter((faq) => faq.id !== id));
    triggerToast(`Deleted FAQ "${question}"`);
  };

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
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
                Help & Support Center
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Frequently Asked Questions (FAQ)
            </h1>
            <p className="text-sm text-slate-300">
              Manage categorized customer questions and guidance for sisters regarding onboarding, verification, payouts, and order dispute handling.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/cms/faq/create"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Add New FAQ
            </Link>
          </div>
        </div>

        {/* Demo Data Disclaimer */}
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2.5 text-xs font-medium text-amber-200">
          <Sparkles className="h-4 w-4 text-amber-300 shrink-0" />
          <span>DEMO DATA — Live changes are simulated locally in client state. No backend mutations occur.</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-white pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
          >
            <option value="all">All Categories</option>
            <option value="membership">Membership</option>
            <option value="verification">Verification</option>
            <option value="payments">Payments</option>
            <option value="marketplace">Marketplace</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredFaqs.length} of {faqs.length} FAQ items
        </span>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        {filteredFaqs.map((faq) => {
          const isExpanded = expandedId === faq.id;
          return (
            <div
              key={faq.id}
              className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/50 transition-all hover:shadow-2xl"
            >
              <div
                onClick={() => toggleAccordion(faq.id)}
                className="flex cursor-pointer items-center justify-between p-6 select-none"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs shadow-sm">
                    #{faq.displayOrder}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        {faq.category}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          faq.isVisible
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {faq.isVisible ? "Published" : "Draft"}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{faq.question}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
                      isExpanded ? "rotate-180 text-indigo-600" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Accordion Expand Body */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-6">
                  <p className="text-xs text-slate-700 leading-relaxed max-w-4xl">
                    {faq.answer}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(faq.id)}
                      className={`text-xs font-semibold transition-colors ${
                        faq.isVisible
                          ? "text-slate-500 hover:text-slate-800"
                          : "text-emerald-600 hover:text-emerald-700 font-bold"
                      }`}
                    >
                      {faq.isVisible ? "Set to Draft" : "Publish to Public FAQ"}
                    </button>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/cms/faq/${faq.id}/edit`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Edit FAQ
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(faq.id, faq.question)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete FAQ"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
