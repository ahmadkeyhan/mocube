"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { CategoryLabel } from "@/components/CategoryLabel";
import { CustomerName } from "@/components/CustomerName";
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
        className="card-chrome rounded-lg bg-off-background transition-colors hover:bg-background"
        initial="rest"
        whileHover={reduce ? undefined : "hover"}
        animate="rest"
      >
        <div className="relative aspect-video overflow-hidden rounded-lg">
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
        <div className="p-20">
          <motion.h3
            className="text-[20px] leading-[1.2] font-bold tracking-[-0.2px] text-foreground md:text-[26px] md:tracking-[-0.26px]"
            variants={reduce ? undefined : titleVariants}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            {title}
          </motion.h3>
          {customerName ? (
            <p className="mt-8 text-body-sm text-surface-50">
              <CustomerName iconClassName="size-20 shrink-0">
                {customerName}
              </CustomerName>
            </p>
          ) : null}
          {services.length > 0 ? (
            <div className="mt-12 flex flex-wrap gap-2">
              {services.map((service) => (
                <CategoryLabel
                  key={service.name}
                  label={service.name}
                  color={service.color}
                  className="text-caption bg-background rounded-full"
                />
              ))}
            </div>
          ) : null}
        </div>
      </motion.article>
    </Link>
  );
}
