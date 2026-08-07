import type { ServiceColor } from "@/lib/models/types";

export const serviceColorClass: Record<ServiceColor, string> = {
  orangey: "text-orangey",
  pink: "text-pink",
  lilac: "text-lilac",
  blue: "text-blue",
  "shockingly-green": "text-shockingly-green",
};

export const serviceBgClass: Record<ServiceColor, string> = {
  orangey: "bg-orangey",
  pink: "bg-pink",
  lilac: "bg-lilac",
  blue: "bg-blue",
  "shockingly-green": "bg-shockingly-green",
};

export const serviceGradient: Record<ServiceColor, string> = {
  orangey: "linear-gradient(135deg, var(--orangey) 0%, var(--orangey-soft) 100%)",
  pink: "linear-gradient(135deg, var(--pink) 0%, var(--blue) 100%)",
  lilac: "linear-gradient(135deg, var(--lilac) 0%, var(--pink) 100%)",
  blue: "linear-gradient(135deg, var(--blue) 0%, var(--light-green) 100%)",
  "shockingly-green":
    "linear-gradient(135deg, var(--shockingly-green) 0%, var(--light-green) 100%)",
};
