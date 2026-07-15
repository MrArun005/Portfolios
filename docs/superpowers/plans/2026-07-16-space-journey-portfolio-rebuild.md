# Space-Journey Portfolio Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the terminal portfolio with a scroll-driven 3D space journey cloned from `AbhishekBadar/portfolio`, carrying Arun Mallikarjuna's content, a hybrid amber+teal HUD theme, and the ram-into-the-sun finale.

**Architecture:** Adopt the reference's `src/`-based Next 16 / React 19 / R3F scaffold wholesale (canvas + journey engine untouched). Swap the content module (`src/lib/data.ts`), retheme by remapping Tailwind `@theme` token *values*, and rewrite all identity/SEO surfaces. The current terminal site is archived under `legacy/terminal-2025/`.

**Tech Stack:** Next 16, React 19, `@react-three/fiber` + `drei` + `postprocessing`, `zustand`, `lenis`, `motion`, Tailwind CSS v4, TypeScript.

**Verification model:** This is a visual WebGL app with no test framework (reference ships only `eslint` + `next build`). The automated gate for each task is a clean `npm run build` (typecheck + lint). Visual correctness is confirmed by scrolling the running dev server — Arun eyeballs styling himself (no automated screenshots).

**Reference source:** `https://github.com/AbhishekBadar/portfolio.git`

---

## File Structure

Created / adopted from the reference clone (root of `arun-portfolio`):
- `src/app/{layout,page,globals.css,sitemap,robots,manifest,opengraph-image,twitter-image}.{ts,tsx,css}`
- `src/components/canvas/*` — 3D scene (untouched)
- `src/components/dom/*` — overlays (`ProjectModal`, `SeoContent` edited; rest recolored via tokens)
- `src/lib/{journey,scroll,store,textures,og}.ts(x)` — `journey.ts` labels edited, `og.tsx` restyled
- `src/lib/data.ts` — **rewritten** with Arun's content (core artifact)
- `public/**` — reference assets (textures, HDRI, GLB) + Arun's résumé + favicon
- Config: `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `vercel.json`

Archived (out of build):
- `legacy/terminal-2025/` — current `app/`, `components/`, `lib/`, old configs

---

## Task 1: Archive terminal site & drop in the cloned scaffold

**Files:**
- Move: `app/`, `components/`, `lib/`, `next.config.mjs`, `postcss.config.mjs`, `tsconfig.json`, `next-env.d.ts`, `package.json`, `package-lock.json` → `legacy/terminal-2025/`
- Create: `src/`, new root config files, `public/` (from clone)
- Preserve: `public/assets/Arun-Mallikarjuna-Resume.pdf`, `app/icon.svg` (copy out before moving)

- [ ] **Step 1: Confirm on the working branch, clean tree**

Run: `git branch --show-current && git status --porcelain`
Expected: `space-journey-rebuild` and no uncommitted changes (the spec commit is already in).

- [ ] **Step 2: Stash Arun's résumé + icon somewhere safe**

```bash
mkdir -p .keep
cp public/assets/Arun-Mallikarjuna-Resume.pdf .keep/
cp app/icon.svg .keep/arun-icon.svg
```

- [ ] **Step 3: Archive the current site**

```bash
mkdir -p legacy/terminal-2025
git mv app components lib next.config.mjs postcss.config.mjs tsconfig.json next-env.d.ts package.json package-lock.json legacy/terminal-2025/
# untracked build artifacts — remove, they regenerate
rm -rf node_modules .next tsconfig.tsbuildinfo public
```

- [ ] **Step 4: Clone the reference to a temp dir and copy its scaffold in**

```bash
git clone --depth 1 https://github.com/AbhishekBadar/portfolio.git /tmp/ref-portfolio
cp -R /tmp/ref-portfolio/src ./src
cp -R /tmp/ref-portfolio/public ./public
cp /tmp/ref-portfolio/package.json /tmp/ref-portfolio/package-lock.json /tmp/ref-portfolio/tsconfig.json /tmp/ref-portfolio/next.config.ts /tmp/ref-portfolio/postcss.config.mjs /tmp/ref-portfolio/eslint.config.mjs /tmp/ref-portfolio/vercel.json ./
cp /tmp/ref-portfolio/.gitignore ./.gitignore
```
Do **not** copy the reference `AGENTS.md`, `CLAUDE.md`, or `README.md` (Arun keeps his own; README handled in Task 7).

- [ ] **Step 5: Restore Arun's résumé + favicon into the new public/**

```bash
cp .keep/Arun-Mallikarjuna-Resume.pdf public/Arun-Mallikarjuna-Resume.pdf
cp .keep/arun-icon.svg public/favicon.svg
rm -f public/Resume_AbhishekBadar.pdf
rm -rf .keep
```

- [ ] **Step 6: Set the project name in package.json**

Modify `package.json`: change `"name": "rocketwebsite"` → `"name": "arun-portfolio"`.

- [ ] **Step 7: Install and build (proves the scaffold runs before content changes)**

```bash
npm install
npm run build
```
Expected: build succeeds. (Content is still Abhishek's — that's fine; this step only proves the scaffold compiles in Arun's repo.)

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Adopt 3D space-journey scaffold; archive terminal site to legacy/"
```

