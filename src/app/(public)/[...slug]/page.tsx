import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { FileText, Calendar, Tag, ShieldCheck, Sparkles } from "lucide-react";
import { cmsService } from "@/lib/services/cms-service";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

const RESERVED_PREFIXES = new Set([
  "api",
  "admin",
  "member",
  "auth",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
]);

function isInvalidSlug(slugParts: string[]): boolean {
  if (!slugParts || slugParts.length === 0) return true;
  const first = slugParts[0]?.toLowerCase() || "";
  const last = slugParts[slugParts.length - 1]?.toLowerCase() || "";
  const joined = slugParts.join("/").toLowerCase();

  // Block hidden/dot files, Chrome DevTools probes, .well-known paths, and file extensions
  if (
    first.startsWith(".") ||
    first.startsWith("_") ||
    slugParts.some((part) => part.startsWith(".")) ||
    joined.includes(".well-known") ||
    joined.includes("chrome-devtools") ||
    RESERVED_PREFIXES.has(first) ||
    slugParts.some((part) => part.toLowerCase() === "api") ||
    /\.(json|ico|png|jpg|jpeg|webp|svg|map|txt|xml)$/i.test(last)
  ) {
    return true;
  }
  return false;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug ?? [];

  // Immediately reject DevTools, .well-known, and static asset probes before touching CMS service
  if (
    !slug.length ||
    slug[0]?.startsWith(".") ||
    slug[0]?.startsWith("_") ||
    slug.join("/").includes(".well-known") ||
    /\.(json|ico|png|jpg|jpeg|webp|svg|map|txt|xml)$/i.test(slug[slug.length - 1] ?? "") ||
    isInvalidSlug(slug)
  ) {
    notFound();
  }

  const slugPath = slug.join("/");
  const page = await cmsService.getPageBySlug(slugPath);

  if (!page) {
    return {
      title: "Page Not Found | BDSisters.org",
      description: "The requested content page could not be found.",
    };
  }

  return {
    title: `${page.title} | BDSisters.org`,
    description: page.metaDescription || page.subtitle || "BDSisters.org community content and resources.",
  };
}

export default async function DynamicCmsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug ?? [];

  // Immediately reject DevTools, .well-known, and static asset probes before touching CMS service
  if (
    !slug.length ||
    slug[0]?.startsWith(".") ||
    slug[0]?.startsWith("_") ||
    slug.join("/").includes(".well-known") ||
    /\.(json|ico|png|jpg|jpeg|webp|svg|map|txt|xml)$/i.test(slug[slug.length - 1] ?? "") ||
    isInvalidSlug(slug)
  ) {
    notFound();
  }

  const slugPath = slug.join("/");
  const page = await cmsService.getPageBySlug(slugPath);

  if (!page) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: page.title },
  ];

  const formattedDate = page.publishedAt
    ? new Date(page.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "January 2026";

  return (
    <div className="flex flex-col bg-background min-h-screen">
      {/* Breadcrumb strip */}
      <div className="border-b border-border/80 bg-white/70 backdrop-blur-md py-3.5 sticky top-[72px] z-20">
        <Container size="lg">
          <Breadcrumb items={breadcrumbItems} />
        </Container>
      </div>

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-border/80 bg-white pt-14 pb-16 sm:pt-18 sm:pb-20">
        <div className="pointer-events-none absolute -top-40 right-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <Container size="md">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary shadow-xs">
              <Sparkles className="h-4 w-4" />
              <span>BDSisters Official Publication</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary">
              {page.title}
            </h1>

            {page.subtitle && (
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                {page.subtitle}
              </p>
            )}

            <div className="flex items-center gap-4 text-xs text-text-secondary pt-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span>Updated: {formattedDate}</span>
              </div>
              {page.author && (
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>By {page.author}</span>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content Body */}
      <Section spacing="lg" className="bg-background">
        <Container size="md">
          <div className="rounded-3xl border border-border/80 bg-white p-6 sm:p-12 shadow-card space-y-8 text-sm sm:text-base text-text-secondary leading-relaxed">
            <div className="prose max-w-none prose-headings:font-bold prose-headings:text-text-primary prose-a:text-primary hover:prose-a:underline whitespace-pre-line">
              {page.content}
            </div>

            {page.tags && page.tags.length > 0 && (
              <div className="border-t border-border/80 pt-6 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-text-secondary font-semibold mr-1">
                  <Tag className="h-3.5 w-3.5" />
                  <span>Topics:</span>
                </div>
                {page.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-surface border border-border/80 px-3 py-1 text-xs font-medium text-text-primary"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </div>
  );
}
