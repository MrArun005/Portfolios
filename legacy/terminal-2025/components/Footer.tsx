import { meta } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line-soft py-10">
      <div className="wrap flex flex-wrap justify-between gap-4 mix-blend-difference">
        <span className="font-mono text-[0.78rem] text-faint">
          © {year} {meta.name}
        </span>
        <span className="font-mono text-[0.78rem] text-faint">
          {meta.location} · built from scratch
        </span>
      </div>
    </footer>
  );
}
