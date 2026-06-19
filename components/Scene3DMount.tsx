"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";

// WebGL is client-only + code-split.
const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

/** Fixed full-screen 3D world behind all content. Skipped under reduced motion. */
export function Scene3DMount() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <Scene3D />
    </div>
  );
}
