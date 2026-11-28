import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/features/public/marketplace/components/product-card";
import { publicService } from "@/features/public/services/public-service";
import { AffiliateLink } from "@/features/public/businesses/components/affiliate-link";
import {
  MapPin,
  Star,
  BadgeCheck,
  Globe,
  Mail,
  Phone,
  ExternalLink,
  MessageCircle,
  Calendar,
  Package,
  Award,
  ArrowRight,
} from "lucide-react";

interface BusinessDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BusinessDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await publicService.getBusinessBySlug(slug);

  if (!business) {
    return {
      title: "Business Not Found | BDSisters.org",
    };
  }

  return {
    title: `${business.name} | Verified Women-Led Business on BDSisters.org`,
    description: business.description,
  };
}

export default async function BusinessDetailPage({
  params,
}: BusinessDetailPageProps) {
  const { slug } = await params;
  const business = await publicService.getBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

  const allProducts = await publicService.getProducts();
  const businessProducts = allProducts.filter(
    (p) =>
      p.sellerSlug === business.slug ||
      p.businessName?.toLowerCase() === business.name.toLowerCase()
  );
  const relatedBusinesses = (await publicService.getBusinesses())
    .filter((b) => b.id !== business.id && b.category === business.category)
    .slice(0, 3);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Businesses", href: "/businesses" },
    { label: business.name },
  ];

  const founderName = business.founder ?? business.ownerName ?? "Artisan Leader";
  const founderRole = business.ownerRole ?? "Founder & Managing Director";
  const isVerified = Boolean(business.verified ?? business.isVerified);
  const coverImage = business.coverImage || "/images/placeholders/biz-cover-1.jpg";

  return (
    <div className="flex flex-col pt-24 sm:pt-28">
      {/* Top Breadcrumb Bar */}
      <div className="bg-surface/70 border-b border-border/80 py-3.5">
        <Container size="lg">
          <Breadcrumb items={breadcrumbItems} />
        </Container>
      </div>

      {/* 1. LARGE HERO COVER BANNER */}
      <div className="relative h-64 sm:h-80 lg:h-96 w-full bg-surface overflow-hidden">
        <Image
          src={coverImage}
          alt={business.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        <Container size="lg" className="relative h-full flex items-end pb-8 z-10">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 text-white w-full">
            {/* Brand Monogram Box */}
            <div className="flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-3xl border-4 border-white bg-primary text-2xl sm:text-3xl font-black text-white shadow-floating">
              {business.name.slice(0, 2).toUpperCase()}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge
                  variant="neutral"
                  size="sm"
                  className="bg-white/90 text-text-primary backdrop-blur-md font-semibold"
                >
                  {business.category}
                </Badge>
                {isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/95 px-3 py-0.5 text-xs font-bold text-white shadow-xs">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    <span>Verified Enterprise</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                {business.name}
              </h1>

              <p className="mt-1.5 text-sm sm:text-base text-white/90 font-medium max-w-2xl">
                {business.tagline || business.description.slice(0, 110) + "..."}
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. MAIN PROFILE BODY */}
      <Section spacing="lg" className="bg-white">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Content Area (8 Cols) */}
            <div className="lg:col-span-8 space-y-10">
              {/* About the Enterprise */}
              <div>
                <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">
                  About the Enterprise
                </h2>
                <div className="mt-4 text-sm sm:text-base text-text-secondary leading-relaxed space-y-4 font-normal">
                  <p>{business.description}</p>
                  <p>
                    Rooted in sustainable practices and community empowerment, this enterprise
                    adheres to the ethical charter of BDSisters.org. By prioritizing ethical
                    sourcing, direct artisan payments, and quality assurance, they represent the
                    vanguard of women-led commerce in Bangladesh.
                  </p>
                </div>

                {/* Tags */}
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  {business.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-xl bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Leadership Attribution Card */}
              <div className="rounded-3xl border border-white/90 bg-surface/60 p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Founder Leadership
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-text-primary">
                    {founderName}
                  </h3>
                  <p className="text-xs text-text-secondary font-medium">{founderRole}</p>
                  <p className="mt-2 text-xs text-text-secondary leading-relaxed max-w-md">
                    Passionate female founder championing ethical employment and indigenous craftsmanship in {business.location}.
                  </p>
                </div>

                <Link href="/contact">
                  <Button variant="outline" size="sm" className="border-border bg-white shrink-0">
                    <MessageCircle className="h-4 w-4 mr-1.5" />
                    <span>Inquire with Founder</span>
                  </Button>
                </Link>
              </div>

              {/* Products by this Business */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">
                      Artisan Creations &amp; Offerings
                    </h2>
                    <p className="text-xs sm:text-sm text-text-secondary mt-1">
                      Direct from {business.name} with zero platform commission deductions.
                    </p>
                  </div>
                  <Link
                    href="/marketplace"
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    View All Marketplace →
                  </Link>
                </div>

                {businessProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {businessProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-border bg-surface/40 p-8 text-center text-xs text-text-secondary">
                    <Package className="h-8 w-8 text-neutral mx-auto mb-2" />
                    <span>Products currently undergoing catalog renewal. Check back soon!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar Area (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick Info & Verification Card */}
              <div className="rounded-3xl border border-white/90 bg-surface/70 p-6 sm:p-8 shadow-card space-y-6">
                <h3 className="font-extrabold text-lg text-text-primary">
                  Enterprise Details
                </h3>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-text-primary block">Operating Location</span>
                      <span className="text-text-secondary">{business.location}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-text-primary block">Reputation Score</span>
                      <span className="text-text-secondary">
                        {business.rating.toFixed(1)} / 5.0 ({business.reviewCount ?? 18} community reviews)
                      </span>
                    </div>
                  </div>

                  {business.establishedYear && (
                    <div className="flex items-start gap-3">
                      <Calendar className="h-4 w-4 text-heading-accent shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-text-primary block">Established</span>
                        <span className="text-text-secondary">{business.establishedYear}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Award className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-text-primary block">Trust Tier</span>
                      <span className="text-text-secondary">
                        {isVerified ? "Level 2 Verified Merchant" : "Registered Community Enterprise"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Contacts */}
                <div className="pt-6 border-t border-border/80 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-secondary block">
                    Direct Contact Actions
                  </span>

                  {business.phone && (
                    <a
                      href={`tel:${business.phone}`}
                      className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-semibold text-text-primary shadow-xs hover:border-primary hover:text-primary transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        <span>{business.phone}</span>
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-neutral" />
                    </a>
                  )}

                  {business.contactEmail && (
                    <a
                      href={`mailto:${business.contactEmail}`}
                      className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-semibold text-text-primary shadow-xs hover:border-primary hover:text-primary transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        <span>{business.contactEmail}</span>
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-neutral" />
                    </a>
                  )}

                  {business.website && (
                    <AffiliateLink
                      businessId={business.id}
                      href={business.website.startsWith("http") ? business.website : `https://${business.website}`}
                      className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-semibold text-text-primary shadow-xs hover:border-primary hover:text-primary transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary" />
                        <span>Official Website</span>
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-neutral" />
                    </AffiliateLink>
                  )}
                </div>
              </div>

              {/* Related Businesses */}
              {relatedBusinesses.length > 0 && (
                <div className="rounded-3xl border border-white/90 bg-white p-6 shadow-card space-y-4">
                  <h3 className="font-extrabold text-base text-text-primary">
                    Related {business.category} Brands
                  </h3>
                  <div className="space-y-3">
                    {relatedBusinesses.map((rb) => (
                      <Link
                        key={rb.id}
                        href={`/businesses/${rb.slug}`}
                        className="group flex items-center gap-3 rounded-2xl p-2.5 hover:bg-surface transition-colors"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                          {rb.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-text-primary truncate group-hover:text-primary">
                            {rb.name}
                          </h4>
                          <span className="text-[11px] text-text-secondary truncate block">
                            {rb.location}
                          </span>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-neutral group-hover:text-primary" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
