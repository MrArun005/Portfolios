"use client";

import { useState } from "react";
import { projects, type Project } from "@/lib/content";
import { Eyebrow } from "./Eyebrow";
import { Section, SectionTitle } from "./Section";
import { Reveal } from "./Reveal";
import { Tilt3D } from "./Tilt3D";
import { Modal } from "./Modal";
import { FolkgroveCaseStudy } from "./FolkgroveCaseStudy";

export function Projects() {
  const [caseStudyOpen, setCaseStudyOpen] = useState(false);

  return (
    <Section id="projects">
      <Reveal>
        <Eyebrow index={4}>projects</Eyebrow>
      </Reveal>
      <Reveal delay={0.05}>
        <SectionTitle alt="the receipts">
          Things I&apos;ve <span className="text-amber">built</span>
        </SectionTitle>
      </Reveal>

      {/* Sticky-stack deck: each card pins under the nav and the next slides up
          to stack on top, leaving a peek of the card beneath. */}
      <div className="grid">
        {projects.map((p, i) => (
          <div
            key={p.title}
            className="sticky pb-6"
            style={{ top: `calc(5.5rem + ${i * 0.9}rem)`, zIndex: i + 1 }}
          >
            <Card project={p} onCaseStudy={p.caseStudy ? () => setCaseStudyOpen(true) : undefined} />
          </div>
        ))}
      </div>

      <Modal open={caseStudyOpen} onClose={() => setCaseStudyOpen(false)} label="Folkgrove architecture case study">
        <FolkgroveCaseStudy onClose={() => setCaseStudyOpen(false)} />
      </Modal>
    </Section>
  );
}

function Card({ project, onCaseStudy }: { project: Project; onCaseStudy?: () => void }) {
  const { feature, stats } = project;
  const slug = project.title.split(/[\s—-]+/)[0].toLowerCase();
  return (
    <Tilt3D
      className={`group relative flex h-full flex-col gap-3.5 overflow-hidden rounded-card border bg-bg-2 p-6 shadow-[0_24px_50px_-28px_rgba(0,0,0,0.85)] transition-colors hover:border-muted ${
        feature ? "border-amber/30" : "border-line"
      }`}
    >
      {/* Accent rule: always-on for the flagship, draws on hover for the rest. */}
      <span
        aria-hidden
        className={`absolute left-0 top-0 z-20 h-0.5 w-full origin-left bg-gradient-to-r from-amber to-teal transition-transform duration-[350ms] ease-out ${
          feature ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />

      {/* Visual banner — a mock window over a tinted gradient field (stands in for a screenshot). */}
      <div className="relative -mx-6 -mt-6 mb-2 h-[clamp(96px,13vh,148px)] overflow-hidden border-b border-line/70 bg-gradient-to-br from-amber/[0.16] via-bg-3 to-teal/[0.12]">
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(var(--color-line-soft)_1px,transparent_1px),linear-gradient(90deg,var(--color-line-soft)_1px,transparent_1px)] bg-[size:28px_28px] opacity-40 [mask-image:radial-gradient(ellipse_70%_80%_at_70%_20%,#000,transparent)]"
        />
        <div className="absolute left-4 top-3 flex items-center gap-2">
          <span aria-hidden className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]/70" />
          </span>
          <span className="font-mono text-[0.72rem] text-faint">~/{slug}</span>
        </div>
        <span
          aria-hidden
          className="absolute -bottom-5 right-2 select-none font-display text-[5.5rem] font-bold leading-none text-ink/[0.07]"
        >
          {project.title.charAt(0)}
        </span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="depth-1 font-mono text-[0.72rem] tracking-[0.04em] text-amber">{project.tag}</span>
        {onCaseStudy && (
          <button
            type="button"
            onClick={onCaseStudy}
            className="depth-2 inline-flex items-center gap-[0.4ch] rounded-md border border-teal/40 px-2.5 py-1 font-mono text-[0.75rem] text-teal transition-colors hover:border-teal hover:bg-teal/10"
          >
            read the architecture →
          </button>
        )}
        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener"
            className="depth-2 inline-flex items-center gap-[0.4ch] font-mono text-[0.75rem] text-teal transition-colors hover:text-amber"
            aria-label="GitHub Repository"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2A10 10 0 0 0 8.84 21.5c.5.08.66-.22.66-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.4 9.4 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.16.57.67.48A10 10 0 0 0 12 2Z" />
            </svg>
            repo
          </a>
        )}
      </div>
      <h3
        className={`depth-2 font-display font-semibold tracking-[-0.01em] ${
          feature ? "text-[1.7rem]" : "text-[1.35rem]"
        }`}
      >
        {project.title}
      </h3>

      {feature && stats ? (
        <div className="grid gap-5 md:grid-cols-[1.7fr_1fr] md:gap-8">
          <div className="depth-1">
            <p className="text-[0.98rem] text-muted">{project.body}</p>
            {project.points && <PointsList points={project.points} />}
          </div>
          <dl className="depth-2 grid grid-cols-2 gap-x-4 gap-y-3 self-start border-line-soft md:grid-cols-1 md:border-l md:pl-6">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-[1.25rem] font-semibold leading-none text-amber">
                  {s.value}
                </dt>
                <dd className="mt-1 font-mono text-[0.72rem] uppercase tracking-[0.05em] text-muted">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : (
        <div className="depth-1">
          <p className="text-[0.98rem] text-muted">{project.body}</p>
          {project.points && <PointsList points={project.points} />}
        </div>
      )}

      <div className="depth-1 mt-auto flex flex-wrap gap-1.5 pt-1">
        {project.tags.map((t) => (
          <span
            key={t}
            className="rounded-md border border-line px-2 py-0.5 font-mono text-[0.71rem] text-muted transition-colors duration-200 hover:border-amber hover:text-amber"
          >
            {t}
          </span>
        ))}
      </div>
    </Tilt3D>
  );
}

function PointsList({ points }: { points: string[] }) {
  return (
    <ul className="mt-3.5 grid gap-2">
      {points.map((p, i) => (
        <li key={i} className="relative pl-[1.3rem] text-[0.92rem] text-muted">
          <span aria-hidden className="absolute left-0 text-teal">
            ▹
          </span>
          {p}
        </li>
      ))}
    </ul>
  );
}
