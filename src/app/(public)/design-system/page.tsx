import { notFound } from "next/navigation";
import { BRAND_COLORS, GRADIENTS } from "@/config/theme";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PageHeader } from "@/components/layout/page-header";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Heart,
  Shield,
  Search,
  ArrowRight,
  User,
  Mail,
  Lock,
  Layers,
  Settings,
  Star,
  ExternalLink,
} from "lucide-react";

export const metadata = {
  title: "Design System Preview | BDSisters",
  description: "BDSisters Design System, Brand Tokens, and Reusable UI Components Showcase.",
};

export default function DesignSystemPage() {
  // Security rule: Hide in production unless explicitly enabled via environment variable
  if (
    process.env.NODE_ENV === "production" &&
    process.env["NEXT_PUBLIC_ENABLE_DESIGN_SYSTEM"] !== "true"
  ) {
    notFound();
  }

  const colorPalette = [
    {
      name: "Primary Background",
      token: "--color-background",
      hex: BRAND_COLORS.background,
      role: "App body background & page canvas",
      contrast: "Dark text (#111827)",
      border: true,
    },
    {
      name: "Primary Brand / Accent",
      token: "--color-primary",
      hex: BRAND_COLORS.primary,
      role: "Primary CTAs, active highlights, key links",
      contrast: "White text (#FFFFFF)",
      dark: true,
    },
    {
      name: "Heading Accent",
      token: "--color-heading-accent",
      hex: BRAND_COLORS.headingAccent,
      role: "Heading emphasis & highlighted keywords",
      contrast: "White or light background",
      dark: true,
    },
    {
      name: "Primary Text",
      token: "--color-text-primary",
      hex: BRAND_COLORS.textPrimary,
      role: "Headings, body titles, high-contrast text",
      contrast: "Lavender / White background",
      dark: true,
    },
    {
      name: "Secondary Text",
      token: "--color-text-secondary",
      hex: BRAND_COLORS.textSecondary,
      role: "Paragraphs, supporting text, subtitles",
      contrast: "Lavender / White background",
      dark: true,
    },
    {
      name: "Surface / Glass Card",
      token: "--color-surface",
      hex: BRAND_COLORS.surface,
      role: "Standard card containers, panels, dropdowns",
      contrast: "Dark text (#111827)",
      border: true,
    },
    {
      name: "Neutral / Logo",
      token: "--color-neutral",
      hex: BRAND_COLORS.neutral,
      role: "Inactive icons, placeholder text, neutral badges",
      contrast: "Supporting accents",
      border: true,
    },
    {
      name: "Button Text / White",
      token: "--color-button-text",
      hex: BRAND_COLORS.buttonText,
      role: "High-contrast text on primary buttons",
      contrast: "Purple background (#5B46F6)",
      border: true,
    },
  ];

  return (
    <div className="min-h-screen py-10 bg-background">
      <Container size="xl" className="space-y-16">
        {/* Header */}
        <PageHeader
          title="BDSisters Design System Showcase"
          description="Centralized color tokens, typography scales, glassmorphism surfaces, and reusable UI component foundations."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Design System" },
          ]}
          actions={
            <Badge variant="soft" size="lg">
              <Sparkles className="w-3.5 h-3.5 text-primary mr-1" />
              v1.0 (Step 2)
            </Badge>
          }
        />

        {/* 1. Mandatory Color Palette */}
        <Section spacing="none" className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-h2 font-bold text-foreground">
              1. Brand Color Palette
            </h2>
            <p className="text-sm text-text-secondary">
              Strictly configured mandatory hex codes exposed as semantic CSS &amp; Tailwind tokens.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {colorPalette.map((item) => (
              <Card
                key={item.token}
                variant="default"
                className="overflow-hidden p-0 border border-border shadow-subtle hover-lift"
              >
                <div
                  className="h-24 w-full flex items-end p-3"
                  style={{ backgroundColor: item.hex }}
                >
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      item.dark
                        ? "bg-black/30 text-white"
                        : "bg-white/80 text-text-primary"
                    }`}
                  >
                    {item.hex}
                  </span>
                </div>
                <div className="p-4 space-y-1.5 bg-white">
                  <h4 className="font-bold text-sm text-foreground">{item.name}</h4>
                  <p className="font-mono text-xs text-primary">{item.token}</p>
                  <p className="text-xs text-text-secondary">{item.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        {/* 2. Gradient System */}
        <Section spacing="none" className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-h2 font-bold text-foreground">
              2. Gradient System
            </h2>
            <p className="text-sm text-text-secondary">
              Controlled, selective gradients using the primary brand palette.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default" className="p-0 overflow-hidden shadow-card">
              <div
                className="h-28 w-full flex items-center justify-center p-4 text-white font-bold"
                style={{ background: GRADIENTS.primary }}
              >
                Primary Brand Gradient
              </div>
              <div className="p-4 bg-white text-xs space-y-1">
                <p className="font-semibold text-text-primary">linear-gradient(135deg, #5B46F6 0%, #7366F7 100%)</p>
                <p className="text-text-muted">Used for key CTA highlights and active branding accents.</p>
              </div>
            </Card>

            <Card variant="default" className="p-0 overflow-hidden shadow-card">
              <div
                className="h-28 w-full flex items-center justify-center p-4 text-text-primary font-bold border-b border-border"
                style={{ background: GRADIENTS.lavender }}
              >
                Soft Lavender Gradient
              </div>
              <div className="p-4 bg-white text-xs space-y-1">
                <p className="font-semibold text-text-primary">linear-gradient(135deg, #EAE6F7 0%, #F3F4F6 100%)</p>
                <p className="text-text-muted">Used for hero banners and page transition surfaces.</p>
              </div>
            </Card>

            <Card variant="default" className="p-0 overflow-hidden shadow-card">
              <div
                className="h-28 w-full flex items-center justify-center p-4 text-text-primary font-bold border-b border-border"
                style={{ background: GRADIENTS.surface }}
              >
                Subtle Surface Gradient
              </div>
              <div className="p-4 bg-white text-xs space-y-1">
                <p className="font-semibold text-text-primary">linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 100%)</p>
                <p className="text-text-muted">Used for elevated feature cards and dashboard widgets.</p>
              </div>
            </Card>
          </div>
        </Section>

        {/* 3. Typography Hierarchy */}
        <Section spacing="none" className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-h2 font-bold text-foreground">
              3. Typography Scale
            </h2>
            <p className="text-sm text-text-secondary">
              Modern sans-serif type scale (Inter/Geist) optimized for responsive readability.
            </p>
          </div>

          <Card variant="default" className="p-6 divide-y divide-border bg-white">
            <div className="py-4 space-y-1">
              <span className="text-xs font-mono text-text-muted">Display — clamp(2.5rem, 5vw, 3.5rem) / 800</span>
              <p className="text-display">Empowering Bangladeshi Women</p>
            </div>
            <div className="py-4 space-y-1">
              <span className="text-xs font-mono text-text-muted">H1 Page Title — clamp(1.875rem, 4vw, 2.5rem) / 700</span>
              <p className="text-h1">Professional Networking &amp; Community</p>
            </div>
            <div className="py-4 space-y-1">
              <span className="text-xs font-mono text-text-muted">H2 Section Heading — clamp(1.5rem, 3vw, 2rem) / 700</span>
              <p className="text-h2">
                Discover Business Opportunities with <span className="text-heading-accent">Muhsina</span>
              </p>
            </div>
            <div className="py-4 space-y-1">
              <span className="text-xs font-mono text-text-muted">H3 Subsection &amp; Card Title — 1.375rem / 600</span>
              <p className="text-h3">Marketplace &amp; Entrepreneurship Hub</p>
            </div>
            <div className="py-4 space-y-1">
              <span className="text-xs font-mono text-text-muted">H4 Small Title — 1.125rem / 600</span>
              <p className="text-h4">Event Schedule &amp; Mentorship Workshops</p>
            </div>
            <div className="py-4 space-y-1">
              <span className="text-xs font-mono text-text-muted">Body Large — 1.125rem / 400</span>
              <p className="text-body-lg">
                BDSisters.org provides Bangladeshi women with an inclusive, safe, and professional
                space to scale their careers, launch businesses, and exchange skills.
              </p>
            </div>
            <div className="py-4 space-y-1">
              <span className="text-xs font-mono text-text-muted">Body Standard — 1rem / 400</span>
              <p className="text-body">
                Access verified mentorship, list your artisan shop, and connect with peers across all 64 districts.
              </p>
            </div>
            <div className="py-4 space-y-1">
              <span className="text-xs font-mono text-text-muted">Small &amp; Caption — 0.875rem / 0.75rem</span>
              <p className="text-small">Supporting descriptive text and form labels.</p>
              <p className="text-caption">METADATA • PUBLISHED ON NOV 16, 2026 • 5 MIN READ</p>
            </div>
          </Card>
        </Section>

        {/* 4. Button System */}
        <Section spacing="none" className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-h2 font-bold text-foreground">
              4. Button System
            </h2>
            <p className="text-sm text-text-secondary">
              7 consistent visual variants across 4 standard sizes with accessible focus rings and loading states.
            </p>
          </div>

          <Card variant="default" className="p-6 bg-white space-y-6">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Variants (Medium Size)
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="soft">Soft Lavender</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="link">Link Button</Button>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-border">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Sizes &amp; Icons
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" size="sm" leftIcon={<Star className="w-3.5 h-3.5" />}>
                  Small
                </Button>
                <Button variant="primary" size="md" leftIcon={<Heart className="w-4 h-4" />}>
                  Medium
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Large Button
                </Button>
                <Button variant="outline" size="icon" aria-label="Settings">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="primary" isLoading>
                  Loading State
                </Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
              </div>
            </div>
          </Card>
        </Section>

        {/* 5. Card System & Glassmorphism */}
        <Section spacing="none" className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-h2 font-bold text-foreground">
              5. Card System &amp; Glassmorphism
            </h2>
            <p className="text-sm text-text-secondary">
              6 card variants matching the design direction: minimal, elegant, and readable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card variant="default">
              <CardHeader>
                <Badge variant="default" size="sm" className="w-fit mb-2">Default Card</Badge>
                <CardTitle>Standard Surface</CardTitle>
                <CardDescription>
                  Clean light gray (#F3F4F6) surface for general dashboard sections and feeds.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary">Borders use the soft lavender #DDD8EA token.</p>
              </CardContent>
              <CardFooter>
                <Button variant="soft" size="sm">Action</Button>
              </CardFooter>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <Badge variant="primary" size="sm" className="w-fit mb-2">Elevated Card</Badge>
                <CardTitle>White Elevated</CardTitle>
                <CardDescription>
                  Crisp white background with soft purple shadow for focal point components.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary">Subtle elevation without harsh shadows.</p>
              </CardContent>
              <CardFooter>
                <Button variant="primary" size="sm">Learn More</Button>
              </CardFooter>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <Badge variant="soft" size="sm" className="w-fit mb-2">Glassmorphism</Badge>
                <CardTitle>Glass Card</CardTitle>
                <CardDescription>
                  Frosted glass effect with blur(14px) and translucent border overlay.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary">Maintains WCAG contrast over lavender backgrounds.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">View Glass</Button>
              </CardFooter>
            </Card>

            <Card variant="interactive">
              <CardHeader>
                <Badge variant="soft" size="sm" className="w-fit mb-2">Interactive</Badge>
                <CardTitle>Hover Lift Card</CardTitle>
                <CardDescription>
                  Hover over this card to preview the subtle lift transition.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary">Translates Y -2px with smooth shadow expansion.</p>
              </CardContent>
            </Card>

            <Card variant="statistics">
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-bold uppercase text-text-muted">Total Members</span>
                <div className="h-8 w-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-foreground">12,450+</p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">↑ 18% growth this month</p>
            </Card>

            <Card variant="feature">
              <CardHeader>
                <Badge variant="success" size="sm" className="w-fit mb-2">Feature Card</Badge>
                <CardTitle>Gradient Feature</CardTitle>
                <CardDescription>
                  Soft gradient from white to light surface for highlighted announcements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary">Blends seamlessly into the lavender canvas.</p>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* 6. Form Controls & Input System */}
        <Section spacing="none" className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-h2 font-bold text-foreground">
              6. Form &amp; Input Design
            </h2>
            <p className="text-sm text-text-secondary">
              Accessible inputs, labels, helper text, and error states using `#5B46F6` focus rings.
            </p>
          </div>

          <Card variant="default" className="p-6 bg-white max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Full Name"
                required
                helperText="Enter your name as it appears on your NID or passport"
              >
                <Input
                  placeholder="e.g. Nusrat Jahan"
                  leftIcon={<User className="w-4 h-4" />}
                />
              </FormField>

              <FormField
                label="Email Address"
                required
                error="Please enter a valid email address"
              >
                <Input
                  error
                  placeholder="you@domain.com"
                  defaultValue="invalid-email"
                  leftIcon={<Mail className="w-4 h-4" />}
                />
              </FormField>

              <FormField label="Search Directory">
                <Input
                  placeholder="Search members, products, businesses..."
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </FormField>

              <FormField label="Password" required>
                <Input
                  type="password"
                  placeholder="••••••••"
                  leftIcon={<Lock className="w-4 h-4" />}
                />
              </FormField>

              <div className="col-span-1 md:col-span-2">
                <FormField
                  label="Community Bio"
                  helperText="Tell the sisters about your professional background and interests"
                >
                  <Textarea placeholder="Write a brief introduction..." />
                </FormField>
              </div>

              <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-2">
                <Button variant="ghost">Cancel</Button>
                <Button variant="primary">Submit Application</Button>
              </div>
            </div>
          </Card>
        </Section>

        {/* 7. Badges & Semantic Status */}
        <Section spacing="none" className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-h2 font-bold text-foreground">
              7. Badges &amp; Status Indicators
            </h2>
            <p className="text-sm text-text-secondary">
              Semantic status pills for verification tiers, orders, and roles.
            </p>
          </div>

          <Card variant="default" className="p-6 bg-white space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="default">Default Neutral</Badge>
              <Badge variant="primary">Primary Brand</Badge>
              <Badge variant="soft">Soft Lavender</Badge>
              <Badge variant="success" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                Verified Member
              </Badge>
              <Badge variant="warning" icon={<AlertCircle className="w-3.5 h-3.5" />}>
                Pending Review
              </Badge>
              <Badge variant="danger">Suspended</Badge>
              <Badge variant="outline">Outline Badge</Badge>
            </div>
          </Card>
        </Section>

        {/* 8. Lucide Icons Showcase */}
        <Section spacing="none" className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-h2 font-bold text-foreground">
              8. Iconography Foundation (Lucide React)
            </h2>
            <p className="text-sm text-text-secondary">
              Consistent 20px / 18px / 16px icon scale with standardized stroke width.
            </p>
          </div>

          <Card variant="default" className="p-6 bg-white">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 text-center">
              {[
                { icon: Sparkles, label: "Sparkles" },
                { icon: Shield, label: "Shield" },
                { icon: Heart, label: "Heart" },
                { icon: Layers, label: "Layers" },
                { icon: User, label: "User" },
                { icon: CheckCircle2, label: "Verified" },
                { icon: Mail, label: "Message" },
                { icon: Lock, label: "Security" },
                { icon: Search, label: "Search" },
                { icon: Settings, label: "Settings" },
                { icon: Star, label: "Rating" },
                { icon: ExternalLink, label: "External" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-surface hover:bg-primary-soft hover:text-primary transition-smooth"
                >
                  <item.icon className="w-5 h-5 mb-1.5" />
                  <span className="text-xs font-medium text-text-secondary">{item.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </Section>
      </Container>
    </div>
  );
}
