"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { ServiceColor } from "@/lib/models/types";
import { serviceBgClass } from "@/lib/service-colors";

type GradientCtaProps = {
  href: string;
  children: ReactNode;
  className?: string;
  color?: ServiceColor;
} & Omit<
  ComponentProps<typeof Link>,
  "href" | "className" | "children" | "color"
>;

export function GradientCta({
  href,
  children,
  className = "",
  color,
  ...props
}: GradientCtaProps) {
  const reduce = useReducedMotion();
  const bgClass = color ? serviceBgClass[color] : "bg-shockingly-green";
  const classes = `${bgClass} inline-flex items-center justify-center rounded-full px-20 py-12 text-body-sm font-bold text-background ${className}`;

  if (reduce) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <motion.div
      className="inline-flex"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    </motion.div>
  );
}
