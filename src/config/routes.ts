// ============================================================
// Centralized Route Constants — BDSisters.org
// ============================================================

export const ROUTES = {
  // --- Public ---
  home: "/",
  about: "/about",
  aboutMuhsina: "/about/muhsina",
  aboutMissionVision: "/about/mission-vision",
  aboutTeam: "/about/our-team",
  community: "/community",
  businesses: "/businesses",
  businessDetails: (slug: string) => `/businesses/${slug}`,
  marketplace: "/marketplace",
  productDetails: (slug: string) => `/marketplace/${slug}`,
  events: "/events",
  eventDetails: (slug: string) => `/events/${slug}`,
  learning: "/learning",
  learningDetails: (slug: string) => `/learning/${slug}`,
  resources: "/resources",
  resourceDetails: (slug: string) => `/resources/${slug}`,
  contact: "/contact",
  faq: "/faq",
  privacyPolicy: "/privacy-policy",
  terms: "/terms",

  // --- Auth ---
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  authCallback: "/auth/callback",

  // --- Admin ---
  admin: {
    login: "/admin/login",
    dashboard: "/admin",
    members: "/admin/members",
    memberDetails: (id: string) => `/admin/members/${id}`,
    verifications: "/admin/verifications",
    profiles: "/admin/profiles",
    businesses: "/admin/businesses",
    businessDetails: (id: string) => `/admin/businesses/${id}`,
    products: "/admin/products",
    categories: "/admin/categories",
    orders: "/admin/orders",
    orderDetails: (id: string) => `/admin/orders/${id}`,
    payments: "/admin/payments",
    subscriptions: "/admin/subscriptions",
    community: "/admin/community",
    communityPosts: "/admin/community/posts",
    communityReports: "/admin/community/reports",
    events: "/admin/events",
    learning: "/admin/learning",
    resources: "/admin/resources",
    jobs: "/admin/jobs",
    messages: "/admin/messages",
    notifications: "/admin/notifications",
    support: "/admin/support",
    analytics: "/admin/analytics",
    roles: "/admin/roles",
    settings: "/admin/settings",
    settingsProfile: "/admin/settings/profile",
    settingsSecurity: "/admin/settings/security",
    settingsSystem: "/admin/settings/system",
    activityLogs: "/admin/activity-logs",
  },

  // --- Member ---
  member: {
    dashboard: "/member",
    profile: "/member/profile",
    profileEdit: "/member/profile/edit",
    profilePrivacy: "/member/profile/privacy",
    profileVerification: "/member/profile/verification",
    business: "/member/business",
    businessCreate: "/member/business/create",
    businessDetails: (id: string) => `/member/business/${id}`,
    businessEdit: (id: string) => `/member/business/${id}/edit`,
    shop: "/member/shop",
    shopProducts: "/member/shop/products",
    shopProductCreate: "/member/shop/products/create",
    shopProductEdit: (id: string) => `/member/shop/products/${id}/edit`,
    orders: "/member/orders",
    orderDetails: (id: string) => `/member/orders/${id}`,
    marketplace: "/member/marketplace",
    marketplaceProduct: (slug: string) => `/member/marketplace/${slug}`,
    wishlist: "/member/wishlist",
    skills: "/member/skills",
    learning: "/member/learning",
    courses: "/member/courses",
    jobs: "/member/jobs",
    events: "/member/events",
    community: "/member/community",
    communityPosts: "/member/community/posts",
    messages: "/member/messages",
    notifications: "/member/notifications",
    membership: "/member/membership",
    billing: "/member/billing",
    settings: "/member/settings",
    settingsSecurity: "/member/settings/security",
    settingsPrivacy: "/member/settings/privacy",
    support: "/member/support",
  },
} as const;

// Protected route prefixes — used in middleware
export const PROTECTED_ROUTE_PREFIXES = {
  admin: "/admin",
  member: "/member",
} as const;

// Admin-only routes prefix
export const ADMIN_ROUTE_PREFIX = "/admin";

// Member-only routes prefix
export const MEMBER_ROUTE_PREFIX = "/member";

// Auth routes that should redirect if already logged in
export const AUTH_ROUTES = [
  ROUTES.login,
  ROUTES.register,
  ROUTES.forgotPassword,
  ROUTES.resetPassword,
  ROUTES.verifyEmail,
] as const;

// Admin login is separate
export const ADMIN_LOGIN_ROUTE = ROUTES.admin.login;
