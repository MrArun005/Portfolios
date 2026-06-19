"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Scroll-linked "swipe up": the element is offset downward + faded while it sits
 * low in the viewport, and rises into place as you scroll it up — tied directly
 * to scroll position (scrubbed), not a one-shot reveal. Each card tracks its own
 * scroll, so a grid row swipes up together and later rows follow as you go.
 * Renders statically under reduced motion.
 */
export function SwipeUp({
  children,
  className,
  distance = 90,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // 0 when the card's top sits at the viewport bottom (just entering),
  // 1 when its top reaches the viewport centre (settled).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start center"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [0, 1]);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ y, opacity }} className={className}>
      {children}
    </motion.div>
  );
}