---

## Task 2: Rewrite the content module `src/lib/data.ts`

This is the core artifact. Keep every exported name and type shape so no consumer changes: `SITE_URL`, `PROFILE`, `Job`/`EXPERIENCE`, `Skill`/`SKILLS`, `Project`/`PROJECTS`, `ARCHIVE_URL`. This drops `socials.medium`, so Step 3 patches the two files that referenced it.

**Files:**
- Rewrite: `src/lib/data.ts`
- Modify: `src/app/layout.tsx` (remove the `medium` line in `sameAs`)
- Modify: `src/components/dom/SeoContent.tsx` (remove the Medium `<li>`)

- [ ] **Step 1: Replace `src/lib/data.ts` entirely with:**

```ts
/** Canonical origin. TODO: confirm real deploy domain (placeholder below). */
export const SITE_URL = "https://arunmallikarjun.com";

export const PROFILE = {
  name: "Arun Mallikarjuna",
  firstName: "Arun",
  role: "Full-Stack & AI Platform Engineer",
  status: "Available for new roles · Bengaluru, India",
  taglines: [
    "build the engines, not the screens.",
    "ship AI agents into real products.",
    "architect multi-tenant platforms that scale.",
    "own the architecture, reliability, and QA.",
    "make it configurable without code.",
  ],
  bio: "I build the engines other people configure without code — multi-tenant platforms, payroll engines, rule engines, and custom AI agents. 4+ years shipping production systems end-to-end, 2+ years wiring LLM APIs into core product features, owning architecture, reliability, and scaling.",
  about: {
    lead: "I like the hard, structural problems — distributed microservices backends, clean data modeling, and the design patterns that keep a system reliable as it grows.",
    p2: "Lately I build custom AI agents and the system prompts behind them, run evals, and ship internal AI tooling. I work straight from PRDs and real customer problems, own the architecture decisions, and care about thorough QA.",
    p3: "Whether it's a telecom promotion engine or a multi-tenant HRMS, the throughline is the same: engines other people can configure without code.",
    credentials: [
      "4+ yrs production engineering",
      "2+ yrs LLM API integration",
      "99.5% availability at scale",
      "~2,600 automated tests · Folkgrove",
      "Based in Bengaluru, India",
    ],
  },
  email: "arunmallikarjun005@gmail.com",
  location: "Bengaluru, India",
  resume: "/Arun-Mallikarjuna-Resume.pdf",
  siteUrl: `${SITE_URL}/`,
  socials: {
    github: "https://github.com/MrArun005",
    linkedin: "https://www.linkedin.com/in/arunmallikarjun",
  },
};

export type Job = {
  company: string;
  title: string;
  range: string;
  location: string;
  blurb: string;
  points: string[];
};

export const EXPERIENCE: Job[] = [
  {
    company: "Tecnotree Convergence",
    title: "Senior Software Engineer",
    range: "Jan 2024 — Present",
    location: "Bengaluru, India",
    blurb:
      "Architecture owner for a rule-based Promotion Engine — the team's go-to for technical decisions, production reliability, and scaling.",
    points: [
      "Owned architecture and design — patterns, reliability, scaling — of a rule-based Promotion Engine that lets business teams launch telecom campaigns with zero redeployment.",
      "Led production incident response across distributed microservices, sustaining 99.5% availability under high transaction volume.",
      "Ran end-to-end QA (SIT, smoke, UAT) and reviewed teammates' code against PRDs before release.",
      "Built REST APIs, reporting dashboards, and third-party integrations aligned to clear business outcomes.",
      "Improved frontend performance ~30% through optimized React rendering and state management.",
    ],
  },
  {
    company: "Tecnotree Convergence",
    title: "Software Engineer",
    range: "Oct 2021 — Dec 2023",
    location: "Bengaluru, India",
    blurb:
      "Backend feature delivery on a high-volume microservices platform — APIs, performance, and self-serve workflows.",
    points: [
      "Built scalable, high-performance Node.js REST APIs for high-volume transaction processing, using async concurrency to keep latency low under load.",
      "Contributed to the microservices architecture, improving end-to-end throughput and reliability.",
      "Translated a real customer problem into a shipped feature — configurable self-serve workflows for non-technical teams — cutting turnaround time.",
      "Optimized rule-evaluation logic to reduce per-request latency.",
    ],
  },
];

export type Skill = {
  /** HUD module number, "01".."06" */
  num: string;
  name: string;
  items: string;
};

export const SKILLS: Skill[] = [
  { num: "01", name: "AI & Agents", items: "LLM Integration · Custom Agents · System Prompts · Tool-Calling · Evals · RAG · Claude · Gemini" },
  { num: "02", name: "Languages & Frontend", items: "TypeScript · JavaScript · Python · React · Next.js · React Native · Tailwind" },
  { num: "03", name: "Backend & APIs", items: "Node.js · NestJS · Express · REST · Prisma · BullMQ · Django · Flask" },
  { num: "04", name: "Data & Infra", items: "PostgreSQL · MySQL · MongoDB · DynamoDB · Redis · Docker · AWS · GCP · CI/CD" },
  { num: "05", name: "Architecture & CS", items: "Microservices · Distributed Systems · System Design · Multi-Tenant · Design Patterns · DSA" },
  { num: "06", name: "Auth · Security · QA", items: "JWT · Cerbos RBAC · Firebase · Clerk · VAPT · SIT/Smoke/UAT · Automated Testing" },
];

export type Project = {
  id: string;
  title: string;
  meta: string;
  tagline: string;
  description: string;
  tags: string[];
  /** Gradient endpoints used to generate the orbiting card artwork. */
  colorA: string;
  colorB: string;
  /** External link (GitHub / store). Null = no public link. */
  link: string | null;
  linkLabel?: string;
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  {
    id: "folkgrove",
    title: "Folkgrove — Multi-Tenant HRMS",
    meta: "2025 · Flagship",
    tagline: "A payroll & HR engine teams configure without code",
    description:
      "A multi-tenant HRMS with database-per-tenant isolation across a 4-app Turborepo — HR, payroll, leave, performance, analytics. Country-agnostic payroll engine with pluggable statutory rule packs (India, US, UAE, Singapore), a no-code customization platform (custom fields → objects → form builder → workflow triggers), policy-based RBAC with Cerbos, and async payroll runs via Redis/BullMQ. ~2,600 automated tests guard the core.",
    tags: ["TypeScript", "Next.js 15", "NestJS", "Prisma", "MySQL", "Redis/BullMQ", "Cerbos", "Turborepo"],
    colorA: "#f4b860",
    colorB: "#5ec8c2",
    link: null,
    featured: true,
  },
  {
    id: "tailorwright",
    title: "Tailorwright — AI Agent Platform",
    meta: "Open source · AI agents",
    tagline: "One agent core, four forms",
    description:
      "Custom AI agents and the system prompts behind them, shipped from one shared core in four forms — web app, Claude Code skill, subagent, and CLI. Multi-step tool-calling with a self-correcting planner/executor loop, a strict no-fabrication guardrail via structured-output schemas + retries (validated with evals), runs fully local and SSRF-hardened.",
    tags: ["Claude API", "Next.js", "TypeScript", "Node.js"],
    colorA: "#5ec8c2",
    colorB: "#7c3aed",
    link: "https://github.com/MrArun005/resume-tailor",
    linkLabel: "View on GitHub",
  },
  {
    id: "freeresumepro",
    title: "Free Resume Pro",
    meta: "AI SaaS",
    tagline: "ATS scoring, zero storage",
    description:
      "A résumé tool built around the Gemini API, owned end-to-end solo and scaled on Vercel. ATS scoring + job-description matching to surface gaps against a target role, AI rewriting through structured prompt engineering, and JWT auth with a privacy-first, zero-storage design — nothing is persisted.",
    tags: ["Next.js", "React", "Node.js", "Gemini API", "Vercel"],
    colorA: "#f4b860",
    colorB: "#f0abfc",
    link: null,
  },
  {
    id: "promotion-manager",
    title: "Promotion Manager System",
    meta: "Platform",
    tagline: "Telecom campaigns, zero redeploy",
    description:
      "A scalable promotion-management system on a microservices backend with a real-time rule engine, letting non-technical teams configure telecom campaigns with zero redeployment. Async, high-throughput rule evaluation tuned for low per-request latency under load.",
    tags: ["Node.js", "React", "Microservices", "REST APIs"],
    colorA: "#4cc9f0",
    colorB: "#5ec8c2",
    link: null,
  },
  {
    id: "algo-visualizer",
    title: "Algorithm Visualizer",
    meta: "Learning in public",
    tagline: "Big-O made tangible",
    description:
      "Interactive, step-by-step visualizations of core algorithms and data structures — sorting, search, and graph algorithms animated to make complexity analysis intuitive rather than abstract.",
    tags: ["JavaScript", "React"],
    colorA: "#34a853",
    colorB: "#f4b860",
  },
];

export const ARCHIVE_URL = "https://github.com/MrArun005";
```

