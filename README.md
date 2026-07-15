# Arun Mallikarjuna — Portfolio

An interactive 3D space-journey portfolio built with Next.js 16, React 19,
React Three Fiber, and Tailwind CSS v4. Scroll to fly a rocket past planets,
a station, skill cards, and an orbiting ring of projects before the finale.

## Run it
```bash
npm install
npm run dev      # http://localhost:3000
```

## Structure
- `src/lib/data.ts` — all content (profile, experience, skills, projects)
- `src/lib/journey.ts` — the scroll-driven flight (camera + rocket paths)
- `src/components/canvas/*` — the 3D scene
- `src/components/dom/*` — HTML overlays (nav, HUD, project modal)
- `src/app/globals.css` — `@theme` design tokens (amber + teal accents)
- `legacy/terminal-2025/` — the previous terminal-themed build, kept for reference

## Assets & Credits
The 3D experience and its scaffolding were adapted from an open portfolio by
Abhishek Badar (github.com/AbhishekBadar/portfolio). Reused assets:
- **Planet/star textures** — [Solar System Scope](https://www.solarsystemscope.com/textures/) (CC BY 4.0)
- **HDRI lighting** — "Dikhololo Night", [Poly Haven](https://polyhaven.com) (CC0)
- **3D models** (astronaut, spaceship) — [Quaternius](https://quaternius.com) (CC0)
- **ISS model** — [NASA 3D Resources](https://github.com/nasa/NASA-3D-Resources) (public domain)
- Rocket, nebula, rings, and HUD art are generated procedurally in code.
