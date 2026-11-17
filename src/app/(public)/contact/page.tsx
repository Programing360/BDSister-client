import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ContactForm } from "@/features/public/contact/components/contact-form";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
} from "lucide-react";

export const metadata = {
  title: "Contact Us & Support | BDSisters.org",
  description:
    "Get in touch with the BDSisters.org team for support, business listing assistance, community inquiries, or partnership opportunities.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col bg-background min-h-screen">
      {/* Editorial Hero */}
      <section className="relative overflow-hidden border-b border-border/80 bg-white pt-14 pb-16 sm:pt-20 sm:pb-24">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -top-40 right-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-10 h-96 w-96 rounded-full bg-heading-accent/10 blur-3xl" />

        <Container size="lg">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary shadow-xs">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Dedicated Sisterhood Support &amp; Partnerships</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
              We Are Here to <br className="hidden sm:inline" />
              <span className="text-gradient-primary">Listen, Guide &amp; Connect</span>
            </h1>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl">
              Have questions about joining, listing your business in our directory, submitting an artisan product, or collaborating with Muhsina Organization? Our team responds within 24 to 48 hours.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Contact Section */}
      <Section spacing="lg" className="bg-background">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Contact Details Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-border/80 bg-white p-6 sm:p-8 shadow-card space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    Reach Out Directly
                  </span>
                  <h3 className="text-xl font-bold text-text-primary mt-1">
                    Direct Support Desks
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-text-secondary leading-relaxed">
                    Our team is based across Dhaka, Chattogram, and Sylhet.
                  </p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-text-secondary">
                  <div className="flex items-start gap-3.5 rounded-2xl bg-surface/50 p-4 border border-border/60">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-bold text-text-primary block text-sm">General Inquiries</span>
                      <a
                        href="mailto:support@bdsisters.org"
                        className="text-primary font-semibold hover:underline"
                      >
                        support@bdsisters.org
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 rounded-2xl bg-surface/50 p-4 border border-border/60">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-bold text-text-primary block text-sm">Sister Helpline</span>
                      <a
                        href="tel:+8801700000000"
                        className="text-text-primary hover:text-primary transition-colors font-medium"
                      >
                        +880 1700-000000 (Sun – Thu)
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 rounded-2xl bg-surface/50 p-4 border border-border/60">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-bold text-text-primary block text-sm">Central Liaison Office</span>
                      <span className="text-text-secondary leading-relaxed block mt-0.5">
                        Level 4, House 12, Road 7, Dhanmondi, Dhaka 1205, Bangladesh
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 rounded-2xl bg-surface/50 p-4 border border-border/60">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-bold text-text-primary block text-sm">Desk Hours</span>
                      <span className="text-text-secondary leading-relaxed block mt-0.5">
                        Sunday – Thursday: 9:00 AM – 6:00 PM (BST)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Muhsina Secretariat Box */}
              <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-white via-surface to-primary/5 p-6 sm:p-7 shadow-soft space-y-3">
                <div className="flex items-center gap-2.5">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h4 className="font-bold text-sm text-text-primary">
                    Muhsina Organization Secretariat
                  </h4>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  For philanthropic funding, corporate partnerships, university chapters, and legal desk correspondence:
                </p>
                <a
                  href="mailto:partnerships@muhsina.org"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-heading-accent transition-colors"
                >
                  <span>partnerships@muhsina.org</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>

          {/* Quick FAQ Strip */}
          <div className="mt-16 rounded-3xl border border-border/80 bg-white p-8 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary">
                  Common Questions Before Messaging Us
                </h3>
                <p className="text-xs text-text-secondary">
                  Quick answers to frequent inquiries from sister community members.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-text-secondary">
              <div className="space-y-1.5">
                <p className="font-bold text-text-primary">Is BDSisters membership really free?</p>
                <p className="leading-relaxed">
                  Yes, 100% free under Muhsina Foundation's non-profit backing. We never charge subscription fees or commission on marketplace sales.
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="font-bold text-text-primary">How do I list my business?</p>
                <p className="leading-relaxed">
                  Register for a free account and submit your business details via the Member Dashboard. Our verification team reviews submissions within 48 hours.
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="font-bold text-text-primary">Who can join our circles?</p>
                <p className="leading-relaxed">
                  Any Bangladeshi woman — professionals, students, entrepreneurs, homemakers, and diaspora sisters across all 64 districts and abroad.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
