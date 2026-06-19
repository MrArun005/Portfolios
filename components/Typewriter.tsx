"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/** Types `text` out one character at a time, then leaves a blinking cursor. */
export function Typewriter({
  text,
  className,
  startDelay = 600,
  charDelay = 55,
}: {
  text: string;
  className?: string;
  startDelay?: number;
  charDelay?: number;
}) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(reduce ? text.length : 0);
  const done = count >= text.length;

  useEffect(() => {
    if (reduce) {
      setCount(text.length);
      return;
    }
    let raf = 0;
    let startedAt: number | null = null;
    let lastTyped = 0;

    const run = (ts: number) => {
      if (startedAt === null) startedAt = ts;
      const elapsed = ts - startedAt;
      if (elapsed >= startDelay) {
        const shouldHave = Math.floor((elapsed - startDelay) / charDelay);
        if (shouldHave > lastTyped) {
          lastTyped = shouldHave;
          setCount(Math.min(shouldHave, text.length));
        }
      }
      if (lastTyped < text.length) raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [text, startDelay, charDelay, reduce]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{text.slice(0, count)}</span>
      <span
        aria-hidden
        className={`text-amber ${done && !reduce ? "animate-blink" : ""}`}
      >
        ▋
      </span>
    </span>
  );
}
