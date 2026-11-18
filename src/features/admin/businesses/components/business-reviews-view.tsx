"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { BusinessReviewItem } from "../types/admin-business.ts";
import { DEMO_BUSINESS_REVIEWS } from "../data/admin-business-reviews-data.ts";
import {
  Star,
  MessageSquare,
  Search,
  CheckCircle2,
  EyeOff,
  Trash2,
  ArrowLeft,
  Building2,
  User,
  AlertTriangle,
} from "lucide-react";

export function BusinessReviewsView() {
  const [reviews, setReviews] = useState<BusinessReviewItem[]>(DEMO_BUSINESS_REVIEWS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredReviews = reviews.filter((r) => {
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.businessName.toLowerCase().includes(q) ||
        r.reviewerName.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUpdateStatus = (id: string, status: "PUBLISHED" | "HIDDEN" | "REJECTED") => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    setToastMessage(`Review status updated to ${status}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-600 hover:text-emerald-800">
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/businesses"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Businesses</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Business Customer Reviews & Feedback</h1>
          <p className="text-xs text-gray-500">
            Moderate community reviews, monitor feedback sentiments, and handle reported or abusive ratings.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-gray-200/80 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews by business, member, or text..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5B46F6]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="PENDING">Pending</option>
            <option value="REPORTED">Reported</option>
            <option value="HIDDEN">Hidden</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white border border-gray-200/80 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-gray-600 font-medium">
                <th className="py-3 px-4 font-semibold">Business</th>
                <th className="py-3 px-4 font-semibold">Rating & Review</th>
                <th className="py-3 px-4 font-semibold">Reviewer</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReviews.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/admin/businesses/${r.businessId}`}
                      className="font-semibold text-gray-900 hover:text-[#5B46F6] transition-colors"
                    >
                      {r.businessName}
                    </Link>
                  </td>

                  <td className="py-3.5 px-4 max-w-md">
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < r.rating ? "fill-amber-400 text-amber-500" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="font-bold text-gray-800 ml-1">{r.rating}/5</span>
                    </div>
                    <div className="font-medium text-gray-900 line-clamp-1">{r.title}</div>
                    <p className="text-gray-600 text-[11px] line-clamp-2 mt-0.5">{r.comment}</p>
                    {r.responseText && (
                      <div className="mt-1.5 p-2 bg-[#EAE6F7]/30 border-l-2 border-[#5B46F6] text-[11px] text-gray-700 rounded-r">
                        <span className="font-semibold text-[#5B46F6]">Owner Response:</span> {r.responseText}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-gray-900">{r.reviewerName}</div>
                    <div className="text-[11px] text-gray-400 font-mono">{r.reviewerEmail}</div>
                  </td>

                  <td className="py-3.5 px-4 text-gray-500">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                        r.status === "PUBLISHED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : r.status === "REPORTED"
                          ? "bg-rose-50 text-rose-700 border-rose-200 font-semibold animate-pulse"
                          : r.status === "PENDING"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {r.status !== "PUBLISHED" && (
                        <button
                          onClick={() => handleUpdateStatus(r.id, "PUBLISHED")}
                          title="Publish / Approve"
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[11px] font-medium transition-colors"
                        >
                          Publish
                        </button>
                      )}
                      {r.status !== "HIDDEN" && (
                        <button
                          onClick={() => handleUpdateStatus(r.id, "HIDDEN")}
                          title="Hide Review"
                          className="px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded text-[11px] font-medium transition-colors"
                        >
                          Hide
                        </button>
                      )}
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
