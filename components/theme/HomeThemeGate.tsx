"use client";

import { useEffect, useState } from "react";
import { hasStoredTheme, ThemeChooser } from "@/components/theme/ThemeChooser";

export function HomeThemeGate() {
  const [ready, setReady] = useState(false);
  const [needsChooser, setNeedsChooser] = useState(false);

  useEffect(() => {
    setNeedsChooser(!hasStoredTheme());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div
        className="fixed inset-0 z-50 bg-[#0e100f]"
        aria-hidden
      />
    );
  }

  if (!needsChooser) return null;

  return <ThemeChooser onComplete={() => setNeedsChooser(false)} />;
}
