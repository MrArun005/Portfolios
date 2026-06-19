"use client";

import { experience } from "@/lib/content";
import { Eyebrow } from "./Eyebrow";
import { Section, SectionTitle } from "./Section";
import { Reveal } from "./Reveal";

export function Experience() {
  return (
    <Section id="experience">
      <Reveal>
        <Eyebrow index={2}>experience</Eyebrow>
      </Reveal>
      <Reveal delay={0.05}>
        <SectionTitle>
          Where I&apos;ve <span className="text-amber">shipped</span>
        </SectionTitle>
      </Reveal>

      <div className="grid">
        {experience.map((role, i) => (
          <Reveal
            key={`${role.company}-${i}`}
            delay={i * 0.05}
            className="grid gap-[clamp(0.5rem,3vw,2.5rem)] py-7 md:grid-cols-[210px_1fr]"
          >
            <div className="font-mono text-[0.82rem] text-muted">
              <span className="inline-block rounded border border-line-soft bg-bg-2 px-2 py-0.5 text-teal">
                {role.when}
              </span>
              <span className="mt-2 block text-faint">{role.where}</span>
            </div>

            {/* timeline rail: a vertical line with a node dot per role */}
            <div className="relative border-l border-line-soft pl-6 md:pl-9">
              <span
                aria-hidden
                className="absolute -left-[6px] top-1.5 h-3 w-3 rounded-full border-2 border-amber bg-bg"
              />
              <h3 className="font-display text-[1.25rem] font-semibold tracking-[-0.01em]">
                {role.role} · <span className="text-amber">{role.company}</span>
              </h3>
              <ul className="mt-3.5 grid max-w-[78ch] gap-[0.55rem]">
                {role.points.map((p, j) => (
                  <li key={j} className="relative pl-[1.3rem] text-muted">
                    <span aria-hidden className="absolute left-0 text-teal">
                      ▹
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
