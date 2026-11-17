import Link from "next/link";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { Heart, Sparkles, ShieldCheck, Mail, Phone, MapPin, Globe } from "lucide-react";

export function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/80 bg-white pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Section: Brand + Newsletter */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 pb-14 border-b border-border/80">
          <div className="lg:col-span-5 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-heading-accent text-white font-black text-lg shadow-soft">
                BD
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-text-primary">
                  BDSisters<span className="text-primary">.org</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-text-secondary font-medium">
                  Empowering Bangladeshi Women
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-md">
              A premier community, professional networking, personal development,
              and ethical marketplace platform dedicated to uplifting and connecting
              Bangladeshi women across the nation and the global diaspora.
            </p>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 max-w-md">
              <div className="flex items-center gap-2 text-xs text-text-primary font-bold">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Non-Profit Community Initiative</span>
              </div>
              <p className="text-[11px] text-text-secondary mt-1">
                Proudly chartered and supported by{" "}
                <Link
                  href="/about/muhsina"
                  className="font-bold text-primary hover:underline"
                >
                  Muhsina Organization
                </Link>{" "}
                for affirmative social and economic impact.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="rounded-3xl bg-gradient-to-br from-white via-surface to-primary/5 p-6 sm:p-8 border border-border/80 shadow-soft">
              <div className="flex items-center gap-2 mb-1 text-primary">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Weekly Digest
                </span>
              </div>
              <h3 className="text-lg font-bold text-text-primary">
                Stay Connected with the Sisterhood
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-text-secondary mb-5 leading-relaxed">
                Receive curated entrepreneur spotlights, upcoming masterclasses, export grants, and community stories directly in your inbox every Thursday.
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary border-l-2 border-primary pl-2.5">
              Organization
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  About BDSisters
                </Link>
              </li>
              <li>
                <Link
                  href="/about/muhsina"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Muhsina Organization
                </Link>
              </li>
              <li>
                <Link
                  href="/about/mission-vision"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Mission &amp; 2030 Vision
                </Link>
              </li>
              <li>
                <Link
                  href="/about/our-team"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Executive Leadership Team
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary border-l-2 border-primary pl-2.5">
              Ecosystem
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  href="/community"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Community Circles
                </Link>
              </li>
              <li>
                <Link
                  href="/businesses"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Women-Led Businesses
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Artisan Marketplace
                </Link>
              </li>
              <li>
                <Link
                  href="/learning"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Skill &amp; Career Academy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary border-l-2 border-primary pl-2.5">
              Resources &amp; Events
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  href="/events"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Upcoming Workshops
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Legal &amp; Business Toolkits
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Help &amp; Support Desk
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary border-l-2 border-primary pl-2.5">
              Trust &amp; Governance
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Privacy Policy &amp; Ethics
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Terms &amp; Community Charter
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Safe Space Code of Conduct
                </Link>
              </li>
              <li>
                <span className="text-neutral text-xs block pt-1">
                  Dhaka • Chattogram • Sylhet
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border/80 pt-8 text-xs text-text-secondary gap-4">
          <p className="flex items-center gap-1.5">
            <span>© {year} BDSisters.org. Dedicated with</span>
            <Heart className="h-3.5 w-3.5 text-primary fill-primary" />
            <span>to every Bangladeshi woman building her future.</span>
          </p>
          <div className="flex items-center gap-6 font-medium">
            <Link
              href="/privacy-policy"
              className="hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="/faq" className="hover:text-primary transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
