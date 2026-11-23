"use client";

import { useState, useMemo, useEffect } from "react";
import type { Resource } from "@/types/public";

import { ResourceCard } from "./resource-card";
import { SearchInput } from "@/components/shared/search-input";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/ui/empty-state";

import {
  FileText,
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  LayoutGrid,
  FolderOpen,
  File,
} from "lucide-react";

import { cn } from "@/lib/utils/cn";

interface ResourcesViewProps {
  initialResources: Resource[];
  categories: string[];
}

const PAGE_SIZE = 6;

const sortOptions = [
  { label: "Most Downloaded", value: "popular" },
  { label: "Alphabetical", value: "name" },
];

const types = [
  { label: "All Types", value: "all" },
  { label: "Templates", value: "template" },
  { label: "Guides", value: "guide" },
  { label: "Documents", value: "document" },
];

export function ResourcesView({
  initialResources,
  categories,
}: ResourcesViewProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);

  // ------------------------------------------------------------
  // Category Counts
  // ------------------------------------------------------------

  const categoryOptions = useMemo(() => {
    return categories.map((category) => ({
      label: category,
      value: category,
      count: initialResources.filter(
        (resource) => resource.category === category
      ).length,
    }));
  }, [categories, initialResources]);

  // ------------------------------------------------------------
  // Resource Type Counts
  // ------------------------------------------------------------

  const getResourceType = (resource: Resource) =>
    (resource.type || resource.format || "").toLowerCase();

  const typeCounts = useMemo(() => {
    return {
      all: initialResources.length,
      template: initialResources.filter(
        (resource) => getResourceType(resource) === "template"
      ).length,
      guide: initialResources.filter(
        (resource) => getResourceType(resource) === "guide"
      ).length,
      document: initialResources.filter(
        (resource) => getResourceType(resource) === "document"
      ).length,
    };
  }, [initialResources]);

  // ------------------------------------------------------------
  // Active Filters
  // ------------------------------------------------------------

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedType !== "all";

  const activeFilterCount = [
    search.trim() !== "",
    selectedCategory !== "all",
    selectedType !== "all",
  ].filter(Boolean).length;

  // ------------------------------------------------------------
  // Reset Filters
  // ------------------------------------------------------------

  const handleReset = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedType("all");
    setSortBy("popular");
    setCurrentPage(1);
  };

  // ------------------------------------------------------------
  // Filter Resources
  // ------------------------------------------------------------

  const filteredResources = useMemo(() => {
    let result = [...initialResources];

    // Search
    if (search.trim()) {
      const query = search.trim().toLowerCase();

      result = result.filter(
        (resource) =>
          resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query) ||
          (resource.author &&
            resource.author.toLowerCase().includes(query)) ||
          resource.category.toLowerCase().includes(query) ||
          (resource.tags &&
            resource.tags.some((tag) =>
              tag.toLowerCase().includes(query)
            ))
      );
    }

    // Category Filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (resource) => resource.category === selectedCategory
      );
    }

    // Resource Type Filter
    if (selectedType !== "all") {
      result = result.filter(
        (resource) => getResourceType(resource) === selectedType
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "popular") {
        return (
          (b.downloadCount ?? 0) -
          (a.downloadCount ?? 0)
        );
      }

      if (sortBy === "name") {
        return a.title.localeCompare(b.title);
      }

      return 0;
    });

    return result;
  }, [
    initialResources,
    search,
    selectedCategory,
    selectedType,
    sortBy,
  ]);

  // ------------------------------------------------------------
  // Pagination
  // ------------------------------------------------------------

  const totalPages = Math.ceil(
    filteredResources.length / PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage((page) =>
      Math.min(Math.max(page, 1), Math.max(totalPages, 1))
    );
  }, [totalPages]);

  const paginatedResources = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return filteredResources.slice(
      startIndex,
      startIndex + PAGE_SIZE
    );
  }, [filteredResources, currentPage]);

  // ------------------------------------------------------------
  // Sidebar Button Style
  // ------------------------------------------------------------

  const filterButtonClass = (active: boolean) =>
    cn(
      "flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm transition-all duration-200",
      active
        ? "border-primary bg-primary/[0.06] font-semibold text-primary"
        : "border-border bg-white text-text-secondary hover:border-primary/40 hover:bg-primary/[0.03]"
    );

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------

  return (
    <div className="space-y-6">

      {/* ================================================== */}
      {/* PAGE HEADER */}
      {/* ================================================== */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />

            <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
              Business Resources
            </h1>
          </div>

          <p className="mt-1 text-sm text-text-secondary">
            Explore useful templates, guides and business documents.
          </p>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-semibold text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
          >
            <X className="h-3.5 w-3.5" />
            Clear Filters
          </button>
        )}

      </div>

      {/* ================================================== */}
      {/* MAIN CONTENT */}
      {/* ================================================== */}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-7">

        {/* ================================================== */}
        {/* LEFT SIDEBAR */}
        {/* ================================================== */}

        <aside className="space-y-5">

          <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">

            {/* Sidebar Header */}

            <div className="flex items-center justify-between border-b border-border bg-surface/50 px-4 py-4">

              <div className="flex items-center gap-2.5">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  <SlidersHorizontal className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-text-primary">
                    Find Resources
                  </h2>

                  <p className="text-[11px] text-text-secondary">
                    Refine your search
                  </p>
                </div>

              </div>

              {activeFilterCount > 0 && (
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-2 text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}

            </div>

            <div className="space-y-5 p-4">

              {/* Search */}

              <div className="space-y-2.5">

                <label className="flex items-center gap-2 text-xs font-bold text-text-primary">
                  <Search className="h-3.5 w-3.5 text-primary" />
                  Search Resources
                </label>

                <div className="rounded-xl border border-border transition-colors focus-within:border-primary">
                  <SearchInput
                    value={search}
                    onChange={(value) => {
                      setSearch(value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search resources..."
                  />
                </div>

                <p className="text-[10px] leading-relaxed text-text-secondary">
                  Search by title, description, author, category or tags.
                </p>

              </div>

              {/* Divider */}

              <div className="border-t border-border" />

              {/* Categories */}

              <div className="space-y-3">

                <div className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-primary" />

                  <h3 className="text-xs font-bold text-text-primary">
                    Categories
                  </h3>
                </div>

                <div className="space-y-1.5">

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("all");
                      setCurrentPage(1);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs transition-colors",
                      selectedCategory === "all"
                        ? "bg-primary/10 font-bold text-primary"
                        : "text-text-secondary hover:bg-surface hover:text-text-primary"
                    )}
                  >
                    <span>All Categories</span>

                    <span className="text-[11px]">
                      {initialResources.length}
                    </span>
                  </button>

                  {categoryOptions.map((category) => {
                    const isActive =
                      selectedCategory === category.value;

                    return (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(category.value);
                          setCurrentPage(1);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition-colors",
                          isActive
                            ? "bg-primary/10 font-bold text-primary"
                            : "text-text-secondary hover:bg-surface hover:text-text-primary"
                        )}
                      >
                        <span className="truncate">
                          {category.label}
                        </span>

                        <span className="shrink-0 text-[11px]">
                          {category.count}
                        </span>
                      </button>
                    );
                  })}

                </div>

              </div>

              {/* Divider */}

              <div className="border-t border-border" />

              {/* Resource Type */}

              <div className="space-y-3">

                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-primary" />

                  <h3 className="text-xs font-bold text-text-primary">
                    Resource Type
                  </h3>
                </div>

                <div className="space-y-2">

                  {types.map((type) => {
                    const isActive =
                      selectedType === type.value;

                    const count =
                      typeCounts[
                        type.value as keyof typeof typeCounts
                      ];

                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => {
                          setSelectedType(type.value);
                          setCurrentPage(1);
                        }}
                        className={filterButtonClass(isActive)}
                      >
                        <span>{type.label}</span>

                        <span className="text-xs">
                          {count}
                        </span>
                      </button>
                    );
                  })}

                </div>

              </div>

              {/* Divider */}

              <div className="border-t border-border" />

              {/* Sorting */}

              <div className="space-y-3">

                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-primary" />

                  <h3 className="text-xs font-bold text-text-primary">
                    Sort By
                  </h3>
                </div>

                <select
                  value={sortBy}
                  onChange={(event) => {
                    setSortBy(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-11 w-full rounded-xl border border-border bg-white px-3 text-xs font-medium text-text-primary outline-none transition-colors hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  {sortOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>

              </div>

              {/* Reset Filters */}

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-xs font-semibold text-text-secondary transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                  Reset All Filters
                </button>
              )}

            </div>

          </div>

          {/* Sidebar Info */}

          <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-4">

            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />

              <h3 className="text-xs font-bold text-text-primary">
                Business Toolkit
              </h3>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-text-secondary">
              Find practical resources, templates and guides to support your business activities.
            </p>

          </div>

        </aside>

        {/* ================================================== */}
        {/* RIGHT CONTENT */}
        {/* ================================================== */}

        <main className="min-w-0 space-y-5">

          {/* Results Header */}

          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                <LayoutGrid className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-text-primary">
                  Available Resources
                </h2>

                <p className="text-xs text-text-secondary">
                  {filteredResources.length}{" "}
                  {filteredResources.length === 1
                    ? "resource"
                    : "resources"}{" "}
                  found
                </p>
              </div>

            </div>

            <div className="flex flex-wrap items-center gap-2">

              {search.trim() && (
                <span className="rounded-lg border border-border bg-surface px-3 py-1.5 text-[11px] text-text-secondary">
                  Search: {search}
                </span>
              )}

              {selectedCategory !== "all" && (
                <span className="rounded-lg border border-border bg-surface px-3 py-1.5 text-[11px] text-text-secondary">
                  {selectedCategory}
                </span>
              )}

              {selectedType !== "all" && (
                <span className="rounded-lg border border-border bg-surface px-3 py-1.5 text-[11px] capitalize text-text-secondary">
                  {selectedType}
                </span>
              )}

            </div>

          </div>

          {/* Resource Grid */}

          {paginatedResources.length > 0 ? (

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

              {paginatedResources.map((resource) => (
                <div
                  key={resource.id}
                  className="min-w-0"
                >
                  <ResourceCard resource={resource} />
                </div>
              ))}

            </div>

          ) : (

            <div className="rounded-2xl border border-dashed border-border bg-white px-5 py-12">

              <EmptyState
                icon={FileText}
                title="No resources found"
                description="We couldn't find any resources matching your search. Try another keyword or adjust your filters."
                action={{
                  label: "Reset Search Filters",
                  onClick: handleReset,
                }}
              />

            </div>

          )}

          {/* ================================================== */}
          {/* PAGINATION */}
          {/* ================================================== */}

          {totalPages > 1 && (

            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-xs text-text-secondary">

                Showing{" "}

                <span className="font-bold text-text-primary">
                  {(currentPage - 1) * PAGE_SIZE + 1}
                </span>

                {" - "}

                <span className="font-bold text-text-primary">
                  {Math.min(
                    currentPage * PAGE_SIZE,
                    filteredResources.length
                  )}
                </span>

                {" "}of{" "}

                <span className="font-bold text-primary">
                  {filteredResources.length}
                </span>

                {" "}resources

              </p>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />

            </div>

          )}

        </main>

      </div>

    </div>
  );
}