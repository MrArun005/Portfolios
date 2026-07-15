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
    link: null,
  },
];

export const ARCHIVE_URL = "https://github.com/MrArun005";
