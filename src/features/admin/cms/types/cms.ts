/**
 * BDSisters.org - Step 12: CMS & Website Content Management
 * TypeScript Domain Types for Headless CMS, Page Builder & Content Administration
 */

export type PageType =
  | "STANDARD"
  | "LANDING"
  | "INFORMATIONAL"
  | "CAMPAIGN"
  | "CUSTOM";

export type PageStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "PUBLISHED"
  | "SCHEDULED"
  | "ARCHIVED";

export type SectionType =
  | "HERO"
  | "TEXT_IMAGE"
  | "ABOUT"
  | "MISSION_VISION"
  | "STATS"
  | "FEATURE_GRID"
  | "CARD_GRID"
  | "GALLERY"
  | "TESTIMONIALS"
  | "TEAM"
  | "CTA"
  | "FAQ"
  | "CONTACT"
  | "NEWSLETTER"
  | "CUSTOM";

export interface CMSSection {
  id: string;
  sectionType: SectionType;
  title: string;
  subtitle?: string;
  content?: string;
  isVisible: boolean;
  order: number;
  layoutConfig?: {
    align?: "left" | "center" | "right";
    columns?: number;
    backgroundColor?: string;
    showImage?: boolean;
    imagePosition?: "left" | "right" | "top";
  };
  ctaText?: string;
  ctaUrl?: string;
  imageUrl?: string;
  items?: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
    imageUrl?: string;
    badge?: string;
    linkUrl?: string;
  }>;
}

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  pageType: PageType;
  coverImageUrl?: string;
  contentSummary: string;
  author: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  status: PageStatus;
  lastUpdated: string;
  seoStatus: "OPTIMIZED" | "NEEDS_REVIEW" | "MISSING";
  visibility: "PUBLIC" | "MEMBERS_ONLY" | "UNLISTED";
  sections: CMSSection[];
  createdAt: string;
  publishedAt?: string;
  scheduledAt?: string;
}

export type NavigationLocation = "PRIMARY" | "FOOTER" | "UTILITY" | "MOBILE";

export interface CMSNavigationItem {
  id: string;
  label: string;
  url: string;
  location: NavigationLocation;
  parentId?: string;
  displayOrder: number;
  openInNewTab: boolean;
  isVisible: boolean;
  groupName?: string;
  children?: CMSNavigationItem[];
}

export type BannerType =
  | "HERO_BANNER"
  | "PROMOTIONAL"
  | "ANNOUNCEMENT_BAR"
  | "EVENT_BANNER"
  | "CAMPAIGN";

export type BannerStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "ACTIVE"
  | "EXPIRED"
  | "ARCHIVED";

export interface CMSBanner {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  bannerType: BannerType;
  imageUrl?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  startDate: string;
  endDate: string;
  displayLocation:
    | "HOMEPAGE_TOP"
    | "HOMEPAGE_HERO"
    | "ALL_PAGES_HEADER"
    | "MARKETPLACE"
    | "EVENTS";
  status: BannerStatus;
  clicksCount: number;
  impressionsCount: number;
}

export interface SEOSettings {
  id: string;
  pageId: string;
  pageTitle: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  metaRobots: "index, follow" | "noindex, follow" | "index, nofollow" | "noindex, nofollow";
  ogTitle: string;
  ogDescription: string;
  ogImageUrl?: string;
  twitterCard: "summary" | "summary_large_image";
  score: number; // 0 - 100
  missingFields: string[];
  lastChecked: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteContentItem {
  id: string;
  contentType:
    | "ABOUT"
    | "MISSION"
    | "ORGANIZATION"
    | "CONTACT"
    | "PRIVACY"
    | "TERMS"
    | "GUIDELINES";
  title: string;
  content: string;
  status: "PUBLISHED" | "DRAFT";
  lastUpdated: string;
  updatedBy: string;
  version: number;
}

export interface MediaAsset {
  id: string;
  fileName: string;
  mediaType: "IMAGE" | "DOCUMENT" | "VIDEO_PREVIEW";
  dimensions?: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  url: string;
  altText: string;
  usageCount: number;
  uploadDate: string;
  status: "ACTIVE" | "ARCHIVED";
}

export interface ContentReview {
  id: string;
  contentId: string;
  contentTitle: string;
  contentType: "PAGE" | "HOMEPAGE" | "BANNER" | "FAQ" | "POLICY";
  submittedBy: string;
  submittedAt: string;
  reviewStatus:
    | "PENDING"
    | "UNDER_REVIEW"
    | "APPROVED"
    | "REJECTED"
    | "CHANGES_REQUESTED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface ContentRevision {
  id: string;
  contentId: string;
  contentTitle: string;
  contentType: string;
  revisionNumber: number;
  editorName: string;
  editorEmail: string;
  changeSummary: string;
  revisionDate: string;
  status: "ACTIVE" | "SUPERSEDED" | "RESTORED";
}

export interface CMSKpis {
  totalPages: number;
  publishedPages: number;
  draftPages: number;
  scheduledPages: number;
  totalSections: number;
  activeBanners: number;
  pendingReviewsCount: number;
  mediaCount: number;
}
