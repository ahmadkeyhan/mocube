"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type HeroIntroProps = {
  eyebrow: ReactNode;
  headline: ReactNode;
  subcopy: ReactNode;
  actions: ReactNode;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroIntro({
  eyebrow,
  headline,
  subcopy,
  actions,
}: HeroIntroProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <>
        {eyebrow}
        {headline}
        {subcopy}
        {actions}
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        {eyebrow}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 36, rotate: -1.5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 20,
          delay: 0.08,
        }}
      >
        {headline}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.22, ease }}
      >
        {subcopy}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 22,
          delay: 0.32,
        }}
      >
        {actions}
      </motion.div>
    </>
  );
}
