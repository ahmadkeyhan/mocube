import type { ServiceColor } from "@/lib/models/types";
import { serviceColorClass } from "@/lib/service-colors";

type CategoryLabelProps = {
  label: string;
  color: ServiceColor;
  className?: string;
};

export function CategoryLabel({
  label,
  color,
  className = "",
}: CategoryLabelProps) {
  return (
    <span
      className={`text-body font-normal bg-background px-2 py-1 rounded-full ${serviceColorClass[color]} ${className}`}
    >
      {label}
    </span>
  );
}
