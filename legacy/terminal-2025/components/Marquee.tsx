const ITEMS = [
  "TypeScript",
  "Next.js",
  "NestJS",
  "Node.js",
  "Prisma",
  "Redis / BullMQ",
  "Cerbos",
  "PostgreSQL",
  "Microservices",
  "Claude API",
  "Gemini API",
  "RAG",
  "Turborepo",
  "Docker",
  "AWS",
];

/** Infinite horizontal ticker of core tech — a moving band that breaks the page rhythm. */
export function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-line-soft bg-bg-2/40 py-4">
      {/* edge fades so items dissolve rather than hard-cut */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent" />

      <div className="flex w-max animate-marquee items-center gap-10">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="flex shrink-0 items-center gap-10">
            <span className="font-mono text-[0.95rem] tracking-[0.02em] text-muted">
              {item}
            </span>
            <span aria-hidden className="text-amber/60">
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
