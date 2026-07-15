"use client";

import { skills } from "@/lib/content";
import { Eyebrow } from "./Eyebrow";
import { Section, SectionTitle } from "./Section";
import { Reveal } from "./Reveal";
import { SwipeUp } from "./SwipeUp";

export function Skills() {
  return (
    <Section id="skills">
      <Reveal>
        <Eyebrow index={6}>skills</Eyebrow>
      </Reveal>
      <Reveal delay={0.05}>
        <SectionTitle alt="the arsenal">
          The <span className="text-amber">toolkit</span>
        </SectionTitle>
      </Reveal>

      <div className="grid items-start gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {skills.map((grp) => (
          <SwipeUp
            key={grp.group}
            distance={70}
            className="flex flex-col self-start rounded-card border border-line bg-bg-2 p-5"
          >
            <h4 className="mb-3 flex items-center gap-[0.6ch] font-mono text-[0.72rem] uppercase tracking-[0.08em] text-teal">
              <span aria-hidden className="text-faint">{"//"}</span>
              {grp.group}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {grp.items.map((item) => (
                <span
                  key={item}
                  className="cursor-default rounded-[7px] border border-line-soft bg-bg-3 px-2.5 py-1 text-[0.82rem] text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-teal hover:bg-teal-soft hover:text-teal"
                >
                  {item}
                </span>
              ))}
            </div>
          </SwipeUp>
        ))}
      </div>
    </Section>
  );
}
