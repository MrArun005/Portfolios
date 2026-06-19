"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>{}[]#$%&*";

/**
 * Decodes `text` into place on mount — each character flickers through random
 * glyphs before settling, left to right. A terminal-style "decode" reveal.
 * Renders the final text immediately under reduced motion.
 */
export function ScrambleText({
  text,
  className,
  delay = 0,
  speed = 26,
}: {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}) {
  const reduce = useReducedMotion();
  const [output, setOutput] = useState(reduce ? text : "");
  const frame = useRef(0);

  useEffect(() => {
    if (reduce) {
      setOutput(text);
      return;
    }
    let raf = 0;
    let tick = 0;
    let startedAt: number | null = null;
    frame.current = 0;

    const run = (ts: number) => {
      if (startedAt === null) startedAt = ts;
      if (ts - startedAt < delay) {
        raf = requestAnimationFrame(run);
        return;
      }
      tick++;
      if (tick % 2 === 0) frame.current += 1;

      const settled = frame.current; // chars fully resolved so far
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === " ") {
          out += " ";
        } else if (i < settled) {
          out += ch;
        } else if (i < settled + 6) {
          out += GLYPHS[Math.floor((tick + i) * 7) % GLYPHS.length];
        } else {
          out += "";
        }
      }
      setOutput(out);

      if (settled <= text.length) {
        raf = requestAnimationFrame(run);
      } else {
        setOutput(text);
      }
    };

    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [text, delay, speed, reduce]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{output}</span>
    </span>
  );
}
