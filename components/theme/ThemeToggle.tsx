"use client";

import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";
  const label = isDark ? "حالت روشن" : "حالت تاریک";

  return (
    <motion.button
      type="button"
      className={`z-50 flex items-center overflow-visible p-0 w-32 h-4.5 rounded-[9px] bg-surface-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shockingly-green ${className}`}
      aria-label={label}
      title={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <motion.span
        className="inline-flex overflow-visible"
        animate={{ x: isDark ? 18 : 4 }}
        transition={{ ease: "easeInOut", duration: 0.2 }}
      >
        <motion.svg
          width="40"
          height="31"
          viewBox="0 -5 40 31"
          fill="none"
          overflow="visible"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <motion.circle
            cx="13"
            cy="10"
            r="7"
            fill="#FCDA50"
            animate={!isDark ? { fill: "#FCDA50" } : { fill: "#fefefe" }}
            transition={{ ease: "linear", duration: 0.2 }}
          />
          <motion.rect
            x="0.18457"
            y="11.3987"
            fill="#FCDA50"
            animate={
              !isDark
                ? {
                    rx: 1,
                    width: 4,
                    height: 2,
                    opacity: 1,
                    x: 0,
                    y: 0,
                    rotate: "-15deg",
                    fill: "#fcda50",
                  }
                : {
                    rx: 2.5,
                    width: 5,
                    height: 5,
                    opacity: 1,
                    x: 7,
                    y: -6,
                    rotate: 0,
                    fill: "#cccccc",
                  }
            }
            transition={{ ease: "backInOut", duration: 0.3 }}
          />
          <motion.rect
            x="8.66895"
            y="-3.298218"
            fill="#FCDA50"
            animate={
              !isDark
                ? {
                    rx: 1,
                    width: 2,
                    height: 4,
                    opacity: 1,
                    x: 0,
                    y: 0,
                    rotate: "-15deg",
                    fill: "#fcda50",
                  }
                : {
                    rx: 1.5,
                    width: 3,
                    height: 3,
                    opacity: 1,
                    x: 6,
                    y: 8,
                    rotate: "-90deg",
                    fill: "#cccccc",
                  }
            }
            transition={{ ease: "backInOut", duration: 0.3 }}
          />
          <motion.rect
            x="14.3633"
            y="17.9521"
            fill="#FCDA50"
            animate={
              !isDark
                ? {
                    rx: 1,
                    width: 2,
                    height: 4,
                    opacity: 1,
                    x: 0,
                    y: 0,
                    rotate: "-15deg",
                    fill: "#fcda50",
                  }
                : {
                    rx: 1.5,
                    width: 3,
                    height: 3,
                    opacity: 1,
                    x: -3.5,
                    y: -6,
                    rotate: "-90deg",
                    fill: "#cccccc",
                  }
            }
            transition={{ ease: "backInOut", duration: 0.3 }}
          />
          <motion.rect
            x="21.4346"
            y="5.70465"
            fill="#FCDA50"
            animate={
              !isDark
                ? {
                    rx: 1,
                    width: 4,
                    height: 2,
                    opacity: 1,
                    x: 0,
                    y: 0,
                    rotate: "-15deg",
                    fill: "#fcda50",
                  }
                : {
                    rx: 1.5,
                    width: 3,
                    height: 3,
                    opacity: 1,
                    x: -6,
                    y: 6,
                    rotate: "-15deg",
                    fill: "#cccccc",
                  }
            }
            transition={{ ease: "backInOut", duration: 0.3 }}
          />
          <motion.rect
            x="6.13379"
            y="18.8923"
            width="2"
            height="2"
            rx="1"
            fill="#FCDA50"
            animate={
              !isDark
                ? {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    rotate: "-15deg",
                    fill: "#fcda50",
                  }
                : {
                    opacity: 1,
                    x: 2,
                    y: -7,
                    rotate: "-15deg",
                    fill: "#cccccc",
                  }
            }
            transition={{ ease: "backInOut", duration: 0.3 }}
          />
          <motion.rect
            x="2.10742"
            y="3.86603"
            width="2"
            height="2"
            rx="1"
            fill="#FCDA50"
            animate={
              !isDark
                ? {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    rotate: "-15deg",
                    fill: "#fcda50",
                  }
                : {
                    opacity: 1,
                    x: 10,
                    y: 0,
                    rotate: "-15deg",
                    fill: "#cccccc",
                  }
            }
            transition={{ ease: "backInOut", duration: 0.3 }}
          />
          <motion.rect
            x="21.1602"
            y="14.866"
            width="2"
            height="2"
            rx="1"
            fill="#FCDA50"
            animate={
              !isDark
                ? {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    rotate: "-15deg",
                    fill: "#fcda50",
                  }
                : {
                    opacity: 1,
                    x: -8,
                    y: -6,
                    rotate: "-15deg",
                    fill: "#cccccc",
                  }
            }
            transition={{ ease: "backInOut", duration: 0.3 }}
          />
          <motion.rect
            x="17.1338"
            y="-0.16034"
            width="2"
            height="2"
            rx="1"
            fill="#FCDA50"
            animate={
              !isDark
                ? {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    rotate: "-15deg",
                    fill: "#fcda50",
                  }
                : {
                    opacity: 1,
                    x: 0,
                    y: 9,
                    rotate: "-15deg",
                    fill: "#cccccc",
                  }
            }
            transition={{ ease: "backInOut", duration: 0.3 }}
          />
        </motion.svg>
      </motion.span>
    </motion.button>
  );
}
