"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingBag, Eye, Heart } from "lucide-react";
import type { Product } from "@/types/public";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const seller = product.businessName ?? product.sellerName ?? "BDSisters Artisan";
  const firstImage: string =
    (product.images && product.images.length > 0 && product.images[0])
      ? product.images[0]
      : "/images/placeholders/prod-1.jpg";
  const [imgSrc, setImgSrc] = useState<string>(firstImage);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-white/90 bg-white/90 shadow-xl card-hover-effect">
      {/* Product Image Header */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={() => setImgSrc("/images/placeholders/prod-1.jpg")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badges Overlay */}
        <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5">
          <Badge
            variant="neutral"
            size="sm"
            className="border border-white/40 bg-white/90 text-xs font-medium text-text-primary backdrop-blur-md shadow-xs"
          >
            {product.category}
          </Badge>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white shadow-xs">
              {product.discountPercent || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </span>
          )}
          {product.wholesaleEligible && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5B46F6] text-white shadow-xs">
              Wholesale Eligible
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3.5 right-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral shadow-xs backdrop-blur-md transition-all duration-200 hover:scale-110 hover:text-danger active:scale-95"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${isLiked ? "fill-danger text-danger" : "text-text-secondary"
              }`}
          />
        </button>

        {/* Quick View Floating Hint */}
        <div className="absolute bottom-3 inset-x-3 z-10 flex items-center justify-center opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <Link
            href={`/marketplace/${product.slug}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/95 py-2.5 text-xs font-bold  shadow-md backdrop-blur-md transition-colors hover:bg-primary hover:text-white"
          >
            <Eye className="h-4 w-4" />
            <span>Quick View Details</span>
          </Link>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center justify-between text-xs text-text-secondary mb-1.5">
            <span className="font-medium truncate max-w-[150px]">By {seller}</span>
            <div className="flex items-center gap-1 font-semibold text-text-primary">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>

          <h3 className="text-base font-bold text-text-primary transition-colors duration-200 group-hover:text-primary line-clamp-1">
            <Link href={`/marketplace/${product.slug}`}>
              {product.name}
            </Link>
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-text-secondary line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Primary CTA */}
        <div className="mt-5 items-center justify-between border-t border-border/80 pt-4">
          <div>
            {product.originalPrice && product.originalPrice > product.price ? (
              <div className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <span>MRP</span>
                    <span className="line-through">৳{product.originalPrice.toLocaleString("en-BD")}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                      Special
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-extrabold text-[#5B46F6]">
                    ৳{product.price.toLocaleString("en-BD")}
                  </span>

                </div>
              </div>
            ) : (
              <div>
                <span className="text-[11px] font-medium text-text-secondary block">
                  Price
                </span>
                <span className="text-lg font-extrabold text-primary">
                  ৳{product.price.toLocaleString("en-BD")}
                </span>

              </div>
            )}
          </div>

          <Link
            href={`/marketplace/${product.slug}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-button transition-all duration-200 hover:bg-primary-hover hover:shadow-card-hover"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>View Product</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