- [ ] **Step 2: Remove the Medium reference in `src/app/layout.tsx`**

In the `sameAs` array of the Person node, delete the line:
```ts
        PROFILE.socials.medium,
```
so it reads:
```ts
      sameAs: [
        PROFILE.socials.github,
        PROFILE.socials.linkedin,
      ],
```

- [ ] **Step 3: Remove the Medium `<li>` in `src/components/dom/SeoContent.tsx`**

Delete this block (lines ~116–120):
```tsx
          <li>
            <a href={PROFILE.socials.medium} rel="noopener">
              Medium
            </a>
          </li>
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: PASS. No TypeScript error about `medium` not existing; hero/overlays now read Arun's name.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Swap portfolio content to Arun Mallikarjuna; drop Medium"
```

---

## Task 3: Relabel the journey sections

Keep every section `id` and `range` (the camera/rocket curves are tuned to them). Change only the display `label` strings to Arun's voice.

**Files:**
- Modify: `src/lib/journey.ts` (the `SECTIONS` array, ~lines 12–20)

- [ ] **Step 1: Replace the `SECTIONS` labels**

Set the array to (ids and ranges unchanged, labels updated):
```ts
export const SECTIONS = [
  { id: "hero", label: "Home", range: [0.0, 0.1] },
  { id: "launch", label: "Launch", range: [0.1, 0.19] },
  { id: "about", label: "The Lore", range: [0.19, 0.34] },
  { id: "experience", label: "The Grind", range: [0.34, 0.5] },
  { id: "skills", label: "The Craft", range: [0.5, 0.62] },
  { id: "projects", label: "The Goods", range: [0.62, 0.8] },
  { id: "contact", label: "Contact", range: [0.8, 1.0] },
] as const;
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Relabel journey sections in Arun's voice"
```

