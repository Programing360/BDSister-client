export const siteConfig = {
  name: "BDSisters",
  fullName: "BDSisters.org",
  description:
    "A community, professional networking, personal development, and e-commerce platform for Bangladeshi women.",
  url: process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000",
  ogImage: "/images/og-image.png",
  keywords: [
    "Bangladeshi women",
    "community",
    "networking",
    "e-commerce",
    "professional development",
    "BDSisters",
  ],
  author: {
    name: "BDSisters Team",
    url: "https://bdsisters.org",
  },
  social: {
    twitter: "",
    facebook: "",
    instagram: "",
    linkedin: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
