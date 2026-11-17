import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";

export interface CTASectionProps {
  badge?: string;
  title?: string;
  description?: string;
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
  const finalPrimaryText = primaryAction?.label ?? primaryCtaText ?? "Become a Member";
  const finalPrimaryHref = primaryAction?.href ?? primaryCtaHref ?? "/register";
  const finalSecondaryText = secondaryAction?.label ?? secondaryCtaText;
  const finalSecondaryHref = secondaryAction?.href ?? secondaryCtaHref;

  return (
    <Card
      variant="default"
      className="relative overflow-hidden bg-gradient-to-br from-white via-surface to-primary-soft/40 border border-border shadow-elevated p-8 sm:p-12 md:p-16 text-center space-y-6"
    >
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-semibold shadow-subtle mx-auto">
        <Sparkles className="w-3.5 h-3.5" />
        <span>{badge}</span>
      </div>

      <div className="space-y-3 max-w-2xl mx-auto">
        <h2 className="text-display sm:text-4xl font-extrabold text-foreground tracking-tight">
          {title}
        </h2>
        <p className="text-body-lg text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link href={finalPrimaryHref}>
          <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
            {finalPrimaryText}
          </Button>
        </Link>
        {finalSecondaryText && finalSecondaryHref && (
          <Link href={finalSecondaryHref}>
            <Button variant="secondary" size="lg">
              {finalSecondaryText}
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
}
