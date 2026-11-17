import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  badge?: string;
  badgeIcon?: React.ReactNode;
  title: string;
  accentWord?: string;
  description?: string;
  align?: "left" | "center" | "right";
}

export function SectionHeading({
  badge,
  badgeIcon,
  title,
  accentWord,
  description,
  align = "center",
  className,
  ...props
}: SectionHeadingProps) {
  // If accentWord is specified and present in title, highlight it with text-heading-accent
  const renderTitle = () => {
    if (!accentWord || !title.includes(accentWord)) {
      return title;
    }
    const parts = title.split(accentWord);
    return (
      <>
        {parts[0]}
        <span className="text-heading-accent">{accentWord}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div
      className={cn(
        "space-y-3.5 max-w-3xl",
        align === "center" && "mx-auto text-center",
        align === "right" && "ml-auto text-right",
        align === "left" && "text-left",
        className,
      )}
      {...props}
    >
      {badge && (
        <div className={cn("flex", align === "center" && "justify-center")}>
          <Badge variant="soft" size="md" icon={badgeIcon} className="shadow-subtle">
            {badge}
          </Badge>
        </div>
      )}

      <h2 className="text-h2 font-extrabold text-foreground tracking-tight">
        {renderTitle()}
      </h2>

      {description && (
        <p className="text-body text-text-secondary leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
