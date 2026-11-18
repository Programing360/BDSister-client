"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Calendar,
  CheckCircle,
  Edit,
  Globe,
  Layers,
  Mail,
  MapPin,
  Phone,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
  TrendingUp,
  User,
  X,
} from "lucide-react";

import type {
  AdminBusinessItem,
  BusinessApprovalStatus,
} from "../types/admin-business.ts";

import {
  BusinessStatusBadge,
  BusinessVerificationBadge,
} from "./business-status-badges.tsx";

import { BusinessReviewDialog } from "./business-review-dialog.tsx";

interface BusinessDetailsViewProps {
  business: AdminBusinessItem;
}

type MetricCardProps = {
  label: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
};

type DetailItemProps = {
  label: string;
  value?: React.ReactNode;
};

const cardClass =
  "rounded-xl border border-gray-200 bg-white";

const sectionTitleClass =
  "text-sm font-semibold text-gray-900";

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
}: MetricCardProps) {
  return (
    <div className={`${cardClass} p-4`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-gray-500">
          {label}
        </p>

        <Icon className="h-4 w-4 shrink-0 text-gray-400" />
      </div>

      <p className="mt-3 text-xl font-semibold tracking-tight text-gray-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        {description}
      </p>
    </div>
  );
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-xs text-gray-400">
        {label}
      </p>

      <div className="text-sm font-medium text-gray-800 break-words">
        {value || "Not provided"}
      </div>
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  action,
  children,
}: {
  title: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className={`${cardClass} min-w-0`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
        <h2 className="flex min-w-0 items-center gap-2 text-sm font-semibold text-gray-900">
          {Icon && (
            <Icon className="h-4 w-4 shrink-0 text-gray-500" />
          )}

          <span>{title}</span>
        </h2>

        {action}
      </div>

      <div className="p-5">
        {children}
      </div>
    </section>
  );
}

function ContactRow({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

      <div className="min-w-0 flex-1 text-sm text-gray-600 break-words">
        {children}
      </div>
    </div>
  );
}

export function BusinessDetailsView({
  business: initialBusiness,
}: BusinessDetailsViewProps) {
  const [business, setBusiness] =
    useState<AdminBusinessItem>(initialBusiness);

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  const notify = (message: string) => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    setToastMessage(message);

    toastTimer.current = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleReviewAction = (
    businessId: string,
    action: BusinessApprovalStatus,
    notes: string,
    rejectionReason?: string
  ) => {
    setBusiness((prev) => ({
      ...prev,
      status: action,
      moderationNotes: notes || prev.moderationNotes,
      rejectionReason:
        action === "REJECTED" ? rejectionReason : undefined,
      suspensionReason:
        action === "SUSPENDED" ? rejectionReason : undefined,
      approvedAt:
        action === "APPROVED"
          ? new Date().toISOString()
          : prev.approvedAt,
      approvedBy:
        action === "APPROVED"
          ? "Current Admin (You)"
          : prev.approvedBy,
    }));

    setIsReviewOpen(false);
    notify(`Business status updated to ${action.replace("_", " ")}`);
  };

  const toggleFeatured = () => {
    const nextFeatured = !business.isFeatured;

    setBusiness((prev) => ({
      ...prev,
      isFeatured: nextFeatured,
      featuredOrder: nextFeatured ? 1 : undefined,
    }));

    notify(
      nextFeatured
        ? "Business added to featured listings."
        : "Business removed from featured listings."
    );
  };

  const formattedRevenue = (
    business.totalRevenueBDT / 1000
  ).toLocaleString();

  const submittedDate = business.submittedAt
    ? new Date(business.submittedAt).toLocaleDateString()
    : "Not available";

  return (
    <div className="min-w-0 space-y-6 pb-8">

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-start justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3"
        >
          <div className="flex min-w-0 items-start gap-2">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

            <p className="text-sm text-emerald-800 break-words">
              {toastMessage}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Dismiss notification"
            className="shrink-0 rounded-md p-1 text-emerald-700 hover:bg-emerald-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Page Navigation and Actions */}
      <div className="flex flex-col gap-4">
        <Link
          href="/admin/businesses"
          className="inline-flex w-fit items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Businesses
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 sm:text-xl">
              Business Overview
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Review business information and manage its account.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleFeatured}
              className={`inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${business.isFeatured
                ? "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
            >
              <Star
                className={`h-4 w-4 ${business.isFeatured
                  ? "fill-amber-400 text-amber-500"
                  : ""
                  }`}
              />

              {business.isFeatured ? "Featured" : "Feature Business"}
            </button>

            <Link
              href={`/admin/businesses/${business.id}/edit`}
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Edit className="h-4 w-4" />
              Edit Business
            </Link>

            <button
              type="button"
              onClick={() => setIsReviewOpen(true)}
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-800"
            >
              <ShieldCheck className="h-4 w-4" />
              Review Business
            </button>
          </div>
        </div>
      </div>

      {/* Business Profile */}
      <section className={`${cardClass} overflow-hidden`}>
        {/* Cover Image */}
        <div className="relative h-36 bg-gray-100 sm:h-48">
          {business.coverImage ? (
            <img
              src={business.coverImage}
              alt={`${business.name} cover`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Building2 className="h-12 w-12 text-gray-300" />
            </div>
          )}

          <div className="absolute right-3 top-3">
            <span className="rounded-md border border-white/70 bg-white/95 px-3 py-1.5 font-mono text-xs text-gray-700 shadow-sm">
              {business.businessCode}
            </span>
          </div>
        </div>

        {/* Business Identity */}
        <div className="px-4 pb-5 sm:px-6">
          <div className=" flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end">
              <div className="h-20 w-20 shrink-0 rounded-xl border-4 border-white bg-white shadow-sm sm:h-24 sm:w-24">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                  {business.logo ? (
                    <img
                      src={business.logo}
                      alt={`${business.name} logo`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-9 w-9 text-gray-300" />
                  )}
                </div>
              </div>

              <div className="min-w-0 pb-1">
                <h2 className="break-words text-xl font-semibold text-gray-900 sm:text-2xl">
                  {business.name}
                </h2>

                {business.nameBn && (
                  <p className="mt-1 break-words text-sm text-gray-500">
                    {business.nameBn}
                  </p>
                )}

                {business.tagline && (
                  <p className="mt-1 break-words text-sm text-gray-500">
                    {business.tagline}
                  </p>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                  <span className="font-medium text-gray-700">
                    {business.category}
                  </span>

                  <span className="text-gray-300">•</span>

                  <span>{business.businessType}</span>

                  <span className="text-gray-300">•</span>

                  <span>
                    Established {business.yearEstablished || "2022"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pb-1">
              <BusinessStatusBadge status={business.status} />

              <BusinessVerificationBadge
                status={business.verificationStatus}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Business Metrics */}
      <section>
        <div className="mb-3">
          <h2 className={sectionTitleClass}>
            Business Performance
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Overview of business activity and performance.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          <MetricCard
            label="Products"
            value={business.productCount}
            description="In marketplace"
            icon={ShoppingBag}
          />

          <MetricCard
            label="Orders"
            value={business.orderCount}
            description="Total orders"
            icon={Layers}
          />

          <MetricCard
            label="Gross Revenue"
            value={`৳${formattedRevenue}k`}
            description="Platform GMV"
            icon={TrendingUp}
          />

          <MetricCard
            label="Rating"
            value={
              business.rating > 0
                ? business.rating.toFixed(1)
                : "N/A"
            }
            description={`${business.reviewCount} reviews`}
            icon={Star}
          />

          <MetricCard
            label="Employees"
            value={business.employeeRange || "1-5"}
            description="Artisan / Staff"
            icon={User}
          />

          <MetricCard
            label="Shop Status"
            value={business.hasActiveShop ? "Active" : "Catalog"}
            description={
              business.hasActiveShop
                ? "Store is active"
                : "Catalog only"
            }
            icon={Building2}
          />
        </div>
      </section>

      {/* Main Content */}
      <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-3">

        {/* Left Content */}
        <div className="min-w-0 space-y-5 xl:col-span-2">

          {/* About Business */}
          <SectionCard title="About the Business">
            <div className="space-y-4">
              {business.shortDescription && (
                <p className="text-sm font-medium leading-6 text-gray-800 break-words">
                  {business.shortDescription}
                </p>
              )}

              {business.fullDescription && (
                <p className="whitespace-pre-line text-sm leading-7 text-gray-600 break-words">
                  {business.fullDescription}
                </p>
              )}

              {!business.shortDescription &&
                !business.fullDescription && (
                  <p className="text-sm text-gray-400">
                    No business description has been provided.
                  </p>
                )}
            </div>

            {business.tags && business.tags.length > 0 && (
              <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="mb-3 text-xs font-medium text-gray-500">
                  Business Categories & Tags
                </p>

                <div className="flex flex-wrap gap-2">
                  {business.tags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>

          {/* Verification & Compliance */}
          <SectionCard
            title="Verification & Compliance"
            icon={ShieldCheck}
            action={
              <Link
                href="/admin/businesses/verifications"
                className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                View verifications
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            }
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <DetailItem
                label="Verification Status"
                value={
                  <BusinessVerificationBadge
                    status={business.verificationStatus}
                    size="sm"
                  />
                }
              />

              <DetailItem
                label="Registration Type"
                value="Trade License (City/Pourashava)"
              />

              <DetailItem
                label="Submission Date"
                value={submittedDate}
              />

              <DetailItem
                label="Review Officer"
                value={business.approvedBy || "Pending Assignment"}
              />
            </div>

            {business.moderationNotes && (
              <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-semibold text-gray-600">
                  Administrative Notes
                </p>

                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700 break-words">
                  {business.moderationNotes}
                </p>
              </div>
            )}

            {business.rejectionReason && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-xs font-semibold text-red-800">
                  Rejection Reason
                </p>

                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-red-700 break-words">
                  {business.rejectionReason}
                </p>
              </div>
            )}

            {business.suspensionReason && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-semibold text-amber-800">
                  Suspension Grounds
                </p>

                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-amber-700 break-words">
                  {business.suspensionReason}
                </p>
              </div>
            )}
          </SectionCard>

          {/* Business Gallery */}
          {business.galleryImages &&
            business.galleryImages.length > 0 && (
              <SectionCard title="Business Gallery">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {business.galleryImages.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
                    >
                      <img
                        src={image}
                        alt={`${business.name} gallery image ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
        </div>

        {/* Right Sidebar */}
        <aside className="min-w-0 space-y-5">

          {/* Owner Information */}
          <SectionCard title="Owner Information" icon={User}>
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                <User className="h-5 w-5 text-gray-400" />
              </div>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/members/${business.ownerId}`}
                  className="block break-words text-sm font-semibold text-gray-900 transition-colors hover:text-gray-600"
                >
                  {business.ownerName}
                </Link>

                <p className="mt-1 break-all font-mono text-xs text-gray-400">
                  {business.ownerId}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">
              <ContactRow icon={Mail}>
                {business.ownerEmail}
              </ContactRow>

              <ContactRow icon={Phone}>
                {business.ownerPhone}
              </ContactRow>
            </div>

            <Link
              href={`/admin/members/${business.ownerId}`}
              className="mt-5 flex min-h-10 w-full items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              View Member Profile
            </Link>
          </SectionCard>

          {/* Business Location */}
          <SectionCard title="Business Location" icon={MapPin}>
            <div className="space-y-3">
              {business.location.address && (
                <DetailItem
                  label="Street Address"
                  value={business.location.address}
                />
              )}

              <DetailItem
                label="City"
                value={business.location.city}
              />

              <DetailItem
                label="District"
                value={business.location.district}
              />

              <DetailItem
                label="Division"
                value={business.location.division}
              />

              <DetailItem
                label="Country"
                value={business.location.country}
              />

              {business.location.postalCode && (
                <DetailItem
                  label="Postal Code"
                  value={business.location.postalCode}
                />
              )}
            </div>
          </SectionCard>

          {/* Business Contact */}
          <SectionCard title="Business Contact">
            <div className="space-y-4">
              <ContactRow icon={Mail}>
                {business.contact.email}
              </ContactRow>

              <ContactRow icon={Phone}>
                {business.contact.phone}
              </ContactRow>

              {business.contact.website && (
                <ContactRow icon={Globe}>
                  <a
                    href={business.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-gray-700 underline decoration-gray-300 underline-offset-2 transition-colors hover:text-gray-900"
                  >
                    {business.contact.website}
                  </a>
                </ContactRow>
              )}

              {business.contact.facebook && (
                <ContactRow icon={Share2}>
                  <a
                    href={business.contact.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 underline decoration-gray-300 underline-offset-2 hover:text-gray-900"
                  >
                    Facebook Page
                  </a>
                </ContactRow>
              )}

              {business.contact.instagram && (
                <ContactRow icon={Share2}>
                  <a
                    href={business.contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 underline decoration-gray-300 underline-offset-2 hover:text-gray-900"
                  >
                    Instagram Profile
                  </a>
                </ContactRow>
              )}
            </div>
          </SectionCard>
        </aside>
      </div>

      {/* Review Dialog */}
      <BusinessReviewDialog
        business={business}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onSaveAction={handleReviewAction}
      />
    </div>
  );
}