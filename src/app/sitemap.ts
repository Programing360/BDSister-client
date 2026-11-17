import type { MetadataRoute } from "next";
import {
  mockBusinesses,
  mockProducts,
  mockEvents,
  mockCourses,
  mockResources,
} from "@/features/public/data/mock-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://bdsisters.org";

  const staticRoutes = [
    "",
    "/about",
    "/about/muhsina",
    "/about/mission-vision",
    "/about/our-team",
    "/community",
    "/businesses",
    "/marketplace",
    "/events",
    "/learning",
    "/resources",
    "/contact",
    "/faq",
    "/privacy-policy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const businessRoutes = mockBusinesses.map((b) => ({
    url: `${baseUrl}/businesses/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const productRoutes = mockProducts.map((p) => ({
    url: `${baseUrl}/marketplace/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const eventRoutes = mockEvents.map((e) => ({
    url: `${baseUrl}/events/${e.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const courseRoutes = mockCourses.map((c) => ({
    url: `${baseUrl}/learning/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const resourceRoutes = mockResources.map((r) => ({
    url: `${baseUrl}/resources/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...businessRoutes,
    ...productRoutes,
    ...eventRoutes,
    ...courseRoutes,
    ...resourceRoutes,
  ];
}
