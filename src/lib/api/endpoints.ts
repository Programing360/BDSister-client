// Centralized API endpoint constants
// All API paths defined here — no hardcoded strings in components

export const API_ENDPOINTS = {
  auth: {
    session: "/api/auth/get-session",
    signIn: "/api/auth/sign-in/email",
    signOut: "/api/auth/sign-out",
    signUp: "/api/auth/sign-up/email",
    forgotPassword: "/api/auth/forget-password",
    resetPassword: "/api/auth/reset-password",
    verifyEmail: "/api/auth/verify-email",
  },

  users: {
    list: "/api/users",
    detail: (id: string) => `/api/users/${id}`,
    profile: "/api/users/profile",
  },

  businesses: {
    list: "/api/businesses",
    detail: (id: string) => `/api/businesses/${id}`,
    create: "/api/businesses",
    update: (id: string) => `/api/businesses/${id}`,
    delete: (id: string) => `/api/businesses/${id}`,
  },

  marketplace: {
    products: "/api/products",
    productDetail: (slug: string) => `/api/products/${slug}`,
  },

  events: {
    list: "/api/events",
    detail: (slug: string) => `/api/events/${slug}`,
  },

  community: {
    posts: "/api/community/posts",
    postDetail: (id: string) => `/api/community/posts/${id}`,
  },

  upload: {
    image: "/api/upload/image",
  },
} as const;
