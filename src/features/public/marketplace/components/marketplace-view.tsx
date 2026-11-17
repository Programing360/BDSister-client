"use client";

import { useState, useMemo } from "react";
import type { Product } from "@/types/public";
import { ProductCard } from "./product-card";
import { SearchInput } from "@/components/shared/search-input";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { ShoppingBag, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MarketplaceViewProps {
  initialProducts: Product[];
  categories: string[];
}

export function MarketplaceView({
  initialProducts,
  categories,
}: MarketplaceViewProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    let result = [...initialProducts];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.businessName ?? p.sellerName ?? "").toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    result.sort((a, b) => {
      if (sortBy === "featured") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

    return result;
  }, [initialProducts, search, selectedCategory, sortBy]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const hasActiveFilters = search !== "" || selectedCategory !== "all";

  const handleReset = () => {
    setSearch("");
    setSelectedCategory("all");
    setSortBy("featured");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Category Horizontal Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => {
            setSelectedCategory("all");
            setCurrentPage(1);
          }}
          className={`shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
            selectedCategory === "all"
              ? "bg-primary text-white shadow-button"
              : "bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary"
          }`}
        >
          All Items ({initialProducts.length})
        </button>

        {categories.map((cat) => {
          const count = initialProducts.filter((p) => p.category === cat).length;
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isSelected
                  ? "bg-primary text-white shadow-button"
                  : "bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Search & Sort Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 rounded-3xl border border-white/90 bg-surface/60 p-4 sm:p-5 shadow-card backdrop-blur-md">
        <div className="md:col-span-8">
          <SearchInput
            value={search}
            onChange={(val) => {
              setSearch(val);
              setCurrentPage(1);
            }}
            onClear={() => setSearch("")}
            placeholder="Search Jamdani, skincare, Nakshi Kantha, pottery, or makers..."
          />
        </div>

        <div className="md:col-span-4 flex items-center gap-2">
          <select
            aria-label="Sort products"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full appearance-none rounded-2xl border border-border bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="featured">Featured Curations</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Customer Rating</option>
          </select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="shrink-0 rounded-2xl border-border bg-white p-2.5 text-text-secondary hover:text-danger"
              aria-label="Reset filters"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-text-secondary px-1">
        <span>
          Showing <strong className="text-text-primary">{filtered.length}</strong> handcrafted items
        </span>
        {hasActiveFilters && (
          <span className="text-primary font-medium">Filtered catalog</span>
        )}
      </div>

      {/* Product Grid or Empty State */}
      {paginated.length > 0 ? (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {paginated.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-surface/50 p-12">
          <EmptyState
            icon={ShoppingBag}
            title="No matching products found"
            description="Try modifying your keywords or switching category filters."
            action={{
              label: "Reset All Filters",
              onClick: handleReset,
            }}
          />
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
