"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const LINES = [
  "> initializing arun.mallikarjuna",
  "> mounting modules ............. [ok]",
  "> loading projects ............. [ok]",
  "> starting engines ............. [ok]",
  "> ready.",
];

/**
 * On-load terminal "boot": prints boot lines + a progress bar, then wipes up to
 * reveal the page. Runs once per session. Under reduced motion it's a quick fade.
 */
export function Preloader() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);
  const [lines, setLines] = useState(0);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("booted")) {
      setDone(true);
      return;
    }
    sessionStorage.setItem("booted", "1");

    if (reduce) {
      const t = setTimeout(() => setDone(true), 350);
      return () => clearTimeout(t);
    }

    const lineTimers = LINES.map((_, i) =>
      setTimeout(() => setLines(i + 1), 160 + i * 150),
    );

    let p = 0;
    const prog = setInterval(() => {
      p = Math.min(100, p + Math.random() * 16 + 10);
      setPct(Math.round(p));
      if (p >= 100) clearInterval(prog);
    }, 95);

    const end = setTimeout(() => setDone(true), 1500);

    return () => {
      lineTimers.forEach(clearTimeout);
      clearInterval(prog);
      clearTimeout(end);
    };
  }, [reduce]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          aria-hidden
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg px-6"
          initial={{ opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="w-[min(92vw,460px)] font-mono text-[0.85rem] leading-relaxed">
            <div className="mb-4 flex items-center gap-2 text-faint">
              <span className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]/70" />
              </span>
              <span className="text-[0.72rem]">arun@portfolio: ~$ boot</span>
            </div>

            {LINES.slice(0, lines).map((l, i) => (
              <div
                key={i}
                className={i === LINES.length - 1 ? "text-teal" : "text-muted"}
              >
                {l}
              </div>
            ))}

            <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-bg-3">
              <div
                className="h-full bg-gradient-to-r from-amber to-teal transition-[width] duration-150 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-1.5 text-right text-[0.72rem] text-faint">{pct}%</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
