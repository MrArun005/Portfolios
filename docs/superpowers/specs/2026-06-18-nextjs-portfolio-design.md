# Arun Mallikarjuna Portfolio — Next.js Rebuild

**Date:** 2026-06-18
**Goal:** Rebuild the existing static HTML portfolio in Next.js, preserving the exact visual identity while elevating polish and adding a "showy" motion layer. Content is unchanged.

## Decisions (from brainstorming)

- **Aesthetic:** Elevate the current look — keep the dark terminal/filesystem identity, make it richer.
- **Motion:** Showy / animated.
- **Scope:** Rebuild + beautify only. No copy changes (one exception: wire the dead LinkedIn placeholder).
- **Stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion. Deploy target: Vercel.

## Design Tokens (ported exactly)

| Token | Value |
|-------|-------|
| bg / bg-2 / bg-3 | `#0d1117` / `#141a22` / `#1b232e` |
| line / line-soft | `#283341` / `#1e2630` |
| ink / muted / faint | `#e8eef5` / `#8a97a8` / `#5b6675` |
| amber / amber-soft | `#f4b860` / `#f4b86022` |
| teal / teal-soft | `#5ec8c2` / `#5ec8c21f` |
| display / body / mono | Space Grotesk / Inter / JetBrains Mono |
| maxw / radius | 1080px / 14px |

## Architecture

Single route (`/`). Section components composed in `app/page.tsx`. All copy lives in `lib/content.ts` as typed data so section components stay presentational.

```
app/layout.tsx          fonts (next/font), metadata/OG, body shell
app/page.tsx            composes sections in order
app/globals.css         Tailwind import + @theme tokens + base styles
components/Nav.tsx       sticky blur nav, mobile drawer, scroll-spy active link
components/Hero.tsx      animated headline, typed-cursor role, status pulse, parallax grid
components/About.tsx     bio + animated stat counters
components/Experience.tsx timeline
components/Projects.tsx   cards (flagship spans full width), tilt/hover
components/Skills.tsx     skill groups + chips
components/Contact.tsx    contact CTA box
components/Footer.tsx     footer
components/Reveal.tsx     shared whileInView stagger wrapper
lib/content.ts          all content as typed data
```

## Motion Layer

1. Hero — headline words stagger up on load; blinking cursor; pulsing status dot; structural grid mouse-parallax drift.
2. Stat counters — count up (4+, 2+, ~2,600, 99.5%) on scroll into view.
3. Scroll reveals — Framer Motion `whileInView` stagger per section (replaces IntersectionObserver).
4. Project cards — 3D tilt-on-hover + amber→teal top-rule draw + lift.
5. CTAs — subtle magnetic/glow hover; animated mobile drawer; sliding scroll-spy indicator in nav.
6. Hero backdrop — subtle aurora/gradient glow for depth, on-brand.

## Accessibility / Preservation

- All content unchanged.
- Full keyboard focus states (teal focus ring, preserved).
- Hard `prefers-reduced-motion` guard: Framer Motion `useReducedMotion` disables all animation; reveals render in place; counters show final value.
- Semantic sections + ARIA labels preserved from original.

## Open Item

- LinkedIn URL is currently a dead placeholder. Will be added to `content.ts` when provided; omitted from the contact list until then.

## Out of Scope

- Copy/structure rewrites, blog/CMS, multi-page routing, dark/light toggle (already dark-only).
