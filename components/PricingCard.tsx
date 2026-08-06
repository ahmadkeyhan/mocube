"use client";

import { motion, useReducedMotion } from "motion/react";

type PricingCardProps = {
  name: string;
  priceLabel: string;
  features: string[];
  highlighted?: boolean;
};

export function PricingCard({
  name,
  priceLabel,
  features,
  highlighted = false,
}: PricingCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={`rounded-lg p-24 ${highlighted ? "border border-shockingly-green/50 bg-off-background" : "border border-surface-25 bg-background"}`}
      animate={reduce || !highlighted ? undefined : { scale: [1, 1.02, 1] }}
      transition={
        highlighted
          ? { duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }
          : undefined
      }
    >
      <p className="text-body-sm text-surface-50">{name}</p>
      <p className="font-changa mt-12 text-subheading font-bold tracking-subheading text-foreground">
        {priceLabel}
      </p>
      <ul className="mt-24 flex flex-col gap-12">
        {features.map((feature) => (
          <li
            key={feature}
            className="text-body-sm text-foreground before:me-8 before:text-shockingly-green before:content-['•']"
          >
            {feature}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
