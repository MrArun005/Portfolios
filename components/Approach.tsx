"use client";

import { principles } from "@/lib/content";
import { Eyebrow } from "./Eyebrow";
import { Section, SectionTitle } from "./Section";
import { Reveal } from "./Reveal";

export function Approach() {
  return (
    <Section id="approach">
      <Reveal>
        <Eyebrow index={5}>how i work</Eyebrow>
      </Reveal>
      <Reveal delay={0.05}>
        <SectionTitle alt="the secret sauce">
          How I <span className="text-amber">work</span>
        </SectionTitle>
      </Reveal>

      <div className="grid gap-x-12 gap-y-12 md:grid-cols-2">
        {principles.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.05} className="flex gap-5">
            <span className="font-display text-[clamp(2.6rem,5vw,4.2rem)] font-bold leading-[0.9] text-amber/30">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-display text-[clamp(1.35rem,2.4vw,1.85rem)] font-semibold tracking-[-0.01em]">
                {p.title}
              </h3>
              <p className="mt-2.5 max-w-[48ch] text-[clamp(1rem,1.4vw,1.12rem)] leading-relaxed text-muted">
                {p.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
