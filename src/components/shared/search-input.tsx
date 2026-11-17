"use client";

import { useState, useEffect, type ChangeEvent } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SearchInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
  ariaLabel?: string;
}

export function SearchInput({
  value: controlledValue,
  defaultValue = "",
  onChange,
  onSearch,
  onClear,
  placeholder = "Search...",
  debounceMs = 300,
  className,
  ariaLabel = "Search input",
}: SearchInputProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? controlledValue : internalValue;

  useEffect(() => {
    if (!onChange) return;
    const timer = setTimeout(() => {
      onChange(currentValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [currentValue, debounceMs, onChange]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    if (!isControlled) {
      setInternalValue(nextVal);
    }
    if (onChange && debounceMs === 0) {
      onChange(nextVal);
    }
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue("");
    }
    onChange?.("");
    onSearch?.("");
    onClear?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch?.(currentValue);
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral"
        aria-hidden="true"
      />
      <input
        type="search"
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={cn(
          "h-11 w-full rounded-xl border border-border bg-white pl-10 pr-10 text-sm text-text-primary placeholder:text-neutral/80",
          "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
          "transition-all duration-200"
        )}
      />
      {currentValue ? (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search query"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral hover:bg-neutral/10 hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
