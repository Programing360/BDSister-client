import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { FaqView } from "@/features/public/faq/components/faq-view";
import { publicService } from "@/features/public/services/public-service";
import { HelpCircle, Sparkles, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Frequently Asked Questions | BDSisters.org",
  description:
    "Find answers to common questions about BDSisters.org membership, business verification, artisan sales, and safe space community guidelines.",
};

export default async function FaqPage() {
  const faqItems = await publicService.getFaqs();

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
              <span>Transparency, Safety &amp; Membership Guidelines</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
              Everything You Need to Know About <br className="hidden sm:inline" />
              <span className="text-gradient-primary">BDSisters &amp; Muhsina</span>
            </h1>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl">
              Transparent answers regarding our community safe space, enterprise verification, zero marketplace commission, and how our sisterhood operates.
            </p>
          </div>
        </Container>
      </section>

      {/* FAQ Accordion Section */}
      <Section spacing="lg" className="bg-background">
        <Container size="lg">
          <FaqView items={faqItems} />
        </Container>
      </Section>
    </div>
  );
}
