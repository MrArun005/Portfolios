import { Reveal } from "./Reveal";

/** Oversized editorial statement — a focal "moment" between sections. */
export function PullQuote() {
  return (
    <section className="wrap relative py-[clamp(56px,11vh,120px)]">
      {/* soft glow behind the statement */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-1/2 h-64 w-2/3 -translate-y-1/2 rounded-full bg-amber/[0.06] blur-[120px]"
      />
      <Reveal>
        <p className="relative max-w-[18ch] font-mono text-[0.78rem] uppercase tracking-[0.18em] text-teal">
          the throughline
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <p className="relative mt-5 max-w-[24ch] font-display text-[clamp(2rem,6vw,4rem)] font-semibold leading-[1.08] tracking-[-0.02em]">
          I build the <span className="text-amber">engines</span> other people
          configure <span className="text-teal">without code.</span>
        </p>
      </Reveal>
    </section>
  );
}