---

## Task 4: Retheme to hybrid amber + teal

Recolor globally by remapping the Tailwind `@theme` token *values* (so `text-cyan`, `from-cyan to-nebula`, etc. everywhere resolve to the new palette) and by editing the raw `rgba()` literals in `globals.css`.

**Files:**
- Modify: `src/app/globals.css` (`@theme` block + `.glass`, `.hud-corners`, `::selection`)

- [ ] **Step 1: Remap the accent token values in the `@theme inline` block**

Change these lines:
```css
  --color-nebula: #7c3aed;
  --color-nebula-soft: #a78bfa;
  --color-cyan: #4cc9f0;
  --color-cyan-bright: #7df9ff;
  --color-pink: #f0abfc;
  --color-hud: #9adcff;
```
to:
```css
  --color-nebula: #f4b860;       /* amber (primary accent) */
  --color-nebula-soft: #f7c88f;
  --color-cyan: #5ec8c2;         /* teal (secondary accent) */
  --color-cyan-bright: #7df0ea;
  --color-pink: #f0abfc;         /* kept as a minor third accent */
  --color-hud: #bfeae6;          /* warm-teal HUD tint */
```

- [ ] **Step 2: Recolor the `.glass` utility**

Replace the `.glass` block's gradient/border/shadow colors:
```css
.glass {
  background: linear-gradient(
    135deg,
    rgba(244, 184, 96, 0.10),
    rgba(10, 12, 32, 0.55) 45%,
    rgba(94, 200, 194, 0.08)
  );
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(94, 200, 194, 0.20);
  box-shadow:
    0 0 24px rgba(94, 200, 194, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
```

