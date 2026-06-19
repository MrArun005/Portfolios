"use client";

import { capabilities } from "@/lib/content";
import { Eyebrow } from "./Eyebrow";
import { Section, SectionTitle } from "./Section";
import { Reveal } from "./Reveal";

export function Capabilities() {
  return (
    <Section id="capabilities">
      <Reveal>
        <Eyebrow index={2}>what i do</Eyebrow>
      </Reveal>
      <Reveal delay={0.05}>
        <SectionTitle alt="the flex">
          What I <span className="text-amber">build</span>
        </SectionTitle>
      </Reveal>

      <div className="grid gap-x-12 gap-y-12 md:grid-cols-2">
        {capabilities.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.05} className="flex gap-5 mix-blend-difference">
            <span className="font-display text-[clamp(2.6rem,5vw,4.2rem)] font-bold leading-[0.9] text-amber/70">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-display text-[clamp(1.35rem,2.4vw,1.85rem)] font-semibold tracking-[-0.01em]">
                {c.title}
              </h3>
              <p className="mt-2.5 max-w-[48ch] text-[clamp(1rem,1.4vw,1.12rem)] leading-relaxed text-muted">
                {c.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
