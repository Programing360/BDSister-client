import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { ProductGallery } from "@/features/public/marketplace/components/product-gallery";
import { ProductDetailActions } from "@/features/public/marketplace/components/product-detail-actions";
import { ProductCard } from "@/features/public/marketplace/components/product-card";
import { publicService } from "@/features/public/services/public-service";
import {
  Star,
  CheckCircle2,
  Building2,
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  HeartHandshake,
  Award,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await publicService.getProductBySlug(slug);

  if (!product) {
    return {
      title: "Artisan Product Not Found | BDSisters.org",
    };
  }

  return {
    title: `${product.name} | BDSisters Artisan Marketplace`,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await publicService.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await publicService.getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  const business = product.sellerSlug
    ? await publicService.getBusinessBySlug(product.sellerSlug)
    : null;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Marketplace", href: "/marketplace" },
    { label: product.name },
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
            {/* Left: Product Gallery */}
            <div className="lg:col-span-6">
              <div className="sticky top-28">
                <ProductGallery
                  name={product.name}
                  images={product.images || []}
                  category={product.category}
                />

                {/* Artisan Authenticity Guarantee Card */}
                <div className="mt-8 rounded-3xl border border-border/80 bg-white p-6 shadow-soft">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-text-primary">
                        BDSisters Artisan Trust Standard
                      </h4>
                      <p className="text-xs text-text-secondary">
                        100% Ethical & Fair-Wage Guarantee
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Every piece on BDSisters Marketplace is inspected for quality and authenticated to ensure the craftswoman receives dignified living wages without third-party commission deductions.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Product Details & Ordering */}
            <div className="lg:col-span-6 space-y-7">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="subtle" size="sm" className="font-semibold">
                    {product.category}
                  </Badge>
                  {product.inStock ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" /> In Stock & Ready to Ship
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                      Batch Sold Out
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text-primary tracking-tight leading-tight">
                  {product.name}
                </h1>

                {/* Seller & Rating Bar */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-border/80 py-3.5">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span className="text-xs sm:text-sm text-text-secondary">
                      Crafted by:{" "}
                      {product.sellerSlug ? (
                        <Link
                          href={`/businesses/${product.sellerSlug}`}
                          className="font-bold text-text-primary hover:text-primary transition-colors underline decoration-primary/40 underline-offset-4"
                        >
                          {product.businessName || product.sellerName}
                        </Link>
                      ) : (
                        <strong className="text-text-primary">
                          {product.businessName || product.sellerName}
                        </strong>
                      )}
                    </span>
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
                    <div className="flex items-center text-amber-400">
                      <Star className="h-4 w-4 fill-amber-400" />
                    </div>
                    <span>{product.rating.toFixed(1)}</span>
                    <span className="text-neutral font-normal">
                      ({product.reviewsCount || 18} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-text-secondary">
                  Product Story & Details
                </h2>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-surface border border-border/60 px-3 py-1 text-xs font-medium text-text-secondary"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Interactive Purchase and Pricing Actions */}
              <ProductDetailActions
                productId={product.id}
                price={product.price}
                originalPrice={product.originalPrice}
                inStock={product.inStock}
                stockCount={product.stockCount}
                businessName={product.businessName || product.sellerName || "BDSisters Artisan"}
                sellerSlug={product.sellerSlug}
              />

              {/* Artisan Enterprise Spotlight */}
              {business && (
                <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-white via-surface to-primary/5 p-6 shadow-soft">
                  <span className="text-xs font-bold text-primary tracking-wider uppercase">
                    About The Artisan Enterprise
                  </span>
                  <div className="mt-3 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-base font-extrabold text-text-primary">
                        {business.name}
                      </h4>
                      <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                        {business.tagline || business.description}
                      </p>
                      <div className="mt-2 text-xs text-text-secondary flex items-center gap-3">
                        <span>📍 {business.location || business.district}</span>
                        <span>•</span>
                        <span>Founder: {business.founder || business.ownerName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between">
                    <Link
                      href={`/businesses/${business.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-heading-accent transition-colors"
                    >
                      <span>Explore full storefront & catalogue</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-20 border-t border-border pt-16">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    Curated Collection
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight mt-1">
                    More Handcrafted Creations
                  </h3>
                </div>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-heading-accent transition-colors"
                >
                  <span>View all artisan items</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
