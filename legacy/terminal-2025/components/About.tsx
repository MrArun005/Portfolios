"use client";

import { about } from "@/lib/content";
import { Eyebrow } from "./Eyebrow";
import { Section, SectionTitle } from "./Section";
import { Counter } from "./Counter";
import { Reveal } from "./Reveal";
import { Terminal, Prompt, Output, CursorPrompt } from "./Terminal";

export function About() {
  return (
    <Section id="about">
      <Reveal>
        <Eyebrow index={1}>about</Eyebrow>
      </Reveal>
      <Reveal delay={0.05}>
        <SectionTitle alt="the human bits">
          Who <span className="text-amber">I am</span>
        </SectionTitle>
      </Reveal>

      <Reveal delay={0.1}>
        <Terminal path="arun@portfolio: ~/about">
          <Prompt>whoami</Prompt>
          <Output>
            <span className="text-ink">{about.whoami}</span>
          </Output>

          <Prompt>cat profile.md</Prompt>
          <Output>
            <p className="max-w-[68ch]">
              {about.body.map((part, i) => (
                <span key={i} className={part.bold ? "font-medium text-ink" : undefined}>
                  {part.text}
                </span>
              ))}
            </p>
          </Output>

          <Prompt>ls -la ./impact</Prompt>
          <Output>
            <div className="mt-1 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
              {about.stats.map((s) => (
                <div key={s.label} className="flex items-baseline gap-3">
                  <span className="min-w-[5.5ch] font-mono text-[1.15rem] font-semibold text-amber">
                    <Counter
                      value={s.value}
                      decimals={s.decimals ?? 0}
                      prefix={s.prefix ?? ""}
                      suffix={s.suffix ?? ""}
                    />
                  </span>
                  <span className="font-mono text-[0.8rem] uppercase tracking-[0.06em] text-muted">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </Output>

          {/* idle prompt — the terminal waiting for the next command */}
          <CursorPrompt />
        </Terminal>
      </Reveal>
    </Section>
  );
}
