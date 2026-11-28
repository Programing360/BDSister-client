// Centralized API endpoint constants
// Synchronized with Express 5 Backend REST Endpoints across all 14 domains

export const API_ENDPOINTS = {
  // Domain 1: Authentication & Identity
  auth: {
    register: "/api/auth/register",
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
    updateMe: "/api/auth/me",
    updateContact: "/api/auth/me/contact",
    submitReview: "/api/auth/me/submit-review",
    exportPdf: "/api/auth/me/export-pdf",
    verifyEmail: "/api/auth/verify-email",
    resendVerification: "/api/auth/resend-verification",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",
  },

  // Domain 2: Users & Sisterhood Directory
  users: {
    me: "/api/users/me",
    list: "/api/users",
    directory: "/api/users",
    detail: (id: string) => `/api/users/${id}`,
    profile: "/api/users/profile",
  },

  // Domain 3: Business Profiles & Directory
  business: {
    list: "/api/businesses",
    create: "/api/business/create",
    my: "/api/business/my",
    detail: (id: string) => `/api/business/${id}`,
    brandDetail: (slugOrId: string) => `/api/business/brands/${slugOrId}`,
    updateBrand: (businessId: string, brandId: string) =>
      `/api/business/${businessId}/brands/${brandId}`,
    deleteBrand: (businessId: string, brandId: string) =>
      `/api/business/${businessId}/brands/${brandId}`,
    trackBrandClick: (brandId: string, businessId?: string) =>
      businessId
        ? `/api/business/${businessId}/brands/${brandId}/click`
        : `/api/business/brands/${brandId}/click`,
    affiliateClick: (businessId: string, brandId?: string) =>
      brandId
        ? `/api/business/${businessId}/brands/${brandId}/click`
        : `/api/business/${businessId}/click`,
    subscription: (id: string) => `/api/business/${id}/subscription`,
  },
  brands: {
    detail: (slugOrId: string) => `/api/business/brands/${slugOrId}`,
    trackClick: (brandId: string, businessId?: string) =>
      businessId
        ? `/api/business/${businessId}/brands/${brandId}/click`
        : `/api/business/brands/${brandId}/click`,
  },

  // Reviews & Community Ratings
  reviews: {
    list: "/api/reviews",
    create: "/api/reviews",
    updateStatus: (id: string) => `/api/reviews/${id}`,
    byBrand: (brandId: string) => `/api/reviews?targetType=Brand&targetId=${brandId}`,
    byProduct: (productId: string) => `/api/reviews?targetType=Product&productId=${productId}`,
  },
  // Alias for backward compatibility
  businesses: {
    list: "/api/businesses",
    create: "/api/business/create",
    my: "/api/business/my",
    detail: (id: string) => `/api/business/${id}`,
    update: (id: string) => `/api/business/${id}`,
    delete: (id: string) => `/api/business/${id}`,
  },


  // Domain 4: E-Commerce & Marketplace (Synchronized with ecommerce.routes.ts)
  ecommerce: {
    products: "/api/ecommerce/products",
    createProduct: "/api/ecommerce/products/add",
    productDetail: (id: string) => `/api/ecommerce/products/${id}`,
    updateProduct: (id: string) => `/api/ecommerce/products/${id}`,
    deleteProduct: (id: string) => `/api/ecommerce/products/${id}`,
    cart: "/api/ecommerce/cart",
    addToCart: "/api/ecommerce/cart/add",
    removeFromCart: (itemId: string) => `/api/ecommerce/cart/${itemId}`,
    clearCart: "/api/ecommerce/cart",
    orders: "/api/ecommerce/orders",
    createOrder: "/api/ecommerce/orders/create",
    myOrders: "/api/ecommerce/orders/my",
    sellerOrders: "/api/ecommerce/orders/seller",
    updateOrderStatus: (id: string) => `/api/ecommerce/orders/${id}/status`,
    reviews: (productId: string) => `/api/ecommerce/reviews/${productId}`,
    productReviews: (productId: string) => `/api/ecommerce/reviews/${productId}`,
    orderReviews: (orderId: string) => `/api/ecommerce/reviews/${orderId}`,
  },
  // Alias for backward compatibility
  marketplace: {
    products: "/api/ecommerce/products",
    productDetail: (slugOrId: string) => `/api/ecommerce/products/${slugOrId}`,
  },

  // Domain 5: Community & Forum
  forum: {
    posts: "/api/forum/posts",
    categories: "/api/forum/categories",
    createCategory: "/api/forum/categories",
    updateCategory: (id: string) => `/api/forum/categories/${id}`,
    deleteCategory: (id: string) => `/api/forum/categories/${id}`,
    createPost: "/api/forum/posts/create",
    postDetail: (id: string) => `/api/forum/posts/${id}`,
    moderatePost: (id: string) => `/api/forum/posts/${id}/moderate`,
    updatePost: (id: string) => `/api/forum/posts/${id}`,
    deletePost: (id: string) => `/api/forum/posts/${id}`,
    addComment: (id: string) => `/api/forum/posts/${id}/comment`,
    comments: (id: string) => `/api/forum/posts/${id}/comment`,
    postComments: (id: string) => `/api/forum/posts/${id}/comments`,
    like: (id: string) => `/api/forum/posts/${id}/like`,
    report: (id: string) => `/api/forum/posts/${id}/report`,
  },

  // Alias for backward compatibility
  community: {
    posts: "/api/forum/posts",
    postDetail: (id: string) => `/api/forum/posts/${id}`,
  },

  // Domain 6: Events & Workshops
  events: {
    list: "/api/events",
    archiveList: "/api/events?filter=past",
    myRegistrations: "/api/events/my-registrations",
    create: "/api/events/create",
    detail: (id: string) => `/api/events/${id}`,
    update: (id: string) => `/api/events/${id}`,
    delete: (id: string) => `/api/events/${id}`,
    register: (id: string) => `/api/events/${id}/register`,
    rsvp: (id: string) => `/api/events/${id}/register`,
    ticket: (id: string) => `/api/events/${id}/register`,
    cancel: (id: string) => `/api/events/${id}`,
    archive: (id: string) => `/api/events/${id}/archive`,
  },
  // Domain 7: Resource Library & LMS
  resources: {
    list: "/api/resources",
    detail: (id: string) => `/api/resources/${id}`,
    download: (id: string) => `/api/resources/${id}/download`,
    trackDownload: (id: string) => `/api/resources/${id}/download`,
    create: "/api/resources",
    update: (id: string) => `/api/resources/${id}`,
    delete: (id: string) => `/api/resources/${id}`,
  },

  // Domain 8: Discover Yourself & Goal Tracking
  goals: {
    list: "/api/goals",
    create: "/api/goals",
    update: (id: string) => `/api/goals/${id}`,
    delete: (id: string) => `/api/goals/${id}`,
    wheel: "/api/goals/wheel",
  },

  // Domain 9: CMS & Website Content
  cms: {
    pages: "/api/cms/pages",
    navigation: "/api/cms/navigation",
    page: (slug: string) => `/api/cms/pages/${slug}`,
    lookups: "/api/cms/lookups",
    blocks: "/api/cms/blocks",
    blockDetail: (id: string) => `/api/cms/blocks/${id}`,
    createBlock: "/api/cms/blocks",
    updateBlockDirect: (id: string) => `/api/cms/blocks/${id}`,
    deleteBlockDirect: (id: string) => `/api/cms/blocks/${id}`,
    adminPages: "/api/cms/admin/pages",
    createPage: "/api/cms/admin/pages",
    pageDetail: (id: string) => `/api/cms/admin/pages/${id}`,
    updatePage: (id: string) => `/api/cms/admin/pages/${id}`,
    deletePage: (id: string) => `/api/cms/admin/pages/${id}`,
    addBlock: (pageId: string) => `/api/cms/admin/pages/${pageId}/blocks`,
    updateBlock: (pageId: string, blockId: string) =>
      `/api/cms/admin/pages/${pageId}/blocks/${blockId}`,
    deleteBlock: (pageId: string, blockId: string) =>
      `/api/cms/admin/pages/${pageId}/blocks/${blockId}`,
    reorderBlocks: (pageId: string) => `/api/cms/admin/pages/${pageId}/reorder-blocks`,
  },

  // Domain 10: In-App Notifications
  notifications: {
    list: "/api/notifications",
    markRead: (id: string) => `/api/notifications/${id}/read`,
    unreadCount: "/api/notifications/unread-count",
    adminHistory: "/api/notifications/admin/history",
    adminDelete: (id: string) => `/api/notifications/admin/${id}`,
  },

  // Domain 11: Contact Inquiries
  contact: {
    submit: "/api/contact",
  },

  // Domain 12: Newsletter Subscription
  newsletter: {
    subscribe: "/api/newsletter/subscribe",
  },

  // Domain 13: Payments & ZiniPay Gateway
  payment: {
    zinipayInit: "/api/payment/zinipay/init",
    zinipayVerify: "/api/payment/zinipay/verify",
    zinipayWebhook: "/api/payment/zinipay/webhook",
    invoices: "/api/payment/zinipay/invoices",
  },

  // Domain 14: Admin Operations & Governance
  admin: {
    analytics: "/api/admin/analytics",
    pendingUsers: "/api/admin/users/pending",
    pendingVerification: "/api/admin/users/pending",
    userDetail: (id: string) => `/api/admin/users/${id}`,
    userNid: (id: string) => `/api/admin/users/${id}`,
    updateUserStatus: (id: string) => `/api/admin/users/${id}/status`,
    updateUserRole: (id: string) => `/api/admin/users/${id}/role`,
    businesses: "/api/admin/businesses",
    updateBusinessSubscription: (id: string) => `/api/admin/businesses/${id}/subscription`,
    approveSubscription: (id: string) => `/api/admin/businesses/${id}/subscription`,
    auditLogs: "/api/admin/audit-logs",
    payments: "/api/admin/payments",
    tasks: "/api/admin/tasks",
    taskDetail: (id: string) => `/api/admin/tasks/${id}`,
    apiKeys: "/api/admin/api-keys",
    partnerKeys: "/api/admin/api-keys",
    revokeApiKey: (id: string) => `/api/admin/api-keys/${id}/revoke`,

    // Synchronized with cms.routes.ts (/api/cms/admin/*)
    cmsPages: "/api/cms/admin/pages",
    createPage: "/api/cms/admin/pages",
    pageDetail: (id: string) => `/api/cms/admin/pages/${id}`,
    updatePage: (id: string) => `/api/cms/admin/pages/${id}`,
    deletePage: (id: string) => `/api/cms/admin/pages/${id}`,
    addBlock: (pageId: string) => `/api/cms/admin/pages/${pageId}/blocks`,
    updateBlock: (pageId: string, blockId: string) =>
      `/api/cms/admin/pages/${pageId}/blocks/${blockId}`,
    deleteBlock: (pageId: string, blockId: string) =>
      `/api/cms/admin/pages/${pageId}/blocks/${blockId}`,
    reorderBlocks: (pageId: string) => `/api/cms/admin/pages/${pageId}/reorder-blocks`,

    // Master Profile Lookups (admin.routes.ts)
    createLookup: "/api/admin/lookups",
    deleteLookup: (id: string) => `/api/admin/lookups/${id}`,

    // Communication & Newsletters (communication.routes.ts)
    contactMessages: "/api/admin/contact-messages",
    updateContactMessage: (id: string) => `/api/admin/contact-messages/${id}`,
    newsletterSubscribers: "/api/admin/newsletter/subscribers",
  },

  // Utility upload endpoint
  upload: {
    image: "/api/upload/image",
  },

  // Member & Admin Identity Verification
  verification: {
    memberStatus: "/api/auth/me",
    memberSubmit: "/api/auth/me/submit-review",
    adminList: "/api/admin/users/pending",
    adminDetail: (id: string) => `/api/admin/users/${id}`,
    adminReview: (id: string) => `/api/admin/users/${id}/status`,
    adminDocument: (id: string) => `/api/admin/users/${id}`,
  },
} as const;