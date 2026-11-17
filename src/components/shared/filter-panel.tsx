"use client";

import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface SortOption {
  label: string;
  value: string;
}

interface FilterPanelProps {
  categories: FilterOption[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  sortOptions?: SortOption[];
  selectedSort?: string;
  onSelectSort?: (sort: string) => void;
  locations?: string[];
  selectedLocation?: string;
  onSelectLocation?: (location: string) => void;
  onReset?: () => void;
  hasActiveFilters?: boolean;
  className?: string;
}

export function FilterPanel({
  categories,
  selectedCategory,
  onSelectCategory,
  sortOptions,
  selectedSort,
  onSelectSort,
  locations,
  selectedLocation,
  onSelectLocation,
  onReset,
  hasActiveFilters = false,
  className,
}: FilterPanelProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-xs",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => onSelectCategory(cat.value)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200",
                  isSelected
                    ? "bg-primary text-white shadow-xs"
                    : "bg-surface text-text-secondary hover:bg-muted hover:text-primary"
                )}
              >
                <span>{cat.label}</span>
                {cat.count !== undefined && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[10px]",
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-border text-text-secondary"
                    )}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sort & Secondary Selectors */}
        <div className="flex items-center gap-2.5">
          {locations && locations.length > 0 && onSelectLocation && (
            <div className="relative">
              <select
                aria-label="Filter by location"
                value={selectedLocation || ""}
                onChange={(e) => onSelectLocation(e.target.value)}
                className="h-9 rounded-xl border border-border bg-white px-3 text-xs sm:text-sm text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          )}

          {sortOptions && sortOptions.length > 0 && onSelectSort && (
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="hidden sm:inline-block h-3.5 w-3.5 text-neutral" />
              <select
                aria-label="Sort options"
                value={selectedSort || ""}
                onChange={(e) => onSelectSort(e.target.value)}
                className="h-9 rounded-xl border border-border bg-white px-3 text-xs sm:text-sm text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {hasActiveFilters && onReset && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-9 items-center gap-1 rounded-xl border border-border bg-white px-2.5 text-xs text-text-secondary hover:border-primary hover:text-primary transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
