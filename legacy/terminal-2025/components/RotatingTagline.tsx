"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// Cheeky, confident one-liners — rendered as a rotating terminal comment.
const LINES = [
  "engineers build wonders — i'm one of them",
  "i don't fix bugs, i negotiate their surrender",
  "i turn caffeine and PRDs into production systems",
  "i build the engines other people put their name on",
  "i teach AI agents to do the boring parts",
  "99.5% uptime — the other 0.5% was a meeting",
  "i write the prompts that write the code",
  "distributed systems, undistributed confidence",
  "i break it in staging so prod stays boring",
  "“it depends” — but i still ship on time",
  "i read the docs so the model doesn't have to",
  "i don't chase the stack, i own it",
  "multi-tenant brain, single-minded focus",
  "i make hard problems look like config",
];

/** A terminal comment that swaps to a new spicy line every few seconds. */
export function RotatingTagline() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % LINES.length), 3800);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex min-h-[1.5em] items-baseline gap-1 font-mono text-[clamp(0.8rem,1.6vw,0.95rem)] tracking-[0.02em] text-muted"
      aria-label={LINES[0]}
    >
      <span aria-hidden className="text-faint">
        //
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={i}
          aria-hidden
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={{ duration: reduce ? 0.2 : 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {LINES[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
