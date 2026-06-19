"use client";

import { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/**
 * In-page overlay for "places to go" without leaving the route — case study,
 * résumé, etc. Backdrop + ESC close, body scroll-lock, panel scrolls inside.
 */
export function Modal({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const lenis = (window as Window & { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop(); // pause smooth-scroll so the modal scrolls instead of the page
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      lenis?.start();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={label}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="fixed right-4 top-4 z-[95] flex h-10 w-10 items-center justify-center rounded-full border border-line bg-bg/80 text-[1.3rem] leading-none text-ink backdrop-blur transition-colors hover:border-teal hover:text-teal"
          >
            ×
          </button>
          <motion.div
            data-lenis-prevent
            className="relative max-h-[92vh] w-full max-w-[1120px] overflow-y-auto overscroll-contain rounded-2xl border border-line shadow-[0_40px_120px_-20px_rgba(0,0,0,0.85)]"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.985 }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
