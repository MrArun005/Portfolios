"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type Dot = { x: number; y: number; vx: number; vy: number; r: number; hue: string };

/**
 * Ambient drifting-particle field behind the whole page. Sparse, slow, and
 * tinted amber/teal to match the identity. Skipped entirely under reduced motion.
 */
export function AnimatedBackground() {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let dots: Dot[] = [];

    const COLORS = ["94, 200, 194", "244, 184, 96"]; // teal, amber (rgb)

    function seed() {
      const count = Math.min(26, Math.floor((w * h) / 64000));
      dots = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.6 + 0.6,
        hue: COLORS[i % COLORS.length],
      }));
    }

    function resize() {
      if (!canvas || !ctx) return;
      // Cap at 1.5 — faint dots don't need full Retina (2×) resolution, and
      // capping roughly halves the per-frame fill cost on high-DPI screens.
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function frame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < -10) d.x = w + 10;
        if (d.x > w + 10) d.x = -10;
        if (d.y < -10) d.y = h + 10;
        if (d.y > h + 10) d.y = -10;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${d.hue}, 0.5)`;
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    resize();
    frame();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 opacity-[0.28]"
    />
  );
}
