# Space-Journey Portfolio Rebuild — Design

**Date:** 2026-07-16
**Owner:** Arun Mallikarjuna
**Status:** Draft for review

## Goal

Rebuild the portfolio as a scroll-driven 3D space journey — a rocket that
launches and flies past planets, a station, floating skill cards, an orbiting
ring of project cards, and rams into the sun at the finale. The concept and 3D
machinery come from `AbhishekBadar/portfolio` (internally "rocketwebsite"); all
content, identity, and accent theming are Arun's.

## Decisions (settled with the user)

1. **Base:** clone the reference codebase as scaffolding, swap in Arun's data,
   retheme. Do **not** rebuild the 3D engine.
2. **Visual identity:** hybrid — keep the deep-space backdrop, but the HUD /
   overlay accents become Arun's amber (`#f4b860`) + teal (`#5ec8c2`), overlays
   lean mono (JetBrains Mono).
3. **Journey:** 6 stops + the reference's ram-into-the-sun explosion finale.
4. **Case studies:** exactly as the reference does it — projects render through
   the reference `ProjectModal`; no bespoke long-form case-study views.
5. **Attribution:** keep the README "Assets & Credits" block. The reference
   *code* has no license; this is a personal-site clone by the owner's explicit
   choice, so the credits and honest asset attribution stay.

## Source & attribution

- Reference: https://github.com/AbhishekBadar/portfolio.git (Next 16, React 19,
  R3F + drei + postprocessing, zustand, Lenis, Tailwind v4).
- Reusable assets already in `public/` (~8.5 MB), all CC / public-domain per the
  reference README: planet/star textures (Solar System Scope, CC BY 4.0), HDRI
  (Poly Haven, CC0), GLB models — astronaut/spaceship (Quaternius, CC0), ISS
  (NASA, public domain). CC BY 4.0 requires attribution → keep the credits block.

## Architecture (inherited, unchanged)

- `src/app/page.tsx` — a tall scroll runway (`TOTAL_PAGES * 100vh`), a fixed
  `<Experience>` canvas behind everything, DOM overlays on top (Navbar,
  HeroOverlay, SectionOverlays, HUDRail, SocialRail, ProjectModal, ImpactFlash,
  CustomCursor, Loader).
- `src/lib/journey.ts` — single source of truth for the flight: section→scroll
  ranges, keyframed Catmull-Rom camera + rocket curves, landmark positions
  (about planet, station, skills center, projects planet+ring, contact sun),
  projects-orbit math, `impactProgress` finale ramp.
- `src/lib/scroll.ts` — Lenis smooth scroll + a `scrollState` global the R3F
  frame loop reads each frame.
- `src/lib/store.ts` — zustand UI store (`ready`, `selectedProject`, …).
- `src/components/canvas/*` — Experience (Canvas + postprocessing), CameraRig,
  Rocket, Planets, SpaceEnvironment, SkillCards, ProjectOrbit, SetDressing,
  SunImpact.
- `src/components/dom/*` — the overlays listed above + SeoContent.

We keep all of this. Changes are data, labels, theme tokens, and identity.

## Repo integration plan

- Work on a branch (`main` is clean; do not rebuild in place).
- Archive the current terminal site into `legacy/terminal-2025/` (repo already
  uses `legacy/`), excluded from the build.
- Adopt the reference's config wholesale: `package.json`, `tsconfig.json`
  (`@/` → `src/*`), `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`,
  `src/`, and the `public/` assets. This bumps Next 15→16 and adds
  postprocessing + zustand + `motion`.
- Bring in the reference `public/` assets; replace the résumé PDF with Arun's
  (`Arun-Mallikarjuna-Resume.pdf`) and the favicon/OG with Arun's.

## Content mapping — `src/lib/data.ts` (rewritten)

Rewrite the reference data module in place, keeping its exported shapes so no
consumer changes: `SITE_URL`, `PROFILE`, `EXPERIENCE`, `SKILLS`, `PROJECTS`,
`ARCHIVE_URL`.

- **SITE_URL** → Arun's deployed domain (placeholder `https://arunmallikarjun.com`
  until confirmed; `metadataBase` follows it).
- **PROFILE** ← Arun's `meta` + `hero` + `about` + `principles`:
  name, role "Full-Stack & AI Platform Engineer", Bengaluru, email, phone,
  résumé path, socials `{ github, linkedin }` (drop `medium`). `taglines`
  derived from his voice, e.g. "build the engines, not the screens.", "ship AI
  agents into real products.", "own architecture, reliability, and QA.",
  "configure it without code." `bio` / `about.{lead,p2,p3,credentials}` from
  `about.body` + `principles`.
