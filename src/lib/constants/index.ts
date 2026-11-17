export const APP_NAME = "BDSisters";

export const PAGINATION_DEFAULTS = {
  page: 1,
  pageSize: 12,
  maxPageSize: 100,
} as const;

export const IMAGE_SIZES = {
  avatar: { width: 128, height: 128 },
  thumbnail: { width: 400, height: 300 },
  banner: { width: 1200, height: 400 },
} as const;

export const MEMBERSHIP_TIERS = {
  FREE: "FREE",
  BASIC: "BASIC",
  PREMIUM: "PREMIUM",
  ENTERPRISE: "ENTERPRISE",
} as const;

export const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
