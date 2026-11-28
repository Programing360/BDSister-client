// "use client";

// import { useState, useRef, useEffect } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   UserRound,
//   LayoutDashboard,
//   ShoppingBag,
//   Store,
//   Settings,
//   HelpCircle,
//   LogOut,
//   ChevronDown,
//   ShieldCheck,
//   Loader2,
//   ArrowRight,
//   ShieldAlert,
// } from "lucide-react";

// import { cn } from "@/lib/utils/cn";
// import { publicNavItems } from "@/config/public-navigation";
// import { cmsService } from "@/lib/services/cms-service";
// import { Button } from "@/components/ui/button";
// import { MobileNavigation } from "@/components/layout/mobile-navigation";
// import { useAuth } from "@/hooks/use-auth";

// // ============================================================
// // User Account Menu
// // ============================================================

// interface UserAccountMenuProps {
//   user: {
//     name?: string | null;
//     fullName?: string | null;
//     email?: string | null;
//     image?: string | null;
//     profilePicture?: string | null;
//     role?: string | null;
//   };
//   isAdmin?: boolean;
//   onLogout: () => Promise<void>;
// }

// const accountLinks = [
//   {
//     label: "My Profile",
//     description: "Manage your personal profile",
//     href: "/member/profile",
//     icon: UserRound,
//   },
//   {
//     label: "My Dashboard",
//     description: "Your member overview",
//     href: "/member",
//     icon: LayoutDashboard,
//   },
//   {
//     label: "My Orders",
//     description: "Track your purchases",
//     href: "/member/orders",
//     icon: ShoppingBag,
//   },
//   {
//     label: "Marketplace",
//     description: "Explore products",
//     href: "/marketplace",
//     icon: Store,
//   },
//   {
//     label: "Settings",
//     description: "Account preferences",
//     href: "/member/settings",
//     icon: Settings,
//   },
//   {
//     label: "Help & Support",
//     description: "We're here to help",
//     href: "/member/support",
//     icon: HelpCircle,
//   },
// ];

// export function UserAccountMenu({ user, isAdmin, onLogout }: UserAccountMenuProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);

//   const displayName = user.fullName || user.name || "Sister Member";
//   const displayEmail = user.email || "";
//   const avatarUrl = user.profilePicture || user.image;

//   const initials =
//     displayName
//       .split(" ")
//       .map((part) => part[0])
//       .filter(Boolean)
//       .slice(0, 2)
//       .join("")
//       .toUpperCase() || "BD";

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     }

//     function handleEscape(event: KeyboardEvent) {
//       if (event.key === "Escape") {
//         setIsOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     document.addEventListener("keydown", handleEscape);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("keydown", handleEscape);
//     };
//   }, []);

//   const handleLogout = async () => {
//     try {
//       setIsLoggingOut(true);
//       await onLogout();
//     } catch (error) {
//       console.error("Logout failed:", error);
//       setIsLoggingOut(false);
//       window.location.href = "/login";
//     }
//   };

//   return (
//     <div className="relative" ref={menuRef}>
//       {/* Account Trigger */}
//       <button
//         type="button"
//         onClick={() => setIsOpen((prev) => !prev)}
//         aria-expanded={isOpen}
//         aria-haspopup="menu"
//         aria-label="Open account menu"
//         className={cn(
//           "group flex items-center gap-2 rounded-full border border-border/80 bg-white p-1.5 pr-3.5 transition-all duration-200",
//           "hover:border-primary/40 hover:bg-primary/[0.03]",
//           isOpen && "border-primary/50 bg-primary/[0.05] shadow-card",
//         )}
//       >
//         {/* Avatar */}
//         <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-heading-accent text-xs font-bold text-white shadow-xs">
//           {avatarUrl ? (
//             <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
//           ) : (
//             initials
//           )}
//         </div>

//         {/* User Name */}
//         <span className="hidden max-w-[120px] truncate text-xs font-bold text-text-primary sm:block">
//           {displayName}
//         </span>

//         <ChevronDown
//           className={cn(
//             "h-3.5 w-3.5 text-neutral transition-transform duration-200",
//             isOpen && "rotate-180 text-primary",
//           )}
//         />
//       </button>

//       {/* Dropdown Menu */}
//       {isOpen && (
//         <div
//           role="menu"
//           className="absolute right-0 top-full z-[60] mt-3 w-[290px] origin-top-right animate-fadeIn overflow-hidden rounded-3xl border border-border/80 bg-white shadow-floating"
//         >
//           {/* User Information Header */}
//           <div className="border-b border-border/70 bg-gradient-to-br from-primary/[0.08] via-white to-white p-4">
//             <div className="flex items-center gap-3">
//               <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-heading-accent text-sm font-bold text-white shadow-soft">
//                 {avatarUrl ? (
//                   <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
//                 ) : (
//                   initials
//                 )}
//               </div>

