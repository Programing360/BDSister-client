"use client";

import { HeroUIAppProvider } from "./heroui-provider";
import { QueryProvider } from "./query-provider";
import { ToastProvider } from "./toast-provider";
import { AosProvider } from "./aos-provider";
import { HoverTooltipProvider } from "./hover-tooltip-provider";

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Root application providers.
 * Wrap the entire application with all required context providers.
 * Order matters: outer providers are available to inner providers.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <HeroUIAppProvider>
        <AosProvider>
          <HoverTooltipProvider>
            {children}
            <ToastProvider />
          </HoverTooltipProvider>
        </AosProvider>
      </HeroUIAppProvider>
    </QueryProvider>
  );
}
