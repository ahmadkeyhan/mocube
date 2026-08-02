"use client";

import { motion, useReducedMotion } from "motion/react";
import { Children, type ReactNode } from "react";

type StaggerProps = {
  children: ReactNode;
  className?: string;
  /** Applied to each staggered item wrapper (e.g. masonry break-inside-avoid) */
  itemClassName?: string;
  /** Spring overshoot for playful tiles (e.g. contact) */
  spring?: boolean;
  stagger?: number;
};

const ease = [0.22, 1, 0.36, 1] as const;

const container = (staggerChildren: number) => ({
  hidden: {},
  show: {
    transition: { staggerChildren },
  },
});

const itemTween = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease },
  },
};

const itemSpring = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 280, damping: 18 },
  },
};

export function Stagger({
  children,
  className = "",
  itemClassName = "",
  spring = false,
  stagger = 0.08,
}: StaggerProps) {
  const reduce = useReducedMotion();
  const variants = spring ? itemSpring : itemTween;

  if (reduce) {
    return (
      <div className={className}>
        {Children.map(children, (child) => (
          <div className={itemClassName}>{child}</div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={container(stagger)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      {Children.map(children, (child) => (
        <motion.div className={itemClassName} variants={variants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
