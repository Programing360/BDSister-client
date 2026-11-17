import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CTASection } from "@/components/shared/cta-section";
import { ResourcesView } from "@/features/public/resources/components/resources-view";
import { publicService } from "@/features/public/services/public-service";
import {
  FileText,
  Sparkles,
  Download,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Resource Library & Toolkits | BDSisters.org",
  description:
    "Download verified business templates, legal agreement frameworks, funding guides, and career planning toolkits for Bangladeshi women.",
};

export default async function ResourcesPage() {
  const resources = await publicService.getResources();
  const categories = await publicService.getResourceCategories();

  return (
    <div className="flex flex-col bg-background min-h-screen">
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden border-b border-border/80 bg-white pt-14 pb-16 sm:pt-20 sm:pb-24">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -top-40 right-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-10 h-96 w-96 rounded-full bg-heading-accent/10 blur-3xl" />

        <Container size="lg">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary shadow-xs">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Vetted Toolkits &amp; Open-Access Templates</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
              Empower Your Enterprise with <br className="hidden sm:inline" />
              <span className="text-gradient-primary">Lawyer-Vetted Business Toolkits</span>
            </h1>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl">
              Free, battle-tested contract templates, financial spreadsheets in BDT, trade license filing checklists, and export documentation roadmaps created for Bangladeshi women.
            </p>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 w-full max-w-2xl">
              <div className="rounded-2xl border border-border/70 bg-surface/60 p-3.5 backdrop-blur-sm">
                <span className="text-2xl font-extrabold text-primary block">14,200+</span>
                <span className="text-[11px] font-semibold text-text-secondary">Template Downloads</span>
              </div>
              <div className="rounded-2xl border border-border/70 bg-surface/60 p-3.5 backdrop-blur-sm">
                <span className="text-2xl font-extrabold text-text-primary block">100%</span>
                <span className="text-[11px] font-semibold text-text-secondary">Free &amp; Open Access</span>
              </div>
              <div className="rounded-2xl border border-border/70 bg-surface/60 p-3.5 backdrop-blur-sm">
                <span className="text-2xl font-extrabold text-primary block">Verified</span>
                <span className="text-[11px] font-semibold text-text-secondary">By Bangladesh Bar</span>
              </div>
              <div className="rounded-2xl border border-border/70 bg-surface/60 p-3.5 backdrop-blur-sm">
                <span className="text-2xl font-extrabold text-text-primary block">BDT &amp; EN</span>
                <span className="text-[11px] font-semibold text-text-secondary">Bilingual Frameworks</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Directory Content */}
      <Section spacing="lg" className="bg-background">
        <Container size="lg">
          <ResourcesView
            initialResources={resources}
            categories={categories}
          />
        </Container>
      </Section>

      {/* Contribution CTA */}
      <CTASection
        badge="Community Knowledge"
        title="Contribute a Proven Template to the Sisterhood"
        description="Have you created an effective marketing dashboard, client intake sheet, or grant application model? Share it to empower thousands of aspiring female entrepreneurs."
        primaryAction={{
          label: "Submit a Resource",
          href: "/contact?subject=Resource%20Submission",
        }}
        secondaryAction={{
          label: "Explore Learning Academy",
          href: "/learning",
        }}
      />
    </div>
  );
}
