"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { PillButton } from "@/components/PillButton";
import type { ServiceColor } from "@/lib/models/types";
import { serviceHoverBorderClass } from "@/lib/service-colors";

type MicroServiceCardProps = {
  href: string;
  name: string;
  shortDescription: string;
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

export function MicroServiceCard({
  href,
  name,
  shortDescription,
  color,
}: MicroServiceCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      className={`card-chrome relative rounded-lg bg-off-background p-24 transition-colors hover:bg-background ${serviceHoverBorderClass[color]}`}
      initial="rest"
      whileHover={reduce ? undefined : "hover"}
      animate="rest"
      variants={reduce ? undefined : cardVariants}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
    >
      <Link
        href={href}
        className="absolute inset-0 z-0"
        aria-label={`کاوش ${name}`}
      />
      <div className="relative z-10 pointer-events-none flex items-center justify-between gap-16">
        <motion.h3
          className="min-w-0 text-[20px] leading-[1.2] font-bold tracking-[-0.2px] text-foreground md:text-[26px] md:tracking-[-0.26px]"
          variants={reduce ? undefined : titleVariants}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
          {name}
        </motion.h3>
        <div className="pointer-events-auto shrink-0">
          <PillButton href={href}>کاوش</PillButton>
        </div>
      </div>
      <p className="relative z-10 pointer-events-none mt-12 text-body text-surface-50">
        {shortDescription}
      </p>
    </motion.article>
  );
}
