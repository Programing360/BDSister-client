import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResourceCard } from "@/features/public/resources/components/resource-card";
import { ResourceDownloadAction } from "@/features/public/resources/components/resource-download-action";
import { publicService } from "@/features/public/services/public-service";
import {
  FileText,
  Download,
  CheckCircle2,
  ShieldCheck,
  User,
  Sparkles,
  ArrowRight,
  Layers,
  FileCheck,
  FolderLock,
  ExternalLink,
} from "lucide-react";

interface ResourceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ResourceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = await publicService.getResourceBySlug(slug);

  if (!resource) {
    return {
      title: "Resource Not Found | BDSisters.org",
    };
  }

  return {
    title: `${resource.title} | BDSisters Resource Library`,
    description: resource.description,
  };
}

export default async function ResourceDetailPage({
  params,
}: ResourceDetailPageProps) {
  const { slug } = await params;
  const resource = await publicService.getResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  const allResources = await publicService.getResources();
  const relatedResources = allResources
    .filter((r) => r.slug !== resource.slug)
    .slice(0, 3);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Resources", href: "/resources" },
    { label: resource.title },
  ];

  return (
    <div className="flex flex-col bg-background min-h-screen">
      {/* Breadcrumb strip */}
      <div className="border-b border-border/80 bg-white/70 backdrop-blur-md py-3.5 sticky top-[72px] z-20">
        <Container size="lg">
          <Breadcrumb items={breadcrumbItems} />
        </Container>
      </div>

      <Section spacing="lg" className="pt-6 sm:pt-10">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-8">
              {/* Cover Banner */}
              <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-card">
                <Image
                  src={resource.coverImage || "/images/placeholders/resource-1.jpg"}
                  alt={resource.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                  priority
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholders/resource-1.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-primary shadow-sm backdrop-blur-md">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    <span>{resource.category}</span>
                  </span>
                  <span className="inline-flex items-center rounded-full bg-text-primary/80 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-md uppercase font-mono">
                    {resource.format || resource.type || "PDF"} • {resource.fileSize || "2.4 MB"}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-medium">
                  <div className="backdrop-blur-sm bg-black/40 px-3.5 py-1.5 rounded-full flex items-center gap-2">
                    <span>Curated by:</span>
                    <strong className="text-white font-bold">{resource.author}</strong>
                  </div>
                </div>
              </div>

              {/* Title and Metadata */}
              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-text-primary leading-tight tracking-tight">
                  {resource.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-text-secondary border-b border-border/80 pb-4">
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-primary" />
                    <span>Authored by: <strong className="text-text-primary">{resource.author}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-text-primary">
                    <Download className="h-4 w-4 text-primary" />
                    <span>{(resource.downloadCount ?? 340).toLocaleString()} Sisters Downloaded</span>
                  </div>
                  {resource.readTime && (
                    <span className="text-neutral hidden sm:inline">• {resource.readTime}</span>
                  )}
                </div>
              </div>

              {/* Overview & Purpose */}
              <div className="rounded-3xl border border-border/80 bg-white p-6 sm:p-8 shadow-card space-y-4">
                <h2 className="text-lg sm:text-xl font-bold text-text-primary">
                  Toolkit Overview &amp; Context
                </h2>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed whitespace-pre-line">
                  {resource.description}
                </p>
              </div>

              {/* What is Included Inside */}
              <div className="rounded-3xl border border-border/80 bg-white p-6 sm:p-8 shadow-card space-y-6">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold text-text-primary">
                    What is Included in This Toolkit
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 rounded-2xl bg-surface/60 p-4 border border-border/60">
                    <FileCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="font-bold text-text-primary block mb-0.5">Editable Source File</strong>
                      <span className="text-text-secondary">Fully customizable in Microsoft Office, Google Workspace, or PDF readers.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl bg-surface/60 p-4 border border-border/60">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="font-bold text-text-primary block mb-0.5">Bangladesh Legal Compliance</strong>
                      <span className="text-text-secondary">Reviewed under Bangladesh Contract Act and standard trade guidelines.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl bg-surface/60 p-4 border border-border/60">
                    <Layers className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="font-bold text-text-primary block mb-0.5">Pre-Filled Real Scenarios</strong>
                      <span className="text-text-secondary">Includes practical sample data from local businesses to guide your edits.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl bg-surface/60 p-4 border border-border/60">
                    <FolderLock className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <strong className="font-bold text-text-primary block mb-0.5">Lifetime Version Updates</strong>
                      <span className="text-text-secondary">Any future regulatory revisions will be automatically available for re-download.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {resource.tags && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-surface border border-border/60 px-3 py-1 text-xs font-medium text-text-secondary"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Vetted Seal */}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 flex items-start gap-3.5 text-xs text-text-secondary">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-text-primary mb-1">
                    BDSisters Verified Knowledge Standard
                  </h4>
                  <p className="leading-relaxed">
                    This material has been vetted by legal advisors and business mentors from the Muhsina Foundation network to protect women entrepreneurs from predatory clauses and ensure contractual clarity.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Sticky Download Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                <div className="rounded-3xl border border-border/80 bg-white p-6 sm:p-7 shadow-card space-y-6">
                  {/* Digital Asset Header */}
                  <div className="flex items-center gap-3.5 border-b border-border/80 pb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-md">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-text-primary">Free Digital Asset</h3>
                      <span className="text-xs text-emerald-600 font-semibold">Ready for Instant Download</span>
                    </div>
                  </div>

                  {/* Specs List */}
                  <div className="space-y-3.5 text-xs text-text-secondary">
                    <div className="flex items-center justify-between">
                      <span>Format</span>
                      <strong className="text-text-primary uppercase">{resource.format || resource.type || "PDF"}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>File Size</span>
                      <strong className="text-text-primary">{resource.fileSize || "2.4 MB"}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Licensing</span>
                      <strong className="text-text-primary">Commercial &amp; Personal Use</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Language</span>
                      <strong className="text-text-primary">Bilingual (Bangla + English)</strong>
                    </div>
                  </div>

                  {/* Download Action */}
                  <div className="border-t border-border/80 pt-5">
                    <ResourceDownloadAction resource={resource} />
                  </div>

                  {/* Open Source / Community Guarantee */}
                  <div className="rounded-2xl border border-border/80 bg-surface/50 p-4 text-xs text-text-secondary space-y-1.5">
                    <p className="font-semibold text-text-primary">Zero Hidden Fees</p>
                    <p className="leading-relaxed">
                      All toolkits in our library are 100% free under Muhsina Foundation's open-access educational charter.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Resources Carousel / Grid */}
          {relatedResources.length > 0 && (
            <div className="mt-20 border-t border-border pt-16">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    Curated Knowledge Assets
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight mt-1">
                    Related Templates &amp; Guides
                  </h3>
                </div>
                <Link
                  href="/resources"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-heading-accent transition-colors"
                >
                  <span>Browse all resources</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedResources.map((r) => (
                  <ResourceCard key={r.id} resource={r} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
