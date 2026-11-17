"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  UserRound,
  LayoutDashboard,
  ShoppingBag,
  Store,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { publicNavItems } from "@/config/public-navigation";
import { Button } from "@/components/ui/button";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { signOut, useSession } from "@/lib/auth/auth-client";

// ============================================================
// User Account Menu (Shown when sister is authenticated)
// ============================================================

interface UserAccountMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const accountLinks = [
  {
    label: "My Profile",
    description: "Manage your personal profile",
    href: "/member/profile",
    icon: UserRound,
  },
  {
    label: "My Dashboard",
    description: "Your member overview",
    href: "/member",
    icon: LayoutDashboard,
  },
  {
    label: "My Orders",
    description: "Track your purchases",
    href: "/member/orders",
    icon: ShoppingBag,
  },
  {
    label: "Marketplace",
    description: "Explore products",
    href: "/member/marketplace",
    icon: Store,
  },
  {
    label: "Settings",
    description: "Account preferences",
    href: "/member/settings",
    icon: Settings,
  },
  {
    label: "Help & Support",
    description: "We're here to help",
    href: "/member/support",
    icon: HelpCircle,
  },
];

export function UserAccountMenu({ user }: UserAccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = user.name || "Sister Member";
  const displayEmail = user.email || "";

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "BD";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
      window.location.href = "/";
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Account Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Open account menu"
        className={cn(
          "group flex items-center gap-2 rounded-full border border-border/80 bg-white p-1.5 pr-3.5 transition-all duration-200",
          "hover:border-primary/40 hover:bg-primary/[0.03]",
          isOpen && "border-primary/50 bg-primary/[0.05] shadow-card"
        )}
      >
        {/* Avatar */}
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-heading-accent text-xs font-bold text-white shadow-xs">
          {user.image ? (
            <img
              src={user.image}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        {/* User Name */}
        <span className="hidden text-xs font-bold text-text-primary sm:block max-w-[120px] truncate">
          {displayName}
        </span>

        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-neutral transition-transform duration-200",
            isOpen && "rotate-180 text-primary"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-[60] mt-3 w-[290px] origin-top-right animate-fadeIn overflow-hidden rounded-3xl border border-border/80 bg-white shadow-floating"
        >
          {/* User Information Header */}
          <div className="border-b border-border/70 bg-gradient-to-br from-primary/[0.08] via-white to-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-heading-accent text-sm font-bold text-white shadow-soft">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-text-primary">
                  {displayName}
                </p>
                {displayEmail && (
                  <p className="truncate text-xs text-text-secondary">
                    {displayEmail}
                  </p>
                )}
                <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Verified Sister</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Links */}
          <div className="space-y-0.5 p-2">
            {accountLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-200 hover:bg-primary/[0.06]"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface text-text-secondary transition-colors group-hover:bg-primary/15 group-hover:text-primary">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-text-primary transition-colors group-hover:text-primary">
                      {item.label}
                    </p>
                    <p className="text-[10px] text-text-secondary">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Logout Action */}
          <div className="border-t border-border/70 p-2">
            <button
              type="button"
              role="menuitem"
              disabled={isLoggingOut}
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-rose-50 disabled:opacity-60"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                {isLoggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
              </div>

              <div>
                <p className="text-xs font-bold text-rose-600">
                  {isLoggingOut ? "Signing out..." : "Log Out"}
                </p>
                <p className="text-[10px] text-text-secondary">
                  Sign out of your sister account
                </p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Public Header Navigation Component
// ============================================================

export function PublicHeader() {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-white/85 backdrop-blur-md transition-all duration-200">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Identity */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-heading-accent text-white shadow-soft transition-transform duration-300 group-hover:scale-105 group-hover:shadow-card">
            <span className="text-lg font-black tracking-tighter">BD</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-text-primary">
                BDSisters<span className="text-primary">.org</span>
              </span>
              {/* <span className="hidden sm:inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                Civic Initiative
              </span> */}
            </div>
            <span className="text-[10px] font-medium tracking-wide text-text-secondary">
              Empowering Bangladeshi Women
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {publicNavItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            if (hasChildren) {
              const isOpen = activeDropdown === item.label;
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all duration-200",
                      isActive
                        ? "bg-primary text-white shadow-xs"
                        : "text-text-secondary hover:bg-surface hover:text-text-primary"
                    )}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        isOpen && "rotate-180",
                        isActive ? "text-white" : "text-neutral"
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="absolute left-0 top-full pt-2 w-56 z-50 animate-fadeIn">
                      <div className="rounded-2xl border border-border/80 bg-white p-2 shadow-floating">
                        {item.children?.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setActiveDropdown(null)}
                              className={cn(
                                "block rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors",
                                isSubActive
                                  ? "bg-primary/10 text-primary font-bold"
                                  : "text-text-secondary hover:bg-surface hover:text-text-primary"
                              )}
                            >
                              {sub.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-primary text-white shadow-xs"
                    : "text-text-secondary hover:bg-surface hover:text-text-primary"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons & Mobile Nav Drawer */}
        <div className="flex items-center gap-3">
          {session?.user ? (
            <UserAccountMenu user={session.user} />
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-bold text-text-primary hover:text-primary"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="primary"
                  size="sm"
                  className="font-bold shadow-button hover:shadow-card-hover gap-1.5 px-4"
                >
                  <span>Join Free</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          )}

          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}

export default PublicHeader;