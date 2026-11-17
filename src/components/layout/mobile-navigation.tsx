"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { publicNavItems } from "@/config/public-navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu((prev) => (prev === label ? null : label));
  };

  const closeMenu = () => {
    setIsOpen(false);
    setOpenSubmenu(null);
  };

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-text-primary hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-expanded={isOpen}
        aria-label="Toggle mobile menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white p-6 shadow-2xl transition-transform duration-300 ease-in-out sm:max-w-sm flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-border pb-4">
          <Link href="/" onClick={closeMenu} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white font-bold text-sm">
              BD
            </div>
            <span className="font-bold text-base text-text-primary">
              BDSisters<span className="text-primary">.org</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-neutral hover:bg-surface hover:text-text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 flex-1 overflow-y-auto space-y-1">
          {publicNavItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            if (hasChildren) {
              const isSubOpen = openSubmenu === item.label;
              return (
                <div key={item.label} className="border-b border-border/50 pb-1">
                  <button
                    type="button"
                    onClick={() => toggleSubmenu(item.label)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium text-text-primary hover:bg-surface"
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200 text-neutral",
                        isSubOpen && "rotate-180 text-primary"
                      )}
                    />
                  </button>
                  {isSubOpen && (
                    <div className="ml-3 mt-1 space-y-1 border-l-2 border-primary/20 pl-2">
                      {item.children?.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={closeMenu}
                            className={cn(
                              "block rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors",
                              isSubActive
                                ? "bg-primary/10 text-primary font-semibold"
                                : "text-text-secondary hover:text-text-primary hover:bg-surface"
                            )}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={cn(
                  "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 space-y-2.5 border-t border-border pt-4">
          <Link href="/login" onClick={closeMenu} className="block w-full">
            <Button variant="outline" className="w-full justify-center">
              Sign In
            </Button>
          </Link>
          <Link href="/register" onClick={closeMenu} className="block w-full">
            <Button variant="primary" className="w-full justify-center">
              Join Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
