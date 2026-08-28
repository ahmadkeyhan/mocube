"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { PillButton } from "@/components/PillButton";
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

const cardVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
};

const titleVariants = {
  rest: { x: 0 },
  hover: { x: -4 },
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
    <motion.article
      className={`card-chrome relative cursor-pointer rounded-lg bg-background p-24 transition-colors hover:bg-background ${
        highlighted ? serviceBorderClass[color] : serviceHoverBorderClass[color]
      }`}
      initial="rest"
      whileHover={reduce ? undefined : "hover"}
      animate="rest"
      variants={reduce ? undefined : cardVariants}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
    >
      <Link
        href={href}
        className="absolute inset-0 z-0"
        aria-label={`انتخاب ${name}`}
      />
      <div className="relative z-10 pointer-events-none">
        <p className="text-body-sm text-surface-50">{name}</p>
        <motion.p
          className="font-changa mt-12 text-subheading font-bold tracking-subheading text-foreground"
          variants={reduce ? undefined : titleVariants}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
          {priceLabel}
        </motion.p>
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
        <div className="pointer-events-auto mt-24">
          <PillButton href={href}>انتخاب</PillButton>
        </div>
      </div>
    </motion.article>
  );
}
