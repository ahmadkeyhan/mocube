"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { CategoryLabel } from "@/components/CategoryLabel";
import type { ServiceColor } from "@/lib/models/types";

type ShowcaseCardProps = {
  href: string;
  title: string;
  coverUrl: string;
  customerName?: string;
  services?: { name: string; color: ServiceColor }[];
};

const coverVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.04 },
};

const titleVariants = {
  rest: { x: 0 },
  hover: { x: -4 },
};

export function ShowcaseCard({
  href,
  title,
  coverUrl,
  customerName,
  services = [],
}: ShowcaseCardProps) {
  const reduce = useReducedMotion();

  return (
    <Link href={href} className="block">
      <motion.article
        className="rounded-lg bg-just-black p-24 transition-colors hover:bg-off-black"
        initial="rest"
        whileHover={reduce ? undefined : "hover"}
        animate="rest"
      >
        <div className="relative mb-20 aspect-video overflow-hidden rounded-lg">
          <motion.div
            className="absolute inset-0"
            style={{
              background: coverUrl.startsWith("#")
                ? coverUrl
                : `center / cover no-repeat url(${coverUrl})`,
            }}
            variants={reduce ? undefined : coverVariants}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {coverUrl.startsWith("#") ? (
              <div className="absolute inset-0 opacity-40 mix-blend-screen" />
            ) : null}
          </motion.div>
        </div>
        <motion.h3
          className="text-[24px] leading-[1.2] font-bold tracking-[-0.24px] text-surface-cream md:text-[33px] md:tracking-[-0.33px]"
          variants={reduce ? undefined : titleVariants}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
          {title}
        </motion.h3>
        {customerName ? (
          <p className="mt-8 text-body-sm text-surface-50">{customerName}</p>
        ) : null}
        {services.length > 0 ? (
          <div className="mt-12 flex flex-wrap gap-12">
            {services.map((service) => (
              <CategoryLabel
                key={service.name}
                label={service.name}
                color={service.color}
                className="text-caption"
              />
            ))}
          </div>
        ) : null}
      </motion.article>
    </Link>
  );
}
