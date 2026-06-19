"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useMotionValue } from "framer-motion";
import { hero, meta } from "@/lib/content";
import { ScrambleText } from "./ScrambleText";
import { Typewriter } from "./Typewriter";
import { MagneticButton } from "./MagneticButton";
import { RotatingRole } from "./RotatingRole";
import { RotatingTagline } from "./RotatingTagline";
import { FlipText } from "./FlipText";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Mouse-parallax for the aurora only — one reactive backdrop layer, not two.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const auroraX = useSpring(useTransform(mx, [-0.5, 0.5], [24, -24]), { stiffness: 50, damping: 22 });
  const auroraY = useSpring(useTransform(my, [-0.5, 0.5], [18, -18]), { stiffness: 50, damping: 22 });

  // Scroll parallax: backdrop drifts slowly, content lifts gently as you leave.
  // (No opacity fade — the title must stay solid the whole time it's on screen.)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgScrollY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentScrollY = useTransform(scrollYProgress, [0, 1], [0, -48]);

  function onMove(e: React.MouseEvent<HTMLElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
  };

  return (
    <header
      id="top"
      ref={ref}
      onMouseMove={onMove}
      className="relative flex min-h-[100svh] flex-col justify-start overflow-hidden pb-[clamp(56px,9vh,110px)] pt-[clamp(84px,11vh,124px)]"
    >
      {/* Structural grid backdrop, masked to a soft radial. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-12 opacity-50 [mask-image:radial-gradient(ellipse_80%_60%_at_30%_0%,#000_0%,transparent_75%)]"
      >
        <motion.div
          style={reduce ? undefined : { y: bgScrollY }}
          className="h-[140%] w-full bg-[linear-gradient(var(--color-line-soft)_1px,transparent_1px),linear-gradient(90deg,var(--color-line-soft)_1px,transparent_1px)] bg-[size:46px_46px]"
        />
      </div>

      {/* Ambient aurora glow — mouse-parallax shell + autonomous slow drift. */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { x: auroraX, y: auroraY }}
        className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 opacity-[0.22] blur-[90px]"
      >
        <motion.div
          className="h-full w-full bg-[radial-gradient(circle_at_30%_40%,var(--color-amber),transparent_55%),radial-gradient(circle_at_72%_55%,var(--color-teal),transparent_55%)]"
          animate={
            reduce
              ? undefined
              : { scale: [1, 1.12, 1], rotate: [0, 8, 0], opacity: [0.85, 1, 0.85] }
          }
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <motion.div
        className="wrap relative z-10"
        style={reduce ? undefined : { y: contentScrollY }}
      >
       <motion.div
        className="max-w-[720px] lg:max-w-[85%]"
        variants={reduce ? undefined : container}
        initial={reduce ? false : "hidden"}
        animate={reduce ? false : "show"}
       >
        <motion.div variants={reduce ? undefined : item} className="mb-3">
          <RotatingTagline />
        </motion.div>

        <motion.div variants={reduce ? undefined : item} className="mb-6">
          <RotatingRole />
        </motion.div>

        <motion.span
          variants={reduce ? undefined : item}
          className="mb-7 inline-flex items-center gap-[0.6ch] rounded-full border border-line px-3.5 py-1.5 font-mono text-[0.8rem] text-muted"
        >
          <span aria-hidden className="relative flex h-[7px] w-[7px] shrink-0">
            {!reduce && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-75" />
            )}
            <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-teal" />
          </span>
          {(() => {
            const [roleText, locText] = hero.status.split(" · ");
            return (
              <span>
                {roleText} {locText && <span className="hidden sm:inline">· {locText}</span>}
              </span>
            );
          })()}
        </motion.span>

        <motion.span
          variants={reduce ? undefined : item}
          className="mb-3 block font-mono text-[0.8rem] uppercase tracking-[0.22em] text-teal"
        >
          {hero.kicker}
        </motion.span>

        <motion.h1
          variants={reduce ? undefined : item}
          className="font-display text-[clamp(2.7rem,7.5vw,5.3rem)] font-bold leading-[1.02] tracking-[-0.03em]"
        >
          {hero.headline.map((part, i) =>
            part.accent ? (
              <ScrambleText key={i} text={part.text} delay={450} className="text-amber" />
            ) : (
              <span key={i}>{part.text}</span>
            ),
          )}
        </motion.h1>

        <motion.p
          variants={reduce ? undefined : item}
          className="mt-4 font-mono text-[clamp(0.92rem,2.2vw,1.05rem)] tracking-[-0.01em] text-teal"
        >
          <Typewriter text={meta.role} startDelay={1400} />
        </motion.p>

        <motion.p
          variants={reduce ? undefined : item}
          className="mt-6 max-w-[56ch] text-[clamp(1.02rem,2.4vw,1.2rem)] text-muted"
        >
          {hero.lede.map((part, i) => (
            <span key={i} className={part.bold ? "font-semibold text-ink" : undefined}>
              {part.text}
            </span>
          ))}
        </motion.p>

        <motion.div variants={reduce ? undefined : item} className="mt-10 grid grid-cols-2 gap-3.5 sm:flex sm:flex-wrap">
          <MagneticButton href="#projects" primary>
            <FlipText a="View the work" b="show me the goods" />
          </MagneticButton>
          <MagneticButton href={meta.resume} external>
            <FileIcon /> <FlipText a="Résumé" b="the receipts" />
          </MagneticButton>
          <MagneticButton href={`mailto:${meta.email}`}>
            <MailIcon /> <FlipText a="Email" b="slide in" />
          </MagneticButton>
          <MagneticButton href={meta.github} external>
            <GithubIcon /> <FlipText a="GitHub" b="the code" />
          </MagneticButton>
        </motion.div>
       </motion.div>
      </motion.div>
    </header>
  );
}

function FileIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
function GithubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2A10 10 0 0 0 8.84 21.5c.5.08.66-.22.66-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.4 9.4 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.16.57.67.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}
