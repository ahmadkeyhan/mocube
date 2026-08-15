"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import type { ServiceColor } from "@/lib/models/types";
import {
  serviceBeforeColorClass,
  serviceBorderClass,
  serviceHoverBorderClass,
} from "@/lib/service-colors";

type PricingCardProps = {
  name: string;
  priceLabel: string;
  features: string[];
  highlighted?: boolean;
  href: string;
  color: ServiceColor;
};

export function PricingCard({
  name,
  priceLabel,
  features,
  highlighted = false,
  href,
  color,
}: PricingCardProps) {
  const reduce = useReducedMotion();

  return (
    <Link href={href} className="block">
      <motion.article
        className={`card-chrome rounded-lg p-24 ${
          highlighted
            ? `${serviceBorderClass[color]} bg-off-background`
            : `bg-background ${serviceHoverBorderClass[color]}`
        }`}
        whileHover={reduce ? undefined : { scale: 1.02 }}
        whileTap={reduce ? undefined : { scale: 0.99 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
      >
        <p className="text-body-sm text-surface-50">{name}</p>
        <p className="font-changa mt-12 text-subheading font-bold tracking-subheading text-foreground">
          {priceLabel}
        </p>
        <ul className="mt-24 flex flex-col gap-12">
          {features.map((feature) => (
            <li
              key={feature}
              className={`text-body-sm text-foreground before:me-8 ${serviceBeforeColorClass[color]} before:content-['•']`}
            >
              {feature}
            </li>
          ))}
        </ul>
      </motion.article>
    </Link>
  );
}