- [ ] **Step 3: Recolor `.hud-corners` and `::selection`**

In `.hud-corners::before, .hud-corners::after`, change the border color `rgba(154, 220, 255, 0.75)` → `rgba(94, 200, 194, 0.8)`.

Change `::selection` from:
```css
::selection {
  background: rgba(124, 58, 237, 0.55);
  color: #fff;
}
```
to:
```css
::selection {
  background: rgba(244, 184, 96, 0.45);
  color: #02010a;
}
```

- [ ] **Step 4: Build + eyeball**

Run: `npm run build && npm run dev`
Expected: build PASS. In the browser, nav / HUD / cards / modal now read amber+teal instead of purple+cyan. (Arun confirms visually.)

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Retheme HUD to hybrid amber + teal"
```

---

## Task 5: Rewrite identity / SEO / metadata

Replace every Abhishek-specific string with Arun's across metadata, structured data, OG art, manifest, and the LLM text files.

**Files:**
- Modify: `src/app/layout.tsx` (TITLE, DESCRIPTION, keywords, OG, twitter, jsonLd)
- Modify: `src/app/manifest.ts`
- Modify: `src/lib/og.tsx` (STACK, label, gradient tint)
- Rewrite: `public/llms.txt`, `public/llms-full.txt`
- Rewrite: `README.md`

- [ ] **Step 1: `src/app/layout.tsx` — TITLE & DESCRIPTION**

```ts
const TITLE =
  "Arun Mallikarjuna — Full-Stack & AI Platform Engineer | Node.js, React, AI Agents";
const DESCRIPTION =
  "Arun Mallikarjuna is a Full-Stack & AI Platform Engineer in Bengaluru, India. I build the engines and AI agents other people run — multi-tenant platforms, payroll engines, rule engines, and custom agent runtimes with Node.js, NestJS, Next.js, TypeScript, and the Claude & Gemini APIs.";
