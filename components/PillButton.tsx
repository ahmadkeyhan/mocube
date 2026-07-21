"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type PillButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

export function PillButton({
  href,
  children,
  className = "",
  ...props
}: PillButtonProps) {
  const reduce = useReducedMotion();
  const classes = `inline-flex items-center justify-center rounded-full border border-surface-cream px-24 py-[15px] text-[18px] leading-[1.05] font-bold text-surface-cream transition-colors hover:border-surface-50 hover:text-surface-cream ${className}`;

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
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
    >
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    </motion.div>
  );
}
