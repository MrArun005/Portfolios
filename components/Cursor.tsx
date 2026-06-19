"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const INTERACTIVE = 'a, button, [role="button"], [data-cursor], label';

/**
 * Custom cursor: a precise dot that tracks exactly + a ring that lags with a
 * spring and expands over interactive elements. `mix-blend-difference` keeps it
 * visible on any background. Mouse-only and skipped under reduced motion.
 */
export function Cursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.5 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.(INTERACTIVE)) setHovering(true);
    };
    const out = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.(INTERACTIVE)) setHovering(false);
    };
    const downH = () => setDown(true);
    const upH = () => setDown(false);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    window.addEventListener("mousedown", downH);
    window.addEventListener("mouseup", upH);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      window.removeEventListener("mousedown", downH);
      window.removeEventListener("mouseup", upH);
    };
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[110] mix-blend-difference" aria-hidden>
      {/* lagging ring */}
      <motion.div style={{ x: ringX, y: ringY }} className="absolute left-0 top-0">
        <motion.div
          animate={{ scale: hovering ? 2.4 : down ? 0.8 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="-ml-4 -mt-4 h-8 w-8 rounded-full border-2 border-white"
        />
      </motion.div>
      {/* precise dot */}
      <motion.div style={{ x, y }} className="absolute left-0 top-0">
        <div className="-ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-white" />
      </motion.div>
    </div>
  );
}
