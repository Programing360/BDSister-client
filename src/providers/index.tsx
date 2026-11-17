"use client";

import { HeroUIAppProvider } from "./heroui-provider";
import { QueryProvider } from "./query-provider";
import { ToastProvider } from "./toast-provider";
import { AosProvider } from "./aos-provider";

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
          {children}
          <ToastProvider />
        </AosProvider>
      </HeroUIAppProvider>
    </QueryProvider>
  );
}
