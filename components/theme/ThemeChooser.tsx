"use client";

import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const STORAGE_KEY = "mocube-theme";
const COMMIT_LIGHT = 80;
const COMMIT_DARK = 20;
const START_SPLIT = 50;

type PaneProps = {
  mode: "light" | "dark";
  imageSrc: string;
  priority?: boolean;
};

function ChooserPane({ mode, imageSrc, priority }: PaneProps) {
  // const titleColor = mode === "light" ? "#0e100f" : "#f6fbff";
  const bodyColor = mode === "light" ? "#5c5c52" : "#7c7c6f";

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${
        mode === "light" ? "theme-pane-light" : "theme-pane-dark"
      }`}
    >
      <Image
        src={imageSrc}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
        draggable={false}
      />
      {/* Match home hero: Container + pt-32/md:pt-76 — not vertically centered */}
      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-7xl flex-col items-center px-16 pt-32 pb-76 text-center md:px-24 md:pt-76">
        <h1
          style={{ color: "#0ae68e" }}
          className="mt-16 max-w-none text-3xl font-bold leading-display tracking-heading-lg sm:text-heading-lg sm:tracking-heading-lg lg:w-[15ch]"
        >
          سوخت خلاقیت برای رسیدن به مدار توجه
        </h1>
        {/* <p style={{ color: bodyColor }} className="mt-24 max-w-xl text-body-lg">
          استودیو خلاق موکیوب — هویت برند، تصویرسازی، وب و مرچندایز برای
          برندهایی که می‌خواهند دیده شوند.
        </p> */}
        <p className="mt-32 text-body-sm font-bold text-foreground">
          تــم موکیوب را انتخاب کنید
        </p>
      </div>
    </div>
  );
}

type ThemeChooserProps = {
  onComplete: () => void;
};

export function ThemeChooser({ onComplete }: ThemeChooserProps) {
  const { setTheme } = useTheme();
  const reduce = useReducedMotion();
  const labelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const hintActive = useRef(true);
  const hintAnim = useRef<ReturnType<typeof animate> | null>(null);
  const split = useMotionValue(START_SPLIT);
  const [splitPct, setSplitPct] = useState(START_SPLIT);

  const stopHint = useCallback(() => {
    if (!hintActive.current) return;
    hintActive.current = false;
    hintAnim.current?.stop();
    hintAnim.current = null;
  }, []);

  useEffect(() => {
    const unsub = split.on("change", (v) => setSplitPct(v));
    return unsub;
  }, [split]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    if (reduce) {
      hintActive.current = false;
      return;
    }

    const controls = animate(
      split,
      [
        START_SPLIT,
        START_SPLIT + 6,
        START_SPLIT - 6,
        START_SPLIT + 3,
        START_SPLIT,
      ],
      {
        duration: 1.8,
        repeat: Infinity,
        repeatDelay: 3,
        times: [0, 0.22, 0.5, 0.75, 1],
        ease: "easeInOut",
        onComplete: () => {
          hintActive.current = false;
          hintAnim.current = null;
        },
      },
    );
    hintAnim.current = controls;

    return () => {
      controls.stop();
      hintAnim.current = null;
    };
  }, [reduce, split]);

  const commit = useCallback(
    (theme: "light" | "dark") => {
      stopHint();
      setTheme(theme);
      onComplete();
    },
    [onComplete, setTheme, stopHint],
  );

  const snapOrCommit = useCallback(
    (value: number) => {
      if (value >= COMMIT_LIGHT) {
        if (reduce) {
          split.set(100);
          commit("light");
          return;
        }
        animate(split, 100, {
          type: "spring",
          stiffness: 320,
          damping: 28,
          onComplete: () => commit("light"),
        });
        return;
      }
      if (value <= COMMIT_DARK) {
        if (reduce) {
          split.set(0);
          commit("dark");
          return;
        }
        animate(split, 0, {
          type: "spring",
          stiffness: 320,
          damping: 28,
          onComplete: () => commit("dark"),
        });
        return;
      }
      if (reduce) {
        split.set(START_SPLIT);
        return;
      }
      animate(split, START_SPLIT, {
        type: "spring",
        stiffness: 380,
        damping: 30,
      });
    },
    [commit, reduce, split],
  );

  const pctFromClientX = useCallback((clientX: number) => {
    const el = rootRef.current;
    if (!el) return START_SPLIT;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return START_SPLIT;
    return Math.min(
      100,
      Math.max(0, ((clientX - rect.left) / rect.width) * 100),
    );
  }, []);

  const onPointerDown = (e: ReactPointerEvent) => {
    stopHint();
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    split.set(pctFromClientX(e.clientX));
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragging.current) return;
    split.set(pctFromClientX(e.clientX));
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    snapOrCommit(split.get());
  };

  const onKeyDown = (e: ReactKeyboardEvent) => {
    stopHint();
    const step = 5;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      split.set(Math.max(0, split.get() - step));
      return;
    }
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      split.set(Math.min(100, split.get() + step));
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const v = split.get();
      if (v >= COMMIT_LIGHT) commit("light");
      else if (v <= COMMIT_DARK) commit("dark");
      else if (v >= 50) snapOrCommit(COMMIT_LIGHT);
      else snapOrCommit(COMMIT_DARK);
    }
    if (e.key === "Home") {
      e.preventDefault();
      split.set(0);
      commit("dark");
    }
    if (e.key === "End") {
      e.preventDefault();
      split.set(100);
      commit("light");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0e100f]"
      style={{ direction: "ltr" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
    >
      <h2 id={labelId} className="sr-only">
        انتخاب تم روشن یا تاریک
      </h2>

      <div
        ref={rootRef}
        className="relative mx-auto h-full min-h-svh max-w-[120rem] overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 0 0 ${splitPct}%)` }}
        >
          <ChooserPane mode="dark" imageSrc="/hero-dark.webp" priority />
        </div>
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - splitPct}% 0 0)` }}
        >
          <ChooserPane mode="light" imageSrc="/hero-light.webp" priority />
        </div>

        <motion.div
          className="absolute top-0 bottom-0 z-30 w-0"
          style={{ left: `${splitPct}%` }}
        >
          <div
            className="absolute inset-y-0 left-1/2 w-48 -translate-x-1/2 cursor-ew-resize touch-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-shockingly-green left-1/2 -translate-x-1/2" />
          <button
            type="button"
            className="absolute top-1/2 left-1/2 flex size-48 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize touch-none items-center justify-center rounded-full round-keep bg-shockingly-green text-background outline-none focus-visible:ring-2 focus-visible:ring-shockingly-green focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e100f]"
            aria-label="کشیدن برای انتخاب تم"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(splitPct)}
            aria-orientation="horizontal"
            role="slider"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
          >
            <MdChevronLeft />
            <MdChevronRight />
          </button>
        </motion.div>
      </div>

      <button
        type="button"
        className="theme-pane-light absolute top-2/5 left-16 z-20 -translate-y-1/2 rounded-full border border-surface-25 bg-background/85 px-16 py-12 text-body-sm font-bold text-foreground backdrop-blur-sm transition-colors hover:text-shockingly-green md:left-24"
        onClick={() => commit("light")}
      >
        روشن
      </button>
      <button
        type="button"
        className="theme-pane-dark absolute top-2/5 right-16 z-20 -translate-y-1/2 rounded-full border border-surface-25 bg-background/85 px-16 py-12 text-body-sm font-bold text-foreground backdrop-blur-sm transition-colors hover:text-shockingly-green md:right-24"
        onClick={() => commit("dark")}
      >
        تاریک
      </button>
    </div>
  );
}

export function hasStoredTheme(): boolean {
  if (typeof window === "undefined") return true;
  return Boolean(window.localStorage.getItem(STORAGE_KEY));
}
