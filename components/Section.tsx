import type { ReactNode } from "react";
import { FlipText } from "./FlipText";

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

export function SectionTitle({ children, alt }: { children: ReactNode; alt?: string }) {
  return (
    <h2 className="group mb-[2.6rem] font-display text-[clamp(1.7rem,4.2vw,2.5rem)] font-semibold tracking-[-0.02em]">
      {alt ? <FlipText a={children} b={alt} /> : children}
    </h2>
  );
}
