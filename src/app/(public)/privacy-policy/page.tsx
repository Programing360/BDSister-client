import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Shield, Lock, CheckCircle2, FileCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | BDSisters.org",
  description:
    "Review our transparent privacy policy, data protection standards, and our non-commercialization guarantee for Bangladeshi women.",
};

export default function PrivacyPolicyPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Privacy Policy" },
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
              <Lock className="h-4 w-4" />
              <span>Dignity &amp; Member Privacy Pledge</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary">
              Privacy Policy &amp; Data Ethics
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary">
              Official legal statement • Last reviewed &amp; updated: January 2026
            </p>
          </div>
        </Container>
      </section>

      <Section spacing="lg" className="bg-background">
        <Container size="md">
          <div className="rounded-3xl border border-border/80 bg-white p-6 sm:p-12 shadow-card space-y-10 text-sm sm:text-base text-text-secondary leading-relaxed">
            {/* Core Non-Profit Guarantee */}
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-white via-surface to-primary/5 p-6 sm:p-8 space-y-3 shadow-soft">
              <div className="flex items-center gap-2.5 text-primary font-bold text-base">
                <Shield className="h-5 w-5 text-primary" />
                <span>Our Core Privacy Pledge</span>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                BDSisters.org is chartered and supervised by <strong>Muhsina Organization</strong> as an affirmative, non-profit community initiative. We strictly never sell, rent, monetize, or broker personal member data, phone numbers, or browsing histories to external ad networks or commercial brokers.
              </p>
            </div>

            <div className="space-y-4 border-t border-border/80 pt-8">
              <h2 className="text-xl font-bold text-text-primary">1. Information We Collect</h2>
              <p>
                To provide an authentic, safe, and vetted network for Bangladeshi women, we collect only data necessary to power platform services:
              </p>
              <ul className="list-disc pl-6 space-y-2.5 text-xs sm:text-sm">
                <li>
                  <strong className="text-text-primary">Account Credentials:</strong> Full name, verified email address, optional contact phone number, and district/city of residence.
                </li>
                <li>
                  <strong className="text-text-primary">Enterprise Verification Data:</strong> Trade license number, e-TIN (where provided voluntarily for verification), official business social links, and identity verification documents.
                </li>
                <li>
                  <strong className="text-text-primary">Community Content:</strong> Posts and replies shared in public community circles, masterclass enrollments, and inquiries sent to the support desk.
                </li>
              </ul>
            </div>

            <div className="space-y-4 border-t border-border/80 pt-8">
              <h2 className="text-xl font-bold text-text-primary">2. How Your Information is Used</h2>
              <p>Your data is used strictly for legitimate platform purposes:</p>
              <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm">
                <li>Verifying female identities to maintain safe, harassment-free community spaces.</li>
                <li>Publishing verified storefront profiles in our Business Directory.</li>
                <li>Transmitting transactional notifications, workshop calendar links, and account alerts.</li>
                <li>Connecting prospective customers directly with women artisans without intermediary surcharges.</li>
              </ul>
            </div>

            <div className="space-y-4 border-t border-border/80 pt-8">
              <h2 className="text-xl font-bold text-text-primary">3. Data Security &amp; Cryptographic Standards</h2>
              <p>
                All data in transit is encrypted using modern Transport Layer Security (TLS 1.3). Account authentication is powered by secure token sessions, salted password hashing, and strict Role-Based Access Control (RBAC) preventing unauthorized administrative inspection.
              </p>
            </div>

            <div className="space-y-4 border-t border-border/80 pt-8">
              <h2 className="text-xl font-bold text-text-primary">4. Member Sovereignty &amp; Account Deletion</h2>
              <p>
                You retain complete ownership of your personal profile. You may edit your visibility settings or request full, permanent deletion of your account and all associated data at any time by contacting our data officer at{" "}
                <a
                  href="mailto:privacy@bdsisters.org"
                  className="text-primary font-bold hover:underline"
                >
                  privacy@bdsisters.org
                </a>.
              </p>
            </div>

            <div className="space-y-4 border-t border-border/80 pt-8">
              <h2 className="text-lg font-bold text-text-primary">5. Contact Our Privacy Secretariat</h2>
              <p className="text-xs sm:text-sm">
                For questions regarding our privacy architecture or compliance with the Information and Communication Technology Act and international standards:
              </p>
              <div className="rounded-2xl bg-surface/60 p-4 border border-border/60 text-xs space-y-1">
                <p className="font-bold text-text-primary">Muhsina Organization • BDSisters Privacy Officer</p>
                <p className="text-text-secondary">Email: privacy@bdsisters.org</p>
                <p className="text-text-secondary">Office: Dhanmondi, Dhaka 1205, Bangladesh</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