```

- [ ] **Step 2: `layout.tsx` — `template`, `applicationName`, `keywords`, OG, twitter**

- `title.template`: `"%s · Arun Mallikarjuna"`
- `applicationName`: `"Arun Mallikarjuna Portfolio"`
- `keywords`: 
```ts
  keywords: [
    "Arun Mallikarjuna",
    "Arun Mallikarjuna portfolio",
    "Full-Stack Engineer",
    "AI Platform Engineer",
    "AI Agents",
    "LLM Integration",
    "Node.js",
    "NestJS",
    "Next.js",
    "TypeScript",
    "React",
    "Microservices",
    "Multi-Tenant SaaS",
    "Rule Engine",
    "Payroll Engine",
    "Claude API",
    "Gemini API",
    "Bengaluru developer",
    "Tecnotree",
  ],
```
- `openGraph`: `firstName: PROFILE.firstName`, `lastName: "Mallikarjuna"`, `username: "arunmallikarjun"`, `siteName: "Arun Mallikarjuna Portfolio"`.
- `twitter`: delete the `creator: "@abhishekbadar",` line (Arun has no handle); keep `card`, `title`, `description`.

- [ ] **Step 3: `layout.tsx` — JSON-LD `@graph`**

In the `Person` node:
- `familyName: "Mallikarjuna"`
- `address`: `addressLocality: "Bengaluru"`, `addressRegion: "Karnataka"`, `addressCountry: "IN"`
- `worksFor`: `{ "@type": "Organization", name: "Tecnotree Convergence" }`
- **Delete the entire `alumniOf` array** (no education data — do not fabricate).
- `hasOccupation.occupationLocation.name`: `"Bengaluru, India"`
- Replace `knowsAbout` with:
```ts
      knowsAbout: [
        "Full-Stack Development",
        "AI Agents",
        "LLM Integration",
        "System Prompt Engineering",
        "Node.js",
        "NestJS",
        "Next.js",
        "TypeScript",
        "React",
        "Microservices",
        "Distributed Systems",
        "Multi-Tenant Architecture",
        "Rule Engines",
        "Payroll Engines",
        "Prisma",
        "Redis",
        "Reliability & Scaling",
      ],
```
In the `WebSite` and `ProfilePage` nodes, change `name: "Abhishek Badar Portfolio"` → `"Arun Mallikarjuna Portfolio"`. In the `ItemList` node, `name: "Projects by Arun Mallikarjuna"`. (The `sameAs` array was already fixed in Task 2.)

- [ ] **Step 4: `src/app/manifest.ts`**

```ts
    name: "Arun Mallikarjuna — Full-Stack & AI Platform Engineer",
    short_name: "Arun Mallikarjuna",
    description:
      "Portfolio of Arun Mallikarjuna, a Full-Stack & AI Platform Engineer building multi-tenant platforms, rule engines, and custom AI agents.",
```
(Leave `background_color`/`theme_color` `#02010a` — deep-space base stays.)

- [ ] **Step 5: `src/lib/og.tsx` — stack line, label, gradient tint**

- Line 8: `const STACK = "Node.js · NestJS · Next.js · TypeScript · AI Agents · Microservices";`
- Line 45: change `SDE · FULL-STACK · AI` → `FULL-STACK · AI PLATFORM`
- Line 28–29 `backgroundImage`: retheme the two radial tints — `rgba(217,119,87,0.32)` → `rgba(244,184,96,0.32)` (amber), `rgba(76,201,240,0.18)` → `rgba(94,200,194,0.18)` (teal).

- [ ] **Step 6: Rewrite `public/llms.txt`**

