/**
 * CMS & Tooltip Types for BDSisters.org (Domain 9)
 */

export interface GlossaryTooltip {
  id: string;
  term: string;
  definition: string;
  category: "Platform" | "Islamic/Ethical" | "Legal/Regulatory" | "Financial" | "Sisterhood";
  learnMoreUrl?: string;
  relatedTerms?: string[];
}

export interface CmsNavigationItem {
  label: string;
  href: string;
  children?: Array<{
    label: string;
    href: string;
    description?: string;
  }>;
}

export interface CmsPageContent {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  metaDescription?: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  tags?: string[];
}

export interface CmsBlock {
  id: string;
  slug: string;
  type: "HERO" | "STATS" | "TEAM" | "FEATURE" | "TESTIMONIAL";
  title: string;
  data: Record<string, unknown>;
}
