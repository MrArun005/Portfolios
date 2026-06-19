"use client";

import { useEffect } from "react";

/**
 * Flips text tagged [data-overlap] to a high-contrast colour ONLY while it
 * overlaps the bright 3D core on screen (the scene publishes the core's screen
 * circle to window.__coreRect). Throttled; no-op when the 3D scene is absent.
 */
export function CoreContrast() {
  useEffect(() => {
    let raf = 0;
    let last = 0;

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (t - last < 120) return; // ~8x/sec is plenty
      last = t;

      const cr = (window as unknown as { __coreRect?: { cx: number; cy: number; r: number } })
        .__coreRect;
      const els = document.querySelectorAll<HTMLElement>("[data-overlap]");
      if (!cr) {
        els.forEach((el) => el.classList.remove("over-core"));
        return;
      }
      const { cx, cy, r } = cr;
      els.forEach((el) => {
        const b = el.getBoundingClientRect();
        if (b.width === 0 || b.bottom < 0 || b.top > window.innerHeight) {
          el.classList.remove("over-core");
          return;
        }
        // distance from the core centre to the nearest point of the text box
        const nx = Math.max(b.left, Math.min(cx, b.right));
        const ny = Math.max(b.top, Math.min(cy, b.bottom));
        el.classList.toggle("over-core", Math.hypot(nx - cx, ny - cy) < r * 0.85);
      });
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return null;
}
