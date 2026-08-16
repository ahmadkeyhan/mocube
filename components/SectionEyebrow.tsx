import type { ReactNode } from "react";

type SectionEyebrowProps = {
  children: ReactNode;
  className?: string;
};

export function SectionEyebrow({
  children,
  className = "",
}: SectionEyebrowProps) {
  return (
    <p className={`text-body-sm text-foreground ${className}`}>
      {"{ "}
      {children}
      {" }"}
    </p>
  );
}
