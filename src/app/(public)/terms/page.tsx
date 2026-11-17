import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { FileCheck, ShieldCheck, HeartHandshake } from "lucide-react";

export const metadata = {
  title: "Terms and Conditions | BDSisters.org",
  description:
    "Review our terms of service, platform rules, marketplace conduct guidelines, and legal responsibilities on BDSisters.org.",
};

export default function TermsPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Terms of Service" },
  ];

  return (
    <div className="flex flex-col bg-background min-h-screen">
      {/* Breadcrumb strip */}
      <div className="border-b border-border/80 bg-white/70 backdrop-blur-md py-3.5 sticky top-[72px] z-20">
        <Container size="lg">
          <Breadcrumb items={breadcrumbItems} />
        </Container>
      </div>

      {/* Editorial Hero */}
      <section className="relative overflow-hidden border-b border-border/80 bg-white pt-14 pb-16 sm:pt-18 sm:pb-20">
        <div className="pointer-events-none absolute -top-40 right-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <Container size="md">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary shadow-xs">
              <FileCheck className="h-4 w-4" />
              <span>Community Charter &amp; Platform Agreement</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary">
              Terms &amp; Conditions
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary">
              Community standards &amp; legal agreement • Effective Date: January 2026
            </p>
          </div>
        </Container>
      </section>

      <Section spacing="lg" className="bg-background">
        <Container size="md">
          <div className="rounded-3xl border border-border/80 bg-white p-6 sm:p-12 shadow-card space-y-10 text-sm sm:text-base text-text-secondary leading-relaxed">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-text-primary">1. Agreement to Terms</h2>
              <p>
                By accessing, browsing, registering an account, or listing business services on <strong>BDSisters.org</strong> (referred to as &ldquo;the Platform&rdquo;), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. The Platform is supervised and operated by <strong>Muhsina Organization</strong>.
              </p>
            </div>

            <div className="space-y-4 border-t border-border/80 pt-8">
              <h2 className="text-xl font-bold text-text-primary">2. Community Eligibility &amp; Sisterhood Mission</h2>
              <p>
                BDSisters.org is an affirmative digital network specifically dedicated to the professional, personal, and entrepreneurial advancement of Bangladeshi women residing locally or abroad.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm">
                <li>Members agree to provide authentic and truthful information during registration.</li>
                <li>Impersonating another sister, business, or public figure is strictly prohibited.</li>
                <li>Account credentials must be safeguarded and cannot be sold, rented, or transferred.</li>
              </ul>
            </div>

            <div className="space-y-4 border-t border-border/80 pt-8">
              <h2 className="text-xl font-bold text-text-primary">3. Safe Space Code of Conduct</h2>
              <p>
                Our community is founded upon mutual respect, dignity, and constructive upliftment. The following behaviors constitute grounds for immediate account suspension without prior notice:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm">
                <li>Harassment, intimidation, trolling, or defamatory statements targeting any community member.</li>
                <li>Leaking, broadcasting, or reproducing private sister stories or sensitive discussions outside the platform.</li>
                <li>Unsolicited commercial spamming, multi-level marketing (MLM), or pyramid schemes.</li>
                <li>Listing fraudulent, counterfeit, or prohibited merchandise.</li>
              </ul>
            </div>

            <div className="space-y-4 border-t border-border/80 pt-8">
              <h2 className="text-xl font-bold text-text-primary">4. Marketplace &amp; Artisan Commercial Integrity</h2>
              <p>
                The BDSisters Marketplace functions as an open promotional bridge between craftswomen and buyers. Commercial orders and financial settlements occur directly between buyer and seller.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm">
                <li>Artisan sellers must accurately represent product materials, dimensions, and production lead times.</li>
                <li>Sellers are solely responsible for package fulfillment, courier coordination, and honoring return commitments.</li>
                <li>BDSisters.org charges 0% commission on orders and acts as a verified directory rather than an escrow agent.</li>
              </ul>
            </div>

            <div className="space-y-4 border-t border-border/80 pt-8">
              <h2 className="text-xl font-bold text-text-primary">5. Intellectual Property &amp; Content Rights</h2>
              <p>
                The BDSisters brand name, logo, site architecture, and educational resources are the proprietary assets of Muhsina Organization.
              </p>
              <p>
                You retain 100% intellectual property ownership over your original craft photos, designs, and business brand assets uploaded to the site. By publishing, you grant BDSisters a non-exclusive license to feature your craft for promotional spotlighting.
              </p>
            </div>

            <div className="space-y-4 border-t border-border/80 pt-8">
              <h2 className="text-lg font-bold text-text-primary">6. Governing Law &amp; Amicable Mediation</h2>
              <p className="text-xs sm:text-sm">
                These terms are governed by and construed under the laws of the People&apos;s Republic of Bangladesh. Any dispute or grievance arising between members or regarding platform operation will be submitted to good-faith mediation facilitated by Muhsina Organization.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
