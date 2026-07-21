"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ServiceColor } from "@/lib/models/types";
import { serviceGradient } from "@/lib/service-colors";

type OrganicBlobProps = {
  color: ServiceColor;
  className?: string;
  /** Offset cycle so multiple blobs feel independent */
  delay?: number;
  duration?: number;
};

export function OrganicBlob({
  color,
  className = "",
  delay = 0,
  duration = 8,
}: OrganicBlobProps) {
  const reduce = useReducedMotion();

  const style = {
    background: serviceGradient[color],
    boxShadow: "inset 0 -40px 80px rgba(14, 16, 15, 0.35)",
  };

  const classNames = `pointer-events-none aspect-square w-full max-w-[360px] rounded-[40%] opacity-90 blur-[0.5px] ${className}`;

  if (reduce) {
    return <div className={classNames} style={style} aria-hidden />;
  }

  return (
    <motion.div
      className={classNames}
      style={style}
      aria-hidden
      animate={{
        x: [0, -12, 8, 0],
        y: [0, 10, -6, 0],
        scale: [1, 1.04, 0.98, 1],
        rotate: [0, 3, -2, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
