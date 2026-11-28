"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Store,
  Search,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  MousePointerClick,
  Banknote,
  RotateCcw,
  MoreVertical,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { decodeHtmlEntities, slugify } from "@/lib/utils/format";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

export interface BackendBrand {
  _id?: string;
  brandName: string;
  roleInBusiness?: string;
  category?: string;
  websiteUrl?: string;
  isPublished?: boolean;
  affiliateClicks?: number;
}

export interface BackendBusiness {
  _id: string;
  userId?: {
    _id: string;
    fullName?: string;
    email?: string;
    status?: string;
  };
  businessSummary?: string;
  subscriptionStatus: "Paid" | "Unpaid";
  brands: BackendBrand[];
  totalAffiliateClicks?: number;
  commissionEarned?: number;
  createdAt: string;
}

export function BusinessesListView() {
  const [businesses, setBusinesses] = useState<BackendBusiness[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [modalTarget, setModalTarget] = useState<{
    business: BackendBusiness;
    newStatus: "Paid" | "Unpaid";
  } | null>(null);
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);

  const [query, setQuery] = useState("");
  const [subFilter, setSubFilter] = useState<"ALL" | "Paid" | "Unpaid">("ALL");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    if (!openDropdownId) return;

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-action-menu]")) {
        setOpenDropdownId(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openDropdownId]);

  const fetchBusinesses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<any>(API_ENDPOINTS.admin.businesses);
      const raw = res as any;
      const list: BackendBusiness[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw?.data?.businesses)
        ? raw.data.businesses
        : Array.isArray(raw?.businesses)
        ? raw.businesses
        : [];
      setBusinesses(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load business profiles.");
      setBusinesses([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const handleConfirmModal = async () => {
    if (!modalTarget) return;
    const { business, newStatus } = modalTarget;
    setIsSubmittingModal(true);
    setUpdatingId(business._id);
    try {
      await apiClient.patch(
        API_ENDPOINTS.admin.updateBusinessSubscription(business._id),
        { subscriptionStatus: newStatus }
      );
      showToast(
        `Business subscription updated to ${newStatus}. Brands ${
          newStatus === "Paid" ? "published" : "unpublished"
        } automatically.`
      );
      setModalTarget(null);
      await fetchBusinesses();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update subscription status.");
    } finally {
      setIsSubmittingModal(false);
      setUpdatingId(null);
    }
  };

  const kpis = useMemo(() => {
    if (!Array.isArray(businesses)) {
      return { total: 0, paid: 0, unpaid: 0, totalBrands: 0, totalClicks: 0 };
    }
    const total = businesses.length;
    const paid = businesses.filter((b) => b.subscriptionStatus === "Paid").length;
    const unpaid = total - paid;
    const totalBrands = businesses.reduce((sum, b) => sum + (b.brands?.length || 0), 0);
    const totalClicks = businesses.reduce(
      (sum, b) =>
        sum +
        (b.totalAffiliateClicks ??
          b.brands?.reduce((cSum, br) => cSum + (br.affiliateClicks || 0), 0) ??
          0),
      0
    );
    return { total, paid, unpaid, totalBrands, totalClicks };
  }, [businesses]);

  const filteredBusinesses = useMemo(() => {
    if (!Array.isArray(businesses)) {
      return [];
    }
    return businesses.filter((b) => {
      if (subFilter !== "ALL" && b.subscriptionStatus !== subFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const ownerName = (b.userId?.fullName || "").toLowerCase();
        const ownerEmail = (b.userId?.email || "").toLowerCase();
        const brandMatch = b.brands?.some((br) =>
          decodeHtmlEntities(br.brandName || "")
            .toLowerCase()
            .includes(q)
        );
        if (!ownerName.includes(q) && !ownerEmail.includes(q) && !brandMatch) {
          return false;
        }
      }
      return true;
    });
  }, [businesses, query, subFilter]);

  return (
    <div className="space-y-6 pb-12">
      {/* Feedback Toast */}
      {toastMessage && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-[#5B9891]/30 bg-[#5B9891]/10 p-3.5 text-xs font-bold text-[#467A74]">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#5B9891]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/45 via-white to-[#5B9891]/10 p-6 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Businesses & Brands
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-3 py-0.5 text-xs font-bold text-[#D98408]">
              <Building2 className="h-3.5 w-3.5" />
              Subscriptions & Commissions
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-600">
            Verify business subscription fees to publish sister brands and monitor affiliate link clicks.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchBusinesses}
          disabled={isLoading}
          className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-[#5B9891]/30 bg-white px-4 py-2 text-xs font-bold text-[#5B9891] shadow-2xs hover:bg-[#5B9891] hover:text-white transition disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
        {[
          {
            label: "Total Businesses",
            value: kpis.total,
            sub: "Registered profiles",
            icon: Building2,
            color: "bg-[#5B9891]/12 text-[#5B9891] border-[#5B9891]/25",
          },
          {
            label: "Paid & Published",
            value: kpis.paid,
            sub: "Active subscriptions",
            icon: CheckCircle2,
            color: "bg-[#5B9891]/15 text-[#467A74] border-[#5B9891]/30",
          },
          {
            label: "Unpaid / Pending",
            value: kpis.unpaid,
            sub: "Awaiting fee payment",
            icon: Clock,
            color: "bg-[#F2B55D]/25 text-[#D98408] border-[#F2B55D]/50",
          },
          {
            label: "Total Sister Brands",
            value: kpis.totalBrands,
            sub: "Across all businesses",
            icon: Store,
            color: "bg-[#F7DFC7]/70 text-[#D98408] border-[#D98408]/30",
          },
          {
            label: "Affiliate Link Clicks",
            value: kpis.totalClicks,
            sub: "External website traffic",
            icon: MousePointerClick,
            color: "bg-[#FAF8F5] text-gray-700 border-gray-200",
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="flex flex-col justify-between rounded-2xl shadow-md shadow-gray-400 hover:bg-[#fcf2e7] transition-all duration-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-500">{card.label}</span>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl border ${card.color}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-black text-gray-900">
                  {isLoading ? "..." : card.value.toLocaleString()}
                </p>
                <p className="mt-0.5 text-[11px] text-gray-400">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by brand name, founder name, or email..."
            className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] pl-10 pr-4 py-2 text-xs font-medium text-gray-900 focus:border-[#5B9891] focus:bg-white focus:outline-hidden transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={subFilter}
            onChange={(e) => setSubFilter(e.target.value as "ALL" | "Paid" | "Unpaid")}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 focus:border-[#5B9891] focus:outline-hidden"
          >
            <option value="ALL">Subscription: All</option>
            <option value="Paid">Paid (Published)</option>
            <option value="Unpaid">Unpaid (Draft)</option>
          </select>

          {(query || subFilter !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSubFilter("ALL");
              }}
              className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Business Table */}
      <div className="rounded-2xl border border-gray-200/80 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-4">Founder / Owner</th>
                <th className="py-3.5 px-4">Registered Brands</th>
                <th className="py-3.5 px-4 text-center">Link Clicks</th>
                <th className="py-3.5 px-4 text-center">Subscription</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-gray-400 animate-pulse">
                    Loading business directory...
                  </td>
                </tr>
              ) : filteredBusinesses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-gray-500">
                    No business profiles found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredBusinesses.map((biz) => {
                  const clicks =
                    biz.totalAffiliateClicks ??
                    biz.brands?.reduce((acc, br) => acc + (br.affiliateClicks || 0), 0) ??
                    0;

                  return (
                    <tr key={biz._id} className="hover:bg-[#F7DFC7]/20 transition">
                      {/* Founder */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-gray-900">
                          {biz.userId?.fullName || "Sister Entrepreneur"}
                        </p>
                        <p className="text-[11px] text-gray-500">{biz.userId?.email || ""}</p>
                      </td>

                      {/* Brands */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {biz.brands && biz.brands.length > 0 ? (
                            biz.brands.map((br, idx) => {
                              const brandSlug = br._id || slugify(br.brandName);
                              return (
                                <Link
                                  key={idx}
                                  href={`/brands/${brandSlug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={`View live public page for ${decodeHtmlEntities(br.brandName)}`}
                                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-[#FAF8F5] px-2.5 py-1 text-[11px] font-semibold text-gray-800 hover:border-[#5B9891] hover:text-[#5B9891] hover:bg-[#5B9891]/5 transition shadow-2xs"
                                >
                                  <span>{decodeHtmlEntities(br.brandName)}</span>
                                  {br.roleInBusiness && (
                                    <span className="text-[10px] text-gray-400">
                                      ({decodeHtmlEntities(br.roleInBusiness)})
                                    </span>
                                  )}
                                  <ExternalLink className="h-2.5 w-2.5 text-gray-400 group-hover:text-[#5B9891]" />
                                </Link>
                              );
                            })
                          ) : (
                            <span className="text-[11px] text-gray-400">No brands added</span>
                          )}
                        </div>
                      </td>

                      {/* Affiliate Clicks */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-gray-700">
                        {clicks.toLocaleString()}
                      </td>

                      {/* Subscription Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${biz.subscriptionStatus === "Paid"
                            ? "bg-[#5B9891]/15 text-[#467A74] border-[#5B9891]/30"
                            : "bg-[#F2B55D]/25 text-[#D98408] border-[#F2B55D]/50"
                            }`}
                        >
                          {biz.subscriptionStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap shrink-0">
                        <div className="relative inline-block text-left" data-action-menu>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId((curr) => (curr === biz._id ? null : biz._id));
                            }}
                            aria-expanded={openDropdownId === biz._id}
                            aria-label={`Actions for ${decodeHtmlEntities(biz.userId?.fullName || "business")}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-[#5B9891] hover:text-[#5B9891] hover:bg-[#5B9891]/5 transition shadow-2xs cursor-pointer"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>

                          {/* Floating 3-Dot Action Dropdown Menu */}
                          {openDropdownId === biz._id && (
                            <div className="absolute right-0 z-30 mt-1.5 w-48 origin-top-right rounded-2xl border border-gray-100 bg-white py-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150">
                              <Link
                                href={`/admin/businesses/${biz._id}`}
                                onClick={() => setOpenDropdownId(null)}
                                className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-[#FAF8F5] hover:text-[#5B9891] transition"
                              >
                                <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                                <span>View Details</span>
                              </Link>

                              <div className="my-1 border-t border-gray-100" />

                              {biz.subscriptionStatus === "Paid" ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenDropdownId(null);
                                    setModalTarget({ business: biz, newStatus: "Unpaid" });
                                  }}
                                  className="flex w-full items-center gap-2 px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                >
                                  <XCircle className="h-3.5 w-3.5 text-rose-500" />
                                  <span>Unpublish Brands</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenDropdownId(null);
                                    setModalTarget({ business: biz, newStatus: "Paid" });
                                  }}
                                  className="flex w-full items-center gap-2 px-3.5 py-2 text-xs font-bold text-[#467A74] hover:bg-[#5B9891]/10 transition cursor-pointer"
                                >
                                  <Banknote className="h-3.5 w-3.5 text-[#5B9891]" />
                                  <span>Mark Paid &amp; Publish</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {modalTarget && (
        <ConfirmationModal
          isOpen={Boolean(modalTarget)}
          isLoading={isSubmittingModal}
          variant={modalTarget.newStatus === "Paid" ? "primary" : "danger"}
          icon={modalTarget.newStatus === "Paid" ? Banknote : XCircle}
          title={
            modalTarget.newStatus === "Paid"
              ? "Approve Subscription & Publish Brands"
              : "Unpublish & Revoke Subscription"
          }
          confirmText={
            modalTarget.newStatus === "Paid" ? "Approve & Publish" : "Unpublish Brands"
          }
          description={
            modalTarget.newStatus === "Paid" ? (
              <div className="space-y-2">
                <p>
                  Are you sure you want to mark the subscription for{" "}
                  <strong>{decodeHtmlEntities(modalTarget.business.userId?.fullName || "this sister")}</strong> as{" "}
                  <strong className="text-[#5B9891]">Paid</strong>?
                </p>
                <p className="text-[11px] text-gray-500">
                  This will automatically publish all registered brands (
                  {modalTarget.business.brands?.map((b) => decodeHtmlEntities(b.brandName)).join(", ") ||
                    "all brands"}
                  ) on the public directory, marketplace, and search listings.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p>
                  Are you sure you want to unpublish the business profile for{" "}
                  <strong>{decodeHtmlEntities(modalTarget.business.userId?.fullName || "this sister")}</strong>?
                </p>
                <p className="text-[11px] text-rose-600">
                  All registered brands will be immediately hidden from public view and
                  affiliate traffic collection will be paused until subscription fee is renewed.
                </p>
              </div>
            )
          }
          onClose={() => {
            if (!isSubmittingModal) setModalTarget(null);
          }}
          onConfirm={handleConfirmModal}
        />
      )}
    </div>
  );
}