```
# Arun Mallikarjuna

> Full-Stack & AI Platform Engineer in Bengaluru, India. Builds the engines and AI agents other people run — multi-tenant platforms, payroll engines, rule engines, and custom agent runtimes — with Node.js, NestJS, Next.js, TypeScript, and the Claude & Gemini APIs. 4+ years production engineering, 2+ years LLM integration.

Arun designs and owns backend architecture, reliability, and scaling for distributed microservices systems, and ships custom AI agents with the system prompts and evals behind them. The portfolio is an interactive 3D (WebGL) experience; the complete text content is mirrored in the files linked below for language models.

## Key pages
- [Portfolio home](https://arunmallikarjun.com/): Interactive 3D portfolio with about, experience, projects, and skills.
- [Full profile (Markdown)](https://arunmallikarjun.com/llms-full.txt): Complete bio, work experience, and every project description in plain text.
- [Résumé (PDF)](https://arunmallikarjun.com/Arun-Mallikarjuna-Resume.pdf): Downloadable résumé.

## Experience
- Senior Software Engineer, Tecnotree Convergence (Jan 2024–Present): Architecture owner of a rule-based telecom Promotion Engine; 99.5% availability across distributed microservices; end-to-end QA and ~30% faster frontend.
- Software Engineer, Tecnotree Convergence (Oct 2021–Dec 2023): High-performance Node.js REST APIs for high-volume transaction processing; microservices throughput and reliability; configurable self-serve workflows.

## Selected projects
- Folkgrove — Multi-Tenant HRMS: Database-per-tenant HRMS across a 4-app Turborepo; country-agnostic payroll engine; no-code customization; Cerbos RBAC; ~2,600 automated tests.
- [Tailorwright — AI Agent Platform](https://github.com/MrArun005/resume-tailor): One agent core in four forms (web, Claude Code skill, subagent, CLI); self-correcting tool-calling; no-fabrication guardrails; SSRF-hardened.
- Free Resume Pro: Gemini-API résumé tool with ATS scoring, job-description matching, and a privacy-first zero-storage design.
- Promotion Manager System: Microservices promotion engine letting non-technical teams launch telecom campaigns with zero redeployment.

## Profiles
- [GitHub](https://github.com/MrArun005)
- [LinkedIn](https://www.linkedin.com/in/arunmallikarjun)

## Contact
- Email: arunmallikarjun005@gmail.com
- Location: Bengaluru, India
```

- [ ] **Step 7: Rewrite `public/llms-full.txt`**

Mirror `llms.txt` but expand every section using the exact content now in `src/lib/data.ts`: the full `PROFILE.bio` + `about.{lead,p2,p3}`, each `EXPERIENCE` entry with all its `points`, each `PROJECTS` entry with its full `description` and `tags`, all six `SKILLS` modules (`name`: `items`), and the contact block. Plain markdown, same heading structure as `llms.txt`. No Abhishek/Xeo/Pune/RCOEM/IIT strings may remain.

- [ ] **Step 8: Rewrite `README.md`**

