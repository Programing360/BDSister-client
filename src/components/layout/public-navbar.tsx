"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Menu,
    X,
    Search,
    ShoppingBag,
    Sparkles,
    ChevronDown,
    Calendar,
    BookOpen,
    Mail,
    Network,
    LogIn,
    LayoutDashboard,
    LogOut,
    Building2,
    Users,
    MessageSquare,
    Home as HomeIcon,
    HelpCircle,
    Compass,
    Layers,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/context/cart-context";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface PublicNavPage {
    _id?: string;
    slug: string;
    title: string;
    navLabel?: string;
    navOrder?: number;
    showInHeader?: boolean;
    showInNav?: boolean;
    isPublished?: boolean;
    metaDescription?: string;
}

// Fallback navigation items matching exact existing layout
const DEFAULT_CAPSULE_LINKS = [
    { slug: "home", title: "Home", navLabel: "Home", path: "/" },
    { slug: "who-we-are", title: "Who We Are", navLabel: "Who We Are", path: "/who-we-are" },
    { slug: "shops", title: "Shops", navLabel: "Shops", path: "/shops", badge: "Halal" },
    { slug: "forums", title: "Forums", navLabel: "Forums", path: "/forums" },
    { slug: "profiles", title: "Sister Profiles", navLabel: "Sister Profiles", path: "/profiles" },
];

const BUSINESSES_MORE_LINK = {
    slug: "businesses",
    title: "Businesses & Brands",
    navLabel: "Businesses & Brands",
    path: "/businesses",
    subtitle: "Verified sister-owned brands",
    icon: Building2,
    iconBg: "bg-[#F2B55D]/25",
    iconColor: "text-[#D98408]",
};

const DEFAULT_MORE_LINKS = [
    BUSINESSES_MORE_LINK,
    {
        slug: "events",
        title: "Events & Workshops",
        navLabel: "Events & Workshops",
        path: "/events",
        subtitle: "Live sessions & calendar",
        icon: Calendar,
        iconBg: "bg-[#5B9891]/15",
        iconColor: "text-[#5B9891]",
    },
    {
        slug: "resources",
        title: "Resource Library",
        navLabel: "Resource Library",
        path: "/resources",
        subtitle: "Guides, kits & downloads",
        icon: BookOpen,
        iconBg: "bg-[#F2B55D]/25",
        iconColor: "text-[#D98408]",
    },
    {
        slug: "wings",
        title: "Sister Wings",
        navLabel: "Sister Wings",
        path: "/wings",
        subtitle: "CoP, TSPP, MIDJ & The Hut",
        icon: Network,
        iconBg: "bg-[#5B9891]/20",
        iconColor: "text-[#5B9891]",
    },
    {
        slug: "contact",
        title: "Get in Touch",
        navLabel: "Get in Touch",
        path: "/contact",
        subtitle: "Direct inquiry & groups",
        icon: Mail,
        iconBg: "bg-[#F7DFC7]",
        iconColor: "text-[#111E28]",
    },
];

