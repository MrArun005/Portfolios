/** Canonical origin — the deployed Vercel production URL. */
export const SITE_URL = "https://arun-portfolio-kappa.vercel.app";

export const PROFILE = {
  name: "Arun Mallikarjuna",
  firstName: "Arun",
  role: "Full-Stack & AI Platform Engineer",
  status: "Available for new roles · Bengaluru, India",
  taglines: [
    "I build the engines other people run.",
    "AI agents in production — not demos.",
    "Multi-tenant platforms that scale without redeploys.",
    "I own the architecture, the reliability, and the QA.",
    "Config, not code.",
  ],
  bio: "I build the engines other people run — multi-tenant platforms, payroll and rule engines, and the custom AI agents wired into them. 4+ years shipping production systems end to end, 2+ years putting LLMs into core product features. I own the architecture, the reliability, and the incident response behind them.",
  about: {
    lead: "I go for the hard, structural problems — distributed microservices, clean data models, and the patterns that keep a system reliable as it grows.",
    p2: "Lately that means custom AI agents and the system prompts behind them: multi-step tool-calling, evals, and internal AI tooling shipped to production. I work from PRDs and real customer pain, own the architecture calls, and treat QA as part of the job.",
    p3: "The throughline, from a telecom promotion engine to a multi-tenant HRMS: build engines other people can configure without code — and don't call it done until it survives production.",
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

export type Metric = { value: string; label: string };

export type Job = {
  company: string;
  title: string;
  range: string;
  location: string;
  blurb: string;
  points: string[];
  metrics?: Metric[];
};

export const EXPERIENCE: Job[] = [
  {
    company: "Tecnotree Convergence",
    title: "Senior Software Engineer",
    range: "Jan 2024 — Present",
    location: "Bengaluru, India",
    blurb:
      "Architecture owner for a rule-based Promotion Engine — the team's go-to for technical calls, production reliability, and scaling.",
    points: [
      "Owned architecture and design — patterns, reliability, scaling — of a rule-based Promotion Engine that lets business teams launch telecom campaigns with zero redeployment.",
      "Led production incident response across distributed microservices, sustaining 99.5% availability under high transaction volume.",
      "Ran end-to-end QA (SIT, smoke, UAT) and reviewed teammates' code against PRDs before release.",
      "Built REST APIs, reporting dashboards, and third-party integrations aligned to clear business outcomes.",
      "Improved frontend performance ~30% through optimized React rendering and state management.",
    ],
    metrics: [
      { value: "99.5%", label: "availability at scale" },
      { value: "~30%", label: "faster frontend" },
      { value: "0", label: "redeploys to launch a campaign" },
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
    metrics: [
      { value: "high-vol", label: "transaction processing" },
      { value: "low-latency", label: "under heavy load" },
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

/** What I do — surfaced during the skills flythrough. */
export type Capability = { title: string; body: string; tags: string[] };

export const CAPABILITIES: Capability[] = [
  {
    title: "AI agents & LLM features",
    body: "Custom agents and the system prompts behind them — multi-step tool-calling, self-correcting planner/executor loops, structured-output guardrails, and evals. Claude & Gemini wired into core flows, not bolt-on demos.",
    tags: ["Tailorwright", "Free Resume Pro", "structured output", "evals"],
  },
  {
    title: "Platform & backend architecture",
    body: "Distributed microservices with clean data modeling and the patterns that keep them reliable as they scale — APIs, async jobs, caching, database-per-tenant isolation.",
    tags: ["Folkgrove", "database-per-tenant", "Redis / BullMQ", "Cerbos"],
  },
  {
    title: "Configurable engines",
    body: "Rule engines and no-code platforms teams configure without a redeploy — promotions, country-agnostic payroll, workflow builders. Adding a case is config, not code.",
    tags: ["promotion engine", "payroll rule packs", "workflow builder"],
  },
  {
    title: "Reliability & quality",
    body: "99.5% availability under volume, ~2,600 automated tests, end-to-end QA (SIT · smoke · UAT), and calm incident response across distributed services.",
    tags: ["99.5% availability", "~2,600 tests", "SIT · smoke · UAT"],
  },
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
  /** Highlight bullets shown in the mission-brief modal. */
  points?: string[];
  /** Headline numbers shown in the mission-brief modal. */
  stats?: Metric[];
};

export const PROJECTS: Project[] = [
  {
    id: "folkgrove",
    title: "Folkgrove — Multi-Tenant HRMS",
    meta: "2025 · Flagship",
    tagline: "A payroll & HR engine you configure without code",
    description:
      "A multi-tenant HRMS with database-per-tenant isolation across a 4-app Turborepo — HR, payroll, leave, performance, and analytics — built engine-first so admins extend it without engineering.",
    points: [
      "Country-agnostic payroll engine: pluggable statutory rule packs (India, US, UAE, Singapore) + DB-driven rates — adding a country is configuration, not code.",
      "No-code customization platform: custom fields → objects → form builder → workflow triggers, so admins extend the product without engineering.",
      "Policy-based RBAC with Cerbos and async job processing via Redis / BullMQ for payroll runs and exports.",
      "Database-per-tenant isolation behind a shared control plane; ~2,600 automated tests guarding the core.",
    ],
    tags: ["TypeScript", "Next.js 15", "NestJS", "Prisma", "MySQL", "Redis/BullMQ", "Cerbos", "Turborepo"],
    colorA: "#f4b860",
    colorB: "#5ec8c2",
    link: null,
    featured: true,
    stats: [
      { value: "4-app", label: "Turborepo" },
      { value: "~2,600", label: "automated tests" },
      { value: "4", label: "country rule packs" },
      { value: "DB/tenant", label: "isolation" },
    ],
  },
  {
    id: "tailorwright",
    title: "Tailorwright — AI Agent Platform",
    meta: "Open source · AI agents",
    tagline: "One agent core, four forms",
    description:
      "Custom AI agents and the system prompts behind them, shipped from one shared core in four forms — web app, Claude Code skill, subagent, and CLI.",
    points: [
      "Multi-step tool-calling with a planner/executor loop that self-corrects on tool failure.",
      "Strict no-fabrication guardrail via structured-output schemas + retries, validated with evals.",
      "Runs fully local and is SSRF-hardened — safe to point at arbitrary job URLs.",
    ],
    tags: ["Claude API", "Next.js", "TypeScript", "Node.js"],
    colorA: "#5ec8c2",
    colorB: "#f0abfc",
    link: "https://github.com/MrArun005/resume-tailor",
    linkLabel: "View on GitHub",
  },
  {
    id: "freeresumepro",
    title: "Free Resume Pro",
    meta: "AI SaaS",
    tagline: "ATS scoring, zero storage",
    description:
      "A résumé tool built around the Gemini API, owned end-to-end solo and scaled on Vercel.",
    points: [
      "ATS scoring + job-description matching to surface gaps against a target role.",
      "AI rewriting through structured prompt engineering for consistent, on-spec output.",
      "JWT auth with a privacy-first, zero-storage design — nothing is persisted.",
    ],
    tags: ["Next.js", "React", "Node.js", "Gemini API", "Vercel"],
    colorA: "#f4b860",
    colorB: "#f0abfc",
    link: null,
  },
  {
    id: "promotion-manager",
    title: "Promotion Manager System",
    meta: "Platform",
    tagline: "Telecom campaigns with zero redeploys",
    description:
      "A scalable promotion-management system on a microservices backend with a real-time rule engine.",
    points: [
      "Lets non-technical teams configure telecom campaigns with zero redeployment.",
      "Async, high-throughput rule evaluation tuned for low per-request latency under load.",
    ],
    tags: ["Node.js", "React", "Microservices", "REST APIs"],
    colorA: "#f4b860",
    colorB: "#5ec8c2",
    link: null,
  },
  {
    id: "algo-visualizer",
    title: "Algorithm Visualizer",
    meta: "Learning in public",
    tagline: "Big-O you can watch",
    description:
      "Interactive, step-by-step visualizations of core algorithms and data structures.",
    points: [
      "Animates each step of sorting, search, and graph algorithms to make them tangible.",
      "Built to make Big-O and complexity analysis intuitive rather than abstract.",
    ],
    tags: ["JavaScript", "React"],
    colorA: "#34a853",
    colorB: "#f4b860",
    link: null,
  },
];

export const ARCHIVE_URL = "https://github.com/MrArun005";
