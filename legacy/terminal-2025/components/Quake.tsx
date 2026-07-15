"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Wraps the page and trembles it briefly whenever the 3D scene fires a "quake"
 * event (asteroid impact). Disabled under reduced motion.
 */
export function Quake({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    let timer: ReturnType<typeof setTimeout>;
    const onQuake = () => {
      const el = ref.current;
      if (!el) return;
      el.classList.remove("quaking");
      void el.offsetWidth; // force reflow so the animation restarts
      el.classList.add("quaking");
      clearTimeout(timer);
      timer = setTimeout(() => el.classList.remove("quaking"), 700);
    };
    window.addEventListener("quake", onQuake);
    return () => {
      window.removeEventListener("quake", onQuake);
      clearTimeout(timer);
    };
  }, [reduce]);

  return <div ref={ref}>{children}</div>;
}
