"use client";

import { useState, useMemo } from "react";
import type { Event } from "@/types/public";
import { EventCard } from "./event-card";
import { SearchInput } from "@/components/shared/search-input";
import { FilterPanel, type FilterOption, type SortOption } from "@/components/shared/filter-panel";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Calendar, Filter, Sparkles } from "lucide-react";

interface EventsViewProps {
  initialEvents: Event[];
}

export function EventsView({ initialEvents }: EventsViewProps) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const categories = useMemo(() => {
    const list = Array.from(new Set(initialEvents.map((e) => e.category)));
    return ["all", ...list];
  }, [initialEvents]);

  const typeOptions: FilterOption[] = [
    { label: "All Formats", value: "all", count: initialEvents.length },
    {
      label: "Virtual Sessions",
      value: "online",
      count: initialEvents.filter((e) => e.type === "online" || e.isOnline).length,
    },
    {
      label: "In-Person Gatherings",
      value: "in-person",
      count: initialEvents.filter((e) => e.type === "in-person" || !e.isOnline).length,
    },
  ];

  const sortOptions: SortOption[] = [
    { label: "Upcoming First", value: "date" },
    { label: "Free Events First", value: "free" },
    { label: "Most Popular", value: "popularity" },
  ];

  const filtered = useMemo(() => {
    let result = [...initialEvents];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          (e.location && e.location.toLowerCase().includes(q)) ||
          e.category.toLowerCase().includes(q) ||
          (e.organizer && e.organizer.toLowerCase().includes(q))
      );
    }

    if (selectedType !== "all") {
      result = result.filter((e) =>
        selectedType === "online" ? e.type === "online" || e.isOnline : e.type === "in-person" || !e.isOnline
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((e) => e.category === selectedCategory);
    }

    result.sort((a, b) => {
      if (sortBy === "free") return (a.price ?? 0) - (b.price ?? 0);
      if (sortBy === "popularity") return (b.attendeesCount ?? 0) - (a.attendeesCount ?? 0);
      return 0; // Default date order
    });

    return result;
  }, [initialEvents, search, selectedType, selectedCategory, sortBy]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const hasActiveFilters = search !== "" || selectedType !== "all" || selectedCategory !== "all";

  const handleReset = () => {
    setSearch("");
    setSelectedType("all");
    setSelectedCategory("all");
    setSortBy("date");
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
              placeholder="Search by topic, speaker, city (e.g. AI, Dhaka, Export)..."
            />
          </div>
          <div className="md:col-span-6">
            <FilterPanel
              categories={typeOptions}
              selectedCategory={selectedType}
              onSelectCategory={(t) => {
                setSelectedType(t);
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

        {/* Category Topic Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-border/60">
          <span className="text-xs font-semibold text-text-secondary shrink-0 mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3 text-primary" /> Topic:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all duration-200 ${selectedCategory === cat
                  ? "bg-primary text-white shadow-xs"
                  : "bg-surface text-text-secondary hover:bg-neutral/15 hover:text-text-primary"
                }`}
            >
              {cat === "all" ? "All Topics" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-text-secondary px-1">
        <span>
          Showing <strong>{filtered.length}</strong> upcoming community workshops &amp; events
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

      {/* Events Grid */}
      {paginated.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {paginated.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No upcoming events match your filter"
          description="Try broadening your search keywords or reset the filters to see all planned workshops."
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
