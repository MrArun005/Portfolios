# Arun Mallikarjuna — Portfolio

A single-page developer portfolio built with **Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion**. Dark terminal/filesystem identity, amber + teal dual accent, orchestrated motion.

## Run it
```bash
npm install
npm run dev      # http://localhost:3000
```

Production:
```bash
npm run build && npm run start
```

## Structure
- `app/layout.tsx` — fonts (Space Grotesk / Inter / JetBrains Mono), metadata, body shell
- `app/globals.css` — Tailwind import + `@theme` design tokens (colors, fonts, animations)
- `app/page.tsx` — composes the sections
- `lib/content.ts` — **all content** (copy, experience, projects, skills) as typed data
- `components/` — one component per section + shared `Reveal`, `Counter`, `Section`, `Eyebrow`
- `public/assets/` — résumé PDF
- `legacy/` — the original static HTML/CSS/JS build, kept for reference

## Edit
- **Content/copy:** everything lives in `lib/content.ts`.
- **LinkedIn:** set `meta.linkedin` in `lib/content.ts` — it stays hidden until a URL is provided.
- **Colors/type/animations:** the `@theme` block at the top of `app/globals.css`.

## Motion
Framer Motion drives the hero load sequence, scroll reveals, count-up stats, project-card 3D tilt, and the sliding nav indicator. All of it is gated behind `prefers-reduced-motion` (`useReducedMotion`), and content renders in place when motion is reduced.

## Deploy (free)
- **Vercel:** `npx vercel` (zero config — detects Next.js).

Accessible: keyboard focus rings, reduced-motion respected, responsive down to mobile.

## Credits

- Asteroid 3D model: "Asteroid" by J-Toastie via [Poly Pizza](https://poly.pizza/m/YS1jpm3mNr) — licensed CC BY 3.0.
