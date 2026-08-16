import type { ReactNode } from "react";
import { MdRocket } from "react-icons/md";

type CustomerNameProps = {
  children: ReactNode;
  className?: string;
  iconClassName?: string;
};

export function CustomerName({
  children,
  className = "",
  iconClassName = "size-16 shrink-0",
}: CustomerNameProps) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <MdRocket aria-hidden className={iconClassName} />
      {children}
    </span>
  );
}
