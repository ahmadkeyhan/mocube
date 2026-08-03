import type { ComponentProps } from "react";

export type SurfaceCardVariant =
  | "tileHover"
  | "tileSoft"
  | "panel"
  | "row"
  | "empty";

const variants: Record<SurfaceCardVariant, string> = {
  tileHover:
    "rounded-lg border border-surface-25 p-24 transition-colors hover:border-surface-50 hover:bg-off-black",
  tileSoft:
    "rounded-lg border border-surface-25 p-24 transition-colors hover:border-surface-cream",
  panel:
    "rounded-lg border border-surface-25 bg-off-black p-24 transition-colors hover:border-shockingly-green",
  row: "flex flex-wrap items-center justify-between gap-12 rounded-lg border border-surface-25 bg-off-black px-20 py-16",
  empty:
    "rounded-lg border border-surface-25 p-24 text-body-sm text-surface-50",
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
