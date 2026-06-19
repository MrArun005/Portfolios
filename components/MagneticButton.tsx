"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/**
 * Anchor that drifts toward the cursor while hovered (a "magnetic" pull),
 * springing back on leave. Falls back to a plain link under reduced motion.
 */
export function MagneticButton({
  href,
  children,
  primary,
  external,
  strength = 0.4,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
  external?: boolean;
  strength?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18 });
  const sy = useSpring(y, { stiffness: 250, damping: 18 });

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  const base =
    "inline-flex items-center justify-center gap-[0.6ch] rounded-[9px] px-5 py-2.5 font-mono text-[0.88rem] transition-colors w-full sm:w-auto";
  const skin = primary
    ? "border border-amber bg-amber font-semibold text-[#1a1206] hover:bg-[#f6c47e]"
    : "border border-line text-ink hover:border-muted";

  return (
    <motion.a
      ref={ref}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={reduce ? undefined : { x: sx, y: sy }}
      whileHover={reduce ? undefined : { scale: 1.04 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      className={`${base} ${skin}`}
    >
      {children}
    </motion.a>
  );
}
