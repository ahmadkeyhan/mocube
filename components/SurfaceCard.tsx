import type { ComponentProps } from "react";

export type SurfaceCardVariant =
  | "tileHover"
  | "tileSoft"
  | "panel"
  | "row"
  | "empty";

const variants: Record<SurfaceCardVariant, string> = {
  tileHover:
    "card-chrome block rounded-lg bg-off-background p-24 transition-colors hover:border-surface-50 hover:bg-background",
  tileSoft:
    "card-chrome block rounded-lg bg-off-background p-24 transition-colors hover:border-foreground",
  panel:
    "card-chrome block rounded-lg bg-off-background p-24 transition-colors hover:border-shockingly-green",
  row: "card-chrome flex flex-wrap items-center justify-between gap-12 rounded-lg bg-off-background px-20 py-16",
  empty:
    "card-chrome block rounded-lg p-24 text-body-sm text-surface-50",
};

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function surfaceCardClass(
  variant: SurfaceCardVariant,
  className?: string,
): string {
  return cx(variants[variant], className);
}

type SurfaceCardProps = ComponentProps<"div"> & {
  variant: SurfaceCardVariant;
};

export function SurfaceCard({
  variant,
  className,
  children,
  ...props
}: SurfaceCardProps) {
  return (
    <div className={surfaceCardClass(variant, className)} {...props}>
      {children}
    </div>
  );
}
