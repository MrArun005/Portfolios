# How the animation works

A field guide to the scroll-driven 3D journey — what drives it, and where to change it. Nothing here is time-based except a few idle flourishes; **everything is scrubbed by scroll position.**

## Big picture

```
page.tsx
 ├─ <div style="height: 1000vh" />      ← the "scroll runway" (empty, just creates scroll distance)
 ├─ <Experience />                       ← the 3D canvas, position:fixed, z-0, BEHIND everything
 └─ overlays (Navbar, HeroOverlay, …)    ← HTML, position:fixed, z-10, ON TOP
```

The page is `TOTAL_PAGES * 100vh` tall (see `TOTAL_PAGES` in `src/lib/journey.ts`, currently 10 → 1000vh) but nothing actually flows down the page. That tall empty div only exists to give you **scroll distance**. As you scroll, we compute a single number — **progress `p` ∈ [0,1]** — and *that* number poses the camera, flies the rocket, and fades the text. Scroll up and everything runs exactly backwards. This is "scrubbing," like dragging a video timeline.

## 1. The scroll engine — `src/lib/scroll.ts`

- **Lenis** gives buttery smooth-scroll (`initSmoothScroll()`, called once in `page.tsx`).
- A single rAF loop each frame computes `scrollState`, a plain mutable object (NOT React state — canvas reads it every frame without re-rendering):
  - `progress` — `scrollY / maxScroll`, clamped 0..1. The master dial.
  - `velocity` — how fast you're scrolling (low-passed). Feeds warp/thrust/shake.
  - `impact` — the finale ramp, eased in slow-mo (see §6).
- **`useScrollRaf((p, v) => …)`** — the hook DOM overlays use to animate on scroll. It calls your callback every frame with the current progress; you write styles imperatively (no re-render). This is how the text panels fade in/out.
- **`scrollToSection(id)`** — smooth-scrolls to a section (used by the nav).

## 2. The journey map — `src/lib/journey.ts` (the heart)

This one file is the single source of truth for the whole flight.

- **`SECTIONS`** — each section owns a slice of progress: `{ id, label, range: [start, end] }`. e.g. About lives in `p ∈ [0.19, 0.34]`.
- **`CAMERA_KEYS` / `ROCKET_KEYS`** — hand-authored keyframes. Each is `{ p, pos, tgt, fov }` (camera) or `{ p, pos }` (rocket): "at progress `p`, the camera is *here* looking *there* at *this* field-of-view." These are stitched into smooth **Catmull-Rom curves** (`THREE.CatmullRomCurve3`, centripetal) so motion between keys is continuous, not linear/robotic.
- **`sampleCamera(p, outPos, outTgt) → fov`** and **`sampleRocket(p, outPos, outQuat) → thrust`** — given progress, return the exact pose. The rocket's nose is blended from "standing vertical" on the pad to "pointing along its direction of travel" (derived from the curve's tangent), and it **banks into turns** from the curve's lateral curvature.
- **Landmarks** — fixed world positions everything anchors to: `ABOUT_PLANET`, `STATION`, `SKILLS_CENTER`, `PROJECTS_PLANET`, `CONTACT_SUN`, `IMPACT_POINT`.
- **Projects orbit** — during `p ∈ [0.63, 0.79]` the camera and rocket stop following the keyframe curve and instead **circle the projects planet** (`orbitTheta`, `projectsOrbitBlend`), so each project card sweeps past the camera in turn.
- **Finale** — `impactProgress(p)` ramps 0→1 over `p ∈ [0.88, 0.99]`; it drives the rocket disintegrating and the sun exploding.

## 3. Who reads the map — the canvas (`src/components/canvas/`)

