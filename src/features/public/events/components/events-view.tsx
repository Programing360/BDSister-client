"use client";

import { useState, useMemo, useEffect } from "react";
import type { Event } from "@/types/public";

import { EventCard } from "./event-card";
import { SearchInput } from "@/components/shared/search-input";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/ui/empty-state";

import {
  Calendar,
  Filter,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  MapPin,
  LayoutGrid,
} from "lucide-react";

import { cn } from "@/lib/utils/cn";

interface EventsViewProps {
  initialEvents: Event[];
}

const PAGE_SIZE = 6;

const sortOptions = [
  { label: "Default Order", value: "date" },
  { label: "Free Events First", value: "free" },
  { label: "Most Popular", value: "popularity" },
];

export function EventsView({ initialEvents }: EventsViewProps) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);

  // ------------------------------------------------------------
  // Categories
  // ------------------------------------------------------------

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        initialEvents
          .map((event) => event.category)
          .filter((category): category is string => Boolean(category))
      )
    );

    return uniqueCategories;
  }, [initialEvents]);

  // ------------------------------------------------------------
  // Event Format Counts
  // ------------------------------------------------------------

  const onlineCount = useMemo(
    () =>
      initialEvents.filter(
        (event) => event.type === "online" || event.isOnline
      ).length,
    [initialEvents]
  );

  const inPersonCount = useMemo(
    () =>
      initialEvents.filter(
        (event) => event.type === "in-person" || !event.isOnline
      ).length,
    [initialEvents]
  );

  // ------------------------------------------------------------
  // Active Filters
  // ------------------------------------------------------------

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedType !== "all" ||
    selectedCategory !== "all" ||
    sortBy !== "date";

  const activeFilterCount = [
    search.trim() !== "",
    selectedType !== "all",
    selectedCategory !== "all",
    sortBy !== "date",
  ].filter(Boolean).length;

  // ------------------------------------------------------------
  // Reset Filters
  // ------------------------------------------------------------

  const handleReset = () => {
    setSearch("");
    setSelectedType("all");
    setSelectedCategory("all");
    setSortBy("date");
    setCurrentPage(1);
  };

  // ------------------------------------------------------------
  // Filter Events
  // ------------------------------------------------------------

  const filteredEvents = useMemo(() => {
    let result = [...initialEvents];

    // Search
    if (search.trim()) {
      const query = search.trim().toLowerCase();

      result = result.filter(
        (event) =>
          event.title?.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.location?.toLowerCase().includes(query) ||
          event.category?.toLowerCase().includes(query) ||
          event.organizer?.toLowerCase().includes(query)
      );
    }

    // Event Format
    if (selectedType !== "all") {
      result = result.filter((event) =>
        selectedType === "online"
          ? event.type === "online" || event.isOnline
          : event.type === "in-person" || !event.isOnline
      );
    }

    // Category
    if (selectedCategory !== "all") {
      result = result.filter(
        (event) => event.category === selectedCategory
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "free") {
        return (a.price ?? 0) - (b.price ?? 0);
      }

      if (sortBy === "popularity") {
        return (
          (b.attendeesCount ?? 0) -
          (a.attendeesCount ?? 0)
        );
      }

      return 0;
    });

    return result;
  }, [
    initialEvents,
    search,
    selectedType,
    selectedCategory,
    sortBy,
  ]);

  // ------------------------------------------------------------
  // Pagination
  // ------------------------------------------------------------

  const totalPages = Math.ceil(filteredEvents.length / PAGE_SIZE);

  useEffect(() => {
    setCurrentPage((page) =>
      Math.min(Math.max(page, 1), Math.max(totalPages, 1))
    );
  }, [totalPages]);

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return filteredEvents.slice(
      startIndex,
      startIndex + PAGE_SIZE
    );
  }, [filteredEvents, currentPage]);

  // ------------------------------------------------------------
  // Sidebar Filter Button
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
            <Calendar className="h-5 w-5 text-primary" />

            <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
              Community Events
            </h1>
          </div>

          <p className="mt-1 text-sm text-text-secondary">
            Discover events and find something interesting to attend.
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
                    Find Events
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
                  Search Events
                </label>

                <div className="rounded-xl border border-border transition-colors focus-within:border-primary">
                  <SearchInput
                    value={search}
                    onChange={(value) => {
                      setSearch(value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search events..."
                  />
                </div>

              </div>

              {/* Divider */}

              <div className="border-t border-border" />

              {/* Event Format */}

              <div className="space-y-3">

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />

                  <h3 className="text-xs font-bold text-text-primary">
                    Event Format
                  </h3>
                </div>

                <div className="space-y-2">

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedType("all");
                      setCurrentPage(1);
                    }}
                    className={filterButtonClass(selectedType === "all")}
                  >
                    <span>All Formats</span>

                    <span className="text-xs">
                      {initialEvents.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedType("online");
                      setCurrentPage(1);
                    }}
                    className={filterButtonClass(selectedType === "online")}
                  >
                    <span>Online Events</span>

                    <span className="text-xs">
                      {onlineCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedType("in-person");
                      setCurrentPage(1);
                    }}
                    className={filterButtonClass(
                      selectedType === "in-person"
                    )}
                  >
                    <span>In-Person Events</span>

                    <span className="text-xs">
                      {inPersonCount}
                    </span>
                  </button>

                </div>
              </div>

              {/* Divider */}

              <div className="border-t border-border" />

              {/* Categories */}

              <div className="space-y-3">

                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />

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
                      {initialEvents.length}
                    </span>
                  </button>

                  {categories.map((category) => {
                    const count = initialEvents.filter(
                      (event) => event.category === category
                    ).length;

                    const isActive = selectedCategory === category;

                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(category);
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
                          {category}
                        </span>

                        <span className="shrink-0 text-[11px]">
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

              {/* Reset */}

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
              <Calendar className="h-4 w-4 text-primary" />

              <h3 className="text-xs font-bold text-text-primary">
                Discover More
              </h3>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-text-secondary">
              Explore community events, connect with people and participate in activities.
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
                  Available Events
                </h2>

                <p className="text-xs text-text-secondary">
                  {filteredEvents.length}{" "}
                  {filteredEvents.length === 1 ? "event" : "events"} found
                </p>
              </div>

            </div>

            <div className="flex flex-wrap items-center gap-2">

              {search.trim() && (
                <span className="rounded-lg border border-border bg-surface px-3 py-1.5 text-[11px] text-text-secondary">
                  Search: {search}
                </span>
              )}

              {selectedType !== "all" && (
                <span className="rounded-lg border border-border bg-surface px-3 py-1.5 text-[11px] text-text-secondary">
                  {selectedType === "online" ? "Online" : "In-Person"}
                </span>
              )}

              {selectedCategory !== "all" && (
                <span className="rounded-lg border border-border bg-surface px-3 py-1.5 text-[11px] text-text-secondary">
                  {selectedCategory}
                </span>
              )}

            </div>

          </div>

          {/* Events Grid */}

          {paginatedEvents.length > 0 ? (

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

              {paginatedEvents.map((event) => (
                <div
                  key={event.id}
                  className="min-w-0"
                >
                  <EventCard event={event} />
                </div>
              ))}

            </div>

          ) : (

            <div className="rounded-2xl border border-dashed border-border bg-white px-5 py-12">

              <EmptyState
                icon={Calendar}
                title="No events found"
                description="We couldn't find any events matching your search. Try another keyword or adjust your filters."
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
                  {Math.min(currentPage * PAGE_SIZE, filteredEvents.length)}
                </span>
                {" "}of{" "}
                <span className="font-bold text-primary">
                  {filteredEvents.length}
                </span>
                {" "}events
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