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
  orangey: "linear-gradient(135deg, #ff8709 0%, #ffc078 100%)",
  pink: "linear-gradient(135deg, #fec5fb 0%, #00bae2 100%)",
  lilac: "linear-gradient(135deg, #9d95ff 0%, #fec5fb 100%)",
  blue: "linear-gradient(135deg, #00bae2 0%, #abff84 100%)",
  "shockingly-green": "linear-gradient(135deg, #0ae448 0%, #abff84 100%)",
};