Replace the top of the README with Arun's project description (below), and **keep an "Assets & Credits" section** attributing the reused CC/public-domain assets (this attribution is required by CC BY 4.0):
```markdown
# Arun Mallikarjuna — Portfolio

An interactive 3D space-journey portfolio built with Next.js 16, React 19,
React Three Fiber, and Tailwind CSS v4. Scroll to fly a rocket past planets,
a station, skill cards, and an orbiting ring of projects before the finale.

## Run it
```bash
npm install
npm run dev      # http://localhost:3000
```

## Structure
- `src/lib/data.ts` — all content (profile, experience, skills, projects)
- `src/lib/journey.ts` — the scroll-driven flight (camera + rocket paths)
- `src/components/canvas/*` — the 3D scene
- `src/components/dom/*` — HTML overlays (nav, HUD, project modal)
- `src/app/globals.css` — `@theme` design tokens (amber + teal accents)
- `legacy/terminal-2025/` — the previous terminal-themed build, kept for reference

## Assets & Credits
The 3D experience and its scaffolding were adapted from an open portfolio by
Abhishek Badar (github.com/AbhishekBadar/portfolio). Reused assets:
- **Planet/star textures** — [Solar System Scope](https://www.solarsystemscope.com/textures/) (CC BY 4.0)
- **HDRI lighting** — "Dikhololo Night", [Poly Haven](https://polyhaven.com) (CC0)
- **3D models** (astronaut, spaceship) — [Quaternius](https://quaternius.com) (CC0)
- **ISS model** — [NASA 3D Resources](https://github.com/nasa/NASA-3D-Resources) (public domain)
- Rocket, nebula, rings, and HUD art are generated procedurally in code.
```

- [ ] **Step 9: Build**

Run: `npm run build`
Expected: PASS. `<head>` title, OG image route, sitemap, robots, and JSON-LD now reference Arun.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "Rewrite identity, SEO, metadata, and OG to Arun Mallikarjuna"
```

---

## Task 6: Full-journey verification

**Files:** none (verification + any small fixes surfaced).

- [ ] **Step 1: Production build is clean**

Run: `npm run build`
Expected: PASS, no type/lint errors.

- [ ] **Step 2: Run dev and scroll the entire runway**

Run: `npm run dev`, open `http://localhost:3000`, scroll top → bottom. Confirm:
- Hero shows "Arun Mallikarjuna" and a rotating tagline from `PROFILE.taglines`.
- About / experience overlays read Arun's copy (Tecnotree roles).
- Skills HUD shows all six modules (01–06).
- Projects orbit shows all five cards; clicking each opens `ProjectModal` with correct title/meta/tagline/description/tags; Folkgrove shows the ★ FEATURED badge; Tailorwright shows a working "View on GitHub" link; the three link-less projects show no visit button.
- HUD/nav/cards render in amber+teal.
- The rocket rams the sun and the impact flash fires near the bottom.
- Résumé link resolves to `/Arun-Mallikarjuna-Resume.pdf`.
- No console errors; no "Abhishek", "Xeo", "Pune", or "Medium" text anywhere: `grep -rInE "abhishek|xeo|pune|rcoem|iit ropar|medium" src public README.md` returns nothing.

- [ ] **Step 3: Fix anything the scroll-through surfaces, then commit**

```bash
git add -A
git commit -m "Fixes from full-journey verification"   # skip if nothing changed
```

- [ ] **Step 4: Handoff**

Report status to Arun. Open items to confirm before deploy: real `SITE_URL` domain (placeholder `arunmallikarjun.com` used in `data.ts`), and OG image wording. Then merge `space-journey-rebuild` → `main` and deploy on Vercel.

---

## Self-Review

**Spec coverage:** Base/clone → Task 1. Content mapping (PROFILE/EXPERIENCE/SKILLS/PROJECTS) → Task 2. Journey 6-stops + labels → Task 3 (curves/finale untouched by design). Case studies = ProjectModal as-is → inherited, verified Task 6 Step 2. Hybrid theme → Task 4. Identity/SEO → Task 5. Attribution/credits → Task 5 Step 8. Verification → Task 6. Legacy archive → Task 1. All spec sections covered.

**Placeholder scan:** No "TBD/TODO-implement-later" work items. The one `TODO` in `data.ts` (`SITE_URL`) is a genuine open decision flagged to the user, with a working placeholder — not a gap. `llms-full.txt` (Task 5 Step 7) is specified as derived content from `data.ts` with an explicit, complete source and structure, not a vague instruction.

**Type consistency:** `data.ts` keeps the reference's exact exported names/shapes (`PROFILE`, `Job`/`EXPERIENCE`, `Skill`/`SKILLS`, `Project`/`PROJECTS`, `SITE_URL`, `ARCHIVE_URL`), so all consumers (`layout.tsx`, `SeoContent.tsx`, `og.tsx`, `sitemap.ts`, `SkillCards`, `ProjectOrbit`, `ProjectModal`) compile unchanged except the two intentional `medium` removals in Task 2. Six SKILLS and five PROJECTS confirmed compatible with the count-agnostic canvas components.
