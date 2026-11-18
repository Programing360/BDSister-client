"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { AdminSellerItem, SellerApprovalStatus } from "../types/admin-seller.ts";
import { SellerStatusBadge, SellerVerificationBadge, SellerTypeBadge } from "./seller-status-badges.tsx";
import {
  Users,
  Store,
  CreditCard,
  Percent,
  TrendingUp,
  ShoppingBag,
  Star,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  User,
  Building2,
  Phone,
  Mail,
  ShieldCheck,
} from "lucide-react";

interface SellerDetailsViewProps {
  seller: AdminSellerItem;
}

export function SellerDetailsView({ seller: initialSeller }: SellerDetailsViewProps) {
  const [seller, setSeller] = useState<AdminSellerItem>(initialSeller);
  const [commissionRate, setCommissionRate] = useState<number>(seller.commissionRatePercent);
  const [isEditingCommission, setIsEditingCommission] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleUpdateStatus = (newStatus: SellerApprovalStatus) => {
    setSeller((prev) => ({
      ...prev,
      status: newStatus,
      approvedAt: newStatus === "APPROVED" ? new Date().toISOString() : prev.approvedAt,
      approvedBy: newStatus === "APPROVED" ? "Admin Sadia Rahman" : prev.approvedBy,
      suspendedAt: newStatus === "SUSPENDED" ? new Date().toISOString() : undefined,
    }));
    setToastMessage(`Seller status changed to ${newStatus}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleTopSeller = () => {
    setSeller((prev) => ({ ...prev, isTopSeller: !prev.isTopSeller }));
    setToastMessage(seller.isTopSeller ? "Removed top seller badge" : "Marked as Top Seller!");
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSaveCommission = () => {
    setSeller((prev) => ({ ...prev, commissionRatePercent: commissionRate }));
    setIsEditingCommission(false);
    setToastMessage(`Commission rate updated to ${commissionRate}%`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
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

      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/sellers"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Sellers</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleTopSeller}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              seller.isTopSeller
                ? "bg-amber-50 border-amber-300 text-amber-800"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${seller.isTopSeller ? "fill-amber-400 text-amber-500" : ""}`} />
            <span>{seller.isTopSeller ? "Top Seller Spotlight" : "Award Top Seller Badge"}</span>
          </button>

          {seller.status !== "APPROVED" && (
            <button
              onClick={() => handleUpdateStatus("APPROVED")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve Seller</span>
            </button>
          )}

          {seller.status !== "SUSPENDED" && (
            <button
              onClick={() => handleUpdateStatus("SUSPENDED")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-purple-600" />
              <span>Suspend Account</span>
            </button>
          )}
        </div>
      </div>

      {/* Header Profile Card */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#EAE6F7] text-[#5B46F6] flex items-center justify-center border border-[#5B46F6]/20 shrink-0">
              <Store className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900">{seller.shopName}</h1>
                <SellerTypeBadge type={seller.sellerType} />
                {seller.isTopSeller && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    Top Seller
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-mono mt-1">
                <span>Code: {seller.sellerCode}</span>
                <span>•</span>
                <span>Joined {new Date(seller.joinedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <SellerStatusBadge status={seller.status} />
            <SellerVerificationBadge status={seller.verificationStatus} />
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200/80 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-1 text-xs">
            <span>Marketplace Catalog</span>
            <ShoppingBag className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-xl font-bold text-gray-900">{seller.productCount}</div>
          <p className="text-[11px] text-gray-400">Published items</p>
        </div>

        <div className="bg-white border border-gray-200/80 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-1 text-xs">
            <span>Fulfilled Orders</span>
            <ShoppingBag className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-bold text-gray-900">{seller.orderCount}</div>
          <p className="text-[11px] text-gray-400">Completed purchases</p>
        </div>

        <div className="bg-white border border-gray-200/80 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-1 text-xs">
            <span>Gross Sales (GMV)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-gray-900">৳{(seller.totalEarningsBDT / 1000).toLocaleString()}k</div>
          <p className="text-[11px] text-emerald-600">Total customer spend</p>
        </div>

        <div className="bg-white border border-gray-200/80 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-1 text-xs">
            <span>Seller Rating</span>
            <Star className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-gray-900">
            {seller.rating > 0 ? seller.rating.toFixed(1) : "N/A"}
          </div>
          <p className="text-[11px] text-gray-400">{seller.reviewCount} customer reviews</p>
        </div>
      </div>

      {/* Main Grid: Associations & Payout Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member & Business Link */}
        <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-4 h-4 text-[#5B46F6]" />
            <span>Member & Business Association</span>
          </h3>

          {/* Member Card */}
          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200/70 space-y-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Individual Member Account</span>
            <div className="flex items-center justify-between">
              <div>
                <Link
                  href={`/admin/members/${seller.memberId}`}
                  className="font-bold text-sm text-gray-900 hover:text-[#5B46F6] transition-colors"
                >
                  {seller.memberName}
                </Link>
                <div className="text-[11px] text-gray-500 font-mono mt-0.5">{seller.memberId}</div>
              </div>
              <Link
                href={`/admin/members/${seller.memberId}`}
                className="px-2.5 py-1 bg-white border border-gray-200 rounded text-gray-700 font-medium hover:bg-gray-100"
              >
                View Profile →
              </Link>
            </div>
            <div className="pt-2 border-t border-gray-200 flex items-center gap-4 text-gray-600">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                {seller.memberEmail}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                {seller.memberPhone}
              </span>
            </div>
          </div>

          {/* Business Entity Card */}
          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200/70 space-y-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Registered Enterprise Entity</span>
            {seller.businessId ? (
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    href={`/admin/businesses/${seller.businessId}`}
                    className="font-bold text-sm text-gray-900 hover:text-[#5B46F6] transition-colors"
                  >
                    {seller.businessName}
                  </Link>
                  <div className="text-[11px] text-gray-500 font-mono mt-0.5">{seller.businessCode}</div>
                </div>
                <Link
                  href={`/admin/businesses/${seller.businessId}`}
                  className="px-2.5 py-1 bg-white border border-gray-200 rounded text-gray-700 font-medium hover:bg-gray-100"
                >
                  View Business 360 →
                </Link>
              </div>
            ) : (
              <p className="text-gray-500 italic">No formal enterprise entity linked (Individual craft seller).</p>
            )}
          </div>
        </div>

        {/* Payout & Commission Controls */}
        <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#5B46F6]" />
            <span>Payout Account & Commission Settings</span>
          </h3>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Payout Method:</span>
              <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                {seller.payoutAccountType}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Account / Wallet Number:</span>
              <span className="font-mono font-bold text-gray-800">{seller.payoutAccountNumber}</span>
            </div>

            <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-gray-500 block">Platform Commission Rate:</span>
                <span className="text-base font-bold text-[#5B46F6]">{seller.commissionRatePercent}%</span>
              </div>
              <button
                onClick={() => setIsEditingCommission(!isEditingCommission)}
                className="text-xs text-[#5B46F6] font-medium hover:underline"
              >
                {isEditingCommission ? "Cancel" : "Change Rate"}
              </button>
            </div>

            {isEditingCommission && (
              <div className="pt-2 border-t border-gray-200 flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-20 px-2 py-1 bg-white border border-gray-200 rounded font-mono text-gray-900"
                />
                <span className="text-gray-500">%</span>
                <button
                  onClick={handleSaveCommission}
                  className="px-3 py-1 bg-[#5B46F6] text-white rounded font-medium hover:bg-[#4f3ad8]"
                >
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="text-[11px] text-gray-400 italic">
            * Payout transfers are settled automatically to the registered bKash, Nagad, or Bank account upon customer order fulfillment confirmation.
          </div>
        </div>
      </div>
    </div>
  );
}
