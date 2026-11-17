"use client";

import { useState, useMemo } from "react";
import type { Business } from "@/types/public";
import { BusinessCard } from "./business-card";
import { SearchInput } from "@/components/shared/search-input";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Briefcase, SlidersHorizontal, RotateCcw, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BusinessDirectoryViewProps {
  initialBusinesses: Business[];
  categories: string[];
  locations: string[];
}

export function BusinessDirectoryView({
  initialBusinesses,
  categories,
  locations,
}: BusinessDirectoryViewProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const filtered = useMemo(() => {
    let result = [...initialBusinesses];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          (b.founder ?? b.ownerName ?? "").toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((b) => b.category === selectedCategory);
    }

    if (selectedLocation) {
      result = result.filter((b) => b.location === selectedLocation);
    }

    result.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "reviews") return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [initialBusinesses, search, selectedCategory, selectedLocation, sortBy]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const hasActiveFilters =
    search !== "" || selectedCategory !== "all" || selectedLocation !== "";

  const handleReset = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedLocation("");
    setSortBy("rating");
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
          className={`shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${selectedCategory === "all"
              ? "bg-primary text-white shadow-button"
              : "bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary"
            }`}
        >
          All Sectors ({initialBusinesses.length})
        </button>

        {categories.map((cat) => {
          const count = initialBusinesses.filter((b) => b.category === cat).length;
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${isSelected
                  ? "bg-primary text-white shadow-button"
                  : "bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Search, Location, and Sort Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 rounded-3xl border border-white/90 bg-surface/60 p-4 sm:p-5 shadow-card backdrop-blur-md">
        <div className="md:col-span-5">
          <SearchInput
            value={search}
            onChange={(val) => {
              setSearch(val);
              setCurrentPage(1);
            }}
            onClear={() => setSearch("")}
            placeholder="Search businesses, founders, crafts, or tags..."
          />
        </div>

        <div className="md:col-span-4 flex items-center gap-2">
          <div className="relative w-full">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral" />
            <select
              aria-label="Filter by district or location"
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full appearance-none rounded-2xl border border-border bg-white pl-10 pr-8 py-2.5 text-xs sm:text-sm font-medium text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All Regions &amp; Divisions</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="md:col-span-3 flex items-center gap-2">
          <select
            aria-label="Sort businesses"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full appearance-none rounded-2xl border border-border bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviews</option>
            <option value="name">Alphabetical (A-Z)</option>
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
          Showing <strong className="text-text-primary">{filtered.length}</strong> verified businesses
        </span>
        {hasActiveFilters && (
          <span className="text-primary font-medium">Filtered results</span>
        )}
      </div>

      {/* Grid or Empty State */}
      {paginated.length > 0 ? (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.map((b) => (
            <BusinessCard key={b.id} business={b} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-surface/50 p-12">
          <EmptyState
            icon={Briefcase}
            title="No matching businesses found"
            description="Try modifying your search keywords, selecting a different sector, or clearing the location filter."
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
