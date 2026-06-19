"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { meta, nav } from "@/lib/content";
import { FlipText } from "./FlipText";

export function Nav() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  // Scroll-spy: mark the section currently in the middle band as active.
  useEffect(() => {
    const ids = nav.map((n) => n.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!("IntersectionObserver" in window) || els.length === 0) return;

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => spy.observe(el));
    return () => spy.disconnect();
  }, []);

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-50 border-b border-line-soft bg-[color-mix(in_srgb,var(--color-bg)_82%,transparent)] backdrop-blur-md"
    >
      <div className="wrap flex h-16 items-center justify-between">
        <a
          href="#top"
          className="font-mono text-[0.95rem] font-semibold tracking-[-0.01em]"
        >
          {meta.brand.left}
          <b className="font-semibold text-amber">{meta.brand.dot}</b>
          {meta.brand.right}
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`group relative font-mono text-[0.82rem] transition-colors hover:text-ink ${
                active === item.id ? "text-ink" : "text-muted"
              }`}
            >
              <FlipText a={item.label} b={item.alt} />
              {active === item.id && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute -bottom-1.5 left-0 right-0 h-px bg-amber"
                  transition={
                    reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }
                  }
                />
              )}
            </a>
          ))}
          <a
            href={meta.resume}
            target="_blank"
            rel="noopener"
            className="group font-mono text-[0.82rem] text-muted transition-colors hover:text-ink"
          >
            <FlipText a="résumé" b="the receipts" />
          </a>
          <a
            href={`mailto:${meta.email}`}
            className="group rounded-lg border border-line px-3.5 py-1.5 font-mono text-[0.82rem] text-amber transition-colors hover:border-amber hover:bg-amber-soft"
          >
            <FlipText a="say hello →" b="let's talk 👀" />
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="text-ink md:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-line bg-bg-2 md:hidden"
          >
            <div className="wrap flex flex-col gap-5 py-6">
              {nav.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="font-mono text-sm text-muted transition-colors hover:text-ink"
                >
                  {item.label}
                </a>
              ))}
              <a
                href={meta.resume}
                target="_blank"
                rel="noopener"
                onClick={() => setOpen(false)}
                className="font-mono text-sm text-muted transition-colors hover:text-ink"
              >
                résumé
              </a>
              <a
                href={`mailto:${meta.email}`}
                onClick={() => setOpen(false)}
                className="font-mono text-sm text-amber"
              >
                say hello →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