Every canvas component runs a **`useFrame`** loop (React Three Fiber's per-frame hook). Each frame they read `scrollState.progress`, call the `sample*` functions, and set real Three.js transforms:

- **`CameraRig.tsx`** — the clearest example. Each frame: damp the raw progress (`THREE.MathUtils.damp`, so the camera *trails* the scrollbar slightly instead of snapping), call `sampleCamera`, add mouse-parallax + velocity-shake + the impact recoil/kick, then `camera.lookAt(target)`. ~85 lines — read this first to understand the pattern.
- **`Rocket.tsx`** — same idea for the rocket: `sampleRocket` → position + orientation + thrust (thrust scales the exhaust/glow).
- **`Planets`, `SkillCards`, `ProjectOrbit`, `SunImpact`, `SpaceEnvironment`, `SetDressing`** — static-position scene objects that react to `progress`/`impact` for reveals, orbiting, and the blast.

**Key idea:** the "animation" is a pure function of scroll. `pose = f(progress)`. Deterministic, reversible, no timelines to keep in sync.

## 4. The text overlays — `src/components/dom/`

- **`HeroOverlay.tsx`** — the intro (name, status, rotating tagline). Fades/lifts away over `p ∈ [0.02, 0.1]` via `useScrollRaf`. The rotating tagline is the one genuinely time-based bit: a `setInterval` + Framer Motion `AnimatePresence` cycling `PROFILE.taglines`.
- **`SectionOverlays.tsx`** — the About / Experience / Skills / Projects / Capabilities / Contact panels. Each panel has a ref and an **`envelope(p, a0, a1, b0, b1)`** call inside `useScrollRaf`: opacity ramps **in** over `[a0,a1]` and back **out** over `[b0,b1]`, with a small slide. That's why a panel appears only while you're in its scroll band and is gone otherwise. Entrance polish (stagger, the project modal) uses **Framer Motion** (`motion/react`).

## 5. Postprocessing & finale

- `Experience.tsx` wraps the scene in an `EffectComposer`: **Bloom** (glow), **ChromaticAberration** (lens fringing), **Vignette**.
- `ImpactPostSurge` spikes bloom + chroma at the moment of sun impact — the "the lens can't handle it" flash.
- The finale is **slow-mo on the way in, snappy on the way out**: `scrollState.impact` eases toward `impactProgress(progress)` with an asymmetric rate (`IMPACT_LAMBDA` ≈ 4s forward, `IMPACT_REVERSE_LAMBDA` fast rewind), so the blast unfolds cinematically even if you stop scrolling, but rewinds tight to the scrollbar.

## 6. Loading

`Experience.tsx` primes the GPU (`gl.compileAsync`) behind the `Loader` so shaders/textures are ready before the loader lifts; the heavy off-hero GLBs (ISS, astronaut, spaceship) stream in *after* first paint, then precompile, so scrolling to them never hitches.

---

## Cookbook — where to change things

| I want to… | Do this |
|---|---|
| **Retune the flight path** | Edit `CAMERA_KEYS` / `ROCKET_KEYS` in `journey.ts` — adjust a keyframe's `p` (when), `pos` (where the camera is), `tgt` (what it looks at), `fov` (zoom). |
| **Move/resize a planet or landmark** | Edit the landmark constant (`ABOUT_PLANET`, `PROJECTS_PLANET`, …) in `journey.ts`; the scene object + camera keys reference it. |
| **Change when a text panel appears** | Edit that panel's `envelope(p, …)` ranges in `SectionOverlays.tsx` (`useScrollRaf`). Match them to the section's `SECTIONS` range. |
| **Make the journey longer/shorter** | `TOTAL_PAGES` in `journey.ts`. More pages = more scroll per beat = slower, more cinematic. |
| **Add a new stop** | Add a `SECTIONS` entry + a landmark constant + camera/rocket keys around it, place a mesh in the canvas, add an overlay panel with a matching envelope. |
| **Change accent colors** | `@theme` tokens in `src/app/globals.css` (`--color-cyan` = teal, `--color-nebula` = amber). Recolors all `text-cyan` / `from-cyan to-nebula` usages at once. |
| **Change the finale timing/feel** | `impactProgress()` band + `IMPACT_LAMBDA` in `scroll.ts`; the blast visuals in `SunImpact.tsx`. |
| **Edit any content** | `src/lib/data.ts` — nothing about copy/projects/skills is hard-coded in components. |
| **Camera feels too laggy/twitchy** | The `THREE.MathUtils.damp(…, 3.2, dt)` factor in `CameraRig.tsx` — higher = snappier, lower = floatier. |

**Golden rule:** the flight is `pose = f(scroll)`. If motion looks wrong, it's almost always a keyframe in `journey.ts`, not the components.
