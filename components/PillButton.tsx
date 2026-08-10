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
  const classes = `inline-flex bg-background/50 items-center justify-center rounded-full border border-surface-25 px-20 py-12 text-body-sm font-bold text-foreground transition-colors hover:border-surface-50 hover:text-foreground ${className}`;

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
