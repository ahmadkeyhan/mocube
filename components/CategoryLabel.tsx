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
      className={`text-body font-normal px-2 py-1 ${serviceColorClass[color]} ${className}`}
    >
      {label}
    </span>
  );
}
