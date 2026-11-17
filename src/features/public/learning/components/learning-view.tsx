"use client";

import { useState, useMemo } from "react";
import type { Course } from "@/types/public";
import { LearningCard } from "./learning-card";
import { SearchInput } from "@/components/shared/search-input";
import { FilterPanel, type FilterOption, type SortOption } from "@/components/shared/filter-panel";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { GraduationCap, Filter, Sparkles } from "lucide-react";

interface LearningViewProps {
  initialCourses: Course[];
  categories: string[];
}

export function LearningView({
  initialCourses,
  categories,
}: LearningViewProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const categoryOptions: FilterOption[] = useMemo(() => {
    return [
      { label: "All Subjects", value: "all", count: initialCourses.length },
      ...categories.map((c) => ({
        label: c,
        value: c,
        count: initialCourses.filter((course) => course.category === c).length,
      })),
    ];
  }, [categories, initialCourses]);

  const levels = ["all", "beginner", "intermediate", "all levels"];

  const sortOptions: SortOption[] = [
    { label: "Highest Rated", value: "rating" },
    { label: "Free Courses First", value: "free" },
    { label: "Most Popular", value: "popular" },
  ];

  const filtered = useMemo(() => {
    let result = [...initialCourses];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((c) => c.category === selectedCategory);
    }

    if (selectedLevel !== "all") {
      result = result.filter((c) => c.level.toLowerCase() === selectedLevel.toLowerCase());
    }

    result.sort((a, b) => {
      if (sortBy === "free") return (a.price ?? 0) - (b.price ?? 0);
      if (sortBy === "popular") return (b.enrolledCount ?? 0) - (a.enrolledCount ?? 0);
      if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      return 0;
    });

    return result;
  }, [initialCourses, search, selectedCategory, selectedLevel, sortBy]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const hasActiveFilters =
    search !== "" || selectedCategory !== "all" || selectedLevel !== "all";

  const handleReset = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedLevel("all");
    setSortBy("rating");
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
              placeholder="Search courses, instructors, topics (e.g. Export, Legal, Ads)..."
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

        {/* Level Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-border/60">
          <span className="text-xs font-semibold text-text-secondary shrink-0 mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3 text-primary" /> Proficiency:
          </span>
          {levels.map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => {
                setSelectedLevel(lvl);
                setCurrentPage(1);
              }}
              className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap capitalize transition-all duration-200 ${
                selectedLevel === lvl
                  ? "bg-primary text-white shadow-xs"
                  : "bg-surface text-text-secondary hover:bg-neutral/15 hover:text-text-primary"
              }`}
            >
              {lvl === "all" ? "All Levels" : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-text-secondary px-1">
        <span>
          Showing <strong>{filtered.length}</strong> masterclasses &amp; curriculum tracks
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

      {/* Courses Grid */}
      {paginated.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {paginated.map((course) => (
            <LearningCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={GraduationCap}
          title="No courses match your filter"
          description="Try selecting a different subject or reset your search parameters to explore all masterclasses."
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
