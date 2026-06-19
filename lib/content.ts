// All portfolio content as typed data. Section components stay presentational.

export const meta = {
  name: "Arun Mallikarjuna",
  role: "Full-Stack & AI Platform Engineer",
  location: "Bengaluru, India",
  email: "arunmallikarjun005@gmail.com",
  phone: "+91 74835 73363",
  phoneHref: "tel:+917483573363",
  github: "https://github.com/MrArun005",
  // Set this to your LinkedIn profile URL to enable the link. Empty = omitted.
  linkedin: "https://www.linkedin.com/in/arunmallikarjun",
  resume: "/assets/Arun-Mallikarjuna-Resume.pdf",
  brand: { left: "arun", dot: ".", right: "mallikarjuna" },
  title: "Arun Mallikarjuna — Full-Stack & AI Platform Engineer",
  description:
    "Arun Mallikarjuna — Full-Stack & AI Platform Engineer in Bengaluru. I build the engines and AI agents other people run: multi-tenant platforms, payroll engines, and custom agent runtimes.",
} as const;

export const nav = [
  { id: "about", label: "about", alt: "the lore" },
  { id: "capabilities", label: "capabilities", alt: "the craft" },
  { id: "experience", label: "experience", alt: "the grind" },
  { id: "projects", label: "projects", alt: "the goods" },
  { id: "contact", label: "contact", alt: "slide in 👀" },
] as const;

// Compact credibility row under the hero copy — proof before prose.
export const proof = [
  "4+ yrs production engineering",
  "2+ yrs LLM integration",
  "99.5% availability at scale",
  "~2,600 automated tests",
  "Multi-tenant SaaS",
] as const;

