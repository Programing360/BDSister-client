"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { HelpCircle, ExternalLink, Sparkles } from "lucide-react";
import { useHoverTooltip } from "@/providers/hover-tooltip-provider";
import { cn } from "@/lib/utils/cn";

interface HoverGlossaryProps {
  term: string;
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

export function HoverGlossary({
  term,
  children,
  className,
  showIcon = false,
}: HoverGlossaryProps) {
  const { getTooltip } = useHoverTooltip();
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const tooltip = getTooltip(term);

  // If no tooltip registered, render children or term normally
  if (!tooltip) {
    return <span className={className}>{children || term}</span>;
  }

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Islamic/Ethical":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Financial":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Legal/Regulatory":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Sisterhood":
        return "bg-pink-50 text-pink-700 border-pink-200";
      default:
        return "bg-purple-50 text-[#5B46F6] border-purple-200";
    }
  };

  return (
    <span
      className="relative inline-flex items-center group cursor-help"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      tabIndex={0}
      role="tooltip"
      aria-label={`${tooltip.term}: ${tooltip.definition}`}
    >
      <span
        className={cn(
          "border-b border-dotted border-[#5B46F6]/60 text-inherit font-medium transition-colors hover:text-[#5B46F6] hover:border-[#5B46F6]",
          className
        )}
      >
        {children || term}
      </span>

      {showIcon && (
        <HelpCircle className="ml-1 h-3 w-3 text-[#5B46F6]/70 inline shrink-0" />
      )}

      {isVisible && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 rounded-2xl border border-gray-200/90 bg-white p-3.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 text-left pointer-events-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2 mb-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <Sparkles className="h-3.5 w-3.5 text-[#5B46F6] shrink-0" />
              <span className="font-bold text-xs text-gray-900 truncate">
                {tooltip.term}
              </span>
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[9px] font-bold border uppercase tracking-wider shrink-0",
                getCategoryColor(tooltip.category)
              )}
            >
              {tooltip.category}
            </span>
          </div>

          <p className="text-[11px] text-gray-600 leading-relaxed">
            {tooltip.definition}
          </p>

          {tooltip.learnMoreUrl && (
            <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-end">
              <Link
                href={tooltip.learnMoreUrl}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-[#5B46F6] hover:underline"
              >
                <span>Learn more</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </Link>
            </div>
          )}

          {/* Tooltip triangle tail */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-white" />
        </div>
      )}
    </span>
  );
}