export function PublicNavbar() {
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
    const [cmsPages, setCmsPages] = useState<PublicNavPage[]>([]);

    const moreRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { user, isAdmin, logout } = useAuth();
    const { totalItems, openDrawer } = useCart();

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setMoreDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setMoreDropdownOpen(false);
        }, 150);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    // Fetch published pages for dynamic navigation
    useEffect(() => {
        let active = true;
        apiClient
            .get<{ data?: PublicNavPage[] }>(API_ENDPOINTS.cms.pages)
            .then((res) => {
                if (!active) return;
                const raw = res as unknown as { data?: PublicNavPage[] } | PublicNavPage[];
                const list = Array.isArray(raw) ? raw : raw.data || [];
                if (list.length > 0) {
                    setCmsPages(list);
                }
            })
            .catch(() => {
                // Keep default static links if offline or error
            });

        return () => {
            active = false;
        };
    }, []);

    // Map helper for icons and descriptions
    const getDropdownMeta = (slug: string) => {
        const clean = slug.toLowerCase().replace(/^\//, "");
        switch (clean) {
            case "businesses":
                return {
                    subtitle: "Verified sister-owned brands",
                    icon: Building2,
                    iconBg: "bg-[#F2B55D]/25",
                    iconColor: "text-[#D98408]",
                };
            case "events":
                return {
                    subtitle: "Live sessions & calendar",
                    icon: Calendar,
                    iconBg: "bg-[#5B9891]/15",
                    iconColor: "text-[#5B9891]",
                };
            case "resources":
                return {
                    subtitle: "Guides, kits & downloads",
                    icon: BookOpen,
                    iconBg: "bg-[#F2B55D]/25",
                    iconColor: "text-[#D98408]",
                };
            case "wings":
                return {
                    subtitle: "CoP, TSPP, MIDJ & The Hut",
                    icon: Network,
                    iconBg: "bg-[#5B9891]/20",
                    iconColor: "text-[#5B9891]",
                };
            case "contact":
                return {
                    subtitle: "Direct inquiry & groups",
                    icon: Mail,
                    iconBg: "bg-[#F7DFC7]",
                    iconColor: "text-[#111E28]",
                };
            default:
                return {
                    subtitle: "Explore page content",
                    icon: Compass,
                    iconBg: "bg-[#5B9891]/10",
                    iconColor: "text-[#5B9891]",
                };
        }
    };

    // Partition CMS pages or fall back gracefully
    const { capsuleNavItems, moreDropdownItems } = useMemo(() => {
        if (!cmsPages || cmsPages.length === 0) {
            return {
                capsuleNavItems: DEFAULT_CAPSULE_LINKS,
                moreDropdownItems: DEFAULT_MORE_LINKS,
            };
        }

        const sorted = [...cmsPages].sort(
            (a, b) => (a.navOrder ?? 0) - (b.navOrder ?? 0)
        );

        const headerList = sorted
            .filter((p) => p.showInHeader ?? p.showInNav)
            .map((p) => ({
                slug: p.slug,
                title: p.title,
                navLabel: p.navLabel || p.title,
                path: p.slug === "home" || p.slug === "" ? "/" : `/${p.slug}`,
                badge: p.slug === "shops" ? "Halal" : undefined,
            }));

        const dropdownList = sorted
            .filter((p) => !(p.showInHeader ?? p.showInNav))
            .map((p) => {
                const meta = getDropdownMeta(p.slug);
                return {
                    slug: p.slug,
                    title: p.title,
                    navLabel: p.navLabel || p.title,
                    path: p.slug === "home" || p.slug === "" ? "/" : `/${p.slug}`,
                    subtitle: p.metaDescription || meta.subtitle,
                    icon: meta.icon,
                    iconBg: meta.iconBg,
                    iconColor: meta.iconColor,
                };
            });

        const hasBusinessesInHeader = headerList.some(
            (p) => p.slug === "businesses" || p.path === "/businesses"
        );
        const hasBusinessesInDropdown = dropdownList.some(
            (p) => p.slug === "businesses" || p.path === "/businesses"
        );

        let finalDropdown = dropdownList;
        if (!hasBusinessesInHeader && !hasBusinessesInDropdown) {
            finalDropdown = [BUSINESSES_MORE_LINK, ...dropdownList];
        }

        return {
            capsuleNavItems: headerList.length > 0 ? headerList : DEFAULT_CAPSULE_LINKS,
            moreDropdownItems: finalDropdown.length > 0 ? finalDropdown : DEFAULT_MORE_LINKS,
        };
    }, [cmsPages]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const q = searchQuery.trim();
        if (!q) return;
        setSearchOpen(false);
        setMobileMenuOpen(false);
        router.push(`/directory?search=${encodeURIComponent(q)}`);
    };

    const handleLogout = async () => {
        setMobileMenuOpen(false);
        await logout();
        router.push("/login");
    };

    const dashboardHref = isAdmin ? "/admin" : "/member";

    return (
        <motion.header
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F7DFC7] shadow-2xs transition-all w-full"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">
                    {/* ========================================================= */}
                    {/* 1. BRAND LOGO + SUBTITLE (Loch Blue + Bright Gold)        */}
                    {/* ========================================================= */}
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-[#5B9891] rounded-xl p-1 flex-shrink-0"
                    >
                        <div className="w-11 h-11 rounded-2xl bg-[#5B9891] flex items-center justify-center text-[#F7DFC7] shadow-xs border border-[#F2B55D]/50 group-hover:bg-[#D98408] group-hover:text-white group-hover:scale-105 transition-all flex-shrink-0">
                            <span className="font-serif text-2xl font-bold tracking-tighter">
                                BD
                            </span>
                        </div>

                        <div className="flex flex-col justify-center">
                            <span className="font-serif text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-[#111E28] group-hover:text-[#5B9891] transition-colors leading-none">
                                BDSisters<span className="text-[#D98408] font-sans">.org</span>
                            </span>

                            <div className="mt-1 text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase text-center leading-tight">
                                <span className="block text-center text-stone-500 whitespace-nowrap">
                                    Commerce + Community For
                                </span>
                                <span className="block text-center text-[#5B9891] font-bold tracking-widest">
                                    Sisters
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* ========================================================= */}
                    {/* 2. REFINED CAPSULE NAV (Paper Heart pill background)     */}
                    {/* ========================================================= */}
                    <nav
                        aria-label="Main Navigation"
                        className="hidden lg:flex items-center gap-0.5 bg-[#F7DFC7]/40 p-1.5 rounded-full border border-[#F7DFC7] shadow-2xs flex-shrink-0"
                    >
                        {capsuleNavItems.map((item) => (
                            <Link
                                key={item.slug}
                                href={item.path}
                                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#111E28] hover:bg-white hover:text-[#5B9891] hover:shadow-2xs transition-all whitespace-nowrap flex items-center gap-1.5"
                            >
                                <span>{item.navLabel || item.title}</span>
                                {item.badge && (
                                    <span className="px-1.5 py-0.2 text-[8px] font-bold rounded-full bg-[#D98408] text-white uppercase shadow-2xs">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        ))}

                        {/* 'More' HOVER-ACTIVATED Dropdown Menu */}
                        {moreDropdownItems.length > 0 && (
                            <div
                                ref={moreRef}
                                className="relative"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button
                                    type="button"
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 focus:outline-none ${moreDropdownOpen
                                            ? "bg-white text-[#5B9891] shadow-2xs"
                                            : "text-[#111E28] hover:bg-white hover:text-[#5B9891]"
                                        }`}
                                    aria-expanded={moreDropdownOpen}
                                    aria-haspopup="true"
                                >
                                    <span>More</span>
                                    <ChevronDown
                                        className={`w-3 h-3 text-[#111E28]/70 transition-transform duration-200 ${moreDropdownOpen ? "rotate-180 text-[#5B9891]" : ""
                                            }`}
                                    />
                                </button>

                                {/* Dropdown Menu Card */}
                                {moreDropdownOpen && (
                                    <div className="absolute left-0 sm:right-0 sm:left-auto top-full pt-1.5 w-64 z-50">
                                        <div className="rounded-2xl bg-white border border-[#F7DFC7] shadow-xl p-2 space-y-1 animate-in fade-in zoom-in-95">
                                            {moreDropdownItems.map((item, idx) => {
                                                const IconComp = item.icon || Compass;
                                                const isLast = idx === moreDropdownItems.length - 1 && item.slug === "contact";

                                                return (
                                                    <React.Fragment key={item.slug}>
                                                        {isLast && (
                                                            <div className="border-t border-[#F7DFC7] my-1" />
                                                        )}
                                                        <Link
                                                            href={item.path}
                                                            onClick={() => setMoreDropdownOpen(false)}
                                                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-stone-800 hover:bg-[#F7DFC7]/40 hover:text-[#5B9891] transition-colors"
                                                        >
                                                            <span
                                                                className={`p-1 rounded-lg ${item.iconBg || "bg-[#5B9891]/10"
                                                                    } ${item.iconColor || "text-[#5B9891]"}`}
                                                            >
                                                                <IconComp className="w-3.5 h-3.5" />
                                                            </span>
                                                            <div>
                                                                <span className="font-bold block text-[#111E28]">
                                                                    {item.navLabel || item.title}
                                                                </span>
                                                                {item.subtitle && (
                                                                    <span className="text-[10px] text-stone-500 line-clamp-1">
                                                                        {item.subtitle}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </Link>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </nav>

                    {/* ========================================================= */}
                    {/* 3. RIGHT ACTIONS (Dynamic Auth + Cart + Search)           */}
                    {/* ========================================================= */}
                    <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
                        {/* Search Trigger or Compact Form */}
                        {searchOpen ? (
                            <form
                                onSubmit={handleSearchSubmit}
                                className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-[#F7DFC7] shadow-xs animate-in fade-in"
                            >
                                <Search className="w-3.5 h-3.5 text-stone-400 ml-2" />
                                <input
                                    type="search"
                                    placeholder="Search sisters..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                    className="w-36 text-xs py-1 px-1 bg-transparent focus:outline-none text-stone-800 placeholder-stone-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setSearchOpen(false)}
                                    className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                                    aria-label="Close search"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </form>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setSearchOpen(true)}
                                className="p-2 rounded-full text-[#111E28] hover:bg-[#F7DFC7]/50 hover:text-[#5B9891] transition-colors"
                                aria-label="Search BDSisters"
                                title="Search BDSisters"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                        )}

                        {/* Shop Cart Icon with Live Count */}
                        <button
                            type="button"
                            onClick={openDrawer}
                            className="relative p-2 rounded-full text-[#111E28] hover:bg-[#F7DFC7]/50 hover:text-[#5B9891] transition-colors"
                            aria-label="View Shopping Cart"
                            title="View Shopping Cart"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            {totalItems > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#D98408] text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-white">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        {user ? (
                            <>
                                <Link
                                    href={dashboardHref}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#5B9891] hover:bg-[#467A74] text-white text-xs font-bold shadow-sm transition-all whitespace-nowrap"
                                >
                                    <LayoutDashboard className="w-3.5 h-3.5 text-[#F7DFC7]" />
                                    <span>{isAdmin ? "Admin Panel" : "Dashboard"}</span>
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    title="Sign Out"
                                    aria-label="Sign Out"
                                    className="p-2 rounded-full border border-stone-200 text-stone-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#5B9891] bg-white hover:bg-[#F7DFC7]/40 text-[#5B9891] text-xs font-bold transition-all shadow-2xs whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#5B9891]"
                                >
                                    <LogIn className="w-3.5 h-3.5 text-[#5B9891]" />
                                    <span>Sign In</span>
                                </Link>

                                <Link
                                    href="/register"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#D98408] hover:bg-[#B86E04] text-white text-xs font-bold shadow-sm transition-all whitespace-nowrap border border-[#F2B55D] focus:outline-none focus:ring-2 focus:ring-[#D98408]"
                                >
                                    <Sparkles className="w-3.5 h-3.5 text-[#F7DFC7]" />
                                    <span>Join as Sister</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* ========================================================= */}
                    {/* 4. MOBILE / TABLET MENU TRIGGER (< lg)                    */}
                    {/* ========================================================= */}
                    <div className="flex items-center gap-1 lg:hidden">
                        <button
                            type="button"
                            onClick={openDrawer}
                            className="relative p-2 text-[#111E28] hover:bg-[#F7DFC7]/50 rounded-full"
                            aria-label="View Shopping Cart"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {totalItems > 0 && (
                                <span className="absolute top-0.5 right-0.5 min-w-[15px] h-[15px] px-1 rounded-full bg-[#D98408] text-white text-[9px] font-extrabold flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-xl text-[#111E28] hover:bg-[#F7DFC7]/40 focus:outline-none focus:ring-2 focus:ring-[#5B9891]"
                            aria-expanded={mobileMenuOpen}
                            aria-label="Toggle mobile menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ========================================================= */}
            {/* 5. MOBILE DRAWER MENU                                     */}
            {/* ========================================================= */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white border-b border-[#F7DFC7] px-5 pt-4 pb-8 shadow-2xl animate-in slide-in-from-top-3 max-h-[85vh] overflow-y-auto">
                    <form onSubmit={handleSearchSubmit} className="mb-4">
                        <div className="flex items-center bg-[#FAF8F5] border border-[#F7DFC7] rounded-xl px-3 py-2">
                            <Search className="w-4 h-4 text-stone-400 mr-2" />
                            <input
                                type="search"
                                placeholder="Search products, sisters, forums..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full text-xs bg-transparent focus:outline-none text-stone-800"
                            />
                        </div>
                    </form>

                    <div className="space-y-1">
                        {/* Main capsule items */}
                        <button
                            type="button"
                            onClick={() => {
                                setMobileMenuOpen(false);
                                openDrawer();
                            }}
                            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-[#111E28] hover:bg-[#F7DFC7]/40 hover:text-[#5B9891] w-full text-left"
                        >
                            <span className="flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-[#D98408]" />
                                <span>Shopping Cart</span>
                            </span>
                            {totalItems > 0 && (
                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#D98408] text-white">
                                    {totalItems} items
                                </span>
                            )}
                        </button>

                        {capsuleNavItems.map((item) => (
                            <Link
                                key={item.slug}
                                href={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-[#111E28] hover:bg-[#F7DFC7]/40 hover:text-[#5B9891]"
                            >
                                <span>{item.navLabel || item.title}</span>
                                {item.badge && (
                                    <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-[#D98408] text-white">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        ))}

                        <div className="border-t border-[#F7DFC7] my-2 pt-2">
                            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                                Additional Portals
                            </span>
                        </div>

                        {/* Dropdown items */}
                        {moreDropdownItems.map((item) => (
                            <Link
                                key={item.slug}
                                href={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-[#111E28] hover:bg-[#F7DFC7]/40 hover:text-[#5B9891]"
                            >
                                {item.navLabel || item.title}
                            </Link>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-[#F7DFC7] mt-4 flex flex-col gap-2">
                        {user ? (
                            <>
                                <Link
                                    href={dashboardHref}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full py-2.5 rounded-xl bg-[#5B9891] text-white text-xs font-bold text-center shadow-sm"
                                >
                                    {isAdmin ? "Go to Admin Panel" : "Go to My Dashboard"}
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold text-center hover:bg-rose-50"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full py-2.5 rounded-xl border border-[#5B9891] text-[#5B9891] text-xs font-bold text-center hover:bg-[#F7DFC7]/40"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full py-2.5 rounded-xl bg-[#D98408] text-white text-xs font-bold text-center shadow-md border border-[#F2B55D]"
                                >
                                    Join as Sister (Referral Required)
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </motion.header>
    );
}
