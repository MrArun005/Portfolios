/** Filesystem-path eyebrow with an optional section index (e.g. 01 ~/about). */
export function Eyebrow({ children, index }: { children: string; index?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5 font-mono text-[0.78rem] tracking-[0.05em] text-teal">
      {index != null && (
        <span className="text-amber/90">{String(index).padStart(2, "0")}</span>
      )}
      <span aria-hidden className="text-faint">/</span>
      <span>
        <span aria-hidden className="text-faint">~/</span>
        {children}
      </span>
    </span>
  );
}
