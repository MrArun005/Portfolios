import type { ReactNode } from "react";

/**
 * Vertical flip: `a` slides up to reveal `b` (a cheeky alt) when the nearest
 * ancestor `.group` is hovered. Pure CSS — drop it inside any element that has
 * the `group` class. Static under reduced motion.
 */
export function FlipText({
  a,
  b,
  className,
}: {
  a: ReactNode;
  b: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-block h-[1.2em] overflow-hidden whitespace-nowrap align-bottom ${className ?? ""}`}
    >
      <span className="flex flex-col leading-[1.2em] transition-transform duration-300 ease-out group-hover:-translate-y-1/2 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
        <span>{a}</span>
        <span className="text-amber">{b}</span>
      </span>
    </span>
  );
}
