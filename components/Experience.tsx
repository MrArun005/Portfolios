"use client";

import { experience } from "@/lib/content";
import { Eyebrow } from "./Eyebrow";
import { Section, SectionTitle } from "./Section";
import { Reveal } from "./Reveal";

export function Experience() {
  return (
    <Section id="experience">
      <Reveal>
        <Eyebrow index={3}>experience</Eyebrow>
      </Reveal>
      <Reveal delay={0.05}>
        <SectionTitle alt="the grind">
          Where I&apos;ve <span className="text-amber">shipped</span>
        </SectionTitle>
      </Reveal>

      <div className="grid">
        {experience.map((role, i) => (
          <div
            key={`${role.company}-${i}`}
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
              <h3 className="font-display text-[1.25rem] font-semibold tracking-[-0.01em] mix-blend-difference">
                {role.role} · <span className="text-amber">{role.company}</span>
              </h3>

              {/* bullets (left) + stack & metrics rail (right) fill the full width */}
              <div className="mt-4 grid gap-x-10 gap-y-6 lg:grid-cols-[1fr_260px]">
                <ul className="grid gap-[0.55rem] mix-blend-difference">
                  {role.points.map((p, j) => (
                    <li key={j} className="relative pl-[1.3rem] text-muted">
                      <span aria-hidden className="absolute left-0 text-teal">
                        ▹
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>

                <aside className="flex flex-col gap-5 lg:border-l lg:border-line-soft lg:pl-8">
                  <div>
                    <div className="mb-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-faint">
                      stack
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {role.stack.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-line-soft bg-bg-2 px-2 py-0.5 font-mono text-[0.72rem] text-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-faint">
                      impact
                    </div>
                    <div className="grid gap-2.5">
                      {role.metrics.map((m) => (
                        <div key={m.label} className="flex items-baseline gap-2.5">
                          <span className="font-display text-[1.05rem] font-semibold leading-none text-amber">
                            {m.value}
                          </span>
                          <span className="font-mono text-[0.72rem] text-muted">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
