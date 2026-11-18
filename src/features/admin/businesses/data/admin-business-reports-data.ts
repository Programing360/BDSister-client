/**
 * BDSisters.org - Admin Business Moderation Reports Demo Data
 * Step 6: Business Management & Seller Administration
 */

import type { BusinessReportItem } from "../types/admin-business.ts";

export const DEMO_BUSINESS_REPORTS: BusinessReportItem[] = [
  {
    id: "rep_01",
    businessId: "biz_108",
    businessCode: "BDS-BIZ-108",
    businessName: "Dhaka Quick Capital & Direct Schemes",
    reporterId: "BDS-MEM-10484",
    reporterName: "Rasheda Khatun",
    reporterEmail: "rasheda.khatun@example.com",
    reason: "FRAUD_SCAM",
    description: "Applicant company is running an unlicensed multi-level marketing pyramid scheme targeting low-income female home-tailors with upfront joining charges.",
    priority: "URGENT",
    status: "RESOLVED",
    resolutionNotes: "Entity suspended permanently after investigation confirmed unauthorized micro-loan and recruitment tactics.",
    createdAt: "2026-07-19T11:00:00Z",
    resolvedAt: "2026-07-20T14:00:00Z",
    resolvedBy: "Admin Sadia Rahman",
  },
  {
    id: "rep_02",
    businessId: "biz_108",
    businessCode: "BDS-BIZ-108",
    businessName: "Dhaka Quick Capital & Direct Schemes",
    reporterId: "BDS-MEM-10486",
    reporterName: "Tahmina Anam",
    reporterEmail: "tahmina.anam@example.com",
    reason: "IMPERSONATION",
    description: "Claimed official endorsement from BDSisters executive leadership in WhatsApp flyers without authorization.",
    priority: "HIGH",
    status: "RESOLVED",
    resolutionNotes: "Merged into primary fraud investigation case rep_01 and entity banned.",
    createdAt: "2026-07-19T14:30:00Z",
    resolvedAt: "2026-07-20T14:00:00Z",
    resolvedBy: "Admin Sadia Rahman",
  },
  {
    id: "rep_03",
    businessId: "biz_106",
    businessCode: "BDS-BIZ-106",
    businessName: "Rasheda Wholesale Commodities & Trade",
    reporterId: "BDS-MEM-10492",
    reporterName: "Nusrat Jahan",
    reporterEmail: "nusrat.jahan@example.com",
    reason: "MISLEADING_CONTENT",
    description: "Wholesale importer pretending to be a grassroots cottage craft producer to gain vendor privileges on BDSisters platform.",
    priority: "NORMAL",
    status: "RESOLVED",
    resolutionNotes: "Application audited and formally rejected due to commercial mismatch.",
    createdAt: "2026-10-03T09:20:00Z",
    resolvedAt: "2026-10-04T15:00:00Z",
    resolvedBy: "Admin Sadia Rahman",
  },
  {
    id: "rep_04",
    businessId: "biz_103",
    businessCode: "BDS-BIZ-103",
    businessName: "Sylhet Natural Botanicals & Wellness",
    reporterId: "BDS-MEM-10487",
    reporterName: "Afsana Mimi",
    reporterEmail: "afsana.mimi@example.com",
    reason: "FAKE_INFORMATION",
    description: "Questioned whether the botanical laboratory certificates were issued by an accredited authority.",
    priority: "LOW",
    status: "DISMISSED",
    resolutionNotes: "Verified authentic BSTI lab submission tracking number directly with Dr. Mahmuda Begum.",
    createdAt: "2026-11-15T11:45:00Z",
    resolvedAt: "2026-11-16T10:15:00Z",
    resolvedBy: "Admin Sadia Rahman",
  },
  {
    id: "rep_05",
    businessId: "biz_101",
    businessCode: "BDS-BIZ-101",
    businessName: "Nilambari Jamdani & Heritage Silk",
    reporterId: "BDS-MEM-10490",
    reporterName: "Sabrina Akter",
    reporterEmail: "sabrina.akter@example.com",
    reason: "COPYRIGHT_VIOLATION",
    description: "Inquiry regarding proprietary Tangail motif usage rights on an upcoming collaborative product line.",
    priority: "LOW",
    status: "INVESTIGATING",
    resolutionNotes: "Contacted artisan master weaver to verify open cultural heritage motif permissions.",
    createdAt: "2026-11-16T16:00:00Z",
  },
];

export function getAllBusinessReports(): BusinessReportItem[] {
  return [...DEMO_BUSINESS_REPORTS];
}

export function getBusinessReportsByStatus(status: string): BusinessReportItem[] {
  if (!status || status === "ALL") return [...DEMO_BUSINESS_REPORTS];
  return DEMO_BUSINESS_REPORTS.filter((r) => r.status === status);
}

export function getBusinessReportsByBusinessId(businessId: string): BusinessReportItem[] {
  return DEMO_BUSINESS_REPORTS.filter((r) => r.businessId === businessId);
}