//               <div className="min-w-0 flex-1">
//                 <p className="truncate text-sm font-bold text-text-primary">{displayName}</p>

//                 {displayEmail && (
//                   <p className="truncate text-xs text-text-secondary">{displayEmail}</p>
//                 )}

//                 <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
//                   <ShieldCheck className="h-3 w-3" />
//                   <span>{isAdmin ? "Platform Administrator" : "Verified Sister"}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Account Links */}
//           <div className="space-y-0.5 p-2">
//             {isAdmin && (
//               <Link
//                 href="/admin"
//                 role="menuitem"
//                 onClick={() => setIsOpen(false)}
//                 className="group flex items-center gap-3 rounded-2xl bg-purple-50/70 px-3 py-2.5 transition-all duration-200 hover:bg-primary/15"
//               >
//                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
//                   <ShieldAlert className="h-4 w-4" />
//                 </div>
//                 <div className="min-w-0 flex-1">
//                   <p className="text-xs font-bold text-primary">Admin Console</p>
//                   <p className="text-[10px] text-text-secondary">Manage platform & approvals</p>
//                 </div>
//               </Link>
//             )}

//             {accountLinks.map((item) => {
//               const Icon = item.icon;

//               return (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   role="menuitem"
//                   onClick={() => setIsOpen(false)}
//                   className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-200 hover:bg-primary/[0.06]"
//                 >
//                   <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface text-text-secondary transition-colors group-hover:bg-primary/15 group-hover:text-primary">
//                     <Icon className="h-4 w-4" />
//                   </div>

//                   <div className="min-w-0 flex-1">
//                     <p className="text-xs font-bold text-text-primary transition-colors group-hover:text-primary">
//                       {item.label}
//                     </p>
//                     <p className="text-[10px] text-text-secondary">{item.description}</p>
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>

