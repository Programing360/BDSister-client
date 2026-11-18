import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Users,
  Heart,
} from "lucide-react";

export interface CTASectionProps {
  badge?: string;
  title?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
}

export function CTASection({
  badge = "Join BDSisters Today",
  title = "Your Journey of Growth Starts Here",
  description = "Join thousands of visionary Bangladeshi women building sustainable enterprises, mastering high-income skills, and uplifting each other.",
  primaryCtaText,
  primaryCtaHref,
  secondaryCtaText,
  secondaryCtaHref,
  primaryAction,
  secondaryAction,
}: CTASectionProps) {
  const finalPrimaryText =
    primaryAction?.label ?? primaryCtaText ?? "Become a Member";

  const finalPrimaryHref = primaryAction?.href ?? primaryCtaHref ?? "/register";

  const finalSecondaryText = secondaryAction?.label ?? secondaryCtaText;

  const finalSecondaryHref = secondaryAction?.href ?? secondaryCtaHref;

  return (
    <section className="relative mx-auto w-full">
      <Card
        variant="default"
        className="group relative isolate overflow-hidden rounded-[2rem] border border-border/60 bg-gradient-to-br from-primary/[0.09] via-background to-primary/[0.04] p-7 shadow-xl shadow-primary/[0.04] transition-all duration-500 hover:shadow-2xl hover:shadow-primary/[0.08] sm:p-10 lg:p-14"
      >
        {/* Background Decorations */}
        <div className="pointer-events-none absolute -right-24 -top-28 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-[90px]" />

        <div className="pointer-events-none absolute -bottom-32 -left-24 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-[100px]" />

        <div className="pointer-events-none absolute right-10 top-10 -z-10 opacity-[0.06]">
          <Sparkles className="h-40 w-40 text-primary" />
        </div>

        {/* Content */}
        <div
          data-aos="fade-up"
          data-aos-duration="800"
          className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          {/* Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold tracking-wide text-primary shadow-sm sm:text-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            {badge}
          </div>

          {/* Heading */}
          <h2 className="max-w-3xl text-3xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {title}
          </h2>

          {/* Description */}
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            {description}
          </p>

          {/* Trust Indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground/75 sm:text-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
              <span>100% Free Membership</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-foreground/75 sm:text-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
              <span>Verified Women-Led Network</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-foreground/75 sm:text-sm">
              <Heart className="h-4 w-4 shrink-0 text-primary" />
              <span>Community First</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <Link href={finalPrimaryHref} className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="group/button h-12 w-full rounded-xl px-7 text-sm font-bold shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/25 sm:w-auto"
              >
                {finalPrimaryText}
              </Button>
            </Link>

            {finalSecondaryText && finalSecondaryHref && (
              <Link href={finalSecondaryHref} className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="h-12 w-full rounded-xl border border-border/70 bg-background/70 px-7 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/5 sm:w-auto"
                >
                  {finalSecondaryText}
                </Button>
              </Link>
            )}
          </div>

          {/* Bottom Community Note */}
          <div className="mt-9 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            <span>Grow together. Build together. Succeed together.</span>
          </div>
        </div>

        {/* Decorative Bottom Border */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-70" />
      </Card>
    </section>
  );
}
