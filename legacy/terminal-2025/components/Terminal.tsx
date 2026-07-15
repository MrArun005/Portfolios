"use client";

import type { ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * A terminal "window" chrome: a title bar with traffic-light dots and a path
 * label, over a dark body. Used to render content as if it were shell output —
 * the structural expression of the site's filesystem identity.
 */
export function Terminal({
  path,
  children,
}: {
  path: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-[#0b0f14] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)]">
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-line-soft bg-bg-2 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]/80" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]/80" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]/80" />
        </span>
        <span className="ml-1 font-mono text-[0.72rem] text-faint">{path}</span>
      </div>
      {/* body */}
      <div className="space-y-3 px-5 py-5 font-mono text-[0.86rem] leading-relaxed sm:px-7 sm:py-6">
        {children}
      </div>
    </div>
  );
}

/** A `$ command` prompt line. */
export function Prompt({ children }: { children: string }) {
  return (
    <div className="flex gap-[0.8ch] text-ink">
      <span className="select-none text-teal" aria-hidden>
        $
      </span>
      <span>{children}</span>
    </div>
  );
}

/** An idle `$ ▋` prompt — the terminal waiting for the next command. */
export function CursorPrompt() {
  const reduce = useReducedMotion();
  return (
    <div className="flex gap-[0.8ch] text-ink" aria-hidden>
      <span className="select-none text-teal">$</span>
      <span className={`text-amber ${reduce ? "" : "animate-blink"}`}>▋</span>
    </div>
  );
}

/** Indented command output, in the body voice rather than mono. */
export function Output({ children }: { children: ReactNode }) {
  return <div className="pl-[1.6ch] font-body text-[0.98rem] text-muted">{children}</div>;
}
