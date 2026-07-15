"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// The rotating word; " Engineer" stays fixed after it.
const ROLES = ["AI", "Front-End", "Backend", "Agentic", "GenAI", "Claude"];
const EASE = [0.22, 1, 0.36, 1] as const;

/** "{rotating} Engineer" — the leading word swaps every 2s with a slot-machine slide. */
export function RotatingRole() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % ROLES.length), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex items-baseline gap-2 font-mono text-[clamp(1.9rem,5.2vw,3.4rem)] font-semibold tracking-[-0.02em]"
      aria-label={`${ROLES.join(", ")} Engineer`}
    >
      <span aria-hidden className="text-faint">
        {">"}
      </span>
      <span aria-hidden className="relative inline-flex overflow-hidden py-[0.15em]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={i}
            className="text-amber"
            initial={reduce ? { opacity: 0 } : { y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: "-110%", opacity: 0 }}
            transition={{ duration: reduce ? 0.18 : 0.42, ease: EASE }}
          >
            {ROLES[i]}
          </motion.span>
        </AnimatePresence>
      </span>
      <span aria-hidden className="text-ink">
        Engineer
      </span>
    </div>
  );
}
