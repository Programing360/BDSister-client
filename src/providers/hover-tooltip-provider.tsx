"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import type { GlossaryTooltip } from "@/types/cms-client";
import { cmsService, CURATED_TOOLTIPS } from "@/lib/services/cms-service";

interface HoverTooltipContextValue {
  tooltips: GlossaryTooltip[];
  isLoading: boolean;
  getTooltip: (term: string) => GlossaryTooltip | undefined;
}

const defaultContextValue: HoverTooltipContextValue = {
  tooltips: CURATED_TOOLTIPS,
  isLoading: false,
  getTooltip: (term: string) => {
    const lower = term.toLowerCase().trim();
    return CURATED_TOOLTIPS.find((t) => t.term.toLowerCase() === lower);
  },
};

const HoverTooltipContext = createContext<HoverTooltipContextValue>(defaultContextValue);

export function HoverTooltipProvider({ children }: { children: React.ReactNode }) {
  const [tooltips, setTooltips] = useState<GlossaryTooltip[]>(CURATED_TOOLTIPS);

  useEffect(() => {
    let isMounted = true;
    cmsService
      .getTooltips()
      .then((data) => {
        if (!isMounted || !data || data.length === 0) return;
        // Only update state if external API returned new or different tooltips
        if (data.length !== CURATED_TOOLTIPS.length) {
          setTooltips(data);
        }
      })
      .catch((err) => {
        console.warn("[HoverTooltipProvider] External tooltips sync deferred:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const tooltipMap = useMemo(() => {
    const map = new Map<string, GlossaryTooltip>();
    for (const t of tooltips) {
      map.set(t.term.toLowerCase().trim(), t);
      if (t.relatedTerms) {
        for (const rt of t.relatedTerms) {
          map.set(rt.toLowerCase().trim(), t);
        }
      }
    }
    return map;
  }, [tooltips]);

  const getTooltip = useCallback(
    (term: string): GlossaryTooltip | undefined => {
      if (!term) return undefined;
      return tooltipMap.get(term.toLowerCase().trim());
    },
    [tooltipMap]
  );

  const contextValue = useMemo(
    () => ({
      tooltips,
      isLoading: false,
      getTooltip,
    }),
    [tooltips, getTooltip]
  );

  return (
    <HoverTooltipContext.Provider value={contextValue}>
      {children}
    </HoverTooltipContext.Provider>
  );
}

export function useHoverTooltip() {
  return useContext(HoverTooltipContext);
}
