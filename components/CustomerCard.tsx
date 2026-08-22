"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { CustomerLogo } from "@/components/CustomerLogo";
import { CustomerName } from "@/components/CustomerName";

type CustomerCardProps = {
  href: string;
  name: string;
  logoUrl: string;
  shortDescription: string;
};

const cardVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.03 },
};

const titleVariants = {
  rest: { x: 0 },
  hover: { x: -4 },
};

const logoVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.08 },
};

export function CustomerCard({
  href,
  name,
  logoUrl,
  shortDescription,
}: CustomerCardProps) {
  const reduce = useReducedMotion();

  return (
    <Link href={href} className="block">
      <motion.article
        className="card-chrome rounded-full bg-off-background p-0.5"
        initial="rest"
        whileHover={reduce ? undefined : "hover"}
        animate="rest"
        variants={reduce ? undefined : cardVariants}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
      >
        <div className="flex items-center gap-16">
          <motion.div
            className="shrink-0"
            variants={reduce ? undefined : logoVariants}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <CustomerLogo name={name} logoUrl={logoUrl} className="size-18" />
          </motion.div>
          <div className="min-w-0 py-2">
            <motion.h2
              className="text-body font-bold text-foreground"
              variants={reduce ? undefined : titleVariants}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <CustomerName>{name}</CustomerName>
            </motion.h2>
            <p className="text-body-sm text-surface-50">{shortDescription}</p>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
