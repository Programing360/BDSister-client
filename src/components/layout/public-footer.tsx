import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Heart,
  Building2,
} from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-[#5B9891] text-white text-xs border-t border-[#477C76]">
      {/* Top Banner inside Footer: Wings Directory */}
      <div className="border-b border-white/20 bg-[#4A837D] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#F7DFC7]" />
              <span className="font-bold text-white text-xs">
                Muhsina Organization Wing Ecosystem:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[#F7DFC7] text-xs font-medium">
              <Link href="/wings#cop" className="hover:text-white transition-colors">
                CoP (Parenting & Homeschooling)
              </Link>
              <span className="text-white/40">•</span>
              <Link href="/wings#tspp" className="hover:text-white transition-colors">
                TSPP (Publications)
              </Link>
              <span className="text-white/40">•</span>
              <Link href="/wings#midj" className="hover:text-white transition-colors">
                MIDJ (Journalism & Dialogues)
              </Link>
              <span className="text-white/40">•</span>
              <Link href="/wings#hut" className="hover:text-white transition-colors">
                The Hut Network (Halal Artisans)
              </Link>
              <span className="text-white/40">•</span>
              <Link href="/wings#imbd" className="hover:text-white transition-colors">
                IMBD (Mentorship)
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 inline-flex">
              <div className="w-10 h-10 rounded-2xl bg-white text-[#5B9891] flex items-center justify-center font-serif text-xl font-bold border border-[#F2B55D] shadow-sm">
                BD
              </div>
              <span className="font-serif text-xl font-bold text-white">
                BDSisters<span className="text-[#F2B55D]">.org</span>
              </span>
            </Link>
            <p className="text-white/90 leading-relaxed text-xs max-w-sm">
              The unified database, digital community, and halal commerce platform dedicated
              to supporting Muslim sisters with modesty, dignity, and economic empowerment.
            </p>
            <div className="p-4 rounded-xl bg-white/15 backdrop-blur-xs border border-white/25 text-[11px] text-[#F7DFC7] space-y-1">
              <div className="flex items-center gap-1.5 text-white font-bold">
                <ShieldCheck className="w-4 h-4 text-[#F2B55D]" />
                <span>KYC Data Protection Guarantee</span>
              </div>
              <p className="leading-relaxed text-white/90">
                NID & Passport verification documents are encrypted and accessible exclusively by
                female administrators. No public or peer access is ever permitted.
              </p>
            </div>
          </div>

          {/* Core Areas */}
          <div className="space-y-3">
            <h4 className="text-[#F7DFC7] font-bold uppercase tracking-wider text-[11px]">
              Platform Areas
            </h4>
            <ul className="space-y-2 text-white/90">
              <li>
                <Link href="/directory" className="hover:text-[#F2B55D] transition-colors">
                  Personal Profiles (Free)
                </Link>
              </li>
              <li>
                <Link href="/businesses" className="hover:text-[#F2B55D] transition-colors">
                  Business Profiles (Verified)
                </Link>
              </li>
              <li>
                <Link href="/shops" className="hover:text-[#F2B55D] transition-colors">
                  Halal E-Commerce Shop
                </Link>
              </li>
              <li>
                <Link href="/forums" className="hover:text-[#F2B55D] transition-colors">
                  Discussion Forums
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-[#F2B55D] transition-colors">
                  Skill Exchange & Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Membership & Ethics */}
          <div className="space-y-3">
            <h4 className="text-[#F7DFC7] font-bold uppercase tracking-wider text-[11px]">
              Governance & Safety
            </h4>
            <ul className="space-y-2 text-white/90">
              <li>
                <Link href="/who-we-are" className="hover:text-[#F2B55D] transition-colors">
                  Referral Rules & Vetting
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#F2B55D] transition-colors">
                  Fair Price Guarantee Policy
                </Link>
              </li>
              <li>
                <Link href="/who-we-are" className="hover:text-[#F2B55D] transition-colors">
                  Sisterhood Code of Conduct
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#F2B55D] transition-colors">
                  Field-Level Privacy Controls
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#F2B55D] transition-colors">
                  Vetted Telegram & WhatsApp
                </Link>
              </li>
            </ul>
          </div>

          {/* Sister Wings Connected */}
          <div className="space-y-3">
            <h4 className="text-[#F7DFC7] font-bold uppercase tracking-wider text-[11px]">
              Sister Organizations
            </h4>
            <ul className="space-y-2 text-white/90">
              <li>
                <Link href="/wings#cop" className="hover:text-[#F2B55D] transition-colors">
                  Circle of Parents (CoP)
                </Link>
              </li>
              <li>
                <Link href="/wings#tspp" className="hover:text-[#F2B55D] transition-colors">
                  The Sacred Path Publications
                </Link>
              </li>
              <li>
                <Link href="/wings#midj" className="hover:text-[#F2B55D] transition-colors">
                  MIDJ Journalism Wing
                </Link>
              </li>
              <li>
                <Link href="/wings#hut" className="hover:text-[#F2B55D] transition-colors">
                  The Hut Artisan Guild
                </Link>
              </li>
              <li>
                <Link href="/who-we-are" className="hover:text-[#F2B55D] transition-colors">
                  Muhsina Organization Main Hub
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Sacred Sign-off */}
        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/85">
          <div className="flex items-center gap-1 text-center sm:text-left">
            <span>© {new Date().getFullYear()} BDSisters.org — Dedicated with</span>
            <Heart className="w-3.5 h-3.5 text-[#D98408] inline fill-current" />
            <span>for Muslim Sisters Worldwide.</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-white font-bold">
              Umbrella of Muhsina Organization
            </span>
            <span>•</span>
            <span className="text-[#F2B55D] font-bold">Halal Secured by ZiniPay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
