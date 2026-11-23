/**
 * CMS & Content Service for BDSisters.org (Domain 9)
 * Interacts with /api/cms REST endpoints with reliable fallbacks.
 */

import { apiClient } from "../api/client.ts";
import { API_ENDPOINTS } from "../api/endpoints.ts";
import type {
  GlossaryTooltip,
  CmsNavigationItem,
  CmsPageContent,
  CmsBlock,
} from "../../types/cms-client.ts";
import { publicNavItems } from "../../config/public-navigation.ts";

export const CURATED_TOOLTIPS: GlossaryTooltip[] = [
  {
    id: "tip_muhsina",
    term: "Muhsina",
    definition:
      "The philanthropic parent non-profit organization chartering BDSisters.org to uplift women with dignity, ethical values, and holistic socio-economic empowerment.",
    category: "Platform",
    learnMoreUrl: "/about/muhsina",
    relatedTerms: ["Sisterhood", "Social Impact"],
  },
  {
    id: "tip_halal_compliance",
    term: "Halal Compliance",
    definition:
      "Strict adherence to Islamic ethical principles: verified halal sourcing, cruelty-free processes, transparent pricing, and zero riba (interest) across all marketplace transactions.",
    category: "Islamic/Ethical",
    learnMoreUrl: "/about/mission-vision",
    relatedTerms: ["Ethical Commerce", "Shariah Guidelines"],
  },
  {
    id: "tip_prorated_renewal",
    term: "Prorated Renewal",
    definition:
      "Fair and transparent membership billing that calculates exact remaining days when upgrading or modifying plans, eliminating duplicate charges.",
    category: "Financial",
    learnMoreUrl: "/member/billing",
  },
  {
    id: "tip_trade_license",
    term: "Trade License",
    definition:
      "Mandatory municipal business authorization issued by City Corporations or Union Parishads in Bangladesh, required for Verified Seller status.",
    category: "Legal/Regulatory",
    learnMoreUrl: "/member/verification",
    relatedTerms: ["TIN Certificate", "BSTI Certification"],
  },
  {
    id: "tip_sisterhood_directory",
    term: "Sisterhood Directory",
    definition:
      "Our searchable member registry enabling verified sisters to connect, network, collaborate, and trade across Bangladesh's 8 administrative divisions and 64 districts.",
    category: "Sisterhood",
    learnMoreUrl: "/members",
  },
  {
    id: "tip_vital_few",
    term: "Vital Few",
    definition:
      "The top 20% high-leverage breakthrough goals that generate 80% of personal, spiritual, and commercial progress under the Pareto 80/20 Principle.",
    category: "Platform",
    learnMoreUrl: "/member/goals",
    relatedTerms: ["Pareto Principle", "Useful Many"],
  },
  {
    id: "tip_life_harmony_index",
    term: "Life Harmony Index",
    definition:
      "A weighted composite gauge (0-100%) tracking equilibrium across 8 life dimensions: Spiritual, Financial, Career, Emotional, Physical, Family, Community, and Personal Mastery.",
    category: "Platform",
    learnMoreUrl: "/member/goals",
  },
  {
    id: "tip_zinipay",
    term: "ZiniPay Secure",
    definition:
      "Our standardized enterprise payment gateway providing instant, encrypted checkout via bKash, Nagad, Rocket, Upay, and Visa/Mastercard with real-time invoice settlement.",
    category: "Financial",
  },
  {
    id: "tip_smart_nid",
    term: "Smart NID",
    definition:
      "Bangladesh Smart National Identity document, verified confidentially by authorized female officers only under AES-256 data protection standards.",
    category: "Legal/Regulatory",
    learnMoreUrl: "/member/profile/verification",
  },
  {
    id: "tip_bsti",
    term: "BSTI Certification",
    definition:
      "Official seal from the Bangladesh Standards and Testing Institution guaranteeing safety and quality compliance for skincare, cosmetics, and packaged food items.",
    category: "Legal/Regulatory",
    learnMoreUrl: "/businesses",
  },
];

