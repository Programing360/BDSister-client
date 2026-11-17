/**
 * BDSisters.org — Centralized Design Tokens (TypeScript)
 * 
 * Exact brand color specifications:
 * - Primary Background: Light Lavender (#EAE6F7)
 * - Primary Brand / Accent: Purple (#5B46F6)
 * - Heading Accent: Soft Purple (#7366F7)
 * - Primary Text: Dark Gray (#111827)
 * - Secondary Text: Gray (#4B5563)
 * - Surface / Glass Card: Light Gray (#F3F4F6)
 * - Neutral / Logo: Gray (#9CA3AF)
 * - Button Text: White (#FFFFFF)
 */

export const BRAND_COLORS = {
  // Primary Brand Identity (Mandatory)
  background: "#EAE6F7",
  primary: "#5B46F6",
  headingAccent: "#7366F7",
  textPrimary: "#111827",
  textSecondary: "#4B5563",
  surface: "#F3F4F6",
  neutral: "#9CA3AF",
  buttonText: "#FFFFFF",

  // Supporting Design Tokens
  white: "#FFFFFF",
  border: "#DDD8EA",
  borderSubtle: "rgba(221, 216, 234, 0.6)",
  muted: "#F8F7FC",
  focus: "#5B46F6",

  // Primary Hover & Active states
  primaryHover: "#4C37E6",
  primaryActive: "#3E29D4",
  primarySoft: "#EEECFE",

  // Semantic Feedback Tokens
  success: "#10B981",
  successForeground: "#FFFFFF",
  successSoft: "#ECFDF5",
  warning: "#F59E0B",
  warningForeground: "#FFFFFF",
  warningSoft: "#FFFBEB",
  danger: "#EF4444",
  dangerForeground: "#FFFFFF",
  dangerSoft: "#FEF2F2",
  info: "#3B82F6",
  infoForeground: "#FFFFFF",
  infoSoft: "#EFF6FF",
} as const;

export const GRADIENTS = {
  primary: "linear-gradient(135deg, #5B46F6 0%, #7366F7 100%)",
  lavender: "linear-gradient(135deg, #EAE6F7 0%, #F3F4F6 100%)",
  surface: "linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 100%)",
  glass: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(243, 244, 246, 0.78) 100%)",
} as const;

export const SHADOWS = {
  subtle: "0 1px 2px 0 rgba(17, 24, 39, 0.05)",
  card: "0 4px 6px -1px rgba(91, 70, 246, 0.06), 0 2px 4px -2px rgba(17, 24, 39, 0.05)",
  elevated: "0 10px 15px -3px rgba(91, 70, 246, 0.08), 0 4px 6px -4px rgba(17, 24, 39, 0.05)",
  glass: "0 8px 32px 0 rgba(91, 70, 246, 0.08)",
} as const;

export const RADII = {
  sm: "0.375rem",  // 6px
  md: "0.5rem",    // 8px
  lg: "0.75rem",   // 12px
  xl: "1rem",      // 16px
  "2xl": "1.5rem", // 24px
  full: "9999px",
} as const;

export const TYPOGRAPHY = {
  fonts: {
    sans: 'var(--font-sans), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  sizes: {
    display: { size: "3.5rem", lineHeight: "1.1", weight: "700" },
    h1: { size: "2.25rem", lineHeight: "1.2", weight: "700" },
    h2: { size: "1.75rem", lineHeight: "1.25", weight: "600" },
    h3: { size: "1.375rem", lineHeight: "1.3", weight: "600" },
    h4: { size: "1.125rem", lineHeight: "1.4", weight: "600" },
    bodyLg: { size: "1.125rem", lineHeight: "1.6", weight: "400" },
    body: { size: "1rem", lineHeight: "1.6", weight: "400" },
    small: { size: "0.875rem", lineHeight: "1.5", weight: "400" },
    caption: { size: "0.75rem", lineHeight: "1.4", weight: "500" },
  },
} as const;
