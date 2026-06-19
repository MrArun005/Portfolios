import type { ReactNode } from "react";

/** Section shell: top hairline + the original vertical rhythm, centered rail. */
export function Section({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`wrap border-t border-line-soft py-[clamp(64px,11vh,128px)] ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-[2.6rem] font-display text-[clamp(1.7rem,4.2vw,2.5rem)] font-semibold tracking-[-0.02em]">
      {children}
    </h2>
  );
}
