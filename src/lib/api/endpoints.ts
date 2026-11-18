// Centralized API endpoint constants
// All 62 BDSisters.org Backend REST Endpoints mapped cleanly across 14 functional domains
// Payment endpoints standardized on ZiniPay (/api/payment/zinipay/*)

export const API_ENDPOINTS = {
  // Domain 1: Authentication & Identity (10 endpoints)
  auth: {
    register: "/api/auth/register",
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
    updateContact: "/api/auth/me/contact",
    submitReview: "/api/auth/me/submit-review",
    exportPdf: "/api/auth/export-pdf",
    verifyEmail: "/api/auth/verify-email",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",

    // Backwards-compatible aliases for existing Better-Auth integration
    session: "/api/auth/get-session",
    signIn: "/api/auth/sign-in/email",
    signOut: "/api/auth/sign-out",
    signUp: "/api/auth/sign-up/email",
  },

  // Domain 2: Users & Sisterhood Directory (2 endpoints)
  users: {
    list: "/api/users",
    detail: (id: string) => `/api/users/${id}`,
    profile: "/api/users/profile",
  },

  // Domain 3: Business Profiles & Directory (7 endpoints)
  business: {
    list: "/api/business",
    create: "/api/business",
    detail: (id: string) => `/api/business/${id}`,
    update: (id: string) => `/api/business/${id}`,
    delete: (id: string) => `/api/business/${id}`,
    affiliateClick: (id: string) => `/api/business/${id}/affiliate-click`,
    subscription: (id: string) => `/api/business/${id}/subscription`,
  },
  // Alias for backward compatibility
  businesses: {
    list: "/api/business",
    create: "/api/business",
    detail: (id: string) => `/api/business/${id}`,
    update: (id: string) => `/api/business/${id}`,
    delete: (id: string) => `/api/business/${id}`,
  },

  // Domain 4: E-Commerce, Marketplace & Orders (12 endpoints)
  ecommerce: {
    products: "/api/ecommerce/products",
    productDetail: (id: string) => `/api/ecommerce/products/${id}`,
    createProduct: "/api/ecommerce/products",
    updateProduct: (id: string) => `/api/ecommerce/products/${id}`,
    deleteProduct: (id: string) => `/api/ecommerce/products/${id}`,
    cart: "/api/ecommerce/cart",
    addToCart: "/api/ecommerce/cart",
    removeCartItem: (itemId: string) => `/api/ecommerce/cart/${itemId}`,
    checkout: "/api/ecommerce/checkout",
    orders: "/api/ecommerce/orders",
    orderDetail: (id: string) => `/api/ecommerce/orders/${id}`,
    orderReviews: (id: string) => `/api/ecommerce/orders/${id}/reviews`,
  },
  // Alias for backward compatibility
  marketplace: {
    products: "/api/ecommerce/products",
    productDetail: (slugOrId: string) => `/api/ecommerce/products/${slugOrId}`,
  },

  // Domain 5: Community & Forum (9 endpoints)
  forum: {
    categories: "/api/forum/categories",
    posts: "/api/forum/posts",
    createPost: "/api/forum/posts",
    postDetail: (id: string) => `/api/forum/posts/${id}`,
    updatePost: (id: string) => `/api/forum/posts/${id}`,
    deletePost: (id: string) => `/api/forum/posts/${id}`,
    comments: (id: string) => `/api/forum/posts/${id}/comments`,
    like: (id: string) => `/api/forum/posts/${id}/like`,
    report: (id: string) => `/api/forum/posts/${id}/report`,
  },
  // Alias for backward compatibility
  community: {
    posts: "/api/forum/posts",
    postDetail: (id: string) => `/api/forum/posts/${id}`,
  },

  // Domain 6: Events & Workshops (5 endpoints)
  events: {
    list: "/api/events",
    detail: (slugOrId: string) => `/api/events/${slugOrId}`,
    rsvp: (id: string) => `/api/events/${id}/rsvp`,
    ticket: (id: string) => `/api/events/${id}/ticket`,
    archive: "/api/events/archive",
  },

  // Domain 7: Resource Library & LMS (3 endpoints)
  resources: {
    list: "/api/resources",
    detail: (id: string) => `/api/resources/${id}`,
    download: (id: string) => `/api/resources/${id}/download`,
  },

  // Domain 8: Discover Yourself & Goal Tracking (5 endpoints)
  goals: {
    list: "/api/goals",
    create: "/api/goals",
    update: (id: string) => `/api/goals/${id}`,
    delete: (id: string) => `/api/goals/${id}`,
    wheel: "/api/goals/wheel",
  },

  // Domain 9: CMS & Website Content (4 endpoints)
  cms: {
    navigation: "/api/cms/navigation",
    page: (slug: string) => `/api/cms/pages/${slug}`,
    blocks: "/api/cms/blocks",
    tooltips: "/api/cms/tooltips",
  },

  // Domain 10: In-App Notifications (3 endpoints)
  notifications: {
    list: "/api/notifications",
    markRead: (id: string) => `/api/notifications/${id}/read`,
    unreadCount: "/api/notifications/unread-count",
  },

  // Domain 11: Contact Inquiries (1 endpoint)
  contact: {
    submit: "/api/contact",
  },

  // Domain 12: Newsletter Subscription (1 endpoint)
  newsletter: {
    subscribe: "/api/newsletter/subscribe",
  },

  // Domain 13: Payments & ZiniPay Gateway (4 endpoints)
  payment: {
    zinipayInit: "/api/payment/zinipay/init",
    zinipayVerify: "/api/payment/zinipay/verify",
    zinipayWebhook: "/api/payment/zinipay/webhook",
    invoices: "/api/payment/zinipay/invoices",
  },

  // Domain 14: Admin Operations & Governance (7 endpoints)
  admin: {
    analytics: "/api/admin/analytics",
    pendingVerification: "/api/admin/users/pending-verification",
    userNid: (id: string) => `/api/admin/users/${id}/nid`,
    approveSubscription: (id: string) => `/api/admin/subscriptions/${id}/approve`,
    updatePage: (id: string) => `/api/admin/cms/pages/${id}`,
    auditLogs: "/api/admin/audit-logs",
    partnerKeys: "/api/admin/partner-keys",
  },

  // Utility upload endpoint
  upload: {
    image: "/api/upload/image",
  },
} as const;
