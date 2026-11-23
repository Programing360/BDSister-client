import Link from "next/link";

import { NewsletterForm } from "@/components/shared/newsletter-form";

import { Heart, Sparkles, ShieldCheck, MapPin } from "lucide-react";

export function PublicFooter() {
  const year = new Date().getFullYear();

  const sections = [
    {
      title: "Organization",
      links: [
        { label: "About BDSisters", href: "/about" },
        { label: "Muhsina Organization", href: "/about/muhsina" },
        { label: "Mission & 2030 Vision", href: "/about/mission-vision" },
        { label: "Executive Leadership Team", href: "/about/our-team" },
      ],
    },
    {
      title: "Ecosystem",
      links: [
        { label: "Community Circles", href: "/community" },
        { label: "Women-Led Businesses", href: "/businesses" },
        { label: "Artisan Marketplace", href: "/marketplace" },
        { label: "Skill & Career Academy", href: "/learning" },
      ],
    },
    {
      title: "Resources & Events",
      links: [
        { label: "Upcoming Workshops", href: "/events" },
        { label: "Legal & Business Toolkits", href: "/resources" },
        { label: "Frequently Asked Questions", href: "/faq" },
        { label: "Help & Support Desk", href: "/contact" },
      ],
    },
    {
      title: "Trust & Governance",
      links: [
        { label: "Privacy Policy & Ethics", href: "/privacy-policy" },
        { label: "Terms & Community Charter", href: "/terms" },
        { label: "Safe Space Code of Conduct", href: "/community" },
      ],
    },
  ];

  const linkClass =
    "text-sm text-white/65 transition-all duration-200 hover:translate-x-1 hover:text-white";

  return (
    <footer className="relative isolate overflow-hidden bg-gradient-to-br from-[#080D2B] via-[#17134A] to-[#292078] text-white">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#5B46F6]/20 blur-[110px]" />
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#5B46F6]/25 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#5B46F6]/15 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-14 lg:grid-cols-12">
          {/* Brand */}
          <div className="space-y-6 lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5B46F6] to-[#3925C9] text-lg font-black text-white shadow-lg shadow-[#5B46F6]/30">
                BD
              </div>

              <div className="flex flex-col">
                <span className="text-2xl font-extrabold tracking-tight text-white">
                  BDSisters
                  <span className="text-[#5B46F6]">.org</span>
                </span>

                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/55">
                  Empowering Bangladeshi Women
                </span>
              </div>
            </Link>

            <p className="max-w-md text-sm leading-7 text-white/65">
              A premier community, professional networking, personal development, and ethical
              marketplace platform dedicated to uplifting and connecting Bangladeshi women across
              the nation and the global diaspora.
            </p>

            {/* Organization Card */}
            <div className="max-w-md rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <ShieldCheck className="h-5 w-5 text-[#5B46F6]" />
                <span>Non-Profit Community Initiative</span>
              </div>

              <p className="mt-2 text-xs leading-6 text-white/60">
                Proudly chartered and supported by{" "}
                <Link
                  href="/about/muhsina"
                  className="font-bold text-[#9B8EFF] transition-colors hover:text-white"
                >
                  Muhsina Organization
                </Link>{" "}
                for affirmative social and economic impact.
              </p>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-xs text-white/50">
              <MapPin className="h-4 w-4 text-[#9B8EFF]" />
              <span>Dhaka • Chattogram • Sylhet</span>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <div className="rounded-3xl border border-white/15 bg-white/[0.07] p-6 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-8">
              <div className="mb-3 flex items-center gap-2 text-[#A99EFF]">
                <Sparkles className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-[0.16em]">Weekly Digest</span>
              </div>

              <h3 className="text-xl font-bold text-white sm:text-2xl">
                Stay Connected with the Sisterhood
              </h3>

              <p className="mb-6 mt-2 max-w-xl text-sm leading-6 text-white/65">
                Receive curated entrepreneur spotlights, upcoming masterclasses, export grants, and
                community stories directly in your inbox every Thursday.
              </p>

              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="border-l-[3px] border-[#5B46F6] pl-3 text-xs font-bold uppercase tracking-wider text-white">
                {section.title}
              </h4>

              <ul className="mt-5 space-y-3">
                {section.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 text-center sm:flex-row sm:text-left">
          <p className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-white/55">
            <span>© {year} BDSisters.org. Dedicated with</span>
            <Heart className="h-3.5 w-3.5 fill-[#5B46F6] text-[#5B46F6]" />
            <span>to every Bangladeshi woman building her future.</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-medium">
            <Link href="/privacy-policy" className={linkClass}>
              Privacy
            </Link>

            <Link href="/terms" className={linkClass}>
              Terms
            </Link>

            <Link href="/faq" className={linkClass}>
              FAQ
            </Link>

            <Link href="/contact" className={linkClass}>
              Contact
            </Link>
          </div>
        </div>

        {/* Footer Tagline */}
        <div className="mt-8 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30">
            Together We Grow • Together We Empower
          </p>
        </div>
      </div>
    </footer>
  );
}
