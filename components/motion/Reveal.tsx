"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Extra initial transform for playful accents (e.g. blobs) */
  fromScale?: number;
  fromRotate?: number;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  className = "",
  delay = 0,
  fromScale = 1,
  fromRotate = 0,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: 24,
        scale: fromScale,
        rotate: fromRotate,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        rotate: 0,
      }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        delay,
        ease,
      }}
    >
      {children}
    </motion.div>
  );
}