function extractTooltip(raw: unknown): GlossaryTooltip | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const term =
    typeof obj["term"] === "string"
      ? obj["term"].trim()
      : typeof obj["name"] === "string"
        ? obj["name"].trim()
        : "";
  const definition =
    typeof obj["definition"] === "string"
      ? obj["definition"].trim()
      : typeof obj["description"] === "string"
        ? obj["description"].trim()
        : "";
  if (!term || !definition) return null;

  const validCategories: Array<GlossaryTooltip["category"]> = [
    "Platform",
    "Islamic/Ethical",
    "Legal/Regulatory",
    "Financial",
    "Sisterhood",
  ];
  const cat = typeof obj["category"] === "string" ? obj["category"] : "Platform";
  const category = validCategories.includes(cat as GlossaryTooltip["category"])
    ? (cat as GlossaryTooltip["category"])
    : "Platform";

  return {
    id:
      typeof obj["id"] === "string"
        ? obj["id"]
        : `tip_${term.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
    term,
    definition,
    category,
    learnMoreUrl:
      typeof obj["learnMoreUrl"] === "string"
        ? obj["learnMoreUrl"]
        : typeof obj["url"] === "string"
          ? obj["url"]
          : undefined,
    relatedTerms: Array.isArray(obj["relatedTerms"]) ? obj["relatedTerms"].map(String) : undefined,
  };
}

export const cmsService = {
  /**
   * Fetch all glossary tooltips for dynamic term resolution.
   * Extracts hoverTooltip entries from published CMS page blocks, or silently
   * uses the curated glossary dictionary without logging 404 warnings.
   */
  async getTooltips(): Promise<GlossaryTooltip[]> {
    const tooltipMap = new Map<string, GlossaryTooltip>();
    for (const tip of CURATED_TOOLTIPS) {
      tooltipMap.set(tip.term.toLowerCase(), tip);
    }

    try {
      // Query published CMS pages from backend to extract block tooltips
      const res = await apiClient.get<unknown[]>(API_ENDPOINTS.cms.pages);
      if (res.data && Array.isArray(res.data)) {
        for (const item of res.data) {
          if (!item || typeof item !== "object") continue;
          const page = item as Record<string, unknown>;

          // Direct hoverTooltip on page
          if (page["hoverTooltip"]) {
            if (Array.isArray(page["hoverTooltip"])) {
              for (const raw of page["hoverTooltip"]) {
                const parsed = extractTooltip(raw);
                if (parsed) tooltipMap.set(parsed.term.toLowerCase(), parsed);
              }
            } else {
              const parsed = extractTooltip(page["hoverTooltip"]);
              if (parsed) tooltipMap.set(parsed.term.toLowerCase(), parsed);
            }
          }

          // Blocks on page
          const blocks = Array.isArray(page["blocks"]) ? page["blocks"] : [];
          for (const rawBlock of blocks) {
            if (!rawBlock || typeof rawBlock !== "object") continue;
            const block = rawBlock as Record<string, unknown>;
            const blockTooltip =
              block["hoverTooltip"] ??
              (block["data"] as Record<string, unknown> | undefined)?.["hoverTooltip"];
            if (blockTooltip) {
              if (Array.isArray(blockTooltip)) {
                for (const raw of blockTooltip) {
                  const parsed = extractTooltip(raw);
                  if (parsed) tooltipMap.set(parsed.term.toLowerCase(), parsed);
                }
              } else {
                const parsed = extractTooltip(blockTooltip);
                if (parsed) tooltipMap.set(parsed.term.toLowerCase(), parsed);
              }
            }
          }
        }
      }
    } catch {
      // Backend not running, route not deployed, or 404; silently fall back to curated dictionary
    }

    return Array.from(tooltipMap.values());
  },

  /**
   * Fetch dynamic CMS menu structure
   */
  async getNavigation(): Promise<CmsNavigationItem[]> {
    try {
      const res = await apiClient.get<CmsNavigationItem[]>(API_ENDPOINTS.cms.navigation);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Backend not running or endpoint deferred, keep default static navigation
    }

    return publicNavItems as unknown as CmsNavigationItem[];
  },

  /**
   * Fetch CMS page content by slug
   */
  async getPageBySlug(slug: string): Promise<CmsPageContent | null> {
    const normalized = slug.replace(/^\/+|\/+$/g, "").toLowerCase();

    // Guard against malformed or recursive API paths
    if (!normalized || normalized.startsWith("api") || normalized.includes("api/")) {
      return null;
    }

    try {
      const res = await apiClient.get<CmsPageContent>(API_ENDPOINTS.cms.page(normalized));
      if (res.data) return res.data;
    } catch (err) {
      console.warn(`[CmsService] Page API for slug '${normalized}' deferred:`, (err as Error).message);
    }

    // Curated dynamic fallbacks for known legal and CMS pages
    if (normalized === "community-guidelines") {
      return {
        id: "cms_guidelines",
        slug: "community-guidelines",
        title: "BDSisters Sisterhood Community Guidelines",
        subtitle: "Mutual respect, ethical integrity, and sisterly safety standards.",
        publishedAt: "2026-01-15T00:00:00Z",
        content: `
### 1. Sisterly Dignity & Respect
BDSisters.org is a sanctuary for positive development, entrepreneurial growth, and mutual support. Harassment, abusive language, discrimination, and sectarian discord are strictly prohibited.

### 2. Ethical Commercial Integrity
All sister businesses, artisans, and service providers must uphold halal practices, transparent pricing, and genuine product depictions. Deceptive advertising, unregistered MLM schemes, and unverified medical claims result in immediate account suspension.

### 3. Privacy & Female-Only Sanctuary
Personal phone numbers, NID documents, and private sister interactions must remain confidential. Screenshots or unauthorized sharing of internal forum discussions outside the platform violates member trust.
        `,
      };
    }

    if (normalized === "terms" || normalized === "terms-of-service") {
      return {
        id: "cms_terms",
        slug: "terms",
        title: "Terms of Service",
        subtitle: "Platform policies and member charter for BDSisters.org.",
        publishedAt: "2026-01-01T00:00:00Z",
        content: `
### Agreement to Terms
By creating an account, accessing public resources, or purchasing on BDSisters.org, you agree to comply with our Terms of Service and Islamic ethical guidelines.

### Payments & Invoicing
All digital transactions are settled through our authorized payment partner ZiniPay in Bangladeshi Taka (BDT). Subscription renewals occur according to your chosen billing cycle with prorated credit options.
        `,
      };
    }

    return null;
  },

  /**
   * Fetch dynamic CMS blocks (e.g. HERO, STATS, TEAM)
   */
  async getBlocks(type?: string): Promise<CmsBlock[]> {
    try {
      const params = type ? { type } : undefined;
      const res = await apiClient.get<CmsBlock[]>(API_ENDPOINTS.cms.blocks, { params });
      if (res.data && Array.isArray(res.data)) return res.data;
    } catch (err) {
      console.warn("[CmsService] CMS blocks API deferred:", (err as Error).message);
    }
    return [];
  },
};