//           {/* Logout Action */}
//           <div className="border-t border-border/70 p-2">
//             <button
//               type="button"
//               role="menuitem"
//               disabled={isLoggingOut}
//               onClick={handleLogout}
//               className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-rose-50 disabled:opacity-60"
//             >
//               <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
//                 {isLoggingOut ? (
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                 ) : (
//                   <LogOut className="h-4 w-4" />
//                 )}
//               </div>

//               <div>
//                 <p className="text-xs font-bold text-rose-600">
//                   {isLoggingOut ? "Signing out..." : "Log Out"}
//                 </p>
//                 <p className="text-[10px] text-text-secondary">Sign out of your sister account</p>
//               </div>
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ============================================================
// // Navigation Helper
// // ============================================================

// const VISIBLE_NAV_COUNT = 4;

// interface NavigationItemProps {
//   item: (typeof publicNavItems)[number];
//   pathname: string;
//   activeDropdown: string | null;
//   setActiveDropdown: (value: string | null) => void;
// }

// function NavigationItem({
//   item,
//   pathname,
//   activeDropdown,
//   setActiveDropdown,
// }: NavigationItemProps) {
//   const hasChildren = Boolean(item.children?.length);
//   const href = item.href || "";

//   const isActive =
//     href === "/"
//       ? pathname === "/"
//       : Boolean(href) && (pathname === href || pathname.startsWith(`${href}/`));

//   if (!hasChildren) {
//     if (!href) {
//       return (
//         <span
//           className={cn(
//             "cursor-default rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 sm:text-sm",
//             "text-text-secondary",
//           )}
//         >
//           {item.label}
//         </span>
//       );
//     }

//     return (
//       <Link
//         href={href}
//         className={cn(
//           "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 sm:text-sm",
//           isActive
//             ? "bg-primary text-white shadow-xs"
//             : "text-text-secondary hover:bg-surface hover:text-text-primary",
//         )}
//       >
//         {item.label}
//       </Link>
//     );
//   }

//   const isOpen = activeDropdown === item.label;

//   return (
//     <div
//       className="relative"
//       onMouseEnter={() => setActiveDropdown(item.label)}
//       onMouseLeave={() => setActiveDropdown(null)}
//     >
//       <button
//         type="button"
//         aria-expanded={isOpen}
//         onClick={() => setActiveDropdown(isOpen ? null : item.label)}
//         className={cn(
//           "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 sm:text-sm",
//           isActive
//             ? "bg-primary text-white shadow-xs"
//             : "text-text-secondary hover:bg-surface hover:text-text-primary",
//         )}
//       >
//         {item.label}

//         <ChevronDown
//           className={cn(
//             "h-3.5 w-3.5 transition-transform duration-200",
//             isOpen && "rotate-180",
//             isActive ? "text-white" : "text-neutral",
//           )}
//         />
//       </button>

//       {isOpen && (
//         <div className="absolute left-0 top-full z-50 w-56 pt-2 animate-fadeIn">
//           <div className="rounded-2xl border border-border/80 bg-white p-2 shadow-floating">
//             {item.children?.map((sub, idx) => {
//               const subHref = sub.href || "#";
//               return (
//                 <Link
//                   key={`${subHref}-${idx}`}
//                   href={subHref}
//                   onClick={() => setActiveDropdown(null)}
//                   className={cn(
//                     "block rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors",
//                     pathname === subHref
//                       ? "bg-primary/10 font-bold text-primary"
//                       : "text-text-secondary hover:bg-surface hover:text-text-primary",
//                   )}
//                 >
//                   {sub.label}
//                 </Link>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ============================================================
// // More Navigation Dropdown
// // ============================================================

// interface MoreNavigationProps {
//   items: (typeof publicNavItems)[number][];
//   pathname: string;
//   activeDropdown: string | null;
//   setActiveDropdown: (value: string | null) => void;
// }

// function MoreNavigation({
//   items,
//   pathname,
//   activeDropdown,
//   setActiveDropdown,
// }: MoreNavigationProps) {
//   const isOpen = activeDropdown === "more";

//   const hasActiveItem = items.some((item) => {
//     const href = item.href || "";
//     const itemActive =
//       href === "/"
//         ? pathname === "/"
//         : Boolean(href) && (pathname === href || pathname.startsWith(`${href}/`));

//     const childActive = item.children?.some((child) => pathname === child.href);

//     return itemActive || childActive;
//   });

//   return (
//     <div
//       className="relative"
//       onMouseEnter={() => setActiveDropdown("more")}
//       onMouseLeave={() => setActiveDropdown(null)}
//     >
//       <button
//         type="button"
//         aria-expanded={isOpen}
//         aria-haspopup="true"
//         onClick={() => setActiveDropdown(isOpen ? null : "more")}
//         className={cn(
//           "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 sm:text-sm",
//           hasActiveItem
//             ? "bg-primary text-white shadow-xs"
//             : "text-text-secondary hover:bg-surface hover:text-text-primary",
//         )}
//       >
//         More
//         <ChevronDown
//           className={cn(
//             "h-3.5 w-3.5 transition-transform duration-200",
//             isOpen && "rotate-180",
//             hasActiveItem ? "text-white" : "text-neutral",
//           )}
//         />
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 top-full z-50 w-60 pt-2 animate-fadeIn">
//           <div className="rounded-2xl border border-border/80 bg-white p-2 shadow-floating">
//             {items.map((item, idx) => {
//               const hasChildren = Boolean(item.children?.length);
//               const href = item.href || "";

//               const isActive =
//                 href === "/"
//                   ? pathname === "/"
//                   : Boolean(href) && (pathname === href || pathname.startsWith(`${href}/`));

//               if (hasChildren) {
//                 return (
//                   <div key={`${item.label}-${idx}`} className="py-1">
//                     {href ? (
//                       <Link
//                         href={href}
//                         onClick={() => setActiveDropdown(null)}
//                         className={cn(
//                           "block rounded-xl px-3.5 py-2 text-xs font-bold transition-colors",
//                           isActive
//                             ? "bg-primary/10 text-primary"
//                             : "text-text-primary hover:bg-surface",
//                         )}
//                       >
//                         {item.label}
//                       </Link>
//                     ) : (
//                       <span className="block px-3.5 py-2 text-xs font-bold text-text-primary">
//                         {item.label}
//                       </span>
//                     )}

//                     <div className="ml-2 border-l border-border/70 pl-2">
//                       {item.children?.map((sub, subIdx) => {
//                         const subHref = sub.href || "#";
//                         return (
//                           <Link
//                             key={`${subHref}-${subIdx}`}
//                             href={subHref}
//                             onClick={() => setActiveDropdown(null)}
//                             className={cn(
//                               "block rounded-lg px-3 py-2 text-xs font-medium transition-colors",
//                               pathname === subHref
//                                 ? "bg-primary/10 font-bold text-primary"
//                                 : "text-text-secondary hover:bg-surface hover:text-text-primary",
//                             )}
//                           >
//                             {sub.label}
//                           </Link>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 );
//               }

//               if (!href) {
//                 return (
//                   <span
//                     key={`${item.label}-${idx}`}
//                     className="block rounded-xl px-3.5 py-2.5 text-xs font-semibold text-text-secondary"
//                   >
//                     {item.label}
//                   </span>
//                 );
//               }

//               return (
//                 <Link
//                   key={`${href}-${idx}`}
//                   href={href}
//                   onClick={() => setActiveDropdown(null)}
//                   className={cn(
//                     "block rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors",
//                     isActive
//                       ? "bg-primary/10 font-bold text-primary"
//                       : "text-text-secondary hover:bg-surface hover:text-text-primary",
//                   )}
//                 >
//                   {item.label}
//                 </Link>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ============================================================
// // Public Header Navigation Component
// // ============================================================

// export function PublicHeader() {
//   const pathname = usePathname();
//   const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
//   const [navItems, setNavItems] = useState(publicNavItems);
//   const { user, isAdmin, logout } = useAuth();

//   // Load CMS Navigation
//   useEffect(() => {
//     let isMounted = true;

//     cmsService
//       .getNavigation()
//       .then((items: any[]) => {
//         if (isMounted && Array.isArray(items) && items.length > 0) {
//           const normalized = items.map((item) => ({
//             ...item,
//             label: item.label || item.title || "Menu",
//             href: item.href ?? item.url ?? item.path ?? "",
//             children: Array.isArray(item.children)
//               ? item.children.map((sub: any) => ({
//                 ...sub,
//                 label: sub.label || sub.title || "Submenu",
//                 href: sub.href ?? sub.url ?? sub.path ?? "#",
//               }))
//               : undefined,
//           }));
//           setNavItems(normalized as typeof publicNavItems);
//         }
//       })
//       .catch((error) => {
//         console.error("Failed to load navigation:", error);
//       });

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   // Close dropdown on Escape
//   useEffect(() => {
//     function handleEscape(event: KeyboardEvent) {
//       if (event.key === "Escape") {
//         setActiveDropdown(null);
//       }
//     }

//     document.addEventListener("keydown", handleEscape);
//     return () => {
//       document.removeEventListener("keydown", handleEscape);
//     };
//   }, []);

//   // Close dropdown when clicking outside navigation
//   const navRef = useRef<HTMLElement>(null);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (navRef.current && !navRef.current.contains(event.target as Node)) {
//         setActiveDropdown(null);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const visibleItems = navItems.slice(0, VISIBLE_NAV_COUNT);
//   const moreItems = navItems.slice(VISIBLE_NAV_COUNT);

//   return (
//     <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-white/85 backdrop-blur-md transition-all duration-200">
//       <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
//         {/* Brand Identity */}
//         <Link href="/" className="group flex items-center gap-3">
//           <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-heading-accent text-white shadow-soft transition-transform duration-300 group-hover:scale-105 group-hover:shadow-card">
//             <span className="text-lg font-black tracking-tighter">BD</span>
//           </div>

//           <div className="flex flex-col">
//             <div className="flex items-center gap-1.5">
//               <span className="text-xl font-extrabold tracking-tight text-text-primary">
//                 BDSisters<span className="text-primary">.org</span>
//               </span>
//             </div>

//             <span className="text-[10px] font-medium tracking-wide text-text-secondary">
//               Empowering Bangladeshi Women
//             </span>
//           </div>
//         </Link>

//         {/* Desktop Navigation */}
//         <nav
//           ref={navRef}
//           className="hidden items-center gap-1 lg:flex"
//           aria-label="Main navigation"
//         >
//           {visibleItems.map((item, index) => (
//             <NavigationItem
//               key={index}
//               item={item}
//               pathname={pathname}
//               activeDropdown={activeDropdown}
//               setActiveDropdown={setActiveDropdown}
//             />
//           ))}

//           {moreItems.length > 0 && (
//             <MoreNavigation
//               items={moreItems}
//               pathname={pathname}
//               activeDropdown={activeDropdown}
//               setActiveDropdown={setActiveDropdown}
//             />
//           )}
//         </nav>

//         {/* Action Buttons & Mobile Navigation */}
//         <div className="flex items-center gap-3">
//           {user ? (
//             <UserAccountMenu user={user} isAdmin={isAdmin} onLogout={logout} />
//           ) : (
//             <div className="hidden items-center gap-2 sm:flex">
//               <Link href="/login">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="font-bold text-text-primary hover:text-primary"
//                 >
//                   Sign In
//                 </Button>
//               </Link>

//               <Link href="/register">
//                 <Button
//                   variant="primary"
//                   size="sm"
//                   className="gap-1.5 px-4 font-bold shadow-button hover:shadow-card-hover"
//                 >
//                   <span>Join Free</span>
//                   <ArrowRight className="h-3.5 w-3.5" />
//                 </Button>
//               </Link>
//             </div>
//           )}

//           <MobileNavigation />
//         </div>
//       </div>
//     </header>
//   );
// }

// export default PublicHeader;