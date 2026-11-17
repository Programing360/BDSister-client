"use client";

import type { ReactNode } from "react";

interface HeroUIAppProviderProps {
  children: ReactNode;
}

/**
 * HeroUI provider foundation.
 * Wraps the app with UI context / theme provider.
 */
export function HeroUIAppProvider({ children }: HeroUIAppProviderProps) {
  return <>{children}</>;
}
