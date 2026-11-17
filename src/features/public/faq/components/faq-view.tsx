"use client";

import { useState, useMemo } from "react";
import type { FaqItem } from "@/types/public";
import { SearchInput } from "@/components/shared/search-input";
import { ChevronDown, HelpCircle, MessageSquare, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface FaqViewProps {
  items: FaqItem[];
}

export function FaqView({ items }: FaqViewProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    [items[0]?.id || ""]: true,
  });

  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map((i) => i.category)));
    return [
      { label: "All Questions", value: "all" },
      ...cats.map((c) => ({
        label: c,
        value: c,
      })),
    ];
  }, [items]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        search.trim() === "" ||
        item.question.toLowerCase().includes(search.toLowerCase()) ||
        item.answer.toLowerCase().includes(search.toLowerCase());

      const matchesCat =
        activeCategory === "all" || item.category === activeCategory;

      return matchesSearch && matchesCat;
    });
  }, [items, search, activeCategory]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Search Input Box */}
      <div className="rounded-3xl border border-border/80 bg-white p-5 sm:p-6 shadow-card space-y-4">
        <SearchInput
          value={search}
          onChange={(val) => setSearch(val)}
          placeholder="Search by keywords (e.g. membership, verification, return, safety, fees)..."
        />

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setActiveCategory(cat.value)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200",
                  isSelected
                    ? "bg-primary text-white shadow-xs"
                    : "bg-surface text-text-secondary hover:bg-neutral/15 hover:text-text-primary"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-text-secondary px-1">
        <span>
          Showing <strong>{filtered.length}</strong> frequently asked questions
        </span>
        {(search !== "" || activeCategory !== "all") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setActiveCategory("all");
            }}
            className="text-primary hover:underline font-semibold"
          >
            Reset query
          </button>
        )}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((item) => {
            const isOpen = !!openIds[item.id];
            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-3xl border transition-all duration-300 overflow-hidden",
                  isOpen
                    ? "border-primary/40 bg-white shadow-card-hover"
                    : "border-border/80 bg-white/90 hover:bg-white shadow-soft"
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between p-5 sm:p-7 text-left"
                >
                  <div className="flex items-center gap-3 pr-4">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs shrink-0">
                      Q
                    </span>
                    <span className="font-extrabold text-sm sm:text-base text-text-primary">
                      {item.question}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface text-text-secondary transition-transform duration-200",
                      isOpen && "rotate-180 bg-primary/10 text-primary"
                    )}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-7 pb-6 pt-0 border-t border-border/50 animate-fadeIn">
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pt-4 whitespace-pre-line">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="rounded-3xl border border-border bg-white p-10 text-center space-y-4 shadow-card">
            <HelpCircle className="h-10 w-10 text-neutral mx-auto" />
            <h4 className="font-bold text-base text-text-primary">No questions found</h4>
            <p className="text-xs text-text-secondary max-w-sm mx-auto">
              We couldn&apos;t find any questions matching &ldquo;{search}&rdquo;. Try another term or submit your query directly.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
              }}
            >
              Reset Search
            </Button>
          </div>
        )}
      </div>

      {/* Fallback Contact Box */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-white via-surface to-primary/5 p-8 sm:p-10 text-center space-y-4 shadow-card mt-12">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto">
          <MessageSquare className="h-6 w-6" />
        </div>
        <h3 className="text-lg sm:text-xl font-extrabold text-text-primary">
          Still Have An Unanswered Question?
        </h3>
        <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
          Our community coordinators are always happy to clarify guidelines, directory verification requirements, or safety protocols.
        </p>
        <div className="pt-2">
          <Link href="/contact">
            <Button variant="primary" size="md" className="gap-2 font-bold shadow-button">
              <span>Contact Sister Support Desk</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
