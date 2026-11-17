"use client";

import { useState, useMemo } from "react";
import type { Resource } from "@/types/public";
import { ResourceCard } from "./resource-card";
import { SearchInput } from "@/components/shared/search-input";
import { FilterPanel, type FilterOption, type SortOption } from "@/components/shared/filter-panel";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText, Filter } from "lucide-react";

interface ResourcesViewProps {
  initialResources: Resource[];
  categories: string[];
}

export function ResourcesView({
  initialResources,
  categories,
}: ResourcesViewProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const categoryOptions: FilterOption[] = useMemo(() => {
    return [
      { label: "All Topics", value: "all", count: initialResources.length },
      ...categories.map((c) => ({
        label: c,
        value: c,
        count: initialResources.filter((r) => r.category === c).length,
      })),
    ];
  }, [categories, initialResources]);

  const types = ["all", "template", "guide", "document"];

  const sortOptions: SortOption[] = [
    { label: "Most Downloaded", value: "popular" },
    { label: "Alphabetical", value: "name" },
  ];

  const filtered = useMemo(() => {
    let result = [...initialResources];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          (r.author && r.author.toLowerCase().includes(q)) ||
          r.category.toLowerCase().includes(q) ||
          (r.tags && r.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((r) => r.category === selectedCategory);
    }

    if (selectedType !== "all") {
      result = result.filter(
        (r) => (r.type || r.format || "").toLowerCase() === selectedType.toLowerCase()
      );
    }

    result.sort((a, b) => {
      if (sortBy === "popular") return (b.downloadCount ?? 0) - (a.downloadCount ?? 0);
      if (sortBy === "name") return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [initialResources, search, selectedCategory, selectedType, sortBy]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const hasActiveFilters =
    search !== "" || selectedCategory !== "all" || selectedType !== "all";

  const handleReset = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedType("all");
    setSortBy("popular");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Search and Filters Controls */}
      <div className="rounded-3xl border border-border/80 bg-white p-5 sm:p-6 shadow-card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6">
            <SearchInput
              value={search}
              onChange={(val) => {
                setSearch(val);
                setCurrentPage(1);
              }}
              placeholder="Search by keywords (e.g. Cashflow, Contract, Trade License, VAT)..."
            />
          </div>
          <div className="md:col-span-6">
            <FilterPanel
              categories={categoryOptions}
              selectedCategory={selectedCategory}
              onSelectCategory={(c) => {
                setSelectedCategory(c);
                setCurrentPage(1);
              }}
              sortOptions={sortOptions}
              selectedSort={sortBy}
              onSelectSort={(s) => setSortBy(s)}
              onReset={handleReset}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </div>

        {/* Asset Format Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-border/60">
          <span className="text-xs font-semibold text-text-secondary shrink-0 mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3 text-primary" /> Asset Type:
          </span>
          {types.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setSelectedType(type);
                setCurrentPage(1);
              }}
              className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap capitalize transition-all duration-200 ${
                selectedType === type
                  ? "bg-primary text-white shadow-xs"
                  : "bg-surface text-text-secondary hover:bg-neutral/15 hover:text-text-primary"
              }`}
            >
              {type === "all" ? "All Types" : type}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-text-secondary px-1">
        <span>
          Showing <strong>{filtered.length}</strong> verified business templates &amp; handbooks
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="text-primary hover:underline font-semibold"
          >
            Clear active filters
          </button>
        )}
      </div>

      {/* Resources Grid */}
      {paginated.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {paginated.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No resources match your query"
          description="Try broadening your search term or reset filters to view all available toolkits."
          action={{
            label: "Reset Search Filters",
            onClick: handleReset,
          }}
        />
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
}
