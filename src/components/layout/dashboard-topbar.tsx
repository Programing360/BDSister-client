import { cn } from "@/lib/utils/cn";

interface DashboardTopbarProps {
  title?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
}

export function DashboardTopbar({
  title,
  leftSlot,
  rightSlot,
  className,
}: DashboardTopbarProps) {
  return (
    <header
      className={cn(
        "flex h-16 items-center justify-between border-b border-border bg-white/80 backdrop-blur-md px-6 shadow-subtle",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        {leftSlot}
        {title && (
          <h1 className="text-base font-bold text-foreground tracking-tight">
            {title}
          </h1>
        )}
      </div>
      <div className="flex items-center gap-3">{rightSlot}</div>
    </header>
  );
}