- **EXPERIENCE** ← Arun's two Tecnotree roles (Senior SWE, SWE) → `{ company,
  title, range, location, blurb, points }`.
- **SKILLS** ← Arun's six groups map 1:1 to the six HUD modules
  (`{ num, name, items }`): 01 AI & Agents, 02 Languages & Frontend, 03 Backend
  & APIs, 04 Data & Infra, 05 Architecture & CS, 06 Auth · Security · QA;
  `items` = his arrays joined with " · ".
- **PROJECTS** ← Arun's five, mapped to the reference `Project` shape
  (`id, title, meta, tagline, description, tags, colorA, colorB, link,
  linkLabel?, featured?`). `points`/`stats` fold into `description`. Starting
  gradient pairs (tuned live):

  | id | title | meta | featured | link | colorA→colorB |
  |----|-------|------|----------|------|----------------|
  | folkgrove | Folkgrove — Multi-Tenant HRMS | 2025 · Flagship | ✔ | — | `#f4b860`→`#5ec8c2` |
  | tailorwright | Tailorwright — AI Agent Platform | Open source · AI | | github.com/MrArun005/resume-tailor | `#5ec8c2`→`#7c3aed` |
  | freeresumepro | Free Resume Pro | AI SaaS | | — | `#f4b860`→`#f0abfc` |
  | promotion-manager | Promotion Manager System | Platform | | — | `#4cc9f0`→`#5ec8c2` |
  | algo-visualizer | Algorithm Visualizer | Learning in public | | — | `#34a853`→`#f4b860` |

- **ARCHIVE_URL** → `https://github.com/MrArun005`.

## Journey structure — `src/lib/journey.ts`

Keep the tuned camera/rocket curves and the finale. Change only the section
labels/ids to Arun's voice; leave `range`s as-is unless an overlay needs
reframing during implementation.

`hero → launch → about (planet) → experience (station) → skills (HUD cards) →
projects (orbit) → contact (sun + ram-into-sun finale)`

Capabilities and Approach/principles are not separate beats — they fold into the
Hero and About overlay copy. Section display labels take his tone ("the lore",
"the grind", "the goods").

## ProjectModal — unchanged behavior

Renders gradient banner (colorA/colorB), "MISSION BRIEF", title, featured badge,
meta, tagline, description, tags, and the external link. Arun's projects fill
exactly these fields. No new detail surfaces are added. Accent classes
(`text-cyan`, `from-cyan to-nebula`) get retheme'd (see below).

## Theme — hybrid (`src/app/globals.css` + overlay components)

- Keep the deep-space base (`#02010a` / `#050310`) and fog.
- Retheme accents from the reference's cyan/nebula/pink to Arun's amber + teal.
  In the `@theme` block: `--color-cyan`/`--color-cyan-bright` → teal
  (`#5ec8c2` / `#7df0ea`), `--color-nebula`/`--color-nebula-soft` → amber
  (`#f4b860` / `#f7c88f`), `--color-hud` → a warm HUD blue-amber, keep `--color-pink`
  only where a third accent genuinely helps. Update `.glass`, `.hud-corners`,
  `::selection`, and the bloom/ChromaticAberration tint in `Experience.tsx`.
- Fonts already align (Space Grotesk / Inter / JetBrains Mono). Overlays lean
  mono for the terminal-in-space feel; keep Space Grotesk for large display type.
- Sweep overlay components for hardcoded `cyan/nebula/pink` utility usages and
  point them at the retheme'd tokens.

## Identity / SEO / metadata

Rewrite everything Abhishek-specific to Arun:

- `src/app/layout.tsx` — TITLE, DESCRIPTION, keywords, authors/creator/publisher,
  OpenGraph (name, username), Twitter creator, `themeColor`, and the full
  `jsonLd` @graph (Person: jobTitle, description, address = Bengaluru,
  worksFor = Tecnotree Convergence, alumniOf, knowsAbout from Arun's skills,
  sameAs = his socials; WebSite/ProfilePage/ItemList names).
- `src/components/dom/SeoContent.tsx` — the no-JS semantic text alternative →
  Arun's content.
- `src/app/{sitemap,robots,manifest}.ts`, `opengraph-image.tsx`,
  `twitter-image.tsx`, `src/lib/og.tsx` — names, URLs, generated OG art text.
- `public/llms.txt`, `public/llms-full.txt`, README → Arun (keep the Assets &
  Credits block).

## Out of scope

- Rebuilding any 3D/canvas code, camera choreography, or shaders from scratch.
- New 3D assets or textures.
- Bespoke long-form case-study views (superseded by `ProjectModal`).
- The current terminal-site components (archived to `legacy/`, not deleted).

## Verification

- `npm run build` is clean (Next 16 / React 19).
- `npm run dev`: scroll the entire runway top→bottom; confirm each overlay shows
  Arun's content, every project card opens the modal with correct fields, the
  résumé link resolves, skills HUD reads the six modules, and the sun-impact
  finale fires near the end.
- Per user preference: Arun eyeballs the visuals himself; no automated
  screenshot verification of styling.

## Open items

- **Deploy domain** for `SITE_URL` / `metadataBase` (placeholder used until
  confirmed).
- **OG image text** wording (draft during implementation, Arun tweaks).
- **Project gradient pairs** are starting values — tuned live against the scene.
