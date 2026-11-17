import type { NavItem, NavGroup } from "@/types/navigation";

export const publicNavItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About BDSisters", href: "/about" },
      { label: "Muhsina Organization", href: "/about/muhsina" },
      { label: "Mission & Vision", href: "/about/mission-vision" },
      { label: "Our Team", href: "/about/our-team" },
    ],
  },
  {
    label: "Community",
    href: "/community",
  },
  {
    label: "Businesses",
    href: "/businesses",
  },
  {
    label: "Marketplace",
    href: "/marketplace",
  },
  {
    label: "Events",
    href: "/events",
  },
  {
    label: "Learning",
    href: "/learning",
  },
  {
    label: "Resources",
    href: "/resources",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export const publicFooterGroups: NavGroup[] = [
  {
    label: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Our Team", href: "/about/our-team" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    label: "Platform",
    items: [
      { label: "Community", href: "/community" },
      { label: "Marketplace", href: "/marketplace" },
      { label: "Events", href: "/events" },
      { label: "Learning", href: "/learning" },
    ],
  },
  {
    label: "Legal",
    items: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "FAQ", href: "/faq" },
    ],
  },
];