export type Span = { text: string; bold?: boolean };
export type HeadlinePart = { text: string; accent?: boolean };
export type Stat = {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

export const hero: { status: string; kicker: string; headline: HeadlinePart[]; lede: Span[] } = {
  status: "available for new roles · Bengaluru, India",
  // headline rendered as two lines; `accent` word gets the amber treatment
  kicker: "the throughline",
  headline: [
    { text: "I build the " },
    { text: "engines", accent: true },
    { text: " other people configure without code." },
  ],
  lede: [
    { text: "4+ years", bold: true },
    { text: " shipping production systems end-to-end and " },
    { text: "2+ years", bold: true },
    { text: " wiring LLM APIs into core product features. " },
    {
      text: "Rule engines, multi-tenant platforms, payroll engines, custom AI agents — I own the architecture, reliability, and scaling behind them.",
    },
  ],
};

export const about: { whoami: string; body: Span[]; stats: Stat[] } = {
  whoami: "full-stack & AI platform engineer · builds engines, not screens",
  body: [
    { text: "I like the hard, structural problems — distributed microservices backends, clean data modeling, and the design patterns that keep a system reliable as it grows. Lately I build " },
    { text: "custom AI agents and the system prompts behind them", bold: true },
    { text: ", run evals, and ship internal AI tooling. I work straight from PRDs and real customer problems, own the architecture decisions, and care about thorough QA. Whether it's a telecom promotion engine or a multi-tenant HRMS, the throughline is the same: " },
    { text: "engines other people can configure without code.", bold: true },
  ],
  stats: [
    { value: 4, suffix: "+ yrs", label: "production engineering" },
    { value: 2, suffix: "+ yrs", label: "LLM API integration" },
    { value: 2600, prefix: "~", label: "automated tests · Folkgrove" },
    { value: 99.5, suffix: "%", decimals: 1, label: "availability at scale" },
  ],
};

export type Role = {
  when: string;
  where: string;
  role: string;
  company: string;
  scope: string;
  points: string[];
  stack: string[];
  metrics: { value: string; label: string }[];
};

export const experience: Role[] = [
  {
    when: "Jan 2024 — Present",
    where: "Bengaluru, India",
    role: "Senior Software Engineer",
    company: "Tecnotree Convergence",
    scope: "Scope: architecture owner · production reliability · technical decisions",
    points: [
      "Owned architecture and design — patterns, reliability, scaling — of a rule-based Promotion Engine; the team's go-to for technical decisions, letting business teams launch telecom campaigns with zero redeployment.",
      "Led production incident response across distributed microservices, debugging and resolving failures while sustaining 99.5% availability under high transaction volume.",
      "Ran end-to-end QA (SIT, smoke, UAT) and reviewed teammates' code against PRDs and requirements before release.",
      "Built REST APIs, reporting dashboards, and third-party integrations aligned to clear business and customer outcomes.",
      "Improved frontend performance ~30% through optimized React rendering and state management.",
    ],
    stack: ["Node.js", "React", "Microservices", "REST APIs", "Rule Engine", "SQL"],
    metrics: [
      { value: "99.5%", label: "availability at scale" },
      { value: "~30%", label: "faster frontend" },
      { value: "0", label: "redeploys to launch a campaign" },
    ],
  },
  {
    when: "Oct 2021 — Dec 2023",
    where: "Bengaluru, India",
    role: "Software Engineer",
    company: "Tecnotree Convergence",
    scope: "Scope: backend feature delivery · microservices · performance",
    points: [
      "Built scalable, high-performance Node.js REST APIs for high-volume transaction processing, using async concurrency to keep latency low under load.",
      "Contributed to the microservices architecture and design, improving end-to-end throughput and reliability.",
      "Translated a real customer problem into a shipped feature — configurable self-serve workflows for non-technical teams — cutting turnaround time.",
      "Optimized rule-evaluation logic to reduce per-request latency and improve efficiency.",
    ],
    stack: ["Node.js", "Express.js", "REST APIs", "Microservices", "async/await"],
    metrics: [
      { value: "high-vol", label: "transaction processing" },
      { value: "low-latency", label: "under heavy load" },
    ],
  },
] as const;

export type Project = {
  tag: string;
  title: string;
  body: string;
  tags: string[];
  feature?: boolean;
  repo?: string;
  stats?: { value: string; label: string }[];
  points?: string[];
};

export const projects: Project[] = [
  {
    tag: "// flagship · personal",
    title: "Folkgrove — Multi-Tenant HRMS Platform",
    body: "A multi-tenant HRMS with isolated database-per-tenant across a 4-app Turborepo, spanning HR, payroll, leave, performance and analytics.",
    points: [
      "Country-agnostic payroll engine: pluggable statutory rule packs (India, US, UAE, Singapore) + DB-driven rates — adding a country is configuration, not code.",
      "No-code customization platform: custom fields → objects → form builder → workflow triggers, so admins extend the product without engineering.",
      "Policy-based RBAC with Cerbos and async job processing via Redis / BullMQ for payroll runs and exports.",
      "Database-per-tenant isolation behind a shared control plane; ~2,600 automated tests guarding the core.",
    ],
    tags: ["TypeScript", "Next.js 15", "NestJS", "Prisma", "MySQL", "Redis / BullMQ", "Cerbos", "Turborepo", "PWA"],
    feature: true,
    stats: [
      { value: "4-app", label: "Turborepo" },
      { value: "~2,600", label: "automated tests" },
      { value: "4", label: "country rule packs" },
      { value: "DB/tenant", label: "isolation" },
    ],
  },
  {
    tag: "// open source",
    title: "Tailorwright — AI Agent Platform",
    body: "Custom AI agents and the system prompts behind them, shipped from one shared core in four forms — web app, Claude Code skill, subagent, and CLI.",
    points: [
      "Multi-step tool-calling with a planner/executor loop that self-corrects on tool failure.",
      "Strict no-fabrication guardrail via structured-output schemas + retries, validated with evals.",
      "Runs fully local and is SSRF-hardened — safe to point at arbitrary job URLs.",
    ],
    tags: ["Claude API", "Next.js", "TypeScript", "Node.js"],
    repo: "https://github.com/MrArun005/resume-tailor",
  },
  {
    tag: "// ai saas",
    title: "Free Resume Pro",
    body: "A résumé tool built around the Gemini API, owned end-to-end solo and scaled on Vercel.",
    points: [
      "ATS scoring + job-description matching to surface gaps against a target role.",
      "AI rewriting through structured prompt engineering for consistent, on-spec output.",
      "JWT auth with a privacy-first, zero-storage design — nothing is persisted.",
    ],
    tags: ["Next.js", "React", "Node.js", "Gemini API", "Vercel"],
  },
  {
    tag: "// platform",
    title: "Promotion Manager System",
    body: "A scalable promotion-management system on a microservices backend with a real-time rule engine.",
    points: [
      "Lets non-technical teams configure telecom campaigns with zero redeployment.",
      "Async, high-throughput rule evaluation tuned for low per-request latency under load.",
    ],
    tags: ["Node.js", "React", "Microservices", "REST APIs"],
  },
  {
    tag: "// learning in public",
    title: "Algorithm Visualizer",
    body: "Interactive, step-by-step visualizations of core algorithms and data structures.",
    points: [
      "Animates each step of sorting, search, and graph algorithms to make them tangible.",
      "Built to make Big-O and complexity analysis intuitive rather than abstract.",
    ],
    tags: ["JavaScript", "React"],
  },
];

export const skills = [
  {
    group: "ai & agents",
    items: ["LLM API Integration", "Custom AI Agents", "System Prompt Engineering", "Multi-Step Tool-Calling", "Agent Evals", "RAG", "Vector Search", "Claude API", "Gemini API"],
  },
  {
    group: "languages & frontend",
    items: ["TypeScript", "JavaScript (ES6+)", "Python", "React", "Next.js", "React Native", "Tailwind CSS"],
  },
  {
    group: "backend & apis",
    items: ["Node.js", "NestJS", "Express.js", "REST APIs", "Prisma", "BullMQ", "Django", "Flask"],
  },
  {
    group: "data & infra",
    items: ["PostgreSQL", "MySQL", "MongoDB", "DynamoDB", "Redis", "Docker", "AWS", "GCP", "CI/CD"],
  },
  {
    group: "architecture & cs",
    items: ["Microservices", "Distributed Systems", "System Design", "Multi-Tenant Architecture", "Design Patterns", "Reliability & Scaling", "DSA", "Complexity Analysis"],
  },
  {
    group: "auth, security & qa",
    items: ["JWT", "Cerbos (RBAC)", "Firebase Auth", "Clerk", "VAPT", "SIT · Smoke · UAT", "Automated Testing"],
  },
] as const;

export const capabilities = [
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
] as const;

export const principles = [
  {
    title: "Start from the problem",
    body: "I work straight from PRDs and real customer pain, not a wishlist of features. The first question is always what the user actually needs to get done.",
  },
  {
    title: "Own the whole thing",
    body: "Architecture, reliability, scaling, QA, releases — I take responsibility for the system that ships, not just the ticket assigned to me.",
  },
  {
    title: "Build engines, not screens",
    body: "I design for configuration. The win is a system other people can extend and operate without booking time on an engineer's calendar.",
  },
  {
    title: "Verify before you claim",
    body: "Automated tests, thorough QA, and incident-readiness. 'Done' means it survives production — measured, not assumed.",
  },
] as const;

export const contact = {
  heading: "Let's build something solid.",
  body: "Open to full-stack and AI-platform roles. The fastest way to reach me is email — I read everything.",
  bestFit:
    "Best fit: full-stack / platform roles involving backend architecture, AI agents, multi-tenant SaaS, rule engines, or reliability-heavy systems.",
} as const;
