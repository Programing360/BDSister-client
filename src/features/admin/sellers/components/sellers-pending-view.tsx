"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { AdminSellerItem, SellerApprovalStatus } from "../types/admin-seller.ts";
import { SellerStatusBadge, SellerVerificationBadge, SellerTypeBadge } from "./seller-status-badges.tsx";
import {
  Users,
  Clock,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Eye,
  ShoppingBag,
  CreditCard,
  Building2,
} from "lucide-react";

interface SellersPendingViewProps {
  initialSellers: AdminSellerItem[];
}

export function SellersPendingView({ initialSellers }: SellersPendingViewProps) {
  const [sellers, setSellers] = useState<AdminSellerItem[]>(
    initialSellers.filter((s) => s.status === "PENDING_APPROVAL" || s.status === "UNDER_REVIEW")
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleUpdateStatus = (sellerId: string, status: SellerApprovalStatus) => {
    setSellers((prev) => prev.filter((s) => s.id !== sellerId));
    setToastMessage(`Seller onboarding status updated to ${status}.`);
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
            href="/admin/sellers"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Sellers</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Pending Seller Onboarding Queue</h1>
          <p className="text-xs text-gray-500">
            Review applicant sister sellers, verify payout details, and grant vendor selling rights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-lg flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>{sellers.length} Pending Seller Applications</span>
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200/80 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-gray-600 font-medium">
                <th className="py-3 px-4 font-semibold">Seller Code & Shop</th>
                <th className="py-3 px-4 font-semibold">Member Identity</th>
                <th className="py-3 px-4 font-semibold">Associated Business</th>
                <th className="py-3 px-4 font-semibold">Type</th>
                <th className="py-3 px-4 font-semibold">Catalog Items</th>
                <th className="py-3 px-4 font-semibold">Payout Account</th>
                <th className="py-3 px-4 font-semibold">Application Date</th>
                <th className="py-3 px-4 font-semibold text-right">Review Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y overflow-x-auto divide-gray-100">
              {sellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-4 min-w-50">
                    <Link
                      href={`/admin/sellers/${seller.id}`}
                      className="font-bold text-gray-900 hover:text-[#5B46F6] transition-colors"
                    >
                      {seller.shopName}
                    </Link>
                    <div className="text-[11px] text-gray-400 font-mono mt-0.5">{seller.sellerCode}</div>
                  </td>

                  <td className="py-3.5 px-4 min-w-50">
                    <Link
                      href={`/admin/members/${seller.memberId}`}
                      className="font-semibold text-gray-800 hover:text-[#5B46F6] transition-colors"
                    >
                      {seller.memberName}
                    </Link>
                    <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                      {seller.memberId} • {seller.memberPhone}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 min-w-50">
                    {seller.businessId ? (
                      <Link
                        href={`/admin/businesses/${seller.businessId}`}
                        className="font-medium text-gray-800 hover:text-[#5B46F6] transition-colors"
                      >
                        {seller.businessName}
                      </Link>
                    ) : (
                      <span className="text-gray-400 italic">Individual Artisan</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 min-w-50">
                    <SellerTypeBadge type={seller.sellerType} />
                  </td>

                  <td className="py-3.5 px-4 min-w-50">
                    <div className="font-medium text-gray-900 flex items-center gap-1">
                      <ShoppingBag className="w-3.5 h-3.5 text-gray-400" />
                      <span>{seller.productCount} draft items</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-gray-800 flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-gray-400" />
                      <span>{seller.payoutAccountType}</span>
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono truncate max-w-[120px]">
                      {seller.payoutAccountNumber}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-gray-500">
                    {new Date(seller.joinedDate).toLocaleDateString()}
                  </td>

                  <td className="py-3.5 px-4 min-w-70 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/sellers/${seller.id}`}
                        title="View Full Application"
                        className="p-1.5 text-gray-500 hover:text-[#5B46F6] hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleUpdateStatus(seller.id, "APPROVED")}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-medium transition-colors shadow-xs"
                      >
                        Approve Seller
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(seller.id, "REJECTED")}
                        className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-[11px] font-medium transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sellers.length === 0 && (
          <div className="p-12 text-center text-gray-500 text-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <div className="font-semibold text-gray-800 text-sm">No pending seller applications</div>
            <p className="mt-1">All applicant seller accounts have been processed.</p>
          </div>
        )}
      </div>
    </div>
  );
}
